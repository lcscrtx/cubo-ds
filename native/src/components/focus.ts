import { useState } from "react";
import { Platform, type ViewStyle } from "react-native";
import { useTheme } from "../theme/HexagonProvider";

/** Anel de foco de 2px para teclado físico e controle por botão. Na web o navegador já desenha. */
export function useFocusRing(offset = 2) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const ring: ViewStyle | null =
    focused && Platform.OS !== "web" ? { outlineColor: colors.action, outlineWidth: 2, outlineOffset: offset, outlineStyle: "solid" } : null;
  return { ring, focusProps: { onFocus: () => setFocused(true), onBlur: () => setFocused(false) } };
}

/** Propriedades que só a web entende. No iOS e no Android, não passa nada. */
export const webOnly = (props: Record<string, unknown>): object => (Platform.OS === "web" ? props : {});
