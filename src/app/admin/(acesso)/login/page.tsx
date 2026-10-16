import { Suspense } from "react";
import { FormLogin } from "@/components/admin/FormLogin";

export const metadata = { title: "Entrar" };

const AVISOS: Record<string, string> = {
  expirada: "Sua sessão expirou. Entre novamente.",
  config: "Supabase não configurado. Defina as variáveis de ambiente (veja o README).",
};

async function Aviso({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { erro } = await searchParams;
  return <FormLogin aviso={typeof erro === "string" ? AVISOS[erro] : undefined} />;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <>
      <h1 className="mt-2 text-center text-3xl uppercase">Entrar</h1>
      <Suspense fallback={<FormLogin />}>
        <Aviso searchParams={searchParams} />
      </Suspense>
    </>
  );
}
