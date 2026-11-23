import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, RequiredMark, useFieldIds } from "./field";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Texto menor abaixo, como a secretaria responsável. */
  description?: string;
}

export interface ComboboxProps {
  label: ReactNode;
  options: ComboboxOption[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  placeholder?: string;
  /** Mensagem quando nada combina com o que foi digitado. */
  emptyText?: string;
  id?: string;
  className?: string;
}

/** Sem acento e em minúsculas: "saude" acha "Saúde". */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Lista com busca, para muitas opções (os 600 serviços da Carta, os bairros da cidade).
 * Padrão combobox da WAI-ARIA: digite para filtrar, setas para andar, Enter para escolher, Esc para fechar.
 * A busca ignora acentos e o número de resultados é anunciado.
 */
export function Combobox({ label, options, value, onChange, hint, error, required, placeholder = "Digite para buscar", emptyText = "Nada encontrado. Tente outra palavra.", id, className }: ComboboxProps) {
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error);
  const listId = `${fieldId}-list`;
  const selected = options.find((o) => o.value === value) ?? null;
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const live = useId();
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);

  // Lista em posição fixa na tela: não é cortada por caixas com rolagem e abre para cima se faltar espaço.
  useLayoutEffect(() => {
    if (!open || !boxRef.current) return;
    const place = () => {
      const r = boxRef.current!.querySelector("input")!.getBoundingClientRect();
      const below = window.innerHeight - r.bottom - 12;
      const above = r.top - 12;
      const up = below < 200 && above > below;
      const maxHeight = Math.min(280, up ? above : below);
      setPos({ top: up ? r.top - 4 - maxHeight : r.bottom + 4, left: r.left, width: r.width, maxHeight });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [selected?.label, open]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q || (selected && query === selected.label)) return options;
    return options.filter((o) => norm(o.label).includes(q) || (o.description && norm(o.description).includes(q)));
  }, [query, options, selected]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (o: ComboboxOption) => {
    onChange?.(o.value);
    setQuery(o.label);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault();
      choose(filtered[active]);
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else {
        setQuery("");
        onChange?.(null);
      }
    }
  };

  const count = filtered.length;
  return (
    <div className={cx("hx-field hx-combobox", error ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={fieldId}>
        {label}
        {required && <RequiredMark />}
      </label>
      <FieldHint id={hintId} hint={hint} />
      <div ref={boxRef} className="hx-combobox__box">
        <input
          id={fieldId}
          className="hx-field__input hx-combobox__input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            if (selected && e.target.value !== selected.label) onChange?.(null);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKey}
        />
        <svg className="hx-combobox__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
        <ul ref={listRef} id={listId} role="listbox" aria-label={typeof label === "string" ? label : undefined} className="hx-combobox__list" hidden={!open} style={pos ? { top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight } : undefined}>
          {count === 0 ? (
            <li className="hx-combobox__empty" role="option" aria-disabled="true" aria-selected="false">{emptyText}</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={o.value === value}
                className={cx("hx-combobox__option", i === active && "is-active")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
                onMouseMove={() => active !== i && setActive(i)}
              >
                <span className="hx-combobox__opt-label">{o.label}</span>
                {o.description && <span className="hx-combobox__opt-desc">{o.description}</span>}
                {o.value === value && (
                  <svg className="hx-combobox__check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
      <p id={live} className="hx-sr" aria-live="polite">
        {open && query && !(selected && query === selected.label) ? (count ? `${count} ${count === 1 ? "opção" : "opções"}` : emptyText) : ""}
      </p>
      <FieldError id={errorId} error={error} />
    </div>
  );
}
