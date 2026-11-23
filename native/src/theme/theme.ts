import { Platform, type TextStyle } from "react-native";
import { tokens } from "./tokens.generated";

export type Colors = { [K in keyof typeof tokens.light]: string };
export type TypeName = keyof typeof tokens.type;
export type Scheme = "light" | "dark";
export type FontStyle = Pick<TextStyle, "fontFamily" | "fontWeight">;
export type Fonts = { regular: FontStyle; medium: FontStyle; semibold: FontStyle };
export type Radius = { [K in keyof typeof tokens.radius]: number };

export interface Theme {
  scheme: Scheme;
  colors: Colors;
  radius: Radius;
  fonts: Fonts;
  space: typeof tokens.space;
  type: typeof tokens.type;
  tracking: typeof tokens.tracking;
  shadow: { sm: string; md: string; lg: string };
  /** Alvo mínimo de toque, em pontos. */
  touch: number;
  /** Margem lateral da tela. */
  gutter: number;
}

/** Cores que um produto pode trocar. As de estado ficam de fora: o significado é o mesmo em todo lugar. */
export type BrandColors = Omit<Colors, "success" | "successSoft" | "warning" | "warningSoft" | "danger" | "dangerSoft">;

export interface ThemeOverrides {
  light?: Partial<BrandColors>;
  dark?: Partial<BrandColors>;
  radius?: Partial<Radius>;
  fonts?: Fonts;
}

/** Fonte do sistema no iOS e no Android. Na web, IBM Plex Sans já carregada pela página. */
const web: FontStyle = Platform.OS === "web" ? { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" } : {};
export const systemFonts: Fonts = {
  regular: { ...web, fontWeight: "400" },
  medium: { ...web, fontWeight: "500" },
  semibold: { ...web, fontWeight: "600" },
};

/** IBM Plex Sans com os nomes do pacote @expo-google-fonts/ibm-plex-sans. Carregue as fontes antes de usar. */
export const plexFonts: Fonts = {
  regular: { fontFamily: "IBMPlexSans_400Regular" },
  medium: { fontFamily: "IBMPlexSans_500Medium" },
  semibold: { fontFamily: "IBMPlexSans_600SemiBold" },
};

export function createTheme(scheme: Scheme, overrides: ThemeOverrides = {}, moreContrast = false): Theme {
  const colors: Colors = { ...tokens[scheme], ...overrides[scheme] };
  if (moreContrast) {
    colors.text3 = colors.text2;
    colors.text2 = colors.text;
    colors.border = colors.borderStrong;
    colors.borderSoft = colors.borderStrong;
    colors.panel = colors.bg;
  }
  return {
    scheme,
    colors,
    radius: { ...tokens.radius, ...overrides.radius },
    fonts: overrides.fonts ?? systemFonts,
    space: tokens.space,
    type: tokens.type,
    tracking: tokens.tracking,
    shadow: tokens.shadow[scheme],
    touch: tokens.touch,
    gutter: tokens.gutter,
  };
}
