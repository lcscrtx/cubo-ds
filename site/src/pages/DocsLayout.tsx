import { NavLink, Outlet } from "react-router-dom";
import { NAV } from "../docs/nav";
import { Toc } from "../docs-kit";

/** Três colunas, como no shadcn e no Radix: menu, conteúdo e "Nesta página". */
export function DocsLayout() {
  return (
    <div className="s-docs">
      <aside className="s-side" aria-label="Documentação">
        {NAV.map((g) => (
          <div className="s-side__group" key={g.title}>
            <p className="s-side__title">{g.title === "Seções" ? "Começando" : g.title}</p>
            {g.items.map((i) => (
              <NavLink key={i.slug} to={i.to} end>{i.title}</NavLink>
            ))}
          </div>
        ))}
      </aside>
      <main id="conteudo" className="s-docs__main">
        <Outlet />
      </main>
      <aside className="s-docs__toc">
        <Toc />
      </aside>
    </div>
  );
}
