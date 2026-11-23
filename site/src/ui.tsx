// Peças do próprio site de documentação (não fazem parte do pacote).
import { createContext, useContext, useState, type ReactNode } from "react";
import type React from "react";
import { H2, H3, Preview } from "./docs-kit";
import { CriteriaList } from "./docs/criteria";

/**
 * Páginas de componente usam o modelo novo (prévia ↔ código, títulos com âncora, critérios na
 * seção Acessibilidade). As páginas de seção continuam no formato simples.
 */
export const DocModel = createContext<{ v2: boolean; criterios?: string[] }>({ v2: false });

/** Seções que são títulos principais. As outras viram exemplos (h3 dentro de "Exemplos"). */
export const PRINCIPAIS: Record<string, string> = { Props: "API", "Props de toast.show": "API", Acessibilidade: "Acessibilidade", Teclado: "Teclado" };

export function DocSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  const model = useContext(DocModel);
  if (model.v2) {
    const principal = PRINCIPAIS[title];
    return (
      <section className="k-section">
        {principal ? <H2>{principal}</H2> : /^Exemplos?$/.test(title) ? null : <H3>{title}</H3>}
        {children}
        {title === "Acessibilidade" && model.criterios && <CriteriaList ids={model.criterios} />}
      </section>
    );
  }
  return (
    <section className="s-doc__section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/** Caixa de exemplo com o código logo abaixo, recolhido. No modelo novo, vira prévia ↔ código. */
export function Example({ children, code, pad = true }: { children: ReactNode; code?: string; pad?: boolean }) {
  const model = useContext(DocModel);
  const [open, setOpen] = useState(false);
  if (model.v2) {
    if (code) return <Preview code={code} align={pad ? "center" : "start"}>{children}</Preview>;
    return <div className={`k-preview__stage${pad ? "" : " is-start"}`}>{children}</div>;
  }
  return (
    <div className="s-example">
      <div className={pad ? "s-example__stage" : "s-example__stage s-example__stage--flush"}>{children}</div>
      {code && (
        <div className={open ? "s-example__code is-open" : "s-example__code"}>
          <Code code={code} />
          <button type="button" className="s-example__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? "Esconder código" : "Ver código"}
          </button>
        </div>
      )}
    </div>
  );
}

export function Code({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* sem clipboard */
    }
  };
  return (
    <div className="s-code">
      <button type="button" className="s-code__copy" onClick={copy}>{copied ? "Copiado" : "Copiar"}</button>
      <pre data-lang={lang}>
        <code>
          {code.trim().split("\n").map((line, i) => (
            <span className="s-code__line" key={i}>
              <span className="s-code__n" aria-hidden="true">{i + 1}</span>
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** Tabela de variantes: linhas × colunas, como na página de Button. */
export function Matrix({ cols, rows }: { cols: string[]; rows: { name: string; note?: string; cells: ReactNode[] }[] }) {
  return (
    <div className="s-matrix" role="table" style={{ "--cols": cols.length } as React.CSSProperties}>
      <div className="s-matrix__row s-matrix__head" role="row">
        <span role="columnheader">Variante</span>
        {cols.map((c) => <span role="columnheader" key={c}>{c}</span>)}
      </div>
      {rows.map((r) => (
        <div className="s-matrix__row" role="row" key={r.name}>
          <span role="rowheader" className="s-matrix__name">
            <strong>{r.name}</strong>
            {r.note && <small>{r.note}</small>}
          </span>
          {r.cells.map((c, i) => <span role="cell" key={i} className="s-matrix__cell">{c}</span>)}
        </div>
      ))}
    </div>
  );
}

export function PropsTable({ rows }: { rows: [prop: string, type: string, def: string, desc: string][] }) {
  return (
    <div className="s-table-wrap">
      <table className="s-table">
        <thead>
          <tr><th>Prop</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr>
        </thead>
        <tbody>
          {rows.map(([p, t, d, desc]) => (
            <tr key={p}>
              <td><code>{p}</code></td>
              <td><code className="s-muted">{t}</code></td>
              <td>{d === "" ? <span className="s-muted">—</span> : <code>{d}</code>}</td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="s-note">{children}</div>;
}
