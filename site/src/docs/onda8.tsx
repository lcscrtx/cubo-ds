import { useState } from "react";
import { AccessibilityBar, Button, Checkbox, DescriptionList, Drawer, FilterChip, Link, Popover, Stat, Tag, Timeline, type AccessibilityPrefs } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Ver protocolo 2026-001043</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Protocolo 2026-001043"
        description="Cartão SUS · Maria das Graças Lima"
        actions={<><Button variant="secondary" onClick={() => setOpen(false)}>Fechar</Button><Button onClick={() => setOpen(false)}>Emitir cartão</Button></>}
      >
        <DescriptionList columns={1} items={[{ term: "CPF", detail: "529.982.247-25" }, { term: "Telefone", detail: "(83) 99876-5432" }, { term: "Bairro", detail: "Tambaú" }]} />
        <div style={{ height: 20 }} />
        <Timeline
          label="Histórico"
          events={[
            { id: "a", title: "Solicitação aberta", date: "2026-11-12T09:14:00", icon: "novo", tone: "accent" },
            { id: "b", title: "Documentos conferidos", date: "2026-11-13T15:40:00", icon: "concluido", tone: "success" },
          ]}
        />
      </Drawer>
    </>
  );
}

const SECS = ["Saúde", "Educação", "Infraestrutura", "Meio Ambiente"];

function FiltrosDemo() {
  const [sel, setSel] = useState<string[]>(["Saúde"]);
  const [atrasados, setAtrasados] = useState(true);
  const toggle = (s: string) => setSel((l) => (l.includes(s) ? l.filter((x) => x !== s) : [...l, s]));
  const ativos = [...sel, ...(atrasados ? ["Atrasados"] : [])];
  return (
    <div className="s-stack" style={{ width: "100%" }}>
      <div className="s-row" role="group" aria-label="Filtrar por secretaria">
        {SECS.map((s, i) => <FilterChip key={s} selected={sel.includes(s)} onChange={() => toggle(s)} count={[42, 18, 27, 9][i]}>{s}</FilterChip>)}
        <FilterChip selected={atrasados} onChange={setAtrasados}>Atrasados</FilterChip>
      </div>
      {ativos.length > 0 && (
        <div className="s-row" style={{ gap: 6 }}>
          <span className="s-muted" style={{ fontSize: 13 }}>Filtros ativos:</span>
          {ativos.map((a) => (
            <Tag key={a} removeLabel={`Remover filtro ${a}`} onRemove={() => (a === "Atrasados" ? setAtrasados(false) : toggle(a))}>{a}</Tag>
          ))}
          <button type="button" className="hx-link" style={{ border: 0, background: "none", font: "inherit", fontSize: 13, cursor: "pointer" }} onClick={() => { setSel([]); setAtrasados(false); }}>Limpar filtros</button>
        </div>
      )}
    </div>
  );
}

function BarDemo() {
  // Estado local: a demonstração não mexe nas preferências reais do site.
  const [p, setP] = useState<AccessibilityPrefs>({ contrast: false, reduceMotion: false, text: 0, theme: "light" });
  return (
    <div style={{ width: "100%" }}>
      <AccessibilityBar prefs={p} onChange={setP} policyHref="#" policyLabel="Acessibilidade" />
      <p className="s-muted" style={{ fontSize: 13, margin: "10px 0 0" }}>
        Estado: texto {["normal", "maior", "muito maior"][p.text]}, contraste {p.contrast ? "ligado" : "desligado"}, animações {p.reduceMotion ? "pausadas" : "ligadas"}, tema {p.theme === "dark" ? "escuro" : "claro"}.
      </p>
    </div>
  );
}

