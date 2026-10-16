import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-5xl uppercase">Página não encontrada</h1>
      <Link href="/" className="rounded-full bg-ouro px-6 py-3 font-semibold text-ink">
        Voltar ao início
      </Link>
    </main>
  );
}
