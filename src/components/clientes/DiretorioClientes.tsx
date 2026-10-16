"use client";
import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { AnimatePresence, m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { SEGMENTOS, SEGMENTO_KEYS, type Cliente, type Segmento } from "@/lib/types";

type Props = { clientes: Cliente[]; comFiltro?: boolean; abertoInicial?: boolean };

export function DiretorioClientes({ clientes, comFiltro, abertoInicial }: Props) {
  const [filtro, setFiltro] = useState<Segmento | "todos">("todos");
  const grupos = SEGMENTO_KEYS.map((s) => ({
    segmento: s,
    itens: clientes.filter((c) => c.segmento === s).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
  })).filter((g) => g.itens.length > 0 && (filtro === "todos" || g.segmento === filtro));

  const lista = (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {grupos.map((g) => (
          <m.section
            key={g.segmento}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-label={SEGMENTOS[g.segmento]}
          >
            <h3 className="flex items-baseline justify-between border-b border-white/10 pb-3 text-xl uppercase">
              {SEGMENTOS[g.segmento]}
              <span className="font-sans text-sm text-cinza">{g.itens.length}</span>
            </h3>
            <ul className="mt-4 space-y-3">
              {g.itens.map((c) => (
                <li key={c.id} className="text-creme/90">
                  {c.nome}
                  {(c.unidades || c.cidade) && (
                    <span className="mt-0.5 block text-sm text-cinza">
                      {c.unidades ?? [c.cidade, c.uf].filter(Boolean).join("/")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </m.section>
        ))}
      </AnimatePresence>
    </div>
  );

  const filtros = comFiltro && (
    <div role="group" aria-label="Filtrar por segmento" className="mb-10 flex flex-wrap gap-2">
      {(["todos", ...SEGMENTO_KEYS] as const).map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={filtro === s}
          onClick={() => setFiltro(s)}
          className={clsx(
            "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
            filtro === s ? "border-ouro bg-ouro text-ink" : "border-white/10 text-creme/85 hover:border-ouro/60",
          )}
        >
          {s === "todos" ? "Todos" : SEGMENTOS[s]}
        </button>
      ))}
    </div>
  );

  if (abertoInicial) {
    return (
      <div>
        {filtros}
        {lista}
      </div>
    );
  }

  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="mais" className="rounded-3xl border border-white/[0.07] bg-carvao">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 p-7 text-left md:p-8">
            <span className="font-display text-2xl uppercase md:text-3xl">Mais instituições atendidas</span>
            <span className="flex size-11 items-center justify-center rounded-full border border-ouro/40 transition-transform duration-500 group-data-[state=open]:rotate-180">
              <ChevronDown className="size-5 text-ouro" aria-hidden />
            </span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden px-7 pb-8 md:px-8">
          {filtros}
          {lista}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
