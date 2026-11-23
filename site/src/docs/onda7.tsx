import { useState } from "react";
import { Badge, Breadcrumb, Button, Combobox, DescriptionList, PageHeader, Timeline, type ComboboxOption } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

const SERVICOS: ComboboxOption[] = [
  "Alvará de funcionamento|Fazenda", "Cadastro Único|Assistência Social", "Cartão SUS|Saúde", "Castração de animais|Meio Ambiente",
  "Certidão negativa de débitos|Fazenda", "Coleta de entulho|Infraestrutura", "Exame de imagem|Saúde", "Habite-se|Planejamento",
  "Iluminação pública|Infraestrutura", "Limpeza de terreno|Meio Ambiente", "Matrícula escolar|Educação", "Poda de árvore|Meio Ambiente",
  "Remédio em casa|Saúde", "Segunda via do IPTU|Fazenda", "Tapa-buraco|Infraestrutura", "Transporte escolar|Educação", "Vacinação domiciliar|Saúde",
].map((s) => {
  const [label, sec] = s.split("|");
  return { value: label.toLowerCase().replace(/\s+/g, "-"), label, description: `Secretaria de ${sec}` };
});

function ComboboxDemo() {
  const [v, setV] = useState<string | null>(null);
  return (
    <div className="s-formgrid">
      <Combobox label="Serviço" required options={SERVICOS} value={v} onChange={setV} hint="Digite parte do nome. Acentos não importam: tente &quot;saude&quot;." />
      <Combobox label="Serviço (com erro)" options={SERVICOS} error="Escolha um serviço da lista." />
    </div>
  );
}

const PROTOCOLO_DADOS = [
  { term: "Protocolo", detail: <span className="s-mono">2026-001043</span> },
  { term: "Situação", detail: <Badge tone="accent" icon="em-analise" animated={false}>Em análise</Badge> },
  { term: "Cidadão", detail: "Maria das Graças Lima" },
  { term: "CPF", detail: "529.982.247-25" },
  { term: "Telefone", detail: "(83) 99876-5432" },
  { term: "E-mail" },
  { term: "Endereço", detail: "Rua das Flores, 120, apto 302, Tambaú, João Pessoa (PB), 58039-000", full: true },
];

const HISTORICO = [
  { id: "1", title: "Solicitação aberta", date: "2026-11-12T09:14:00", actor: "Maria das Graças Lima, pelo aplicativo", icon: "novo" as const, tone: "accent" as const },
  { id: "2", title: "Documentos conferidos", date: "2026-11-13T15:40:00", actor: "Ana Souza, Secretaria de Saúde", icon: "concluido" as const, tone: "success" as const },
  { id: "3", title: "Falta comprovante de residência", date: "2026-11-14T10:02:00", actor: "Ana Souza", icon: "aguardando" as const, tone: "warning" as const, description: "O comprovante enviado está fora do prazo de 3 meses. Pedido de novo documento enviado por WhatsApp." },
  { id: "4", title: "Novo comprovante recebido", date: "2026-11-18T08:31:00", actor: "Maria das Graças Lima", icon: "concluido" as const, tone: "success" as const },
  { id: "5", title: "Em análise para emissão", date: "2026-11-18T11:20:00", actor: "Secretaria de Saúde", icon: "em-analise" as const, tone: "accent" as const },
];

