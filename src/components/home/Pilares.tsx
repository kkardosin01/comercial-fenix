import { Award, CalendarClock, Handshake, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CartaoLuz } from "@/components/ui/CartaoLuz";
import { Titulo } from "@/components/ui/Titulo";

const PILARES = [
  {
    icone: Award,
    titulo: "Especialização i-STAT",
    texto: "Foco total na linha Abbott i-STAT: analisador, cartuchos e orientação de quem conhece o sistema a fundo.",
  },
  {
    icone: Handshake,
    titulo: "Atendimento presencial",
    texto: "Visitamos a sua instituição para entender a rotina do setor e indicar os cartuchos adequados.",
  },
  {
    icone: Truck,
    titulo: "Entrega ágil",
    texto: "Logística rápida a partir de Florianópolis — em muitos casos, entrega no próximo dia útil.",
  },
  {
    icone: CalendarClock,
    titulo: "Reposição programada",
    texto: "Compra mensal ou para estoque, planejada com você para o setor não ficar sem cartuchos.",
  },
];

export function Pilares() {
  return (
    <section id="pilares" className="relative py-24 md:py-36">
      <div className="container-site">
        <Titulo
          eyebrow="Por que a Comercial Fênix"
          titulo="Quatro pilares para o seu setor nunca parar"
          destaque={["nunca", "parar"]}
        />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={i * 0.1}>
              <CartaoLuz className="h-full p-7 md:p-8">
                <span className="font-display text-sm text-ouro/70">0{i + 1}</span>
                <p.icone className="mt-8 size-9 text-ouro transition-transform duration-500 group-hover:scale-110" aria-hidden strokeWidth={1.4} />
                <h3 className="mt-6 text-2xl uppercase">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-cinza">{p.texto}</p>
              </CartaoLuz>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
