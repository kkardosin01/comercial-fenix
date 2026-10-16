import { exigirAdmin, auditar } from "@/lib/admin/auth";
import { LEAD_STATUS, type Lead } from "@/lib/types";

// Neutraliza injeção de fórmulas em planilhas (=, +, -, @) e escapa aspas.
const celula = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  const { supabase, claims } = await exigirAdmin();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5000);
  if (status && status in LEAD_STATUS) q = q.eq("status", status);
  const de = url.searchParams.get("de");
  const ate = url.searchParams.get("ate");
  if (de && /^\d{4}-\d{2}-\d{2}$/.test(de)) q = q.gte("created_at", `${de}T00:00:00-03:00`);
  if (ate && /^\d{4}-\d{2}-\d{2}$/.test(ate)) q = q.lte("created_at", `${ate}T23:59:59-03:00`);
  const { data, error } = await q;
  if (error) return new Response("Erro ao exportar", { status: 500 });

  const cols: (keyof Lead)[] = ["created_at", "nome", "instituicao", "cargo", "email", "telefone", "area", "produtos", "cidade", "uf", "mensagem", "status", "notas"];
  const linhas = [cols.join(";"), ...((data ?? []) as Lead[]).map((l) => cols.map((c) => celula(l[c])).join(";"))];
  await auditar("exportar_leads", { userId: claims.sub, email: claims.email, detalhes: { total: data?.length ?? 0 } });

  return new Response("﻿" + linhas.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-comercial-fenix.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
