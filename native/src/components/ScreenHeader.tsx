import { View } from "react-native";
import type { IconName } from "../icons/Icon";
import { useInsets, useTheme } from "../theme/HexagonProvider";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

export interface ScreenHeaderAction {
  icon: IconName;
  label: string;
  onPress: () => void;
  dot?: boolean;
}

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Para onde volta: "Voltar para Pedidos". Padrão: Voltar. */
  backLabel?: string;
  /** Até duas ações à direita. */
  actions?: ScreenHeaderAction[];
}

/** Cabeçalho da tela, com o único título de nível 1. Respeita o entalhe do aparelho. */
export function ScreenHeader({ title, subtitle, onBack, backLabel = "Voltar", actions = [] }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const { top } = useInsets();
  return (
    <View style={{ paddingTop: top, alignSelf: "stretch", borderBottomWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: "row", alignItems: "center", minHeight: 56, paddingLeft: onBack ? 4 : 16, paddingRight: actions.length ? 4 : 16 }}>
        {onBack && <IconButton icon="seta-esquerda" label={backLabel} onPress={onBack} />}
        <View style={{ flex: 1, paddingVertical: 8 }}>
          <Text variant="h3" heading={1}>{title}</Text>
          {subtitle && <Text variant="caption" color="text2">{subtitle}</Text>}
        </View>
        {actions.map((a) => <IconButton key={a.label} {...a} />)}
      </View>
    </View>
  );
}
