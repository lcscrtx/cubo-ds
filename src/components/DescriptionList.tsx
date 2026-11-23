import type { ReactNode } from "react";
import { cx } from "./cx";

export interface DescriptionItem {
  term: ReactNode;
  /** Sem valor, mostra "Não informado" em vez de deixar vazio. */
  detail?: ReactNode;
  /** Ocupa a linha inteira (endereço, observações). */
  full?: boolean;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
  /** Colunas em telas largas. No celular, sempre uma. */
  columns?: 1 | 2 | 3;
  className?: string;
}

/**
 * Dados de um registro em pares nome e valor: os dados do cidadão, de um protocolo.
 * Usa <dl>, <dt> e <dd>: o leitor de tela anuncia a lista e liga cada valor ao seu nome.
 */
export function DescriptionList({ items, columns = 2, className }: DescriptionListProps) {
  return (
    <dl className={cx("hx-dl", `hx-dl--${columns}`, className)}>
      {items.map((it, i) => (
        <div key={i} className={cx("hx-dl__item", it.full && "hx-dl__item--full")}>
          <dt className="hx-dl__term">{it.term}</dt>
          <dd className={cx("hx-dl__detail", (it.detail === undefined || it.detail === "") && "is-empty")}>
            {it.detail === undefined || it.detail === "" ? "Não informado" : it.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}
