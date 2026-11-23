import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx";

export interface MenuItem {
  label: string;
  onSelect: () => void;
  /** Ícone de 16px antes do texto. */
  icon?: ReactNode;
  /** Ação que apaga ou cancela: aparece em vermelho e separada. */
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  /** Nome do botão. Diga de quê: "Ações do protocolo 2026-001043". */
  label: string;
  /** Texto visível no botão. Sem ele, o botão mostra "⋯" e o nome fica só para o leitor de tela. */
  buttonText?: string;
  align?: "start" | "end";
  className?: string;
}

/**
 * Menu de ações no padrão da WAI-ARIA: Enter, Espaço ou seta para baixo abrem;
 * setas andam entre as ações; Home e End vão às pontas; digitar uma letra pula para a ação;
 * Esc fecha e devolve o foco ao botão.
 */
export function Menu({ items, label, buttonText, align = "end", className }: MenuProps) {
  const base = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };

  // Posição fixa na tela, para não ser cortado por tabelas e caixas com rolagem.
  useLayoutEffect(() => {
    if (!open || !button.current || !list.current) return;
    const place = () => {
      const b = button.current!.getBoundingClientRect();
      const m = list.current!.getBoundingClientRect();
      let top = b.bottom + 4;
      if (top + m.height > window.innerHeight - 8) top = Math.max(8, b.top - m.height - 4);
      let left = align === "end" ? b.right - m.width : b.left;
      left = Math.min(Math.max(left, 8), window.innerWidth - m.width - 8);
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

  // Foco na ação ativa.
  useEffect(() => {
    if (open) list.current?.querySelectorAll<HTMLElement>("[role=menuitem]")[active]?.focus();
  }, [open, active, pos]);

  // Clique fora fecha.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!list.current?.contains(e.target as Node) && !button.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const move = (dir: 1 | -1) => {
    const at = enabled.indexOf(active);
    setActive(enabled[(at + dir + enabled.length) % enabled.length]);
  };

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") move(1);
    else if (e.key === "ArrowUp") move(-1);
    else if (e.key === "Home") setActive(enabled[0]);
    else if (e.key === "End") setActive(enabled[enabled.length - 1]);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") close(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      const after = [...enabled.filter((i) => i > active), ...enabled.filter((i) => i <= active)];
      const hit = after.find((i) => items[i].label.toLowerCase().startsWith(k));
      if (hit !== undefined) setActive(hit);
    } else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  const select = (i: number) => {
    const it = items[i];
    if (it.disabled) return;
    close();
    it.onSelect();
  };

  return (
    <div className={cx("hx-menu", className)}>
      <button
        ref={button}
        type="button"
        id={`${base}-btn`}
        className={cx("hx-menu__button", buttonText ? "hx-button hx-button--secondary" : "hx-iconbutton hx-iconbutton--ghost")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${base}-list` : undefined}
        aria-label={buttonText ? undefined : label}
        onClick={() => (open ? close() : openAt(enabled[0]))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openAt(enabled[0]);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            openAt(enabled[enabled.length - 1]);
          }
        }}
      >
        {buttonText ? (
          <>
            {buttonText}
            <svg className="hx-menu__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
          </>
        ) : (
          <span className="hx-iconbutton__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4.5" cy="10" r="1.6" /><circle cx="10" cy="10" r="1.6" /><circle cx="15.5" cy="10" r="1.6" /></svg>
          </span>
        )}
      </button>
      {open && (
        <ul
          ref={list}
          id={`${base}-list`}
          role="menu"
          aria-labelledby={`${base}-btn`}
          className="hx-menu__list"
          style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}
          onKeyDown={onListKey}
        >
          {items.map((it, i) => (
            <li key={i} role="none" className={cx(it.danger && i > 0 && !items[i - 1].danger && "hx-menu__sep")}>
              <button
                type="button"
                role="menuitem"
                tabIndex={i === active ? 0 : -1}
                aria-disabled={it.disabled || undefined}
                className={cx("hx-menu__item", it.danger && "is-danger")}
                onClick={() => select(i)}
                onMouseMove={() => !it.disabled && active !== i && setActive(i)}
              >
                {it.icon && <span className="hx-menu__icon" aria-hidden="true">{it.icon}</span>}
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
