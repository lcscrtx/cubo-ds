import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Rótulo visível. Nunca use só o placeholder no lugar dele. */
  label: ReactNode;
  /** Texto de ajuda abaixo do campo. Diga o formato esperado aqui, não no placeholder. */
  hint?: ReactNode;
  /** Mensagem de erro. Diga o que fazer para corrigir. Marca o campo como inválido. */
  error?: ReactNode;
}

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4.8v3.6M8 11v.01" />
  </svg>
);

/**
 * Campo de texto. Rótulo, ajuda e erro ligados por aria; obrigatório escrito por extenso;
 * erro com ícone e texto (não só cor) e anunciado ao aparecer. 36px de altura.
 */
export function TextField({ label, hint, error, id, required, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = `${inputId}-error`;
  return (
    <div className={cx("hx-field", error ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={inputId}>
        {label}
        {required && <span className="hx-field__req"> (obrigatório)</span>}
      </label>
      {hint && <p id={hintId} className="hx-field__hint">{hint}</p>}
      <input
        id={inputId}
        className="hx-field__input"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
        {...rest}
      />
      {/* Região sempre presente para o leitor de tela anunciar o erro quando ele surgir. */}
      <p id={errorId} className="hx-field__error" aria-live="polite">
        {error && (
          <>
            <ErrorIcon />
            <span>{error}</span>
          </>
        )}
      </p>
    </div>
  );
}
