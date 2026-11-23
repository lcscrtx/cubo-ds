import type { ReactNode } from "react";
import { cx } from "./cx";
import { StatusIcon, type StatusIconName } from "./StatusIcon";

export interface TimelineEvent {
  id: string;
  title: ReactNode;
  /** Data e hora em ISO, para o <time>. */
  date: string;
  description?: ReactNode;
  /** Quem fez: "Ana Souza, Secretaria de Saúde". */
  actor?: ReactNode;
  /** Ícone de status do evento. Padrão: um ponto. */
  icon?: StatusIconName;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export interface TimelineProps {
  events: TimelineEvent[];
  /** Nome da lista para o leitor de tela: "Histórico do protocolo 2026-001043". */
  label: string;
  /** Mais recente primeiro (padrão) ou mais antigo primeiro. */
  order?: "newest" | "oldest";
  className?: string;
}

const fmt = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const data = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${data}, ${hora}`;
};

/** Histórico de um pedido: o que aconteceu, quando e quem fez. */
export function Timeline({ events, label, order = "newest", className }: TimelineProps) {
  const sorted = [...events].sort((a, b) => (order === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  return (
    <ol className={cx("hx-timeline", className)} aria-label={label}>
      {sorted.map((e, i) => (
        <li key={e.id} className={cx("hx-timeline__item", `hx-timeline__item--${e.tone ?? "neutral"}`, i === 0 && order === "newest" && "is-latest")}>
          <span className="hx-timeline__marker" aria-hidden="true">
            {e.icon ? <StatusIcon name={e.icon} animated={false} /> : <span className="hx-timeline__dot" />}
          </span>
          <div className="hx-timeline__body">
            <p className="hx-timeline__title">{e.title}</p>
            <p className="hx-timeline__meta">
              <time dateTime={e.date}>{fmt(e.date)}</time>
              {e.actor && <> · {e.actor}</>}
            </p>
            {e.description && <div className="hx-timeline__desc">{e.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
