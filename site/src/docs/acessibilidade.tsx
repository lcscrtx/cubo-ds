import { Badge } from "@cubo-tecnologia/hexagon";
import { DocSection, Note } from "../ui";
import { contrastRows } from "./a11y";
import type { Doc } from "./types";

/** Contraste medido dos pares de cor do tema. */
function ContrastTable() {
  const rows = contrastRows();
  const darkRows = contrastRows("dark");
  return (
    <>
      <p>Medido agora, a partir dos tokens, nos temas claro e escuro.</p>
      <div className="s-table-wrap">
        <table className="s-table">
          <caption className="s-sr">Contraste dos pares de cor</caption>
          <thead>
            <tr><th>Uso</th><th>Amostra</th><th>Claro</th><th>Escuro</th><th>Mínimo</th><th>Resultado</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const d = darkRows[i];
              const pior = Math.min(r.ratio, d.ratio);
              const ok = pior >= r.minimo;
              const aaa = r.minimo === 4.5 && pior >= 7;
              return (
                <tr key={r.uso}>
                  <td>{r.uso}</td>
                  <td>
                    <span className="s-sample" style={{ color: r.fg, background: r.bg, borderColor: r.minimo === 3 ? r.fg : "transparent" }}>Aa</span>{" "}
                    <span className="s-sample" style={{ color: d.fg, background: d.bg, borderColor: d.minimo === 3 ? d.fg : "transparent" }}>Aa</span>
                  </td>
                  <td><code>{r.ratio.toFixed(2)}:1</code></td>
                  <td><code>{d.ratio.toFixed(2)}:1</code></td>
                  <td><code>{r.minimo}:1</code></td>
                  <td>
                    {ok ? <Badge tone="success" icon="concluido" animated={false}>{aaa ? "Passa AAA" : "Passa AA"}</Badge> : <Badge tone="danger" icon="indeferido" animated={false}>Não passa</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const REGRAS: [titulo: string, valor: string, texto: string, criterio: string][] = [
  ["Contraste de texto", "4,5:1", "Todo texto, inclusive placeholder, rótulo pequeno e texto de botão, tem pelo menos 4,5:1 sobre o fundo.", "WCAG 1.4.3"],
  ["Contraste de controles", "3:1", "Bordas de campo, anel de foco e ícones de controle têm pelo menos 3:1.", "WCAG 1.4.11"],
  ["Área de toque", "44px", "Botões têm 36px de desenho e 44px de área de toque. No celular, campos crescem para 44px.", "WCAG 2.5.5 (AAA)"],
  ["Menor texto", "13px", "Nenhum texto do sistema fica abaixo de 13px. Corpo de texto em 16px.", "eMAG 3.1"],
  ["Campos no celular", "16px", "Texto digitado em 16px no celular: legível e sem o zoom automático do iOS.", "WCAG 1.4.4"],
  ["Foco visível", "2px", "Anel de 2px na cor de ação, afastado 2px, em tudo que recebe teclado.", "WCAG 2.4.7"],
  ["Movimento", "5s", "Nenhuma animação passa de 5 segundos, e todas param quando a pessoa pede menos movimento.", "WCAG 2.2.2"],
  ["Cor nunca sozinha", "Texto", "Status sempre com texto; erro com ícone e texto; link e ghost sublinham no hover.", "WCAG 1.4.1"],
];

export const ACESSIBILIDADE: Doc = {
  eyebrow: "Seção · Núcleo do produto",
  title: "Acessibilidade",
  lead: "No Hexagon, acessibilidade não é um extra: é o ponto de partida. Cada peça nasce conferida contra as normas que o serviço público brasileiro segue, para que servidores e cidadãos usem os sistemas da prefeitura e da câmara sem barreira.",
  body: () => (
    <>
      <section className="s-a11y-hero" aria-label="Resumo">
        <div><strong>WCAG 2.2</strong><span>nível AA como piso, AAA em alvo de toque e movimento</span></div>
        <div><strong>eMAG 3.1</strong><span>Modelo de Acessibilidade em Governo Eletrônico</span></div>
        <div><strong>NBR 17225</strong><span>norma da ABNT para conteúdo e aplicações web</span></div>
        <div><strong>LBI</strong><span>Lei Brasileira de Inclusão, Lei nº 13.146/2015, art. 63</span></div>
      </section>

      <DocSection title="Por que é o núcleo">
        <p>
          Os sistemas da Cubo são usados o dia inteiro por servidores públicos de todas as idades e por cidadãos com todo tipo de
          condição: baixa visão, daltonismo, tremor nas mãos, deficiência auditiva, dislexia, pouca familiaridade com tecnologia.
          A Lei Brasileira de Inclusão torna obrigatória a acessibilidade nos sites e sistemas de órgãos de governo. Um design
          system que já entrega isso pronto tira o peso de cada tela e de cada equipe.
        </p>
      </DocSection>

      <DocSection title="As regras do sistema">
        <p>Valem para todos os componentes. Nenhuma peça é aprovada sem cumprir as oito.</p>
        <div className="s-rules">
          {REGRAS.map(([t, v, d, c]) => (
            <div className="s-rule" key={t}>
              <span className="s-rule__v">{v}</span>
              <strong>{t}</strong>
              <p>{d}</p>
              <code>{c}</code>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Contraste medido">
        <ContrastTable />
      </DocSection>

      <DocSection title="Preferências da pessoa, respeitadas">
        <ul className="s-list">
          <li><strong>Menos movimento</strong> (<code>prefers-reduced-motion</code>): toda animação e transição para; ícones aparecem já desenhados.</li>
          <li><strong>Mais contraste</strong> (<code>prefers-contrast</code>): texto secundário escurece e bordas ficam fortes.</li>
          <li><strong>Alto contraste do Windows</strong> (<code>forced-colors</code>): botões, etiquetas e cartões ganham borda; o foco usa a cor do sistema.</li>
          <li><strong>Zoom e tamanho de fonte</strong>: as telas reorganizam sem rolagem lateral até 400% de zoom e aceitam espaçamento de texto ampliado.</li>
        </ul>
      </DocSection>

      <DocSection title="Leitores de tela e teclado">
        <ul className="s-list">
          <li>Elementos nativos sempre que possível: <code>button</code>, <code>a</code>, <code>input</code>, <code>label</code>. Nada de <code>div</code> clicável.</li>
          <li>Rótulo sempre visível e ligado ao campo. O placeholder nunca substitui o rótulo.</li>
          <li>Ajuda e erro ligados por <code>aria-describedby</code>; o erro é anunciado quando aparece.</li>
          <li>Obrigatório escrito por extenso, não só com asterisco.</li>
          <li>Ícones decorativos escondidos do leitor de tela; o texto carrega o significado.</li>
          <li>Ordem de foco igual à ordem visual; tudo funciona só com o teclado.</li>
        </ul>
      </DocSection>

      <DocSection title="Como cada peça é conferida">
        <ol className="s-list">
          <li>Contraste de todos os pares de cor, nos temas claro e escuro.</li>
          <li>Navegação só com teclado: Tab, Shift+Tab, Enter e Espaço.</li>
          <li>Leitor de tela: NVDA no Windows e VoiceOver no celular.</li>
          <li>Zoom de 200% e 400%, e celular com 320px de largura.</li>
          <li>Menos movimento, mais contraste e alto contraste do Windows ligados.</li>
        </ol>
        <Note>
          Próximos passos: testes automáticos com axe em cada componente, sessões com servidores usuários de leitor de tela e
          integração com o VLibras para Libras.
        </Note>
      </DocSection>
    </>
  ),
};
