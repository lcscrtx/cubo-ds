import type { ReactNode } from "react";
import { View } from "react-native";
import { Icon, type IconName } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import type { Colors } from "../theme/theme";
import { useAnnounce } from "./field";
import { Text } from "./Text";

export type AlertTone = "info" | "success" | "warning" | "danger";

const TONS: Record<AlertTone, { icon: IconName; fg: keyof Colors; bg: keyof Colors; nome: string }> = {
  info: { icon: "info", fg: "action", bg: "accent50", nome: "Informação" },
  success: { icon: "concluido", fg: "success", bg: "successSoft", nome: "Sucesso" },
  warning: { icon: "alerta", fg: "warning", bg: "warningSoft", nome: "Atenção" },
  danger: { icon: "indeferido", fg: "danger", bg: "dangerSoft", nome: "Erro" },
};

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  /** Texto de apoio. */
  children?: string;
  /** Botões abaixo do texto. */
  actions?: ReactNode;
  /** Fala ao aparecer. Só para avisos que surgem depois. */
  live?: boolean;
}

/** Aviso na tela. O tipo está no ícone e na leitura, não só na cor. */
export function Alert({ tone = "info", title, children, actions, live = false }: AlertProps) {
  const { colors, radius } = useTheme();
  const t = TONS[tone];
  useAnnounce(live ? [t.nome, title, children].filter(Boolean).join(". ") : undefined);
  return (
    <View
      {...(live ? { role: "alert" as const, "aria-live": tone === "danger" ? ("assertive" as const) : ("polite" as const) } : null)}
      style={{ flexDirection: "row", gap: 12, padding: 14, alignSelf: "stretch", borderWidth: 1, borderRadius: radius.md, borderColor: tone === "info" ? colors.accent200 : colors[t.fg], backgroundColor: colors[t.bg] }}
    >
      <View style={{ paddingTop: 2 }}><Icon name={t.icon} size={20} color={t.fg} strokeWidth={1.8} /></View>
      <View style={{ flex: 1, gap: 2 }}>
        <View accessible aria-label={[t.nome, title, children].filter(Boolean).join(". ")} role="group">
          <Text variant="small" weight="semibold">{title}</Text>
          {children && <Text variant="small" color="text2">{children}</Text>}
        </View>
        {actions && <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 10 }}>{actions}</View>}
      </View>
    </View>
  );
}
