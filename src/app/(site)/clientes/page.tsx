import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { CarrosselLogos } from "@/components/clientes/CarrosselLogos";
import { Contadores } from "@/components/clientes/Contadores";
import { DiretorioClientes } from "@/components/clientes/DiretorioClientes";
import { Depoimentos } from "@/components/home/Depoimentos";
import { CtaFinal } from "@/components/home/CtaFinal";
import { getClientes, getDepoimentos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Clientes — instituições que confiam na Comercial Fênix",
  description:
    "Hospitais, clínicas, laboratórios, clínicas de reprodução humana e hospitais veterinários de SC, PR, RS, SP e CE atendidos pela Comercial Fênix com i-STAT.",
  alternates: { canonical: "/clientes" },
};

export default async function ClientesPage() {
  const [clientes, depoimentos] = await Promise.all([getClientes(), getDepoimentos()]);
  return (
    <>
      <CabecalhoPagina
        eyebrow="Clientes que confiam em nós"
        titulo="Instituições que confiam na Comercial Fênix"
        destaque={["Comercial", "Fênix"]}
      />
      <CarrosselLogos clientes={clientes.filter((c) => c.destaque)} />
      <section className="py-16 md:py-24">
        <div className="container-site space-y-20">
          <Contadores />
          <div>
            <h2 className="mb-10 text-4xl uppercase md:text-5xl">Instituições atendidas</h2>
            <DiretorioClientes clientes={clientes} comFiltro abertoInicial />
          </div>
          {depoimentos.length > 0 && (
            <div>
              <h2 className="text-4xl uppercase md:text-5xl">O que dizem nossos clientes</h2>
              <Depoimentos itens={depoimentos} />
            </div>
          )}
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
