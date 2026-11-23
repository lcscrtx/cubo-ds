import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface CommonProps {
  variant?: ButtonVariant;
  /** Ícone antes do texto. */
  iconStart?: ReactNode;
  /** Ícone depois do texto. */
  iconEnd?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps =
  | (CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

/**
 * Botão. Tamanho único (md): 36px de altura e 14px de fonte.
 * Com `href`, vira link.
 */
export function Button({ variant = "primary", iconStart, iconEnd, className, children, ...rest }: ButtonProps) {
  const classes = cx("hx-button", `hx-button--${variant}`, className);
  const content = (
    <>
      {iconStart && <span className="hx-button__icon" aria-hidden="true">{iconStart}</span>}
      {children}
      {iconEnd && <span className="hx-button__icon" aria-hidden="true">{iconEnd}</span>}
    </>
  );
  if (rest.href !== undefined) {
    return <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
  }
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={classes} {...buttonRest}>{content}</button>;
}
