import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { CardsProdutos } from "@/components/produtos/CardsProdutos";
import { FaixaAbbott } from "@/components/home/FaixaAbbott";
import { CtaFinal } from "@/components/home/CtaFinal";
import { getProdutos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Produtos — i-STAT 1 e cartuchos CG8+, CG4+, cTnI e Chem8+",
  description:
    "Analisador portátil i-STAT 1 e cartuchos CG8+, CG4+, cTnI (troponina I) e Chem8+ para gasometria point-of-care. Fornecimento em Santa Catarina e região.",
  alternates: { canonical: "/produtos" },
};

export default async function ProdutosPage() {
  const produtos = await getProdutos();
  return (
    <>
      <CabecalhoPagina
        eyebrow="Produtos"
        titulo="Um analisador. Vários painéis de testes."
        destaque={["analisador."]}
        texto="O i-STAT 1 e os cartuchos que fornecemos para hospitais, clínicas, laboratórios e veterinárias."
      />
      <section className="pb-24 md:pb-32">
        <div className="container-site">
          <CardsProdutos produtos={produtos} nivel="h2" />
          <p className="mt-10 rounded-2xl border border-ouro/25 bg-ouro/5 px-6 py-5 text-creme/90">
            <strong className="text-ouro">Outros cartuchos da linha i-STAT sob demanda.</strong> Consulte disponibilidade
            para a sua necessidade.
          </p>
        </div>
      </section>
      <FaixaAbbott />
      <div className="pt-24 md:pt-32">
        <CtaFinal />
      </div>
    </>
  );
}
