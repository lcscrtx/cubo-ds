import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AccessibilityInfo, useColorScheme } from "react-native";
import { createTheme, type Theme, type ThemeOverrides } from "./theme";

export interface Insets {
  top: number;
  bottom: number;
}

interface Ctx {
  theme: Theme;
  insets: Insets;
  reduceMotion: boolean;
}

const ZERO: Insets = { top: 0, bottom: 0 };
const Context = createContext<Ctx>({ theme: createTheme("light"), insets: ZERO, reduceMotion: false });

export interface HexagonProviderProps {
  /** auto segue o sistema. Padrão: auto. */
  scheme?: "auto" | "light" | "dark";
  /** Escurece textos de apoio e bordas. */
  moreContrast?: boolean;
  /** Cores, raios e fontes do produto. Declare fora do componente para não recriar o tema. */
  overrides?: ThemeOverrides;
  /** Áreas do sistema (entalhe e barra de gestos). Passe o resultado de useSafeAreaInsets(). */
  insets?: Insets;
  children: ReactNode;
}

/** Entrega o tema a todos os componentes. Fica uma vez, na raiz. */
export function HexagonProvider({ scheme = "auto", moreContrast = false, overrides, insets = ZERO, children }: HexagonProviderProps) {
  const system = useColorScheme();
  const reduceMotion = useSystemReduceMotion();
  const resolved = scheme === "auto" ? (system === "dark" ? "dark" : "light") : scheme;
  const { top, bottom } = insets;
  const value = useMemo<Ctx>(
    () => ({ theme: createTheme(resolved, overrides, moreContrast), insets: { top, bottom }, reduceMotion }),
    [resolved, overrides, moreContrast, top, bottom, reduceMotion],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useTheme = (): Theme => useContext(Context).theme;
export const useInsets = (): Insets => useContext(Context).insets;
/** A pessoa pediu menos movimento no sistema. */
export const useReduceMotion = (): boolean => useContext(Context).reduceMotion;

function useSystemReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduce(v);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);
  return reduce;
}
