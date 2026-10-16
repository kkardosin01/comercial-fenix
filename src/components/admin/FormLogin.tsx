"use client";
import { useActionState } from "react";
import { entrar, type EstadoForm } from "@/actions/admin/auth";

export function FormLogin({ aviso }: { aviso?: string }) {
  const [estado, acao, pendente] = useActionState<EstadoForm, FormData>(entrar, {});
  const erro = estado.erro ?? aviso;
  return (
    <form action={acao} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="campo" />
      </div>
      <div>
        <label htmlFor="senha" className="mb-2 block text-sm">Senha</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" className="campo" />
      </div>
      <p aria-live="polite" className="min-h-5 text-sm text-[#f3a397]">{erro}</p>
      <button disabled={pendente} className="min-h-12 w-full rounded-full bg-ouro font-semibold text-ink hover:bg-ouro-claro disabled:opacity-60">
        {pendente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
