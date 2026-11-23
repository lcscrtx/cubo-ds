// Rota POST /api/assistente do servidor de desenvolvimento.
// Recebe a tela lida (sem dados digitados) e pede ao Claude a explicação ou a versão simples.
// A chave fica só no servidor: ANTHROPIC_API_KEY em site/.env.local (nunca vai para o navegador).
import type { Plugin } from "vite";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { Explicacao, Simplificacao, type Acao } from "../src/lab/respostas";

const SISTEMA = `Você é o assistente de compreensão de um portal de serviços públicos de uma prefeitura brasileira.
Quem usa pode ter pouca leitura, ser idoso, ter deficiência intelectual ou simplesmente estar com pressa.

Você recebe a tela atual em JSON: título, etapa, textos, campos (rótulo, dica, se é obrigatório, erro) e avisos.
Nunca recebe o que a pessoa digitou.

Regras de linguagem simples:
- Frases curtas, uma ideia por frase. Palavras do dia a dia. Fale com "você".
- Troque termos técnicos por explicações: "comprovante de residência" vira "conta de luz, água ou telefone no seu nome".
- Sem siglas sem explicar (na primeira vez: "CPF, o número do seu documento de pessoa física").

Regras de verdade (as mais importantes):
- Use só o que está na tela. Nunca invente prazo, valor, horário, endereço, documento ou regra.
- Se algo importante não estiver na tela, não chute: coloque em "naoInforma" para a pessoa perguntar ao atendimento.
- Na simplificação, mantenha todos os fatos do texto original (prazos, números, documentos), só mude a forma de dizer.
- Não diga que é uma IA nem fale de você mesmo.`;

const PEDIDO: Record<Acao, string> = {
  explicar: "Explique esta página para quem vai usar agora.",
  simplificar: "Reescreva cada seção de texto desta página em linguagem simples, na mesma ordem e com os mesmos títulos.",
};

export function assistentePlugin(apiKey: string | undefined): Plugin {
  return {
    name: "hexagon-assistente",
    configureServer(server) {
      server.middlewares.use("/api/assistente", async (req, res) => {
        const responder = (status: number, corpo: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(corpo));
        };
        if (req.method !== "POST") return responder(405, { erro: "metodo" });
        if (!apiKey) return responder(503, { erro: "sem-chave" });

        let corpo = "";
        for await (const parte of req) corpo += parte;
        let acao: Acao;
        let tela: unknown;
        try {
          ({ acao, tela } = JSON.parse(corpo));
          if (acao !== "explicar" && acao !== "simplificar") throw new Error();
        } catch {
          return responder(400, { erro: "pedido-invalido" });
        }

        const client = new Anthropic({ apiKey });
        try {
          const resposta = await client.beta.messages.parse({
            model: "claude-opus-5-5",
            max_tokens: 8000,
            // Tarefa curta e alguém esperando na tela: esforço baixo responde mais rápido.
            output_config: { effort: "low", format: betaZodOutputFormat(acao === "explicar" ? Explicacao : Simplificacao) },
            // Se o modelo recusar por engano, a própria API tenta de novo em outro modelo.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
            messages: [{ role: "user", content: `${PEDIDO[acao]}\n\nTela atual:\n${JSON.stringify(tela)}` }],
          });
          if (resposta.stop_reason === "refusal" || !resposta.parsed_output) return responder(502, { erro: "sem-resposta" });
          return responder(200, { acao, dados: resposta.parsed_output, demo: false });
        } catch (e) {
          if (e instanceof Anthropic.AuthenticationError) return responder(503, { erro: "chave-invalida" });
          if (e instanceof Anthropic.RateLimitError) return responder(429, { erro: "limite" });
          server.config.logger.error(`[assistente] ${e instanceof Error ? e.message : String(e)}`);
          return responder(502, { erro: "falha" });
        }
      });
    },
  };
}
