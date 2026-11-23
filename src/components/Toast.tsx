import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "./cx";
import { StatusIcon, type StatusIconName } from "./StatusIcon";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  /** Uma ação, como "Desfazer". */
  action?: { label: string; onClick: () => void };
  /** Tempo na tela, em ms. Padrão 6000. Erro nunca some sozinho. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const ICONE: Record<ToastTone, StatusIconName> = { info: "info", success: "concluido", warning: "alerta", danger: "indeferido" };
const PADRAO_MS = 6000;
const MAX_NA_TELA = 3;

/** Avisos rápidos. Use useToast() dentro dele para mostrar um aviso. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const next = useRef(1);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const show = useCallback((options: ToastOptions) => {
    const id = next.current++;
    setItems((list) => [...list, { ...options, id }].slice(-MAX_NA_TELA));
    return id;
  }, []);
  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const polite = items.filter((t) => t.tone !== "danger");
  const urgent = items.filter((t) => t.tone === "danger");

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* As regiões existem desde o início, vazias: assim o leitor de tela anuncia o que entrar nelas. */}
      <section className="hx-toasts" aria-label="Notificações">
        <div role="status" aria-live="polite" className="hx-toasts__region">
          {polite.map((t) => <Toast key={t.id} item={t} onDismiss={dismiss} />)}
        </div>
        <div role="alert" aria-live="assertive" className="hx-toasts__region">
          {urgent.map((t) => <Toast key={t.id} item={t} onDismiss={dismiss} />)}
        </div>
      </section>
    </ToastContext.Provider>
  );
}

/** Mostra avisos rápidos: const toast = useToast(); toast.show({ tone: "success", title: "Salvo" }). */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  return ctx;
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const tone = item.tone ?? "info";
  const autoClose = tone !== "danger";
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration ?? PADRAO_MS);
  const startedAt = useRef(0);

  // Conta o tempo só enquanto ninguém está lendo: pausa com mouse ou foco em cima (WCAG 2.2.1).
  useEffect(() => {
    if (!autoClose || paused) return;
    startedAt.current = Date.now();
    const t = setTimeout(() => onDismiss(item.id), remaining.current);
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [autoClose, paused, item.id, onDismiss]);

  return (
    <div
      className={cx("hx-toast", `hx-toast--${tone}`)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <StatusIcon name={ICONE[tone]} className="hx-toast__icon" />
      <div className="hx-toast__body">
        <p className="hx-toast__title">{item.title}</p>
        {item.description && <p className="hx-toast__desc">{item.description}</p>}
      </div>
      <div className="hx-toast__end">
        {item.action && (
          <button
            type="button"
            className="hx-toast__action"
            onClick={() => {
              item.action!.onClick();
              onDismiss(item.id);
            }}
          >
            {item.action.label}
          </button>
        )}
        <button type="button" className="hx-toast__close" aria-label="Fechar aviso" onClick={() => onDismiss(item.id)}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
      </div>
      {autoClose && <span className={cx("hx-toast__timer", paused && "is-paused")} style={{ animationDuration: `${item.duration ?? PADRAO_MS}ms` }} aria-hidden="true" />}
    </div>
  );
}
