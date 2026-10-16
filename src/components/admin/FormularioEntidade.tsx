"use client";
import { useActionState } from "react";
import { salvarEntidade, type EstadoSalvar } from "@/actions/admin/conteudo";
import type { Campo } from "@/lib/admin/entidades";

type Props = { entidade: string; chaveOriginal: string | null; campos: Campo[]; registro: Record<string, unknown> };

export function FormularioEntidade({ entidade, chaveOriginal, campos, registro }: Props) {
  const [estado, acao, pendente] = useActionState<EstadoSalvar, FormData>(
    salvarEntidade.bind(null, entidade, chaveOriginal),
    {},
  );

  return (
    <form action={acao} className="mt-8 space-y-6">
      {campos.map((c) => {
        const id = `campo-${c.nome}`;
        const v = registro[c.nome];
        const erro = estado.erros?.[c.nome];
        const rotulo = (
          <label htmlFor={id} className="mb-2 block text-sm font-medium">
            {c.rotulo} {"obrigatorio" in c && c.obrigatorio && <span className="text-ouro">*</span>}
          </label>
        );
        const ajuda = (c.ajuda || erro) && (
          <p className={`mt-1.5 text-xs ${erro ? "text-[#f3a397]" : "text-cinza"}`}>{erro ?? c.ajuda}</p>
        );
        switch (c.tipo) {
          case "texto":
          case "url":
            return (
              <div key={c.nome}>
                {rotulo}
                <input id={id} name={c.nome} defaultValue={(v as string) ?? ""} maxLength={c.max} required={c.obrigatorio} className="campo" aria-invalid={erro ? true : undefined} />
                {ajuda}
              </div>
            );
          case "textarea":
            return (
              <div key={c.nome}>
                {rotulo}
                <textarea id={id} name={c.nome} defaultValue={(v as string) ?? ""} maxLength={c.max} required={c.obrigatorio} rows={4} className="campo" />
                {ajuda}
              </div>
            );
          case "linhas":
            return (
              <div key={c.nome}>
                {rotulo}
                <textarea id={id} name={c.nome} defaultValue={Array.isArray(v) ? v.join("\n") : ""} rows={5} className="campo" />
                {ajuda}
              </div>
            );
          case "numero":
            return (
              <div key={c.nome} className="max-w-40">
                {rotulo}
                <input id={id} name={c.nome} type="number" defaultValue={Number(v ?? 0)} className="campo" />
                {ajuda}
              </div>
            );
          case "booleano":
            return (
              <label key={c.nome} className="flex items-center gap-3 text-sm">
                <input type="checkbox" name={c.nome} defaultChecked={Boolean(v)} className="size-5 accent-[#CDA35C]" />
                {c.rotulo}
              </label>
            );
          case "selecao":
            return (
              <div key={c.nome}>
                {rotulo}
                <select id={id} name={c.nome} defaultValue={(v as string) ?? ""} required={c.obrigatorio} className="campo">
                  <option value="">Selecione…</option>
                  {c.opcoes.map((o) => (
                    <option key={o.valor} value={o.valor}>{o.rotulo}</option>
                  ))}
                </select>
                {ajuda}
              </div>
            );
          case "multipla":
            return (
              <fieldset key={c.nome}>
                <legend className="mb-2 text-sm font-medium">{c.rotulo}</legend>
                <div className="flex flex-wrap gap-2">
                  {c.opcoes.map((o) => (
                    <label key={o.valor} className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-sm">
                      <input type="checkbox" name={c.nome} value={o.valor} defaultChecked={Array.isArray(v) && v.includes(o.valor)} className="accent-[#CDA35C]" />
                      {o.rotulo}
                    </label>
                  ))}
                </div>
                {ajuda}
              </fieldset>
            );
          case "imagem":
            return (
              <div key={c.nome}>
                {rotulo}
                <input type="hidden" name={`${c.nome}__atual`} value={(v as string) ?? ""} />
                {typeof v === "string" && v && (
                  <div className="mb-3 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v} alt="" className="h-16 w-auto rounded-lg bg-white p-2" />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name={`${c.nome}__remover`} className="accent-[#CDA35C]" /> Remover imagem
                    </label>
                  </div>
                )}
                <input
                  id={id}
                  type="file"
                  name={`${c.nome}__arquivo`}
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ouro file:px-4 file:py-2 file:font-semibold file:text-ink"
                />
                {ajuda}
              </div>
            );
        }
      })}

      <p aria-live="polite" className="min-h-5 text-sm text-[#f3a397]">{estado.erro}</p>
      <button disabled={pendente} className="min-h-12 rounded-full bg-ouro px-8 font-semibold text-ink disabled:opacity-60">
        {pendente ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}
