import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export type CardVariant = "default" | "panel" | "elevated";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** default: borda leve · panel: fundo de painel do tema · elevated: sombra. */
  variant?: CardVariant;
  /** Hover com borda e sombra, para cartões clicáveis. */
  interactive?: boolean;
}

export function Card({ variant = "default", interactive, className, ...rest }: CardProps) {
  return <div className={cx("hx-card", `hx-card--${variant}`, interactive && "hx-card--interactive", className)} {...rest} />;
}
