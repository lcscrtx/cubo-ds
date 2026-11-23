// Lê a tela como um mapa organizado para o assistente: títulos, textos, campos, etapa e avisos.
// Regra de privacidade (LGPD): NUNCA lê o que a pessoa digitou. Dos campos, só rótulo, dica,
// obrigatoriedade e erro. Nada de value, nome de arquivo escolhido ou opção marcada.

export type CampoLido = { rotulo: string; tipo: string; obrigatorio: boolean; dica?: string; erro?: string };
export type SecaoLida = { titulo: string; textos: string[] };
export type TelaLida = {
  titulo: string;
  etapa?: { atual: number; total: number; nome: string };
  secoes: SecaoLida[];
  campos: CampoLido[];
  avisos: { titulo: string; texto: string }[];
};

const IGNORAR = "[data-assist-ignore], dialog, [aria-hidden='true'], script, style, svg";
const limpa = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

/** Texto de um elemento sem as partes marcadas para ignorar. */
function texto(el: Element): string {
  const c = el.cloneNode(true) as Element;
  c.querySelectorAll(IGNORAR).forEach((n) => n.remove());
  return limpa(c.textContent);
}

function lerCampo(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): CampoLido | null {
  if (el instanceof HTMLInputElement && ["hidden", "submit", "button", "search"].includes(el.type)) return null;
  const label = el.labels?.[0];
  let rotulo = label ? texto(label) : limpa(el.getAttribute("aria-label"));
  if (!rotulo) {
    const fs = el.closest("fieldset");
    rotulo = fs?.querySelector("legend") ? texto(fs.querySelector("legend")!) : "";
  }
  rotulo = rotulo.replace(/\s*\(obrigatório\)\s*/i, "").trim();
  if (!rotulo) return null;
  const desc = limpa(el.getAttribute("aria-describedby"))
    .split(" ")
    .filter(Boolean)
    .map((id) => document.getElementById(id))
    .filter((n): n is HTMLElement => !!n);
  const erroEl = desc.find((n) => n.classList.contains("hx-field__error"));
  const dica = desc.filter((n) => n !== erroEl).map(texto).filter(Boolean).join(" ");
  const erro = erroEl ? texto(erroEl) : "";
  const tipo = el instanceof HTMLSelectElement ? "lista" : el instanceof HTMLTextAreaElement ? "texto longo" : el.type === "file" ? "arquivo" : el.type === "radio" ? "escolha" : el.type === "checkbox" ? "marcar" : "texto";
  return { rotulo, tipo, obrigatorio: el.required || el.getAttribute("aria-required") === "true", ...(dica && { dica }), ...(erro && { erro }) };
}

export function lerTela(root: HTMLElement): TelaLida {
  const h1 = root.querySelector("h1");
  const tela: TelaLida = { titulo: h1 ? texto(h1) : document.title, secoes: [], campos: [], avisos: [] };

  // Etapa do Stepper
  const atual = root.querySelector(".hx-stepper [aria-current='step']");
  if (atual) {
    const passos = [...root.querySelectorAll(".hx-stepper__step")];
    tela.etapa = { atual: passos.indexOf(atual) + 1, total: passos.length, nome: texto(atual.querySelector(".hx-stepper__label") ?? atual).replace(/,\s*(concluída|a fazer)$/, "") };
  }

  // Avisos
  root.querySelectorAll(".hx-alert").forEach((a) => {
    if (a.closest(IGNORAR)) return;
    const t = a.querySelector(".hx-alert__title");
    tela.avisos.push({ titulo: t ? texto(t) : "", texto: texto(a).replace(t ? texto(t) : "", "").trim() });
  });

  // Campos (um grupo de rádios vira um campo só)
  const vistos = new Set<string>();
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea").forEach((el) => {
    if (el.closest(IGNORAR)) return;
    const c = lerCampo(el);
    if (!c || vistos.has(c.rotulo)) return;
    if (el instanceof HTMLInputElement && el.type === "radio") {
      const fs = el.closest("fieldset");
      const legend = fs?.querySelector("legend");
      if (legend) {
        const opcoes = [...fs!.querySelectorAll("input[type=radio]")].map((r) => ((r as HTMLInputElement).labels?.[0] ? texto((r as HTMLInputElement).labels![0]) : "")).filter(Boolean);
        c.rotulo = texto(legend).replace(/\s*\(obrigatório\)\s*/i, "");
        c.dica = [c.dica, `Opções: ${opcoes.join(", ")}`].filter(Boolean).join(" ");
      }
    }
    if (vistos.has(c.rotulo)) return;
    vistos.add(c.rotulo);
    tela.campos.push(c);
  });

  // Textos corridos, agrupados pelo título mais próximo
  const FORA = ".hx-field, .hx-stepper, .hx-alert, .hx-upload, .hx-radio-group, label, legend, button, nav";
  let secao: SecaoLida = { titulo: tela.titulo, textos: [] };
  tela.secoes.push(secao);
  root.querySelectorAll("h2, h3, h4, p, li, dt, dd").forEach((el) => {
    if (el.closest(IGNORAR) || el.closest(FORA)) return;
    const t = texto(el);
    if (!t) return;
    if (/^H[234]$/.test(el.tagName)) {
      secao = { titulo: t, textos: [] };
      tela.secoes.push(secao);
    } else if (!secao.textos.includes(t)) secao.textos.push(t);
  });
  tela.secoes = tela.secoes.filter((s) => s.textos.length);
  return tela;
}
