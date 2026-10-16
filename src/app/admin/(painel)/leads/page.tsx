import { exigirAdmin } from "@/lib/admin/auth";
import { atualizarLead, excluirLead } from "@/actions/admin/conteudo";
import { Aviso } from "@/components/admin/Aviso";
import { BotaoConfirmar } from "@/components/admin/BotaoConfirmar";
import { LEAD_STATUS, type Lead } from "@/lib/types";

export const metadata = { title: "Leads" };

const fmt = (d: string) => new Date(d).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const { supabase } = await exigirAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && sp.status in LEAD_STATUS ? sp.status : "";
  const busca = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const de = typeof sp.de === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.de) ? sp.de : "";
  const ate = typeof sp.ate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.ate) ? sp.ate : "";

  let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(300);
  if (status) q = q.eq("status", status);
  if (de) q = q.gte("created_at", `${de}T00:00:00-03:00`);
  if (ate) q = q.lte("created_at", `${ate}T23:59:59-03:00`);
  if (busca) {
    // Escapa curingas e caracteres de sintaxe do filtro do PostgREST
    const termo = busca.replace(/[%_\\,()."']/g, " ").trim();
    if (termo) q = q.or(`nome.ilike.%${termo}%,instituicao.ilike.%${termo}%,email.ilike.%${termo}%,area.ilike.%${termo}%`);
  }
  const { data, error } = await q;
  const leads = (data ?? []) as Lead[];
  const filtros = new URLSearchParams({ ...(status && { status }), ...(busca && { q: busca }), ...(de && { de }), ...(ate && { ate }) });
  const volta = `/admin/leads${filtros.size ? `?${filtros}` : ""}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl uppercase">Leads</h1>
        <a href={`/admin/leads/exportar?${filtros}`} className="rounded-full border border-ouro/60 px-5 py-2.5 text-sm font-semibold hover:bg-ouro/10">
          Exportar CSV
        </a>
      </div>
      <Aviso ok={sp.ok} />
      <form className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-carvao p-4 sm:grid-cols-2 lg:grid-cols-5" role="search">
        <input name="q" defaultValue={busca} placeholder="Buscar nome, instituição, e-mail, área" className="campo lg:col-span-2" aria-label="Buscar" />
        <select name="status" defaultValue={status} className="campo" aria-label="Status">
          <option value="">Todos os status</option>
          {Object.entries(LEAD_STATUS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <input type="date" name="de" defaultValue={de} className="campo" aria-label="De" />
        <input type="date" name="ate" defaultValue={ate} className="campo" aria-label="Até" />
        <button className="min-h-11 rounded-full bg-ouro px-5 text-sm font-semibold text-ink lg:col-start-5">Filtrar</button>
      </form>
      {error && <p className="mt-4 text-[#f3a397]">Erro ao carregar leads.</p>}
      <p className="mt-6 text-sm text-cinza">{leads.length} resultado(s)</p>
      <ul className="mt-3 space-y-3">
        {leads.map((l) => (
          <li key={l.id}>
            <details className="group rounded-2xl border border-white/10 bg-carvao open:border-ouro/40">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4">
                <span>
                  <strong>{l.nome}</strong> · {l.instituicao}
                  <span className="block text-sm text-cinza">{l.area ?? "Área não informada"} · {fmt(l.created_at)}</span>
                </span>
                <span className="rounded-full border border-ouro/40 px-3 py-1 text-xs text-ouro-claro">{LEAD_STATUS[l.status]}</span>
              </summary>
              <div className="grid gap-6 border-t border-white/10 p-4 lg:grid-cols-2">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                  <dt className="text-cinza">E-mail</dt><dd><a className="text-ouro" href={`mailto:${l.email}`}>{l.email}</a></dd>
                  <dt className="text-cinza">Telefone</dt><dd><a className="text-ouro" href={`https://wa.me/55${l.telefone.replace(/\D/g, "").replace(/^55/, "")}`} target="_blank" rel="noopener noreferrer">{l.telefone}</a></dd>
                  <dt className="text-cinza">Cargo</dt><dd>{l.cargo ?? "—"}</dd>
                  <dt className="text-cinza">Produtos</dt><dd>{l.produtos.join(", ") || "—"}</dd>
                  <dt className="text-cinza">Cidade/UF</dt><dd>{[l.cidade, l.uf].filter(Boolean).join("/") || "—"}</dd>
                  <dt className="text-cinza">Mensagem</dt><dd className="whitespace-pre-wrap">{l.mensagem ?? "—"}</dd>
                </dl>
                <div className="space-y-3">
                  <form action={atualizarLead.bind(null, l.id)} className="space-y-3">
                    <input type="hidden" name="volta" value={volta} />
                    <label className="block text-sm">
                      Status
                      <select name="status" defaultValue={l.status} className="campo mt-1">
                        {Object.entries(LEAD_STATUS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm">
                      Notas internas
                      <textarea name="notas" defaultValue={l.notas ?? ""} rows={3} maxLength={4000} className="campo mt-1" />
                    </label>
                    <button className="min-h-11 rounded-full bg-ouro px-5 text-sm font-semibold text-ink">Salvar</button>
                  </form>
                  <form action={excluirLead.bind(null, l.id)}>
                    <BotaoConfirmar
                      mensagem={`Excluir definitivamente o lead de ${l.nome}? Esta ação não pode ser desfeita.`}
                      className="text-sm text-[#f3a397] underline underline-offset-4"
                    >
                      Excluir definitivamente (pedido do titular / LGPD)
                    </BotaoConfirmar>
                  </form>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
