// Conteúdo inicial do site. É a fonte do supabase/seed.sql (scripts/generate-seed.ts)
// e o fallback usado quando o Supabase ainda não está configurado.
// Depois do deploy, o conteúdo passa a ser editado pelo painel /admin.
import type { Area, Cliente, Produto, Segmento } from "../types";

export const PRODUTOS_SEED: Produto[] = [
  {
    slug: "i-stat-1",
    nome: "Analisador i-STAT 1",
    tipo: "analisador",
    resumo:
      "Analisador de sangue portátil para testes point-of-care, com resultados em minutos à beira do leito.",
    descricao:
      "O i-STAT 1 é um analisador portátil e leve que processa amostras de sangue total em cartuchos de uso único. Com poucas gotas de amostra, entrega resultados em minutos no local do atendimento, sem depender do transporte da amostra até o laboratório central. É compatível com toda a linha de cartuchos i-STAT, o que permite escolher o painel adequado a cada situação.",
    parametros: [],
    destaques: [
      "Portátil e leve, opera com bateria",
      "Amostra de sangue total",
      "Poucas gotas de amostra por teste",
      "Resultados em minutos",
      "Compatível com toda a linha de cartuchos i-STAT",
    ],
    sob_consulta: false,
    imagem_url: null,
    ordem: 1,
    ativo: true,
  },
  {
    slug: "cartucho-cg8",
    nome: "CG8+",
    tipo: "cartucho",
    resumo: "Gasometria, eletrólitos, glicose e hematologia em um único cartucho.",
    descricao:
      "Cartucho que combina gases sanguíneos, eletrólitos, glicose e parâmetros hematológicos em um único teste, útil quando é preciso uma visão ampla do paciente com uma só amostra.",
    parametros: [
      "pH",
      "PCO2",
      "PO2",
      "Sódio (Na)",
      "Potássio (K)",
      "Cálcio ionizado (iCa)",
      "Glicose",
      "Hematócrito (Hct)",
      "Hemoglobina (Hb, calculada)",
      "Parâmetros calculados: HCO3, TCO2, BE, sO2",
    ],
    destaques: ["Painel amplo em uma única amostra", "Indicado para rotinas de gasometria com eletrólitos"],
    sob_consulta: false,
    imagem_url: null,
    ordem: 2,
    ativo: true,
  },
  {
    slug: "cartucho-cg4",
    nome: "CG4+",
    tipo: "cartucho",
    resumo: "Gasometria com lactato.",
    descricao:
      "Cartucho de gases sanguíneos com lactato, utilizado quando a avaliação do equilíbrio ácido-base precisa ser acompanhada da dosagem de lactato.",
    parametros: ["pH", "PCO2", "PO2", "Lactato", "Parâmetros calculados: HCO3, TCO2, BE, sO2"],
    destaques: ["Gasometria e lactato no mesmo teste", "Também utilizado em medicina esportiva e veterinária"],
    sob_consulta: false,
    imagem_url: null,
    ordem: 3,
    ativo: true,
  },
  {
    slug: "cartucho-ctni",
    nome: "cTnI",
    tipo: "cartucho",
    resumo: "Troponina I cardíaca à beira do leito.",
    descricao:
      "Cartucho para dosagem de troponina I cardíaca (cTnI) no ponto de atendimento, como apoio à avaliação de pacientes com dor torácica, conforme protocolo da instituição.",
    parametros: ["Troponina I cardíaca (cTnI)"],
    destaques: ["Marcador cardíaco no local do atendimento", "Apoio a protocolos de dor torácica"],
    sob_consulta: false,
    imagem_url: null,
    ordem: 4,
    ativo: true,
  },
  {
    slug: "cartucho-chem8",
    nome: "Chem8+",
    tipo: "cartucho",
    resumo: "Bioquímica, eletrólitos e função renal.",
    descricao:
      "Cartucho de química que reúne eletrólitos, glicose, marcadores de função renal e hematologia básica em um único teste.",
    parametros: [
      "Sódio (Na)",
      "Potássio (K)",
      "Cloreto (Cl)",
      "Cálcio ionizado (iCa)",
      "TCO2",
      "Glicose",
      "Ureia (BUN)",
      "Creatinina",
      "Hematócrito (Hct)",
      "Hemoglobina (Hb, calculada)",
      "Ânion gap (calculado)",
    ],
    destaques: ["Eletrólitos e função renal no mesmo cartucho"],
    sob_consulta: true,
    imagem_url: null,
    ordem: 5,
    ativo: true,
  },
];

