import { Pressable, View } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import { useFocusRing } from "./focus";

export interface IconButtonProps {
  icon: IconName;
  /** Nome do botão para o leitor de tela. Obrigatório: no celular não há dica ao passar o mouse. */
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Mostra um ponto de novidade. Diga o número no label: "Avisos, 3 novos". */
  dot?: boolean;
}

/** Botão só de ícone, 48 por 48. Use para ações conhecidas: voltar, fechar, buscar. */
export function IconButton({ icon, label, onPress, disabled = false, dot = false }: IconButtonProps) {
  const { colors, radius, touch } = useTheme();
  const { ring, focusProps } = useFocusRing();
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      {...focusProps}
      style={({ pressed }) => [
        {
          width: touch,
          height: touch,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.control,
          backgroundColor: pressed ? colors.surface : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        ring,
      ]}
    >
      <Icon name={icon} size={22} color="text" />
      {dot && <View style={{ position: "absolute", top: 11, right: 11, width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.bg, backgroundColor: colors.danger }} />}
    </Pressable>
  );
}
