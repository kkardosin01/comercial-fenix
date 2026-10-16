import Link from "next/link";
import { exigirAdmin } from "@/lib/admin/auth";
import { LEAD_STATUS, type Lead, type LeadStatus } from "@/lib/types";

export const metadata = { title: "Visão geral" };

export default async function Dashboard() {
  const { supabase } = await exigirAdmin();
  const [{ data: leads }, contagens] = await Promise.all([
    supabase.from("leads").select("id, created_at, nome, instituicao, area, status").order("created_at", { ascending: false }).limit(8),
    Promise.all(
      (Object.keys(LEAD_STATUS) as LeadStatus[]).map(async (s) => {
        const { count } = await supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", s);
        return [s, count ?? 0] as const;
      }),
    ),
  ]);

  return (
    <div>
      <h1 className="text-4xl uppercase">Visão geral</h1>
      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {contagens.map(([s, n]) => (
          <Link key={s} href={`/admin/leads?status=${s}`} className="rounded-2xl border border-white/10 bg-carvao p-5 hover:border-ouro/50">
            <dt className="text-sm text-cinza">{LEAD_STATUS[s]}</dt>
            <dd className="mt-1 font-display text-4xl text-ouro">{n}</dd>
          </Link>
        ))}
      </dl>
      <h2 className="mt-12 text-2xl uppercase">Leads recentes</h2>
      <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-carvao">
        {((leads ?? []) as Pick<Lead, "id" | "created_at" | "nome" | "instituicao" | "area" | "status">[]).map((l) => (
          <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span>
              <strong>{l.nome}</strong> · {l.instituicao}
              <span className="block text-cinza">{l.area ?? "—"}</span>
            </span>
            <span className="text-cinza">
              {new Date(l.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} · {LEAD_STATUS[l.status]}
            </span>
          </li>
        ))}
        {!leads?.length && <li className="p-4 text-sm text-cinza">Nenhum lead ainda.</li>}
      </ul>
    </div>
  );
}
