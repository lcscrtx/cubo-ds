import { useEffect, useMemo, useState } from "react";
import { Badge, Button, EmptyState, LoadingRegion, Pagination, SearchField, Skeleton, useToast } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

const SERVICOS = [
  "Cartão SUS", "Poda de árvore", "Matrícula escolar", "Iluminação pública", "Alvará de funcionamento", "Tapa-buraco",
  "Coleta de entulho", "Vacinação domiciliar", "Remédio em casa", "Limpeza de terreno", "Segunda via de IPTU", "Castração de animais",
  "Transporte escolar", "Cadastro único", "Feira livre", "Habite-se", "Certidão negativa", "Exame de imagem",
  "Cesta básica", "Ronda escolar", "Fiscalização de obra", "Troca de lâmpada", "Ouvidoria", "Denúncia sanitária",
];
const LISTA = SERVICOS.map((s, i) => ({ n: `2026-${String(1043 - i).padStart(6, "0")}`, servico: s }));

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="s-row">
      <Button onClick={() => toast.show({ tone: "success", title: "Solicitação enviada", description: "Protocolo 2026-001043.", action: { label: "Desfazer", onClick: () => toast.show({ tone: "info", title: "Envio desfeito" }) } })}>
        Enviar solicitação
      </Button>
      <Button variant="secondary" onClick={() => toast.show({ tone: "info", title: "Rascunho salvo", description: "Você pode continuar depois." })}>
        Salvar rascunho
      </Button>
      <Button variant="secondary" onClick={() => toast.show({ tone: "warning", title: "Sessão expira em 5 minutos", description: "Salve o que fez até agora." })}>
        Aviso de sessão
      </Button>
      <Button variant="ghost" onClick={() => toast.show({ tone: "danger", title: "Sem conexão", description: "O envio foi guardado e será feito quando a internet voltar." })}>
        Simular erro
      </Button>
    </div>
  );
}

function CardEsboco() {
  return (
    <div className="s-sk-card" aria-hidden="true">
      <div className="s-row" style={{ gap: 12, flexWrap: "nowrap" }}>
        <Skeleton circle width={40} height={40} />
        <div style={{ flex: 1 }}><Skeleton width="45%" height={14} /><div style={{ height: 8 }} /><Skeleton width="25%" height={12} /></div>
      </div>
      <div style={{ height: 14 }} />
      <Skeleton lines={3} />
    </div>
  );
}

function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <div className="s-stack" style={{ width: "100%" }}>
      <LoadingRegion loading={loading} label="Carregando a solicitação" loadedLabel="Solicitação carregada" fallback={<CardEsboco />}>
        <div className="s-sk-card">
          <div className="s-row" style={{ gap: 12 }}>
            <span className="s-avatar" aria-hidden="true">MG</span>
            <div><strong>Maria das Graças Lima</strong><div className="s-muted" style={{ fontSize: 13 }}>Protocolo 2026-001043</div></div>
          </div>
          <p className="s-card-p" style={{ marginTop: 14 }}>Pedido de Cartão SUS com documentos conferidos. Aguardando emissão pela Secretaria de Saúde, com previsão de 5 dias úteis.</p>
        </div>
      </LoadingRegion>
      <div><Button variant="secondary" onClick={() => setLoading(true)} disabled={loading}>Carregar de novo</Button></div>
    </div>
  );
}

/** Busca + paginação + vazio juntos, como numa lista de protocolos de verdade. */
function ListaDemo() {
  const [busca, setBusca] = useState("");
  const [page, setPage] = useState(1);
  const POR_PAGINA = 5;
  const achados = useMemo(() => LISTA.filter((p) => p.servico.toLowerCase().includes(busca.trim().toLowerCase()) || p.n.includes(busca.trim())), [busca]);
  const pageCount = Math.max(1, Math.ceil(achados.length / POR_PAGINA));
  const pagina = achados.slice((page - 1) * POR_PAGINA, page * POR_PAGINA);
  useEffect(() => setPage(1), [busca]);

  return (
    <div className="s-stack" style={{ width: "100%" }}>
      <SearchField
        label="Buscar protocolo"
        placeholder="Serviço ou número do protocolo"
        value={busca}
        onChange={setBusca}
        resultsText={busca ? (achados.length ? `${achados.length} ${achados.length === 1 ? "protocolo encontrado" : "protocolos encontrados"}` : "Nenhum protocolo encontrado") : ""}
      />
      {achados.length === 0 ? (
        <EmptyState
          kind="busca"
          headingLevel={3}
          title={`Nenhum protocolo com "${busca}"`}
          description="Confira se o nome do serviço está certo ou busque pelo número do protocolo."
          actions={<Button variant="secondary" onClick={() => setBusca("")}>Limpar busca</Button>}
        />
      ) : (
        <>
          <ul className="s-plist">
            {pagina.map((p) => (
              <li key={p.n}><span className="s-mono">{p.n}</span><span>{p.servico}</span><Badge tone="accent" icon="em-analise" animated={false}>Em análise</Badge></li>
            ))}
          </ul>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} totalItems={achados.length} pageSize={POR_PAGINA} itemLabel="protocolos" />
        </>
      )}
    </div>
  );
}

