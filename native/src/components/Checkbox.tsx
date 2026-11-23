import { useId } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import { describedBy, FieldError, fieldHint, useAnnounce } from "./field";
import { useFocusRing } from "./focus";
import { Text } from "./Text";

export interface CheckboxProps {
  label: string;
  /** "mixed" é o estado em parte, do "Selecionar todos". */
  checked: boolean | "mixed";
  onChange: (checked: boolean) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

/** Marca ou desmarca uma opção. A linha inteira recebe o toque. */
export function Checkbox({ label, checked, onChange, hint, error, disabled = false }: CheckboxProps) {
  const { colors, touch } = useTheme();
  const { ring, focusProps } = useFocusRing();
  const id = useId();
  useAnnounce(error);
  const on = checked !== false;
  return (
    <View style={{ alignSelf: "stretch" }}>
      <Pressable
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label={label}
        accessibilityHint={fieldHint(hint, error)}
        {...describedBy(id, hint, error)}
        disabled={disabled}
        onPress={() => onChange(checked !== true)}
        {...focusProps}
        style={[{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: touch, paddingVertical: 8, borderRadius: 8 }, ring]}
      >
        {({ pressed }) => (
          <>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 1.5,
                alignItems: "center",
                justifyContent: "center",
                borderColor: on ? colors.action : error ? colors.danger : pressed ? colors.text2 : colors.borderStrong,
                backgroundColor: on ? colors.action : colors.bg,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {on && <Icon name={checked === "mixed" ? "menos" : "check"} size={18} color="onAccent" strokeWidth={2} />}
            </View>
            <Text color={disabled ? "text2" : "text"} style={{ flex: 1 }}>{label}</Text>
          </>
        )}
      </Pressable>
      <View style={{ paddingLeft: 36, gap: 6 }}>
        {hint && <Text nativeID={`${id}-hint`} variant="caption" color="text2">{hint}</Text>}
        <FieldError id={id} error={error} />
      </View>
    </View>
  );
}
