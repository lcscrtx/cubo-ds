import type { ReactNode } from "react";

export interface Doc {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  body: () => ReactNode;
  /** Critérios WCAG 2.2 que a peça atende, mostrados no topo da página. */
  criterios?: string[];
  /** v2: página no modelo novo (prévia ↔ código, exemplos, instalação, uso, acessibilidade, API). */
  layout?: "v2";
}
