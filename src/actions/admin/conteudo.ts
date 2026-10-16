"use server";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { exigirAdmin } from "@/lib/admin/auth";
import { ENTIDADES, type Campo } from "@/lib/admin/entidades";
import { enviarImagem } from "@/lib/admin/upload";
import { TAG_CONTEUDO } from "@/lib/data";
import { origemValida } from "@/lib/seguranca/requisicao";
import { limparTexto } from "@/lib/validacao";
import { LEAD_STATUS } from "@/lib/types";

export type EstadoSalvar = { erro?: string; erros?: Record<string, string> };

const SLUG = /^[a-z0-9-]{2,60}$/;

async function opcoesValidas(supabase: Awaited<ReturnType<typeof exigirAdmin>>["supabase"], campo: Campo) {
  if (campo.tipo !== "multipla" && campo.tipo !== "selecao") return [];
  if (campo.nome === "cartuchos") {
    const { data } = await supabase.from("produtos").select("slug");
    return (data ?? []).map((p) => p.slug as string);
  }
  return campo.opcoes.map((o) => o.valor);
}

export async function salvarEntidade(
  entidadeKey: string,
  chaveOriginal: string | null,
  _prev: EstadoSalvar,
  form: FormData,
): Promise<EstadoSalvar> {
  if (!(await origemValida())) return { erro: "Requisição inválida." };
  const { supabase } = await exigirAdmin();
  const ent = ENTIDADES[entidadeKey];
  if (!ent) return { erro: "Entidade inválida." };

  const registro: Record<string, unknown> = {};
  const erros: Record<string, string> = {};

  for (const c of ent.campos) {
    const bruto = form.get(c.nome);
    switch (c.tipo) {
      case "texto":
      case "url":
      case "textarea": {
        const v = limparTexto(String(bruto ?? ""));
        if (c.obrigatorio && !v) erros[c.nome] = "Obrigatório.";
        else if (c.max && v.length > c.max) erros[c.nome] = `Máximo de ${c.max} caracteres.`;
        if (c.nome === "slug" && !SLUG.test(v)) erros[c.nome] = "Use só letras minúsculas, números e hífen (2 a 60).";
        if (c.nome === "uf" && v && !/^[A-Za-z]{2}$/.test(v)) erros[c.nome] = "UF com 2 letras.";
        registro[c.nome] = c.nome === "uf" ? v.toUpperCase() || null : v || (c.obrigatorio ? v : c.tipo === "textarea" ? "" : null);
        break;
      }
      case "linhas":
        registro[c.nome] = String(bruto ?? "")
          .split(/\r?\n/)
          .map(limparTexto)
          .filter(Boolean)
          .slice(0, 50)
          .map((l) => l.slice(0, 300));
        break;
      case "numero": {
        const n = Number.parseInt(String(bruto ?? "0"), 10);
        registro[c.nome] = Number.isFinite(n) ? Math.max(-9999, Math.min(9999, n)) : 0;
        break;
      }
      case "booleano":
        registro[c.nome] = bruto === "on";
        break;
      case "selecao": {
        const validas = await opcoesValidas(supabase, c);
        const v = String(bruto ?? "");
        if (!validas.includes(v)) erros[c.nome] = "Selecione uma opção válida.";
        registro[c.nome] = v;
        break;
      }
      case "multipla": {
        const validas = await opcoesValidas(supabase, c);
        registro[c.nome] = form.getAll(c.nome).map(String).filter((v) => validas.includes(v));
        break;
      }
      case "imagem": {
        const arquivo = form.get(`${c.nome}__arquivo`);
        const atual = String(form.get(`${c.nome}__atual`) ?? "") || null;
        if (form.get(`${c.nome}__remover`) === "on") registro[c.nome] = null;
        else if (arquivo instanceof File && arquivo.size > 0) {
          const r = await enviarImagem(supabase, arquivo, ent.tabela);
          if ("erro" in r) erros[c.nome] = r.erro;
          else registro[c.nome] = r.url;
        } else registro[c.nome] = atual;
        break;
      }
    }
  }

  if (Object.keys(erros).length) return { erro: "Confira os campos destacados.", erros };

  const q = chaveOriginal
    ? supabase.from(ent.tabela).update(registro).eq(ent.chave, chaveOriginal)
    : supabase.from(ent.tabela).insert(registro);
  const { error } = await q;
  if (error) {
    if (error.code === "23505") return { erro: "Já existe um registro com esse identificador." };
    console.error("[admin] salvar", ent.tabela, error.message);
    return { erro: "Não foi possível salvar. Verifique os dados e tente novamente." };
  }

  updateTag(TAG_CONTEUDO);
  redirect(`/admin/${entidadeKey}?ok=salvo`);
}

export async function excluirEntidade(entidadeKey: string, chave: string) {
  if (!(await origemValida())) return;
  const { supabase } = await exigirAdmin();
  const ent = ENTIDADES[entidadeKey];
  if (!ent) return;
  const { error } = await supabase.from(ent.tabela).delete().eq(ent.chave, chave);
  if (error) console.error("[admin] excluir", ent.tabela, error.message);
  updateTag(TAG_CONTEUDO);
  redirect(`/admin/${entidadeKey}?ok=${error ? "erro" : "excluido"}`);
}

export async function atualizarLead(id: string, form: FormData) {
  if (!(await origemValida())) return;
  const { supabase } = await exigirAdmin();
  const status = String(form.get("status") ?? "");
  if (!(status in LEAD_STATUS)) return;
  const notas = limparTexto(String(form.get("notas") ?? "")).slice(0, 4000) || null;
  const { error } = await supabase.from("leads").update({ status, notas }).eq("id", id);
  if (error) console.error("[admin] lead", error.message);
  const volta = String(form.get("volta") ?? "/admin/leads");
  redirect(volta.startsWith("/admin/leads") ? volta : "/admin/leads");
}

/** Exclusão definitiva (ex.: pedido do titular pela LGPD). */
export async function excluirLead(id: string) {
  if (!(await origemValida())) return;
  const { supabase } = await exigirAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) console.error("[admin] excluir lead", error.message);
  redirect("/admin/leads?ok=excluido");
}
