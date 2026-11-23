import { useEffect, useState } from "react";
import { Avatar, DateField, MaskedField, Menu, Progress, useToast } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

const I = {
  ver: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="2" /></svg>,
  enc: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8h10M9 4.5L12.5 8 9 11.5" /></svg>,
  pdf: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v8M5 7l3 3 3-3M3 13h10" /></svg>,
  x: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M6 6l4 4M10 6l-4 4" /></svg>,
};

function MenuDemo() {
  const toast = useToast();
  const items = [
    { label: "Ver detalhes", icon: I.ver, onSelect: () => toast.show({ title: "Abrindo o protocolo 2026-001043" }) },
    { label: "Encaminhar para outra secretaria", icon: I.enc, onSelect: () => toast.show({ title: "Encaminhamento iniciado" }) },
    { label: "Baixar comprovante", icon: I.pdf, onSelect: () => toast.show({ tone: "success", title: "Comprovante baixado" }) },
    { label: "Arquivar", disabled: true, onSelect: () => undefined },
    { label: "Cancelar protocolo", icon: I.x, danger: true, onSelect: () => toast.show({ tone: "warning", title: "Cancelamento pedido" }) },
  ];
  return (
    <div className="s-row" style={{ gap: 24 }}>
      <div className="s-row" style={{ gap: 8 }}>
        <span className="s-mono">2026-001043</span>
        <Menu label="Ações do protocolo 2026-001043" items={items} />
      </div>
      <Menu label="Exportar" buttonText="Exportar" align="start" items={[
        { label: "Planilha (CSV)", onSelect: () => toast.show({ tone: "success", title: "Planilha gerada" }) },
        { label: "PDF", onSelect: () => toast.show({ tone: "success", title: "PDF gerado" }) },
      ]} />
    </div>
  );
}

function ProgressDemo() {
  const [v, setV] = useState(1);
  useEffect(() => {
    if (v >= 5) return;
    const t = setTimeout(() => setV((x) => x + 1), 900);
    return () => clearTimeout(t);
  }, [v]);
  return (
    <div className="s-stack" style={{ width: "100%", maxWidth: 480 }}>
      <Progress label="Envio dos documentos" value={v} max={5} valueText={`${v} de 5 arquivos`} tone={v === 5 ? "success" : "action"} />
      <Progress label="Cadastro completo" value={64} />
      <Progress label="Prazo de resposta usado" value={90} tone="warning" valueText="27 de 30 dias" />
      <Progress label="Consultando a Receita Federal" />
    </div>
  );
}

