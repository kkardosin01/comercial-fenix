"use client";
import Image from "next/image";
import { m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import emblema from "../../../public/brand/fenix-emblem-grande.png";
import { TextReveal } from "@/components/ui/TextReveal";
import { Botao } from "@/components/ui/Botao";
import { whatsappLink } from "@/lib/site";
import type { CSSProperties } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yEmblema = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacidade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="grao relative isolate flex min-h-svh items-center overflow-hidden pt-28 pb-20">
      {/* brilho dourado de fundo */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(205,163,92,0.18)_0%,rgba(205,163,92,0.04)_40%,transparent_70%)] md:left-[70%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[38%] right-[-12%] -z-10 w-[78vw] max-w-[300px] -translate-y-1/2 opacity-[0.14] md:top-1/2 md:right-auto md:left-[74%] md:w-[min(58vw,780px)] md:max-w-none md:-translate-x-1/2 md:opacity-[0.22]"
      >
        <m.div style={{ y: yEmblema, scale: escala, opacity: opacidade }}>
          <Image src={emblema} alt="" priority quality={60} sizes="(min-width: 768px) 58vw, 300px" className="h-auto w-full" />
        </m.div>
      </div>

      <div className="container-site">
        <p className="eyebrow surge mb-6" style={{ "--atraso": "0.1s" } as CSSProperties}>
          i-STAT 1 · Tecnologia Abbott · Florianópolis/SC
        </p>
        <TextReveal
          as="h1"
          imediato
          delay={0.15}
          texto="Resultados à beira do leito. Reposição sem espera."
          destaque={["leito", "espera"]}
          className="max-w-5xl text-[2.9rem] leading-[0.98] font-medium uppercase sm:text-6xl md:text-7xl lg:text-[6.4rem]"
        />
        <p
          className="surge mt-8 max-w-xl text-lg leading-relaxed text-creme/80 md:text-xl"
          style={{ "--atraso": "0.7s" } as CSSProperties}
        >
          Fornecemos o analisador portátil i-STAT 1 e seus cartuchos para testes point-of-care, com atendimento
          presencial, entrega ágil e reposição programada para a sua instituição.
        </p>
        <div className="surge mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--atraso": "0.9s" } as CSSProperties}>
          <Botao href="/contato#orcamento">Solicitar orçamento</Botao>
          <Botao
            href={whatsappLink("Olá! Gostaria de falar sobre o i-STAT 1 e cartuchos.")}
            externo
            variante="contorno"
            icone={<MessageCircle className="size-4" aria-hidden />}
          >
            Falar no WhatsApp
          </Botao>
        </div>
      </div>

      <a
        href="#pilares"
        className="surge absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-cinza uppercase md:flex"
        style={{ "--atraso": "1.3s" } as CSSProperties}
      >
        Role
        <ChevronDown className="size-4 animate-bounce text-ouro" aria-hidden />
      </a>
    </section>
  );
}
