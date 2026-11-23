import { useId, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, RequiredMark } from "./field";

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Explicação curta abaixo da opção. */
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Pergunta do grupo. Vira a <legend> do <fieldset>, lida antes de cada opção. */
  legend: ReactNode;
  options: RadioOption[];
  /** Nome do grupo no formulário. Gerado se não vier. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Opções lado a lado em vez de uma embaixo da outra. Use só com 2 ou 3 opções curtas. */
  inline?: boolean;
  className?: string;
}

/**
 * Escolha única entre poucas opções. <fieldset> com <legend> para o leitor de tela dizer a pergunta;
 * setas do teclado andam entre as opções (comportamento nativo).
 */
export function RadioGroup({ legend, options, name, value, defaultValue, onChange, hint, error, required, inline, className }: RadioGroupProps) {
  const base = useId();
  const groupName = name ?? base;
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = `${base}-error`;
  const describedBy = [hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cx("hx-radio-group", inline && "hx-radio-group--inline", error ? "hx-radio-group--invalid" : undefined, className)}
      aria-describedby={describedBy}
    >
      <legend className="hx-field__label">
        {legend}
        {required && <RequiredMark />}
      </legend>
      {hint && <p id={hintId} className="hx-field__hint">{hint}</p>}
      <div className="hx-radio-group__options">
        {options.map((o) => {
          const id = `${base}-${o.value}`;
          const optHint = o.hint ? `${id}-hint` : undefined;
          return (
            <div className="hx-radio" key={o.value}>
              <label className="hx-check__row" htmlFor={id}>
                <span className="hx-radio__dot">
                  <input
                    id={id}
                    type="radio"
                    className="hx-check__input"
                    name={groupName}
                    value={o.value}
                    disabled={o.disabled}
                    required={required}
                    checked={value === undefined ? undefined : value === o.value}
                    defaultChecked={value === undefined && defaultValue !== undefined ? defaultValue === o.value : undefined}
                    onChange={() => onChange?.(o.value)}
                    aria-describedby={optHint}
                    aria-invalid={error ? true : undefined}
                  />
                </span>
                <span className="hx-check__label">{o.label}</span>
              </label>
              {o.hint && <p id={optHint} className="hx-field__hint hx-check__extra">{o.hint}</p>}
            </div>
          );
        })}
      </div>
      <FieldError id={errorId} error={error} />
    </fieldset>
  );
}
