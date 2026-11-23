import { useState } from "react";
import { cx } from "./cx";

export interface AvatarProps {
  /** Nome completo da pessoa. Gera as iniciais e o texto alternativo da foto. */
  name: string;
  /** Endereço da foto. Sem foto, ou se ela falhar, mostra as iniciais. */
  src?: string;
  size?: 28 | 36 | 48;
  /**
   * true quando o nome já aparece escrito ao lado (o mais comum):
   * o avatar fica decorativo e o leitor de tela não lê o nome duas vezes.
   */
  decorative?: boolean;
  className?: string;
}

/** Iniciais do primeiro e do último nome: "Maria das Graças Lima" vira "ML". */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter((p) => !/^(da|de|do|das|dos|e)$/i.test(p));
  if (!parts.length) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Foto ou iniciais de uma pessoa. */
export function Avatar({ name, src, size = 36, decorative, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name };
  return (
    <span className={cx("hx-avatar", `hx-avatar--${size}`, className)} {...a11y}>
      {showImg ? <img src={src} alt="" onError={() => setFailed(true)} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
