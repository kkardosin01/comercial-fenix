// Configuração das entidades editáveis no painel (serializável: usada no servidor e no formulário).
import { SEGMENTOS } from "@/lib/types";
import { ICONES_NOMES } from "./icones-nomes";

export type Campo =
  | { nome: string; rotulo: string; tipo: "texto" | "url"; obrigatorio?: boolean; max?: number; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "textarea"; obrigatorio?: boolean; max?: number; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "linhas"; ajuda?: string } // array de textos, um por linha
  | { nome: string; rotulo: string; tipo: "numero"; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "booleano"; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "selecao"; opcoes: { valor: string; rotulo: string }[]; obrigatorio?: boolean; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "multipla"; opcoes: { valor: string; rotulo: string }[]; ajuda?: string }
  | { nome: string; rotulo: string; tipo: "imagem"; ajuda?: string };

export type Entidade = {
  tabela: "produtos" | "areas" | "clientes" | "depoimentos";
  titulo: string;
  singular: string;
  chave: "slug" | "id";
  colunasLista: string[];
  campos: Campo[];
};

const segmentos = Object.entries(SEGMENTOS).map(([valor, rotulo]) => ({ valor, rotulo }));

export const ENTIDADES: Record<string, Entidade> = {
  produtos: {
    tabela: "produtos",
    titulo: "Produtos",
    singular: "produto",
    chave: "slug",
    colunasLista: ["nome", "tipo", "ordem", "ativo"],
    campos: [
      { nome: "slug", rotulo: "Identificador na URL", tipo: "texto", obrigatorio: true, max: 60, ajuda: "Letras minúsculas, números e hífen. Ex.: cartucho-cg8" },
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, max: 120 },
      { nome: "tipo", rotulo: "Tipo", tipo: "selecao", obrigatorio: true, opcoes: [{ valor: "analisador", rotulo: "Analisador" }, { valor: "cartucho", rotulo: "Cartucho" }] },
      { nome: "resumo", rotulo: "Resumo", tipo: "textarea", max: 400 },
      { nome: "descricao", rotulo: "Descrição", tipo: "textarea", max: 4000 },
      { nome: "parametros", rotulo: "Parâmetros (um por linha)", tipo: "linhas" },
      { nome: "destaques", rotulo: "Destaques (um por linha)", tipo: "linhas" },
      { nome: "sob_consulta", rotulo: "Selo “sob consulta”", tipo: "booleano" },
      { nome: "imagem_url", rotulo: "Imagem", tipo: "imagem", ajuda: "Opcional. Sem imagem, o site usa a ilustração padrão." },
      { nome: "ordem", rotulo: "Ordem", tipo: "numero" },
      { nome: "ativo", rotulo: "Ativo (visível no site)", tipo: "booleano" },
    ],
  },
  areas: {
    tabela: "areas",
    titulo: "Áreas (explorador)",
    singular: "área",
    chave: "slug",
    colunasLista: ["nome", "ordem", "ativo"],
    campos: [
      { nome: "slug", rotulo: "Identificador na URL", tipo: "texto", obrigatorio: true, max: 60, ajuda: "Letras minúsculas, números e hífen." },
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, max: 120 },
      { nome: "icone", rotulo: "Ícone", tipo: "selecao", obrigatorio: true, opcoes: ICONES_NOMES.map((n) => ({ valor: n, rotulo: n })) },
      { nome: "resumo", rotulo: "Resumo", tipo: "textarea", max: 400 },
      { nome: "cenarios", rotulo: "Cenários de uso (um por linha)", tipo: "linhas" },
      { nome: "beneficios", rotulo: "Benefícios práticos (um por linha)", tipo: "linhas" },
      { nome: "cartuchos", rotulo: "Cartuchos recomendados", tipo: "multipla", opcoes: [], ajuda: "Preenchido com os produtos cadastrados." },
      { nome: "segmentos_clientes", rotulo: "Segmentos de clientes exibidos", tipo: "multipla", opcoes: segmentos },
      { nome: "ordem", rotulo: "Ordem", tipo: "numero" },
      { nome: "ativo", rotulo: "Ativo (visível no site)", tipo: "booleano" },
    ],
  },
  clientes: {
    tabela: "clientes",
    titulo: "Clientes",
    singular: "cliente",
    chave: "id",
    colunasLista: ["nome", "segmento", "destaque", "ordem", "ativo"],
    campos: [
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, max: 160 },
      { nome: "logo_url", rotulo: "Logo", tipo: "imagem", ajuda: "SVG, PNG, JPG ou WebP até 2 MB. Sem logo, o nome aparece em tipografia." },
      { nome: "segmento", rotulo: "Segmento", tipo: "selecao", obrigatorio: true, opcoes: segmentos },
      { nome: "segmentos_relacionados", rotulo: "Também aparece nos segmentos", tipo: "multipla", opcoes: segmentos },
      { nome: "unidades", rotulo: "Unidades atendidas", tipo: "texto", max: 600 },
      { nome: "cidade", rotulo: "Cidade", tipo: "texto", max: 120 },
      { nome: "uf", rotulo: "UF", tipo: "texto", max: 2 },
      { nome: "destaque", rotulo: "Destaque (carrossel de logos)", tipo: "booleano" },
      { nome: "ordem", rotulo: "Ordem", tipo: "numero" },
      { nome: "ativo", rotulo: "Ativo (visível no site)", tipo: "booleano" },
    ],
  },
  depoimentos: {
    tabela: "depoimentos",
    titulo: "Depoimentos",
    singular: "depoimento",
    chave: "id",
    colunasLista: ["nome", "instituicao", "ordem", "ativo"],
    campos: [
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true, max: 120 },
      { nome: "cargo", rotulo: "Cargo", tipo: "texto", obrigatorio: true, max: 120 },
      { nome: "instituicao", rotulo: "Instituição", tipo: "texto", obrigatorio: true, max: 160 },
      { nome: "texto", rotulo: "Depoimento", tipo: "textarea", obrigatorio: true, max: 1200, ajuda: "Somente depoimentos reais, com autorização da pessoa." },
      { nome: "ordem", rotulo: "Ordem", tipo: "numero" },
      { nome: "ativo", rotulo: "Ativo (visível no site)", tipo: "booleano" },
    ],
  },
};
