import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFlutuante } from "@/components/layout/WhatsAppFlutuante";
import { ConsentimentoCookies } from "@/components/layout/ConsentimentoCookies";
import { jsonLdNegocio, serializarJsonLd } from "@/lib/jsonld";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLdNegocio()) }} />
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFlutuante />
      <ConsentimentoCookies />
    </>
  );
}
