import { useEffect, type ReactNode } from "react";
import { AccessibilityInfo, Platform, View } from "react-native";
import { Icon } from "../icons/Icon";
import { Text } from "./Text";
import { webOnly } from "./focus";

export interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/** Nome que o leitor de tela fala: rótulo e obrigatoriedade. */
export const fieldName = (label: string, required?: boolean) => (required ? `${label}, obrigatório` : label);
/** No iOS e no Android a ajuda e o erro entram na dica; na web, em aria-describedby. */
export const fieldHint = (hint?: string, error?: string) => [error, hint].filter(Boolean).join(". ") || undefined;
export const describedBy = (id: string, hint?: string, error?: string) =>
  webOnly({ "aria-describedby": [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined, "aria-invalid": error ? true : undefined });

/** Rótulo, ajuda e erro em volta de um campo. O erro é falado quando aparece. */
export function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  useAnnounce(error);
  return (
    <View style={{ gap: 6, alignSelf: "stretch" }}>
      {/* O rótulo visível sai da leitura: o campo já tem o mesmo nome e seria lido duas vezes. */}
      <View aria-hidden importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Text variant="small" weight="medium">
          {label}
          {required && <Text variant="small" color="text2"> (obrigatório)</Text>}
        </Text>
      </View>
      {hint && <Text nativeID={`${id}-hint`} variant="caption" color="text2">{hint}</Text>}
      {children}
      <FieldError id={id} error={error} />
    </View>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    // Região sempre presente, para o Android anunciar o texto quando ele surge.
    <View aria-live="polite">
      {error && (
        <View style={{ flexDirection: "row", gap: 6, alignItems: "flex-start" }}>
          <View style={{ paddingTop: 1 }}><Icon name="erro" size={16} color="danger" /></View>
          <Text nativeID={`${id}-error`} variant="caption" color="danger" style={{ flex: 1 }}>{error}</Text>
        </View>
      )}
    </View>
  );
}

/** O iOS não tem região viva: o anúncio é feito à mão. */
export function useAnnounce(message?: string) {
  useEffect(() => {
    if (message && Platform.OS === "ios") AccessibilityInfo.announceForAccessibility(message);
  }, [message]);
}
