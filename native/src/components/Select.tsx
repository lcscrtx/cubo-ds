import { useId, useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "../icons/Icon";
import { useTheme } from "../theme/HexagonProvider";
import { BottomSheet } from "./BottomSheet";
import { describedBy, fieldHint, fieldName, FieldShell } from "./field";
import { useFocusRing, webOnly } from "./focus";
import { Text } from "./Text";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Escolha de uma opção. Abre uma folha embaixo, com linhas grandes para o dedo. */
export function Select({ label, options, value, onChange, placeholder = "Escolha uma opção", hint, error, required, disabled = false }: SelectProps) {
  const { colors, radius, touch } = useTheme();
  const { ring, focusProps } = useFocusRing(0);
  const [open, setOpen] = useState(false);
  const id = useId();
  const atual = options.find((o) => o.value === value);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <Pressable
        role="button"
        aria-label={`${fieldName(label, required)}, ${atual?.label ?? placeholder}`}
        accessibilityHint={fieldHint(hint, error) ?? "Abre as opções"}
        aria-expanded={open}
        aria-disabled={disabled}
        {...webOnly({ "aria-haspopup": "dialog" })}
        {...describedBy(id, hint)}
        disabled={disabled}
        onPress={() => setOpen(true)}
        {...focusProps}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            minHeight: touch,
            paddingHorizontal: 13,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: radius.sm,
            borderColor: error ? colors.danger : disabled ? colors.border : colors.borderStrong,
            backgroundColor: disabled ? colors.surface : colors.bg,
          },
          ring,
        ]}
      >
        <Text color={disabled ? "text2" : atual ? "text" : "text3"} style={{ flex: 1 }}>{atual?.label ?? placeholder}</Text>
        <Icon name="chevron-baixo" size={18} />
      </Pressable>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <View role="radiogroup" aria-label={label}>
          {options.map((o) => (
            <Option
              key={o.value}
              option={o}
              selected={o.value === value}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </FieldShell>
  );
}

function Option({ option, selected, onPress }: { option: SelectOption; selected: boolean; onPress: () => void }) {
  const { colors, radius, touch } = useTheme();
  const { ring, focusProps } = useFocusRing(-2);
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      aria-disabled={option.disabled}
      aria-label={[option.label, option.description].filter(Boolean).join(", ")}
      disabled={option.disabled}
      onPress={onPress}
      {...focusProps}
      style={({ pressed }) => [
        { flexDirection: "row", alignItems: "center", gap: 12, minHeight: touch, paddingVertical: 10, paddingHorizontal: 12, marginHorizontal: -12, borderRadius: radius.md, backgroundColor: selected || pressed ? colors.accent50 : "transparent", opacity: option.disabled ? 0.5 : 1 },
        ring,
      ]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight={selected ? "medium" : "regular"}>{option.label}</Text>
        {option.description && <Text variant="caption" color="text2">{option.description}</Text>}
      </View>
      {selected && <Icon name="check" size={20} color="action" strokeWidth={2} />}
    </Pressable>
  );
}
