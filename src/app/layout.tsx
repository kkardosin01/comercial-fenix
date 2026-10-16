import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { SITE } from "@/lib/site";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap", weight: ["400", "500", "600"] });
// Fonte de corpo sem preload: libera banda para a fonte dos títulos (elemento de LCP).
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Comercial Fênix SC Ltda | i-STAT 1 e cartuchos em Florianópolis e SC",
    template: "%s | Comercial Fênix",
  },
  description: SITE.descricao,
  applicationName: SITE.nomeCurto,
  keywords: [
    "i-STAT 1 Santa Catarina",
    "Abbott i-STAT",
    "cartucho CG8+",
    "cartucho CG4+",
    "troponina i-STAT",
    "gasometria point-of-care",
    "i-STAT veterinário",
    "fornecedor i-STAT Florianópolis",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${manrope.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
