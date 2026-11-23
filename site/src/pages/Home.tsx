// Home no modelo shadcn: título curto, dois botões e uma grade de blocos reais.
import { Link } from "react-router-dom";
import { BaixarFigma } from "../figma/BaixarFigma";
import { BlocoAvisos, BlocoCartao, BlocoDocumentos, BlocoHistorico, BlocoIndicadores, BlocoPedido, BlocoProtocolos } from "../home/Blocks";

export function Home() {
  return (
    <main id="conteudo" className="h-home">
      <section className="h-hero" aria-labelledby="h-title">
        <Link to="/docs/componentes" className="h-pill">
          <span className="h-pill__tag">Novo</span>
          40 componentes, tema escuro
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4" /></svg>
        </Link>
        <h1 id="h-title" className="h-title">Componentes acessíveis para construir o serviço público.</h1>
        <p className="h-lead">Componentes React e tokens para os produtos da Cubo. Cada peça já segue a WCAG 2.2, o eMAG e a ABNT NBR 17225.</p>
        <div className="h-ctas">
          <Link to="/docs/instalacao" className="h-btn h-btn--primary">Começar</Link>
          <Link to="/docs/componentes" className="h-btn">Ver componentes</Link>
          <BaixarFigma />
        </div>
      </section>

      <section className="h-showcase" aria-labelledby="h-show-title">
        <div className="h-showcase__bar">
          <h2 id="h-show-title" className="h-showcase__title">Telas feitas só com o Hexagon</h2>
        </div>

        <div className="h-grid">
          <div className="h-col">
            <BlocoPedido />
            <BlocoAvisos />
          </div>
          <div className="h-col h-col--wide">
            <BlocoIndicadores />
            <BlocoProtocolos />
            <BlocoHistorico />
          </div>
          <div className="h-col">
            <BlocoDocumentos />
            <BlocoCartao />
          </div>
        </div>
      </section>
    </main>
  );
}
