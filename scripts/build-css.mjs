// Monta dist/styles.css: tokens + base + componentes, nessa ordem.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const parts = ["dist/tokens.css", "src/styles/base.css"];
for (const f of readdirSync("src/components").sort()) {
  if (f.endsWith(".css")) parts.push(`src/components/${f}`);
}
const css = parts.map((p) => `/* ${p.replace(/^(src|dist)\//, "")} */\n${readFileSync(p, "utf8").trim()}\n`).join("\n");
writeFileSync("dist/styles.css", css);
console.log(`styles.css: ${parts.length} arquivos`);
