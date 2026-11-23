import type { ReactNode, SelectHTMLAttributes } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, RequiredMark, useFieldIds } from "./field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Opções. Também aceita <option> como filhos. */
  options?: SelectOption[];
  /** Texto da primeira opção vazia, por exemplo "Escolha a secretaria". */
  placeholder?: string;
}

/**
 * Lista de escolha. Usa o <select> nativo: é o que melhor funciona com leitor de tela,
 * teclado e celular (abre o seletor do próprio sistema).
 */
export function Select({ label, hint, error, id, required, options, placeholder, className, children, defaultValue, value, ...rest }: SelectProps) {
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
  return (
    <div className={cx("hx-field", error ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={fieldId}>
        {label}
        {required && <RequiredMark />}
      </label>
      <FieldHint id={hintId} hint={hint} />
      <div className="hx-select">
        <select
          id={fieldId}
          className="hx-field__input hx-select__control"
          required={required}
          value={value}
          defaultValue={value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>
          ))}
          {children}
        </select>
        <svg className="hx-select__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </div>
      <FieldError id={errorId} error={error} />
    </div>
  );
}
