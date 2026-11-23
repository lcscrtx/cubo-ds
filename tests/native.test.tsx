// Componentes React Native, renderizados pelo react-native-web: axe, comportamento, alvo de toque e contraste.
// O que só existe no aparelho (TalkBack, VoiceOver, fonte do sistema) não é coberto aqui.
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";
import {
  Alert, Badge, BottomNav, BottomSheet, Button, Card, Checkbox, createTheme, HexagonProvider, Icon, IconButton, ICONS, ListItem, ScreenHeader, Select, Switch, Text, TextField,
  type BrandColors, type Colors,
} from "../native/src/index";

afterEach(cleanup);

const noop = () => undefined;
const OPC = [{ value: "a", label: "Saúde" }, { value: "b", label: "Educação", description: "Matrícula" }, { value: "c", label: "Obras", disabled: true }];
const ABAS = [{ id: "i", label: "Início", icon: "inicio" as const }, { id: "a", label: "Avisos", icon: "avisos" as const, count: 3 }];

async function montar(ui: ReactElement, scheme: "light" | "dark" = "light") {
  const r = render(<HexagonProvider scheme={scheme}><main>{ui}</main></HexagonProvider>);
  // Deixa a leitura de "menos movimento" do sistema terminar.
  await act(async () => undefined);
  return r;
}

const CASOS: [string, ReactElement][] = [
  ["Text", <><Text variant="h1" heading={1}>Título</Text><Text>Corpo</Text></>],
  ["Icon", <p>Status <Icon name="em-analise" /></p>],
  ["Button", <><Button onPress={noop}>Salvar</Button><Button variant="secondary" iconStart="mais" onPress={noop}>Nova</Button><Button variant="ghost" disabled onPress={noop}>Ver</Button><Button loading onPress={noop}>Enviar</Button></>],
  ["IconButton", <IconButton icon="busca" label="Buscar" dot onPress={noop} />],
  ["TextField", <><TextField label="Nome" required hint="Completo." /><TextField label="CPF" error="Confira o CPF." /><TextField label="Obs" multiline disabled /></>],
  ["Select", <Select label="Secretaria" required options={OPC} value="a" onChange={noop} hint="Escolha uma." error="Escolha." />],
  ["Checkbox", <><Checkbox label="Aceito" checked onChange={noop} /><Checkbox label="Todos" checked="mixed" onChange={noop} hint="Canais" error="Marque." /></>],
  ["Switch", <><Switch label="Avisos" hint="WhatsApp" checked onChange={noop} /><Switch label="Som" checked={false} onChange={noop} disabled /></>],
  ["Card", <><Card><Text>Conteúdo</Text></Card><Card onPress={noop} label="Cartão SUS"><Text>Cartão SUS</Text></Card></>],
  ["ListItem", <><ListItem title="Cartão SUS" description="2026" accessory={<Badge>Novo</Badge>} accessoryLabel="novo" onPress={noop} /><ListItem title="Versão" value="1.0" /></>],
  ["Alert", <><Alert title="Aviso">Texto</Alert><Alert tone="danger" live title="Erro" actions={<Button onPress={noop}>Tentar</Button>}>Sem conexão</Alert></>],
  ["Badge", <Badge tone="success" icon="concluido">Concluído</Badge>],
  ["ScreenHeader", <ScreenHeader title="Pedidos" subtitle="Maria" onBack={noop} actions={[{ icon: "busca", label: "Buscar", onPress: noop }]} />],
  ["BottomNav", <BottomNav items={ABAS} value="i" onChange={noop} />],
];

describe("mobile · axe", () => {
  for (const scheme of ["light", "dark"] as const)
    for (const [nome, ui] of CASOS)
      it(`${nome} sem violações · ${scheme}`, async () => {
        const { container } = await montar(ui, scheme);
        const r = await axe.run(container, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
        expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" ")}`)).toEqual([]);
      });

  it("BottomSheet sem violações", async () => {
    await montar(<BottomSheet open onClose={noop} title="Cancelar?" description="Não dá para desfazer." actions={<Button onPress={noop}>Cancelar</Button>}><Text>Corpo</Text></BottomSheet>);
    // O react-native-web só marca a janela quando a animação termina, e o jsdom não anima.
    for (const el of document.querySelectorAll("body div")) fireEvent.animationEnd(el);
    screen.getByRole("dialog", { name: "Cancelar?" });
    const r = await axe.run(document.body, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" ")}`)).toEqual([]);
  });
});

