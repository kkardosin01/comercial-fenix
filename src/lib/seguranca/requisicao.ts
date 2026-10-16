import "server-only";
import { headers } from "next/headers";

/** IP do cliente (Vercel define x-forwarded-for / x-real-ip). */
export async function ipDoCliente() {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconhecido"
  ).slice(0, 64);
}

/**
 * Defesa extra contra CSRF: exige o cabeçalho Origin igual ao host atual.
 * (O Next já compara Origin/Host em Server Actions, mas aceita requisições sem Origin.)
 */
export async function origemValida() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Rejeita payloads acima do limite informado (bytes), com base no Content-Length. */
export async function tamanhoPermitido(maxBytes: number) {
  const len = Number((await headers()).get("content-length") ?? "0");
  return Number.isFinite(len) && len <= maxBytes;
}
