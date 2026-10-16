import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Produto } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { CartaoLuz } from "@/components/ui/CartaoLuz";
import { IlustracaoCartucho } from "@/components/ilustracoes/Cartucho";
import { IlustracaoAnalisador } from "@/components/ilustracoes/Analisador";

export function SeloSobConsulta() {
  return (
    <span className="inline-flex items-center rounded-full border border-ouro/50 bg-ouro/10 px-3 py-1 text-xs font-semibold tracking-wider text-ouro-claro uppercase">
      Sob consulta
    </span>
  );
}

export function CardsProdutos({ produtos, nivel = "h3" }: { produtos: Produto[]; nivel?: "h2" | "h3" }) {
  const Titulo = nivel;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08} className={p.tipo === "analisador" ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
          <CartaoLuz className="h-full">
            <Link href={`/produtos/${p.slug}`} className="flex h-full flex-col p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs tracking-[0.25em] text-cinza uppercase">
                  {p.tipo === "analisador" ? "Analisador" : "Cartucho"}
                </span>
                {p.sob_consulta && <SeloSobConsulta />}
              </div>
              <div className={`my-8 flex flex-1 items-center justify-center ${p.tipo === "analisador" ? "min-h-64" : "min-h-36"}`}>
                {p.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imagem_url} alt="" loading="lazy" className="max-h-64 w-auto object-contain" />
                ) : p.tipo === "analisador" ? (
                  <IlustracaoAnalisador className="h-64 w-auto transition-transform duration-700 ease-(--ease-premium) group-hover:-translate-y-2 group-hover:rotate-[-3deg]" />
                ) : (
                  <IlustracaoCartucho rotulo={p.nome} className="h-36 w-auto transition-transform duration-700 ease-(--ease-premium) group-hover:-translate-y-2 group-hover:rotate-[4deg]" />
                )}
              </div>
              <Titulo className="text-3xl uppercase">{p.nome}</Titulo>
              <p className="mt-2 leading-relaxed text-cinza">{p.resumo}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ouro">
                Ver detalhes
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </Link>
          </CartaoLuz>
        </Reveal>
      ))}
    </ul>
  );
}
