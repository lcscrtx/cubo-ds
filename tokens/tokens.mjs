// Fonte única dos tokens do design system.
// `scripts/build-tokens.mjs` gera daqui o dist/tokens.css (variáveis CSS) e o dist/tokens.json.
//
// Duas camadas:
//   base  → a estrutura: neutros, estados, espaço, tipo e movimento.
//   theme → a aparência: cores, pesos, raios e sombras. Para usar em outro produto, sobrescreva
//           essas variáveis no CSS dele; os componentes não mudam.
//
// Toda variável sai com o prefixo --hx- (Hexagon).

export const base = {
  color: {
    white: "#ffffff",
    "ink-950": "#0d0f14",
    "ink-900": "#1a1d24",
    "ink-700": "#40444e",
    "ink-500": "#676c78",
    "ink-400": "#9196a1",
    "ink-200": "#dfe4ee",
    // Borda de controles (campo, caixa de seleção): 3,7:1 sobre branco, acima do mínimo de 3:1 da WCAG 1.4.11.
    "border-strong": "#80858f",
    // Texto sobre superfícies escuras (barra de acessibilidade, dicas). Inverte no tema escuro.
    "on-dark": "#ffffff",
    "ink-100": "#edf0f6",
    "ink-50": "#f6f8fc",
    // Estados do sistema (formulários, protocolos, avisos).
    success: "#0e7553",
    "success-soft": "#e7f6ef",
    warning: "#8f5d00",
    "warning-soft": "#fff4d6",
    danger: "#c62a2a",
    "danger-soft": "#fdecec",
  },
  space: {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },
  "font-size": {
    display: "clamp(40px, 5.2vw, 68px)",
    h1: "clamp(34px, 4vw, 52px)",
    h2: "clamp(30px, 3.4vw, 44px)",
    h3: "20px",
    lead: "clamp(17px, 1.4vw, 20px)",
    body: "16px",
    small: "14px",
    caption: "13px",
    // Menor texto permitido: 13px. Nada abaixo disso em nenhum componente.
    micro: "13px",
  },
  "line-height": {
    tight: "1.08",
    snug: "1.25",
    normal: "1.55",
  },
  "font-weight": {
    regular: "400",
    medium: "500",
  },
  // Controles têm um tamanho só (md): 36px de altura visível, 14px de fonte.
  // A área de toque é estendida até 44px sem mudar o desenho (WCAG 2.5.5, AAA).
  control: {
    height: "36px",
    "hit-area": "44px",
    "padding-x": "16px",
    "font-size": "14px",
  },
  // Anel de foco: 2px, afastado 2px do elemento. A cor é a de ação.
  focus: {
    width: "2px",
    offset: "2px",
  },
  layout: {
    container: "1200px",
    gutter: "clamp(20px, 4vw, 40px)",
    "section-y": "clamp(72px, 9vw, 128px)",
  },
  motion: {
    ease: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    fast: "150ms",
    base: "200ms",
    slow: "400ms",
  },
};