const HOSP: Segmento[] = ["hospitais"];

export const AREAS_SEED: Area[] = [
  {
    slug: "emergencia",
    nome: "Emergência / Pronto-socorro",
    icone: "siren",
    resumo: "Decisões rápidas na chegada de pacientes graves.",
    cenarios: [
      "Triagem rápida de pacientes graves",
      "Avaliação de distúrbios ácido-base e eletrolíticos",
      "Lactato em suspeita de sepse",
      "Troponina I na avaliação da dor torácica",
    ],
    beneficios: [
      "Resultados no próprio setor, sem aguardar o transporte da amostra",
      "Um único equipamento para vários painéis de testes",
      "Apoio a protocolos institucionais de atendimento",
    ],
    cartuchos: ["cartucho-cg8", "cartucho-cg4", "cartucho-ctni", "cartucho-chem8"],
    segmentos_clientes: HOSP,
    ordem: 1,
    ativo: true,
  },
  {
    slug: "uti-adulto",
    nome: "UTI adulto",
    icone: "heart-pulse",
    resumo: "Monitoramento seriado do paciente crítico.",
    cenarios: [
      "Gasometrias seriadas",
      "Apoio ao ajuste da ventilação mecânica",
      "Controle de eletrólitos e glicemia",
      "Lactato no paciente em choque",
    ],
    beneficios: [
      "Acompanhamento frequente no próprio leito",
      "Agilidade entre coleta e resultado",
      "Reposição programada conforme o consumo da unidade",
    ],
    cartuchos: ["cartucho-cg8", "cartucho-cg4"],
    segmentos_clientes: HOSP,
    ordem: 2,
    ativo: true,
  },
  {
    slug: "uti-neonatal-pediatria",
    nome: "UTI neonatal e pediatria",
    icone: "baby",
    resumo: "Pequeno volume de amostra para pacientes pequenos.",
    cenarios: [
      "Gasometria em recém-nascidos e crianças",
      "Controle de eletrólitos com amostras de pequeno volume",
    ],
    beneficios: [
      "Poucas gotas de sangue por teste",
      "Menor espoliação sanguínea ao longo da internação",
      "Resultados no próprio setor",
    ],
    cartuchos: ["cartucho-cg8", "cartucho-cg4"],
    segmentos_clientes: HOSP,
    ordem: 3,
    ativo: true,
  },
  {
    slug: "centro-cirurgico-anestesia",
    nome: "Centro cirúrgico e anestesia",
    icone: "scissors",
    resumo: "Dados intraoperatórios sem sair da sala.",
    cenarios: [
      "Gasometria e cálcio ionizado intraoperatórios",
      "Hemoglobina e hematócrito em cirurgias com sangramento",
    ],
    beneficios: [
      "Análise dentro da sala cirúrgica",
      "Equipamento portátil que acompanha a equipe",
      "Apoio à tomada de decisão da equipe de anestesia",
    ],
    cartuchos: ["cartucho-cg8", "cartucho-cg4"],
    segmentos_clientes: HOSP,
    ordem: 4,
    ativo: true,
  },
  {
    slug: "cardiologia-dor-toracica",
    nome: "Cardiologia e unidades de dor torácica",
    icone: "activity",
    resumo: "Troponina I à beira do leito.",
    cenarios: ["Troponina I à beira do leito para apoiar a avaliação de síndrome coronariana aguda"],
    beneficios: [
      "Marcador cardíaco disponível no ponto de atendimento",
      "Apoio a protocolos de dor torácica da instituição",
    ],
    cartuchos: ["cartucho-ctni"],
    segmentos_clientes: HOSP,
    ordem: 5,
    ativo: true,
  },
  {
    slug: "nefrologia-dialise",
    nome: "Nefrologia e diálise",
    icone: "droplets",
    resumo: "Eletrólitos e função renal antes e depois das sessões.",
    cenarios: ["Eletrólitos, ureia e creatinina antes e após sessões de diálise"],
    beneficios: ["Painel renal completo em um único cartucho", "Resultados na própria unidade de diálise"],
    cartuchos: ["cartucho-chem8"],
    segmentos_clientes: HOSP,
    ordem: 6,
    ativo: true,
  },
  {
    slug: "transporte-remocao",
    nome: "Transporte e remoção",
    icone: "ambulance",
    resumo: "Ambulância e aeromédico.",
    cenarios: ["Análises durante o transporte em ambulância ou aeronave para apoiar decisões"],
    beneficios: ["Analisador portátil, leve e a bateria", "Mesmos cartuchos usados no hospital"],
    cartuchos: ["cartucho-cg8", "cartucho-cg4"],
    segmentos_clientes: HOSP,
    ordem: 7,
    ativo: true,
  },
  {
    slug: "veterinaria-pequenos-animais",
    nome: "Clínicas e hospitais veterinários",
    icone: "paw-print",
    resumo: "Emergência e cirurgia de pequenos animais.",
    cenarios: [
      "Emergência e cirurgia de pequenos animais",
      "Gasometria, eletrólitos e lactato em pacientes críticos",
    ],
    beneficios: [
      "Pequeno volume de amostra",
      "Resultados durante o atendimento",
      "Reposição programada de cartuchos",
    ],
    cartuchos: ["cartucho-cg8", "cartucho-cg4", "cartucho-chem8"],
    segmentos_clientes: ["veterinaria"],
    ordem: 8,
    ativo: true,
  },
  {
    slug: "veterinaria-grandes-animais",
    nome: "Grandes animais e equinos",
    icone: "tractor",
    resumo: "Avaliação a campo com equipamento portátil.",
    cenarios: [
      "Avaliação de cólica e desidratação com lactato e eletrólitos",
      "Análises a campo, fora da clínica",
    ],
    beneficios: ["Equipamento portátil, leve e a bateria", "Resultados no local do atendimento"],
    cartuchos: ["cartucho-cg4", "cartucho-cg8"],
    segmentos_clientes: ["veterinaria"],
    ordem: 9,
    ativo: true,
  },
  {
    slug: "medicina-esportiva",
    nome: "Medicina esportiva e clubes",
    icone: "dumbbell",
    resumo: "Lactato e hidratação de atletas.",
    cenarios: [
      "Lactato para avaliação de limiar e prescrição de treino",
      "Eletrólitos e hidratação em atletas",
    ],
    beneficios: ["Análises no local do treino ou do teste", "Equipamento portátil para o dia a dia do clube"],
    cartuchos: ["cartucho-cg4", "cartucho-cg8"],
    segmentos_clientes: [],
    ordem: 10,
    ativo: true,
  },
  {
    slug: "reproducao-humana",
    nome: "Clínicas de reprodução humana",
    icone: "flask-conical",
    resumo: "Segurança anestésica em procedimentos de captação.",
    cenarios: [
      "Segurança anestésica em procedimentos de captação",
      "Apoio ao monitoramento de eletrólitos e hematócrito quando indicado",
    ],
    beneficios: ["Resultados dentro da clínica", "Equipamento compacto para estruturas enxutas"],
    cartuchos: ["cartucho-cg8"],
    segmentos_clientes: ["reproducao"],
    ordem: 11,
    ativo: true,
  },
  {
    slug: "pesquisa-ensino",
    nome: "Pesquisa e ensino",
    icone: "microscope",
    resumo: "Análises rápidas em campo e em laboratório.",
    cenarios: ["Análises rápidas em campo e em laboratório com equipamento portátil"],
    beneficios: ["Portabilidade para expedições e estudos de campo", "Vários painéis com um único analisador"],
    cartuchos: ["cartucho-cg8", "cartucho-cg4", "cartucho-chem8"],
    segmentos_clientes: ["pesquisa"],
    ordem: 12,
    ativo: true,
  },
];

