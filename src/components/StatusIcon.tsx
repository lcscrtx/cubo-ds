import type { ReactElement, SVGAttributes } from "react";
import { cx } from "./cx";

/**
 * Ícones de status, cada um ligado a um significado. A animação conta o que o status diz:
 * - estados finais (concluido, indeferido) se desenham uma vez e param;
 * - estados em curso (em-andamento, em-analise, aguardando, pendente) se movem devagar, sem parar;
 * - novo pulsa para chamar atenção; alerta pisca o ponto de exclamação;
 * - info não se move: é só informação, não muda de estado.
 * Com prefers-reduced-motion, todos ficam parados.
 */
export type StatusIconName =
  | "concluido"
  | "indeferido"
  | "em-andamento"
  | "em-analise"
  | "aguardando"
  | "pendente"
  | "alerta"
  | "novo"
  | "info";

export interface StatusIconProps extends SVGAttributes<SVGSVGElement> {
  name: StatusIconName;
  /** false deixa o ícone parado. */
  animated?: boolean;
}

const PATHS: Record<StatusIconName, ReactElement> = {
  // Check desenhado da esquerda para a direita.
  concluido: <path className="hx-si__draw" pathLength={1} d="M3.5 8.5l3 3 6-7" />,
  // X: um traço, depois o outro.
  indeferido: (
    <>
      <path className="hx-si__draw" pathLength={1} d="M4.5 4.5l7 7" />
      <path className="hx-si__draw hx-si__draw--2" pathLength={1} d="M11.5 4.5l-7 7" />
    </>
  ),
  // Arco girando: algo acontecendo agora.
  "em-andamento": (
    <>
      <circle cx="8" cy="8" r="5.5" opacity="0.25" />
      <path className="hx-si__spin" d="M8 2.5a5.5 5.5 0 0 1 5.5 5.5" />
    </>
  ),
  // Lupa que percorre a linha: alguém está olhando o pedido.
  "em-analise": (
    <g className="hx-si__scan">
      <circle cx="7" cy="7" r="3.5" />
      <path d="M9.6 9.6l3 3" />
    </g>
  ),
  // Ampulheta que vira: esperando algo de alguém.
  aguardando: (
    <g className="hx-si__flip">
      <path d="M4.5 2.5h7M4.5 13.5h7" />
      <path d="M5.5 2.5c0 3 5 3 5 5.5s-5 2.5-5 5.5M10.5 2.5c0 3-5 3-5 5.5s5 2.5 5 5.5" />
    </g>
  ),
  // Relógio com o ponteiro andando: prazo correndo.
  pendente: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path className="hx-si__hand" d="M8 8V4.8" />
      <path d="M8 8h2.2" />
    </>
  ),
  // Triângulo com exclamação que pisca devagar.
  alerta: (
    <>
      <path d="M8 2.8l5.6 9.7H2.4z" />
      <path className="hx-si__blink" d="M8 6.5v2.6M8 11v.01" />
    </>
  ),
  // Informação: círculo com "i", parado.
  info: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.2v4M8 4.9v.01" />
    </>
  ),
  // Ponto com anel que se expande: chegou agora.
  novo: (
    <>
      <circle className="hx-si__ping" cx="8" cy="8" r="3" />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
};

export function StatusIcon({ name, animated = true, className, ...rest }: StatusIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx("hx-si", `hx-si--${name}`, animated && "hx-si--animated", className)}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
