import { Hero } from "@/components/home/Hero";
import { Pilares } from "@/components/home/Pilares";
import { DestaqueAnalisador } from "@/components/home/DestaqueAnalisador";
import { FaixaAbbott } from "@/components/home/FaixaAbbott";
import { MapaAtuacao } from "@/components/home/MapaAtuacao";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Depoimentos } from "@/components/home/Depoimentos";
import { ExploradorAreas } from "@/components/explorer/ExploradorAreas";
import { CardsProdutos } from "@/components/produtos/CardsProdutos";
import { CarrosselLogos } from "@/components/clientes/CarrosselLogos";
import { Contadores } from "@/components/clientes/Contadores";
import { DiretorioClientes } from "@/components/clientes/DiretorioClientes";
import { Titulo } from "@/components/ui/Titulo";
import { Botao } from "@/components/ui/Botao";
import { getAreas, getClientes, getDepoimentos, getProdutos } from "@/lib/data";
import { ESTADOS, FLORIANOPOLIS, MAPA_ALTURA, MAPA_LARGURA, gerarMalha, projetar } from "@/lib/mapa";
import { resumoClientes, resumoProdutos } from "@/lib/resumos";

export default async function Home() {
  const [produtos, areas, clientes, depoimentos] = await Promise.all([
    getProdutos(),
    getAreas(),
    getClientes(),
    getDepoimentos(),
  ]);
  const analisador = produtos.find((p) => p.tipo === "analisador");
  const malha = gerarMalha();

  return (
    <>
      <Hero />
      <Pilares />
      <DestaqueAnalisador imagem={analisador?.imagem_url} />
      <FaixaAbbott />

      <section className="py-24 md:py-36" aria-label="Explorador por área">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <Titulo
              eyebrow="Explorador por área"
              titulo="Onde o i-STAT agrega valor na sua área"
              destaque={["sua", "área"]}
              texto="Escolha o seu setor e veja cenários de uso, cartuchos recomendados e quem já atendemos."
            />
            <Botao href="/areas-de-atuacao" variante="contorno" className="shrink-0">
              Ver todas as áreas
            </Botao>
          </div>
          <div className="mt-12">
            <ExploradorAreas
              modo="previa"
              areas={areas.slice(0, 6)}
              produtos={resumoProdutos(produtos)}
              clientes={resumoClientes(clientes)}
            />
          </div>
        </div>
      </section>

      <section className="bg-carvao/50 py-24 md:py-36">
        <div className="container-site">
          <Titulo
            eyebrow="Linhas de produtos"
            titulo="Analisador e cartuchos i-STAT"
            destaque={["i-STAT"]}
            texto="Um analisador, vários painéis de testes. Outros cartuchos da linha i-STAT sob demanda."
          />
          <div className="mt-14">
            <CardsProdutos produtos={produtos} />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-36" aria-label="Clientes">
        <div className="container-site">
          <Titulo
            eyebrow="Clientes que confiam em nós"
            titulo="Instituições que confiam na Comercial Fênix"
            destaque={["Comercial", "Fênix"]}
          />
        </div>
        <div className="mt-12">
          <CarrosselLogos clientes={clientes.filter((c) => c.destaque)} />
        </div>
        <div className="container-site mt-12 space-y-6">
          <Contadores />
          <DiretorioClientes clientes={clientes} />
          <Depoimentos itens={depoimentos} />
        </div>
      </section>

      <MapaAtuacao
        base={malha.base}
        estados={malha.estados}
        infos={Object.entries(ESTADOS).map(([uf, e]) => ({ uf, nome: e.nome, centro: projetar(e.centro) }))}
        floripa={projetar(FLORIANOPOLIS)}
        largura={MAPA_LARGURA}
        altura={MAPA_ALTURA}
      />

      <CtaFinal />
    </>
  );
}