export const ONDA7: Record<string, Doc> = {
  "page-header": {
    eyebrow: "Componente",
    title: "PageHeader",
    criterios: ["1.3.1", "2.4.6", "2.4.8"],
    lead: "Cabeçalho de cada página: onde a pessoa está, o que é aquilo e o que pode fazer. Traz o único h1 da página.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<PageHeader
  breadcrumb={<Breadcrumb items={[{ label: "Protocolos", href: "/protocolos" }, { label: "2026-001043" }]} />}
  title="Cartão SUS · 2026-001043"
  meta={<><Badge tone="accent" icon="em-analise">Em análise</Badge><span>Aberto há 7 dias</span></>}
  description="Pedido feito pelo aplicativo. Documentos conferidos em 13/11."
  actions={<><Button variant="secondary">Encaminhar</Button><Button>Emitir cartão</Button></>}
/>`}
          >
            <div style={{ width: "100%" }}>
              <PageHeader
                breadcrumb={<Breadcrumb items={[{ label: "Protocolos", href: "#" }, { label: "2026-001043" }]} />}
                title="Cartão SUS · 2026-001043"
                meta={<><Badge tone="accent" icon="em-analise" animated={false}>Em análise</Badge><span>Aberto há 7 dias</span></>}
                description="Pedido feito pelo aplicativo. Documentos conferidos em 13/11 pela Secretaria de Saúde."
                actions={<><Button variant="secondary">Encaminhar</Button><Button>Emitir cartão</Button></>}
              />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["title", "ReactNode", "", "Título; vira o h1."],
              ["breadcrumb", "ReactNode", "", "Trilha acima do título."],
              ["meta", "ReactNode", "", "Situação e informações curtas."],
              ["description", "ReactNode", "", "Uma ou duas frases."],
              ["actions", "ReactNode", "", "Botões. Principal por último."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Um h1 por página, sempre no mesmo lugar: quem navega por títulos acha a página na hora.</li>
            <li>Trilha antes do título, na ordem de leitura.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "description-list": {
    eyebrow: "Componente",
    title: "DescriptionList",
    criterios: ["1.3.1", "1.4.10"],
    lead: "Os dados de um registro em pares de nome e valor: os dados do cidadão, de um protocolo. Campo vazio diz \"Não informado\".",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<DescriptionList
  items={[
    { term: "Protocolo", detail: "2026-001043" },
    { term: "Cidadão", detail: "Maria das Graças Lima" },
    { term: "E-mail" }, // vazio: "Não informado"
    { term: "Endereço", detail: "Rua das Flores, 120…", full: true },
  ]}
/>`}
          >
            <div style={{ width: "100%" }}><DescriptionList items={PROTOCOLO_DADOS} /></div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["items", "{ term, detail?, full? }[]", "", "Pares. Sem detail, mostra \"Não informado\"."],
              ["columns", "1 | 2 | 3", "2", "Colunas em telas largas; no celular, uma."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>dl</code>, <code>dt</code> e <code>dd</code>: o leitor de tela anuncia a lista e liga cada valor ao seu nome.</li>
            <li>Valor vazio vira "Não informado", nunca um espaço em branco que some na leitura.</li>
            <li>Textos longos quebram dentro da coluna, sem rolagem lateral.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  timeline: {
    eyebrow: "Componente",
    title: "Timeline",
    criterios: ["1.3.1", "1.4.1"],
    lead: "Histórico de um pedido: o que aconteceu, quando e quem fez. O mais recente vem primeiro.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Timeline
  label="Histórico do protocolo 2026-001043"
  events={[
    { id: "1", title: "Solicitação aberta", date: "2026-11-12T09:14", actor: "Maria, pelo aplicativo", icon: "novo", tone: "accent" },
    { id: "3", title: "Falta comprovante de residência", date: "2026-11-14T10:02", icon: "aguardando", tone: "warning",
      description: "O comprovante está fora do prazo de 3 meses." },
  ]}
/>`}
          >
            <div style={{ width: "100%", maxWidth: 560 }}><Timeline label="Histórico do protocolo 2026-001043" events={HISTORICO} /></div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "string", "", "Nome da lista. Obrigatório."],
              ["events", "{ id, title, date, description?, actor?, icon?, tone? }[]", "", "Eventos; date em ISO."],
              ["order", `"newest" | "oldest"`, "newest", "Ordem."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Lista ordenada com nome; cada data é um <code>time</code> com o valor ISO, lida por extenso: "18 de nov de 2026, 11:20".</li>
            <li>O tipo do evento vem do ícone e do título, não só da cor do marcador.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  combobox: {
    eyebrow: "Componente",
    title: "Combobox",
    criterios: ["1.3.1", "2.1.1", "2.4.7", "3.3.1", "3.3.2", "4.1.2", "4.1.3"],
    lead: "Lista com busca para muitas opções: os serviços da Carta, os bairros, as escolas. Busca sem acento e anuncia quantas opções combinam.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<Combobox
  label="Serviço"
  required
  options={[{ value: "cartao-sus", label: "Cartão SUS", description: "Secretaria de Saúde" }, …]}
  value={servico}
  onChange={setServico}
/>`}
          >
            <ComboboxDemo />
          </Example>
          <Note>Até 15 opções, o Select comum é mais simples. Use o Combobox quando a lista é longa ou a pessoa sabe o nome e quer digitar.</Note>
        </DocSection>
        <DocSection title="Teclado">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Tecla</th><th>O que faz</th></tr></thead>
              <tbody>
                <tr><td>Digitar</td><td>Filtra a lista, ignorando acentos.</td></tr>
                <tr><td><code>↓</code> <code>↑</code></td><td>Abre e anda entre as opções.</td></tr>
                <tr><td><code>Enter</code></td><td>Escolhe a opção marcada.</td></tr>
                <tr><td><code>Esc</code></td><td>Fecha a lista; de novo, limpa o campo.</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Rótulo. Obrigatório."],
              ["options", "{ value, label, description? }[]", "", "As opções."],
              ["value / onChange", "string | null", "", "Opção escolhida."],
              ["hint, error, required, placeholder", "", "", "Como nos outros campos."],
              ["emptyText", "string", "", "Mensagem sem resultados."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Padrão combobox da WAI-ARIA 1.2: o foco fica no campo e a opção marcada é anunciada por <code>aria-activedescendant</code>.</li>
            <li>"5 opções" ou "Nada encontrado" é dito enquanto a pessoa digita, sem tirar o foco.</li>
            <li>Opção marcada com borda de 2px e fundo; escolhida com check.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
