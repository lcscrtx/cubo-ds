import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cx } from "./cx";

export interface TooltipProps {
  /** Texto curto da dica. Nada clicável dentro. */
  content: ReactNode;
  /** O elemento que recebe a dica. Precisa receber foco (botão, link). */
  children: ReactElement<Record<string, unknown>>;
  /** Lado preferido. */
  side?: "top" | "bottom";
  /**
   * description: a dica complementa o nome do elemento (aria-describedby).
   * label: a dica É o nome (aria-labelledby), para botões só de ícone.
   */
  as?: "description" | "label";
}

/**
 * Dica que aparece no hover e no foco do teclado. Segue a WCAG 1.4.13:
 * dá para passar o mouse por cima dela sem que suma, Esc fecha, e ela fica até a pessoa sair.
 */
export function Tooltip({ content, children, side = "top", as = "description" }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Pequena espera ao sair, para o mouse conseguir chegar até a dica.
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Posição fixa na tela: a dica não é cortada por caixas com rolagem e nunca sai da tela.
  const anchor = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; side: "top" | "bottom" } | null>(null);
  useLayoutEffect(() => {
    if (!open || !anchor.current || !bubble.current) return;
    const place = () => {
      const a = anchor.current!.getBoundingClientRect();
      const b = bubble.current!.getBoundingClientRect();
      const gap = 8;
      const margin = 8;
      // Vira para o outro lado se não couber.
      let s = side;
      if (s === "top" && a.top - b.height - gap < margin) s = "bottom";
      if (s === "bottom" && a.bottom + b.height + gap > window.innerHeight - margin) s = "top";
      const top = s === "top" ? a.top - b.height - gap : a.bottom + gap;
      const left = Math.min(Math.max(a.left + a.width / 2 - b.width / 2, margin), window.innerWidth - b.width - margin);
      setPos({ top, left, side: s });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, side]);

  const aria = as === "label" ? { "aria-labelledby": id } : { "aria-describedby": id };

  return (
    <span ref={anchor} className="hx-tooltip" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {cloneElement(children, aria)}
      {/* Sempre no DOM, para o nome e a descrição funcionarem mesmo com a dica fechada. */}
      <span
        ref={bubble}
        id={id}
        role="tooltip"
        className={cx("hx-tooltip__bubble", `hx-tooltip__bubble--${pos?.side ?? side}`, open && pos && "is-open")}
        style={pos ? { top: pos.top, left: pos.left } : undefined}
      >
        {content}
      </span>
    </span>
  );
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Nome do botão, obrigatório: vira a dica e o que o leitor de tela fala ("Imprimir protocolo"). */
  label: string;
  /** O ícone, 16 a 20px. */
  icon: ReactNode;
  variant?: "ghost" | "secondary";
  side?: "top" | "bottom";
}

/** Botão só de ícone. O nome é obrigatório e aparece como dica no hover e no foco. */
export function IconButton({ label, icon, variant = "ghost", side = "top", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <Tooltip content={label} side={side} as="label">
      <button type={type} className={cx("hx-iconbutton", `hx-iconbutton--${variant}`, className)} {...rest}>
        <span className="hx-iconbutton__icon" aria-hidden="true">{icon}</span>
      </button>
    </Tooltip>
  );
}
