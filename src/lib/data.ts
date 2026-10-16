import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AREAS_SEED, CLIENTES_SEED, PRODUTOS_SEED } from "./content/seed";
import { supabaseConfigurado } from "./supabase/env";
import { supabasePublico } from "./supabase/public";
import type { Area, Cliente, Depoimento, Produto } from "./types";

// Tag única para todo o conteúdo público: o painel admin a invalida a cada alteração.
export const TAG_CONTEUDO = "conteudo";

async function ler<T>(tabela: string, fallback: T[]): Promise<T[]> {
  if (!supabaseConfigurado()) return fallback;
  const { data, error } = await supabasePublico()
    .from(tabela)
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  if (error) {
    console.error(`[data] falha ao ler ${tabela}:`, error.message);
    return fallback;
  }
  return (data ?? []) as T[];
}

export async function getProdutos(): Promise<Produto[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_CONTEUDO);
  return ler<Produto>("produtos", PRODUTOS_SEED);
}

export async function getProduto(slug: string): Promise<Produto | undefined> {
  return (await getProdutos()).find((p) => p.slug === slug);
}

export async function getAreas(): Promise<Area[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_CONTEUDO);
  return ler<Area>("areas", AREAS_SEED);
}

export async function getClientes(): Promise<Cliente[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_CONTEUDO);
  return ler<Cliente>("clientes", CLIENTES_SEED);
}

export async function getDepoimentos(): Promise<Depoimento[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAG_CONTEUDO);
  // Nunca há depoimentos de exemplo: só os cadastrados no painel.
  return ler<Depoimento>("depoimentos", []);
}
