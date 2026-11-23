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
      "@cubo-tecnologia/hexagon-native": fileURLToPath(new URL("../native/src/index.ts", import.meta.url)),
      // A documentação mobile roda os componentes React Native no navegador.
      "react-native": "react-native-web",
    },
    // Arquivos .web.tsx vencem os nativos, como no Metro.
    extensions: [".web.tsx", ".web.ts", ".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
  // host: true abre o servidor na rede local, para testar no celular pelo Wi-Fi.
  server: { port: 5700, host: true },
  build: { outDir: "../dist-site", emptyOutDir: true },
}));
