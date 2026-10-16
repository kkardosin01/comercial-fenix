import { TextReveal } from "./TextReveal";
import type { CSSProperties } from "react";

// Cabeçalho das páginas internas (h1 animado via CSS para não atrasar o LCP).
export function CabecalhoPagina({ eyebrow, titulo, destaque, texto }: { eyebrow: string; titulo: string; destaque?: string[]; texto?: string }) {
  return (
    <section className="grao relative isolate overflow-hidden pt-40 pb-16 md:pt-48 md:pb-24">
      <div
        aria-hidden
        className="absolute -top-40 right-0 -z-10 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(205,163,92,0.14),transparent_65%)]"
      />
      <div className="container-site">
        <p className="eyebrow surge mb-5">{eyebrow}</p>
        <TextReveal
          as="h1"
          imediato
          delay={0.1}
          texto={titulo}
          destaque={destaque}
          className="max-w-5xl text-5xl leading-[0.98] font-medium uppercase md:text-7xl lg:text-8xl"
        />
        {texto && (
          <p className="surge mt-8 max-w-2xl text-lg leading-relaxed text-cinza md:text-xl" style={{ "--atraso": "0.5s" } as CSSProperties}>
            {texto}
          </p>
        )}
      </div>
    </section>
  );
}
