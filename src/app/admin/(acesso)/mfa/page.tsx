import { Suspense } from "react";
import { exigirPrimeiroFator } from "@/lib/admin/auth";
import { FormMfa } from "@/components/admin/FormMfa";
import { sair } from "@/actions/admin/auth";

export const metadata = { title: "Verificação em duas etapas" };

async function Conteudo() {
  const { supabase } = await exigirPrimeiroFator();
  const { data } = await supabase.auth.mfa.listFactors();
  const configurado = Boolean(data?.totp?.some((f) => f.status === "verified"));
  return <FormMfa configurado={configurado} />;
}

export default function MfaPage() {
  return (
    <>
      <h1 className="mt-2 text-center text-3xl uppercase">Verificação em duas etapas</h1>
      <Suspense fallback={<p className="mt-8 text-center text-cinza">Carregando…</p>}>
        <Conteudo />
      </Suspense>
      <form action={sair} className="mt-6 text-center">
        <button className="text-sm text-cinza underline underline-offset-4 hover:text-ouro">Sair</button>
      </form>
    </>
  );
}
