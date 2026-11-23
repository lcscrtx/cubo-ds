import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, FieldHint, RequiredMark, useFieldIds } from "./field";

export type MaskKind = "cpf" | "cnpj" | "telefone" | "cep";

interface MaskSpec {
  pattern: string; // 9 = dígito
  inputMode: "numeric" | "tel";
  autoComplete?: string;
  placeholder: string;
  /** Mensagem quando o número está incompleto ou inválido. */
  invalid: string;
  validate?: (digits: string) => boolean;
}

/** Dígitos verificadores do CPF. */
function cpfOk(d: string) {
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

/** Dígitos verificadores do CNPJ. */
function cnpjOk(d: string) {
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = w.reduce((s, x, i) => s + x * Number(d[i]), 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13]);
}

const MASKS: Record<MaskKind, MaskSpec> = {
  cpf: { pattern: "999.999.999-99", inputMode: "numeric", placeholder: "000.000.000-00", invalid: "Confira o CPF: os números não batem.", validate: cpfOk },
  cnpj: { pattern: "99.999.999/9999-99", inputMode: "numeric", placeholder: "00.000.000/0000-00", invalid: "Confira o CNPJ: os números não batem.", validate: cnpjOk },
  telefone: { pattern: "(99) 99999-9999", inputMode: "tel", autoComplete: "tel-national", placeholder: "(00) 00000-0000", invalid: "Digite o telefone com DDD." },
  cep: { pattern: "99999-999", inputMode: "numeric", autoComplete: "postal-code", placeholder: "00000-000", invalid: "O CEP tem 8 números." },
};

function maxDigits(pattern: string) {
  return pattern.replace(/[^9]/g, "").length;
}

/** Encaixa os dígitos no padrão, parando onde os dígitos acabam. */
export function applyMask(value: string, kind: MaskKind) {
  let digits = value.replace(/\D/g, "");
  let pattern = MASKS[kind].pattern;
  // Telefone fixo tem 8 dígitos depois do DDD.
  if (kind === "telefone" && digits.length <= 10) pattern = "(99) 9999-9999";
  digits = digits.slice(0, maxDigits(pattern));
  let out = "";
  let i = 0;
  for (const ch of pattern) {
    if (i >= digits.length) break;
    out += ch === "9" ? digits[i++] : ch;
  }
  return out;
}

export interface MaskedFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value" | "defaultValue"> {
  mask: MaskKind;
  label: ReactNode;
  hint?: ReactNode;
  /** Erro vindo de fora. Sem ele, o campo confere sozinho ao sair. */
  error?: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Valor formatado e só os dígitos. */
  onChange?: (formatted: string, digits: string) => void;
}

/**
 * Campo de documento ou contato com formato brasileiro. Formata enquanto digita,
 * abre o teclado numérico no celular, aceita colar com ou sem pontuação
 * e confere os dígitos do CPF e do CNPJ quando a pessoa sai do campo.
 */
export function MaskedField({ mask, label, hint, error, id, required, value, defaultValue = "", onChange, onBlur, className, placeholder, ...rest }: MaskedFieldProps) {
  const spec = MASKS[mask];
  const [inner, setInner] = useState(applyMask(defaultValue, mask));
  const [ownError, setOwnError] = useState<string | null>(null);
  const current = value !== undefined ? applyMask(value, mask) : inner;
  const shownError = error ?? ownError;
  const { fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, shownError);

  const check = (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return null;
    const pattern = mask === "telefone" && digits.length <= 10 ? "(99) 9999-9999" : spec.pattern;
    if (mask === "telefone" ? digits.length < 10 : digits.length < maxDigits(pattern)) return spec.invalid;
    if (spec.validate && !spec.validate(digits)) return spec.invalid;
    return null;
  };

  return (
    <div className={cx("hx-field", shownError ? "hx-field--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={fieldId}>
        {label}
        {required && <RequiredMark />}
      </label>
      <FieldHint id={hintId} hint={hint} />
      <input
        id={fieldId}
        className="hx-field__input hx-masked"
        inputMode={spec.inputMode}
        autoComplete={spec.autoComplete}
        placeholder={placeholder ?? spec.placeholder}
        required={required}
        value={current}
        aria-invalid={shownError ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e) => {
          const f = applyMask(e.target.value, mask);
          if (value === undefined) setInner(f);
          if (ownError && !check(f)) setOwnError(null);
          onChange?.(f, f.replace(/\D/g, ""));
        }}
        onBlur={(e) => {
          setOwnError(check(current));
          onBlur?.(e);
        }}
        {...rest}
      />
      <FieldError id={errorId} error={shownError} />
    </div>
  );
}
