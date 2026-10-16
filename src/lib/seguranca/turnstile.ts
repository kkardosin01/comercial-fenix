import "server-only";

/** Valida o token do Cloudflare Turnstile no servidor. */
export async function validarTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[turnstile] TURNSTILE_SECRET_KEY ausente em produção — envio bloqueado.");
      return false;
    }
    return true; // desenvolvimento sem chave
  }
  if (!token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "desconhecido") body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await r.json()) as { success: boolean };
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] falha na verificação", e);
    return false;
  }
}
