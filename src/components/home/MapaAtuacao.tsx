"use client";
import { m } from "motion/react";
import { useState } from "react";
import { clsx } from "clsx";
import { Reveal } from "@/components/ui/Reveal";
import { Titulo } from "@/components/ui/Titulo";

type Props = {
  base: string;
  estados: Record<string, string>;
  infos: { uf: string; nome: string; centro: [number, number] }[];
  floripa: [number, number];
  largura: number;
  altura: number;
};

export function MapaAtuacao({ base, estados, infos, floripa, largura, altura }: Props) {
  const [foco, setFoco] = useState<string | null>(null);
  const [fx, fy] = floripa;

  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="titulo-mapa">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Titulo
            eyebrow="Área de atuação"
            titulo="De Florianópolis para o Brasil"
            destaque={["Florianópolis"]}
            texto="Base em Santa Catarina, com atendimento presencial no estado e região e clientes também no Paraná, Rio Grande do Sul, São Paulo e Ceará."
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {infos.map((e, i) => (
              <Reveal as="li" key={e.uf} delay={i * 0.06}>
                <button
                  type="button"
                  onMouseEnter={() => setFoco(e.uf)}
                  onMouseLeave={() => setFoco(null)}
                  onFocus={() => setFoco(e.uf)}
                  onBlur={() => setFoco(null)}
                  className={clsx(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                    foco === e.uf ? "border-ouro bg-ouro/10" : "border-white/10",
                  )}
                >
                  <span className="block font-display text-2xl text-ouro">{e.uf}</span>
                  <span className="text-sm text-cinza">{e.nome}</span>
                </button>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="relative">
          <svg
            viewBox={`0 0 ${largura} ${altura}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-labelledby="titulo-mapa-svg"
          >
            <title id="titulo-mapa-svg">
              Mapa estilizado do Brasil com destaque para SC, PR, RS, SP e CE, a partir de Florianópolis
            </title>
            <path d={base} stroke="#4d463c" strokeWidth="4.4" strokeLinecap="round" />
            {Object.entries(estados).map(([uf, d]) => (
              <path
                key={uf}
                d={d}
                strokeWidth={foco === uf ? 6 : 5}
                strokeLinecap="round"
                className="transition-all duration-500"
                stroke={foco && foco !== uf ? "#7d6640" : "#CDA35C"}
              />
            ))}
            {infos
              .filter((e) => e.uf !== "SC")
              .map((e, i) => {
                const [cx, cy] = e.centro;
                const mx = (fx + cx) / 2 + (cy - fy) * 0.25;
                const my = (fy + cy) / 2 - Math.abs(cx - fx) * 0.25 - 20;
                return (
                  <m.path
                    key={e.uf}
                    d={`M${fx} ${fy} Q${mx} ${my} ${cx} ${cy}`}
                    fill="none"
                    stroke="#E8CF9B"
                    strokeWidth={foco === e.uf ? 2.2 : 1.2}
                    strokeOpacity={foco && foco !== e.uf ? 0.25 : 0.8}
                    strokeDasharray="1 0"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.4 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
            <circle cx={fx} cy={fy} r="16" fill="#CDA35C" opacity=".25" className="origin-center animate-pulse-ring [transform-box:fill-box]" />
            <circle cx={fx} cy={fy} r="6" fill="#E8CF9B" stroke="#0A0A0A" strokeWidth="2" />
            <text x={fx + 12} y={fy + 26} fill="#F5F1E8" fontSize="15" fontFamily="var(--font-manrope), sans-serif">
              Florianópolis
            </text>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
