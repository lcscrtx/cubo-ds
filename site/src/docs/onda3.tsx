import { useState } from "react";
import { Badge, Breadcrumb, Button, Dialog, Link, Table, Tabs, TextField, type TableColumn } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

type Protocolo = { n: string; servico: string; sec: string; dias: number; status: "analise" | "aguardando" | "concluido" };

const PROTOCOLOS: Protocolo[] = [
  { n: "2026-001043", servico: "Cartão SUS", sec: "Saúde", dias: 2, status: "analise" },
  { n: "2026-001042", servico: "Poda de árvore", sec: "Meio Ambiente", dias: 9, status: "concluido" },
  { n: "2026-001041", servico: "Matrícula escolar", sec: "Educação", dias: 5, status: "aguardando" },
  { n: "2026-001040", servico: "Iluminação pública", sec: "Infraestrutura", dias: 14, status: "concluido" },
  { n: "2026-001039", servico: "Alvará de funcionamento", sec: "Fazenda", dias: 21, status: "analise" },
];

const STATUS = {
  analise: <Badge tone="accent" icon="em-analise" animated={false}>Em análise</Badge>,
  aguardando: <Badge tone="warning" icon="aguardando" animated={false}>Aguardando documento</Badge>,
  concluido: <Badge tone="success" icon="concluido" animated={false}>Concluído</Badge>,
};

const COLUNAS: TableColumn<Protocolo>[] = [
  { key: "n", header: "Protocolo", rowHeader: true, sortValue: (r) => r.n },
  { key: "servico", header: "Serviço", sortValue: (r) => r.servico },
  { key: "sec", header: "Secretaria", sortValue: (r) => r.sec },
  { key: "dias", header: "Dias em aberto", align: "end", sortValue: (r) => r.dias, render: (r) => `${r.dias} ${r.dias === 1 ? "dia" : "dias"}` },
  { key: "status", header: "Situação", render: (r) => STATUS[r.status] },
];

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Cancelar solicitação</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Cancelar a solicitação 2026-001043?"
        description="O pedido de Cartão SUS sai da fila da Secretaria de Saúde. Para pedir de novo, será preciso começar do zero."
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Manter solicitação</Button>
            <Button onClick={() => setOpen(false)}>Cancelar solicitação</Button>
          </>
        }
      >
        <TextField label="Motivo do cancelamento" hint="Opcional. Ajuda a secretaria a melhorar o atendimento." />
      </Dialog>
    </>
  );
}

