import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

// Cliente anônimo, sem cookies: usado nas leituras públicas cacheadas.
// O RLS só libera SELECT de registros ativos nas tabelas de conteúdo.
export function supabasePublico() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
