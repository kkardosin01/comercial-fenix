import { SITE } from "./site";

export function jsonLdNegocio() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE.url}/#empresa`,
    name: SITE.nome,
    legalName: SITE.nome,
    alternateName: SITE.nomeCurto,
    taxID: SITE.cnpj,
    description: SITE.descricao,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-completa.png`,
    image: `${SITE.url}/opengraph-image.png`,
    telephone: SITE.telefoneE164,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.endereco.logradouro}, ${SITE.endereco.sala} — ${SITE.endereco.predio}`,
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

// Nome do site nos resultados de busca (site name) e vínculo com a empresa.
export function jsonLdSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#site`,
    name: SITE.nomeCurto,
    alternateName: [SITE.nome, "Hospitalares Fênix"],
    url: SITE.url,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE.url}/#empresa` },
  };
}

// Serializa JSON-LD com segurança contra quebra de </script>.
export const serializarJsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, "\\u003c");
