import { Children, isValidElement, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { COMPONENTES } from "../docs/componentes";
import { SECOES } from "../docs/secoes";
import { FLAT_NAV, NAV } from "../docs/nav";
import { NotFound } from "./NotFound";
import { CriteriaList } from "../docs/criteria";
import { CodeBlock, H2, InstallTabs } from "../docs-kit";
import { DocModel, PRINCIPAIS } from "../ui";

const DOCS = { ...SECOES, ...COMPONENTES };

/** O que importar em cada página. Padrão: o título, separado em " e ". */
const IMPORTS: Record<string, string[]> = {
  toast: ["ToastProvider", "useToast"],
  skeleton: ["Skeleton", "LoadingRegion"],
  "accessibility-bar": ["AccessibilityBar", "useAccessibilityPrefs"],
};
const importsOf = (slug: string, title: string) => IMPORTS[slug] ?? title.split(" e ").map((s) => s.trim());

/** Separa os exemplos do resto (Teclado, API, Acessibilidade), para a instalação entrar entre os dois. */
function splitBody(body: ReactNode) {
  const secoes = Children.toArray(isValidElement<{ children?: ReactNode }>(body) ? body.props.children : body);
  const i = secoes.findIndex((s) => isValidElement<{ title?: string }>(s) && !!s.props.title && s.props.title in PRINCIPAIS);
  return i < 0 ? { exemplos: secoes, resto: [] } : { exemplos: secoes.slice(0, i), resto: secoes.slice(i) };
}

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M13 8H3M7 4L3 8l4 4" : "M3 8h10M9 4l4 4-4 4"} />
  </svg>
);

export function DocPage({ slug: fixed }: { slug?: string }) {
  const params = useParams();
  const slug = fixed ?? params.slug ?? "introducao";
  const doc = DOCS[slug];
  if (!doc) return <NotFound inline />;

  const idx = FLAT_NAV.findIndex((i) => i.slug === slug);
  const prev = FLAT_NAV[idx - 1];
  const next = FLAT_NAV[idx + 1];
  const modeloNovo = slug in COMPONENTES && doc.layout !== "v2";
  const { exemplos, resto } = modeloNovo ? splitBody(doc.body()) : { exemplos: [], resto: [] };
  const grupo = NAV.find((g) => g.items.some((i) => i.slug === slug))?.title;

  return (
    <article className="s-doc">
      <header className="k-head">
        <p className="k-head__crumb">
          <Link to={grupo === "Seções" ? "/docs" : "/docs/componentes"}>{grupo === "Seções" ? "Documentação" : "Componentes"}</Link>
          {grupo && grupo !== "Seções" && <span aria-hidden="true">/</span>}
          {grupo && grupo !== "Seções" && <span>{grupo}</span>}
        </p>
        <div className="k-head__row">
          <h1 className="k-head__title">{doc.title}</h1>
          <div className="k-head__pager">
            {prev && <Link to={prev.to} className="s-icon-btn" aria-label={`Anterior: ${prev.title}`}><Arrow dir="left" /></Link>}
            {next && <Link to={next.to} className="s-icon-btn" aria-label={`Próxima: ${next.title}`}><Arrow dir="right" /></Link>}
          </div>
        </div>
        <p className="k-head__lead">{doc.lead}</p>
      </header>

      {!(slug in COMPONENTES) && doc.criterios && (
        <section className="s-conform" aria-label="Conformidade de acessibilidade">
          <div className="s-conform__head">
            <strong>Acessibilidade conferida</strong>
            <span>WCAG 2.2 · eMAG 3.1 · ABNT NBR 17225</span>
          </div>
          <CriteriaList ids={doc.criterios} />
        </section>
      )}

      {modeloNovo ? (
        // Páginas de componente no modelo novo: exemplos, instalação, uso, acessibilidade e API.
        <DocModel.Provider value={{ v2: true, criterios: doc.criterios }}>
          <H2>Exemplos</H2>
          {exemplos}
          <H2>Instalação</H2>
          <InstallTabs />
          <p className="k-p">Importe o CSS uma vez, na raiz da aplicação:</p>
          <CodeBlock code={`import "@cubo-tecnologia/hexagon/styles.css";`} />
          <H2>Uso</H2>
          <CodeBlock code={`import { ${importsOf(slug, doc.title).join(", ")} } from "@cubo-tecnologia/hexagon";`} />
          {resto}
        </DocModel.Provider>
      ) : (
        doc.body()
      )}

      <nav className="s-doc__foot" aria-label="Páginas vizinhas">
        {prev ? <Link to={prev.to}><small>Anterior</small>{prev.title}</Link> : <span />}
        {next && <Link to={next.to} className="is-next"><small>Próxima</small>{next.title}</Link>}
      </nav>
    </article>
  );
}
