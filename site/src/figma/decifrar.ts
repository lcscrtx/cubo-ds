// Abre o arquivo do Figma criptografado por scripts/encrypt-figma.mjs, direto no navegador.

/** Precisa ser igual ao valor de scripts/encrypt-figma.mjs. */
const ITERACOES = 1_000_000;
const ARQUIVO = "/figma/cubo-design-system.bin";

export class SenhaErrada extends Error {}

export async function decifrarFigma(senha: string): Promise<Blob> {
  const r = await fetch(ARQUIVO);
  if (!r.ok) throw new Error("download");
  const bytes = new Uint8Array(await r.arrayBuffer());
  if (new TextDecoder().decode(bytes.subarray(0, 4)) !== "HXF1") throw new Error("formato");

  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveKey"]);
  const chave = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: bytes.slice(4, 20), iterations: ITERACOES },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  try {
    const aberto = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(20, 32) }, chave, bytes.slice(32));
    return new Blob([aberto], { type: "application/octet-stream" });
  } catch {
    // O AES-GCM confere a integridade: senha errada sempre cai aqui.
    throw new SenhaErrada();
  }
}
