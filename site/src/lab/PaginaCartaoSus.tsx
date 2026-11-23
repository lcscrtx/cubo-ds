// Página de serviço de exemplo (Portal do Cidadão), com o texto "de edital" de propósito,
// para mostrar o assistente de compreensão trabalhando.
import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, DateField, FileUpload, MaskedField, PageHeader, RadioGroup, Stepper, TextField } from "@cubo-tecnologia/hexagon";

export function PaginaCartaoSus() {
  const [etapa] = useState(1);
  return (
    <main id="conteudo" className="a-page">
      <p className="a-lab" data-assist-ignore>
        <span className="a-lab__tag">Laboratório</span>
        Protótipo do assistente de compreensão: use <strong>Explicar a página</strong> e <strong>Simplificar o texto</strong> na barra de acessibilidade, no topo. <Link to="/">Voltar ao Hexagon</Link>
      </p>

      <div className="a-service">
        <PageHeader
          title="Cartão Nacional de Saúde (Cartão SUS)"
          description="Solicitação de emissão do Cartão Nacional de Saúde para munícipes. Secretaria Municipal de Saúde."
        />

        <div className="a-cols">
          <article className="a-info">
            <h2>Sobre o serviço</h2>
            <p>
              O Cartão Nacional de Saúde constitui instrumento de identificação do usuário no âmbito do Sistema Único de Saúde,
              possibilitando a vinculação dos procedimentos executados ao respectivo usuário, ao profissional e à unidade de saúde.
              A emissão é gratuita e será efetivada mediante apresentação da documentação comprobatória elencada abaixo.
            </p>
            <h2>Documentos necessários</h2>
            <ul>
              <li>Documento oficial de identificação com foto;</li>
              <li>Cadastro de Pessoa Física (CPF);</li>
              <li>Comprovante de residência atualizado, emitido há no máximo 90 (noventa) dias;</li>
              <li>Certidão de nascimento, no caso de requerente menor de idade.</li>
            </ul>
            <h2>Prazo</h2>
            <p>
              O prazo para análise da solicitação é de até 5 (cinco) dias úteis, contados a partir da data do protocolo,
              podendo ser prorrogado mediante justificativa da unidade responsável.
            </p>
          </article>

          <Card className="a-form">
            <Stepper steps={[{ label: "Seus dados" }, { label: "Documentos" }, { label: "Revisão" }]} current={etapa} />
            <form className="a-form__fields" onSubmit={(e) => e.preventDefault()}>
              <TextField label="Nome completo" required autoComplete="name" />
              <MaskedField mask="cpf" label="CPF" required hint="Só os números. Está no seu RG novo ou no cartão do CPF." />
              <DateField label="Data de nascimento" required />
              <RadioGroup
                legend="Para quem é o cartão?"
                required
                options={[{ value: "eu", label: "Para mim" }, { value: "dep", label: "Para um dependente menor de idade" }]}
              />
              <FileUpload label="Comprovante de residência" hint="PDF ou foto, até 2 MB. Emitido há no máximo 90 dias." accept=".pdf,image/*" maxSizeMB={2} required />
              <Alert tone="warning" title="Atenção">
                A ausência de documentação comprobatória ensejará o indeferimento da solicitação.
              </Alert>
              <Button type="submit">Continuar</Button>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
