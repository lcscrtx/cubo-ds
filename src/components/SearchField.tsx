import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange" | "value" | "defaultValue"> {
  /** Rótulo. Visível por padrão. */
  label: ReactNode;
  /** Esconde o rótulo da tela (o leitor de tela continua lendo). Só quando a lupa e o contexto já deixam claro. */
  hideLabel?: boolean;
  value?: string;
  defaultValue?: string;
  /** A cada tecla. */
  onChange?: (value: string) => void;
  /** Ao apertar Enter ou o botão Buscar. */
  onSearch?: (value: string) => void;
  /** Resultado da busca, anunciado ao leitor de tela: "12 protocolos encontrados". */
  resultsText?: string;
  /** Mostra o botão "Buscar" ao lado. Use quando a busca não for automática. */
  submitButton?: boolean;
}

/**
 * Campo de busca dentro de um formulário com role="search". Tem botão de limpar quando há texto,
 * e anuncia quantos resultados vieram, sem mover o foco.
 */
export function SearchField({ label, hideLabel, value, defaultValue = "", onChange, onSearch, resultsText, submitButton, id, className, placeholder, ...rest }: SearchFieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const ref = useRef<HTMLInputElement>(null);

  const set = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(current);
  };

  return (
    <form role="search" aria-labelledby={`${inputId}-label`} className={cx("hx-search", className)} onSubmit={submit}>
      <label id={`${inputId}-label`} htmlFor={inputId} className={cx("hx-field__label", hideLabel && "hx-sr")}>{label}</label>
      <div className="hx-search__row">
        <div className="hx-search__box">
          <svg className="hx-search__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <input
            ref={ref}
            id={inputId}
            type="search"
            className="hx-field__input hx-search__input"
            value={current}
            placeholder={placeholder}
            onChange={(e) => set(e.target.value)}
            autoComplete="off"
            {...rest}
          />
          {current && (
            <button
              type="button"
              className="hx-search__clear"
              aria-label="Limpar busca"
              onClick={() => {
                set("");
                onSearch?.("");
                ref.current?.focus();
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
            </button>
          )}
        </div>
        {submitButton && <button type="submit" className="hx-button hx-button--primary">Buscar</button>}
      </div>
      <p className="hx-search__results" aria-live="polite">{resultsText}</p>
    </form>
  );
}
