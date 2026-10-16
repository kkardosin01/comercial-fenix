import type { MetadataRoute } from "next";
import { getProdutos } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produtos = await getProdutos();
  const estaticas: [string, number][] = [
    ["", 1],
    ["/produtos", 0.9],
    ["/areas-de-atuacao", 0.9],
    ["/clientes", 0.7],
    ["/sobre", 0.6],
    ["/contato", 0.8],
    ["/politica-de-privacidade", 0.2],
    ["/termos-de-uso", 0.2],
  ];
  return [
    ...estaticas.map(([p, priority]) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority })),
    ...produtos.map((p) => ({ url: `${SITE.url}/produtos/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
