import { useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, RequiredMark, useFieldIds } from "./field";

export interface DateFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Data no formato ISO (aaaa-mm-dd). */
  value?: string;
  defaultValue?: string;
  /** Recebe a data ISO, ou "" se incompleta ou inválida. */
  onChange?: (iso: string) => void;
  /** Datas mínima e máxima, ISO. */
  min?: string;
  max?: string;
  /** Mostra o botão que abre o calendário do sistema. */
  calendar?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
}

const toBR = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : "");
const fmtBR = (iso: string) => toBR(iso);

function mask(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join("/");
}

function toISO(br: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (date.getFullYear() !== Number(yyyy) || date.getMonth() !== Number(mm) - 1 || date.getDate() !== Number(dd)) return "";
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Data digitada, que é o jeito mais rápido e acessível para datas conhecidas (nascimento, emissão).
 * O botão de calendário é opcional e abre o seletor do próprio sistema, que já é acessível.
 */
export function DateField({ label, hint = "Dia, mês e ano. Exemplo: 25/09/1980.", error, required, value, defaultValue = "", onChange, min, max, calendar, id, name, autoComplete, className }: DateFieldProps) {
  const [text, setText] = useState(toBR(value ?? defaultValue));
  const [ownError, setOwnError] = useState<string | null>(null);
  const shownError = error ?? ownError;
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, shownError);
  const native = useRef<HTMLInputElement>(null);
  const shown = value !== undefined && toISO(text) !== value ? toBR(value) || text : text;

  const check = (br: string) => {
    if (!br) return null;
    const iso = toISO(br);
    if (!iso) return "Data inválida. Use dia, mês e ano: 25/09/1980.";
    if (min && iso < min) return `A data precisa ser a partir de ${fmtBR(min)}.`;
    if (max && iso > max) return `A data precisa ser até ${fmtBR(max)}.`;
    return null;
  };

  const set = (br: string) => {
    setText(br);
    const iso = toISO(br);
    if (ownError && !check(br)) setOwnError(null);
    onChange?.(iso);
  };

  return (
    <div className={cx("hx-field", shownError ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={fieldId}>
        {label}
        {required && <RequiredMark />}
      </label>
      <FieldHint id={hintId} hint={hint} />
      <div className="hx-date">
        <input
          id={fieldId}
          name={name}
          className="hx-field__input hx-date__input"
          inputMode="numeric"
          autoComplete={autoComplete}
          placeholder="dd/mm/aaaa"
          maxLength={10}
          required={required}
          value={shown}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => set(mask(e.target.value))}
          onBlur={() => setOwnError(check(shown))}
        />
        {calendar && (
          <>
            <button
              type="button"
              className="hx-date__btn"
              onClick={() => {
                const el = native.current;
                if (!el) return;
                el.value = toISO(shown);
                try {
                  el.showPicker();
                } catch {
                  el.focus();
                }
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
                <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
              </svg>
              <span className="hx-sr">Abrir calendário</span>
            </button>
            {/* Calendário nativo, escondido: só abre pelo botão. */}
            <input
              ref={native}
              type="date"
              className="hx-date__native"
              tabIndex={-1}
              aria-hidden="true"
              min={min}
              max={max}
              onChange={(e) => {
                const br = toBR(e.target.value);
                set(br);
                setOwnError(check(br));
                document.getElementById(fieldId)?.focus();
              }}
            />
          </>
        )}
      </div>
      <FieldError id={errorId} error={shownError} />
    </div>
  );
}
