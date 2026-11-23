import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { assistentePlugin } from "./server/assistente";

// O site de documentação usa o código-fonte do pacote direto (sem build),
// então toda mudança em src/ aparece na hora.
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => ({
  root,
  // A chave do assistente vem de site/.env.local e fica só no servidor.
  plugins: [react(), assistentePlugin(loadEnv(mode, root, "").ANTHROPIC_API_KEY)],
  resolve: {
    alias: {
      "@cubo-tecnologia/hexagon": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
  // host: true abre o servidor na rede local, para testar no celular pelo Wi-Fi.
  server: { port: 5700, host: true },
  build: { outDir: "../dist-site", emptyOutDir: true },
}));
