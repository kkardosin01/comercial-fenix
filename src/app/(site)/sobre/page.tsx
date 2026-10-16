import type { Metadata } from "next";
import Image from "next/image";
import emblema from "../../../../public/brand/fenix-emblem-grande.png";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { Pilares } from "@/components/home/Pilares";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Reveal } from "@/components/ui/Reveal";
import { Titulo } from "@/components/ui/Titulo";

export const metadata: Metadata = {
  title: "Sobre nós — fornecedor i-STAT em Florianópolis",
  description:
    "A Comercial Fênix SC Ltda é uma empresa catarinense especializada no fornecimento do analisador i-STAT 1 e cartuchos, com atendimento presencial e reposição programada.",
  alternates: { canonical: "/sobre" },
};

const PUBLICO = [
  "Hospitais e prontos-atendimentos",
  "Clínicas e laboratórios",
  "Clínicas de reprodução humana",
  "Clínicas e hospitais veterinários",
  "Clubes e medicina esportiva",
  "Instituições de pesquisa e ensino",
];

export default function SobrePage() {
  return (
    <>
      <CabecalhoPagina
        eyebrow="Sobre nós"
        titulo="Especialistas em i-STAT, de Santa Catarina."
        destaque={["i-STAT,"]}
        texto="A Comercial Fênix SC Ltda é uma empresa catarinense, sediada em Florianópolis, especializada no fornecimento do analisador de sangue portátil i-STAT 1 (tecnologia Abbott) e de seus cartuchos para testes point-of-care."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-site grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative flex justify-center">
            <div aria-hidden className="absolute inset-0 m-auto size-72 rounded-full bg-ouro/15 blur-[100px]" />
            <Image src={emblema} alt="" loading="eager" sizes="(min-width: 1024px) 420px, 70vw" className="relative h-auto w-[70%] max-w-[420px]" />
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-creme/85">
            <Reveal>
              <p>
                Atendemos hospitais, clínicas, prontos-atendimentos, laboratórios, clínicas de reprodução humana e
                clínicas e hospitais veterinários, principalmente em Santa Catarina e região, com clientes também no
                Paraná, Rio Grande do Sul, São Paulo e Ceará.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Nosso trabalho é consultivo: visitamos a instituição, entendemos a rotina de cada setor e planejamos
                com o cliente a reposição de cartuchos — mensal ou para estoque — para que o equipamento esteja sempre
                pronto para uso.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                Como nos dedicamos exclusivamente à linha i-STAT, conhecemos o sistema a fundo e conseguimos orientar a
                escolha dos cartuchos mais adequados a cada área.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-creme py-24 text-ink md:py-32">
        <div className="container-site">
          <Titulo claro eyebrow="Para quem trabalhamos" titulo="Quem atendemos" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {PUBLICO.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 0.05} className="bg-creme p-8">
                <span className="font-display text-sm text-ouro-tinta">0{i + 1}</span>
                <p className="mt-3 font-display text-2xl uppercase">{p}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Pilares />
      <CtaFinal />
    </>
  );
}
