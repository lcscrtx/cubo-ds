import type { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { useInsets, useReduceMotion, useTheme } from "../theme/HexagonProvider";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

export interface BottomSheetProps {
  open: boolean;
  /** Botão Fechar, toque fora, gesto de voltar do Android ou Esc. */
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Botões presos embaixo. Principal primeiro. */
  actions?: ReactNode;
  closeLabel?: string;
}

/** Folha que sobe de baixo. Toma o lugar do Dialog, do Drawer, do Menu e do Popover da web. */
export function BottomSheet({ open, onClose, title, description, children, actions, closeLabel = "Fechar" }: BottomSheetProps) {
  const { colors, radius } = useTheme();
  const { bottom } = useInsets();
  const reduce = useReduceMotion();
  return (
    <Modal visible={open} transparent animationType={reduce ? "none" : "slide"} onRequestClose={onClose} statusBarTranslucent aria-label={title}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
        {/* Fora da leitura: o botão Fechar faz o mesmo com nome. */}
        <Pressable onPress={onClose} aria-hidden importantForAccessibility="no" accessible={false} tabIndex={-1} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(12, 14, 20, 0.5)" }} />
        <View
          accessibilityViewIsModal
          style={{
            width: "100%",
            maxWidth: 560,
            maxHeight: "90%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.bg,
            paddingBottom: bottom,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: radius.control, backgroundColor: colors.borderStrong }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", paddingLeft: 20, paddingRight: 8, paddingTop: 4 }}>
            <View style={{ flex: 1, gap: 4, paddingTop: 11, paddingBottom: 8 }}>
              <Text variant="h3" heading={2}>{title}</Text>
              {description && <Text variant="small" color="text2">{description}</Text>}
            </View>
            <IconButton icon="x" label={closeLabel} onPress={onClose} />
          </View>
          {children && (
            <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          )}
          {actions && <View style={{ gap: 8, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderColor: colors.borderSoft }}>{actions}</View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
