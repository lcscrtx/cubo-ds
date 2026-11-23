import { Pressable, View } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useInsets, useTheme } from "../theme/HexagonProvider";
import { useFocusRing } from "./focus";
import { Text } from "./Text";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: IconName;
  /** Quantos itens novos. Lido como "3 novos". */
  count?: number;
}

export interface BottomNavProps {
  /** De 3 a 5 destinos. */
  items: BottomNavItem[];
  value: string;
  onChange: (id: string) => void;
  /** Nome da barra para o leitor de tela. */
  label?: string;
}

/** Navegação principal, ao alcance do polegar. Rótulo sempre visível; o atual tem pílula e letra forte, não só cor. */
export function BottomNav({ items, value, onChange, label = "Navegação principal" }: BottomNavProps) {
  const { colors } = useTheme();
  const { bottom } = useInsets();
  return (
    <View role="tablist" aria-label={label} style={{ flexDirection: "row", alignSelf: "stretch", paddingBottom: bottom, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.bg }}>
      {items.map((i) => <NavTab key={i.id} item={i} selected={i.id === value} onPress={() => onChange(i.id)} />)}
    </View>
  );
}

function NavTab({ item, selected, onPress }: { item: BottomNavItem; selected: boolean; onPress: () => void }) {
  const { colors, radius } = useTheme();
  const { ring, focusProps } = useFocusRing(-2);
  const novos = item.count ? `, ${item.count} ${item.count === 1 ? "novo" : "novos"}` : "";
  return (
    <Pressable
      role="tab"
      aria-selected={selected}
      aria-label={item.label + novos}
      onPress={onPress}
      {...focusProps}
      style={[{ flex: 1, alignItems: "center", justifyContent: "center", gap: 3, minHeight: 60, paddingVertical: 8, paddingHorizontal: 2 }, ring]}
    >
      {({ pressed }) => (
        <>
          <View style={{ width: 56, height: 28, borderRadius: radius.control, alignItems: "center", justifyContent: "center", backgroundColor: selected ? colors.accent100 : pressed ? colors.surface : "transparent" }}>
            <Icon name={item.icon} size={22} color={selected ? "actionHover" : "text2"} strokeWidth={selected ? 1.9 : 1.6} />
            {!!item.count && (
              <View aria-hidden style={{ position: "absolute", top: -3, left: 32, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.danger }}>
                {/* Número fixo dentro da bolinha: a contagem completa está no nome da aba. */}
                <Text variant="caption" weight="semibold" color="bg" allowFontScaling={false} style={{ fontSize: 13, lineHeight: 16 }}>{item.count > 9 ? "9+" : item.count}</Text>
              </View>
            )}
          </View>
          <Text variant="caption" weight={selected ? "semibold" : "medium"} color={selected ? "actionHover" : "text2"} maxFontSizeMultiplier={1.5} style={{ textAlign: "center" }}>{item.label}</Text>
        </>
      )}
    </Pressable>
  );
}
