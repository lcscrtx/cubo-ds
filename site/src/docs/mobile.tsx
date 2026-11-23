// Documentação do pacote React Native (@cubo-tecnologia/hexagon-native).
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Alert, Badge, BottomNav, BottomSheet, Button, Card, Checkbox, HexagonProvider, Icon, IconButton, ICONS, ListItem, ScreenHeader, Select, Switch, Text, TextField, tokens,
  type BottomNavItem,
} from "@cubo-tecnologia/hexagon-native";
import { View } from "react-native";
import { Phone } from "../mobile/Phone";
import { Code, DocSection, Example, Note, PropsTable } from "../ui";
import { MOBILE_GROUPS } from "./nav";
import type { Doc } from "./types";

type Props = [prop: string, type: string, def: string, desc: string][];
interface Peca {
  title: string;
  lead: string;
  criterios: string[];
  exemplos: { title: string; texto?: string; node: ReactNode; code: string; screen?: boolean }[];
  props: Props;
  a11y: string[];
}

const peca = (p: Peca): Doc => ({
  eyebrow: "Componente",
  title: p.title,
  lead: p.lead,
  criterios: p.criterios,
  plataforma: "mobile",
  body: () => (
    <>
      {p.exemplos.map((e) => (
        <DocSection key={e.title} title={e.title}>
          {e.texto && <p>{e.texto}</p>}
          <Example code={e.code}><Phone screen={e.screen}>{e.node}</Phone></Example>
        </DocSection>
      ))}
      <DocSection title="Props"><PropsTable rows={p.props} /></DocSection>
      <DocSection title="Acessibilidade">
        <ul className="s-list">{p.a11y.map((a) => <li key={a}>{a}</li>)}</ul>
      </DocSection>
    </>
  ),
});

const nada = () => undefined;

// ---------------------------------------------------------------- exemplos com estado

function CarregandoDemo() {
  const [enviando, setEnviando] = useState(false);
  return (
    <Button
      full
      loading={enviando}
      onPress={() => {
        setEnviando(true);
        setTimeout(() => setEnviando(false), 2000);
      }}
    >
      Enviar solicitação
    </Button>
  );
}
function CampoDemo() {
  const [cpf, setCpf] = useState("");
  return <TextField label="CPF" required hint="11 números, sem pontos." keyboardType="number-pad" inputMode="numeric" value={cpf} onChangeText={setCpf} />;
}
const SECRETARIAS = [
  { value: "saude", label: "Saúde", description: "Cartão SUS, consultas e vacinas" },
  { value: "educacao", label: "Educação", description: "Matrícula e transporte escolar" },
  { value: "infra", label: "Infraestrutura", description: "Iluminação, buracos e limpeza" },
  { value: "meio", label: "Meio Ambiente", disabled: true },
];
function SelectDemo() {
  const [v, setV] = useState<string>();
  return <Select label="Secretaria" required options={SECRETARIAS} value={v} onChange={setV} />;
}
function CheckDemo() {
  const [m, setM] = useState({ email: true, zap: false });
  const n = Object.values(m).filter(Boolean).length;
  return (
    <View>
      <Checkbox label="Todos os canais" checked={n === 2 ? true : n ? "mixed" : false} onChange={(c) => setM({ email: c, zap: c })} />
      <View style={{ paddingLeft: 36 }}>
        <Checkbox label="E-mail" checked={m.email} onChange={(email) => setM({ ...m, email })} />
        <Checkbox label="WhatsApp" checked={m.zap} onChange={(zap) => setM({ ...m, zap })} />
      </View>
    </View>
  );
}
function TermosDemo() {
  const [ok, setOk] = useState(false);
  return <Checkbox label="Li e aceito os termos" checked={ok} onChange={setOk} error={ok ? undefined : "Aceite os termos para continuar."} />;
}
function SwitchDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <View>
      <Switch label="Avisos por WhatsApp" hint="Mudanças nos seus pedidos." checked={a} onChange={setA} />
      <Switch label="Lembrete de consulta" checked={b} onChange={setB} />
      <Switch label="Avisos da Defesa Civil" hint="Sempre ligado." checked onChange={nada} disabled />
    </View>
  );
}
const ABAS: BottomNavItem[] = [
  { id: "inicio", label: "Início", icon: "inicio" },
  { id: "pedidos", label: "Pedidos", icon: "pedidos" },
  { id: "avisos", label: "Avisos", icon: "avisos", count: 3 },
  { id: "perfil", label: "Perfil", icon: "perfil" },
];
function NavDemo() {
  const [v, setV] = useState("inicio");
  return <BottomNav items={ABAS} value={v} onChange={setV} />;
}
function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}>Cancelar pedido</Button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Cancelar a solicitação?"
        description="O pedido 2026-001043 sai da fila e não dá para desfazer."
        actions={
          <>
            <Button full onPress={() => setOpen(false)}>Cancelar solicitação</Button>
            <Button full variant="secondary" onPress={() => setOpen(false)}>Voltar</Button>
          </>
        }
      />
    </>
  );
}
function TelaDemo() {
  const [v, setV] = useState("pedidos");
  return (
    <>
      <ScreenHeader title="Meus pedidos" subtitle="Maria das Graças" actions={[{ icon: "busca", label: "Buscar pedido", onPress: nada }]} />
      <View style={{ padding: 16, gap: 16, flex: 1 }}>
        <Alert tone="warning" title="Falta um documento">Envie o comprovante de residência do Cartão SUS.</Alert>
        <Card>
          <Badge tone="accent" icon="em-analise">Em análise</Badge>
          <Text variant="h3" heading={2}>Cartão SUS</Text>
          <Text variant="small" color="text2">Protocolo 2026-001043 · Secretaria de Saúde</Text>
        </Card>
        <Button full iconStart="mais" onPress={nada}>Nova solicitação</Button>
      </View>
      <BottomNav items={ABAS} value={v} onChange={setV} />
    </>
  );
}

