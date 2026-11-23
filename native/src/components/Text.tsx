import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { useTheme } from "../theme/HexagonProvider";
import type { Colors, Fonts, TypeName } from "../theme/theme";
import { webOnly } from "./focus";

export interface TextProps extends RNTextProps {
  /** Tamanho da escala. Padrão: body. */
  variant?: TypeName;
  color?: keyof Colors;
  /** Padrão: semibold nos títulos, regular no resto. */
  weight?: keyof Fonts;
  /** Nível do título para o leitor de tela. Sem isto, é texto comum. */
  heading?: 1 | 2 | 3 | 4;
}

const TITULOS: TypeName[] = ["display", "h1", "h2", "h3"];

/** Todo texto passa por aqui. Cresce com a fonte do sistema: nunca desligue allowFontScaling. */
export function Text({ variant = "body", color = "text", weight, heading, style, ...rest }: TextProps) {
  const t = useTheme();
  const { size, line } = t.type[variant];
  const titulo = TITULOS.includes(variant);
  const tracking = titulo ? (variant === "h3" ? t.tracking.heading : t.tracking.display) * size : 0;
  return (
    <RNText
      {...(heading ? { role: "heading" as const, ...webOnly({ "aria-level": heading }) } : null)}
      style={[
        t.fonts[weight ?? (titulo ? "semibold" : "regular")],
        { fontSize: size, lineHeight: line, letterSpacing: tracking, color: t.colors[color] },
        style,
      ]}
      {...rest}
    />
  );
}
