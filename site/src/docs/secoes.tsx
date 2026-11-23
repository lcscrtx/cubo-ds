import { Link } from "react-router-dom";
import { Card, Heading } from "@cubo-tecnologia/hexagon";
import { base } from "../../../tokens/tokens.mjs";
import { Code, DocSection, Note } from "../ui";
import { COMPONENT_GROUPS } from "./nav";
import type { Doc } from "./types";
import { ACESSIBILIDADE } from "./acessibilidade";

function Swatch({ name }: { name: string }) {
  return (
    <div className="s-swatch">
      <span className="s-swatch__chip" style={{ background: `var(--hx-color-${name})` }} />
      <code>{name}</code>
    </div>
  );
}

export const SECOES: Record<string, Doc> = {
  introducao: {
    eyebrow: "Seção",
    title: "Introdução",
    lead: "O Hexagon é o design system acessível da Cubo Tecnologia e dos seus produtos, feito para o serviço público. Componentes React em português que já seguem a WCAG 2.2, o eMAG e a ABNT NBR 17225, com tokens fáceis de adaptar a cada produto.",
    body: () => (
      <>
        <DocSection title="O que é">
          <p>
            Um pacote npm, <code>@cubo-tecnologia/hexagon</code>, com componentes React e tokens em CSS e JSON. Todos os
            produtos usam as mesmas peças; quem precisa de outra cor, raio ou fonte sobrescreve os tokens no próprio código.
          </p>
          <p>Serve aos sites e às telas dos produtos: o app do cidadão, o portal do servidor e o dashboard do prefeito.</p>
        </DocSection>
        <DocSection title="Para quem">
          <ul className="s-list">
            <li><strong>Cidadão</strong>: usa o app no celular, muitas vezes com pressa e conexão ruim. Texto claro e alvos de toque confortáveis.</li>
            <li><strong>Servidor</strong>: passa o dia no portal analisando solicitações. Densidade, tabelas e atalhos.</li>
            <li><strong>Gestor e prefeito</strong>: confere números e o desempenho das secretarias. Leitura rápida, gráficos e status.</li>
            <li><strong>Quem compra</strong>: visita os sites. Estética limpa, de negócio grande.</li>
          </ul>
        </DocSection>
        <DocSection title="Princípios">
          <ul className="s-list">
            <li><strong>Acessível antes de tudo</strong>: acessibilidade é o núcleo do produto. Veja <Link to="/docs/acessibilidade">as regras e o contraste medido</Link>.</li>
            <li><strong>Um modelo só</strong>: cor, fonte, peso, raio e sombra são tokens. Adaptar a outro produto não toca nos componentes.</li>
            <li><strong>Em português</strong>: nomes de props em inglês, textos, exemplos e documentação em português.</li>
            <li><strong>Tamanho único</strong>: controles sempre em md, 36px de altura e 14px de fonte.</li>
          </ul>
        </DocSection>
        <DocSection title="O que tem aqui">
          <ul className="s-list">
            <li><Link to="/docs/instalacao">Instalação</Link>: como pôr o pacote num projeto e adaptar o tema.</li>
            <li><Link to="/docs/fundacao">Fundação</Link>: cores, tipografia, espaço, raio, sombra e movimento.</li>
            <li><Link to="/docs/componentes">Componentes</Link>: cada peça com exemplo, código e props.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  acessibilidade: ACESSIBILIDADE,

  instalacao: {
    eyebrow: "Seção",
    title: "Instalação",
    lead: "Instale o pacote, importe o CSS uma vez e ponha a classe hx-root na página.",
    body: () => (
      <>
        <DocSection title="1. Instalar">
          <Code lang="sh" code="npm install @cubo-tecnologia/hexagon" />
          <p>React 18 ou 19 é dependência de pares (peer).</p>
        </DocSection>
        <DocSection title="2. Importar o CSS">
          <Code code={`// main.tsx
import "@cubo-tecnologia/hexagon/styles.css";`} />
          <p>
            O <code>styles.css</code> traz os tokens e o CSS dos componentes. Quem só quer os tokens, sem React,
            importa <code>@cubo-tecnologia/hexagon/tokens.css</code> ou lê <code>@cubo-tecnologia/hexagon/tokens.json</code>.
          </p>
        </DocSection>
        <DocSection title="3. Ligar a base">
          <p>A classe <code>hx-root</code> liga a fonte, o foco visível e as preferências de acessibilidade em tudo que está dentro.</p>
          <Code lang="html" code={`<body class="hx-root">`} />
          <Code code={`import { Button } from "@cubo-tecnologia/hexagon";

export function App() {
  return <Button>Agendar demonstração</Button>;
}`} />
        </DocSection>
        <DocSection title="4. Carregar a fonte">
          <p>O pacote não embute fontes. O Hexagon usa <strong>IBM Plex Sans</strong> (Google Fonts ou <code>@fontsource-variable/ibm-plex-sans</code>).</p>
          <Code lang="html" code={`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" />`} />
        </DocSection>
        <DocSection title="5. Adaptar a outro produto">
          <p>O padrão é o modelo do Cidade Conectada. Para mudar cores, raios ou fonte, sobrescreva os tokens depois de importar o CSS:</p>
          <Code lang="css" code={`:root {
  --hx-color-action: #1552e1;
  --hx-color-action-hover: #0f41b8;
  --hx-color-accent: #1552e1;
  --hx-color-accent-50: #f2f5fd;
  --hx-radius-control: 6px;
}

/* O tema escuro tem cores próprias. */
:root[data-theme="dark"] {
  --hx-color-action: #7ea2f6;
  --hx-color-action-hover: #a9c0fa;
  --hx-color-accent: #7ea2f6;
  --hx-color-accent-50: #161f36;
}

/* Os mesmos valores, para quem segue o tema do sistema. */
@media (prefers-color-scheme: dark) {
  :root[data-theme="auto"] {
    --hx-color-action: #7ea2f6;
    --hx-color-action-hover: #a9c0fa;
    --hx-color-accent: #7ea2f6;
    --hx-color-accent-50: #161f36;
  }
}`} />
          <Note>Confira o contraste das cores novas: pelo menos 4,5:1 para texto e 3:1 para bordas e foco. A lista de tokens está em <Link to="/docs/fundacao">Fundação</Link>.</Note>
        </DocSection>
      </>
    ),
  },

  fundacao: {
    eyebrow: "Seção",
    title: "Fundação",
    lead: "As escalas e os papéis de cor, tipografia, espaço, raio, sombra e movimento.",
    body: () => (
      <>
        <DocSection title="Cor de acento">
          <p>A escala de acento é o que mais muda de um produto para outro. Nos componentes, use sempre o papel, nunca o hex.</p>
          <div className="s-swatches">
            {["accent-50", "accent-100", "accent-200", "accent-300", "accent-400", "accent", "accent-hover", "accent-800", "highlight", "panel"].map((n) => <Swatch key={n} name={n} />)}
          </div>
        </DocSection>
        <DocSection title="Texto, fundo e borda">
          <div className="s-swatches">
            {["text", "text-2", "text-3", "bg", "surface", "border", "border-soft", "dark"].map((n) => <Swatch key={n} name={n} />)}
          </div>
        </DocSection>
        <DocSection title="Estados">
          <p>Não mude entre produtos: o status de um protocolo precisa significar a mesma coisa em qualquer um.</p>
          <div className="s-swatches">
            {["success", "success-soft", "warning", "warning-soft", "danger", "danger-soft"].map((n) => <Swatch key={n} name={n} />)}
          </div>
        </DocSection>
        <DocSection title="Tipografia">
          <div className="s-typescale">
            {(["display", "h1", "h2", "h3"] as const).map((s) => (
              <div key={s} className="s-typescale__row">
                <code>{s}</code>
                <Heading level={3} size={s}>Peça por peça</Heading>
              </div>
            ))}
            {(["lead", "body", "small", "caption", "micro"] as const).map((s) => (
              <div key={s} className="s-typescale__row">
                <code>{s}</code>
                <p style={{ margin: 0, fontSize: `var(--hx-font-size-${s})` }}>Os serviços da prefeitura na palma da mão do cidadão.</p>
              </div>
            ))}
          </div>
          <Note>Pesos: <code>regular</code> 400 e <code>medium</code> 500; <code>strong</code> e <code>heading</code> 600.</Note>
        </DocSection>
        <DocSection title="Espaço">
          <div className="s-space">
            {Object.entries(base.space).filter(([k]) => k !== "0").map(([k, v]) => (
              <div key={k} className="s-space__row">
                <code>space-{k}</code>
                <span className="s-space__bar" style={{ width: v as string }} />
                <span className="s-muted">{v as string}</span>
              </div>
            ))}
          </div>
        </DocSection>
        <DocSection title="Raio e sombra">
          <div className="s-shapes">
            {["sm", "md", "lg", "control"].map((r) => (
              <div key={r} className="s-shape" style={{ borderRadius: `var(--hx-radius-${r})` }}><code>radius-{r}</code></div>
            ))}
            {["sm", "md", "lg"].map((s) => (
              <div key={s} className="s-shape s-shape--shadow" style={{ boxShadow: `var(--hx-shadow-${s})` }}><code>shadow-{s}</code></div>
            ))}
          </div>
        </DocSection>
        <DocSection title="Movimento">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Token</th><th>Valor</th></tr></thead>
              <tbody>
                {Object.entries(base.motion).map(([k, v]) => (
                  <tr key={k}><td><code>--hx-motion-{k}</code></td><td><code>{v as string}</code></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>
      </>
    ),
  },

  componentes: {
    eyebrow: "Seção",
    title: "Componentes",
    lead: "Cada peça tem exemplo, código, props e notas de acessibilidade.",
    body: () => (
      <>
        {COMPONENT_GROUPS.map((g) => (
          <DocSection key={g.title} title={g.title}>
            <div className="s-compgrid">
              {g.items.map((i) => (
                <Link key={i.slug} to={i.to} className="s-compgrid__link">
                  <Card interactive className="s-compgrid__card">
                    <span className="s-compgrid__name">{i.title}</span>
                    <span className="s-muted">Ver documentação</span>
                  </Card>
                </Link>
              ))}
            </div>
          </DocSection>
        ))}
      </>
    ),
  },
};
