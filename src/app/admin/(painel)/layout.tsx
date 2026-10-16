import Link from "next/link";
import { Suspense } from "react";
import { exigirAdmin } from "@/lib/admin/auth";
import { sair } from "@/actions/admin/auth";
import { ENTIDADES } from "@/lib/admin/entidades";

const LINKS = [
  { href: "/admin", rotulo: "Visão geral" },
  { href: "/admin/leads", rotulo: "Leads" },
  ...Object.entries(ENTIDADES).map(([k, e]) => ({ href: `/admin/${k}`, rotulo: e.titulo })),
  { href: "/admin/auditoria", rotulo: "Auditoria" },
];

async function Sessao() {
  const { claims } = await exigirAdmin();
  return <span className="truncate text-xs text-cinza">{claims.email}</span>;
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:grid md:min-h-svh md:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 bg-carvao p-5 md:border-r md:border-b-0">
        <Link href="/admin" className="font-display text-xl text-ouro uppercase">
          Comercial Fênix
        </Link>
        <nav aria-label="Painel" className="mt-6">
          <ul className="flex flex-wrap gap-1 md:flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5 hover:text-ouro">
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4">
          <Suspense fallback={null}>
            <Sessao />
          </Suspense>
          <form action={sair}>
            <button className="text-sm text-cinza hover:text-ouro">Sair</button>
          </form>
          <Link href="/" className="text-sm text-cinza hover:text-ouro">
            Ver site ↗
          </Link>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">
        <Suspense fallback={<p className="text-cinza">Carregando…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}
