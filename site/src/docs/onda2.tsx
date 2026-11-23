import { useState } from "react";
import { Alert, Button, Checkbox, RadioGroup, Select, Textarea } from "@cubo-tecnologia/hexagon";
import { DocSection, Example, Matrix, Note, PropsTable } from "../ui";
import type { Doc } from "./types";

const SECRETARIAS = [
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "meio-ambiente", label: "Meio Ambiente" },
  { value: "assistencia", label: "Assistência Social" },
];

/** "Selecionar todos" com estado em parte, para mostrar o indeterminado funcionando. */
function TodosOsAvisos() {
  const [marcados, setMarcados] = useState({ email: true, whatsapp: false, sms: false });
  const total = Object.values(marcados).filter(Boolean).length;
  const set = (k: keyof typeof marcados) => (e: React.ChangeEvent<HTMLInputElement>) => setMarcados({ ...marcados, [k]: e.target.checked });
  return (
    <div className="s-stack" style={{ gap: 0 }}>
      <Checkbox
        label="Receber avisos por todos os canais"
        checked={total === 3}
        indeterminate={total > 0 && total < 3}
        onChange={(e) => setMarcados({ email: e.target.checked, whatsapp: e.target.checked, sms: e.target.checked })}
      />
      <div style={{ paddingLeft: 30 }}>
        <Checkbox label="E-mail" checked={marcados.email} onChange={set("email")} />
        <Checkbox label="WhatsApp" checked={marcados.whatsapp} onChange={set("whatsapp")} />
        <Checkbox label="SMS" checked={marcados.sms} onChange={set("sms")} />
      </div>
    </div>
  );
}

/** Erro que aparece depois do envio, para ouvir o aviso no leitor de tela. */
function EnvioComErro() {
  const [enviado, setEnviado] = useState(false);
  return (
    <div className="s-stack">
      <div className="s-row">
        <Button onClick={() => setEnviado(true)}>Enviar solicitação</Button>
        {enviado && <Button variant="ghost" onClick={() => setEnviado(false)}>Limpar</Button>}
      </div>
      {enviado && (
        <Alert tone="danger" live title="Não foi possível enviar a solicitação.">
          O CPF informado não está no cadastro da prefeitura. Confira os números e tente de novo.
        </Alert>
      )}
    </div>
  );
}

