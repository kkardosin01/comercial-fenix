const TEXTOS: Record<string, string> = {
  salvo: "Alterações salvas. O site é atualizado em instantes.",
  excluido: "Registro excluído.",
  erro: "Não foi possível concluir a operação.",
};

export function Aviso({ ok }: { ok?: string | string[] }) {
  const k = typeof ok === "string" ? ok : undefined;
  if (!k || !TEXTOS[k]) return null;
  return (
    <p role="status" className={`mb-6 rounded-xl border px-4 py-3 text-sm ${k === "erro" ? "border-[#f3a397]/40 text-[#f7c2b9]" : "border-ouro/40 bg-ouro/5 text-ouro-claro"}`}>
      {TEXTOS[k]}
    </p>
  );
}
