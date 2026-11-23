import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export type HeadingSize = "display" | "h1" | "h2" | "h3";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Nível semântico (h1 a h6). */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tamanho visual. Padrão: segue o nível. */
  size?: HeadingSize;
}

const sizeByLevel: Record<number, HeadingSize> = { 1: "h1", 2: "h2", 3: "h3", 4: "h3", 5: "h3", 6: "h3" };

/** Título. Peso e tracking vêm do tema. */
export function Heading({ level = 2, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cx("hx-heading", `hx-heading--${size ?? sizeByLevel[level]}`, className)} {...rest} />;
}

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {}

/** Linha curta acima do título. */
export function Eyebrow({ className, ...rest }: EyebrowProps) {
  return <p className={cx("hx-eyebrow", className)} {...rest} />;
}
