import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, useFieldIds } from "./field";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Texto ao lado da caixa. A linha inteira é clicável. */
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Estado "em parte", para "selecionar todos" quando só alguns estão marcados. */
  indeterminate?: boolean;
}

/** Caixa de seleção nativa, redesenhada. Caixa de 20px; a linha toda recebe o clique. */
export function Checkbox({ label, hint, error, id, indeterminate, className, ...rest }: CheckboxProps) {
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <div className={cx("hx-check", error ? "hx-check--invalid" : undefined, className)}>
      <label className="hx-check__row" htmlFor={fieldId}>
        <span className="hx-check__box">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            className="hx-check__input"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...rest}
          />
          <svg className="hx-check__mark" viewBox="0 0 16 16" aria-hidden="true">
            <path className="hx-check__tick" pathLength={1} d="M3.5 8.5l3 3 6-7" />
            <path className="hx-check__dash" d="M4 8h8" />
          </svg>
        </span>
        <span className="hx-check__label">{label}</span>
      </label>
      {hint && <div className="hx-check__extra"><FieldHint id={hintId} hint={hint} /></div>}
      <div className="hx-check__extra"><FieldError id={errorId} error={error} /></div>
    </div>
  );
}
