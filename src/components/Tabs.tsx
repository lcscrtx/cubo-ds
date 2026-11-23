import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx";

export interface TabItem {
  id: string;
  label: ReactNode;
  /** Número ao lado do rótulo, como "Pendentes 12". */
  count?: number;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Nome do conjunto de abas, lido pelo leitor de tela ("Situação do protocolo"). */
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Abas no padrão da WAI-ARIA: Tab entra na aba ativa e depois no conteúdo;
 * setas trocam de aba; Home e End vão para a primeira e a última.
 */
export function Tabs({ items, label, value, defaultValue, onChange, className }: TabsProps) {
  const base = useId();
  const enabled = items.filter((i) => !i.disabled);
  const [inner, setInner] = useState(defaultValue ?? enabled[0]?.id);
  const active = value ?? inner;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string, focus = false) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
    if (focus) refs.current[id]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const idx = enabled.findIndex((i) => i.id === active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % enabled.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = enabled.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(enabled[next].id, true);
    }
  };

  return (
    <div className={cx("hx-tabs", className)}>
      <div className="hx-tabs__list" role="tablist" aria-label={label} onKeyDown={onKey}>
        {items.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-controls={`${base}-panel-${t.id}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              disabled={t.disabled}
              className="hx-tabs__tab"
              onClick={() => select(t.id)}
            >
              {t.label}
              {t.count !== undefined && <span className="hx-tabs__count">{t.count}</span>}
            </button>
          );
        })}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="hx-tabs__panel"
        >
          {t.id === active && t.content}
        </div>
      ))}
    </div>
  );
}
