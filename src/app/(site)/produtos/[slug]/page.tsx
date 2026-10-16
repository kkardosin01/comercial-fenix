import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { getAreas, getProduto, getProdutos } from "@/lib/data";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { Reveal } from "@/components/ui/Reveal";
import { Botao } from "@/components/ui/Botao";
import { IlustracaoAnalisador } from "@/components/ilustracoes/Analisador";
import { IlustracaoCartucho } from "@/components/ilustracoes/Cartucho";
import { SeloSobConsulta, CardsProdutos } from "@/components/produtos/CardsProdutos";
import { LogoAbbott } from "@/components/home/FaixaAbbott";
import { IconeArea } from "@/components/explorer/icones";
import { ABBOTT_LOGO, AVISO_INFORMATIVO, FRASE_ABBOTT, SITE, whatsappLink } from "@/lib/site";
import { serializarJsonLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  return (await getProdutos()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduto(slug);
  if (!p) return {};
  const titulo = p.tipo === "analisador" ? `${p.nome} — analisador portátil Abbott i-STAT` : `Cartucho ${p.nome} i-STAT`;
  return {
    title: titulo,
    description: `${p.resumo} Fornecimento em Florianópolis, Santa Catarina e região pela Comercial Fênix.`,
    alternates: { canonical: `/produtos/${p.slug}` },
    openGraph: { title: titulo, description: p.resumo },
  };
}

export default function ProdutoPage({ params }: PageProps<"/produtos/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <ConteudoProduto params={params} />
    </Suspense>
  );
}

async function ConteudoProduto({ params }: { params: PageProps<"/produtos/[slug]">["params"] }) {
  const { slug } = await params;
  const [produto, produtos, areas] = await Promise.all([getProduto(slug), getProdutos(), getAreas()]);
  if (!produto) notFound();

  const analisador = produto.tipo === "analisador";
  const areasRelacionadas = areas.filter((a) => (analisador ? true : a.cartuchos.includes(produto.slug)));
  const cartuchos = produtos.filter((p) => p.tipo === "cartucho");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.descricao,
    brand: { "@type": "Brand", name: "Abbott i-STAT" },
    url: `${SITE.url}/produtos/${produto.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLd) }} />
      <CabecalhoPagina
        eyebrow={analisador ? "Analisador" : "Cartucho i-STAT"}
        titulo={produto.nome}
        destaque={analisador ? ["i-STAT"] : [produto.nome]}
        texto={produto.resumo}
      />

      <section className="pb-24 md:pb-32">
        <div className="container-site">
          <Link href="/produtos" className="mb-10 inline-flex items-center gap-2 text-sm text-cinza hover:text-ouro">
            <ArrowLeft className="size-4" aria-hidden /> Todos os produtos
          </Link>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/[0.07] bg-carvao p-10">
              <div aria-hidden className="absolute inset-0 m-auto size-72 rounded-full bg-ouro/15 blur-[90px]" />
              {produto.imagem_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={produto.imagem_url} alt={produto.nome} className="relative max-h-[420px] w-auto object-contain" />
              ) : analisador ? (
                <IlustracaoAnalisador className="relative h-[420px] w-auto" />
              ) : (
                <IlustracaoCartucho rotulo={produto.nome} className="relative h-72 w-auto" />
              )}
            </Reveal>

            <div>
              {produto.sob_consulta && (
                <div className="mb-6">
                  <SeloSobConsulta />
                </div>
              )}
              <Reveal>
                <p className="text-lg leading-relaxed text-creme/90">{produto.descricao}</p>
              </Reveal>

              {produto.parametros.length > 0 && (
                <Reveal delay={0.1} className="mt-10">
                  <h2 className="text-sm font-semibold tracking-[0.2em] text-ouro uppercase">Parâmetros</h2>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {produto.parametros.map((p) => (
                      <li key={p} className="rounded-xl border border-white/[0.08] bg-carvao px-4 py-3 text-creme/90">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {produto.destaques.length > 0 && (
                <Reveal delay={0.15} className="mt-10">
                  <h2 className="text-sm font-semibold tracking-[0.2em] text-ouro uppercase">Destaques</h2>
                  <ul className="mt-5 space-y-3">
                    {produto.destaques.map((d) => (
                      <li key={d} className="flex gap-3 text-creme/90">
                        <Check className="mt-1 size-4 shrink-0 text-ouro" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {analisador && (
                <Reveal delay={0.2} className="mt-10 flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-carvao p-6 sm:flex-row sm:items-center">
                  {ABBOTT_LOGO && <LogoAbbott />}
                  <p className="font-display text-2xl uppercase">{FRASE_ABBOTT}</p>
                </Reveal>
              )}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Botao href={`/contato?produto=${produto.slug}#orcamento`}>Solicitar orçamento</Botao>
                <Botao href={whatsappLink(`Olá! Gostaria de informações sobre ${produto.nome}.`)} externo variante="contorno">
                  Falar no WhatsApp
                </Botao>
              </div>
              <p className="mt-8 text-sm text-cinza">{AVISO_INFORMATIVO}</p>
            </div>
          </div>

          {areasRelacionadas.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl uppercase md:text-4xl">
                {analisador ? "Áreas que usam o i-STAT 1" : `Onde o ${produto.nome} é utilizado`}
              </h2>
              <ul className="mt-8 flex flex-wrap gap-2">
                {areasRelacionadas.map((a) => {
                  return (
                    <li key={a.slug}>
                      <Link
                        href={`/areas-de-atuacao?area=${a.slug}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-colors hover:border-ouro hover:text-ouro"
                      >
                        <IconeArea nome={a.icone} className="size-4 text-ouro" aria-hidden /> {a.nome}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {analisador && (
            <div className="mt-24">
              <h2 className="text-3xl uppercase md:text-4xl">Cartuchos compatíveis</h2>
              <div className="mt-8">
                <CardsProdutos produtos={cartuchos} />
              </div>
              <p className="mt-6 text-cinza">Outros cartuchos da linha i-STAT sob demanda.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
