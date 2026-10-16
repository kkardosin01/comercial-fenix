import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

// Opções reforçadas para os cookies de sessão do painel: o admin é todo
// renderizado no servidor, então o JavaScript do navegador não precisa lê-los.
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function supabaseServidor() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookieOptions: ADMIN_COOKIE_OPTIONS,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) {
            store.set(name, value, { ...options, ...ADMIN_COOKIE_OPTIONS });
          }
        } catch {
          // Chamado durante a renderização de Server Component: o proxy renova a sessão.
        }
      },
    },
  });
}
