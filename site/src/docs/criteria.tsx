import { CRITERIOS } from "./a11y";

/** Lista de critérios WCAG que a peça cumpre. No modelo novo, fica dentro da seção Acessibilidade. */
export function CriteriaList({ ids }: { ids: string[] }) {
  return (
    <ul className="k-criteria" aria-label="Critérios da WCAG 2.2 conferidos">
      {ids.map((id) => {
        const c = CRITERIOS[id];
        return (
          <li key={id}>
            <span className="k-criteria__lvl">{c.nivel}</span>
            <code>{c.id}</code>
            {c.nome}
          </li>
        );
      })}
    </ul>
  );
}
