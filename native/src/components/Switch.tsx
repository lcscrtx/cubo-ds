import { Pressable, View } from "react-native";
import { Icon } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import { useFocusRing } from "./focus";
import { Text } from "./Text";

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
  onText?: string;
  offText?: string;
}

/** Liga e desliga algo que vale na hora. Quatro pistas: texto, posição, check e cor. */
export function Switch({ label, checked, onChange, hint, disabled = false, onText = "Ligado", offText = "Desligado" }: SwitchProps) {
  const { colors, touch } = useTheme();
  const { ring, focusProps } = useFocusRing();
  return (
    <Pressable
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={hint ? `${label}. ${hint}` : label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      {...focusProps}
      style={[
        { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", columnGap: 16, minHeight: touch, paddingVertical: 8, borderRadius: 8, alignSelf: "stretch", opacity: disabled ? 0.5 : 1 },
        ring,
      ]}
    >
      <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 160, gap: 2 }}>
        <Text weight="medium">{label}</Text>
        {hint && <Text variant="caption" color="text2">{hint}</Text>}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text variant="caption" color="text2">{checked ? onText : offText}</Text>
        <View style={{ width: 52, height: 30, borderRadius: 15, borderWidth: 1.5, justifyContent: "center", borderColor: checked ? colors.action : colors.borderStrong, backgroundColor: checked ? colors.action : colors.bg }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", marginLeft: checked ? 25 : 2.5, backgroundColor: checked ? colors.onAccent : colors.text2 }}>
            {checked && <Icon name="check" size={14} color="action" strokeWidth={2.2} />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
