// Dados institucionais centralizados. Alterar aqui reflete em todo o site.
export const SITE = {
  nome: "Comercial Fênix SC Ltda",
  nomeCurto: "Comercial Fênix",
  // Preencha com o CNPJ (exibido na Política de Privacidade e nos Termos quando informado).
  cnpj: "",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://hospitalaresfenix.com.br").replace(/\/$/, ""),
  descricao:
    "Fornecedor do analisador portátil i-STAT 1 e cartuchos (tecnologia Abbott i-STAT) em Florianópolis e Santa Catarina. Atendimento presencial, entrega ágil e reposição programada.",
  telefoneExibicao: "(48) 99915-2015",
  telefoneE164: "+5548999152015",
  whatsapp: "https://wa.me/5548999152015",
  email: "fenix.hospitalares@gmail.com",
  endereco: {
    predio: "Centro Empresarial Vitória Office",
    logradouro: "R. Dr. Heitor Blum, 310",
    bairro: "Estreito",
    cidade: "Florianópolis",
    uf: "SC",
    cep: "88075-110",
  },
  // Coordenadas aproximadas do endereço (usadas no schema.org). Conferir no Google Business Profile.
  geo: { lat: -27.5893, lng: -48.5813 },
  horario: "Segunda a sexta, 8h às 18h",
  estadosAtendidos: ["SC", "PR", "RS", "SP", "CE"] as const,
} as const;

export const ENDERECO_COMPLETO = `${SITE.endereco.predio} — ${SITE.endereco.logradouro}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade}/${SITE.endereco.uf}, CEP ${SITE.endereco.cep}`;

const mapsQuery = encodeURIComponent(
  `${SITE.endereco.logradouro}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade} - ${SITE.endereco.uf}, ${SITE.endereco.cep}`,
);
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

export const whatsappLink = (mensagem?: string) =>
  mensagem ? `${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}` : SITE.whatsapp;

export const NAV = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/areas-de-atuacao", label: "Áreas de atuação" },
  { href: "/clientes", label: "Clientes" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
] as const;

export const AVISO_INFORMATIVO =
  "Informações de caráter informativo. Indicações e uso conforme instruções do fabricante e avaliação do profissional responsável.";
export const AVISO_MARCAS = "i-STAT e Abbott são marcas registradas da Abbott.";
export const FRASE_ABBOTT = "Trabalhamos com a tecnologia Abbott i-STAT";

// Quando o arquivo oficial da logo Abbott for recebido, salve-o em /public/parceiros/
// e informe o caminho aqui (ex.: "/parceiros/abbott.svg"). Enquanto for null, o site
// exibe apenas o texto, sem tentar reproduzir a marca.
export const ABBOTT_LOGO: { src: string; width: number; height: number } | null = null;
