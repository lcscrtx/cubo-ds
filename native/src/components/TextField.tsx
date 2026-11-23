import { useId, useState } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { useTheme } from "../theme/HexagonProvider";
import { describedBy, fieldHint, fieldName, FieldShell } from "./field";
import { webOnly } from "./focus";

export interface TextFieldProps extends Omit<TextInputProps, "editable" | "style"> {
  /** Rótulo sempre visível. O placeholder nunca entra no lugar dele. */
  label: string;
  /** Ajuda antes do campo: diga o formato aqui. */
  hint?: string;
  /** O que fazer para corrigir. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Campo de texto. 48 de altura e letra de 16, que evita o zoom automático do iOS. */
export function TextField({ label, hint, error, required, disabled = false, multiline, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { colors, radius, fonts, type, touch } = useTheme();
  const id = useId();
  const [focused, setFocused] = useState(false);
  // A borda passa de 1 para 2 no foco; o espaço interno compensa para o texto não pular.
  const w = focused ? 2 : 1;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <TextInput
        aria-label={fieldName(label, required)}
        accessibilityHint={fieldHint(hint, error)}
        aria-disabled={disabled}
        {...describedBy(id, hint, error)}
        {...webOnly({ "aria-required": required || undefined })}
        editable={!disabled}
        multiline={multiline}
        placeholderTextColor={colors.text3}
        selectionColor={colors.action}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          fonts.regular,
          {
            fontSize: type.body.size,
            minHeight: multiline ? touch * 2.2 : touch,
            paddingHorizontal: 14 - w,
            paddingVertical: 10 - w,
            textAlignVertical: multiline ? "top" : "center",
            borderWidth: w,
            borderRadius: radius.sm,
            borderColor: error ? colors.danger : focused ? colors.action : disabled ? colors.border : colors.borderStrong,
            backgroundColor: disabled ? colors.surface : colors.bg,
            color: disabled ? colors.text2 : colors.text,
          },
          // O foco já aparece na borda de 2; sem isto a web desenharia um segundo anel.
          webOnly({ outlineStyle: "none" }),
        ]}
        {...rest}
      />
    </FieldShell>
  );
}
