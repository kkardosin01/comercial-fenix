import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { JwtPayload } from "@supabase/supabase-js";
import { supabaseServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { supabaseServico } from "@/lib/supabase/service";

// Sessão administrativa expira 8h após a verificação do 2FA, mesmo que o token seja renovado.
export const DURACAO_SESSAO_SEG = 8 * 60 * 60;

const ehAdmin = (c: JwtPayload) => c.app_metadata?.role === "admin";

function momentoMfa(c: JwtPayload) {
  const amr = (c.amr ?? []) as unknown[];
  const ts = amr
    .map((e) => (typeof e === "object" && e && "timestamp" in e ? Number((e as { timestamp: number }).timestamp) : 0))
    .filter(Boolean);
  return ts.length ? Math.max(...ts) : 0;
}

/** Garante usuário admin com 2FA (aal2) e sessão dentro do prazo. Use em toda página/ação do painel. */
export async function exigirAdmin() {
  await connection(); // sempre por requisição, nunca pré-renderizado
  if (!supabaseConfigurado()) redirect("/admin/login?erro=config");
  const supabase = await supabaseServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/admin/login");
  if (!ehAdmin(claims)) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }
  if (claims.aal !== "aal2") redirect("/admin/mfa");
  const t = momentoMfa(claims);
  if (!t || Date.now() / 1000 - t > DURACAO_SESSAO_SEG) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=expirada");
  }
  return { supabase, claims };
}

/** Para a etapa de 2FA: exige login (aal1) de um admin. */
export async function exigirPrimeiroFator() {
  await connection();
  if (!supabaseConfigurado()) redirect("/admin/login?erro=config");
  const supabase = await supabaseServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims || !ehAdmin(claims)) redirect("/admin/login");
  return { supabase, claims };
}

/** Grava evento de segurança (login, falha, logout) no log de auditoria. */
export async function auditar(acao: string, dados: { userId?: string | null; email?: string | null; detalhes?: Record<string, unknown> }) {
  const db = supabaseServico();
  if (!db) return;
  const { error } = await db.from("admin_audit_log").insert({
    acao,
    user_id: dados.userId ?? null,
    user_email: dados.email ?? null,
    detalhes: dados.detalhes ?? null,
  });
  if (error) console.error("[auditoria]", error.message);
}
