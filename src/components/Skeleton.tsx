import type { CSSProperties, ReactNode } from "react";
import { cx } from "./cx";

export interface SkeletonProps {
  /** Largura. Número vira px. Padrão: 100%. */
  width?: number | string;
  /** Altura. Número vira px. Padrão: uma linha de texto. */
  height?: number | string;
  /** Várias linhas de texto; a última fica mais curta. */
  lines?: number;
  /** Círculo, para avatar. */
  circle?: boolean;
  className?: string;
}

const size = (v: number | string | undefined) => (typeof v === "number" ? `${v}px` : v);

/** Forma cinza no lugar do conteúdo que está carregando. Decorativa: o leitor de tela ouve o LoadingRegion. */
export function Skeleton({ width, height, lines, circle, className }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <span className={cx("hx-skeleton-lines", className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="hx-skeleton" style={{ width: i === lines - 1 ? "62%" : size(width) }} />
        ))}
      </span>
    );
  }
  const style: CSSProperties = { width: size(width), height: size(height) };
  return <span className={cx("hx-skeleton", circle && "hx-skeleton--circle", className)} style={style} aria-hidden="true" />;
}

export interface LoadingRegionProps {
  /** true enquanto carrega. */
  loading: boolean;
  /** O que está carregando, dito ao leitor de tela: "Carregando protocolos". */
  label: string;
  /** Dito ao terminar: "Protocolos carregados". */
  loadedLabel?: string;
  /** Os Skeletons mostrados enquanto carrega. */
  fallback: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Troca o esboço pelo conteúdo. Avisa o leitor de tela quando começa ("Carregando protocolos…")
 * e, se houver loadedLabel, quando termina ("Protocolos carregados"), sem tirar o foco de onde a pessoa está.
 */
export function LoadingRegion({ loading, label, loadedLabel, fallback, children, className }: LoadingRegionProps) {
  return (
    <div className={cx("hx-loading", className)} aria-busy={loading}>
      <p className="hx-sr" role="status">{loading ? `${label}…` : (loadedLabel ?? "")}</p>
      {loading ? fallback : children}
    </div>
  );
}
