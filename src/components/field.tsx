// Peças comuns dos campos: ids ligados, rótulo com "(obrigatório)", ajuda antes do campo
// e erro com ícone, anunciado quando aparece. Uso interno; não exportado no pacote.
import { useId, type ReactNode } from "react";

export function useFieldIds(id: string | undefined, hint: ReactNode, error: ReactNode) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = `${fieldId}-error`;
  const describedBy = [hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
  return { fieldId, hintId, errorId, describedBy };
}

export function RequiredMark() {
  return <span className="hx-field__req"> (obrigatório)</span>;
}

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4.8v3.6M8 11v.01" />
  </svg>
);

/** Região sempre presente, para o leitor de tela anunciar o erro quando ele surgir. */
export function FieldError({ id, error }: { id: string; error: ReactNode }) {
  return (
    <p id={id} className="hx-field__error" aria-live="polite">
      {error && (
        <>
          <ErrorIcon />
          <span>{error}</span>
        </>
      )}
    </p>
  );
}

export function FieldHint({ id, hint }: { id?: string; hint: ReactNode }) {
  return hint ? <p id={id} className="hx-field__hint">{hint}</p> : null;
}
