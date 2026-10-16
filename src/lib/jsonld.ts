import { SITE } from "./site";

export function jsonLdNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE.url}/#empresa`,
    name: SITE.nome,
    alternateName: SITE.nomeCurto,
    description: SITE.descricao,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-completa.png`,
    image: `${SITE.url}/opengraph-image.png`,
    telephone: SITE.telefoneE164,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.endereco.logradouro} — ${SITE.endereco.predio}`,
      addressLocality: SITE.endereco.cidade,
      addressRegion: SITE.endereco.uf,
      postalCode: SITE.endereco.cep,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: ["Santa Catarina", "Paraná", "Rio Grande do Sul", "São Paulo", "Ceará"].map((n) => ({
      "@type": "State",
      name: n,
    })),
    knowsAbout: ["i-STAT 1", "Testes point-of-care", "Gasometria", "Cartuchos i-STAT"],
  };
}

// Serializa JSON-LD com segurança contra quebra de </script>.
export const serializarJsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");
