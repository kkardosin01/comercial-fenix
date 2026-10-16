import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import logo from "../../../public/brand/logo-completa.png";
import { AVISO_MARCAS, ENDERECO_COMPLETO, NAV, SITE } from "@/lib/site";
import { BotaoPreferenciasCookies } from "./ConsentimentoCookies";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink pt-20 pb-10">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src={logo} alt="Comercial Fênix SC Ltda." className="h-auto w-44" sizes="176px" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cinza">
              Fornecimento do analisador portátil i-STAT 1 e cartuchos para testes point-of-care, com atendimento
              presencial a partir de Florianópolis/SC.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="eyebrow mb-5">Navegação</h2>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-creme/80 transition-colors hover:text-ouro">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-5">
            <h2 className="eyebrow mb-5">Contato</h2>
            <ul className="space-y-4 text-sm text-creme/85">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-ouro" aria-hidden />
                <span>
                  <a href={`tel:${SITE.telefoneE164}`} className="hover:text-ouro">
                    {SITE.telefoneExibicao}
                  </a>{" "}
                  ·{" "}
                  <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-ouro">
                    WhatsApp
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-ouro" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="break-all hover:text-ouro">
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ouro" aria-hidden />
                <address className="not-italic">{ENDERECO_COMPLETO}</address>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-ouro" aria-hidden />
                <span>{SITE.horario}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="linha-ouro mt-16" />

        <div className="mt-8 flex flex-col gap-4 text-xs text-cinza md:flex-row md:items-center md:justify-between">
          <p>
            © {SITE.nome}. Todos os direitos reservados. {AVISO_MARCAS}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href="/politica-de-privacidade" className="hover:text-ouro">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos-de-uso" className="hover:text-ouro">
                Termos de Uso
              </Link>
            </li>
            <li>
              <BotaoPreferenciasCookies className="hover:text-ouro" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
