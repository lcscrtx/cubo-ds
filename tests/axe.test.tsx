// Renderiza cada componente e passa o axe-core por cima.
// Contraste fica de fora daqui (o jsdom não calcula cor final); ele é conferido em contrast.test.ts.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";
import {
  AccessibilityBar, Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Combobox,
  DateField, DescriptionList, Dialog, Drawer, EmptyState, Eyebrow, FileUpload, FilterChip, Heading, IconButton, Link,
  LoadingRegion, MaskedField, Menu, PageHeader, Pagination, Popover, Progress, RadioGroup, SearchField, Select, Skeleton,
  Stat, StatusIcon, Stepper, Switch, Table, Tabs, Tag, Textarea, TextField, Timeline, ToastProvider, Tooltip,
} from "../src/index";

afterEach(cleanup);

async function check(ui: ReactElement) {
  const { container } = render(<div className="hx-root"><main>{ui}</main></div>);
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
  const msgs = result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
  expect(msgs).toEqual([]);
}

const ICON = <svg viewBox="0 0 16 16"><path d="M2 8h12" /></svg>;
const noop = () => undefined;

const CASOS: [string, ReactElement][] = [
  ["Button", <><Button>Salvar</Button><Button variant="secondary" iconStart={ICON}>Anexar</Button><Button variant="ghost" disabled>Ver</Button><Button href="/x">Link</Button></>],
  ["Badge", <><Badge tone="success" icon="concluido">Concluído</Badge><Badge dot>Rascunho</Badge><Badge>Saúde</Badge></>],
  ["StatusIcon", <p>Status <StatusIcon name="em-analise" /></p>],
  ["Card", <Card variant="panel"><p>Conteúdo</p></Card>],
  ["Heading", <><Eyebrow>Saúde</Eyebrow><Heading level={1}>Título</Heading><Heading level={2}>Seção</Heading></>],
  ["TextField", <><TextField label="Nome" required hint="Como no documento." /><TextField label="E-mail" error="Confira o e-mail." /></>],
  ["Textarea", <Textarea label="Descrição" maxLength={100} hint="Diga o endereço." />],
  ["Select", <Select label="Secretaria" placeholder="Escolha" options={[{ value: "a", label: "Saúde" }]} required />],
  ["Checkbox", <><Checkbox label="Aceito os termos" /><Checkbox label="Todos" indeterminate error="Marque para continuar." /></>],
  ["RadioGroup", <RadioGroup legend="Como prefere?" required options={[{ value: "a", label: "Presencial", hint: "Na sede." }, { value: "b", label: "Vídeo" }]} />],
  ["Alert", <><Alert tone="warning" title="Falta um documento">Envie o comprovante.</Alert><Alert tone="danger" live title="Erro">Tente de novo.</Alert></>],
  ["Link", <p>Veja a <Link href="/carta">Carta de Serviços</Link> e o <Link href="https://www.gov.br" external>gov.br</Link>. <Link href="/p" standalone>Ver todos</Link></p>],
  ["Breadcrumb", <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Saúde", href: "/saude" }, { label: "Cartão SUS" }]} />],
  ["Tabs", <Tabs label="Situação" items={[{ id: "a", label: "Abertos", count: 3, content: <p>A</p> }, { id: "b", label: "Concluídos", content: <p>B</p> }]} />],
  ["Dialog", <Dialog open onClose={noop} title="Cancelar?" description="Não dá para desfazer." actions={<Button>Cancelar</Button>}><p>Texto</p></Dialog>],
  ["Table", <Table caption="Protocolos" rowKey={(r: { n: string }) => r.n} rows={[{ n: "1", s: "Cartão SUS" }]} columns={[{ key: "n", header: "Protocolo", rowHeader: true, sortValue: (r) => r.n }, { key: "s", header: "Serviço" }]} />],
  ["Toast", <ToastProvider><p>Página</p></ToastProvider>],
  ["Skeleton", <LoadingRegion loading label="Carregando protocolos" fallback={<><Skeleton lines={3} /><Skeleton circle width={40} height={40} /></>}><p>ok</p></LoadingRegion>],
  ["EmptyState", <EmptyState kind="busca" title="Nada encontrado" description="Tente outra palavra." actions={<Button>Limpar</Button>} />],
  ["Pagination", <Pagination page={3} pageCount={10} onChange={noop} totalItems={100} pageSize={10} itemLabel="protocolos" />],
  ["SearchField", <><SearchField label="Buscar protocolo" defaultValue="escolar" resultsText="2 encontrados" /><SearchField label="Buscar" hideLabel submitButton /></>],
  ["Accordion", <Accordion items={[{ id: "a", title: "Prazo?", content: <p>5 dias.</p>, defaultOpen: true }, { id: "b", title: "Documentos?", content: <p>RG.</p> }]} />],
  ["Stepper", <Stepper current={2} steps={[{ label: "Dados" }, { label: "Endereço" }, { label: "Revisão" }]} onStepClick={noop} />],
  ["FileUpload", <FileUpload label="Comprovante" required hint="PDF até 2 MB." accept=".pdf" maxSizeMB={2} multiple />],
  ["Switch", <><Switch label="Avisos por WhatsApp" hint="Mudanças do pedido." defaultChecked /><Switch label="Libras" disabled /></>],
  ["IconButton e Tooltip", <><IconButton label="Imprimir" icon={ICON} /><Tooltip content="Número do comprovante."><button type="button">O que é?</button></Tooltip></>],
  ["MaskedField", <><MaskedField mask="cpf" label="CPF" required /><MaskedField mask="telefone" label="Celular" /><MaskedField mask="cep" label="CEP" /></>],
  ["DateField", <><DateField label="Nascimento" required /><DateField label="Consulta" calendar /></>],
  ["Menu", <><Menu label="Ações do protocolo" items={[{ label: "Ver", onSelect: noop }, { label: "Cancelar", danger: true, onSelect: noop }]} /><Menu label="Exportar" buttonText="Exportar" items={[{ label: "PDF", onSelect: noop }]} /></>],
  ["Avatar", <><Avatar name="Maria das Graças Lima" /><p><Avatar name="Ana Souza" decorative /> Ana Souza</p></>],
  ["Progress", <><Progress label="Envio" value={3} max={5} valueText="3 de 5" /><Progress label="Consultando" /></>],
  ["PageHeader", <PageHeader title="Protocolos" description="Todos os pedidos." breadcrumb={<Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Protocolos" }]} />} actions={<Button>Novo</Button>} />],
  ["DescriptionList", <DescriptionList items={[{ term: "CPF", detail: "529.982.247-25" }, { term: "E-mail" }]} />],
  ["Timeline", <Timeline label="Histórico" events={[{ id: "1", title: "Aberto", date: "2026-11-12T09:14:00", icon: "novo" }, { id: "2", title: "Concluído", date: "2026-11-13T09:14:00" }]} />],
  ["Combobox", <Combobox label="Serviço" required options={[{ value: "a", label: "Cartão SUS", description: "Saúde" }, { value: "b", label: "Poda" }]} />],
  ["Drawer", <Drawer open onClose={noop} title="Protocolo" description="Cartão SUS" actions={<Button>Fechar</Button>}><p>Dados</p></Drawer>],
  ["Popover", <Popover trigger="Colunas" title="Mostrar colunas"><Checkbox label="Protocolo" /></Popover>],
  ["Tag e FilterChip", <><FilterChip selected onChange={noop} count={3}>Saúde</FilterChip><Tag onRemove={noop}>Saúde</Tag><Tag>Sem remover</Tag></>],
  ["Stat", <Stat label="Concluídas" value="188.402" change={12} comparedTo="2024" help="Em 2025" />],
  ["AccessibilityBar", <AccessibilityBar prefs={{ contrast: false, reduceMotion: false, text: 0, theme: "light" }} onChange={noop} policyHref="/a" />],
];

describe("axe em todos os componentes", () => {
  for (const [nome, ui] of CASOS) {
    it(`${nome}: sem violações`, async () => {
      await check(ui);
    });
  }
});
