import Image from "next/image";
import { ABBOTT_LOGO, FRASE_ABBOTT } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

// Logo oficial da Abbott: exibida somente a partir do arquivo oficial (ver ABBOTT_LOGO em lib/site.ts),
// sobre fundo claro, sem recolorir/distorcer e com área de proteção (padding generoso).
export function LogoAbbott({ className = "" }: { className?: string }) {
  if (!ABBOTT_LOGO) return null;
  return (
    <div className={`inline-flex rounded-2xl bg-white p-6 md:p-8 ${className}`}>
      <Image
        src={ABBOTT_LOGO.src}
        width={ABBOTT_LOGO.width}
        height={ABBOTT_LOGO.height}
        alt="Abbott"
        className="h-10 w-auto md:h-12"
      />
    </div>
  );
}

export function FaixaAbbott() {
  return (
    <section className="bg-creme py-20 text-ink md:py-28" aria-labelledby="titulo-abbott">
      <div className="container-site grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        <Reveal>
          {ABBOTT_LOGO ? (
            <LogoAbbott className="shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]" />
          ) : (
            <p className="font-display text-5xl leading-none uppercase md:text-7xl">
              i-STAT<span className="text-ouro-tinta">.</span>
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-3">Tecnologia Abbott i-STAT</p>
          <h2 id="titulo-abbott" className="text-3xl uppercase md:text-5xl">
            {FRASE_ABBOTT}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cinza-escuro">
            O sistema i-STAT é referência mundial em testes point-of-care: análises de sangue realizadas no local do
            atendimento, com cartuchos de uso único e um analisador portátil que leva o laboratório até o paciente.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
