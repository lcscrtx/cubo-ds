import type { ReactNode } from "react";
import { cx } from "./cx";

export interface StepperStep {
  label: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Etapa atual, começando em 1. */
  current: number;
  /** Deixa voltar a uma etapa já concluída clicando nela. */
  onStepClick?: (step: number) => void;
  className?: string;
}

/**
 * Mostra em que etapa de um formulário longo a pessoa está.
 * O leitor de tela ouve "Etapa 2 de 4: Documentos"; cada etapa concluída diz "concluída".
 * No celular, vira uma linha com o texto da etapa e uma barra de progresso.
 */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const total = steps.length;
  const atual = steps[current - 1];
  return (
    <nav className={cx("hx-stepper", className)} aria-label="Etapas do formulário">
      <p className="hx-stepper__now">
        <span className="hx-stepper__count">Etapa {current} de {total}</span>
        <span className="hx-stepper__now-label">{atual?.label}</span>
      </p>
      <div className="hx-stepper__bar" aria-hidden="true">
        <span style={{ width: `${(current / total) * 100}%` }} />
      </div>
      <ol className="hx-stepper__list">
        {steps.map((s, i) => {
          const n = i + 1;
          const state = n < current ? "done" : n === current ? "current" : "todo";
          const inner = (
            <>
              <span className="hx-stepper__dot" aria-hidden="true">
                {state === "done" ? (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>
                ) : (
                  n
                )}
              </span>
              <span className="hx-stepper__label">
                {s.label}
                {state === "done" && <span className="hx-sr">, concluída</span>}
                {state === "todo" && <span className="hx-sr">, a fazer</span>}
              </span>
            </>
          );
          return (
            <li key={n} className={cx("hx-stepper__step", `is-${state}`)} aria-current={state === "current" ? "step" : undefined}>
              {state === "done" && onStepClick ? (
                <button type="button" className="hx-stepper__btn" onClick={() => onStepClick(n)}>{inner}</button>
              ) : (
                <span className="hx-stepper__btn">{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
