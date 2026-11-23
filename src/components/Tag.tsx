import type { ReactNode } from "react";
import { cx } from "./cx";

export interface TagProps {
  children: ReactNode;
  /** Mostra o X para remover. O nome do botão inclui o texto da etiqueta. */
  onRemove?: () => void;
  /** Texto usado no botão de remover: "Remover filtro Saúde". */
  removeLabel?: string;
  className?: string;
}

/** Etiqueta de um filtro aplicado, que pode ser removida. */
export function Tag({ children, onRemove, removeLabel, className }: TagProps) {
  return (
    <span className={cx("hx-tag", className)}>
      <span className="hx-tag__text">{children}</span>
      {onRemove && (
        <button type="button" className="hx-tag__remove" onClick={onRemove} aria-label={removeLabel ?? `Remover ${typeof children === "string" ? children : "filtro"}`}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 5l6 6M11 5l-6 6" /></svg>
        </button>
      )}
    </span>
  );
}

export interface FilterChipProps {
  children: ReactNode;
  selected: boolean;
  onChange: (selected: boolean) => void;
  /** Quantos resultados o filtro tem. */
  count?: number;
  className?: string;
}

/** Botão de filtro que liga e desliga, como "Saúde" ou "Atrasados". Marcado ganha check, não só cor. */
export function FilterChip({ children, selected, onChange, count, className }: FilterChipProps) {
  return (
    <button type="button" className={cx("hx-chip", className)} aria-pressed={selected} onClick={() => onChange(!selected)}>
      <svg className="hx-chip__check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
      {children}
      {count !== undefined && <span className="hx-chip__count">{count}</span>}
    </button>
  );
}
