import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { montarCsp } from "./lib/seguranca/csp";

// Proxy roda só no /admin: gera nonce para a CSP estrita e renova a sessão do Supabase.
// A autorização de verdade acontece no servidor (exigirAdmin) e no banco (RLS).
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = montarCsp({ nonce });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (lista) => {
          for (const { name, value } of lista) request.cookies.set(name, value);
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of lista) {
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
            });
          }
        },
      },
    });
    const { data } = await supabase.auth.getClaims();
    const publica = request.nextUrl.pathname === "/admin/login";
    if (!data?.claims && !publica) {
      const destino = request.nextUrl.clone();
      destino.pathname = "/admin/login";
      destino.search = "";
      response = NextResponse.redirect(destino);
    }
  }

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
