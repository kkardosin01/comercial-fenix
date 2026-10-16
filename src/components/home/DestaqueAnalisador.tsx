"use client";
import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Check } from "lucide-react";
import { IlustracaoAnalisador } from "@/components/ilustracoes/Analisador";
import { Titulo } from "@/components/ui/Titulo";
import { Botao } from "@/components/ui/Botao";
import { Reveal } from "@/components/ui/Reveal";

const ITENS = [
  "Portátil e leve, cabe na mão",
  "Sangue total, com poucas gotas de amostra",
  "Resultados em minutos, no local do atendimento",
  "Compatível com toda a linha de cartuchos i-STAT",
];

export function DestaqueAnalisador({ imagem }: { imagem?: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rot = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-carvao py-24 md:py-36">
      <div className="container-site grid items-center gap-16 lg:grid-cols-2">
        <div className="relative order-2 flex justify-center lg:order-1">
          <div aria-hidden className="absolute inset-0 m-auto size-80 rounded-full bg-ouro/15 blur-[100px]" />
          <m.div style={{ y, rotate: rot }} className="relative w-56 md:w-72">
            {imagem ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagem} alt="Analisador i-STAT 1" className="h-auto w-full" loading="lazy" />
            ) : (
              <IlustracaoAnalisador className="h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]" />
            )}
          </m.div>
        </div>
        <div className="order-1 lg:order-2">
          <Titulo
            eyebrow="Produto em destaque"
            titulo="Analisador i-STAT 1"
            destaque={["i-STAT"]}
            texto="O laboratório que vai até o paciente. Um único equipamento portátil para gasometria, eletrólitos, lactato, troponina e química, conforme o cartucho escolhido."
          />
          <ul className="mt-8 space-y-3">
            {ITENS.map((t, i) => (
              <Reveal as="li" key={t} delay={0.1 + i * 0.08} className="flex items-start gap-3 text-creme/90">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ouro/15">
                  <Check className="size-3.5 text-ouro" aria-hidden />
                </span>
                {t}
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Botao href="/produtos/i-stat-1">Conhecer o i-STAT 1</Botao>
            <Botao href="/produtos" variante="contorno">
              Ver cartuchos
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
