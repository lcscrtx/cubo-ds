// Confere o contraste de todos os pares de cor que os componentes usam,
// nos temas claro e escuro. Se um token mudar e quebrar o contraste, o teste falha.
import { describe, expect, it } from "vitest";
import { base, dark, theme } from "../tokens/tokens.mjs";

function luminance(hex: string) {
  const [r, g, b] = hex.replace("#", "").match(/../g)!.map((x) => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function palette(mode: "light" | "dark") {
  const light = { ...base.color, ...theme.color } as Record<string, string>;
  return mode === "dark" ? ({ ...light, ...dark.color } as Record<string, string>) : light;
}

// [uso, frente, fundo, mínimo]
const PARES: [string, string, string, number][] = [
  ["texto principal", "text", "bg", 4.5],
  ["texto secundário", "text-2", "bg", 4.5],
  ["texto de apoio e placeholder", "text-3", "bg", 4.5],
  ["texto de apoio sobre superfície", "text-3", "surface", 4.5],
  ["texto do botão principal", "on-accent", "action", 4.5],
  ["texto do botão principal no hover", "on-accent", "action-hover", 4.5],
  ["link, ghost e eyebrow", "action", "bg", 4.5],
  ["badge de destaque", "action-hover", "accent-50", 4.5],
  ["badge de sucesso", "success", "success-soft", 4.5],
  ["badge de atenção", "warning", "warning-soft", 4.5],
  ["badge de erro", "danger", "danger-soft", 4.5],
  ["mensagem de erro", "danger", "bg", 4.5],
  ["borda de campo", "border-strong", "bg", 3],
  ["anel de foco", "action", "bg", 3],
  ["texto sobre a barra escura", "on-dark", "dark", 4.5],
];

describe("contraste dos tokens", () => {
  for (const mode of ["light", "dark"] as const) {
    describe(mode === "light" ? "claro" : "escuro", () => {
      const c = palette(mode);
      for (const [uso, fg, bg, min] of PARES) {
        it(`${uso}: ${min}:1 ou mais`, () => {
          const ratio = contrast(c[fg], c[bg]);
          expect(ratio, `${fg} sobre ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
        });
      }
    });
  }
});
