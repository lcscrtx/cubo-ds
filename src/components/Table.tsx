import { useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "./cx";

export interface TableColumn<Row> {
  key: string;
  header: ReactNode;
  /** O que aparece na célula. Padrão: row[key]. */
  render?: (row: Row) => ReactNode;
  /** Valor usado para ordenar. Ligar torna a coluna ordenável. */
  sortValue?: (row: Row) => string | number;
  /** Números e valores: alinhados à direita. */
  align?: "start" | "end";
  /** A coluna que identifica a linha (protocolo, nome). Vira cabeçalho de linha. */
  rowHeader?: boolean;
}

export interface TableProps<Row> {
  /** Legenda: o que a tabela mostra. Obrigatória; pode ficar visível só para leitor de tela. */
  caption: ReactNode;
  hideCaption?: boolean;
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Mensagem quando não há linhas. */
  empty?: ReactNode;
  className?: string;
}

type Sort = { key: string; dir: "ascending" | "descending" } | null;

/**
 * Tabela de dados com <table> de verdade: cabeçalhos de coluna e de linha, legenda e ordenação
 * anunciada (aria-sort). Em telas estreitas, rola de lado dentro de uma região com nome e foco.
 */
export function Table<Row>({ caption, hideCaption, columns, rows, rowKey, empty = "Nenhum registro.", className }: TableProps<Row>) {
  const base = useId();
  const [sort, setSort] = useState<Sort>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR");
      return sort.dir === "ascending" ? r : -r;
    });
  }, [rows, columns, sort]);

  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "ascending" ? "descending" : "ascending" } : { key, dir: "ascending" }));

  const cell = (row: Row, c: TableColumn<Row>) => (c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]);

  return (
    <div className={cx("hx-table", className)}>
      {/* Região rolável com foco e nome, para quem usa teclado conseguir rolar (WCAG 2.1.1). */}
      <div className="hx-table__scroll" role="region" aria-labelledby={`${base}-cap`} tabIndex={0}>
        <table className="hx-table__table">
          <caption id={`${base}-cap`} className={cx("hx-table__caption", hideCaption && "hx-sr")}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => {
                const dir = sort?.key === c.key ? sort.dir : undefined;
                return (
                  <th key={c.key} scope="col" aria-sort={c.sortValue ? (dir ?? "none") : undefined} className={cx(c.align === "end" && "is-end")}>
                    {c.sortValue ? (
                      <button type="button" className="hx-table__sort" onClick={() => toggle(c.key)}>
                        {c.header}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" data-dir={dir ?? "none"}>
                          <path className="hx-table__up" d="M5 6.5L8 3.5l3 3" />
                          <path className="hx-table__down" d="M5 9.5l3 3 3-3" />
                        </svg>
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="hx-table__empty">{empty}</td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((c) =>
                    c.rowHeader ? (
                      <th key={c.key} scope="row" className={cx(c.align === "end" && "is-end")}>{cell(row, c)}</th>
                    ) : (
                      <td key={c.key} className={cx(c.align === "end" && "is-end")}>{cell(row, c)}</td>
                    ),
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Anuncia a ordenação nova sem tirar o foco do botão. */}
      <p className="hx-sr" aria-live="polite">
        {sort ? `Ordenado por ${String(columns.find((c) => c.key === sort.key)?.header ?? "")}, ${sort.dir === "ascending" ? "crescente" : "decrescente"}.` : ""}
      </p>
    </div>
  );
}
