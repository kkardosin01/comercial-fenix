"use client";
import { useActionState, useState, useTransition } from "react";
import { iniciarCadastro2fa, verificar2fa, type EstadoForm } from "@/actions/admin/auth";

export function FormMfa({ configurado }: { configurado: boolean }) {
  const [cadastro, setCadastro] = useState<EstadoForm>({});
  const [iniciando, startIniciar] = useTransition();
  const [estado, acao, pendente] = useActionState<EstadoForm, FormData>(verificar2fa, {});

  const precisaCadastrar = !configurado && !cadastro.factorId;

  return (
    <div className="mt-8 space-y-6">
      {precisaCadastrar ? (
        <div className="space-y-4 text-sm text-creme/85">
          <p>
            O acesso ao painel exige autenticação em dois fatores. Instale um aplicativo autenticador (Google
            Authenticator, Microsoft Authenticator, 1Password, Authy…) e clique abaixo para gerar o QR code.
          </p>
          <button
            type="button"
            disabled={iniciando}
            onClick={() => startIniciar(async () => setCadastro(await iniciarCadastro2fa()))}
            className="min-h-12 w-full rounded-full bg-ouro font-semibold text-ink disabled:opacity-60"
          >
            {iniciando ? "Gerando…" : "Configurar autenticador"}
          </button>
          {cadastro.erro && <p className="text-[#f3a397]">{cadastro.erro}</p>}
        </div>
      ) : (
        <>
          {cadastro.qr && (
            <div className="space-y-3 text-center text-sm">
              <p>Escaneie o QR code no aplicativo autenticador:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cadastro.qr} alt="QR code para configurar o autenticador" className="mx-auto size-48 rounded-xl bg-white p-2" />
              <p className="text-cinza">
                Ou digite a chave: <code className="break-all text-ouro-claro">{cadastro.segredo}</code>
              </p>
            </div>
          )}
          <form action={acao} className="space-y-4">
            {cadastro.factorId && <input type="hidden" name="factorId" value={cadastro.factorId} />}
            <div>
              <label htmlFor="codigo" className="mb-2 block text-sm">Código de 6 dígitos do aplicativo</label>
              <input
                id="codigo"
                name="codigo"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]{6,7}"
                maxLength={7}
                required
                autoFocus
                className="campo text-center font-display text-2xl tracking-[0.4em]"
              />
            </div>
            <p aria-live="polite" className="min-h-5 text-sm text-[#f3a397]">{estado.erro}</p>
            <button disabled={pendente} className="min-h-12 w-full rounded-full bg-ouro font-semibold text-ink disabled:opacity-60">
              {pendente ? "Verificando…" : "Verificar"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
