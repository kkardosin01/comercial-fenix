import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/admin/auth";
import { ENTIDADES, type Campo } from "@/lib/admin/entidades";
import { FormularioEntidade } from "@/components/admin/FormularioEntidade";
import { excluirEntidade } from "@/actions/admin/conteudo";
import { BotaoConfirmar } from "@/components/admin/BotaoConfirmar";

export default async function EditarEntidade({ params }: PageProps<"/admin/[entidade]/[chave]">) {
  const { entidade, chave: chaveBruta } = await params;
  const ent = ENTIDADES[entidade];
  if (!ent) notFound();
  const chave = decodeURIComponent(chaveBruta);
  const novo = chave === "novo";
  const { supabase } = await exigirAdmin();

  let registro: Record<string, unknown> = { ativo: true, ordem: 0 };
  if (!novo) {
    const { data } = await supabase.from(ent.tabela).select("*").eq(ent.chave, chave).maybeSingle();
    if (!data) notFound();
    registro = data;
  }

  // Opções dinâmicas: cartuchos recomendados vêm dos produtos cadastrados.
  let campos: Campo[] = ent.campos;
  if (ent.tabela === "areas") {
    const { data: produtos } = await supabase.from("produtos").select("slug, nome").order("ordem");
    campos = ent.campos.map((c) =>
      c.nome === "cartuchos" && c.tipo === "multipla"
        ? { ...c, opcoes: (produtos ?? []).map((p) => ({ valor: p.slug as string, rotulo: p.nome as string })) }
        : c,
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/${entidade}`} className="text-sm text-cinza hover:text-ouro">← {ent.titulo}</Link>
      <h1 className="mt-2 text-4xl uppercase">{novo ? `Novo ${ent.singular}` : `Editar ${ent.singular}`}</h1>
      <FormularioEntidade entidade={entidade} chaveOriginal={novo ? null : chave} campos={campos} registro={registro} />
      {!novo && (
        <form action={excluirEntidade.bind(null, entidade, chave)} className="mt-10 border-t border-white/10 pt-6">
          <BotaoConfirmar mensagem="Excluir este registro? Esta ação não pode ser desfeita." className="text-sm text-[#f3a397] underline underline-offset-4">
            Excluir {ent.singular}
          </BotaoConfirmar>
          <p className="mt-2 text-xs text-cinza">Dica: para ocultar sem apagar, desmarque “Ativo”.</p>
        </form>
      )}
    </div>
  );
}
