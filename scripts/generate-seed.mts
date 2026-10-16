// Gera supabase/seed.sql a partir de src/lib/content/seed.ts.
// Uso: npm run db:seed:generate
import { writeFileSync } from "node:fs";
import { AREAS_SEED, CLIENTES_SEED, PRODUTOS_SEED } from "../src/lib/content/seed.ts";

const q = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.length ? `array[${v.map(q).join(", ")}]::text[]` : "'{}'::text[]";
  return `'${String(v).replace(/'/g, "''")}'`;
};

const insert = (tabela: string, linhas: Record<string, unknown>[], conflito: string) => {
  const cols = Object.keys(linhas[0]);
  const values = linhas.map((l) => `  (${cols.map((c) => q(l[c])).join(", ")})`).join(",\n");
  return `insert into public.${tabela} (${cols.join(", ")}) values\n${values}\non conflict ${conflito} do nothing;\n`;
};

const clientes = CLIENTES_SEED.map((c) => Object.fromEntries(Object.entries(c).filter(([k]) => k !== "id")));

const sql = [
  "-- Gerado por scripts/generate-seed.mts — não editar à mão.",
  insert("produtos", PRODUTOS_SEED, "(slug)"),
  insert("areas", AREAS_SEED, "(slug)"),
  // Clientes não têm chave natural: só insere se a tabela estiver vazia.
  `do $$ begin if not exists (select 1 from public.clientes) then\n${insert("clientes", clientes, "").replace(/\non conflict  do nothing;\n/, ";\n")}end if; end $$;\n`,
].join("\n");

writeFileSync("supabase/seed.sql", sql);
console.log("supabase/seed.sql gerado");
