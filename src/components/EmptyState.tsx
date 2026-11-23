import type { ReactNode } from "react";
import { cx } from "./cx";

export type EmptyStateKind = "vazio" | "busca" | "erro";

export interface EmptyStateProps {
  /** vazio: ainda não há nada · busca: a busca não achou · erro: não deu para carregar. */
  kind?: EmptyStateKind;
  title: ReactNode;
  description?: ReactNode;
  /** O próximo passo: "Nova solicitação", "Limpar filtros", "Tentar de novo". */
  actions?: ReactNode;
  /** Nível do título, para seguir a hierarquia da página. Padrão: 2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

const ICONS: Record<EmptyStateKind, ReactNode> = {
  // Caixa de documentos vazia
  vazio: <path d="M5 13l3-6h16l3 6M5 13v11a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V13M5 13h7l1.5 3h5L20 13h7" />,
  // Lupa
  busca: (
    <>
      <circle cx="14" cy="14" r="7.5" />
      <path d="M19.5 19.5L26 26M11 14h6" />
    </>
  ),
  // Nuvem com X: não conectou
  erro: (
    <>
      <path d="M9.5 24h13a5.5 5.5 0 0 0 .7-10.95A7.5 7.5 0 0 0 8.8 15.2 4.5 4.5 0 0 0 9.5 24z" />
      <path d="M13.5 16.5l5 5M18.5 16.5l-5 5" />
    </>
  ),
};

/** Tela de "nada aqui": diz por quê e qual é o próximo passo. */
export function EmptyState({ kind = "vazio", title, description, actions, headingLevel = 2, className }: EmptyStateProps) {
  const H = `h${headingLevel}` as const;
  return (
    <div className={cx("hx-empty", `hx-empty--${kind}`, className)}>
      <span className="hx-empty__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[kind]}</svg>
      </span>
      <H className="hx-empty__title">{title}</H>
      {description && <p className="hx-empty__desc">{description}</p>}
      {actions && <div className="hx-empty__actions">{actions}</div>}
    </div>
  );
}
