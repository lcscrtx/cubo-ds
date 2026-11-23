import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import { cx } from "./cx";
import { FieldError, RequiredMark } from "./field";

export interface FileUploadProps {
  label: ReactNode;
  /** Formatos e tamanho aceitos, em palavras: "PDF ou foto, até 5 MB". */
  hint?: ReactNode;
  /** Tipos aceitos, como no input: ".pdf,.jpg,.png" ou "image/*". */
  accept?: string;
  /** Tamanho máximo de cada arquivo, em MB. */
  maxSizeMB?: number;
  /** Aceita mais de um arquivo. */
  multiple?: boolean;
  required?: boolean;
  /** Erro vindo de fora (por exemplo, "Anexe o comprovante"). */
  error?: ReactNode;
  /** Lista de arquivos aceitos, sempre que mudar. */
  onChange?: (files: File[]) => void;
  className?: string;
}

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`);

function matches(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept.split(",").map((a) => a.trim().toLowerCase()).some((a) =>
    a.startsWith(".") ? name.endsWith(a) : a.endsWith("/*") ? file.type.startsWith(a.slice(0, -1)) : file.type === a,
  );
}

/**
 * Anexar documentos. Botão de verdade para escolher (teclado e leitor de tela),
 * área para arrastar e soltar para quem usa mouse, lista dos arquivos com botão de remover
 * e cada mudança anunciada ("comprovante.pdf adicionado").
 */
export function FileUpload({ label, hint, accept, maxSizeMB, multiple, required, error, onChange, className }: FileUploadProps) {
  const base = useId();
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [announce, setAnnounce] = useState("");

  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = `${base}-error`;
  const allErrors = [error, ...rejected].filter(Boolean);

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const ok: File[] = [];
    const bad: string[] = [];
    [...list].forEach((f) => {
      if (!matches(f, accept)) bad.push(`${f.name}: formato não aceito.`);
      else if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) bad.push(`${f.name}: maior que ${maxSizeMB} MB (${fmtSize(f.size)}).`);
      else ok.push(f);
    });
    const next = multiple ? [...files, ...ok] : ok.slice(0, 1).length ? ok.slice(0, 1) : files;
    setFiles(next);
    setRejected(bad);
    onChange?.(next);
    setAnnounce(
      [ok.length ? `${ok.map((f) => f.name).join(", ")} ${ok.length === 1 ? "adicionado" : "adicionados"}.` : "", bad.length ? `${bad.length} ${bad.length === 1 ? "arquivo recusado" : "arquivos recusados"}.` : ""].join(" ").trim(),
    );
    if (input.current) input.current.value = "";
  };

  const remove = (i: number) => {
    const f = files[i];
    const next = files.filter((_, j) => j !== i);
    setFiles(next);
    onChange?.(next);
    setAnnounce(`${f.name} removido.`);
    input.current?.focus();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    add(e.dataTransfer.files);
  };

  return (
    <div className={cx("hx-upload", allErrors.length ? "hx-upload--invalid" : undefined, className)}>
      <label className="hx-field__label" htmlFor={base}>
        {label}
        {required && <RequiredMark />}
      </label>
      {hint && <p id={hintId} className="hx-field__hint">{hint}</p>}

      <div
        className={cx("hx-upload__zone", dragging && "is-dragging")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <svg className="hx-upload__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
        </svg>
        <input
          ref={input}
          id={base}
          type="file"
          className="hx-upload__input"
          accept={accept}
          multiple={multiple}
          required={required && files.length === 0}
          aria-describedby={[hintId, allErrors.length ? errorId : undefined].filter(Boolean).join(" ") || undefined}
          aria-invalid={allErrors.length ? true : undefined}
          onChange={(e) => add(e.target.files)}
        />
        <span className="hx-upload__cta">
          <span className="hx-button hx-button--secondary" aria-hidden="true">{multiple ? "Escolher arquivos" : "Escolher arquivo"}</span>
          <span className="hx-upload__or">ou arraste {multiple ? "os arquivos" : "o arquivo"} para cá</span>
        </span>
      </div>

      {files.length > 0 && (
        <ul className="hx-upload__list" aria-label="Arquivos anexados">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="hx-upload__file">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4zM9.5 1.5V5H13" /></svg>
              <span className="hx-upload__name">{f.name}</span>
              <span className="hx-upload__size">{fmtSize(f.size)}</span>
              <button type="button" className="hx-upload__remove" onClick={() => remove(i)}>
                Remover<span className="hx-sr"> {f.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <FieldError id={errorId} error={allErrors.length ? <>{allErrors.map((e, i) => <span key={i} style={{ display: "block" }}>{e}</span>)}</> : null} />
      <p className="hx-sr" aria-live="polite">{announce}</p>
    </div>
  );
}