describe("mobile · comportamento", () => {
  it("Button desativado ou carregando não dispara", async () => {
    const fn = vi.fn();
    await montar(<><Button disabled onPress={fn}>A</Button><Button loading onPress={fn}>B</Button><Button onPress={fn}>C</Button></>);
    for (const n of ["A", "B", "C"]) fireEvent.click(screen.getByRole("button", { name: n }));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "B" }).getAttribute("aria-busy")).toBe("true");
  });

  it("TextField diz nome, obrigatoriedade, ajuda e erro", async () => {
    await montar(<TextField label="CPF" required hint="11 números." error="Confira o CPF." />);
    const i = screen.getByRole("textbox", { name: "CPF, obrigatório" });
    expect(i.getAttribute("aria-invalid")).toBe("true");
    const ids = i.getAttribute("aria-describedby")!.split(" ");
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(["11 números.", "Confira o CPF."]);
  });

  it("Select abre, escolhe e fecha", async () => {
    const fn = vi.fn();
    await montar(<Select label="Secretaria" options={OPC} onChange={fn} />);
    fireEvent.click(screen.getByRole("button", { name: "Secretaria, Escolha uma opção" }));
    fireEvent.click(await screen.findByRole("radio", { name: "Obras" }));
    expect(fn).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: "Educação, Matrícula" }));
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("Checkbox em parte vira marcado; Switch inverte", async () => {
    const c = vi.fn();
    const s = vi.fn();
    await montar(<><Checkbox label="Todos" checked="mixed" onChange={c} /><Switch label="Avisos" checked onChange={s} /></>);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed");
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("switch"));
    expect(c).toHaveBeenCalledWith(true);
    expect(s).toHaveBeenCalledWith(false);
  });

  it("ListItem é lido inteiro; sem onPress não é botão", async () => {
    await montar(<><ListItem title="Cartão SUS" description="2026-001043" accessory={<Badge>Novo</Badge>} accessoryLabel="em análise" onPress={noop} /><ListItem title="Versão" /></>);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    screen.getByRole("button", { name: "Cartão SUS, 2026-001043, em análise" });
  });

  it("BottomNav diz a aba atual e os novos", async () => {
    const fn = vi.fn();
    await montar(<BottomNav items={ABAS} value="i" onChange={fn} />);
    expect(screen.getByRole("tab", { name: "Início" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByRole("tab", { name: "Avisos, 3 novos" }));
    expect(fn).toHaveBeenCalledWith("a");
  });

  it("BottomSheet fecha pelo botão com nome", async () => {
    const fn = vi.fn();
    await montar(<BottomSheet open onClose={fn} title="Filtros" />);
    fireEvent.click(await screen.findByRole("button", { name: "Fechar" }));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("todo ícone desenha", async () => {
    const { container } = await montar(<>{ICONS.map((n) => <Icon key={n} name={n} />)}</>);
    expect(container.querySelectorAll("svg path")).toHaveLength(ICONS.length);
    expect(container.innerHTML).not.toMatch(/NaN|undefined/);
  });

  it("controles têm alvo de 48 ou mais", async () => {
    await montar(<><Button onPress={noop}>A</Button><IconButton icon="x" label="B" onPress={noop} /><Select label="C" options={OPC} onChange={noop} /><Checkbox label="D" checked={false} onChange={noop} /><Switch label="E" checked onChange={noop} /><ListItem title="F" onPress={noop} /><TextField label="G" /><BottomNav items={ABAS} value="i" onChange={noop} /></>);
    const els = [...document.querySelectorAll("[role=button],[role=checkbox],[role=switch],[role=tab],button,input")];
    expect(els.length).toBeGreaterThanOrEqual(9);
    for (const el of els) {
      const s = getComputedStyle(el);
      expect(Math.max(parseFloat(s.minHeight) || 0, parseFloat(s.height) || 0), el.outerHTML.slice(0, 80)).toBeGreaterThanOrEqual(48);
    }
  });
});

// ---------------------------------------------------------------- contraste

const lum = (hex: string) => {
  const [r, g, b] = hex.slice(1).match(/../g)!.map((x) => {
    const v = parseInt(x, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const razao = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const PARES: [string, keyof Colors, keyof Colors, number][] = [
  ["texto", "text", "bg", 4.5], ["apoio", "text2", "bg", 4.5], ["apoio na superfície", "text2", "surface", 4.5], ["placeholder", "text3", "bg", 4.5], ["apoio no painel", "text2", "panel", 4.5],
  ["botão", "onAccent", "action", 4.5], ["botão pressionado", "onAccent", "actionHover", 4.5], ["ghost", "action", "bg", 4.5], ["ghost pressionado", "action", "accent50", 4.5], ["opção escolhida", "text2", "accent50", 4.5],
  ["aba atual", "actionHover", "bg", 4.5], ["ícone da aba atual", "actionHover", "accent100", 3], ["contagem", "bg", "danger", 4.5],
  ["badge accent", "actionHover", "accent50", 4.5], ["badge success", "success", "successSoft", 4.5], ["badge warning", "warning", "warningSoft", 4.5], ["badge danger", "danger", "dangerSoft", 4.5],
  ["texto no alerta success", "text2", "successSoft", 4.5], ["texto no alerta warning", "text2", "warningSoft", 4.5], ["texto no alerta danger", "text2", "dangerSoft", 4.5],
  ["erro", "danger", "bg", 4.5], ["perigo pressionado", "danger", "surface", 4.5], ["borda de campo", "borderStrong", "bg", 3], ["bolinha do switch", "text2", "bg", 3], ["check", "onAccent", "action", 3], ["foco", "action", "bg", 3],
];

describe("mobile · contraste", () => {
  for (const scheme of ["light", "dark"] as const)
    for (const more of [false, true]) {
      const { colors } = createTheme(scheme, {}, more);
      for (const [uso, fg, bg, min] of PARES)
        it(`${uso} · ${scheme}${more ? " · mais contraste" : ""}`, () => {
          const r = razao(colors[fg], colors[bg]);
          expect(r, `${fg} sobre ${bg} = ${r.toFixed(2)}`).toBeGreaterThanOrEqual(min);
        });
    }

  it("um produto troca cores e raio, sem mexer nas de estado", () => {
    const light: Partial<BrandColors> = { action: "#1552e1" };
    const t = createTheme("light", { light, radius: { control: 8 } });
    expect(t.colors.action).toBe("#1552e1");
    expect(t.radius.control).toBe(8);
    expect(t.colors.danger).toBe(createTheme("light").colors.danger);
  });
});
