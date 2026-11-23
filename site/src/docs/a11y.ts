// Dados de acessibilidade usados pelo site: contraste medido a partir dos tokens e critérios por componente.
import { base, dark, theme } from "../../../tokens/tokens.mjs";

function luminance(hex: string) {
  const [r, g, b] = hex.replace("#", "").match(/../g)!.map((x) => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

export interface ContrastRow {
  uso: string;
  fg: string;
  bg: string;
  ratio: number;
  /** 4.5 para texto, 3 para bordas e ícones de controle. */
  minimo: number;
}

/** Os pares de cor que os componentes realmente usam. */
export function contrastRows(mode: "light" | "dark" = "light"): ContrastRow[] {
  const light = { ...base.color, ...theme.color } as Record<string, string>;
  const c = mode === "dark" ? ({ ...light, ...dark.color } as Record<string, string>) : light;
  const rows: Omit<ContrastRow, "ratio">[] = [
    { uso: "Texto principal", fg: c.text, bg: c.bg, minimo: 4.5 },
    { uso: "Texto secundário", fg: c["text-2"], bg: c.bg, minimo: 4.5 },
    { uso: "Texto de apoio e placeholder", fg: c["text-3"], bg: c.bg, minimo: 4.5 },
    { uso: "Botão principal", fg: c["on-accent"], bg: c.action, minimo: 4.5 },
    { uso: "Link, botão ghost e eyebrow", fg: c.action, bg: c.bg, minimo: 4.5 },
    { uso: "Badge de destaque", fg: c["action-hover"], bg: c["accent-50"], minimo: 4.5 },
    { uso: "Badge de sucesso", fg: c.success, bg: c["success-soft"], minimo: 4.5 },
    { uso: "Badge de atenção", fg: c.warning, bg: c["warning-soft"], minimo: 4.5 },
    { uso: "Badge de erro", fg: c.danger, bg: c["danger-soft"], minimo: 4.5 },
    { uso: "Mensagem de erro", fg: c.danger, bg: c.bg, minimo: 4.5 },
    { uso: "Borda de campo", fg: c["border-strong"], bg: c.bg, minimo: 3 },
    { uso: "Anel de foco", fg: c.action, bg: c.bg, minimo: 3 },
  ];
  return rows.map((r) => ({ ...r, ratio: contrast(r.fg, r.bg) }));
}

export interface Criterio {
  id: string;
  nome: string;
  nivel: "A" | "AA" | "AAA";
}

/** Critérios da WCAG 2.2 citados no site. */
export const CRITERIOS: Record<string, Criterio> = {
  "1.1.1": { id: "1.1.1", nome: "Conteúdo não textual", nivel: "A" },
  "1.3.1": { id: "1.3.1", nome: "Informações e relações", nivel: "A" },
  "1.3.2": { id: "1.3.2", nome: "Sequência com significado", nivel: "A" },
  "1.3.5": { id: "1.3.5", nome: "Identificar a finalidade da entrada", nivel: "AA" },
  "1.4.1": { id: "1.4.1", nome: "Uso de cor", nivel: "A" },
  "1.4.3": { id: "1.4.3", nome: "Contraste mínimo", nivel: "AA" },
  "1.4.4": { id: "1.4.4", nome: "Redimensionar texto", nivel: "AA" },
  "1.4.6": { id: "1.4.6", nome: "Contraste melhorado", nivel: "AAA" },
  "1.4.10": { id: "1.4.10", nome: "Refluxo", nivel: "AA" },
  "1.4.11": { id: "1.4.11", nome: "Contraste não textual", nivel: "AA" },
  "1.4.12": { id: "1.4.12", nome: "Espaçamento de texto", nivel: "AA" },
  "1.4.13": { id: "1.4.13", nome: "Conteúdo em foco ou hover", nivel: "AA" },
  "2.1.1": { id: "2.1.1", nome: "Teclado", nivel: "A" },
  "2.1.2": { id: "2.1.2", nome: "Sem bloqueio do teclado", nivel: "A" },
  "2.2.1": { id: "2.2.1", nome: "Tempo ajustável", nivel: "A" },
  "2.2.2": { id: "2.2.2", nome: "Pausar, parar, ocultar", nivel: "A" },
  "2.3.3": { id: "2.3.3", nome: "Animação por interação", nivel: "AAA" },
  "2.4.1": { id: "2.4.1", nome: "Ignorar blocos", nivel: "A" },
  "2.4.3": { id: "2.4.3", nome: "Ordem do foco", nivel: "A" },
  "2.4.4": { id: "2.4.4", nome: "Finalidade do link", nivel: "A" },
  "2.4.6": { id: "2.4.6", nome: "Cabeçalhos e rótulos", nivel: "AA" },
  "2.4.7": { id: "2.4.7", nome: "Foco visível", nivel: "AA" },
  "2.4.8": { id: "2.4.8", nome: "Localização", nivel: "AAA" },
  "2.5.3": { id: "2.5.3", nome: "Rótulo no nome", nivel: "A" },
  "2.5.5": { id: "2.5.5", nome: "Tamanho do alvo", nivel: "AAA" },
  "2.5.7": { id: "2.5.7", nome: "Movimentos de arrastar", nivel: "AA" },
  "2.5.8": { id: "2.5.8", nome: "Tamanho do alvo (mínimo)", nivel: "AA" },
  "3.2.5": { id: "3.2.5", nome: "Mudança a pedido", nivel: "AAA" },
  "3.3.1": { id: "3.3.1", nome: "Identificação de erro", nivel: "A" },
  "3.3.2": { id: "3.3.2", nome: "Rótulos ou instruções", nivel: "A" },
  "3.3.3": { id: "3.3.3", nome: "Sugestão de erro", nivel: "AA" },
  "4.1.2": { id: "4.1.2", nome: "Nome, função, valor", nivel: "A" },
  "4.1.3": { id: "4.1.3", nome: "Mensagens de status", nivel: "AA" },
};
