// Gera dist/tokens.css e dist/tokens.json a partir de tokens/tokens.mjs.
import { mkdirSync, writeFileSync } from "node:fs";
import { base, dark, theme } from "../tokens/tokens.mjs";

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

mkdirSync("dist", { recursive: true });
writeFileSync("dist/tokens.css", css);
writeFileSync("dist/tokens.json", JSON.stringify(json, null, 2) + "\n");

console.log(`tokens: ${flatten(base).length} de base, ${flatten(theme).length} de tema`);
