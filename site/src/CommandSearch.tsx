// Busca rápida do site (⌘K / Ctrl K), como no shadcn e no Radix.
// Usa o Dialog do Hexagon; a lista segue o padrão combobox da WAI-ARIA.
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@cubo-tecnologia/hexagon";
import { NAV } from "./docs/nav";
import { COMPONENTES } from "./docs/componentes";
import { SECOES } from "./docs/secoes";

/** Palavras do dia a dia que levam a cada página. */
const SINONIMOS: Record<string, string> = {
  button: "botao acao enviar salvar",
  "icon-button": "icone dica tooltip hint",
  link: "ancora externo nova aba",
  menu: "acoes opcoes tres pontos dropdown",
  breadcrumb: "trilha caminho voltar",
  tabs: "abas guias",
  pagination: "paginas paginacao proxima",
  stepper: "etapas passos wizard progresso formulario",
  "text-field": "campo texto input nome",
  textarea: "texto longo descricao observacao contador",
  "masked-field": "cpf cnpj telefone celular cep mascara documento",
  "date-field": "data calendario nascimento dia",
  select: "lista escolha opcao dropdown",
  combobox: "busca autocomplete lista servicos bairro",
  checkbox: "caixa marcar termos aceite",
  "radio-group": "opcao unica escolha radio",
  switch: "liga desliga chave toggle configuracao",
  "file-upload": "anexo arquivo documento enviar upload pdf foto",
  "search-field": "busca pesquisar procurar",
  alert: "aviso alerta erro sucesso mensagem",
  toast: "notificacao aviso rapido snackbar",
  badge: "etiqueta status situacao selo",
  progress: "barra andamento carregando porcentagem",
  skeleton: "carregando esboco loading",
  "empty-state": "vazio nenhum resultado sem dados",
  dialog: "janela modal confirmar popup",
  drawer: "painel lateral gaveta",
  popover: "painel flutuante balao",
  "page-header": "cabecalho titulo pagina",
  card: "cartao caixa superficie",
  heading: "titulo h1 eyebrow",
  accordion: "perguntas faq sanfona expandir",
  "description-list": "dados detalhes campos valores",
  timeline: "historico linha do tempo eventos",
  table: "tabela dados lista protocolos ordenar",
  stat: "indicador numero kpi dashboard painel",
  "tag-filter": "filtro etiqueta chip",
  avatar: "foto iniciais usuario pessoa",
  "accessibility-bar": "acessibilidade contraste fonte maior tema escuro barra",
  acessibilidade: "wcag emag nbr lei contraste leitor de tela",
  instalacao: "npm instalar comecar setup tema personalizar cores",
  fundacao: "tokens cores tipografia espaco raio sombra",
};

const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const DOCS = { ...SECOES, ...COMPONENTES } as Record<string, { lead: unknown }>;

type Item = { slug: string; title: string; to: string; group: string; desc: string; hay: string; syn: string };

const ITENS: Item[] = NAV.flatMap((g) =>
  g.items.map((i) => {
    const lead = DOCS[i.slug]?.lead;
    const desc = typeof lead === "string" ? lead : "";
    const group = g.title === "Seções" ? "Começando" : g.title;
    return { slug: i.slug, title: i.title, to: i.to, group, desc, hay: sem(`${i.title} ${group} ${desc} ${SINONIMOS[i.slug] ?? ""}`), syn: sem(SINONIMOS[i.slug] ?? "") };
  }),
);
const SUGESTOES = ["introducao", "instalacao", "acessibilidade", "button", "text-field", "masked-field"];

function busca(q: string): Item[] {
  const termos = sem(q).split(/\s+/).filter(Boolean);
  if (!termos.length) return SUGESTOES.map((s) => ITENS.find((i) => i.slug === s)!).filter(Boolean);
  return ITENS.map((it) => {
    if (!termos.every((t) => it.hay.includes(t))) return null;
    const t = sem(it.title);
    // Título que começa com o termo vem primeiro; depois título que contém; depois palavra-chave; por último, a descrição.
    const score = termos.reduce((n, term) => n + (t.startsWith(term) ? 4 : t.includes(term) ? 3 : it.syn.includes(term) ? 2 : 1), 0);
    return { it, score };
  })
    .filter((x): x is { it: Item; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.it)
    .slice(0, 12);
}

export function useSearchShortcut(open: () => void) {
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
}

export function SearchButton({ onOpen }: { onOpen: () => void }) {
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <button type="button" className="s-search-btn" aria-label="Buscar na documentação" onClick={onOpen} aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
      <span className="s-search-btn__label">Buscar na documentação…</span>
      <span className="s-search-btn__short" aria-hidden="true">Buscar…</span>
      <kbd aria-hidden="true">{mac ? "⌘" : "Ctrl"} K</kbd>
    </button>
  );
}

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const base = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const results = useMemo(() => busca(q), [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (it: Item) => {
    onClose();
    navigate(it.to);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  const vazio = q.trim() !== "" && results.length === 0;

  return (
    <Dialog open={open} onClose={onClose} title="Buscar na documentação" className="s-cmdk">
      <div className="s-cmdk__box">
        <svg className="s-cmdk__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
        <input
          className="s-cmdk__input"
          // autoFocus: ao abrir a janela, o foco vai direto para o campo.
          autoFocus
          role="combobox"
          aria-label="Buscar componentes e páginas"
          aria-expanded={!vazio}
          aria-controls={`${base}-list`}
          aria-activedescendant={results[active] ? `${base}-o${active}` : undefined}
          aria-autocomplete="list"
          placeholder="Componente, campo, aviso, cpf…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
        />
      </div>
      <p className="s-cmdk__group">{q.trim() ? "Resultados" : "Sugestões"}</p>
      {vazio ? (
        <p className="s-cmdk__empty">Nada encontrado para "{q}". Tente o nome do componente ou uma palavra como "data" ou "aviso".</p>
      ) : (
        <ul ref={listRef} id={`${base}-list`} role="listbox" aria-label="Resultados" className="s-cmdk__list">
          {results.map((it, i) => (
            <li
              key={it.slug}
              id={`${base}-o${i}`}
              data-i={i}
              role="option"
              aria-selected={i === active}
              className="s-cmdk__opt"
              onMouseMove={() => active !== i && setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(it)}
            >
              <span className="s-cmdk__title">{it.title}</span>
              <span className="s-cmdk__meta">{it.group}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="s-sr" aria-live="polite">{q.trim() ? (vazio ? "Nenhum resultado" : `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`) : ""}</p>
      <p className="s-cmdk__hint" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> navegar <kbd>Enter</kbd> abrir <kbd>Esc</kbd> fechar</p>
    </Dialog>
  );
}
