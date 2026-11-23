// Assistente de compreensão (protótipo, degrau 1). Mora na barra de acessibilidade do topo:
// "Explicar a página" e "Simplificar o texto". Lê o conteúdo principal da página aberta (o <main>),
// sem os dados digitados, manda para /api/assistente e mostra a resposta num painel lateral.
// Como depende só da barra e do <main>, serve para site, CRM ou backoffice.
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Alert, Button, Drawer, LoadingRegion, Skeleton } from "@cubo-tecnologia/hexagon";
import { lerTela, type TelaLida } from "./lerTela";
import type { Acao, RespostaAssistente } from "./respostas";
import { DEMO_EXPLICAR, DEMO_SIMPLIFICAR } from "./demo";

const TITULO: Record<Acao, string> = { explicar: "O que é esta página", simplificar: "Texto em linguagem simples" };

type Estado =
  | { fase: "fechado" }
  | { fase: "carregando"; acao: Acao; tela: TelaLida }
  | { fase: "pronto"; resposta: RespostaAssistente; tela: TelaLida }
  | { fase: "sem-demo"; acao: Acao; tela: TelaLida }
  | { fase: "erro"; acao: Acao; tela: TelaLida; mensagem: string };

const ERROS: Record<string, string> = {
  limite: "Muitas pessoas pediram ajuda agora. Tente de novo em um minuto.",
  "chave-invalida": "A chave da API configurada no servidor não foi aceita.",
};

class SemDemo extends Error {}

async function pedir(acao: Acao, tela: TelaLida): Promise<RespostaAssistente> {
  const r = await fetch("/api/assistente", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ acao, tela }) });
  const corpo = await r.json().catch(() => ({}));
  if (r.ok) return corpo as RespostaAssistente;
  if (corpo.erro === "sem-chave") {
    // Sem chave no servidor: só a página de exemplo tem resposta pronta, marcada como demonstração.
    if (!/Cartão SUS/.test(tela.titulo)) throw new SemDemo();
    return acao === "explicar" ? { acao, dados: DEMO_EXPLICAR, demo: true } : { acao, dados: DEMO_SIMPLIFICAR, demo: true };
  }
  throw new Error(ERROS[corpo.erro] ?? "Não foi possível ajudar agora. Tente de novo.");
}

const IconeExplicar = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6" /><path d="M6.3 6.2a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3M8 11.3v.01" /></svg>
);
const IconeSimplificar = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M2.5 4h11M2.5 8h8M2.5 12h5" /></svg>
);

/** Os botões do assistente, para colocar dentro da AccessibilityBar. */
export function AssistenteBotoes() {
  const [estado, setEstado] = useState<Estado>({ fase: "fechado" });
  const pedidoAtual = useRef(0);

  const abrir = async (acao: Acao) => {
    const alvo = document.querySelector<HTMLElement>("main") ?? document.body;
    const tela = lerTela(alvo);
    const id = ++pedidoAtual.current;
    setEstado({ fase: "carregando", acao, tela });
    try {
      const resposta = await pedir(acao, tela);
      if (id === pedidoAtual.current) setEstado({ fase: "pronto", resposta, tela });
    } catch (e) {
      if (id !== pedidoAtual.current) return;
      if (e instanceof SemDemo) setEstado({ fase: "sem-demo", acao, tela });
      else setEstado({ fase: "erro", acao, tela, mensagem: e instanceof Error ? e.message : String(e) });
    }
  };

  const fechar = () => {
    pedidoAtual.current++;
    setEstado({ fase: "fechado" });
  };
  const acao = estado.fase === "fechado" ? "explicar" : estado.fase === "pronto" ? estado.resposta.acao : estado.acao;

  return (
    <>
      <button type="button" className="hx-a11ybar__toggle" onClick={() => abrir("explicar")}>
        <IconeExplicar />
        Explicar a página
      </button>
      <button type="button" className="hx-a11ybar__toggle" onClick={() => abrir("simplificar")}>
        <IconeSimplificar />
        Simplificar o texto
      </button>

      {/* O painel sai da barra (portal), para os estilos dos botões da barra não pegarem nele.
          Vai para dentro do .s-app, que é o .hx-root do site. */}
      {createPortal(
      <Drawer
        open={estado.fase !== "fechado"}
        onClose={fechar}
        title={TITULO[acao]}
        description="Feito a partir do que está escrito nesta página."
        className="a-drawer"
        actions={
          <>
            {acao === "explicar" ? (
              <Button variant="secondary" onClick={() => abrir("simplificar")}>Simplificar o texto</Button>
            ) : (
              <Button variant="secondary" onClick={() => abrir("explicar")}>Explicar a página</Button>
            )}
            <Button onClick={fechar}>Fechar</Button>
          </>
        }
      >
        <LoadingRegion loading={estado.fase === "carregando"} label="Lendo a página…" loadedLabel="Pronto." fallback={<Skeleton lines={6} />}>
          {estado.fase === "erro" && <Alert tone="danger" title="Não deu certo">{estado.mensagem}</Alert>}
          {estado.fase === "sem-demo" && (
            <Alert tone="info" title="Modo demonstração">
              Sem a chave da API no servidor, só a página de exemplo tem resposta pronta.{" "}
              <Link to="/lab/assistente" onClick={fechar}>Abrir a página do Cartão SUS</Link>
            </Alert>
          )}
          {estado.fase === "pronto" && <Resultado r={estado.resposta} />}
        </LoadingRegion>
        {(estado.fase === "pronto" || estado.fase === "erro" || estado.fase === "sem-demo") && <OQueFoiLido tela={estado.tela} />}
      </Drawer>,
      document.querySelector(".s-app") ?? document.body,
      )}
    </>
  );
}

function Resultado({ r }: { r: RespostaAssistente }) {
  return (
    <div className="a-res">
      {r.demo && (
        <Alert tone="info" title="Modo demonstração">
          Resposta de exemplo, escrita à mão. Com a chave da API no servidor, quem responde é o Claude lendo a tela.
        </Alert>
      )}
      {r.acao === "explicar" ? (
        <>
          <p className="a-res__lead">{r.dados.resumo}</p>
          <Lista titulo="O que você vai fazer" itens={r.dados.passos} ordenada />
          <Lista titulo="Tenha em mãos" itens={r.dados.precisaTer} />
          <Lista titulo="Fique atento" itens={r.dados.atencao} />
          <Lista titulo="A página não diz (pergunte ao atendimento)" itens={r.dados.naoInforma} />
        </>
      ) : (
        r.dados.secoes.map((s) => (
          <section key={s.titulo} className="a-res__sec">
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
          </section>
        ))
      )}
    </div>
  );
}

function Lista({ titulo, itens, ordenada }: { titulo: string; itens: string[]; ordenada?: boolean }) {
  if (!itens.length) return null;
  const Tag = ordenada ? "ol" : "ul";
  return (
    <section className="a-res__sec">
      <h3>{titulo}</h3>
      <Tag>{itens.map((i) => <li key={i}>{i}</li>)}</Tag>
    </section>
  );
}

/** Transparência: mostra exatamente o que foi enviado. Sem nada do que a pessoa digitou. */
function OQueFoiLido({ tela }: { tela: TelaLida }) {
  return (
    <details className="a-lido">
      <summary>O que o assistente leu desta página</summary>
      <p>Só a estrutura e os textos da página. O que você digitou nos campos não é enviado.</p>
      <pre>{JSON.stringify(tela, null, 2)}</pre>
    </details>
  );
}
