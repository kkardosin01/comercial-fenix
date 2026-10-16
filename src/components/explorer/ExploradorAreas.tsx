"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, Building2, Check, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { IconeArea } from "./icones";
import { AVISO_INFORMATIVO } from "@/lib/site";
import type { Area, Segmento } from "@/lib/types";

export type ProdutoResumo = { slug: string; nome: string; resumo: string; sob_consulta: boolean };
export type ClienteResumo = { nome: string; segmento: Segmento; segmentos_relacionados: Segmento[] };

type Props = {
  areas: Area[];
  produtos: ProdutoResumo[];
  clientes: ClienteResumo[];
  modo?: "completo" | "previa";
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ExploradorAreas({ areas, produtos, clientes, modo = "completo" }: Props) {
  const [ativa, setAtiva] = useState(areas[0]?.slug);
  const painelId = useId();

  // Na página completa, a área selecionada fica na URL (?area=) para ser compartilhável.
  useEffect(() => {
    if (modo !== "completo") return;
    const inicial = new URLSearchParams(window.location.search).get("area");
    // Lido após a hidratação (a página é pré-renderizada sem a query string).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (inicial && areas.some((a) => a.slug === inicial)) setAtiva(inicial);
  }, [modo, areas]);

  const selecionar = (slug: string) => {
    setAtiva(slug);
    if (modo === "completo") {
      const url = new URL(window.location.href);
      url.searchParams.set("area", slug);
      window.history.replaceState(null, "", url);
    }
  };

  const area = areas.find((a) => a.slug === ativa) ?? areas[0];
  if (!area) return null;

  const mapaProdutos = new Map(produtos.map((p) => [p.slug, p]));
  const cartuchos = area.cartuchos.map((s) => mapaProdutos.get(s)).filter((p): p is ProdutoResumo => Boolean(p));
  const clientesArea = clientes
    .filter((c) => area.segmentos_clientes.some((s) => s === c.segmento || c.segmentos_relacionados.includes(s)))
    .slice(0, 12);

  return (
    <div>
        <div
          role="tablist"
          aria-label="Escolha a sua área de atuação"
          className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-3 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          {areas.map((a) => {
            const sel = a.slug === area.slug;
            return (
              <button
                key={a.slug}
                role="tab"
                type="button"
                id={`${painelId}-tab-${a.slug}`}
                aria-selected={sel}
                aria-controls={`${painelId}-painel`}
                onClick={() => selecionar(a.slug)}
                className={clsx(
                  "relative flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                  sel ? "border-transparent text-ink" : "border-white/10 text-creme/85 hover:border-ouro/50 hover:text-creme",
                )}
              >
                <span
                  aria-hidden
                  className={clsx(
                    "absolute inset-0 rounded-full bg-ouro transition-all duration-300 ease-(--ease-premium)",
                    sel ? "scale-100 opacity-100" : "scale-90 opacity-0",
                  )}
                />
                <IconeArea nome={a.icone} className="relative size-4" aria-hidden />
                <span className="relative whitespace-nowrap">{a.nome}</span>
              </button>
            );
          })}
        </div>

      <div
        id={`${painelId}-painel`}
        role="tabpanel"
        aria-labelledby={`${painelId}-tab-${area.slug}`}
        aria-live="polite"
        className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-carvao"
      >
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-ouro/10 blur-[120px]" />
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={area.slug}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease }}
            className="relative grid gap-10 p-7 md:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16"
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-ouro/15">
                  <IconeArea nome={area.icone} className="size-7 text-ouro" aria-hidden strokeWidth={1.5} />
                </span>
                <p className="eyebrow">Área selecionada</p>
              </div>
              <h3 className="mt-6 text-4xl leading-none uppercase md:text-5xl">{area.nome}</h3>
              <p className="mt-4 text-lg text-cinza">{area.resumo}</p>

              <h4 className="mt-10 text-sm font-semibold tracking-[0.2em] text-ouro uppercase">
                Onde o i-STAT entra na rotina
              </h4>
              <ul className="mt-4 space-y-3">
                {area.cenarios.map((c, i) => (
                  <m.li
                    key={c}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease }}
                    className="flex gap-3 leading-relaxed text-creme/90"
                  >
                    <span className="mt-2.5 h-px w-5 shrink-0 bg-ouro" aria-hidden />
                    {c}
                  </m.li>
                ))}
              </ul>

              <h4 className="mt-10 text-sm font-semibold tracking-[0.2em] text-ouro uppercase">Benefícios práticos</h4>
              <ul className="mt-4 space-y-2.5">
                {area.beneficios.map((b) => (
                  <li key={b} className="flex gap-3 text-creme/85">
                    <Check className="mt-1 size-4 shrink-0 text-ouro" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h4 className="text-sm font-semibold tracking-[0.2em] text-ouro uppercase">Cartuchos recomendados</h4>
                <ul className="mt-4 grid gap-3">
                  {cartuchos.map((p, i) => (
                    <m.li
                      key={p.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
                    >
                      <Link
                        href={`/produtos/${p.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-ink/60 px-5 py-4 transition-colors hover:border-ouro/50"
                      >
                        <span>
                          <span className="flex items-center gap-2 font-display text-2xl uppercase">
                            {p.nome}
                            {p.sob_consulta && (
                              <span className="rounded-full border border-ouro/50 px-2 py-0.5 font-sans text-[0.65rem] tracking-wider text-ouro-claro">
                                SOB CONSULTA
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-sm text-cinza">{p.resumo}</span>
                        </span>
                        <ArrowUpRight
                          className="size-5 shrink-0 text-ouro transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </Link>
                    </m.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold tracking-[0.2em] text-ouro uppercase">
                  Quem já atendemos neste segmento
                </h4>
                {clientesArea.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {clientesArea.map((c) => (
                      <li
                        key={c.nome}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-creme/85"
                      >
                        <Building2 className="size-3.5 text-ouro/80" aria-hidden />
                        {c.nome}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-sm text-cinza">
                    <Sparkles className="size-4 text-ouro" aria-hidden />
                    Fale com a gente para montar a solução ideal para a sua equipe.
                  </p>
                )}
              </div>

              <Link
                href={`/contato?area=${encodeURIComponent(area.slug)}#orcamento`}
                className="group mt-auto inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ouro px-6 py-4 text-center font-semibold text-ink transition-colors hover:bg-ouro-claro"
              >
                Quero uma proposta para {area.nome}
                <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 text-sm text-cinza">{AVISO_INFORMATIVO}</p>
    </div>
  );
}
