// Formato das respostas do assistente. Usado pelo servidor (validação) e pela tela (tipos).
import { z } from "zod";

export const Explicacao = z.object({
  resumo: z.string().describe("Uma ou duas frases: para que serve esta página."),
  passos: z.array(z.string()).describe("O que a pessoa faz, na ordem, em frases curtas."),
  precisaTer: z.array(z.string()).describe("Documentos e informações que a pessoa precisa ter em mãos. Só o que a página cita."),
  atencao: z.array(z.string()).describe("Avisos, prazos ou erros que aparecem na tela. Vazio se não houver."),
  naoInforma: z.array(z.string()).describe("Dúvidas comuns que a página NÃO responde, para perguntar ao atendimento. No máximo 2."),
});
export type Explicacao = z.infer<typeof Explicacao>;

export const Simplificacao = z.object({
  secoes: z.array(z.object({ titulo: z.string(), texto: z.string().describe("O texto da seção em linguagem simples.") })),
});
export type Simplificacao = z.infer<typeof Simplificacao>;

export type Acao = "explicar" | "simplificar";
export type RespostaAssistente =
  | { acao: "explicar"; dados: Explicacao; demo: boolean }
  | { acao: "simplificar"; dados: Simplificacao; demo: boolean };
