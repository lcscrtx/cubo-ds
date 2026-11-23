import { Badge, Button, Card, Eyebrow, Heading, TextField } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Matrix, Note, PropsTable } from "../ui";
import type { Doc } from "./types";
import { ONDA2 } from "./onda2";
import { ONDA3 } from "./onda3";
import { ONDA4 } from "./onda4";
import { ONDA5 } from "./onda5";
import { ONDA6 } from "./onda6";
import { ONDA7 } from "./onda7";
import { ONDA8 } from "./onda8";
import { BUTTON_V2 } from "./button-v2";

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

const ONDA1: Record<string, Doc> = {
  button: {
    criterios: ["1.4.3", "1.4.11", "2.1.1", "2.4.7", "2.5.3", "2.5.5", "4.1.2"],
    eyebrow: "Componente",
    title: "Button",
    lead: (
      <>Dispara uma ação. Use <code>primary</code> uma vez por área, para a ação principal; as outras ficam em <code>secondary</code> ou <code>ghost</code>. Com <code>href</code>, vira link.</>
    ),
    body: () => (
      <>
        <DocSection title="Variantes">
          <p>Três pesos e um tamanho só: 36px de altura, 16px de respiro e 14px de fonte. A área de toque vai a 44px sem mudar o desenho. O formato é pílula.</p>
          <Example
            pad={false}
            code={`import { Button } from "@cubo-tecnologia/hexagon";

<Button>Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Ver detalhes</Button>`}
          >
            <Matrix
              cols={["Padrão", "Com ícone", "Ícone à direita", "Desativado"]}
              rows={[
                { name: "Primary", note: "A ação principal da área. Uma por vez.", cells: [<Button>Salvar</Button>, <Button iconStart={<Plus />}>Nova solicitação</Button>, <Button iconEnd={<Arrow />}>Continuar</Button>, <Button disabled>Salvar</Button>] },
                { name: "Secondary", note: "Ações de apoio ao lado da principal.", cells: [<Button variant="secondary">Cancelar</Button>, <Button variant="secondary" iconStart={<Plus />}>Anexar</Button>, <Button variant="secondary" iconEnd={<Arrow />}>Próxima</Button>, <Button variant="secondary" disabled>Cancelar</Button>] },
                { name: "Ghost", note: "Ações discretas: ver mais, barras de ferramentas.", cells: [<Button variant="ghost">Ver detalhes</Button>, <Button variant="ghost" iconStart={<Plus />}>Adicionar</Button>, <Button variant="ghost" iconEnd={<Arrow />}>Saiba mais</Button>, <Button variant="ghost" disabled>Ver detalhes</Button>] },
              ]}
            />
          </Example>
        </DocSection>
        <DocSection title="Como link">
          <Example code={`<Button href="/demonstracao" iconEnd={<Arrow />}>Agendar demonstração</Button>`}>
            <Button href="#" iconEnd={<Arrow />}>Agendar demonstração</Button>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["variant", `"primary" | "secondary" | "ghost"`, "primary", "Peso visual."],
              ["iconStart", "ReactNode", "", "Ícone antes do texto, 16px."],
              ["iconEnd", "ReactNode", "", "Ícone depois do texto, 16px."],
              ["href", "string", "", "Quando presente, renderiza um <a>."],
              ["...rest", "button | a", "", "Atributos nativos do elemento."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Como botão, o <code>type</code> padrão é <code>button</code>, para não enviar formulários sem querer.</li>
            <li>Ícones ficam com <code>aria-hidden</code>; o texto do botão é o nome acessível.</li>
            <li>Foco visível com contorno de 2px na cor de acento.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  badge: {
    criterios: ["1.1.1", "1.4.1", "1.4.3", "2.2.2", "2.3.3"],
    eyebrow: "Componente",
    title: "Badge",
    lead: "Etiqueta curta para status, categoria ou secretaria.",
    body: () => (
      <>
        <DocSection title="Tons">
          <Example
            pad={false}
            code={`<Badge tone="accent" icon="em-analise">Em análise</Badge>
<Badge tone="success" icon="concluido">Concluído</Badge>
<Badge tone="warning" icon="aguardando">Aguardando documento</Badge>
<Badge tone="danger" icon="indeferido">Indeferido</Badge>
<Badge>Saúde</Badge>`}
          >
            <Matrix
              cols={["Com ícone", "Só texto"]}
              rows={[
                { name: "Neutral", note: "Categorias e secretarias.", cells: [<Badge>Rascunho</Badge>, <Badge>Saúde</Badge>] },
                { name: "Accent", note: "Em andamento.", cells: [<Badge tone="accent" icon="em-analise">Em análise</Badge>, <Badge tone="accent">Novo</Badge>] },
                { name: "Success", note: "Concluído, pago, aprovado.", cells: [<Badge tone="success" icon="concluido">Concluído</Badge>, <Badge tone="success">Aprovado</Badge>] },
                { name: "Warning", note: "Pede ação de alguém.", cells: [<Badge tone="warning" icon="aguardando">Aguardando documento</Badge>, <Badge tone="warning">Pendente</Badge>] },
                { name: "Danger", note: "Negado, vencido, erro.", cells: [<Badge tone="danger" icon="indeferido">Indeferido</Badge>, <Badge tone="danger">Vencido</Badge>] },
              ]}
            />
          </Example>
        </DocSection>
        <DocSection title="Com ícone de status">
          <p>
            Cada ícone tem um significado, e a animação conta o mesmo que o texto. Estados finais se desenham uma vez e param;
            estados em curso se movem devagar enquanto o pedido não anda. Escolha o ícone pelo que o status quer dizer, não pela cor.
          </p>
          <Example
            pad={false}
            code={`<Badge tone="accent" icon="em-analise">Em análise</Badge>
<Badge tone="accent" icon="em-andamento">Em atendimento</Badge>
<Badge tone="warning" icon="aguardando">Aguardando documento</Badge>
<Badge tone="warning" icon="pendente">Prazo em 2 dias</Badge>
<Badge tone="success" icon="concluido">Concluído</Badge>
<Badge tone="danger" icon="indeferido">Indeferido</Badge>
<Badge tone="danger" icon="alerta">Vencido</Badge>
<Badge tone="accent" icon="novo">Nova</Badge>`}
          >
            <Matrix
              cols={["Exemplo", "O que a animação diz"]}
              rows={[
                { name: "em-analise", note: "Alguém está olhando o pedido.", cells: [<Badge tone="accent" icon="em-analise">Em análise</Badge>, <span className="s-muted">A lupa percorre a linha.</span>] },
                { name: "em-andamento", note: "O serviço está sendo feito.", cells: [<Badge tone="accent" icon="em-andamento">Em atendimento</Badge>, <span className="s-muted">O arco gira sem parar.</span>] },
                { name: "aguardando", note: "Depende de alguém: cidadão, outra secretaria.", cells: [<Badge tone="warning" icon="aguardando">Aguardando documento</Badge>, <span className="s-muted">A ampulheta vira, espera e vira de novo.</span>] },
                { name: "pendente", note: "Tem prazo correndo.", cells: [<Badge tone="warning" icon="pendente">Prazo em 2 dias</Badge>, <span className="s-muted">O ponteiro do relógio anda.</span>] },
                { name: "concluido", note: "Terminou bem.", cells: [<Badge tone="success" icon="concluido">Concluído</Badge>, <span className="s-muted">O check se desenha uma vez e para.</span>] },
                { name: "indeferido", note: "Terminou negado ou cancelado.", cells: [<Badge tone="danger" icon="indeferido">Indeferido</Badge>, <span className="s-muted">O X se desenha uma vez e para.</span>] },
                { name: "alerta", note: "Pede atenção: vencido, erro.", cells: [<Badge tone="danger" icon="alerta">Vencido</Badge>, <span className="s-muted">A exclamação pisca devagar.</span>] },
                { name: "novo", note: "Acabou de chegar.", cells: [<Badge tone="accent" icon="novo">Nova</Badge>, <span className="s-muted">Um anel se expande e some.</span>] },
              ]}
            />
          </Example>
          <Note>
            Use poucos ícones animados por tela. Numa lista longa, prefira <code>animated={"{false}"}</code> nas linhas e deixe a
            animação para o destaque. Com <code>prefers-reduced-motion</code>, todos ficam parados.
          </Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["tone", `"neutral" | "accent" | "success" | "warning" | "danger"`, "neutral", "Cor da etiqueta."],
              ["icon", "StatusIconName | ReactNode", "", "Ícone de status pelo nome, ou um ícone seu."],
              ["animated", "boolean", "true", "false deixa o ícone de status parado."],
              ["dot", "boolean", "false", "Ponto antes do texto, quando não há ícone."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>A cor e o ícone nunca são a única pista: o texto diz o status.</li>
            <li>Ícone e ponto são decorativos (<code>aria-hidden</code>).</li>
            <li>Animações param com <code>prefers-reduced-motion</code>; os traços aparecem já desenhados.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  card: {
    criterios: ["1.3.1", "1.4.11", "2.4.7"],
    eyebrow: "Componente",
    title: "Card",
    lead: "Superfície que agrupa conteúdo. O raio e a sombra vêm do tema.",
    body: () => (
      <>
        <DocSection title="Variantes">
          <Example
            code={`<Card>…</Card>
<Card variant="panel">…</Card>
<Card variant="elevated">…</Card>
<Card interactive>…</Card>`}
          >
            <div className="s-cardgrid">
              <Card><Eyebrow>default</Eyebrow><p className="s-card-p">Borda leve sobre o fundo.</p></Card>
              <Card variant="panel"><Eyebrow>panel</Eyebrow><p className="s-card-p">Fundo de painel do tema.</p></Card>
              <Card variant="elevated"><Eyebrow>elevated</Eyebrow><p className="s-card-p">Sombra, sem borda.</p></Card>
              <Card interactive><Eyebrow>interactive</Eyebrow><p className="s-card-p">Passe o mouse.</p></Card>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["variant", `"default" | "panel" | "elevated"`, "default", "Tipo de superfície."],
              ["interactive", "boolean", "false", "Hover com borda e sombra, para cartões clicáveis."],
            ]}
          />
          <Note>Para um cartão clicável, envolva com um link; o Card não vira link sozinho.</Note>
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>O Card é só uma superfície: quem dá sentido é o conteúdo. Use um título dentro dele quando ele agrupar um assunto.</li>
            <li>Cartão clicável: envolva com um link de verdade, para funcionar com teclado e leitor de tela; o foco aparece em volta do cartão.</li>
            <li>A borda e a sombra são leves e nunca carregam informação sozinhas.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  heading: {
    criterios: ["1.3.1", "1.4.4", "1.4.12", "2.4.6"],
    eyebrow: "Componente",
    title: "Heading e Eyebrow",
    lead: "Títulos com nível semântico separado do tamanho visual. Peso e tracking vêm do tema.",
    body: () => (
      <>
        <DocSection title="Tamanhos">
          <Example
            code={`<Eyebrow>Cidade Conectada</Eyebrow>
<Heading level={1} size="display">Peça por peça, a prefeitura inteira.</Heading>
<Heading level={2}>Serviços na palma da mão</Heading>
<Heading level={3}>App do Cidadão</Heading>`}
          >
            <div className="s-stack">
              <div>
                <Eyebrow>Eyebrow</Eyebrow>
                <Heading level={2} size="display">Display</Heading>
              </div>
              <Heading level={2} size="h1">H1 · Os serviços da prefeitura</Heading>
              <Heading level={2}>H2 · Os serviços da prefeitura</Heading>
              <Heading level={3}>H3 · Os serviços da prefeitura</Heading>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["level", "1 | 2 | 3 | 4 | 5 | 6", "2", "Nível semântico (h1 a h6)."],
              ["size", `"display" | "h1" | "h2" | "h3"`, "pelo nível", "Tamanho visual."],
            ]}
          />
          <Note>Títulos ficam em 600, com tracking negativo.</Note>
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>O nível (h1 a h6) é separado do tamanho visual: dá para manter a hierarquia certa sem mudar o desenho.</li>
            <li>Um h1 por página e sem pular níveis: quem navega por títulos no leitor de tela entende a estrutura.</li>
            <li>O Eyebrow é um parágrafo comum, lido antes do título; ele não substitui o título.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "text-field": {
    criterios: ["1.3.1", "1.4.3", "1.4.11", "2.4.7", "3.3.1", "3.3.2", "3.3.3", "4.1.2", "4.1.3"],
    eyebrow: "Componente",
    title: "TextField",
    lead: "Campo de texto com rótulo, ajuda e erro já ligados por aria. Mesma altura dos botões: 36px.",
    body: () => (
      <>
        <DocSection title="Estados">
          <Example
            code={`<TextField label="Nome completo" required placeholder="Como no documento" />
<TextField label="CPF" hint="Só números." inputMode="numeric" />
<TextField label="E-mail" defaultValue="maria@" error="Confira o e-mail." />
<TextField label="Protocolo" defaultValue="2026-000184" disabled />`}
          >
            <div className="s-formgrid">
              <TextField label="Nome completo" required placeholder="Como no documento" />
              <TextField label="CPF" hint="Só números." inputMode="numeric" placeholder="000.000.000-00" />
              <TextField label="E-mail" defaultValue="maria@" error="Confira o e-mail." />
              <TextField label="Protocolo" defaultValue="2026-000184" disabled />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Rótulo visível. Obrigatório."],
              ["hint", "ReactNode", "", "Ajuda abaixo do campo."],
              ["error", "ReactNode", "", "Mensagem de erro; marca o campo como inválido."],
              ["...rest", "input", "", "Atributos nativos do input."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Rótulo sempre visível e ligado ao campo por <code>htmlFor</code>.</li>
            <li>Ajuda e erro entram em <code>aria-describedby</code>; erro também liga <code>aria-invalid</code>.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};

export const COMPONENTES: Record<string, Doc> = { ...ONDA1, ...ONDA2, ...ONDA3, ...ONDA4, ...ONDA5, ...ONDA6, ...ONDA7, ...ONDA8, button: BUTTON_V2 };