export const ONDA4: Record<string, Doc> = {
  toast: {
    eyebrow: "Componente",
    title: "Toast",
    criterios: ["1.4.1", "1.4.3", "2.1.1", "2.2.1", "2.4.7", "4.1.3"],
    lead: "Aviso rápido depois de uma ação: salvo, enviado, sem conexão. Aparece no canto, sem tirar o foco de onde a pessoa está.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`// Uma vez, em volta da aplicação:
<ToastProvider><App /></ToastProvider>

// Em qualquer componente:
const toast = useToast();
toast.show({
  tone: "success",
  title: "Solicitação enviada",
  description: "Protocolo 2026-001043.",
  action: { label: "Desfazer", onClick: desfazer },
});`}
          >
            <ToastDemo />
          </Example>
          <Note>O que é importante não pode ficar só no toast: ele some. Um envio com erro, por exemplo, também precisa de um Alert na página.</Note>
        </DocSection>
        <DocSection title="Tempo na tela">
          <ul className="s-list">
            <li>Some depois de 6 segundos. A barra embaixo mostra o tempo.</li>
            <li>Com o mouse ou o foco em cima, o tempo para: dá para ler com calma (WCAG 2.2.1).</li>
            <li>Erro nunca some sozinho: fica até a pessoa fechar.</li>
            <li>No máximo 3 na tela; o mais antigo sai primeiro.</li>
          </ul>
        </DocSection>
        <DocSection title="Props de toast.show">
          <PropsTable
            rows={[
              ["tone", `"info" | "success" | "warning" | "danger"`, "info", "Tipo; define o ícone."],
              ["title", "ReactNode", "", "Frase curta. Obrigatória."],
              ["description", "ReactNode", "", "Detalhe."],
              ["action", "{ label, onClick }", "", "Uma ação, como Desfazer."],
              ["duration", "number", "6000", "Tempo na tela em ms. Ignorado em erro."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Regiões de aviso já existem vazias na página: o leitor de tela anuncia cada toast que entra.</li>
            <li>Erro é anunciado com prioridade (<code>role="alert"</code>); os outros esperam a pessoa terminar o que está ouvindo.</li>
            <li>O foco não pula para o toast. Com Tab, dá para chegar na ação e no botão "Fechar aviso".</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  skeleton: {
    eyebrow: "Componente",
    title: "Skeleton",
    criterios: ["1.3.1", "2.2.2", "4.1.3"],
    lead: "Esboço cinza no lugar do conteúdo que está carregando. Com o LoadingRegion, o leitor de tela ouve \"Carregando…\" e depois \"Carregada\".",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<LoadingRegion
  loading={carregando}
  label="Carregando a solicitação"
  loadedLabel="Solicitação carregada"
  fallback={<><Skeleton circle width={40} height={40} /><Skeleton lines={3} /></>}
>
  <Solicitacao />
</LoadingRegion>`}
          >
            <LoadingDemo />
          </Example>
        </DocSection>
        <DocSection title="Formas">
          <Example code={`<Skeleton width="60%" height={20} />\n<Skeleton lines={3} />\n<Skeleton circle width={40} height={40} />`}>
            <div className="s-stack" style={{ width: "100%", maxWidth: 420 }}>
              <Skeleton width="60%" height={20} />
              <Skeleton lines={3} />
              <Skeleton circle width={40} height={40} />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["Skeleton · width / height", "number | string", "100% / 1 linha", "Tamanho. Número vira px."],
              ["Skeleton · lines", "number", "", "Várias linhas de texto."],
              ["Skeleton · circle", "boolean", "false", "Círculo, para avatar."],
              ["LoadingRegion · loading", "boolean", "", "Mostra o esboço ou o conteúdo."],
              ["LoadingRegion · label", "string", "", "Dito ao começar: \"Carregando protocolos\"."],
              ["LoadingRegion · loadedLabel", "string", "", "Dito ao terminar."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>As formas são decorativas (<code>aria-hidden</code>); quem informa é o texto do LoadingRegion.</li>
            <li><code>aria-busy</code> marca a área enquanto carrega.</li>
            <li>O brilho passa 3 vezes e para: menos de 5 segundos de movimento.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "empty-state": {
    eyebrow: "Componente",
    title: "EmptyState",
    criterios: ["1.1.1", "1.3.1", "2.4.6"],
    lead: "Quando não há nada para mostrar: diz por quê e qual é o próximo passo. Nunca deixe uma tela em branco.",
    body: () => (
      <>
        <DocSection title="Tipos">
          <Example
            code={`<EmptyState kind="vazio" title="Nenhuma solicitação ainda" description="…" actions={<Button>Nova solicitação</Button>} />
<EmptyState kind="busca" title='Nenhum protocolo com "lixo"' actions={<Button variant="secondary">Limpar busca</Button>} />
<EmptyState kind="erro" title="Não foi possível carregar" actions={<Button variant="secondary">Tentar de novo</Button>} />`}
          >
            <div className="s-cardgrid s-cardgrid--3">
              <EmptyState kind="vazio" headingLevel={3} title="Nenhuma solicitação ainda" description="Os pedidos que você fizer aparecem aqui, com a situação de cada um." actions={<Button>Nova solicitação</Button>} />
              <EmptyState kind="busca" headingLevel={3} title='Nenhum protocolo com "lixo"' description="Tente o nome do serviço, como coleta de entulho." actions={<Button variant="secondary">Limpar busca</Button>} />
              <EmptyState kind="erro" headingLevel={3} title="Não foi possível carregar" description="O sistema não respondeu. Seus dados estão salvos." actions={<Button variant="secondary">Tentar de novo</Button>} />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["kind", `"vazio" | "busca" | "erro"`, "vazio", "Muda o ícone."],
              ["title", "ReactNode", "", "O que aconteceu. Obrigatório."],
              ["description", "ReactNode", "", "Por quê, ou o que fazer."],
              ["actions", "ReactNode", "", "O próximo passo."],
              ["headingLevel", "2 | 3 | 4", "2", "Nível do título, para seguir a hierarquia da página."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>O título é um cabeçalho de verdade: quem navega por títulos acha a mensagem.</li>
            <li>O ícone é decorativo; o texto diz tudo.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  pagination: {
    eyebrow: "Componente",
    title: "Pagination",
    criterios: ["1.3.1", "1.4.1", "2.4.7", "2.5.5", "4.1.2", "4.1.3"],
    lead: "Navegação entre páginas de uma lista longa. Mostra quantos itens há; no celular, vira \"Página 3 de 12\" com anterior e próxima.",
    body: () => (
      <>
        <DocSection title="Busca, lista e paginação juntas">
          <p>Digite "escolar" ou "xyz" para ver a busca anunciar os resultados e o estado vazio aparecer.</p>
          <Example
            code={`<Pagination
  page={page}
  pageCount={5}
  onChange={setPage}
  totalItems={24}
  pageSize={5}
  itemLabel="protocolos"
/>`}
          >
            <ListaDemo />
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["page", "number", "", "Página atual, começando em 1."],
              ["pageCount", "number", "", "Total de páginas."],
              ["onChange", "(page) => void", "", "Chamado ao trocar de página."],
              ["totalItems / pageSize", "number", "", "Liga o resumo \"Mostrando 6 a 10 de 24\"."],
              ["itemLabel", "string", "itens", "O que é listado."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>nav</code> "Paginação"; cada número é lido como "Página 4", e a atual tem <code>aria-current="page"</code>.</li>
            <li>Página atual preenchida e com borda: não depende só de cor.</li>
            <li>A troca de página é anunciada; cada botão tem área de toque de 44px.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "search-field": {
    eyebrow: "Componente",
    title: "SearchField",
    criterios: ["1.3.1", "1.4.3", "1.4.11", "2.4.7", "3.3.2", "4.1.2", "4.1.3"],
    lead: "Campo de busca com lupa, botão de limpar e o número de resultados anunciado. Fica dentro de um formulário marcado como busca.",
    body: () => (
      <>
        <DocSection title="Variantes">
          <Example
            code={`<SearchField label="Buscar protocolo" placeholder="Serviço ou número" resultsText="12 protocolos encontrados" />
<SearchField label="Buscar na Carta de Serviços" hideLabel submitButton onSearch={buscar} />`}
          >
            <div className="s-stack" style={{ width: "100%", maxWidth: 480 }}>
              <SearchField label="Buscar protocolo" placeholder="Serviço ou número do protocolo" defaultValue="escolar" resultsText="2 protocolos encontrados" />
              <SearchField label="Buscar na Carta de Serviços" hideLabel submitButton placeholder="Buscar na Carta de Serviços" />
            </div>
          </Example>
          <Note>O exemplo completo, com lista, vazio e paginação, está na página do Pagination.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Rótulo. Obrigatório."],
              ["hideLabel", "boolean", "false", "Esconde o rótulo da tela; o leitor de tela continua lendo."],
              ["value / onChange", "string / (v) => void", "", "Busca enquanto digita."],
              ["onSearch", "(v) => void", "", "Enter, botão Buscar ou Limpar."],
              ["resultsText", "string", "", "Resultado, anunciado sem mover o foco."],
              ["submitButton", "boolean", "false", "Mostra o botão Buscar."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>form role="search"</code>: leitores de tela listam a busca entre as regiões da página.</li>
            <li>O botão de limpar tem nome ("Limpar busca") e devolve o foco ao campo.</li>
            <li>O número de resultados é anunciado enquanto a pessoa digita, sem tirar o foco do campo.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
