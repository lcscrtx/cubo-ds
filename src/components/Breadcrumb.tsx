import type { ReactNode } from "react";
import { cx } from "./cx";

export interface BreadcrumbItem {
  label: ReactNode;
  /** Sem href no último item: é a página atual. */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Troca o <a> pelo link do roteador. Recebe href, className e children. */
  renderLink?: (props: { href: string; className: string; children: ReactNode }) => ReactNode;
}

/**
 * Trilha de navegação: onde a pessoa está e como voltar.
 * No celular, mostra só "Voltar para <página anterior>", que cabe numa linha.
 */
export function Breadcrumb({ items, className, renderLink }: BreadcrumbProps) {
  const link = (href: string, children: ReactNode) =>
    renderLink ? renderLink({ href, className: "hx-breadcrumb__link", children }) : <a href={href} className="hx-breadcrumb__link">{children}</a>;
  const parent = [...items].reverse().find((i, idx) => idx > 0 && i.href);

  return (
    <nav className={cx("hx-breadcrumb", className)} aria-label="Você está aqui">
      <ol className="hx-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="hx-breadcrumb__item">
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="hx-breadcrumb__current">{item.label}</span>
              ) : (
                link(item.href, item.label)
              )}
              {!last && (
                <svg className="hx-breadcrumb__sep" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
      {parent?.href && (
        <div className="hx-breadcrumb__back">
          {link(
            parent.href,
            <>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" /></svg>
              Voltar para {parent.label}
            </>,
          )}
        </div>
      )}
    </nav>
  );
}
