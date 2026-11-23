import { useState } from "react";
import { Accordion, Button, FileUpload, IconButton, Stepper, Switch, Tooltip } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

const ETAPAS = [{ label: "Seus dados" }, { label: "Endereço" }, { label: "Documentos" }, { label: "Revisão" }];

function StepperDemo() {
  const [etapa, setEtapa] = useState(3);
  return (
    <div className="s-stack" style={{ width: "100%" }}>
      <Stepper steps={ETAPAS} current={etapa} onStepClick={setEtapa} />
      <div className="s-row">
        <Button variant="secondary" disabled={etapa === 1} onClick={() => setEtapa((e) => e - 1)}>Voltar</Button>
        <Button disabled={etapa === ETAPAS.length} onClick={() => setEtapa((e) => e + 1)}>Continuar</Button>
      </div>
    </div>
  );
}

function SwitchDemo() {
  const [whats, setWhats] = useState(true);
  return (
    <div className="s-stack" style={{ width: "100%", maxWidth: 520, gap: 4 }}>
      <Switch label="Avisos por WhatsApp" hint="Mudanças na situação dos seus pedidos." checked={whats} onChange={setWhats} />
      <Switch label="Avisos por e-mail" defaultChecked />
      <Switch label="Lembrete de consultas" hint="Um dia antes, às 9h." />
      <Switch label="Atendimento em Libras" hint="Disponível só no atendimento por vídeo." disabled />
    </div>
  );
}

const Icon = {
  print: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M5.5 7.5V3h9v4.5M5.5 14.5h-2v-7h13v7h-2M5.5 11.5h9V17h-9z" /></svg>,
  download: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10M6 9l4 4 4-4M4 16h12" /></svg>,
  share: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="14.5" cy="5" r="2" /><circle cx="5.5" cy="10" r="2" /><circle cx="14.5" cy="15" r="2" /><path d="M7.3 9l5.4-3M7.3 11l5.4 3" /></svg>,
  trash: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h12M8 6V4h4v2M5.5 6l.8 10h7.4l.8-10M8.5 9v4.5M11.5 9v4.5" /></svg>,
  help: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="7" /><path d="M8 8a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2v.5M10 14v.01" /></svg>,
};

