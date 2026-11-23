import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "./cx";

export interface DialogProps {
  open: boolean;
  /** Chamado ao fechar: botão Fechar, Esc ou clique fora. */
  onClose: () => void;
  /** Título. Vira o nome da janela para o leitor de tela. */
  title: ReactNode;
  /** Frase de apoio abaixo do título, também lida ao abrir. */
  description?: ReactNode;
  children?: ReactNode;
  /** Botões do rodapé. Coloque a ação principal por último. */
  actions?: ReactNode;
  /** false impede fechar clicando fora (use em formulários longos). */
  closeOnBackdrop?: boolean;
  className?: string;
}

/**
 * Janela modal com o <dialog> nativo: o navegador prende o foco dentro, deixa o fundo inerte,
 * fecha com Esc e devolve o foco para o botão que abriu.
 */
export function Dialog({ open, onClose, title, description, children, actions, closeOnBackdrop = true, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const base = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.classList.add("hx-dialog-open");
    } else if (!open && d.open) {
      d.close();
    }
    return () => document.documentElement.classList.remove("hx-dialog-open");
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("hx-dialog", className)}
      aria-labelledby={`${base}-title`}
      aria-describedby={description ? `${base}-desc` : undefined}
      onClose={() => {
        document.documentElement.classList.remove("hx-dialog-open");
        onClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === ref.current) onClose();
      }}
    >
      <div className="hx-dialog__box">
        <header className="hx-dialog__head">
          <h2 id={`${base}-title`} className="hx-dialog__title">{title}</h2>
          <button type="button" className="hx-dialog__close" onClick={onClose} aria-label="Fechar">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </header>
        {description && <p id={`${base}-desc`} className="hx-dialog__desc">{description}</p>}
        {children && <div className="hx-dialog__body">{children}</div>}
        {actions && <footer className="hx-dialog__actions">{actions}</footer>}
      </div>
    </dialog>
  );
}