// Modelo do Cidade Conectada: azul como principal, royal no hover, ice no fundo dos painéis.
// Laranja e ciano existem, mas ficam guardados.
// Tintas da cor de acento: 50 a 300 clareiam, 600 e 800 escurecem. A escala é declarada inteira
// para não depender de color-mix nos navegadores antigos.
export const theme = {
  color: {
    accent: "#0372ff",
    "accent-hover": "#1f299c",
    "accent-800": "#16205b",
    "accent-400": "#4f9bff",
    "accent-300": "#8abcff",
    "accent-200": "#bdd9ff",
    "accent-100": "#dceaff",
    "accent-50": "#eff6ff",
    // Cor de ação: botões, links, foco e texto de destaque. Sempre >= 4,5:1 sobre o fundo.
    action: "#0062e0",
    "action-hover": "#1f299c",
    "on-accent": "#ffffff",
    highlight: "#30d1ff",
    panel: "#e1eaf9",
    text: "#0d0f14",
    "text-2": "#40444e",
    "text-3": "#676c78",
    bg: "#ffffff",
    surface: "#f6f8fc",
    border: "#dfe4ee",
    "border-soft": "#edf0f6",
    dark: "#0d0f14",
    "brand-royal": "#1f299c",
    "brand-navy": "#16205b",
    "brand-cyan": "#30d1ff",
    "brand-periwinkle": "#a3a9f5",
    "brand-slate": "#787ca9",
    "brand-ice": "#e1eaf9",
    "brand-orange": "#f15928",
  },
  // Tipografia única: IBM Plex Sans.
  font: {
    sans: '"IBM Plex Sans Variable", "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    display: "var(--hx-font-sans)",
  },
  "font-weight": { strong: "600", heading: "600" },
  tracking: { display: "-0.025em", heading: "-0.015em" },
  radius: { sm: "6px", md: "8px", lg: "12px", control: "999px" },
  shadow: {
    sm: "0 1px 2px rgb(10 18 38 / 0.04)",
    md: "0 1px 2px rgb(10 18 38 / 0.04), 0 2px 6px -2px rgb(10 18 38 / 0.06)",
    lg: "0 1px 3px rgb(10 18 38 / 0.05), 0 6px 16px -8px rgb(10 18 38 / 0.1)",
  },
};

// =========================================================
// Tema escuro
// Contraste conferido: texto 16,7:1, texto de apoio 7,4:1, ação 7,1:1 ou mais, bordas de controle 3,9:1.
// =========================================================
export const dark = {
  color: {
    "ink-950": "#eef1f6",
    "ink-900": "#e1e5ec",
    "ink-700": "#c4c9d3",
    "ink-500": "#9ca3af",
    "ink-400": "#8a919c",
    "ink-200": "#343944",
    "ink-100": "#232731",
    "ink-50": "#171a21",
    "border-strong": "#6b7280",
    "on-dark": "#0f1115",
    success: "#5fd49a",
    "success-soft": "#0f2a1f",
    warning: "#f0b84a",
    "warning-soft": "#2e2310",
    danger: "#ff8f8f",
    "danger-soft": "#3a1717",
    text: "#eef1f6",
    "text-2": "#c4c9d3",
    "text-3": "#9ca3af",
    bg: "#0f1115",
    surface: "#171a21",
    border: "#343944",
    "border-soft": "#232731",
    dark: "#e8ebf1",
    "on-accent": "#0b0d12",
    action: "#6ea8ff",
    "action-hover": "#9cc3ff",
    accent: "#6ea8ff",
    "accent-hover": "#9cc3ff",
    "accent-50": "#152238",
    "accent-100": "#1b2d4d",
    "accent-200": "#264070",
    "accent-300": "#355a9c",
    "accent-400": "#4f82d6",
    "accent-800": "#d4e5ff",
    panel: "#141c2c",
    highlight: "#30d1ff",
  },
  shadow: {
    sm: "0 1px 2px rgb(0 0 0 / 0.4)",
    md: "0 1px 2px rgb(0 0 0 / 0.4), 0 2px 6px -2px rgb(0 0 0 / 0.5)",
    lg: "0 1px 3px rgb(0 0 0 / 0.5), 0 8px 24px -8px rgb(0 0 0 / 0.6)",
  },
};

// =========================================================
// Mobile (React Native)
// Cores, raio, espaço e sombra são os mesmos da web. Aqui fica só o que muda no celular:
// escala de texto fixa (a pessoa amplia pela fonte do sistema) e alvo de toque maior.
// =========================================================
export const mobile = {
  // [tamanho, entrelinha], em pontos.
  type: {
    display: [32, 38],
    h1: [28, 34],
    h2: [22, 28],
    h3: [18, 24],
    body: [16, 24],
    small: [14, 20],
    caption: [13, 18],
  },
  // 48 atende o mínimo do Android (48dp) e passa o do iOS (44pt) e o da WCAG 2.5.5 (44px).
  touch: 48,
  gutter: 16,
};