type C = Partial<Cliente> & Pick<Cliente, "nome" | "segmento">;
const cliente = (c: C, i: number): Cliente => ({
  id: `seed-${i + 1}`,
  logo_url: null,
  segmentos_relacionados: [],
  unidades: null,
  cidade: null,
  uf: null,
  destaque: false,
  ordem: i + 1,
  ativo: true,
  ...c,
});

const DESTAQUES = new Set([
  "Unimed",
  "Hospital de Clínicas de Porto Alegre",
  "Vetex",
  "Gabevida",
  "Progenese",
  "Funpar",
  "Instituto Mamirauá",
  "Hospital Veterinário Darabas",
  "Clifert",
  "Biolab",
]);

const CLIENTES_BASE: C[] = [
  // Redes e grupos
  { nome: "Unimed", segmento: "redes", segmentos_relacionados: ["hospitais"], unidades: "Blumenau, Joinville, Criciúma" },
  {
    nome: "Vetex",
    segmento: "redes",
    segmentos_relacionados: ["veterinaria"],
    unidades: "Porto Alegre, Florianópolis, Blumenau, Balneário Camboriú, NiCare, Joinville, Curitiba, São Paulo, Fortaleza",
  },
  { nome: "Gabevida", segmento: "redes", unidades: "Santo Amaro, Praia do Sonho, Palhoça, Biguaçu" },
  // Hospitais
  { nome: "Hospital de Clínicas de Porto Alegre", segmento: "hospitais", cidade: "Porto Alegre", uf: "RS" },
  { nome: "Hospital São Roque", segmento: "hospitais" },
  { nome: "Hospital Nossa Senhora de Fátima", segmento: "hospitais" },
  { nome: "Hospital São Judas Tadeu", segmento: "hospitais" },
  { nome: "Hospital São Sebastião", segmento: "hospitais" },
  { nome: "Hospital Nossa Senhora das Dores", segmento: "hospitais" },
  { nome: "Hospital de Ipira", segmento: "hospitais" },
  { nome: "Hospital Frei Rogério", segmento: "hospitais" },
  { nome: "Hospital Santo Antônio (Tapejara)", segmento: "hospitais" },
  { nome: "Hospital São Benedito", segmento: "hospitais" },
  { nome: "Hospital de Guarnição", segmento: "hospitais" },
  { nome: "Hospital Amparo", segmento: "hospitais" },
  { nome: "Hospital BDW (Blanco)", segmento: "hospitais" },
  { nome: "Hospital Santo Antônio (Urubici)", segmento: "hospitais" },
  { nome: "Hospital Seara do Bem", segmento: "hospitais" },
  // Medicina veterinária
  { nome: "Hospital Veterinário Darabas", segmento: "veterinaria" },
  { nome: "Hospital Veterinário Vitá", segmento: "veterinaria" },
  { nome: "Centro Veterinário Porto Alegre", segmento: "veterinaria", cidade: "Porto Alegre", uf: "RS" },
  { nome: "Hospital Veterinário Porto Alegre", segmento: "veterinaria", cidade: "Porto Alegre", uf: "RS" },
  { nome: "Hospital Veterinário Stolf", segmento: "veterinaria" },
  { nome: "VetHouse", segmento: "veterinaria" },
  { nome: "R3 Animal", segmento: "veterinaria" },
  // Reprodução humana
  { nome: "Progenese", segmento: "reproducao" },
  { nome: "Clifert", segmento: "reproducao" },
  { nome: "Laboratório de Fertilidade Foz do Iguaçu", segmento: "reproducao" },
  // Pesquisa, ensino e laboratórios
  { nome: "Funpar", segmento: "pesquisa" },
  { nome: "Faergs", segmento: "pesquisa" },
  { nome: "Instituto Mamirauá", segmento: "pesquisa" },
  { nome: "Biolab", segmento: "pesquisa" },
  { nome: "Apoiolab", segmento: "pesquisa" },
  // Outros
  { nome: "Instituto Gaia", segmento: "outros" },
  { nome: "Vital Araçatuba", segmento: "outros" },
];

// Ordem da faixa de destaque (carrossel) segue a lista do briefing.
const ORDEM_DESTAQUE = [...DESTAQUES];
export const CLIENTES_SEED: Cliente[] = CLIENTES_BASE.map((c, i) => {
  const d = ORDEM_DESTAQUE.indexOf(c.nome);
  return cliente({ ...c, destaque: d >= 0, ordem: d >= 0 ? d + 1 : 100 + i }, i);
});

export const ESTATISTICAS = [
  { valor: 50, prefixo: "+", sufixo: "", rotulo: "clientes ativos" },
  { valor: 5, prefixo: "", sufixo: "", rotulo: "estados atendidos", detalhe: "SC, PR, RS, SP e CE" },
] as const;
