// Respostas de exemplo, escritas à mão para a tela do Cartão SUS.
// Aparecem só quando o servidor não tem chave da API, marcadas como demonstração.
import type { Explicacao, Simplificacao } from "./respostas";

export const DEMO_EXPLICAR: Explicacao = {
  resumo: "Nesta página você pede o Cartão SUS. É o cartão que mostra quem você é quando é atendido em um posto de saúde ou hospital público. É de graça.",
  passos: [
    "Escreva seu nome completo, como está no documento.",
    "Escreva o número do seu CPF.",
    "Coloque sua data de nascimento.",
    "Diga se o cartão é para você ou para uma criança que depende de você.",
    "Mande uma foto ou PDF de uma conta da sua casa.",
    "Aperte em Continuar.",
  ],
  precisaTer: [
    "Um documento com foto, como RG ou carteira de motorista.",
    "Seu CPF.",
    "Uma conta de luz, água ou telefone com seu endereço, de no máximo 90 dias atrás.",
    "Se o cartão for para uma criança: a certidão de nascimento dela.",
  ],
  atencao: [
    "Se faltar algum documento, o pedido é negado.",
    "A prefeitura tem até 5 dias úteis para analisar. Esse prazo pode aumentar.",
  ],
  naoInforma: ["Onde retirar o cartão depois de pronto.", "O que fazer se a conta da casa não estiver no seu nome."],
};

export const DEMO_SIMPLIFICAR: Simplificacao = {
  secoes: [
    {
      titulo: "Sobre o serviço",
      texto: "O Cartão SUS mostra quem você é quando é atendido na saúde pública. Com ele, o posto e o hospital sabem quem atendeu você e o que foi feito. O cartão é de graça. Para pedir, você precisa mandar os documentos da lista abaixo.",
    },
    {
      titulo: "Documentos necessários",
      texto: "Tenha em mãos: um documento com foto (RG ou carteira de motorista), seu CPF e uma conta de luz, água ou telefone com seu endereço, de no máximo 90 dias atrás. Se o cartão for para uma criança, tenha também a certidão de nascimento dela.",
    },
    {
      titulo: "Prazo",
      texto: "A prefeitura tem até 5 dias úteis para analisar seu pedido. Os dias contam a partir do dia em que você pediu. Esse prazo pode aumentar se a unidade de saúde explicar o motivo.",
    },
  ],
};
