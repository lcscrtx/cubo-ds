import { View } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import type { Colors } from "../theme/theme";
import { Text } from "./Text";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONS: Record<BadgeTone, { fg: keyof Colors; bg: keyof Colors }> = {
  neutral: { fg: "text2", bg: "surface" },
  accent: { fg: "actionHover", bg: "accent50" },
  success: { fg: "success", bg: "successSoft" },
  warning: { fg: "warning", bg: "warningSoft" },
  danger: { fg: "danger", bg: "dangerSoft" },
};

export interface BadgeProps {
  children: string;
  tone?: BadgeTone;
  icon?: IconName;
}

/** Etiqueta curta de situação. O texto diz o status; cor e ícone só reforçam. */
export function Badge({ children, tone = "neutral", icon }: BadgeProps) {
  const { colors, radius } = useTheme();
  const t = TONS[tone];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 5,
        minHeight: 26,
        paddingVertical: 3,
        paddingLeft: icon ? 8 : 10,
        paddingRight: 10,
        borderRadius: radius.control,
        borderWidth: 1,
        borderColor: tone === "neutral" ? colors.border : "transparent",
        backgroundColor: colors[t.bg],
      }}
    >
      {icon && <Icon name={icon} size={14} color={t.fg} strokeWidth={1.8} />}
      <Text variant="caption" weight="medium" color={t.fg}>{children}</Text>
    </View>
  );
}
