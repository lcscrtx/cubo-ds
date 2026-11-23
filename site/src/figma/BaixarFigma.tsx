// Botão "Baixar Figma" da home: pede a senha numa janela e entrega o .fig decifrado.
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button, Dialog, TextField } from "@cubo-tecnologia/hexagon";
import { decifrarFigma, SenhaErrada } from "./decifrar";

const NOME = "Cubo - Design System.fig";

function salvar(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = NOME;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function BaixarFigma() {
  const [aberto, setAberto] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [abrindo, setAbrindo] = useState(false);
  const pedido = useRef(0);
  const form = useId();
  const campo = useId();

  // A pessoa abriu para digitar a senha: o foco começa no campo, não no botão Fechar.
  useEffect(() => {
    if (aberto) document.getElementById(campo)?.focus();
  }, [aberto, campo]);

  const fechar = () => {
    pedido.current++;
    setAberto(false);
    setSenha("");
    setErro("");
    setAbrindo(false);
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (abrindo) return;
    if (!senha) {
      setErro("Digite a senha.");
      document.getElementById(campo)?.focus();
      return;
    }
    const id = ++pedido.current;
    setErro("");
    setAbrindo(true);
    try {
      const blob = await decifrarFigma(senha);
      if (id !== pedido.current) return;
      salvar(blob);
      fechar();
    } catch (err) {
      if (id !== pedido.current) return;
      setAbrindo(false);
      setErro(err instanceof SenhaErrada ? "Senha incorreta. Confira e tente de novo." : "Não foi possível baixar agora. Tente de novo.");
      document.getElementById(campo)?.focus();
    }
  };

  return (
    <>
      <button type="button" className="h-btn" aria-haspopup="dialog" onClick={() => setAberto(true)}>Baixar Figma</button>
      <Dialog
        open={aberto}
        onClose={fechar}
        title="Baixar o arquivo do Figma"
        description="O arquivo é protegido. Digite a senha para baixar."
        className="h-figma"
        actions={
          <>
            <Button variant="secondary" onClick={fechar}>Cancelar</Button>
            <Button type="submit" form={form} aria-disabled={abrindo || undefined}>{abrindo ? "Abrindo…" : "Baixar"}</Button>
          </>
        }
      >
        <form id={form} noValidate onSubmit={enviar}>
          <TextField
            id={campo}
            label="Senha"
            type="password"
            required
            autoComplete="off"
            value={senha}
            error={erro}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
          />
        </form>
      </Dialog>
    </>
  );
}