export const ONDA5: Record<string, Doc> = {
  accordion: {
    eyebrow: "Componente",
    title: "Accordion",
    criterios: ["1.3.1", "2.1.1", "2.4.7", "4.1.2"],
    lead: "Perguntas e respostas que abrem e fecham, como as dúvidas da Carta de Serviços. Usa <details> nativo.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Accordion
  exclusive
  items={[
    { id: "prazo", title: "Em quanto tempo o Cartão SUS fica pronto?", content: <p>…</p>, defaultOpen: true },
    { id: "docs", title: "Quais documentos preciso enviar?", content: <ul>…</ul> },
    { id: "quem", title: "Quem pode pedir para outra pessoa?", content: <p>…</p> },
  ]}
/>`}
          >
            <div style={{ width: "100%" }}>
              <Accordion
                exclusive
                items={[
                  { id: "prazo", defaultOpen: true, title: "Em quanto tempo o Cartão SUS fica pronto?", content: <p>Em até 5 dias úteis depois que os documentos forem conferidos. Você recebe um aviso quando o cartão estiver disponível no aplicativo.</p> },
                  { id: "docs", title: "Quais documentos preciso enviar?", content: <ul><li>Documento com foto (RG ou CNH)</li><li>CPF</li><li>Comprovante de residência dos últimos 3 meses</li></ul> },
                  { id: "quem", title: "Posso pedir para outra pessoa?", content: <p>Sim, para filhos menores de idade ou pessoas sob sua responsabilidade legal. Envie também o documento que comprova a responsabilidade.</p> },
                ]}
              />
            </div>
          </Example>
          <Note>Com <code>exclusive</code>, abrir um item fecha o outro. Sem ele, cada item abre sozinho, o que é melhor para quem quer comparar respostas.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["items", "{ id, title, content, defaultOpen? }[]", "", "Os itens."],
              ["exclusive", "boolean", "false", "Só um aberto por vez."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>details</code> e <code>summary</code> nativos: Enter e Espaço abrem, o leitor de tela diz "expandido" ou "recolhido".</li>
            <li>A busca do navegador (Ctrl+F) acha texto dentro dos itens fechados e os abre.</li>
            <li>Cada pergunta tem 44px de altura para o toque.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  stepper: {
    eyebrow: "Componente",
    title: "Stepper",
    criterios: ["1.3.1", "1.4.1", "2.4.8", "4.1.2"],
    lead: "Mostra em que etapa de um formulário longo a pessoa está e quanto falta. No celular, vira \"Etapa 3 de 4\" com uma barra.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<Stepper
  steps={[{ label: "Seus dados" }, { label: "Endereço" }, { label: "Documentos" }, { label: "Revisão" }]}
  current={3}
  onStepClick={irPara}
/>`}
          >
            <StepperDemo />
          </Example>
          <Note>Divida em etapas só formulários longos. Cada etapa deve caber numa tela e ter um nome que diga o que vai ser pedido.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["steps", "{ label }[]", "", "As etapas, em ordem."],
              ["current", "number", "", "Etapa atual, começando em 1."],
              ["onStepClick", "(step) => void", "", "Deixa voltar a etapas concluídas."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Lista ordenada com a etapa atual marcada por <code>aria-current="step"</code>.</li>
            <li>Etapas concluídas são lidas como "Seus dados, concluída"; as próximas, como "a fazer".</li>
            <li>Três estados com formas diferentes: preenchida com check, anel grosso e contorno. Não depende só da cor.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "file-upload": {
    eyebrow: "Componente",
    title: "FileUpload",
    criterios: ["1.3.1", "2.1.1", "2.5.7", "3.3.1", "3.3.3", "4.1.2", "4.1.3"],
    lead: "Anexar documentos ao pedido. Botão para escolher e área para arrastar; cada arquivo pode ser removido, e os problemas são explicados.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <p>Escolha ou arraste um arquivo. Tente um maior que 2 MB, ou que não seja PDF nem imagem, para ver o erro.</p>
          <Example
            code={`<FileUpload
  label="Comprovante de residência"
  required
  hint="PDF ou foto, até 2 MB. Conta de luz, água ou telefone dos últimos 3 meses."
  accept=".pdf,image/*"
  maxSizeMB={2}
  multiple
  onChange={setArquivos}
/>`}
          >
            <div style={{ width: "100%", maxWidth: 560 }}>
              <FileUpload
                label="Comprovante de residência"
                required
                hint="PDF ou foto, até 2 MB. Conta de luz, água ou telefone dos últimos 3 meses."
                accept=".pdf,image/*"
                maxSizeMB={2}
                multiple
              />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Nome do documento. Obrigatório."],
              ["hint", "ReactNode", "", "Formatos e tamanho, em palavras."],
              ["accept", "string", "", "Tipos aceitos: \".pdf,image/*\"."],
              ["maxSizeMB", "number", "", "Tamanho máximo de cada arquivo."],
              ["multiple", "boolean", "false", "Mais de um arquivo."],
              ["required, error", "", "", "Como nos outros campos."],
              ["onChange", "(files: File[]) => void", "", "Arquivos aceitos."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Arrastar é opcional: o mesmo pode ser feito pelo botão, com teclado ou toque (WCAG 2.5.7).</li>
            <li>Cada arquivo adicionado, removido ou recusado é anunciado ("comprovante.pdf adicionado").</li>
            <li>O erro diz o arquivo e o motivo: "conta.pdf: maior que 2 MB (3,4 MB)".</li>
            <li>O botão de remover diz qual arquivo remove ("Remover conta.pdf"); depois, o foco volta para o campo.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  switch: {
    eyebrow: "Componente",
    title: "Switch",
    criterios: ["1.4.1", "1.4.11", "2.4.7", "2.5.8", "4.1.2"],
    lead: "Liga e desliga uma configuração que vale na hora, sem botão de salvar. O estado aparece escrito: \"Ligado\" ou \"Desligado\".",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example code={`<Switch label="Avisos por WhatsApp" hint="Mudanças na situação dos seus pedidos." checked={ligado} onChange={setLigado} />`}>
            <SwitchDemo />
          </Example>
          <Note>Switch é para efeito imediato. Se a escolha só vale depois de enviar um formulário, use Checkbox.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "O que liga. Obrigatório."],
              ["hint", "ReactNode", "", "Explicação."],
              ["checked / defaultChecked", "boolean", "", "Estado."],
              ["onChange", "(checked) => void", "", "Chamado ao trocar."],
              ["onText / offText", "string", `"Ligado" / "Desligado"`, "Textos do estado."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>input</code> com <code>role="switch"</code>: o leitor de tela diz "ligado" ou "desligado".</li>
            <li>Ligado tem quatro pistas: texto, posição da bolinha, check e cor.</li>
            <li>A linha toda, com o texto, recebe o clique.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "icon-button": {
    eyebrow: "Componente",
    title: "IconButton e Tooltip",
    criterios: ["1.1.1", "1.4.13", "2.1.1", "2.4.7", "2.5.3", "2.5.5", "4.1.2"],
    lead: "Botão só de ícone, sempre com nome. O nome aparece como dica no hover e no foco do teclado, e é o que o leitor de tela fala.",
    body: () => (
      <>
        <DocSection title="IconButton">
          <Example
            code={`<IconButton label="Imprimir protocolo" icon={<IconeImprimir />} />
<IconButton label="Baixar PDF" icon={<IconeBaixar />} variant="secondary" />
<IconButton label="Excluir rascunho" icon={<IconeLixeira />} />`}
          >
            <div className="s-row">
              <IconButton label="Imprimir protocolo" icon={Icon.print} />
              <IconButton label="Baixar PDF" icon={Icon.download} />
              <IconButton label="Compartilhar" icon={Icon.share} />
              <IconButton label="Excluir rascunho" icon={Icon.trash} variant="secondary" />
              <IconButton label="Sem permissão para excluir" icon={Icon.trash} variant="secondary" disabled />
            </div>
          </Example>
          <Note>Use ícone sozinho só para ações muito conhecidas (imprimir, baixar). Para o resto, um Button com texto é mais claro para todo mundo.</Note>
        </DocSection>
        <DocSection title="Tooltip em outros elementos">
          <Example code={`<Tooltip content="O número que aparece no comprovante de envio.">\n  <button>O que é o protocolo?</button>\n</Tooltip>`}>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              Número do protocolo
              <Tooltip content="O número que aparece no comprovante e no e-mail de confirmação.">
                <button type="button" className="hx-iconbutton hx-iconbutton--ghost" aria-label="O que é o protocolo?">
                  <span className="hx-iconbutton__icon" aria-hidden="true">{Icon.help}</span>
                </button>
              </Tooltip>
            </p>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["IconButton · label", "string", "", "Nome do botão e texto da dica. Obrigatório."],
              ["IconButton · icon", "ReactNode", "", "Ícone de 16 a 20px."],
              ["IconButton · variant", `"ghost" | "secondary"`, "ghost", "Sem borda ou com borda."],
              ["Tooltip · content", "ReactNode", "", "Texto curto. Nada clicável dentro."],
              ["Tooltip · as", `"description" | "label"`, "description", "Complementa o nome, ou é o nome."],
              ["side", `"top" | "bottom"`, "top", "Lado da dica."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>IconButton não existe sem <code>label</code>: nenhum botão fica mudo para o leitor de tela.</li>
            <li>A dica abre no hover e no foco do teclado; Esc fecha; dá para passar o mouse por cima dela sem que suma (WCAG 1.4.13).</li>
            <li>Área de toque de 44px, mesmo com o botão de 36px.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
