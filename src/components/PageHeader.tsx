import type { ReactNode } from "react";
import { cx } from "./cx";

export interface PageHeaderProps {
  /** Título da página. Vira o h1: só um por página. */
  title: ReactNode;
  description?: ReactNode;
  /** Trilha acima do título (Breadcrumb). */
  breadcrumb?: ReactNode;
  /** Informações curtas ao lado do título: situação, protocolo. */
  meta?: ReactNode;
  /** Botões da página. A ação principal por último. */
  actions?: ReactNode;
  className?: string;
}

/** Cabeçalho de uma página do sistema: onde estou, o que é isto e o que posso fazer. */
export function PageHeader({ title, description, breadcrumb, meta, actions, className }: PageHeaderProps) {
  return (
    <header className={cx("hx-page-header", className)}>
      {breadcrumb && <div className="hx-page-header__crumb">{breadcrumb}</div>}
      <div className="hx-page-header__row">
        <div className="hx-page-header__text">
          <h1 className="hx-page-header__title">{title}</h1>
          {meta && <div className="hx-page-header__meta">{meta}</div>}
          {description && <p className="hx-page-header__desc">{description}</p>}
        </div>
        {actions && <div className="hx-page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