// ---------------------------------------------------------------- páginas

export const MOBILE: Record<string, Doc> = {
  "m-introducao": {
    eyebrow: "Mobile",
    title: "Hexagon Mobile",
    lead: "O Hexagon em React Native, para iOS e Android. Os mesmos tokens, nomes e regras da web, com componentes feitos para o dedo.",
    body: () => (
      <>
        <Note>Piloto com 13 componentes, ainda fora do npm. As prévias rodam pelo react-native-web. Falta conferir em aparelho, com TalkBack e VoiceOver.</Note>
        <DocSection title="As peças juntas">
          <Phone screen tall><TelaDemo /></Phone>
        </DocSection>
        <DocSection title="O que é igual à web">
          <ul className="s-list">
            <li><strong>Tokens</strong>: cor, tema escuro, espaço, raio e sombra saem do mesmo arquivo. Mudou um, muda nos dois.</li>
            <li><strong>Nomes</strong>: <code>variant</code>, <code>tone</code>, <code>label</code>, <code>hint</code> e <code>error</code> querem dizer a mesma coisa.</li>
            <li><strong>Regras</strong>: contraste de 4,5:1, rótulo sempre visível, nada só por cor, texto de 13 ou mais.</li>
          </ul>
        </DocSection>
        <DocSection title="O que muda no celular">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Web</th><th>Mobile</th><th>Por quê</th></tr></thead>
              <tbody>
                <tr><td>Controles de 36px</td><td>Controles de 48</td><td>Mínimo do Android; passa o do iOS.</td></tr>
                <tr><td>Dialog, Drawer, Menu e Popover</td><td>BottomSheet</td><td>Ao alcance do polegar.</td></tr>
                <tr><td>Table</td><td>ListItem e Card</td><td>Não cabe na largura; a linha é lida inteira.</td></tr>
                <tr><td>Tooltip</td><td>Texto visível</td><td>No toque não existe hover.</td></tr>
                <tr><td>Tabs de navegação</td><td>BottomNav</td><td>Navegação principal embaixo.</td></tr>
                <tr><td>PageHeader</td><td>ScreenHeader</td><td>Voltar e título, com o entalhe respeitado.</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>
        <DocSection title="1. Instalar">
          <Code lang="sh" code="npx expo install @cubo-tecnologia/hexagon-native react-native-svg react-native-safe-area-context" />
        </DocSection>
        <DocSection title="2. Pôr o tema na raiz">
          <p>Diferente da web, aqui o provider é necessário: o React Native não tem variáveis CSS.</p>
          <Code code={`import { HexagonProvider } from "@cubo-tecnologia/hexagon-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

function Raiz({ children }) {
  const insets = useSafeAreaInsets();
  return <HexagonProvider insets={insets}>{children}</HexagonProvider>;
}

export default function Layout({ children }) {
  return (
    <SafeAreaProvider>
      <Raiz>{children}</Raiz>
    </SafeAreaProvider>
  );
}`} />
        </DocSection>
        <DocSection title="3. Carregar a IBM Plex Sans">
          <p>Sem isto, os componentes usam a fonte do sistema.</p>
          <Code code={`import { useFonts } from "expo-font";
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from "@expo-google-fonts/ibm-plex-sans";
import { HexagonProvider, plexFonts } from "@cubo-tecnologia/hexagon-native";

const tema = { fonts: plexFonts };

const [ok] = useFonts({ IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold });
if (!ok) return null;

<HexagonProvider overrides={tema}>…</HexagonProvider>`} />
        </DocSection>
        <DocSection title="4. Adaptar a outro produto">
          <p>Passe as cores e os raios do produto. As cores de estado não mudam: o significado é o mesmo em todo lugar.</p>
          <Code code={`const tema = {
  light: { action: "#1552e1", actionHover: "#0f41b8", accent50: "#f2f5fd" },
  dark: { action: "#7ea2f6", actionHover: "#a9c0fa", accent50: "#161f36" },
  radius: { control: 8 },
};

<HexagonProvider overrides={tema}>…</HexagonProvider>`} />
        </DocSection>
        <DocSection title="Componentes">
          <ul className="s-list">
            {MOBILE_GROUPS.slice(1).map((g) => (
              <li key={g.title}><strong>{g.title}</strong>: {g.items.map((i, n) => <span key={i.slug}>{n > 0 && ", "}<Link to={i.to}>{i.title}</Link></span>)}.</li>
            ))}
          </ul>
        </DocSection>
      </>
    ),
  },

  "m-fundacao": {
    eyebrow: "Mobile",
    title: "Fundação mobile",
    lead: "Cor, espaço, raio e sombra são os da web. Aqui está o que é próprio do celular: escala de texto, toque e ícones.",
    body: () => (
      <>
        <DocSection title="Escala de texto">
          <p>Tamanhos fixos, em pontos. A pessoa amplia pela fonte do sistema, e os componentes crescem junto.</p>
          <Phone>
            {(Object.keys(tokens.type) as (keyof typeof tokens.type)[]).map((k) => (
              <View key={k}>
                <Text variant="caption" color="text2">{`${k} · ${tokens.type[k].size}/${tokens.type[k].line}`}</Text>
                <Text variant={k}>Serviços na palma da mão</Text>
              </View>
            ))}
          </Phone>
        </DocSection>
        <DocSection title="Toque e margem">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead>
              <tbody>
                <tr><td><code>touch</code></td><td><code>{tokens.touch}</code></td><td>Altura de botões e campos e alvo mínimo de toque.</td></tr>
                <tr><td><code>gutter</code></td><td><code>{tokens.gutter}</code></td><td>Margem lateral da tela.</td></tr>
              </tbody>
            </table>
          </div>
          <p>Os valores vêm de <code>useTheme()</code>. Cores, espaços e raios estão em <Link to="/docs/fundacao">Fundação</Link>.</p>
        </DocSection>
        <DocSection title="Ícones">
          <div className="m-icons">
            {ICONS.map((n) => <div key={n}><HexIcon name={n} />{n}</div>)}
          </div>
        </DocSection>
      </>
    ),
  },

  "m-button": peca({
    title: "Button",
    lead: "Dispara uma ação. 48 de altura e rótulo de 16. Com fonte grande, o rótulo quebra linha em vez de cortar.",
    criterios: ["1.4.3", "1.4.4", "1.4.11", "2.4.7", "2.5.5", "4.1.2", "4.1.3"],
    exemplos: [
      { title: "Variantes", node: <><Button onPress={nada}>Salvar</Button><Button variant="secondary" onPress={nada}>Cancelar</Button><Button variant="ghost" onPress={nada}>Ver detalhes</Button></>, code: `<Button onPress={salvar}>Salvar</Button>
<Button variant="secondary" onPress={voltar}>Cancelar</Button>
<Button variant="ghost" onPress={abrir}>Ver detalhes</Button>` },
      { title: "Largura toda e ícones", node: <><Button full iconStart="mais" onPress={nada}>Nova solicitação</Button><Button full variant="secondary" iconEnd="seta-direita" onPress={nada}>Continuar</Button></>, code: `<Button full iconStart="mais" onPress={criar}>Nova solicitação</Button>
<Button full variant="secondary" iconEnd="seta-direita" onPress={seguir}>Continuar</Button>` },
      { title: "Carregando e desativado", texto: "Toque para ver o estado de envio.", node: <><CarregandoDemo /><Button full disabled onPress={nada}>Enviar</Button></>, code: `<Button full loading={enviando} onPress={enviar}>Enviar solicitação</Button>
<Button full disabled onPress={enviar}>Enviar</Button>` },
    ],
    props: [["children", "string", "", "Rótulo. Obrigatório."], ["onPress", "() => void", "", "Ação."], ["variant", `"primary" | "secondary" | "ghost"`, "primary", "Peso visual."], ["iconStart / iconEnd", "IconName", "", "Ícone antes ou depois."], ["loading", "boolean", "false", "Enviando: impede outro toque."], ["disabled", "boolean", "false", "Desativado."], ["full", "boolean", "false", "Ocupa a largura toda."], ["accessibilityHint", "string", "", "O que acontece ao tocar."]],
    a11y: ["Altura de 48: atende o mínimo do Android, do iOS e da WCAG 2.5.5.", "Carregando, o leitor de tela diz que está ocupado, e o rótulo continua o mesmo.", "Anel de foco de 2 para teclado físico e controle por botão."],
  }),

  "m-icon-button": peca({
    title: "IconButton",
    lead: "Botão só de ícone, 48 por 48, sempre com nome. Para ações conhecidas: voltar, fechar, buscar.",
    criterios: ["1.1.1", "1.4.11", "2.4.7", "2.5.5", "4.1.2"],
    exemplos: [{ title: "Exemplo", node: <View style={{ flexDirection: "row" }}><IconButton icon="busca" label="Buscar" onPress={nada} /><IconButton icon="avisos" label="Avisos, 3 novos" dot onPress={nada} /><IconButton icon="x" label="Fechar" onPress={nada} /><IconButton icon="reticencias" label="Mais ações, desativado" disabled onPress={nada} /></View>, code: `<IconButton icon="busca" label="Buscar" onPress={buscar} />
<IconButton icon="avisos" label="Avisos, 3 novos" dot onPress={abrir} />` }],
    props: [["icon", "IconName", "", "O ícone."], ["label", "string", "", "Nome para o leitor de tela. Obrigatório."], ["onPress", "() => void", "", "Ação."], ["dot", "boolean", "false", "Ponto de novidade. Diga o número no label."], ["disabled", "boolean", "false", "Desativado."]],
    a11y: ["Não existe sem label: nenhum botão fica mudo.", "No celular não há dica ao passar o mouse. Se o ícone não for óbvio, use Button com texto."],
  }),

  "m-text-field": peca({
    title: "TextField",
    lead: "Campo de texto com rótulo, ajuda e erro. Letra de 16, que evita o zoom automático do iOS.",
    criterios: ["1.3.1", "1.3.5", "1.4.3", "1.4.11", "2.4.7", "3.3.1", "3.3.2", "4.1.2", "4.1.3"],
    exemplos: [
      { title: "Estados", node: <><CampoDemo /><TextField label="Nome completo" defaultValue="Maria" error="Escreva o nome completo." /><TextField label="Protocolo" value="2026-001043" disabled /></>, code: `<TextField label="CPF" required hint="11 números, sem pontos." keyboardType="number-pad" value={cpf} onChangeText={setCpf} />
<TextField label="Nome completo" error="Escreva o nome completo." />
<TextField label="Protocolo" value="2026-001043" disabled />` },
      { title: "Texto longo", node: <TextField label="Descreva o problema" hint="Diga o endereço e o que está acontecendo." multiline />, code: `<TextField label="Descreva o problema" hint="Diga o endereço e o que está acontecendo." multiline />` },
    ],
    props: [["label", "string", "", "Rótulo visível. Obrigatório."], ["hint", "string", "", "Ajuda antes do campo."], ["error", "string", "", "O que fazer para corrigir."], ["required", "boolean", "false", "Escreve “(obrigatório)”."], ["disabled", "boolean", "false", "Desativado."], ["...rest", "TextInputProps", "", "keyboardType, autoComplete, multiline, secureTextEntry…"]],
    a11y: ["O leitor de tela diz o rótulo, se é obrigatório, a ajuda e o erro.", "O erro é falado quando aparece: região viva no Android, anúncio no iOS.", "No foco a borda passa de 1 para 2, além de mudar de cor."],
  }),

  "m-select": peca({
    title: "Select",
    lead: "Escolha de uma opção. Abre uma folha embaixo, com linhas grandes para o dedo.",
    criterios: ["1.3.1", "1.4.1", "1.4.3", "2.4.7", "2.5.5", "3.3.1", "3.3.2", "4.1.2"],
    exemplos: [{ title: "Exemplo", node: <><SelectDemo /><Select label="Bairro" options={[]} onChange={nada} error="Escolha o bairro." /></>, code: `<Select
  label="Secretaria"
  required
  value={secretaria}
  onChange={setSecretaria}
  options={[{ value: "saude", label: "Saúde", description: "Cartão SUS, consultas e vacinas" }]}
/>` }],
    props: [["label", "string", "", "Rótulo. Obrigatório."], ["options", "{ value, label, description?, disabled? }[]", "", "As opções."], ["value / onChange", "string / (value) => void", "", "Opção escolhida."], ["placeholder", "string", "Escolha uma opção", "Sem escolha."], ["hint, error, required, disabled", "", "", "Como no TextField."]],
    a11y: ["O botão diz o rótulo e a opção atual: “Secretaria, obrigatório, Saúde”.", "As opções são um grupo de rádio: o leitor diz qual está marcada e quantas há.", "A escolhida tem check e letra forte, não só fundo."],
  }),

  "m-checkbox": peca({
    title: "Checkbox",
    lead: "Marca ou desmarca uma opção independente. A linha inteira recebe o toque.",
    criterios: ["1.3.1", "1.4.1", "1.4.11", "2.4.7", "2.5.5", "3.3.1", "4.1.2"],
    exemplos: [
      { title: "Selecionar todos", node: <CheckDemo />, code: `<Checkbox label="Todos os canais" checked={todos ? true : algum ? "mixed" : false} onChange={marcarTodos} />
<Checkbox label="E-mail" checked={email} onChange={setEmail} />` },
      { title: "Com erro", node: <TermosDemo />, code: `<Checkbox label="Li e aceito os termos" checked={ok} onChange={setOk} error="Aceite os termos para continuar." />` },
    ],
    props: [["label", "string", "", "Texto ao lado. Obrigatório."], ["checked", `boolean | "mixed"`, "", "Marcado, desmarcado ou em parte."], ["onChange", "(checked) => void", "", "Chamado ao tocar."], ["hint, error, disabled", "", "", "Como nos campos."]],
    a11y: ["Papel checkbox, com marcado, não marcado ou misto.", "Linha de 48 e caixa de 24 com borda acima de 3:1.", "Marcado muda o preenchimento e mostra o check."],
  }),

  "m-switch": peca({
    title: "Switch",
    lead: "Liga e desliga uma configuração que vale na hora. O estado aparece escrito.",
    criterios: ["1.4.1", "1.4.11", "2.4.7", "2.5.5", "4.1.2"],
    exemplos: [{ title: "Exemplo", node: <SwitchDemo />, code: `<Switch label="Avisos por WhatsApp" hint="Mudanças nos seus pedidos." checked={zap} onChange={setZap} />` }],
    props: [["label", "string", "", "O que liga. Obrigatório."], ["checked", "boolean", "", "Estado."], ["onChange", "(checked) => void", "", "Chamado ao trocar."], ["hint", "string", "", "Explicação."], ["onText / offText", "string", "Ligado / Desligado", "Textos do estado."], ["disabled", "boolean", "false", "Desativado."]],
    a11y: ["Papel switch: o leitor diz ligado ou desligado.", "Quatro pistas: texto, posição, check e cor.", "Com fonte grande, o controle desce para a linha de baixo."],
  }),

  "m-card": peca({
    title: "Card",
    lead: "Superfície que agrupa um assunto. Tocável por inteiro, quando leva a um lugar só.",
    criterios: ["1.3.1", "1.4.11", "2.4.7", "4.1.2"],
    exemplos: [
      { title: "Variantes", node: <><Card><Text weight="semibold">default</Text><Text variant="small" color="text2">Borda leve.</Text></Card><Card variant="panel"><Text weight="semibold">panel</Text><Text variant="small" color="text2">Fundo de painel.</Text></Card><Card variant="elevated"><Text weight="semibold">elevated</Text><Text variant="small" color="text2">Sombra.</Text></Card></>, code: `<Card>…</Card>
<Card variant="panel">…</Card>
<Card variant="elevated">…</Card>` },
      { title: "Tocável", node: <Card onPress={nada} label="Em análise, Cartão SUS"><Badge tone="accent" icon="em-analise">Em análise</Badge><Text variant="h3">Cartão SUS</Text></Card>, code: `<Card onPress={abrir} label="Em análise, Cartão SUS">…</Card>` },
    ],
    props: [["variant", `"default" | "panel" | "elevated"`, "default", "Tipo de superfície."], ["onPress", "() => void", "", "Torna o cartão tocável."], ["label", "string", "", "Nome, quando tocável."], ["children", "ReactNode", "", "Conteúdo."]],
    a11y: ["Tocável, vira um botão só: não ponha outro botão dentro.", "O label resume o cartão; o leitor não precisa passar por cada texto."],
  }),

  "m-list-item": peca({
    title: "ListItem",
    lead: "Linha de lista. No celular, toma o lugar da tabela. É lida inteira de uma vez.",
    criterios: ["1.3.1", "1.4.1", "2.4.7", "2.5.5", "4.1.2"],
    exemplos: [{
      title: "Exemplo", screen: true,
      node: <View><ListItem icon="arquivo" title="Cartão SUS" description="Protocolo 2026-001043" accessory={<Badge tone="accent" icon="em-analise">Em análise</Badge>} accessoryLabel="em análise" onPress={nada} /><ListItem icon="calendario" title="Consulta" description="Posto do Centro" value="25 nov" onPress={nada} /><ListItem title="Versão" value="0.1.0" /><ListItem icon="x" title="Sair da conta" danger last onPress={nada} /></View>,
      code: `<ListItem
  icon="arquivo"
  title="Cartão SUS"
  description="Protocolo 2026-001043"
  accessory={<Badge tone="accent" icon="em-analise">Em análise</Badge>}
  accessoryLabel="em análise"
  onPress={abrir}
/>
<ListItem icon="x" title="Sair da conta" danger last onPress={sair} />`,
    }],
    props: [["title", "string", "", "Título. Obrigatório."], ["description", "string", "", "Apoio."], ["icon", "IconName", "", "Ícone à esquerda."], ["value", "string", "", "Texto curto à direita."], ["accessory / accessoryLabel", "ReactNode / string", "", "Peça à direita e o que ela diz."], ["onPress", "() => void", "", "Torna a linha tocável."], ["danger", "boolean", "false", "Ação perigosa."], ["last", "boolean", "false", "Sem linha embaixo."]],
    a11y: ["Um toque, uma leitura: “Cartão SUS, Protocolo 2026-001043, em análise”.", "Altura mínima de 56.", "Sem onPress, não é botão."],
  }),

  "m-alert": peca({
    title: "Alert",
    lead: "Aviso na tela. O tipo está no ícone e na leitura, não só na cor.",
    criterios: ["1.1.1", "1.4.1", "1.4.3", "4.1.3"],
    exemplos: [{ title: "Tons", node: <><Alert title="O atendimento muda na sexta">A Secretaria de Saúde atende até 12h.</Alert><Alert tone="success" title="Solicitação enviada">Protocolo 2026-001043.</Alert><Alert tone="warning" title="Falta um documento" actions={<Button variant="secondary" onPress={nada}>Enviar</Button>}>Comprovante de residência.</Alert><Alert tone="danger" title="Não foi possível enviar">Confira a internet e tente de novo.</Alert></>, code: `<Alert tone="success" title="Solicitação enviada">Protocolo 2026-001043.</Alert>
<Alert tone="warning" title="Falta um documento" actions={<Button variant="secondary" onPress={enviar}>Enviar</Button>}>
  Comprovante de residência.
</Alert>
{erro && <Alert tone="danger" live title="Não foi possível enviar">Tente de novo.</Alert>}` }],
    props: [["tone", `"info" | "success" | "warning" | "danger"`, "info", "Tipo."], ["title", "string", "", "Frase curta. Obrigatória."], ["children", "string", "", "Apoio."], ["actions", "ReactNode", "", "Botões."], ["live", "boolean", "false", "Fala ao aparecer."]],
    a11y: ["O leitor diz o tipo antes: “Atenção. Falta um documento.”", "Com live, o erro interrompe a leitura; os outros esperam."],
  }),

  "m-badge": peca({
    title: "Badge",
    lead: "Etiqueta curta de situação. O texto diz o status; cor e ícone só reforçam.",
    criterios: ["1.4.1", "1.4.3"],
    exemplos: [{ title: "Tons", node: <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}><Badge>Rascunho</Badge><Badge tone="accent" icon="em-analise">Em análise</Badge><Badge tone="success" icon="concluido">Concluído</Badge><Badge tone="warning" icon="aguardando">Aguardando</Badge><Badge tone="danger" icon="indeferido">Indeferido</Badge></View>, code: `<Badge>Rascunho</Badge>
<Badge tone="accent" icon="em-analise">Em análise</Badge>
<Badge tone="success" icon="concluido">Concluído</Badge>` }],
    props: [["children", "string", "", "Texto do status."], ["tone", `"neutral" | "accent" | "success" | "warning" | "danger"`, "neutral", "Cor."], ["icon", "IconName", "", "Ícone antes do texto."]],
    a11y: ["Todo tom passa de 4,5:1, nos dois temas.", "O ícone é decorativo."],
  }),

  "m-screen-header": peca({
    title: "ScreenHeader",
    lead: "Cabeçalho da tela, com o único título de nível 1. Respeita o entalhe do aparelho.",
    criterios: ["1.3.1", "2.4.6", "2.5.5", "4.1.2"],
    exemplos: [{ title: "Exemplo", screen: true, node: <View style={{ gap: 24 }}><ScreenHeader title="Meus pedidos" actions={[{ icon: "busca", label: "Buscar pedido", onPress: nada }, { icon: "avisos", label: "Avisos, 3 novos", dot: true, onPress: nada }]} /><ScreenHeader title="Cartão SUS" subtitle="2026-001043" onBack={nada} backLabel="Voltar para Pedidos" /></View>, code: `<ScreenHeader
  title="Cartão SUS"
  subtitle="2026-001043"
  onBack={voltar}
  backLabel="Voltar para Pedidos"
  actions={[{ icon: "busca", label: "Buscar pedido", onPress: buscar }]}
/>` }],
    props: [["title", "string", "", "Título da tela. Obrigatório."], ["subtitle", "string", "", "Apoio."], ["onBack", "() => void", "", "Mostra o botão voltar."], ["backLabel", "string", "Voltar", "Diga para onde."], ["actions", "{ icon, label, onPress, dot? }[]", "", "Até duas."]],
    a11y: ["Um título de nível 1 por tela: quem navega por títulos acha a tela na hora.", "O voltar diz para onde vai."],
  }),

  "m-bottom-nav": peca({
    title: "BottomNav",
    lead: "Navegação principal, ao alcance do polegar. De 3 a 5 destinos, sempre com rótulo.",
    criterios: ["1.3.1", "1.4.1", "1.4.11", "2.4.8", "2.5.5", "4.1.2"],
    exemplos: [{ title: "Experimente", node: <View style={{ marginHorizontal: -16, marginBottom: -28 }}><NavDemo /></View>, code: `<BottomNav
  value={aba}
  onChange={setAba}
  items={[
    { id: "inicio", label: "Início", icon: "inicio" },
    { id: "avisos", label: "Avisos", icon: "avisos", count: 3 },
  ]}
/>` }],
    props: [["items", "{ id, label, icon, count? }[]", "", "De 3 a 5 destinos."], ["value / onChange", "string / (id) => void", "", "Destino atual."], ["label", "string", "Navegação principal", "Nome da barra."]],
    a11y: ["Cada destino é uma aba; o leitor diz qual está selecionada e quantas são.", "O atual tem pílula e letra forte, não só cor.", "A contagem entra no nome: “Avisos, 3 novos”."],
  }),

  "m-bottom-sheet": peca({
    title: "BottomSheet",
    lead: "Folha que sobe de baixo. Toma o lugar do Dialog, do Drawer, do Menu e do Popover da web.",
    criterios: ["1.3.1", "2.1.2", "2.3.3", "2.4.3", "2.5.5", "2.5.7", "4.1.2"],
    exemplos: [{ title: "Experimente", texto: "Aqui a folha abre na janela toda; no aparelho, sobe do pé da tela.", node: <SheetDemo />, code: `<BottomSheet
  open={open}
  onClose={fechar}
  title="Cancelar a solicitação?"
  description="O pedido sai da fila e não dá para desfazer."
  actions={
    <>
      <Button full onPress={cancelar}>Cancelar solicitação</Button>
      <Button full variant="secondary" onPress={fechar}>Voltar</Button>
    </>
  }
/>` }],
    props: [["open / onClose", "boolean / () => void", "", "Aberta e fechar."], ["title", "string", "", "Nome da folha. Obrigatório."], ["description", "string", "", "Apoio."], ["children", "ReactNode", "", "Conteúdo, com rolagem."], ["actions", "ReactNode", "", "Botões presos embaixo."], ["closeLabel", "string", "Fechar", "Nome do botão de fechar."]],
    a11y: ["O resto da tela sai da leitura enquanto a folha está aberta.", "Fecha pelo botão, pelo toque fora e pelo gesto de voltar do Android: nunca depende de arrastar (WCAG 2.5.7).", "Com menos movimento no sistema, aparece sem animação."],
  }),
};

function HexIcon({ name }: { name: (typeof ICONS)[number] }) {
  const escuro = document.documentElement.dataset.theme === "dark";
  return <HexagonProvider scheme={escuro ? "dark" : "light"}><Icon name={name} size={24} color="text" /></HexagonProvider>;
}