export const ONDA3: Record<string, Doc> = {
  link: {
    eyebrow: "Componente",
    title: "Link",
    criterios: ["1.4.1", "1.4.3", "2.4.4", "2.4.7", "3.2.5"],
    lead: "Leva a outra página ou lugar. Sempre sublinhado, para não depender da cor. O link externo avisa que abre em nova aba.",
    body: () => (
      <>
        <DocSection title="Variantes">
          <Example
            code={`<p>Veja a <Link href="/carta">Carta de Serviços</Link> para saber os prazos.</p>
<Link href="https://www.gov.br" external>Portal gov.br</Link>
<Link href="/protocolos" standalone>Ver todos os protocolos</Link>`}
          >
            <div className="s-stack" style={{ gap: 14 }}>
              <p style={{ margin: 0 }}>Veja a <Link href="#">Carta de Serviços</Link> para saber os prazos de cada pedido.</p>
              <p style={{ margin: 0 }}>Para emitir o documento, entre no <Link href="https://www.gov.br" external>portal gov.br</Link>.</p>
              <Link href="#" standalone>Ver todos os protocolos</Link>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["href", "string", "", "Destino."],
              ["external", "boolean", "false", "Abre em nova aba, com ícone e aviso para o leitor de tela."],
              ["standalone", "boolean", "false", "Link solto, com seta. Fora de parágrafos."],
            ]}
          />
          <Note>Com React Router ou Next, use o link do roteador com a classe <code>hx-link</code>: o visual e o foco são os mesmos.</Note>
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Sublinhado sempre; no hover, o traço engrossa.</li>
            <li>Link externo: o leitor de tela diz "portal gov.br (abre em nova aba)". Ninguém é levado para outra aba sem saber.</li>
            <li>O texto do link diz para onde vai. Evite "clique aqui" e "saiba mais" sozinhos.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  breadcrumb: {
    eyebrow: "Componente",
    title: "Breadcrumb",
    criterios: ["1.3.1", "2.4.4", "2.4.8", "4.1.2"],
    lead: "Mostra onde a pessoa está e o caminho de volta. No celular, vira um único link \"Voltar para\".",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Breadcrumb
  items={[
    { label: "Início", href: "/" },
    { label: "Saúde", href: "/saude" },
    { label: "Cartão SUS", href: "/saude/cartao-sus" },
    { label: "Solicitação 2026-001043" },
  ]}
/>`}
          >
            <Breadcrumb
              items={[
                { label: "Início", href: "#" },
                { label: "Saúde", href: "#" },
                { label: "Cartão SUS", href: "#" },
                { label: "Solicitação 2026-001043" },
              ]}
            />
          </Example>
          <Note>Em telas de até 600px, a trilha some e fica só "Voltar para Cartão SUS". Teste no celular.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["items", "{ label, href? }[]", "", "Do início até a página atual. O último fica sem href."],
              ["renderLink", "({ href, className, children }) => ReactNode", "", "Para usar o link do roteador."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>nav</code> com o nome "Você está aqui" e lista ordenada: o leitor de tela diz quantos níveis há.</li>
            <li>A página atual tem <code>aria-current="page"</code>; as setas entre os itens são decorativas.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  tabs: {
    eyebrow: "Componente",
    title: "Tabs",
    criterios: ["1.3.1", "1.4.1", "2.1.1", "2.4.3", "2.4.7", "4.1.2"],
    lead: "Separa conteúdos do mesmo nível sem trocar de página: situações de um protocolo, abas de um cadastro.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Tabs
  label="Situação dos protocolos"
  items={[
    { id: "abertos", label: "Abertos", count: 12, content: <ListaAbertos /> },
    { id: "aguardando", label: "Aguardando cidadão", count: 3, content: … },
    { id: "concluidos", label: "Concluídos", count: 248, content: … },
    { id: "arquivados", label: "Arquivados", disabled: true, content: null },
  ]}
/>`}
          >
            <div style={{ width: "100%" }}>
              <Tabs
                label="Situação dos protocolos"
                items={[
                  { id: "abertos", label: "Abertos", count: 12, content: <p className="s-card-p">12 protocolos esperando análise. O mais antigo está há 21 dias.</p> },
                  { id: "aguardando", label: "Aguardando cidadão", count: 3, content: <p className="s-card-p">3 protocolos esperando um documento do cidadão.</p> },
                  { id: "concluidos", label: "Concluídos", count: 248, content: <p className="s-card-p">248 protocolos concluídos este mês.</p> },
                  { id: "arquivados", label: "Arquivados", disabled: true, content: null },
                ]}
              />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Teclado">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Tecla</th><th>O que faz</th></tr></thead>
              <tbody>
                <tr><td><code>Tab</code></td><td>Entra na aba ativa; o próximo Tab vai para o conteúdo.</td></tr>
                <tr><td><code>→</code> <code>←</code></td><td>Próxima e anterior aba, já mostrando o conteúdo.</td></tr>
                <tr><td><code>Home</code> <code>End</code></td><td>Primeira e última aba.</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "string", "", "Nome do conjunto de abas. Obrigatório."],
              ["items", "{ id, label, count?, content, disabled? }[]", "", "As abas."],
              ["value / defaultValue", "string", "", "Aba ativa (controlada ou não)."],
              ["onChange", "(id: string) => void", "", "Chamado ao trocar de aba."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Padrão de abas da WAI-ARIA: <code>tablist</code>, <code>tab</code> e <code>tabpanel</code> ligados entre si.</li>
            <li>Aba ativa com texto forte e barra de 2px: não depende só de cor.</li>
            <li>Muitas abas não quebram a tela: a lista rola de lado.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  dialog: {
    eyebrow: "Componente",
    title: "Dialog",
    criterios: ["1.3.1", "2.1.1", "2.1.2", "2.4.3", "2.4.7", "4.1.2"],
    lead: "Janela que pede uma decisão antes de seguir: confirmar um cancelamento, preencher um dado rápido. Usa o <dialog> nativo do navegador.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Cancelar a solicitação 2026-001043?"
  description="O pedido sai da fila. Para pedir de novo, será preciso começar do zero."
  actions={
    <>
      <Button variant="secondary" onClick={fechar}>Manter solicitação</Button>
      <Button onClick={cancelar}>Cancelar solicitação</Button>
    </>
  }
>
  <TextField label="Motivo do cancelamento" hint="Opcional." />
</Dialog>`}
          >
            <DialogDemo />
          </Example>
          <Note>Os botões dizem a ação ("Manter solicitação", "Cancelar solicitação"), nunca só "Sim" e "Não". No celular, a janela vira uma folha presa embaixo.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["open", "boolean", "", "Aberta ou fechada."],
              ["onClose", "() => void", "", "Botão Fechar, Esc ou clique fora."],
              ["title", "ReactNode", "", "Título; vira o nome da janela."],
              ["description", "ReactNode", "", "Frase de apoio, lida ao abrir."],
              ["actions", "ReactNode", "", "Botões do rodapé. Principal por último."],
              ["closeOnBackdrop", "boolean", "true", "false impede fechar clicando fora."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>O navegador prende o foco dentro da janela e deixa o fundo inerte: ninguém se perde atrás dela.</li>
            <li>Esc fecha; o foco volta para o botão que abriu.</li>
            <li>Ao abrir, o leitor de tela lê o título e a descrição.</li>
            <li>O botão Fechar tem nome ("Fechar") e área de toque de 44px.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  table: {
    eyebrow: "Componente",
    title: "Table",
    criterios: ["1.3.1", "1.3.2", "1.4.10", "2.1.1", "2.4.7", "4.1.2", "4.1.3"],
    lead: "Tabela de dados para o dia a dia do servidor: protocolos, pedidos, cadastros. Com legenda, cabeçalhos ligados às células e ordenação anunciada.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            pad={false}
            code={`const colunas: TableColumn<Protocolo>[] = [
  { key: "n", header: "Protocolo", rowHeader: true, sortValue: (r) => r.n },
  { key: "servico", header: "Serviço", sortValue: (r) => r.servico },
  { key: "sec", header: "Secretaria", sortValue: (r) => r.sec },
  { key: "dias", header: "Dias em aberto", align: "end", sortValue: (r) => r.dias },
  { key: "status", header: "Situação", render: (r) => <Badge …>…</Badge> },
];

<Table caption="Protocolos da semana" columns={colunas} rows={protocolos} rowKey={(r) => r.n} />`}
          >
            <Table caption="Protocolos da semana" columns={COLUNAS} rows={PROTOCOLOS} rowKey={(r) => r.n} />
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["caption", "ReactNode", "", "O que a tabela mostra. Obrigatória."],
              ["hideCaption", "boolean", "false", "Esconde a legenda da tela; o leitor de tela continua lendo."],
              ["columns", "{ key, header, render?, sortValue?, align?, rowHeader? }[]", "", "Colunas. sortValue torna a coluna ordenável."],
              ["rows", "Row[]", "", "Linhas."],
              ["rowKey", "(row) => string", "", "Identificador de cada linha."],
              ["empty", "ReactNode", `"Nenhum registro."`, "Mensagem sem linhas."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>table</code> de verdade, com <code>caption</code>, <code>th scope="col"</code> e a coluna principal como <code>th scope="row"</code>: em cada célula, o leitor de tela diz a coluna e o protocolo.</li>
            <li>Ordenar é um botão no cabeçalho; <code>aria-sort</code> marca a coluna, e a mudança é anunciada ("Ordenado por Dias em aberto, crescente").</li>
            <li>Em telas estreitas, a tabela rola de lado dentro de uma região com foco e nome, que dá para rolar pelo teclado.</li>
            <li>Números alinhados à direita e com algarismos de mesma largura, para comparar de relance.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
