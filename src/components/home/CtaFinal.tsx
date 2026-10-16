import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import emblema from "../../../public/brand/fenix-emblem-grande.png";
import { Botao } from "@/components/ui/Botao";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SITE, whatsappLink } from "@/lib/site";

export function CtaFinal() {
  return (
    <section className="relative px-3 pb-24 md:px-6 md:pb-32">
      <div className="grao relative isolate mx-auto max-w-[90rem] overflow-hidden rounded-[2.5rem] border border-ouro/20 bg-gradient-to-br from-carvao-2 via-carvao to-ink px-6 py-20 md:px-16 md:py-28">
        <Image
          src={emblema}
          alt=""
          aria-hidden
          sizes="600px"
          className="pointer-events-none absolute -right-24 -bottom-24 -z-10 w-[600px] max-w-none opacity-[0.07]"
        />
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">Vamos conversar</p>
            <TextReveal
              texto="Leve o i-STAT para a sua instituição."
              destaque={["i-STAT"]}
              className="text-4xl leading-[1.02] font-medium uppercase md:text-7xl"
            />
            <Reveal delay={0.2} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Botao href="/contato#orcamento">Solicitar orçamento</Botao>
              <Botao
                href={whatsappLink("Olá! Gostaria de um orçamento do i-STAT.")}
                externo
                variante="contorno"
                icone={<MessageCircle className="size-4" aria-hidden />}
              >
                Falar no WhatsApp
              </Botao>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <ul className="space-y-4 text-creme/90">
              <li>
                <a href={`tel:${SITE.telefoneE164}`} className="flex items-center gap-3 hover:text-ouro">
                  <Phone className="size-5 text-ouro" aria-hidden /> {SITE.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 break-all hover:text-ouro">
                  <Mail className="size-5 shrink-0 text-ouro" aria-hidden /> {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-ouro" aria-hidden />
                <span>
                  {SITE.endereco.logradouro}, {SITE.endereco.sala}, {SITE.endereco.bairro}
                  <br />
                  {SITE.endereco.cidade}/{SITE.endereco.uf} · {SITE.horario}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
