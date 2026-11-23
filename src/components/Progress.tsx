import { useId, type ReactNode } from "react";
import { cx } from "./cx";

export interface ProgressProps {
  /** O que está andando: "Envio dos documentos". */
  label: ReactNode;
  /** 0 a max. Sem valor, é progresso indeterminado (não se sabe quanto falta). */
  value?: number;
  max?: number;
  /** Texto do andamento, no lugar da porcentagem: "3 de 5 arquivos". */
  valueText?: string;
  tone?: "action" | "success" | "warning" | "danger";
  className?: string;
}

/**
 * Barra de andamento. O número aparece escrito ao lado do rótulo, não só na barra,
 * e o leitor de tela ouve o mesmo texto.
 */
export function Progress({ label, value, max = 100, valueText, tone = "action", className }: ProgressProps) {
  const id = useId();
  const known = value !== undefined;
  const pct = known ? Math.round((Math.min(Math.max(value, 0), max) / max) * 100) : 0;
  const text = valueText ?? (known ? `${pct}%` : "Em andamento");
  return (
    <div className={cx("hx-progress", `hx-progress--${tone}`, !known && "hx-progress--indeterminate", className)}>
      <div className="hx-progress__head">
        <span id={id} className="hx-progress__label">{label}</span>
        <span className="hx-progress__value" aria-hidden="true">{text}</span>
      </div>
      <div
        className="hx-progress__track"
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? max : undefined}
        aria-valuenow={known ? value : undefined}
        aria-valuetext={text}
      >
        <span className="hx-progress__fill" style={known ? { width: `${pct}%` } : undefined} />
      </div>
    </div>
  );
}
