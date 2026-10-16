export const SEGMENTOS = {
  redes: "Redes e grupos",
  hospitais: "Hospitais",
  veterinaria: "Medicina veterinária",
  reproducao: "Reprodução humana",
  pesquisa: "Pesquisa, ensino e laboratórios",
  outros: "Outros",
} as const;
export type Segmento = keyof typeof SEGMENTOS;
export const SEGMENTO_KEYS = Object.keys(SEGMENTOS) as Segmento[];

export type Produto = {
  slug: string;
  nome: string;
  tipo: "analisador" | "cartucho";
  resumo: string;
  descricao: string;
  parametros: string[];
  destaques: string[];
  sob_consulta: boolean;
  imagem_url: string | null;
  ordem: number;
  ativo: boolean;
};

export type Area = {
  slug: string;
  nome: string;
  icone: string;
  resumo: string;
  cenarios: string[];
  beneficios: string[];
  cartuchos: string[]; // slugs de produtos
  segmentos_clientes: Segmento[];
  ordem: number;
  ativo: boolean;
};

export type Cliente = {
  id: string;
  nome: string;
  logo_url: string | null;
  segmento: Segmento;
  segmentos_relacionados: Segmento[];
  unidades: string | null;
  cidade: string | null;
  uf: string | null;
  destaque: boolean;
  ordem: number;
  ativo: boolean;
};

export type Depoimento = {
  id: string;
  nome: string;
  cargo: string;
  instituicao: string;
  texto: string;
  ordem: number;
  ativo: boolean;
};

export const LEAD_STATUS = {
  novo: "Novo",
  em_contato: "Em contato",
  proposta: "Proposta",
  fechado: "Fechado",
} as const;
export type LeadStatus = keyof typeof LEAD_STATUS;

export type Lead = {
  id: string;
  created_at: string;
  nome: string;
  instituicao: string;
  cargo: string | null;
  email: string;
  telefone: string;
  area: string | null;
  produtos: string[];
  cidade: string | null;
  uf: string | null;
  mensagem: string | null;
  status: LeadStatus;
  notas: string | null;
};