export const ONDA8: Record<string, Doc> = {
  drawer: {
    eyebrow: "Componente",
    title: "Drawer",
    criterios: ["1.3.1", "2.1.1", "2.1.2", "2.4.3", "4.1.2"],
    lead: "Painel lateral para ver ou editar algo sem sair da lista. Mesmo comportamento do Dialog: foco preso, Esc fecha, foco volta.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<Drawer
  open={aberto}
  onClose={() => setAberto(false)}
  title="Protocolo 2026-001043"
  description="Cartão SUS · Maria das Graças Lima"
  actions={<><Button variant="secondary">Fechar</Button><Button>Emitir cartão</Button></>}
>
  <DescriptionList … />
</Drawer>`}
          >
            <DrawerDemo />
          </Example>
          <Note>No celular, o painel ocupa a tela toda. Para uma decisão rápida (sim ou não), prefira o Dialog.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["open / onClose", "boolean / () => void", "", "Aberto e fechar."],
              ["title, description", "ReactNode", "", "Nome e apoio, lidos ao abrir."],
              ["actions", "ReactNode", "", "Botões presos no rodapé."],
              ["size", `"md" | "lg"`, "md", "Largura: 440px ou 640px."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>dialog</code> nativo: foco preso no painel, fundo inerte, Esc fecha e o foco volta ao botão que abriu.</li>
            <li>Ao abrir, o leitor de tela lê o título e a descrição. O botão Fechar diz "Fechar painel".</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  popover: {
    eyebrow: "Componente",
    title: "Popover",
    criterios: ["1.3.1", "1.4.13", "2.1.1", "2.4.3", "4.1.2"],
    lead: "Painel pequeno ao lado de um botão, sem bloquear a página. Diferente da Tooltip, pode ter links, campos e botões.",
    body: () => (
      <>
        <DocSection title="Exemplo">
          <Example
            code={`<Popover trigger="Colunas" title="Mostrar colunas">
  <Checkbox label="Protocolo" defaultChecked disabled />
  <Checkbox label="Secretaria" defaultChecked />
  <Checkbox label="Dias em aberto" />
</Popover>`}
          >
            <div className="s-row">
              <Popover trigger="Colunas" title="Mostrar colunas">
                <Checkbox label="Protocolo" defaultChecked disabled />
                <Checkbox label="Secretaria" defaultChecked />
                <Checkbox label="Dias em aberto" defaultChecked />
                <Checkbox label="Responsável" />
              </Popover>
              <Popover trigger="O que é prazo legal?" triggerVariant="ghost" title="Prazo legal">
                <p style={{ margin: "0 0 8px", color: "var(--hx-color-text-2)" }}>É o tempo máximo que a lei dá à prefeitura para responder. Para a maioria dos serviços, 30 dias.</p>
                <Link href="#" standalone>Ver a Carta de Serviços</Link>
              </Popover>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["trigger", "ReactNode", "", "Texto do botão."],
              ["triggerVariant", `"secondary" | "ghost"`, "secondary", "Estilo do botão."],
              ["title", "ReactNode", "", "Título do painel."],
              ["align", `"start" | "end"`, "start", "Alinhamento com o botão."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Botão com <code>aria-expanded</code>; o painel vem logo depois dele no Tab.</li>
            <li>Esc fecha e devolve o foco ao botão; clicar fora também fecha.</li>
            <li>O painel fica aberto até a pessoa fechar: não some sozinho.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "tag-filter": {
    eyebrow: "Componente",
    title: "Tag e FilterChip",
    criterios: ["1.4.1", "2.1.1", "2.4.7", "2.5.8", "4.1.2"],
    lead: "FilterChip liga e desliga um filtro; Tag mostra os filtros ativos e deixa remover cada um.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<FilterChip selected={saude} onChange={setSaude} count={42}>Saúde</FilterChip>

<Tag onRemove={() => remover("Saúde")} removeLabel="Remover filtro Saúde">Saúde</Tag>`}
          >
            <FiltrosDemo />
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["FilterChip · selected / onChange", "boolean", "", "Ligado ou não."],
              ["FilterChip · count", "number", "", "Quantos resultados."],
              ["Tag · onRemove", "() => void", "", "Mostra o X."],
              ["Tag · removeLabel", "string", `"Remover <texto>"`, "Nome do botão de remover."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>FilterChip é um botão com <code>aria-pressed</code>: o leitor de tela diz "Saúde, pressionado". Ligado ganha check e borda, não só cor.</li>
            <li>O X da Tag diz o que remove: "Remover filtro Saúde".</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  stat: {
    eyebrow: "Componente",
    title: "Stat",
    criterios: ["1.3.1", "1.4.1", "1.4.3"],
    lead: "Indicador do painel do gestor. A variação vem escrita (\"Subiu 12% em relação a outubro\"), com seta e cor que diz se é bom ou ruim.",
    body: () => (
      <>
        <DocSection title="Exemplos">
          <Example
            code={`<Stat label="Solicitações concluídas" value="188.402" change={12} comparedTo="2024" help="Em 2025" />
<Stat label="Tempo médio de resposta" value="6,2 dias" change={-18} comparedTo="outubro" invert />
<Stat label="Reclamações na ouvidoria" value="214" change={9} comparedTo="outubro" invert />`}
          >
            <div className="s-cardgrid s-cardgrid--3">
              <Stat label="Solicitações concluídas" value="188.402" change={12} comparedTo="2024" help="Em 2025" />
              <Stat label="Tempo médio de resposta" value="6,2 dias" change={-18} comparedTo="outubro" invert />
              <Stat label="Reclamações na ouvidoria" value="214" change={9} comparedTo="outubro" invert />
            </div>
          </Example>
          <Note>Use <code>invert</code> quando subir é ruim: tempo de espera, reclamações, atrasos. Aí a queda fica verde.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "O que é medido."],
              ["value", "ReactNode", "", "O número, já formatado."],
              ["change", "number", "", "Variação em %."],
              ["comparedTo", "string", "", "Período comparado."],
              ["invert", "boolean", "false", "Subir é ruim."],
              ["help", "ReactNode", "", "Linha de apoio."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>A variação é lida por extenso: "Caiu 18% em relação a outubro". Seta, sinal e cor só reforçam.</li>
            <li>Números com algarismos de mesma largura, para comparar de relance.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "accessibility-bar": {
    eyebrow: "Componente",
    title: "AccessibilityBar",
    criterios: ["1.4.3", "1.4.4", "1.4.6", "2.2.2", "2.3.3", "4.1.2"],
    lead: "A barra de acessibilidade do topo, a mesma deste site, pronta para qualquer produto: tamanho do texto, mais contraste e pausar animações.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <p>Esta é uma cópia de demonstração: os botões dela não mudam o site. Para ver o efeito de verdade, use a barra no topo da página.</p>
          <Example
            pad={false}
            code={`const [prefs, setPrefs] = useAccessibilityPrefs();

<AccessibilityBar
  prefs={prefs}
  onChange={setPrefs}
  policyHref="/acessibilidade"
  policyLabel="Acessibilidade"
/>`}
          >
            <BarDemo />
          </Example>
        </DocSection>
        <DocSection title="Como funciona">
          <ul className="s-list">
            <li><code>useAccessibilityPrefs()</code> guarda a escolha no navegador e põe no <code>&lt;html&gt;</code>: <code>data-text</code>, <code>data-contrast="more"</code> e <code>data-motion="reduce"</code>.</li>
            <li>Todo o Hexagon entende esses atributos: o texto cresce, os cinzas e as bordas escurecem e as animações param.</li>
            <li>As preferências do sistema (mais contraste, menos movimento) já valem sozinhas; a barra é para quem não sabe mexer nelas.</li>
          </ul>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["prefs / onChange", "AccessibilityPrefs", "", "Use com useAccessibilityPrefs()."],
              ["policyHref / policyLabel", "string", "", "Link para a página de acessibilidade do órgão."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Cada botão diz se está ligado (<code>aria-pressed</code>); os de tamanho ficam num grupo com nome.</li>
            <li>Atende pedidos comuns do eMAG para sites de governo: aumentar texto e alto contraste no topo.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
