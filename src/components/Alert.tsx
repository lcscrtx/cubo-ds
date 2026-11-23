import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";
import { StatusIcon, type StatusIconName } from "./StatusIcon";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  /** Frase curta que resume o aviso. */
  title?: ReactNode;
  /** Ações do aviso, como um link "Enviar comprovante". */
  actions?: ReactNode;
  /**
   * true quando o aviso aparece depois que a página carregou (resultado de um envio, por exemplo).
   * O leitor de tela anuncia: erro com prioridade, os outros sem interromper.
   */
  live?: boolean;
}

const ICONE: Record<AlertTone, StatusIconName> = {
  info: "info",
  success: "concluido",
  warning: "alerta",
  danger: "indeferido",
};

/** Aviso na página. Ícone e título dizem o tipo; nunca só a cor. */
export function Alert({ tone = "info", title, actions, live, className, children, ...rest }: AlertProps) {
  const role = live ? (tone === "danger" ? "alert" : "status") : undefined;
  return (
    <div className={cx("hx-alert", `hx-alert--${tone}`, className)} role={role} {...rest}>
      <StatusIcon name={ICONE[tone]} animated={Boolean(live)} className="hx-alert__icon" />
      <div className="hx-alert__body">
        {title && <p className="hx-alert__title">{title}</p>}
        {children && <div className="hx-alert__text">{children}</div>}
        {actions && <div className="hx-alert__actions">{actions}</div>}
      </div>
    </div>
  );
}
