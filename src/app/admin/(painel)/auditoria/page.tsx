import { exigirAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Auditoria" };

type Linha = { id: number; created_at: string; user_email: string | null; acao: string; tabela: string | null; registro: string | null };

export default async function AuditoriaPage() {
  const { supabase } = await exigirAdmin();
  const { data } = await supabase
    .from("admin_audit_log")
    .select("id, created_at, user_email, acao, tabela, registro")
    .order("created_at", { ascending: false })
    .limit(300);
  return (
    <div>
      <h1 className="text-4xl uppercase">Auditoria</h1>
      <p className="mt-2 text-sm text-cinza">Últimos 300 eventos (logins, alterações de conteúdo e leads, exportações).</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-carvao text-cinza">
            <tr><th className="p-3">Quando</th><th className="p-3">Usuário</th><th className="p-3">Ação</th><th className="p-3">Tabela</th><th className="p-3">Registro</th></tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {((data ?? []) as Linha[]).map((l) => (
              <tr key={l.id}>
                <td className="p-3 whitespace-nowrap">{new Date(l.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</td>
                <td className="p-3">{l.user_email ?? "—"}</td>
                <td className="p-3">{l.acao}</td>
                <td className="p-3">{l.tabela ?? "—"}</td>
                <td className="max-w-[200px] truncate p-3">{l.registro ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
