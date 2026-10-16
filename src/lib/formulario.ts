import "server-only";

/**
 * O formulário de orçamento só aparece quando os serviços de que depende estão configurados.
 * Em produção, sem banco (Supabase) ou sem anti-robô (Turnstile), o envio seria recusado,
 * então a página de contato mostra os canais diretos (WhatsApp, telefone, e-mail) no lugar.
 */
export function formularioDisponivel() {
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.TURNSTILE_SECRET_KEY,
  );
}
