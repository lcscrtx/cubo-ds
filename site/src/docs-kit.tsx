// Peças da documentação no modelo novo (inspirado no shadcn/ui e no Radix):
// bloco de código colorido, prévia ↔ código em abas, instalação em abas e índice "Nesta página".
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// ---------------------------------------------------------------- código colorido

type Tok = { c: string; t: string };

/** Destaque simples de TSX/HTML/shell: palavras-chave, textos, tags, atributos e comentários. */
function highlight(src: string): Tok[] {
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?)([A-Za-z][\w.]*)|\b(import|from|export|default|const|let|function|return|type|interface|await|async|if|else|true|false|null|undefined|new)\b|([A-Za-z_][\w-]*)(?==)|(\$ |npm|pnpm|yarn|bun)(?= )/g;
  const out: Tok[] = [];
  let last = 0;
  for (const m of src.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ c: "", t: src.slice(last, i) });
    if (m[1]) out.push({ c: "cm", t: m[1] });
    else if (m[2]) out.push({ c: "st", t: m[2] });
    else if (m[3]) {
      out.push({ c: "pn", t: m[3] });
      out.push({ c: "tg", t: m[4] });
    } else if (m[5]) out.push({ c: "kw", t: m[5] });
    else if (m[6]) out.push({ c: "at", t: m[6] });
    else if (m[7]) out.push({ c: "kw", t: m[7] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ c: "", t: src.slice(last) });
  return out;
}

function CopyButton({ text, label = "Copiar código" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="k-copy"
      aria-label={ok ? "Copiado" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {
          /* sem clipboard */
        }
      }}
    >
      {ok ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" /><path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></svg>
      )}
      <span className="k-sr" aria-live="polite">{ok ? "Copiado" : ""}</span>
    </button>
  );
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const text = code.trim();
  return (
    <div className="k-code">
      {title && <div className="k-code__title">{title}</div>}
      <CopyButton text={text} />
      <pre tabIndex={0}>
        <code>
          {highlight(text).map((t, i) => (t.c ? <span key={i} className={`k-${t.c}`}>{t.t}</span> : t.t))}
        </code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------- abas simples do site

function SiteTabs({ tabs, label, children }: { tabs: string[]; label: string; children: (active: number) => ReactNode }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    let n: number | null = null;
    if (e.key === "ArrowRight") n = (active + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (active - 1 + tabs.length) % tabs.length;
    if (n !== null) {
      e.preventDefault();
      setActive(n);
      refs.current[n]?.focus();
    }
  };
  return (
    <>
      <div className="k-tabs" role="tablist" aria-label={label} onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-t${i}`}
            aria-controls={`${base}-p${i}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="k-tabs__tab"
            onClick={() => setActive(i)}
          >
            {t}
          </button>
        ))}
      </div>
      {tabs.map((_, i) => (
        <div key={i} role="tabpanel" id={`${base}-p${i}`} aria-labelledby={`${base}-t${i}`} className="k-tabs__panel" hidden={i !== active}>
          {i === active ? children(i) : null}
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- prévia ↔ código

/** Exemplo do componente: aba "Prévia" com a peça de verdade e aba "Código". */
export function Preview({ children, code, align = "center" }: { children: ReactNode; code: string; align?: "center" | "start" }) {
  return (
    <div className="k-preview">
      <SiteTabs tabs={["Prévia", "Código"]} label="Exemplo">
        {(i) =>
          i === 0 ? (
            <div className={`k-preview__stage${align === "start" ? " is-start" : ""}`}>{children}</div>
          ) : (
            <CodeBlock code={code} />
          )
        }
      </SiteTabs>
    </div>
  );
}

// ---------------------------------------------------------------- instalação

const MANAGERS: [string, string][] = [
  ["npm", "npm install"],
  ["pnpm", "pnpm add"],
  ["yarn", "yarn add"],
  ["bun", "bun add"],
];

export function InstallTabs({ pkg = "@cubo-tecnologia/hexagon" }: { pkg?: string }) {
  return (
    <div className="k-install">
      <SiteTabs tabs={MANAGERS.map(([m]) => m)} label="Gerenciador de pacotes">
        {(i) => <CodeBlock code={`${MANAGERS[i][1]} ${pkg}`} />}
      </SiteTabs>
    </div>
  );
}

// ---------------------------------------------------------------- títulos com âncora

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function H2({ children }: { children: string }) {
  return <h2 id={slug(children)} className="k-h2"><a href={`#${slug(children)}`}>{children}</a></h2>;
}
export function H3({ children }: { children: string }) {
  return <h3 id={slug(children)} className="k-h3"><a href={`#${slug(children)}`}>{children}</a></h3>;
}

// ---------------------------------------------------------------- "Nesta página"

/** Índice da página, montado a partir dos títulos h2 e h3, marcando a seção que está na tela. */
export function Toc() {
  const { pathname } = useLocation();
  const [items, setItems] = useState<{ id: string; text: string; level: number }[]>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const hs = [...document.querySelectorAll<HTMLElement>(".s-doc h2[id], .s-doc h3[id]")];
      setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? "", level: h.tagName === "H3" ? 3 : 2 })));
      const io = new IntersectionObserver(
        (entries) => {
          const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (vis[0]) setCurrent(vis[0].target.id);
        },
        { rootMargin: "-80px 0px -70% 0px" },
      );
      hs.forEach((h) => io.observe(h));
      cleanup = () => io.disconnect();
    }, 50);
    let cleanup = () => undefined as void;
    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, [pathname]);

  if (items.length < 2) return null;
  return (
    <nav className="k-toc" aria-label="Nesta página">
      <p className="k-toc__title">Nesta página</p>
      <ul>
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "is-sub" : undefined}>
            <a href={`#${it.id}`} aria-current={current === it.id ? "location" : undefined}>{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
