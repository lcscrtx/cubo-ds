import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";

export interface PopoverProps {
  /** Texto do botão que abre. */
  trigger: ReactNode;
  /** Variante do botão. */
  triggerVariant?: "secondary" | "ghost";
  /** Título do painel. */
  title?: ReactNode;
  /** Conteúdo: pode ter links, campos e botões (diferente da Tooltip). */
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}

/**
 * Painel pequeno que abre ao lado de um botão, sem bloquear a página: filtros rápidos,
 * explicação com link, escolha de colunas. Botão com aria-expanded; o painel vem logo depois
 * dele na ordem do Tab; Esc e clique fora fecham, e o foco volta ao botão.
 */
export function Popover({ trigger, triggerVariant = "secondary", title, children, align = "start", className }: PopoverProps) {
  const base = useId();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const close = (focus = true) => {
    setOpen(false);
    if (focus) btn.current?.focus();
  };

  useLayoutEffect(() => {
    if (!open || !btn.current || !panel.current) return;
    const place = () => {
      const b = btn.current!.getBoundingClientRect();
      const p = panel.current!.getBoundingClientRect();
      let top = b.bottom + 6;
      if (top + p.height > window.innerHeight - 8) top = Math.max(8, b.top - p.height - 6);
      let left = align === "end" ? b.right - p.width : b.left;
      left = Math.min(Math.max(left, 8), window.innerWidth - p.width - 8);
      setPos({ top, left });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className={cx("hx-popover", className)}>
      <button
        ref={btn}
        type="button"
        className={cx("hx-button", `hx-button--${triggerVariant}`)}
        aria-expanded={open}
        aria-controls={`${base}-panel`}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {trigger}
        <svg className="hx-menu__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      <div
        ref={panel}
        id={`${base}-panel`}
        role="region"
        aria-labelledby={title ? `${base}-title` : undefined}
        aria-label={title ? undefined : typeof trigger === "string" ? trigger : undefined}
        className="hx-popover__panel"
        hidden={!open}
        style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}
      >
        {title && <p id={`${base}-title`} className="hx-popover__title">{title}</p>}
        {children}
      </div>
    </div>
  );
}
