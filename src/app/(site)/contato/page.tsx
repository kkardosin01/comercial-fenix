import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { FormularioOrcamento } from "@/components/contato/FormularioOrcamento";
import { ContatoDireto } from "@/components/contato/ContatoDireto";
import { formularioDisponivel } from "@/lib/formulario";
import { Reveal } from "@/components/ui/Reveal";
import { getAreas, getProdutos } from "@/lib/data";
import { ENDERECO_COMPLETO, MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato e orçamento — fornecedor i-STAT em Florianópolis",
  description:
    "Solicite um orçamento do i-STAT 1 e cartuchos. Telefone e WhatsApp (48) 99915-2015, e-mail e endereço no Estreito, Florianópolis/SC.",
  alternates: { canonical: "/contato" },
};

const itemCls =
  "group flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-carvao p-5 transition-colors hover:border-ouro/40";

export default async function ContatoPage() {
  const [areas, produtos] = await Promise.all([getAreas(), getProdutos()]);
  const opcoesAreas = areas.map(({ slug, nome }) => ({ slug, nome }));
  const opcoesProdutos = produtos.map(({ slug, nome }) => ({ slug, nome }));

  return (
    <>
      <CabecalhoPagina
        eyebrow="Contato"
        titulo="Vamos conversar sobre o seu setor."
        destaque={["seu", "setor."]}
        texto="Solicite um orçamento, agende uma visita ou tire dúvidas sobre o i-STAT 1 e os cartuchos."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div className="space-y-4">
            <Reveal>
              <a href={whatsappLink("Olá! Gostaria de um orçamento.")} target="_blank" rel="noopener noreferrer" className={itemCls}>
                <MessageCircle className="mt-0.5 size-6 shrink-0 text-ouro" aria-hidden />
                <span>
                  <span className="block text-sm text-cinza">WhatsApp</span>
                  <span className="text-lg font-semibold group-hover:text-ouro">{SITE.telefoneExibicao}</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <a href={`tel:${SITE.telefoneE164}`} className={itemCls}>
                <Phone className="mt-0.5 size-6 shrink-0 text-ouro" aria-hidden />
                <span>
                  <span className="block text-sm text-cinza">Telefone</span>
                  <span className="text-lg font-semibold group-hover:text-ouro">{SITE.telefoneExibicao}</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <a href={`mailto:${SITE.email}`} className={itemCls}>
                <Mail className="mt-0.5 size-6 shrink-0 text-ouro" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-sm text-cinza">E-mail</span>
                  <span className="text-lg font-semibold break-all group-hover:text-ouro">{SITE.email}</span>
                </span>
              </a>
            </Reveal>
            <Reveal delay={0.15}>
              <div className={itemCls}>
                <MapPin className="mt-0.5 size-6 shrink-0 text-ouro" aria-hidden />
                <span>
                  <span className="block text-sm text-cinza">Endereço</span>
                  <address className="not-italic">{ENDERECO_COMPLETO}</address>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className={itemCls}>
                <Clock className="mt-0.5 size-6 shrink-0 text-ouro" aria-hidden />
                <span>
                  <span className="block text-sm text-cinza">Horário</span>
                  {SITE.horario}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.25} className="pt-4">
              <div className="overflow-hidden rounded-3xl border border-ouro/50 p-1.5 shadow-[0_0_0_1px_rgba(205,163,92,0.15),0_30px_60px_-30px_rgba(205,163,92,0.35)]">
                <iframe
                  title="Mapa: localização da Comercial Fênix no Estreito, Florianópolis"
                  src={MAPS_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-72 w-full rounded-[1.25rem] border-0 grayscale-[35%] invert-[0.9] hue-rotate-180"
                  allowFullScreen
                />
              </div>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border border-ouro/60 px-6 font-semibold transition-colors hover:bg-ouro/10"
              >
                <Navigation className="size-4 text-ouro" aria-hidden /> Como chegar
              </a>
            </Reveal>
          </div>

          <div id="orcamento" className="scroll-mt-28">
            <div className="rounded-[2rem] border border-white/[0.07] bg-carvao/60 p-6 md:p-10">
              <h2 className="text-4xl uppercase md:text-5xl">Solicitar orçamento</h2>
              {formularioDisponivel() ? (
                <>
                  <p className="mt-3 mb-8 text-cinza">
                    Campos com <span className="text-ouro">*</span> são obrigatórios. Retornamos em horário comercial.
                  </p>
                  <Suspense fallback={<div className="h-[640px] animate-pulse rounded-2xl bg-white/[0.03]" />}>
                    <FormularioOrcamento areas={opcoesAreas} produtos={opcoesProdutos} />
                  </Suspense>
                </>
              ) : (
                <div className="mt-6">
                  <ContatoDireto />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