export const ONDA2: Record<string, Doc> = {
  textarea: {
    eyebrow: "Componente",
    title: "Textarea",
    criterios: ["1.3.1", "1.4.3", "1.4.11", "2.4.7", "3.3.1", "3.3.2", "4.1.2", "4.1.3"],
    lead: "Campo para texto longo: descrição de um pedido, justificativa, observação. Com limite, mostra quantos caracteres faltam.",
    body: () => (
      <>
        <DocSection title="Estados">
          <Example
            code={`<Textarea
  label="Descreva o problema"
  required
  hint="Diga o endereço e o que está acontecendo."
  maxLength={300}
/>
<Textarea label="Observações" error="Escreva pelo menos 10 caracteres." defaultValue="Urgente" />`}
          >
            <div className="s-formgrid">
              <Textarea label="Descreva o problema" required hint="Diga o endereço e o que está acontecendo." maxLength={300} />
              <Textarea label="Observações" error="Escreva pelo menos 10 caracteres." defaultValue="Urgente" />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Contador de caracteres">
          <p>
            O contador mostra "120 de 300 caracteres" o tempo todo, mas só é falado pelo leitor de tela quando faltam 20 ou menos.
            Assim a pessoa é avisada perto do limite sem ser interrompida a cada tecla.
          </p>
          <Example code={`<Textarea label="Resumo" maxLength={80} defaultValue="Buraco na Rua das Flores, em frente ao número 120, há duas semanas." />`}>
            <div style={{ width: "100%", maxWidth: 420 }}>
              <Textarea label="Resumo" maxLength={80} defaultValue="Buraco na Rua das Flores, em frente ao número 120, há duas semanas." />
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Rótulo visível. Obrigatório."],
              ["hint", "ReactNode", "", "Ajuda antes do campo."],
              ["error", "ReactNode", "", "Mensagem de erro, anunciada ao aparecer."],
              ["maxLength", "number", "", "Limite de caracteres; liga o contador."],
              ["rows", "number", "4", "Altura inicial em linhas. A pessoa pode aumentar."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Rótulo, ajuda, erro e contador ligados ao campo por <code>aria-describedby</code>.</li>
            <li>O campo pode ser esticado na vertical: quem usa fonte grande não fica preso a uma caixa pequena.</li>
            <li>O contador muda de cor e de texto ("Restam 12") perto do limite, não só de cor.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  select: {
    eyebrow: "Componente",
    title: "Select",
    criterios: ["1.3.1", "1.4.3", "1.4.11", "2.1.1", "2.4.7", "3.3.1", "3.3.2", "4.1.2"],
    lead: "Escolha de uma opção numa lista. Usa o seletor nativo do navegador, que é o mais acessível em leitor de tela, teclado e celular.",
    body: () => (
      <>
        <DocSection title="Estados">
          <Example
            code={`<Select label="Secretaria" required placeholder="Escolha a secretaria" options={secretarias} />
<Select label="Bairro" hint="O bairro onde o serviço será feito." options={bairros} defaultValue="centro" />
<Select label="Prioridade" error="Escolha a prioridade." placeholder="Escolha" options={prioridades} />`}
          >
            <div className="s-formgrid">
              <Select label="Secretaria" required placeholder="Escolha a secretaria" options={SECRETARIAS} />
              <Select label="Bairro" hint="O bairro onde o serviço será feito." defaultValue="centro" options={[{ value: "centro", label: "Centro" }, { value: "tambau", label: "Tambaú" }, { value: "mangabeira", label: "Mangabeira" }]} />
              <Select label="Prioridade" error="Escolha a prioridade." placeholder="Escolha" options={[{ value: "normal", label: "Normal" }, { value: "urgente", label: "Urgente" }]} />
              <Select label="Situação" disabled defaultValue="analise" options={[{ value: "analise", label: "Em análise" }]} />
            </div>
          </Example>
          <Note>Mais de 15 opções, ou quando a pessoa precisa buscar digitando: use um campo com busca (próximas ondas). Até 5 opções curtas: prefira o RadioGroup, que mostra tudo de uma vez.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Rótulo visível. Obrigatório."],
              ["options", "{ value, label, disabled? }[]", "", "As opções. Também aceita <option> como filhos."],
              ["placeholder", "string", "", "Primeira opção vazia, que não pode ser escolhida de volta."],
              ["hint", "ReactNode", "", "Ajuda antes do campo."],
              ["error", "ReactNode", "", "Mensagem de erro, anunciada ao aparecer."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Elemento nativo: setas, digitar a primeira letra e o seletor do celular funcionam sem nenhum código extra.</li>
            <li>A seta desenhada é decorativa; o leitor de tela anuncia "caixa de combinação" pelo próprio elemento.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  checkbox: {
    eyebrow: "Componente",
    title: "Checkbox",
    criterios: ["1.3.1", "1.4.11", "2.1.1", "2.4.7", "2.5.3", "2.5.8", "3.3.2", "4.1.2"],
    lead: "Marca ou desmarca uma opção independente: aceitar termos, escolher canais de aviso. A linha inteira, com o texto, recebe o clique.",
    body: () => (
      <>
        <DocSection title="Estados">
          <Example
            pad={false}
            code={`<Checkbox label="Li e aceito os termos de uso" />
<Checkbox label="Quero receber avisos por WhatsApp" defaultChecked />
<Checkbox label="Selecionar todos" indeterminate />
<Checkbox label="Confirmo que as informações são verdadeiras" error="Marque para continuar." />`}
          >
            <Matrix
              cols={["Exemplo"]}
              rows={[
                { name: "Desmarcado", cells: [<Checkbox label="Li e aceito os termos de uso" />] },
                { name: "Marcado", note: "O check se desenha ao marcar.", cells: [<Checkbox label="Quero receber avisos por WhatsApp" defaultChecked />] },
                { name: "Em parte", note: "Só alguns itens do grupo marcados.", cells: [<Checkbox label="Selecionar todos" indeterminate />] },
                { name: "Com ajuda", cells: [<Checkbox label="Atendimento prioritário" hint="Pessoas idosas, com deficiência, gestantes e lactantes." />] },
                { name: "Com erro", cells: [<Checkbox label="Confirmo que as informações são verdadeiras" error="Marque para continuar." />] },
                { name: "Desativado", cells: [<Checkbox label="Documento já enviado" defaultChecked disabled />] },
              ]}
            />
          </Example>
        </DocSection>
        <DocSection title="Selecionar todos">
          <Example code={`<Checkbox label="Receber avisos por todos os canais" checked={todos} indeterminate={alguns} onChange={…} />`}>
            <TodosOsAvisos />
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["label", "ReactNode", "", "Texto ao lado da caixa. Obrigatório."],
              ["hint", "ReactNode", "", "Explicação abaixo."],
              ["error", "ReactNode", "", "Mensagem de erro, anunciada ao aparecer."],
              ["indeterminate", "boolean", "false", "Estado em parte."],
              ["...rest", "input", "", "checked, defaultChecked, onChange, disabled, name, value."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>É um <code>input type="checkbox"</code> de verdade: Espaço marca, o leitor de tela diz "marcado", "não marcado" ou "misto".</li>
            <li>Caixa de 20px com borda de 3,7:1; a linha clicável tem 36px, e 44px no celular.</li>
            <li>Marcado muda o preenchimento e mostra o check: não depende só da cor.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  "radio-group": {
    eyebrow: "Componente",
    title: "RadioGroup",
    criterios: ["1.3.1", "1.4.11", "2.1.1", "2.4.6", "2.4.7", "2.5.8", "3.3.1", "3.3.2", "4.1.2"],
    lead: "Escolha única entre poucas opções, todas visíveis. A pergunta vira a legenda do grupo, lida antes de cada opção.",
    body: () => (
      <>
        <DocSection title="Exemplos">
          <Example
            code={`<RadioGroup
  legend="Como prefere ser atendido?"
  required
  options={[
    { value: "presencial", label: "Presencial", hint: "Na sede da secretaria, com hora marcada." },
    { value: "video", label: "Por vídeo", hint: "Com intérprete de Libras, se precisar." },
    { value: "telefone", label: "Por telefone" },
  ]}
/>`}
          >
            <div className="s-formgrid">
              <RadioGroup
                legend="Como prefere ser atendido?"
                required
                defaultValue="presencial"
                options={[
                  { value: "presencial", label: "Presencial", hint: "Na sede da secretaria, com hora marcada." },
                  { value: "video", label: "Por vídeo", hint: "Com intérprete de Libras, se precisar." },
                  { value: "telefone", label: "Por telefone" },
                ]}
              />
              <div className="s-stack">
                <RadioGroup legend="O endereço é o mesmo do cadastro?" inline options={[{ value: "sim", label: "Sim" }, { value: "nao", label: "Não" }]} />
                <RadioGroup legend="Tipo de imóvel" error="Escolha o tipo de imóvel." options={[{ value: "casa", label: "Casa" }, { value: "apto", label: "Apartamento" }, { value: "comercial", label: "Comercial", disabled: true }]} />
              </div>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["legend", "ReactNode", "", "A pergunta do grupo. Obrigatória."],
              ["options", "{ value, label, hint?, disabled? }[]", "", "As opções."],
              ["value / defaultValue", "string", "", "Opção escolhida (controlado ou não)."],
              ["onChange", "(value: string) => void", "", "Chamado ao escolher."],
              ["inline", "boolean", "false", "Lado a lado. Só para 2 ou 3 opções curtas."],
              ["hint, error, required", "", "", "Como nos outros campos."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li><code>fieldset</code> e <code>legend</code>: o leitor de tela diz "Como prefere ser atendido?, grupo" antes das opções.</li>
            <li>Tab entra no grupo; as setas trocam a opção, como manda o padrão nativo.</li>
            <li>Escolhido muda a espessura do círculo, não só a cor.</li>
          </ul>
        </DocSection>
      </>
    ),
  },

  alert: {
    eyebrow: "Componente",
    title: "Alert",
    criterios: ["1.1.1", "1.3.1", "1.4.1", "1.4.3", "1.4.11", "4.1.3"],
    lead: "Aviso na página: informação, sucesso, atenção ou erro. Ícone e título dizem o tipo; o texto sempre tem contraste de texto.",
    body: () => (
      <>
        <DocSection title="Tons">
          <Example
            code={`<Alert tone="info" title="Atendimento até 17h">O protocolo enviado depois das 17h entra no dia útil seguinte.</Alert>
<Alert tone="success" title="Solicitação enviada">Protocolo 2026-001043. Você recebe as atualizações por e-mail.</Alert>
<Alert tone="warning" title="Falta um documento" actions={<a href="#">Enviar comprovante</a>}>…</Alert>
<Alert tone="danger" title="Não foi possível enviar">…</Alert>`}
          >
            <div className="s-stack" style={{ width: "100%" }}>
              <Alert tone="info" title="Atendimento até 17h">O protocolo enviado depois das 17h entra no dia útil seguinte.</Alert>
              <Alert tone="success" title="Solicitação enviada">Protocolo 2026-001043. Você recebe as atualizações por e-mail.</Alert>
              <Alert tone="warning" title="Falta um documento" actions={<a href="#">Enviar comprovante de residência</a>}>
                Sem o comprovante, o pedido fica parado por até 30 dias.
              </Alert>
              <Alert tone="danger" title="Não foi possível enviar a solicitação">O sistema da Receita não respondeu. Tente de novo em alguns minutos.</Alert>
            </div>
          </Example>
        </DocSection>
        <DocSection title="Aviso que aparece depois">
          <p>
            Quando o aviso surge depois de uma ação, como o resultado de um envio, use <code>live</code>. O leitor de tela fala o aviso
            na hora: erro com prioridade (<code>role="alert"</code>), os outros sem interromper (<code>role="status"</code>).
          </p>
          <Example code={`{enviado && <Alert tone="danger" live title="Não foi possível enviar a solicitação.">…</Alert>}`}>
            <EnvioComErro />
          </Example>
          <Note>Não use <code>live</code> em avisos que já estão na página ao abrir: eles seriam lidos fora de ordem.</Note>
        </DocSection>
        <DocSection title="Props">
          <PropsTable
            rows={[
              ["tone", `"info" | "success" | "warning" | "danger"`, "info", "Tipo do aviso; define o ícone e a cor."],
              ["title", "ReactNode", "", "Frase curta que resume o aviso."],
              ["actions", "ReactNode", "", "Links ou botões do aviso."],
              ["live", "boolean", "false", "Anuncia ao aparecer. Só para avisos que surgem depois."],
            ]}
          />
        </DocSection>
        <DocSection title="Acessibilidade">
          <ul className="s-list">
            <li>Texto em cor de texto sobre fundo suave: contraste acima de 4,5:1 em todos os tons.</li>
            <li>Cada tom tem ícone próprio (informação, check, exclamação, X): o tipo não depende só da cor.</li>
            <li>Links dentro do aviso sempre sublinhados.</li>
          </ul>
        </DocSection>
      </>
    ),
  },
};
