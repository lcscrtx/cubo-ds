// Moldura de celular da documentação: os componentes React Native rodam de verdade, pelo react-native-web.
import { useEffect, useState, type ReactNode } from "react";
import { HexagonProvider } from "@cubo-tecnologia/hexagon-native";

type Scheme = "light" | "dark";

/** Segue o tema escolhido na barra do site. */
function useSiteScheme(): Scheme {
  const read = (): Scheme => {
    const t = document.documentElement.dataset.theme;
    if (t === "dark" || t === "light") return t;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const [scheme, setScheme] = useState<Scheme>(read);
  useEffect(() => {
    const update = () => setScheme(read());
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    mq.addEventListener("change", update);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);
  return scheme;
}

function useSiteContrast() {
  const read = () => document.documentElement.dataset.contrast === "more";
  const [more, setMore] = useState(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setMore(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-contrast"] });
    return () => mo.disconnect();
  }, []);
  return more;
}

/** screen: ocupa a tela toda da moldura, sem margem. tall: com a altura de uma tela. Padrão: com margem, para uma peça solta. */
export function Phone({ children, screen = false, tall = false }: { children: ReactNode; screen?: boolean; tall?: boolean }) {
  const scheme = useSiteScheme();
  const more = useSiteContrast();
  return (
    <HexagonProvider scheme={scheme} moreContrast={more}>
      <div className={`m-phone${screen ? " m-phone--screen" : ""}${tall ? " m-phone--tall" : ""}`}>
        <div className="m-phone__view">{children}</div>
      </div>
    </HexagonProvider>
  );
}
