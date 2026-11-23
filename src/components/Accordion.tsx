import { useId, type ReactNode } from "react";
import { cx } from "./cx";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  /** Começa aberto. */
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Só um aberto por vez. Abrir um fecha o outro. */
  exclusive?: boolean;
  className?: string;
}

/**
 * Perguntas e respostas que abrem e fecham. Usa <details> e <summary> nativos:
 * funciona com teclado e leitor de tela sem JavaScript, e a busca do navegador (Ctrl+F)
 * encontra texto dentro dos itens fechados e os abre.
 */
export function Accordion({ items, exclusive, className }: AccordionProps) {
  const group = useId();
  return (
    <div className={cx("hx-accordion", className)}>
      {items.map((item) => (
        <details key={item.id} className="hx-accordion__item" name={exclusive ? group : undefined} open={item.defaultOpen}>
          <summary className="hx-accordion__summary">
            <span className="hx-accordion__title">{item.title}</span>
            <svg className="hx-accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </summary>
          <div className="hx-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
