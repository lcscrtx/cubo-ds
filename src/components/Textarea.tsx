import { useState, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, RequiredMark, useFieldIds } from "./field";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Rótulo visível. */
  label: ReactNode;
  /** Ajuda antes do campo. */
  hint?: ReactNode;
  /** Mensagem de erro. Diga o que fazer para corrigir. */
  error?: ReactNode;
}

/** A partir de quantos caracteres restantes o contador passa a ser anunciado. */
const AVISO_RESTANTES = 20;

/**
 * Campo de texto longo. Com `maxLength`, mostra um contador; o leitor de tela só é avisado
 * quando faltam poucos caracteres, para não interromper a cada tecla.
 */
export function Textarea({ label, hint, error, id, required, maxLength, rows = 4, className, onChange, defaultValue, value, ...rest }: TextareaProps) {
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
  const [count, setCount] = useState(String(value ?? defaultValue ?? "").length);
  const counterId = maxLength ? `${fieldId}-count` : undefined;
  const restantes = maxLength ? maxLength - count : 0;
  const perto = maxLength !== undefined && restantes <= AVISO_RESTANTES;

  return (
    <div className={cx("hx-field", error ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={fieldId}>
        {label}
        {required && <RequiredMark />}
      </label>
      <FieldHint id={hintId} hint={hint} />
      <textarea
        id={fieldId}
        className="hx-field__input hx-textarea"
        rows={rows}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy, counterId].filter(Boolean).join(" ") || undefined}
        onChange={(e) => {
          setCount(e.target.value.length);
          onChange?.(e);
        }}
        {...rest}
      />
      {maxLength !== undefined && (
        <p id={counterId} className={cx("hx-textarea__count", perto && "is-near")} aria-live={perto ? "polite" : "off"}>
          {perto ? `Restam ${restantes} de ${maxLength} caracteres` : `${count} de ${maxLength} caracteres`}
        </p>
      )}
      <FieldError id={errorId} error={error} />
    </div>
  );
}
