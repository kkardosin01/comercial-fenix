import { Quote } from "lucide-react";
import type { Depoimento } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

// Só renderiza se houver depoimentos reais cadastrados no painel.
export function Depoimentos({ itens }: { itens: Depoimento[] }) {
  if (itens.length === 0) return null;
  return (
    <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {itens.map((d, i) => (
        <Reveal as="li" key={d.id} delay={i * 0.08}>
          <figure className="h-full rounded-3xl border border-white/[0.07] bg-carvao p-8">
            <Quote className="size-8 text-ouro" aria-hidden />
            <blockquote className="mt-5 text-lg leading-relaxed text-creme/90">“{d.texto}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold text-creme">{d.nome}</span>
              <span className="block text-cinza">
                {d.cargo} · {d.instituicao}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