export const ONDA6: Record<string, Doc> = {
  "masked-field": {
    eyebrow: "Componente",
    title: "MaskedField",
    criterios: ["1.3.5", "3.3.1", "3.3.2", "3.3.3", "4.1.2"],
    lead: "CPF, CNPJ, telefone e CEP no formato brasileiro, formatados enquanto a pessoa digita. Aceita colar com ou sem pontuação.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <p>Digite um CPF qualquer e saia do campo: os dígitos verificadores são conferidos. Um válido para testar: 529.982.247-25.</p>
          <Example
            code={`<MaskedField mask="cpf" label="CPF" required />
<MaskedField mask="telefone" label="Celular" hint="Com DDD." />
<MaskedField mask="cep" label="CEP" />
<MaskedField mask="cnpj" label="CNPJ da empresa" />`}
          >
            <div className="s-formgrid">
              <MaskedField mask="cpf" label="CPF" required />
              <MaskedField mask="telefone" label="Celular" hint="Com DDD. Fixo também serve." />
              <MaskedField mask="cep" label="CEP" />
              <MaskedField mask="cnpj" label="CNPJ da empresa" defaultValue="11222333000181" />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["mask", `"cpf" | "cnpj" | "telefone" | "cep"`, "", "O formato."],
              ["label, hint, required", "", "", "Como nos outros campos."],
              ["error", "ReactNode", "", "Erro de fora. Sem ele, o campo confere sozinho ao sair."],
              ["onChange", "(formatado, digitos) => void", "", "Recebe \"529.982.247-25\" e \"52998224725\"."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Teclado numérico no celular (<code>inputMode</code>), e preenchimento automático de telefone e CEP (<code>autocomplete</code>).</li>
            <li>O erro só aparece ao sair do campo, não a cada tecla, e diz o que fazer: "Digite o telefone com DDD".</li>
            <li>O formato esperado aparece no placeholder e o rótulo continua sempre visível.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "date-field": {
    eyebrow: "Componente",
    title: "DateField",
    criterios: ["2.1.1", "3.3.1", "3.3.2", "3.3.3", "4.1.2"],
    lead: "Data digitada: o jeito mais rápido para datas que a pessoa já sabe, como nascimento. O calendário é opcional e é o do próprio sistema.",
    body: () => (
      <>
        <DocSection title="Exemplos">
          <Example
            code={`<DateField label="Data de nascimento" required max="2026-11-19" autoComplete="bday" />
<DateField label="Data da consulta" calendar min="2026-11-19" hint="A partir de hoje." />`}
          >
            <div className="s-formgrid">
              <DateField label="Data de nascimento" required max="2026-11-19" autoComplete="bday" />
              <DateField label="Data da consulta" calendar min="2026-11-19" hint="A partir de hoje. Digite ou escolha no calendário." />
            </div>
          </Example>
          <Note>Para nascimento, não use calendário: rolar dezenas de anos é cansativo e difícil no leitor de tela. Digitar é mais rápido para todo mundo.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label, hint, required, error", "", "", "Como nos outros campos."],
              ["value / defaultValue", "string (ISO)", "", "\"1980-09-25\"."],
              ["onChange", "(iso) => void", "", "Data ISO, ou \"\" se incompleta."],
              ["min / max", "string (ISO)", "", "Limites, com mensagem de erro clara."],
              ["calendar", "boolean", "false", "Botão que abre o calendário do sistema."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>A ajuda mostra o formato com um exemplo; as barras entram sozinhas enquanto digita.</li>
            <li>Data que não existe (31/02) e fora do limite têm mensagens próprias, ditas ao sair do campo.</li>
            <li>O botão do calendário tem nome ("Abrir calendário") e o calendário é o nativo, já acessível no sistema.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  menu: {
    eyebrow: "Componente",
    title: "Menu",
    criterios: ["1.4.1", "2.1.1", "2.4.3", "2.4.7", "4.1.2"],
    lead: "Lista de ações de um item: ver, encaminhar, baixar, cancelar. Abre num botão \"⋯\" ou com texto, e funciona inteiro pelo teclado.",
    body: () => (
      <>
        <DocSection title="Experimente">
          <Example
            code={`<Menu
  label="Ações do protocolo 2026-001043"
  items={[
    { label: "Ver detalhes", icon: <IconeOlho />, onSelect: ver },
    { label: "Encaminhar para outra secretaria", onSelect: encaminhar },
    { label: "Arquivar", disabled: true, onSelect: arquivar },
    { label: "Cancelar protocolo", danger: true, onSelect: cancelar },
  ]}
/>`}
          >
            <MenuDemo />
          </Example>
        </DocSection>
        <DocSection title="Teclado">
          <div className="s-table-wrap">
            <table className="s-table">
              <thead><tr><th>Tecla</th><th>O que faz</th></tr></thead>
              <tbody>
                <tr><td><code>Enter</code> <code>Espaço</code> <code>↓</code></td><td>Abre o menu na primeira ação.</td></tr>
                <tr><td><code>↑</code> <code>↓</code></td><td>Anda entre as ações, pulando as desativadas.</td></tr>
                <tr><td><code>Home</code> <code>End</code></td><td>Primeira e última ação.</td></tr>
                <tr><td>Uma letra</td><td>Pula para a ação que começa com ela.</td></tr>
                <tr><td><code>Esc</code></td><td>Fecha e volta o foco ao botão.</td></tr>
              </tbody>
            </table>
          </div>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "string", "", "Nome do botão: diga de quê. Obrigatório."],
              ["items", "{ label, onSelect, icon?, danger?, disabled? }[]", "", "As ações."],
              ["buttonText", "string", "", "Texto visível. Sem ele, mostra \"⋯\"."],
              ["align", `"start" | "end"`, "end", "Alinhamento do menu com o botão."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Padrão de menu da WAI-ARIA: <code>aria-haspopup</code>, <code>aria-expanded</code>, <code>menu</code> e <code>menuitem</code>.</li>
            <li>O botão "⋯" diz de quem são as ações: "Ações do protocolo 2026-001043".</li>
            <li>Ação perigosa fica separada, em vermelho e com ícone; a desativada continua na lista, para a pessoa saber que existe.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  avatar: {
    eyebrow: "Componente",
    title: "Avatar",
    criterios: ["1.1.1", "1.4.3"],
    lead: "Foto ou iniciais de uma pessoa: servidor responsável, cidadão, autor de um comentário.",
    body: () => (
      <>
        <DocSection title="Exemplos">
          <Example
            code={`<Avatar name="Maria das Graças Lima" />
<Avatar name="João Pedro Alves" src="/fotos/joao.jpg" size={48} />

// Com o nome escrito ao lado, o avatar é decorativo:
<Avatar name="Ana Souza" decorative /> <span>Ana Souza</span>`}
          >
            <div className="s-row" style={{ gap: 20 }}>
              <Avatar name="Maria das Graças Lima" size={28} />
              <Avatar name="Maria das Graças Lima" />
              <Avatar name="Maria das Graças Lima" size={48} />
              <Avatar name="Foto que não carregou" src="/nao-existe.jpg" />
              <span className="s-row" style={{ gap: 10 }}>
                <Avatar name="Ana Souza" decorative />
                <span><strong style={{ fontWeight: 500 }}>Ana Souza</strong><br /><span className="s-muted" style={{ fontSize: 13 }}>Secretaria de Saúde</span></span>
              </span>
            </div>
          </Example>
          <Note>As iniciais usam o primeiro e o último nome, sem "da", "de", "dos": Maria das Graças Lima vira ML. Se a foto não carregar, as iniciais aparecem.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["name", "string", "", "Nome completo. Obrigatório."],
              ["src", "string", "", "Foto."],
              ["size", "28 | 36 | 48", "36", "Tamanho."],
              ["decorative", "boolean", "false", "Use quando o nome já aparece escrito ao lado."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Sozinho, o avatar diz o nome da pessoa ao leitor de tela; com o nome ao lado, fica em silêncio para não repetir.</li>
            <li>Iniciais com contraste acima de 4,5:1.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  progress: {
    eyebrow: "Componente",
    title: "Progress",
    criterios: ["1.3.1", "1.4.1", "2.2.2", "4.1.2"],
    lead: "Barra de andamento de um envio, de um cadastro ou de um prazo. O número aparece escrito ao lado, e o leitor de tela ouve o mesmo texto.",
    body: () => (
      <>
        <DocSection title="Exemplos">
          <Example
            code={`<Progress label="Envio dos documentos" value={3} max={5} valueText="3 de 5 arquivos" />
<Progress label="Cadastro completo" value={64} />
<Progress label="Prazo de resposta usado" value={90} tone="warning" valueText="27 de 30 dias" />
<Progress label="Consultando a Receita Federal" />`}
          >
            <ProgressDemo />
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "O que está andando. Obrigatório."],
              ["value / max", "number", "— / 100", "Sem value, é indeterminado."],
              ["valueText", "string", "porcentagem", "Texto do andamento: \"3 de 5 arquivos\"."],
              ["tone", `"action" | "success" | "warning" | "danger"`, "action", "Cor da barra."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>role="progressbar"</code> com nome e <code>aria-valuetext</code>: o leitor de tela diz "Envio dos documentos, 3 de 5 arquivos".</li>
            <li>O andamento está escrito, não só no tamanho ou na cor da barra.</li>
            <li>O indeterminado corre 3 vezes e para; o texto "Em andamento" continua dizendo que ainda não terminou.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
