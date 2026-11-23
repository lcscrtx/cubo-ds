import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldHint, useFieldIds } from "./field";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "onChange"> {
  label: ReactNode;
  hint?: ReactNode;
  onChange?: (checked: boolean) => void;
  /** Textos do estado, mostrados ao lado da chave. Padrão: "Ligado" e "Desligado". */
  onText?: string;
  offText?: string;
}

/**
 * Liga e desliga uma configuração que vale na hora, sem botão de salvar
 * ("Receber avisos por WhatsApp"). Para escolhas que só valem ao enviar um formulário, use Checkbox.
 * O estado aparece escrito ("Ligado"), não só pela posição e pela cor.
 */
export function Switch({ label, hint, id, checked, defaultChecked, onChange, onText = "Ligado", offText = "Desligado", className, disabled, ...rest }: SwitchProps) {
  const { fieldId, hintId } = useFieldIds(id, hint, null);
  const [inner, setInner] = useState(Boolean(defaultChecked));
  const on = checked ?? inner;

  return (
    <div className={cx("hx-switch", className)}>
      <label className="hx-switch__row" htmlFor={fieldId}>
        <span className="hx-switch__text">
          <span className="hx-switch__label">{label}</span>
          <FieldHint id={hintId} hint={hint} />
        </span>
        <span className="hx-switch__control">
          <span className="hx-switch__state" aria-hidden="true">{on ? onText : offText}</span>
          <span className="hx-switch__track">
            <input
              id={fieldId}
              type="checkbox"
              role="switch"
              className="hx-switch__input"
              checked={on}
              disabled={disabled}
              aria-describedby={hintId}
              onChange={(e) => {
                if (checked === undefined) setInner(e.target.checked);
                onChange?.(e.target.checked);
              }}
              {...rest}
            />
            <span className="hx-switch__thumb" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8.5l2.5 2.5L12 5.5" /></svg>
            </span>
          </span>
        </span>
      </label>
    </div>
  );
}
