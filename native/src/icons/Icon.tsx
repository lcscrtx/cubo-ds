import { useTheme } from "../theme/HexagonProvider";
import type { Colors } from "../theme/theme";
import { StrokeSvg } from "./Svg";

/** Círculo em arcos, para o ícone inteiro caber num traço só. */
const c = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const PATHS = {
  check: "M3.5 8.5l3 3 6-7",
  x: "M4 4l8 8M12 4l-8 8",
  mais: "M8 3v10M3 8h10",
  menos: "M4 8h8",
  "seta-direita": "M3 8h10M9 4l4 4-4 4",
  "seta-esquerda": "M13 8H3M7 4L3 8l4 4",
  "chevron-baixo": "M4 6l4 4 4-4",
  "chevron-direita": "M6 4l4 4-4 4",
  busca: c(7, 7, 4.5) + "M10.5 10.5L14 14",
  calendario: "M4 3.5h8a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 12V5A1.5 1.5 0 0 1 4 3.5zM2.5 6.5h11M5.5 2v3M10.5 2v3",
  arquivo: "M4 1.5h5.5L13 5v9.5H4zM9.5 1.5V5H13",
  erro: c(8, 8, 6) + "M8 4.8v3.6M8 11v.01",
  reticencias: "M3.6 8h.01M8 8h.01M12.4 8h.01",
  inicio: "M2.5 7.5L8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.8V10H6.2v3.5H3a.5.5 0 0 1-.5-.5z",
  pedidos: "M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01",
  avisos: "M4 6.5a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11S4 10.5 4 6.5zM6.8 13.5a1.3 1.3 0 0 0 2.4 0",
  perfil: c(8, 5.5, 2.5) + "M3 13.5c.5-2.5 2.5-4 5-4s4.5 1.5 5 4",
  // Status: cada um ligado a um significado, igual à web.
  concluido: "M3.5 8.5l3 3 6-7",
  indeferido: "M4.5 4.5l7 7M11.5 4.5l-7 7",
  "em-analise": c(7, 7, 3.5) + "M9.6 9.6l3 3",
  aguardando: "M4.5 2.5h7M4.5 13.5h7M5.5 2.5c0 3 5 3 5 5.5s-5 2.5-5 5.5M10.5 2.5c0 3-5 3-5 5.5s5 2.5 5 5.5",
  pendente: c(8, 8, 5.5) + "M8 8V4.8M8 8h2.2",
  alerta: "M8 2.8l5.6 9.7H2.4zM8 6.5v2.6M8 11v.01",
  info: c(8, 8, 6) + "M8 7.2v4M8 4.9v.01",
} as const;

export type IconName = keyof typeof PATHS;
export const ICONS = Object.keys(PATHS) as IconName[];

export interface IconProps {
  name: IconName;
  size?: number;
  /** Papel de cor do tema. Padrão: text2. */
  color?: keyof Colors;
  strokeWidth?: number;
}

/** Ícone decorativo. Nunca é a única pista: o texto ao lado, ou o nome do botão, diz o que é. */
export function Icon({ name, size = 20, color = "text2", strokeWidth = 1.6 }: IconProps) {
  const { colors } = useTheme();
  const w = name === "reticencias" ? 2.4 : strokeWidth;
  return <StrokeSvg d={PATHS[name]} size={size} color={colors[color]} strokeWidth={w} />;
}
