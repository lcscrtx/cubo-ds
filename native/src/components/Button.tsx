import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import type { Colors } from "../theme/theme";
import { useFocusRing } from "./focus";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  children: string;
  onPress: () => void;
  /** primary uma vez por tela. Padrão: primary. */
  variant?: ButtonVariant;
  iconStart?: IconName;
  iconEnd?: IconName;
  disabled?: boolean;
  /** Mostra que está enviando e impede outro toque. O rótulo continua visível. */
  loading?: boolean;
  /** Ocupa a largura toda. Padrão no rodapé de formulários. */
  full?: boolean;
  /** O que acontece ao tocar, lido depois do nome. */
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

/** Botão. Tamanho único: 48 de altura, rótulo de 16. O rótulo quebra linha quando a fonte do sistema é grande. */
export function Button({ children, onPress, variant = "primary", iconStart, iconEnd, disabled = false, loading = false, full = false, accessibilityHint, style }: ButtonProps) {
  const { colors, radius, touch } = useTheme();
  const { ring, focusProps } = useFocusRing();
  const off = disabled || loading;
  const fg: keyof Colors = variant === "primary" ? "onAccent" : variant === "secondary" ? "text" : "action";
  return (
    <Pressable
      role="button"
      accessibilityHint={accessibilityHint}
      aria-disabled={off}
      aria-busy={loading}
      disabled={off}
      onPress={onPress}
      {...focusProps}
      style={({ pressed }) => [
        {
          minHeight: touch,
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          alignSelf: full ? "stretch" : "flex-start",
          borderRadius: radius.control,
          borderWidth: 1,
          borderColor: variant === "secondary" ? (pressed ? colors.text2 : colors.borderStrong) : "transparent",
          backgroundColor:
            variant === "primary" ? (pressed ? colors.actionHover : colors.action) : variant === "secondary" ? (pressed ? colors.surface : colors.bg) : pressed ? colors.accent50 : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        ring,
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={colors[fg]} aria-hidden /> : iconStart && <Icon name={iconStart} size={18} color={fg} />}
      <View style={{ flexShrink: 1 }}>
        <Text variant="body" weight="medium" color={fg} style={{ textAlign: "center" }}>{children}</Text>
      </View>
      {iconEnd && !loading && <Icon name={iconEnd} size={18} color={fg} />}
    </Pressable>
  );
}
