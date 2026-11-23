// Página do Button no modelo novo: piloto para as outras 38.
import { Button } from "@cubo-tecnologia/hexagon";
import { CodeBlock, H2, H3, InstallTabs, Preview } from "../docs-kit";
import { CriteriaList } from "./criteria";
import { PropsTable } from "../ui";
import type { Doc } from "./types";

const Plus = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

const CRITERIOS = ["1.4.3", "1.4.11", "2.1.1", "2.4.7", "2.5.3", "2.5.5", "4.1.2"];

export const BUTTON_V2: Doc = {
  eyebrow: "Componente",
  title: "Button",
  layout: "v2",
  criterios: CRITERIOS,
  lead: "Dispara uma ação: salvar, enviar, continuar. Um tamanho só e três pesos.",
  body: () => (
    <>
      <Preview
        code={`import { Button } from "@cubo-tecnologia/hexagon";

export function Exemplo() {
  return <Button>Enviar solicitação</Button>;
}`}
      >
        <Button>Enviar solicitação</Button>
      </Preview>

      <H2>Exemplos</H2>

      <H3>Variantes</H3>
      <p className="k-p">
        <code>primary</code> é a ação principal da área, uma por vez. <code>secondary</code> fica ao lado dela. <code>ghost</code> é para ações
        discretas, como "Ver detalhes".
      </p>
      <Preview
        code={`<Button>Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Ver detalhes</Button>`}
      >
        <Button>Salvar</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="ghost">Ver detalhes</Button>
      </Preview>

      <H3>Com ícone</H3>
      <Preview
        code={`<Button iconStart={<Plus />}>Nova solicitação</Button>
<Button variant="secondary" iconEnd={<Arrow />}>Continuar</Button>`}
      >
        <Button iconStart={<Plus />}>Nova solicitação</Button>
        <Button variant="secondary" iconEnd={<Arrow />}>Continuar</Button>
      </Preview>

      <H3>Como link</H3>
      <p className="k-p">Com <code>href</code>, o Button vira um <code>&lt;a&gt;</code> com o mesmo visual. Use quando a ação leva a outra página.</p>
      <Preview code={`<Button href="/demonstracao" iconEnd={<Arrow />}>Agendar demonstração</Button>`}>
        <Button href="#" iconEnd={<Arrow />}>Agendar demonstração</Button>
      </Preview>

      <H3>Desativado</H3>
      <p className="k-p">Prefira explicar o que falta, perto do botão, em vez de só desativá-lo: quem usa leitor de tela nem sempre percebe o motivo.</p>
      <Preview
        code={`<Button disabled>Enviar</Button>
<Button variant="secondary" disabled>Cancelar</Button>`}
      >
        <Button disabled>Enviar</Button>
        <Button variant="secondary" disabled>Cancelar</Button>
      </Preview>

      <H2>Instalação</H2>
      <InstallTabs />
      <p className="k-p">Importe o CSS uma vez, na raiz da aplicação:</p>
      <CodeBlock code={`import "@cubo-tecnologia/hexagon/styles.css";`} />

      <H2>Uso</H2>
      <CodeBlock code={`import { Button } from "@cubo-tecnologia/hexagon";`} />
      <CodeBlock code={`<Button>Salvar</Button>`} />

      <H2>Acessibilidade</H2>
      <ul className="k-list">
        <li>Desenho de 36px de altura, com área de toque de 44px (nível AAA).</li>
        <li>O <code>type</code> padrão é <code>button</code>: não envia formulários sem querer.</li>
        <li>Foco visível de 2px na cor de ação, mesmo fora de um <code>.hx-root</code>.</li>
        <li>Ícones ficam escondidos do leitor de tela; o texto é o nome do botão.</li>
        <li>O rótulo nunca quebra linha, e o hover só troca a cor.</li>
      </ul>
      <CriteriaList ids={CRITERIOS} />

      <H2>API</H2>
      <PropsTable
        rows={[
          ["variant", `"primary" | "secondary" | "ghost"`, "primary", "Peso visual."],
          ["iconStart", "ReactNode", "", "Ícone antes do texto, 16px."],
          ["iconEnd", "ReactNode", "", "Ícone depois do texto, 16px."],
          ["href", "string", "", "Quando presente, renderiza um <a>."],
          ["...rest", "button | a", "", "Atributos nativos do elemento."],
        ]}
      />
    </>
  ),
};
