import type { Cliente, Produto } from "./types";
import type { ClienteResumo, ProdutoResumo } from "@/components/explorer/ExploradorAreas";

// Reduz o payload enviado ao componente cliente do explorador.
export const resumoProdutos = (ps: Produto[]): ProdutoResumo[] =>
  ps.map(({ slug, nome, resumo, sob_consulta }) => ({ slug, nome, resumo, sob_consulta }));
export const resumoClientes = (cs: Cliente[]): ClienteResumo[] =>
  cs.map(({ nome, segmento, segmentos_relacionados }) => ({ nome, segmento, segmentos_relacionados }));
