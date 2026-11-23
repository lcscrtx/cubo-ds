import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Abre em nova aba. Mostra o ícone e avisa o leitor de tela. */
  external?: boolean;
  /** Link solto, fora de um parágrafo ("Ver todos os protocolos"), com seta. */
  standalone?: boolean;
  children: ReactNode;
}

/**
 * Link de texto. Sempre sublinhado: dentro de um parágrafo, a cor sozinha não basta (WCAG 1.4.1).
 * Para navegação do roteador (React Router, Next), passe o componente dele por fora e use a classe hx-link.
 */
export function Link({ external, standalone, className, children, target, rel, ...rest }: LinkProps) {
  return (
    <a
      className={cx("hx-link", standalone && "hx-link--standalone", className)}
      target={external ? "_blank" : target}
      rel={external ? "noopener noreferrer" : rel}
      {...rest}
    >
      {children}
      {external && (
        <>
          <svg className="hx-link__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.5 3.5h3v3M12.5 3.5L7 9M11 9.5v3H3.5V5h3" />
          </svg>
          <span className="hx-sr">(abre em nova aba)</span>
        </>
      )}
      {standalone && !external && (
        <svg className="hx-link__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </a>
  );
}
