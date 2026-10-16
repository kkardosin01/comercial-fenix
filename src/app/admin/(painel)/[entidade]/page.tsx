import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/admin/auth";
import { ENTIDADES } from "@/lib/admin/entidades";
import { Aviso } from "@/components/admin/Aviso";
import { SEGMENTOS } from "@/lib/types";

const fmt = (v: unknown) =>
  typeof v === "boolean" ? (v ? "Sim" : "Não") : v == null ? "—" : String(SEGMENTOS[v as keyof typeof SEGMENTOS] ?? v);

export default async function ListaEntidade({ params, searchParams }: PageProps<"/admin/[entidade]">) {
  const { entidade } = await params;
  const ent = ENTIDADES[entidade];
  if (!ent) notFound();
  const { supabase } = await exigirAdmin();
  const { ok } = await searchParams;
  const { data } = await supabase.from(ent.tabela).select("*").order("ordem").order(ent.colunasLista[0]);
  const linhas = (data ?? []) as Record<string, unknown>[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl uppercase">{ent.titulo}</h1>
        <Link href={`/admin/${entidade}/novo`} className="rounded-full bg-ouro px-5 py-2.5 text-sm font-semibold text-ink">
          + Novo {ent.singular}
        </Link>
      </div>
      <div className="mt-6">
        <Aviso ok={ok} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-carvao text-cinza">
            <tr>
              {ent.colunasLista.map((c) => (
                <th key={c} className="p-3 capitalize">{c.replace("_", " ")}</th>
              ))}
              <th className="p-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {linhas.map((l) => (
              <tr key={String(l[ent.chave])} className="hover:bg-white/[0.02]">
                {ent.colunasLista.map((c) => (
                  <td key={c} className="p-3">{fmt(l[c])}</td>
                ))}
                <td className="p-3 text-right">
                  <Link href={`/admin/${entidade}/${encodeURIComponent(String(l[ent.chave]))}`} className="text-ouro underline underline-offset-4">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr><td className="p-4 text-cinza" colSpan={ent.colunasLista.length + 1}>Nenhum registro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
