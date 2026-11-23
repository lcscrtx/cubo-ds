import type { ReactNode } from "react";
import { cx } from "./cx";

export interface StatProps {
  /** O que é medido: "Solicitações concluídas". */
  label: ReactNode;
  /** O número, já formatado: "188.402", "79,6%". */
  value: ReactNode;
  /** Variação em relação ao período anterior, em %. Positivo sobe, negativo desce. */
  change?: number;
  /** Período comparado: "outubro". */
  comparedTo?: string;
  /** true quando subir é ruim (tempo de espera, reclamações): a cor se inverte. */
  invert?: boolean;
  /** Linha de apoio: "Em 2025". */
  help?: ReactNode;
  className?: string;
}

/**
 * Indicador do painel do gestor. A variação vem com seta, sinal e texto
 * ("Subiu 12% em relação a outubro"), e a cor diz se é bom ou ruim, nunca sozinha.
 */
export function Stat({ label, value, change, comparedTo, invert, help, className }: StatProps) {
  const dir = change === undefined || change === 0 ? "flat" : change > 0 ? "up" : "down";
  const good = dir === "flat" ? null : (dir === "up") !== Boolean(invert);
  const pct = change === undefined ? "" : Math.abs(change).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const verbo = dir === "up" ? "Subiu" : dir === "down" ? "Caiu" : "Ficou igual";
  return (
    <div className={cx("hx-stat", className)}>
      <p className="hx-stat__label">{label}</p>
      <p className="hx-stat__value">{value}</p>
      {change !== undefined && (
        <p className={cx("hx-stat__change", good === true && "is-good", good === false && "is-bad")}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dir === "up" && <path d="M8 13V3M4 7l4-4 4 4" />}
            {dir === "down" && <path d="M8 3v10M4 9l4 4 4-4" />}
            {dir === "flat" && <path d="M3 8h10" />}
          </svg>
          <span>
            {verbo}
            {dir !== "flat" && ` ${pct}%`}
            {comparedTo && <span className="hx-stat__vs"> em relação a {comparedTo}</span>}
          </span>
        </p>
      )}
      {help && <p className="hx-stat__help">{help}</p>}
    </div>
  );
}
