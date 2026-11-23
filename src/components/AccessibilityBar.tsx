import { useEffect, useState, type ReactNode } from "react";
import { cx } from "./cx";

export interface AccessibilityPrefs {
  contrast: boolean;
  reduceMotion: boolean;
  /** 0 normal, 1 maior, 2 muito maior. */
  text: 0 | 1 | 2;
  /** auto segue o sistema; light e dark são escolhas da pessoa. */
  theme: "auto" | "light" | "dark";
}

const KEY = "hx-a11y-prefs";
const DEFAULT: AccessibilityPrefs = { contrast: false, reduceMotion: false, text: 0, theme: "auto" };

function read(): AccessibilityPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* sem storage */
  }
  return DEFAULT;
}

/**
 * Guarda as preferências no navegador e aplica no <html>:
 * data-contrast="more", data-motion="reduce", data-text="1|2" e data-theme="auto|light|dark",
 * que o Hexagon inteiro entende.
 */
export function useAccessibilityPrefs() {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(read);
  useEffect(() => {
    const html = document.documentElement;
    prefs.contrast ? html.setAttribute("data-contrast", "more") : html.removeAttribute("data-contrast");
    prefs.reduceMotion ? html.setAttribute("data-motion", "reduce") : html.removeAttribute("data-motion");
    prefs.text ? html.setAttribute("data-text", String(prefs.text)) : html.removeAttribute("data-text");
    html.setAttribute("data-theme", prefs.theme);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignora */
    }
  }, [prefs]);
  return [prefs, setPrefs] as const;
}

export interface AccessibilityBarProps {
  prefs: AccessibilityPrefs;
  onChange: (prefs: AccessibilityPrefs) => void;
  /** Link para a página de acessibilidade do órgão. */
  policyHref?: string;
  policyLabel?: string;
  /** Botões a mais na barra, como os do assistente de compreensão. Ficam antes do link. */
  children?: ReactNode;
  className?: string;
}

/** true quando o tema escuro está valendo, por escolha ou pelo sistema. */
function useIsDark(theme: AccessibilityPrefs["theme"]) {
  const [system, setSystem] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => setSystem(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return theme === "dark" || (theme === "auto" && system);
}

/**
 * Barra de acessibilidade no topo, como nos sites do governo: tamanho do texto,
 * mais contraste, pausar animações e tema escuro. Cada botão diz se está ligado (aria-pressed).
 */
export function AccessibilityBar({ prefs, onChange, policyHref, policyLabel = "Acessibilidade", children, className }: AccessibilityBarProps) {
  const set = (p: Partial<AccessibilityPrefs>) => onChange({ ...prefs, ...p });
  const isDark = useIsDark(prefs.theme ?? "auto");
  return (
    <div className={cx("hx-a11ybar", className)} role="region" aria-label="Opções de acessibilidade">
      <div className="hx-a11ybar__in">
        <span className="hx-a11ybar__title" aria-hidden="true">
          <svg viewBox="0 0 16 16"><circle cx="8" cy="3" r="1.6" fill="currentColor" /><path d="M2.5 5.5L8 6.6l5.5-1.1M8 6.6v3.6M8 10.2l-2.4 4.3M8 10.2l2.4 4.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Acessibilidade
        </span>
        <div className="hx-a11ybar__group" role="group" aria-label="Tamanho do texto">
          <button type="button" onClick={() => set({ text: Math.max(0, prefs.text - 1) as AccessibilityPrefs["text"] })} disabled={prefs.text === 0} aria-label="Diminuir texto">A−</button>
          <button type="button" onClick={() => set({ text: 0 })} aria-pressed={prefs.text === 0} aria-label="Texto normal">A</button>
          <button type="button" onClick={() => set({ text: Math.min(2, prefs.text + 1) as AccessibilityPrefs["text"] })} disabled={prefs.text === 2} aria-label="Aumentar texto">A+</button>
        </div>
        <button type="button" className="hx-a11ybar__toggle" aria-pressed={prefs.contrast} onClick={() => set({ contrast: !prefs.contrast })}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" /></svg>
          Mais contraste
        </button>
        <button type="button" className="hx-a11ybar__toggle" aria-pressed={prefs.reduceMotion} onClick={() => set({ reduceMotion: !prefs.reduceMotion })}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" /></svg>
          Pausar animações
        </button>
        <button type="button" className="hx-a11ybar__toggle" aria-pressed={isDark} onClick={() => set({ theme: isDark ? "light" : "dark" })}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" fill="currentColor" /></svg>
          Tema escuro
        </button>
        {children && <div className="hx-a11ybar__extra">{children}</div>}
        {policyHref && <a href={policyHref} className="hx-a11ybar__link">{policyLabel}</a>}
      </div>
    </div>
  );
}
