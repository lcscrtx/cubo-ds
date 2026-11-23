// Criptografa o arquivo do Figma para publicar no site. O .fig original e a senha nunca entram no repositório.
// Uso: FIGMA_SENHA=... node scripts/encrypt-figma.mjs "caminho/do/arquivo.fig"
//
// Formato da saída: "HXF1" (4 bytes) + sal (16) + vetor inicial (12) + conteúdo AES-256-GCM.
// A chave sai da senha por PBKDF2-SHA256. As iterações precisam ser iguais às de site/src/figma/decifrar.ts.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ITERACOES = 1_000_000;
const origem = process.argv[2];
const senha = process.env.FIGMA_SENHA;
if (!origem || !senha) {
  console.error('Uso: FIGMA_SENHA=... node scripts/encrypt-figma.mjs "arquivo.fig"');
  process.exit(1);
}

const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveKey"]);
const chave = await crypto.subtle.deriveKey(
  { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: ITERACOES },
  base,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"],
);
const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, chave, readFileSync(origem)));

const pasta = fileURLToPath(new URL("../site/public/figma/", import.meta.url));
mkdirSync(pasta, { recursive: true });
writeFileSync(pasta + "cubo-design-system.bin", Buffer.concat([Buffer.from("HXF1"), sal, iv, cifrado]));
console.log(`figma: ${cifrado.length} bytes criptografados em site/public/figma/cubo-design-system.bin`);
