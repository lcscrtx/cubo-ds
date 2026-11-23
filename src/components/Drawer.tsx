import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "./cx";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Botões presos no rodapé do painel. */
  actions?: ReactNode;
  /** Largura em telas grandes. No celular, ocupa a tela toda. */
  size?: "md" | "lg";
  className?: string;
}

/**
 * Painel lateral para ver ou editar algo sem sair da lista: os detalhes de um protocolo, filtros.
 * Mesmo comportamento do Dialog (o <dialog> nativo prende o foco, Esc fecha e o foco volta),
 * entrando pela direita.
 */
export function Drawer({ open, onClose, title, description, children, actions, size = "md", className }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const base = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.classList.add("hx-dialog-open");
    } else if (!open && d.open) d.close();
    return () => document.documentElement.classList.remove("hx-dialog-open");
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("hx-drawer", `hx-drawer--${size}`, className)}
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
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="hx-drawer__panel">
        <header className="hx-drawer__head">
          <div>
            <h2 id={`${base}-title`} className="hx-drawer__title">{title}</h2>
            {description && <p id={`${base}-desc`} className="hx-drawer__desc">{description}</p>}
          </div>
          <button type="button" className="hx-dialog__close" onClick={onClose} aria-label="Fechar painel">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </header>
        <div className="hx-drawer__body">{children}</div>
        {actions && <footer className="hx-drawer__actions">{actions}</footer>}
      </div>
    </dialog>
  );
}
