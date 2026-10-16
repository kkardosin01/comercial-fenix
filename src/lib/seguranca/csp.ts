// Content-Security-Policy compartilhada entre next.config (páginas públicas) e proxy (painel /admin).
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
  } catch {
    return "";
  }
})();
const dev = process.env.NODE_ENV !== "production";

type Opcoes = { painel?: boolean };

export function montarCsp({ painel = false }: Opcoes = {}) {
  // Com Cache Components, até o /admin tem um "shell" pré-renderizado sem nonce por requisição,
  // então os scripts inline do Next exigem 'unsafe-inline' (CSP com nonce bloquearia a hidratação).
  // O painel só carrega scripts do próprio domínio e não permite iframes.
  const script = painel ? `'self' 'unsafe-inline'` : `'self' 'unsafe-inline' https://challenges.cloudflare.com`;
  const diretivas: Record<string, string> = {
    "default-src": "'self'",
    "script-src": `${script}${dev ? " 'unsafe-eval'" : ""}`,
    "style-src": "'self' 'unsafe-inline'",
    "img-src": `'self' data: blob: ${supabaseHost}`.trim(),
    "font-src": "'self'",
    "connect-src": `'self' ${supabaseHost} https://challenges.cloudflare.com${dev ? " ws: wss:" : ""}`.trim(),
    "frame-src": painel ? "'none'" : "https://www.google.com https://challenges.cloudflare.com",
    "frame-ancestors": "'none'",
    "form-action": "'self'",
    "base-uri": "'self'",
    "object-src": "'none'",
    "manifest-src": "'self'",
    "worker-src": "'self' blob:",
  };
  const csp = Object.entries(diretivas)
    .map(([k, v]) => `${k} ${v}`)
    .join("; ");
  return dev ? csp : `${csp}; upgrade-insecure-requests`;
}

export const CABECALHOS_SEGURANCA = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];
