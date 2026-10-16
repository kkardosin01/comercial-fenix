"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseServidor } from "@/lib/supabase/server";
import { auditar, exigirPrimeiroFator } from "@/lib/admin/auth";
import { contarFalha, dentroDoLimite, falhas, limparFalhas } from "@/lib/seguranca/limite";
import { ipDoCliente, origemValida } from "@/lib/seguranca/requisicao";

export type EstadoForm = { erro?: string; qr?: string; segredo?: string; factorId?: string };

const MAX_FALHAS = 5;
const MSG_LOGIN = "E-mail ou senha inválidos.";
const MSG_BLOQUEIO = "Muitas tentativas. Acesso bloqueado temporariamente — tente novamente em 15 minutos.";

const loginSchema = z.object({
  email: z.email().max(160).transform((v) => v.trim().toLowerCase()),
  senha: z.string().min(1).max(200),
});

export async function entrar(_: EstadoForm, form: FormData): Promise<EstadoForm> {
  if (!(await origemValida())) return { erro: MSG_LOGIN };
  const ip = await ipDoCliente();
  if (!(await dentroDoLimite("login-ip", ip, 20, "15 m"))) return { erro: MSG_BLOQUEIO };

  const parsed = loginSchema.safeParse({ email: form.get("email"), senha: form.get("senha") });
  if (!parsed.success) return { erro: MSG_LOGIN };
  const { email, senha } = parsed.data;

  // Bloqueio por conta e por IP após falhas consecutivas (mensagem idêntica para qualquer e-mail).
  if ((await falhas("login", email)) >= MAX_FALHAS || (await falhas("login-ip", ip)) >= MAX_FALHAS * 3) {
    return { erro: MSG_BLOQUEIO };
  }

  const supabase = await supabaseServidor();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  const ehAdmin = data?.user?.app_metadata?.role === "admin";

  if (error || !data.user || !ehAdmin) {
    if (data?.user && !ehAdmin) await supabase.auth.signOut();
    await Promise.all([contarFalha("login", email), contarFalha("login-ip", ip)]);
    await auditar("login_falha", { email, detalhes: { ip } });
    // Pequeno atraso uniforme dificulta enumeração por tempo de resposta.
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
    return { erro: MSG_LOGIN };
  }

  await limparFalhas("login", email);
  await auditar("login_senha", { userId: data.user.id, email, detalhes: { ip } });
  redirect("/admin/mfa");
}

const codigoSchema = z.string().regex(/^\d{6}$/, "Informe o código de 6 dígitos.");

/** Inicia o cadastro do aplicativo autenticador (TOTP). */
export async function iniciarCadastro2fa(): Promise<EstadoForm> {
  if (!(await origemValida())) return { erro: "Requisição inválida." };
  const { supabase } = await exigirPrimeiroFator();
  const { data: fatores } = await supabase.auth.mfa.listFactors();
  if (fatores?.totp?.some((f) => f.status === "verified")) return { erro: "O 2FA já está configurado." };
  // Remove cadastros iniciados e não concluídos
  for (const f of fatores?.all ?? []) {
    if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Autenticador" });
  if (error || !data) return { erro: "Não foi possível iniciar o 2FA. Tente novamente." };
  return { qr: data.totp.qr_code, segredo: data.totp.secret, factorId: data.id };
}

export async function verificar2fa(estado: EstadoForm, form: FormData): Promise<EstadoForm> {
  if (!(await origemValida())) return { ...estado, erro: "Requisição inválida." };
  const { supabase, claims } = await exigirPrimeiroFator();

  if ((await falhas("mfa", claims.sub)) >= MAX_FALHAS) {
    await supabase.auth.signOut();
    return { erro: MSG_BLOQUEIO };
  }
  const codigo = codigoSchema.safeParse(String(form.get("codigo") ?? "").replace(/\s/g, ""));
  if (!codigo.success) return { ...estado, erro: "Informe o código de 6 dígitos." };

  const { data: fatores } = await supabase.auth.mfa.listFactors();
  const factorId =
    fatores?.totp?.find((f) => f.status === "verified")?.id ??
    (typeof form.get("factorId") === "string" ? String(form.get("factorId")) : undefined);
  if (!factorId) return { erro: "Configure o aplicativo autenticador primeiro." };

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: codigo.data });
  if (error) {
    await contarFalha("mfa", claims.sub);
    await auditar("mfa_falha", { userId: claims.sub, email: claims.email });
    return { ...estado, erro: "Código inválido ou expirado." };
  }
  await limparFalhas("mfa", claims.sub);
  await auditar("login_2fa", { userId: claims.sub, email: claims.email, detalhes: { ip: await ipDoCliente() } });
  redirect("/admin");
}

export async function sair() {
  const supabase = await supabaseServidor();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) await auditar("logout", { userId: data.claims.sub, email: data.claims.email });
  await supabase.auth.signOut();
  redirect("/admin/login");
}
