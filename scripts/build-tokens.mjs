// Gera dist/tokens.css e dist/tokens.json a partir de tokens/tokens.mjs.
// Também gera native/src/theme/tokens.generated.ts, o tema do pacote React Native.
import { mkdirSync, writeFileSync } from "node:fs";
import { base, dark, mobile, theme } from "../tokens/tokens.mjs";

const PREFIX = "--hx";

/** Achata { color: { accent: "#..." } } em [["--hx-color-accent", "#..."]]. */
function flatten(obj, path = []) {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? flatten(value, [...path, key])
      : [[`${PREFIX}-${[...path, key].join("-")}`, String(value)]],
  );
}

function block(selector, vars) {
  return `${selector} {\n${vars.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}\n`;
}

const banner = "/* @cubo-tecnologia/hexagon · tokens gerados por scripts/build-tokens.mjs. Não editar à mão. */\n\n";

let css = banner;
css += block(":root", [...flatten(base), ...flatten(theme)]);

// Tema escuro: data-theme="dark" em qualquer ancestral, ou data-theme="auto" seguindo o sistema.
// A especificidade é maior que a de :root, para as cores claras de um produto não vazarem para o escuro.
const darkVars = [...flatten({ color: dark.color, shadow: dark.shadow }), ["color-scheme", "dark"]];
const sel = (mode) => `:root[data-theme="${mode}"],\n:root [data-theme="${mode}"]`;
css += "\n/* Tema escuro */\n\n" + block(sel("dark"), darkVars);
css += "\n@media (prefers-color-scheme: dark) {\n" + block(sel("auto"), darkVars).replace(/^(?=.)/gm, "  ") + "}\n";

const json = { base, theme, dark };

// Mobile: os mesmos valores em objetos JS. "accent-50" vira accent50 e "8px" vira 8.
const camel = (k) => k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pick = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !/^(ink|brand)-/.test(k)).map(([k, v]) => [camel(k), v]));
const px = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, parseFloat(v)]));
const light = pick({ ...base.color, ...theme.color });
const native = {
  light,
  dark: { ...light, ...pick(dark.color) },
  space: px(base.space),
  radius: px(theme.radius),
  shadow: { light: theme.shadow, dark: dark.shadow },
  type: Object.fromEntries(Object.entries(mobile.type).map(([k, [size, line]]) => [k, { size, line }])),
  tracking: px(theme.tracking),
  touch: mobile.touch,
  gutter: mobile.gutter,
};
const nativeTs =
  "// Gerado por scripts/build-tokens.mjs. Não editar à mão.\n" +
  `export const tokens = ${JSON.stringify(native, null, 2)};\n`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/tokens.css", css);
writeFileSync("dist/tokens.json", JSON.stringify(json, null, 2) + "\n");
writeFileSync("native/src/theme/tokens.generated.ts", nativeTs);

console.log(`tokens: ${flatten(base).length} de base, ${flatten(theme).length} de tema, ${Object.keys(light).length} cores no mobile`);
