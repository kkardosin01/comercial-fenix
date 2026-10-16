"use server";
import { getAreas, getProdutos } from "@/lib/data";
import { enviarEmailsLead } from "@/lib/email";
import { dentroDoLimite } from "@/lib/seguranca/limite";
import { ipDoCliente, origemValida, tamanhoPermitido } from "@/lib/seguranca/requisicao";
import { validarTurnstile } from "@/lib/seguranca/turnstile";
import { supabaseServico } from "@/lib/supabase/service";
import { leadSchema } from "@/lib/validacao";

export type EstadoLead = {
  status: "inicial" | "sucesso" | "erro";
  emailEnviado?: boolean;
  mensagem?: string;
  erros?: Partial<Record<string, string>>;
  valores?: Record<string, string | string[]>;
};

const GENERICO = "Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.";

export async function enviarLead(_prev: EstadoLead, form: FormData): Promise<EstadoLead> {
  // Preserva o que a pessoa digitou em caso de erro (exceto o consentimento).
  const valores: Record<string, string | string[]> = {};
  for (const k of ["nome", "instituicao", "cargo", "email", "telefone", "area", "cidade", "uf", "mensagem"]) {
    valores[k] = String(form.get(k) ?? "").slice(0, 2000);
  }
  valores.produtos = form.getAll("produtos").map(String).slice(0, 20);

  if (!(await origemValida()) || !(await tamanhoPermitido(32 * 1024))) {
    return { status: "erro", mensagem: GENERICO, valores };
  }

  // Honeypot: campo invisível para pessoas. Se preenchido, finge sucesso para o robô.
  if (String(form.get("website") ?? "").length > 0) return { status: "sucesso" };

  const ip = await ipDoCliente();
  if (!(await dentroDoLimite("lead-ip", ip, 5, "10 m"))) {
    return { status: "erro", mensagem: "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.", valores };
  }

  const token = form.get("cf-turnstile-response");
  if (!(await validarTurnstile(typeof token === "string" ? token : null, ip))) {
    return { status: "erro", mensagem: "Não conseguimos confirmar que você não é um robô. Recarregue a página e tente de novo.", valores };
  }

  const parsed = leadSchema.safeParse({ ...valores, consentimento: form.get("consentimento") ?? undefined });
  if (!parsed.success) {
    const erros: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const campo = String(issue.path[0] ?? "form");
      erros[campo] ??= issue.message;
    }
    return { status: "erro", mensagem: "Confira os campos destacados.", erros, valores };
  }
  const lead = parsed.data;

  // Aceita apenas áreas e produtos existentes (evita gravar valores arbitrários).
  const [areas, produtos] = await Promise.all([getAreas(), getProdutos()]);
  const area = areas.find((a) => a.slug === lead.area);
  const produtosValidos = produtos.filter((p) => lead.produtos.includes(p.slug));

  const db = supabaseServico();
  if (db) {
    const { error } = await db.from("leads").insert({
      nome: lead.nome,
      instituicao: lead.instituicao,
      cargo: lead.cargo || null,
      email: lead.email,
      telefone: lead.telefone,
      area: area?.nome ?? null,
      produtos: produtosValidos.map((p) => p.nome),
      cidade: lead.cidade || null,
      uf: lead.uf || null,
      mensagem: lead.mensagem || null,
      consentimento_em: new Date().toISOString(),
      origem: "site",
    });
    if (error) {
      console.error("[lead] falha ao gravar", error.message);
      return { status: "erro", mensagem: GENERICO, valores };
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[lead] Supabase não configurado em produção.");
    return { status: "erro", mensagem: GENERICO, valores };
  }

  const r = await enviarEmailsLead(lead, { areaNome: area?.nome ?? "", produtosNomes: produtosValidos.map((p) => p.nome) });
  if (!db && !r.ok) console.info("[lead] (dev) lead recebido:", { ...lead, email: "***" });

  return { status: "sucesso", emailEnviado: r.ok };
}
