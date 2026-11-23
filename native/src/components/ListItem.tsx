import type { ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import { useFocusRing } from "./focus";
import { Text } from "./Text";

export interface ListItemProps {
  title: string;
  description?: string;
  icon?: IconName;
  /** Texto curto à direita: data, valor, situação. */
  value?: string;
  /** Peça à direita, como um Badge. Diga o que ela mostra em accessoryLabel. */
  accessory?: ReactNode;
  /** O que o accessory diz, para o leitor de tela. */
  accessoryLabel?: string;
  onPress?: () => void;
  /** Ação perigosa, como sair da conta. */
  danger?: boolean;
  disabled?: boolean;
  /** Tira a linha de baixo. Use no último item. */
  last?: boolean;
}

/** Linha de lista. No celular, é ela que toma o lugar da tabela. Lida inteira de uma vez. */
export function ListItem({ title, description, icon, value, accessory, accessoryLabel, onPress, danger = false, disabled = false, last = false }: ListItemProps) {
  const { colors } = useTheme();
  const { ring, focusProps } = useFocusRing(-2);
  const base: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "stretch",
    borderBottomWidth: last ? 0 : 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.bg,
    opacity: disabled ? 0.5 : 1,
  };
  const body = (
    <>
      {icon && <Icon name={icon} size={22} color={danger ? "danger" : "text2"} />}
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="medium" color={danger ? "danger" : "text"}>{title}</Text>
        {description && <Text variant="small" color="text2">{description}</Text>}
      </View>
      {value && <Text variant="small" color="text2" style={{ flexShrink: 1, textAlign: "right" }}>{value}</Text>}
      {accessory}
      {onPress && !danger && <Icon name="chevron-direita" size={18} color="text3" />}
    </>
  );
  const label = [title, description, value, accessoryLabel].filter(Boolean).join(", ");
  if (!onPress) return <View accessible style={base}>{body}</View>;
  return (
    <Pressable role="button" aria-label={label} aria-disabled={disabled} disabled={disabled} onPress={onPress} {...focusProps} style={({ pressed }) => [base, pressed && { backgroundColor: colors.surface }, ring]}>
      {/* O nome da linha já traz todos os textos, na ordem em que aparecem. */}
      <View aria-hidden style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>{body}</View>
    </Pressable>
  );
}
