// Blocos: telas pequenas montadas só com componentes do Hexagon.
// Aparecem na home (como os exemplos do shadcn) e servirão de base para a página "Blocos".
import { useMemo, useState, type ReactNode } from "react";
import {
  Alert, Avatar, Badge, Button, Card, DateField, FileUpload, FilterChip, MaskedField, Menu, Pagination, Progress,
  SearchField, Stat, Stepper, Switch, Timeline, useToast,
} from "@cubo-tecnologia/hexagon";

function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`b-block ${className ?? ""}`} aria-label={title}>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- pedido do cidadão

export function BlocoPedido() {
  const toast = useToast();
  const [etapa, setEtapa] = useState(1);
  return (
    <Block title="Pedido de Cartão SUS">
      <div className="b-head">
        <p className="b-title">Pedido de Cartão SUS</p>
        <p className="b-sub">Portal do Cidadão · Secretaria de Saúde</p>
      </div>
      <Stepper steps={[{ label: "Seus dados" }, { label: "Documentos" }, { label: "Revisão" }]} current={etapa} onStepClick={setEtapa} />
      <form
        className="b-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (etapa < 3) setEtapa(etapa + 1);
          else {
            toast.show({ tone: "success", title: "Solicitação enviada", description: "Protocolo 2026-001044." });
            setEtapa(1);
          }
        }}
      >
        <MaskedField mask="cpf" label="CPF" required defaultValue="52998224725" />
        <DateField label="Data de nascimento" defaultValue="1980-09-25" />
        <div className="b-actions">
          <Button type="submit">{etapa < 3 ? "Continuar" : "Enviar solicitação"}</Button>
          {etapa > 1 && <Button variant="secondary" onClick={() => setEtapa(etapa - 1)}>Voltar</Button>}
        </div>
      </form>
    </Block>
  );
}

// ---------------------------------------------------------------- indicadores

export function BlocoIndicadores() {
  return (
    <Block title="Indicadores do mês" className="b-block--flat">
      <div className="b-stats">
        <Stat label="Solicitações concluídas" value="15.702" change={12} comparedTo="outubro" />
        <Stat label="Tempo médio de resposta" value="6,2 dias" change={-18} comparedTo="outubro" invert />
      </div>
    </Block>
  );
}

// ---------------------------------------------------------------- protocolos

const PROTOCOLOS = [
  { n: "2026-001043", s: "Cartão SUS", sec: "Saúde", st: "analise" },
  { n: "2026-001042", s: "Poda de árvore", sec: "Meio Ambiente", st: "concluido" },
  { n: "2026-001041", s: "Matrícula escolar", sec: "Educação", st: "aguardando" },
  { n: "2026-001040", s: "Iluminação pública", sec: "Infraestrutura", st: "concluido" },
  { n: "2026-001039", s: "Vacinação domiciliar", sec: "Saúde", st: "analise" },
] as const;
const ST = {
  analise: <Badge tone="accent" icon="em-analise" animated={false}>Em análise</Badge>,
  aguardando: <Badge tone="warning" icon="aguardando" animated={false}>Aguardando</Badge>,
  concluido: <Badge tone="success" icon="concluido" animated={false}>Concluído</Badge>,
};

export function BlocoProtocolos() {
  const [q, setQ] = useState("");
  const [saude, setSaude] = useState(false);
  const [page, setPage] = useState(1);
  const lista = useMemo(
    () => PROTOCOLOS.filter((p) => (!saude || p.sec === "Saúde") && (p.s.toLowerCase().includes(q.toLowerCase()) || p.n.includes(q))),
    [q, saude],
  );
  return (
    <Block title="Protocolos" className="b-block--wide">
      <div className="b-head b-head--row">
        <div>
          <p className="b-title">Protocolos</p>
          <p className="b-sub">Portal do Servidor</p>
        </div>
        <Button variant="secondary">Exportar</Button>
      </div>
      <div className="b-toolbar">
        <SearchField label="Buscar protocolo" hideLabel placeholder="Serviço ou número" value={q} onChange={setQ} resultsText={q ? `${lista.length} encontrados` : ""} />
        <FilterChip selected={saude} onChange={setSaude}>Saúde</FilterChip>
      </div>
      <ul className="b-rows">
        {lista.map((p) => (
          <li key={p.n}>
            <span className="b-mono">{p.n}</span>
            <span className="b-rows__s">{p.s}</span>
            {ST[p.st]}
            <Menu label={`Ações do protocolo ${p.n}`} items={[{ label: "Ver detalhes", onSelect: () => undefined }, { label: "Encaminhar", onSelect: () => undefined }]} />
          </li>
        ))}
        {lista.length === 0 && <li className="b-rows__empty">Nenhum protocolo encontrado.</li>}
      </ul>
      <Pagination page={page} pageCount={3} onChange={setPage} totalItems={14} pageSize={5} itemLabel="protocolos" />
    </Block>
  );
}

// ---------------------------------------------------------------- histórico

export function BlocoHistorico() {
  return (
    <Block title="Histórico do protocolo">
      <div className="b-head">
        <p className="b-title">Histórico</p>
        <p className="b-sub">Protocolo 2026-001043</p>
      </div>
      <Timeline
        label="Histórico do protocolo 2026-001043"
        events={[
          { id: "3", title: "Em análise para emissão", date: "2026-11-18T11:20:00", actor: "Secretaria de Saúde", icon: "em-analise", tone: "accent" },
          { id: "2", title: "Documentos conferidos", date: "2026-11-13T15:40:00", actor: "Ana Souza", icon: "concluido", tone: "success" },
          { id: "1", title: "Solicitação aberta", date: "2026-11-12T09:14:00", actor: "Pelo aplicativo", icon: "novo" },
        ]}
      />
    </Block>
  );
}

// ---------------------------------------------------------------- avisos

export function BlocoAvisos() {
  return (
    <Block title="Preferências de aviso">
      <div className="b-head b-head--row">
        <div className="b-user">
          <Avatar name="Maria das Graças Lima" decorative />
          <div>
            <p className="b-title">Maria das Graças</p>
            <p className="b-sub">Avisos dos seus pedidos</p>
          </div>
        </div>
      </div>
      <div className="b-switches">
        <Switch label="WhatsApp" hint="Mudanças na situação." defaultChecked />
        <Switch label="E-mail" defaultChecked />
        <Switch label="Lembrete de consulta" hint="Um dia antes." />
      </div>
    </Block>
  );
}

// ---------------------------------------------------------------- documentos

export function BlocoDocumentos() {
  return (
    <Block title="Envio de documentos">
      <div className="b-head">
        <p className="b-title">Documentos</p>
        <p className="b-sub">Etapa 2 de 3</p>
      </div>
      <Progress label="Documentos enviados" value={2} max={3} valueText="2 de 3" />
      <Alert tone="warning" title="Falta o comprovante de residência">Conta de luz, água ou telefone dos últimos 3 meses.</Alert>
      <FileUpload label="Comprovante de residência" hint="PDF ou foto, até 2 MB." accept=".pdf,image/*" maxSizeMB={2} />
    </Block>
  );
}

// ---------------------------------------------------------------- vazio

export function BlocoCartao() {
  return (
    <Block title="Cartão do serviço" className="b-block--flat">
      <Card variant="panel" className="b-card">
        <p className="b-sub">Saúde</p>
        <p className="b-title">Cartão SUS</p>
        <p className="b-card__p">Pedido com documentos anexados e cartão disponível em PDF no aplicativo.</p>
        <Button href="#" variant="secondary">Pedir agora</Button>
      </Card>
    </Block>
  );
}
