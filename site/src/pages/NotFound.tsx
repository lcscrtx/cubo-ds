import { Button } from "@cubo-tecnologia/hexagon";

export function NotFound({ inline }: { inline?: boolean }) {
  const body = (
    <div className="s-404">
      <p className="s-404__title">Página não encontrada</p>
      <p className="s-muted">O endereço mudou ou não existe. A documentação começa pela introdução.</p>
      <Button href="/docs">Ir para a documentação</Button>
    </div>
  );
  return inline ? body : <main id="conteudo">{body}</main>;
}
