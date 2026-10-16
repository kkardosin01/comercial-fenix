import { Contador } from "@/components/ui/Contador";
import { Reveal } from "@/components/ui/Reveal";

export function Contadores() {
  return (
    <dl className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
      <Reveal className="bg-carvao p-8 md:p-10">
        <dt className="sr-only">Clientes ativos</dt>
        <dd className="font-display text-6xl text-ouro md:text-7xl">
          <Contador valor={50} prefixo="+" />
        </dd>
        <dd className="mt-2 text-cinza">clientes ativos</dd>
      </Reveal>
      <Reveal delay={0.1} className="bg-carvao p-8 md:p-10">
        <dt className="sr-only">Estados atendidos</dt>
        <dd className="font-display text-6xl text-ouro md:text-7xl">
          <Contador valor={5} />
        </dd>
        <dd className="mt-2 text-cinza">estados atendidos · SC, PR, RS, SP e CE</dd>
      </Reveal>
      <Reveal delay={0.2} className="flex flex-col justify-center bg-carvao p-8 md:p-10">
        <dt className="sr-only">Segmentos</dt>
        <dd className="font-display text-3xl leading-tight uppercase md:text-4xl">
          Hospitais, clínicas, laboratórios e veterinárias
        </dd>
      </Reveal>
    </dl>
  );
}
