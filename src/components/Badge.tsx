import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { StatusIcon, type StatusIconName } from "./StatusIcon";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Bolinha antes do texto, útil para status sem ícone. */
  dot?: boolean;
  /**
   * Ícone antes do texto. Um nome de status usa o ícone animado do design system
   * (escolha o que diz o mesmo que o texto); um ReactNode usa o seu próprio ícone.
   */
  icon?: StatusIconName | ReactNode;
  /** false deixa o ícone de status parado. */
  animated?: boolean;
}

/** Etiqueta curta: status, categoria, secretaria. */
export function Badge({ tone = "neutral", dot, icon, animated = true, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx("hx-badge", `hx-badge--${tone}`, className)} {...rest}>
      {icon ? (
        typeof icon === "string" ? (
          <StatusIcon name={icon as StatusIconName} animated={animated} />
        ) : (
          <span className="hx-badge__icon" aria-hidden="true">{icon}</span>
        )
      ) : (
        dot && <span className="hx-badge__dot" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
