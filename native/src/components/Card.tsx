import type { ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import { useTheme } from "../theme/HexagonProvider";
import { useFocusRing } from "./focus";

export type CardVariant = "default" | "panel" | "elevated";

export interface CardProps {
  children: ReactNode;
  /** default: borda leve · panel: fundo de painel · elevated: sombra. */
  variant?: CardVariant;
  /** Torna o cartão inteiro tocável. Aí o label é obrigatório e não pode haver outro botão dentro. */
  onPress?: () => void;
  /** Use os textos visíveis, na ordem em que aparecem. */
  label?: string;
}

/** Superfície que agrupa um assunto. */
export function Card({ children, variant = "default", onPress, label }: CardProps) {
  const { colors, radius, shadow } = useTheme();
  const { ring, focusProps } = useFocusRing();
  const base: ViewStyle = {
    padding: 16,
    gap: 8,
    alignSelf: "stretch",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: variant === "default" ? colors.border : "transparent",
    backgroundColor: variant === "panel" ? colors.panel : colors.bg,
    boxShadow: variant === "elevated" ? shadow.lg : undefined,
  };
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable role="button" aria-label={label} onPress={onPress} {...focusProps} style={({ pressed }) => [base, pressed && { borderColor: colors.borderStrong }, ring]}>
      <View aria-hidden={!!label} style={{ gap: 8 }}>{children}</View>
    </Pressable>
  );
}
