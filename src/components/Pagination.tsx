import { cx } from "./cx";

export interface PaginationProps {
  /** Página atual, começando em 1. */
  page: number;
  /** Total de páginas. */
  pageCount: number;
  onChange: (page: number) => void;
  /** Com totalItems e pageSize, mostra "Mostrando 21 a 30 de 248". */
  totalItems?: number;
  pageSize?: number;
  /** O que está sendo listado, para o resumo: "protocolos". */
  itemLabel?: string;
  className?: string;
}

/** Números visíveis: primeira, última, a atual e uma de cada lado. O resto vira "…". */
function pages(page: number, count: number): (number | "gap")[] {
  const set = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(p - sorted[i - 1] === 2 ? p - 1 : "gap");
    out.push(p);
  });
  return out;
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"} />
  </svg>
);

/**
 * Navegação entre páginas de uma lista. No celular, mostra só "Página 3 de 12" com anterior e próxima.
 * A página atual é marcada com aria-current, e cada número diz "Página 4" ao leitor de tela.
 */
export function Pagination({ page, pageCount, onChange, totalItems, pageSize, itemLabel = "itens", className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const first = totalItems && pageSize ? (page - 1) * pageSize + 1 : 0;
  const last = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : 0;
  const fmt = (n: number) => n.toLocaleString("pt-BR");

  return (
    <nav className={cx("hx-pagination", className)} aria-label="Paginação">
      {totalItems !== undefined && pageSize && (
        <p className="hx-pagination__summary">
          Mostrando {fmt(first)} a {fmt(last)} de {fmt(totalItems)} {itemLabel}
        </p>
      )}
      <ul className="hx-pagination__list">
        <li>
          <button type="button" className="hx-pagination__btn hx-pagination__step" onClick={() => onChange(page - 1)} disabled={page === 1}>
            <Chevron dir="left" />
            <span>Anterior</span>
          </button>
        </li>
        {pages(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} className="hx-pagination__gap" aria-hidden="true">…</li>
          ) : (
            <li key={p} className="hx-pagination__num">
              <button
                type="button"
                className="hx-pagination__btn"
                aria-label={`Página ${p}`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li className="hx-pagination__where" aria-hidden="true">Página {page} de {pageCount}</li>
        <li>
          <button type="button" className="hx-pagination__btn hx-pagination__step" onClick={() => onChange(page + 1)} disabled={page === pageCount}>
            <span>Próxima</span>
            <Chevron dir="right" />
          </button>
        </li>
      </ul>
      {/* Avisa a página nova sem mover o foco. */}
      <p className="hx-sr" aria-live="polite">Página {page} de {pageCount}</p>
    </nav>
  );
}
