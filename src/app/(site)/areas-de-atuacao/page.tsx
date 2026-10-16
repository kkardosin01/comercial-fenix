import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { ExploradorAreas } from "@/components/explorer/ExploradorAreas";
import { CtaFinal } from "@/components/home/CtaFinal";
import { getAreas, getClientes, getProdutos } from "@/lib/data";
import { resumoClientes, resumoProdutos } from "@/lib/resumos";

export const metadata: Metadata = {
  title: "Áreas de atuação — onde o i-STAT agrega valor",
  description:
    "Explore como o i-STAT 1 é usado em emergência, UTI, neonatologia, centro cirúrgico, cardiologia, diálise, transporte, veterinária, medicina esportiva, reprodução humana e pesquisa.",
  alternates: { canonical: "/areas-de-atuacao" },
};

export default async function AreasPage() {
  const [areas, produtos, clientes] = await Promise.all([getAreas(), getProdutos(), getClientes()]);
  return (
    <>
      <CabecalhoPagina
        eyebrow="Explorador por área"
        titulo="Escolha a sua área. Veja o i-STAT em ação."
        destaque={["área.", "i-STAT"]}
        texto="Selecione o setor em que você trabalha para ver cenários de uso, cartuchos recomendados, benefícios práticos e instituições do segmento que já atendemos."
      />
      <section className="pb-24 md:pb-32">
        <div className="container-site">
          <h2 className="sr-only">Selecione a sua área</h2>
          <ExploradorAreas areas={areas} produtos={resumoProdutos(produtos)} clientes={resumoClientes(clientes)} />
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
