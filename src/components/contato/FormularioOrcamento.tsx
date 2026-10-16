"use client";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useId, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { clsx } from "clsx";
import { enviarLead, type EstadoLead } from "@/actions/lead";
import { UFS } from "@/lib/ufs";
import { SITE, whatsappLink } from "@/lib/site";

type Opcao = { slug: string; nome: string };
type Props = { areas: Opcao[]; produtos: Opcao[] };

declare global {
  interface Window {
    turnstile?: { reset: (el?: string | HTMLElement) => void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function FormularioOrcamento({ areas, produtos }: Props) {
  const params = useSearchParams();
  const [estado, acao, enviando] = useActionState<EstadoLead, FormData>(enviarLead, { status: "inicial" });
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const areaInicial = params.get("area") ?? "";
  const produtoInicial = params.get("produto") ?? "";
  const v = estado.valores;
  const valor = (k: string, padrao = "") => (typeof v?.[k] === "string" ? (v[k] as string) : padrao);
  const produtosMarcados = Array.isArray(v?.produtos) ? (v.produtos as string[]) : produtoInicial ? [produtoInicial] : [];
  const erro = (k: string) => estado.erros?.[k];

  // Após erro, o token do Turnstile já foi consumido: gera um novo.
  useEffect(() => {
    if (estado.status === "erro") window.turnstile?.reset();
    if (estado.status === "erro" && estado.erros) {
      const primeiro = Object.keys(estado.erros)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus();
    }
  }, [estado]);

  if (estado.status === "sucesso") return <Sucesso />;

  const campo = (nome: string, rotulo: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, obrigatorio = true) => (
    <div>
      <label htmlFor={`${id}-${nome}`} className="mb-2 block text-sm font-medium text-creme/90">
        {rotulo} {obrigatorio && <span className="text-ouro" aria-hidden>*</span>}
      </label>
      <input
        id={`${id}-${nome}`}
        name={nome}
        required={obrigatorio}
        defaultValue={valor(nome)}
        aria-invalid={erro(nome) ? true : undefined}
        aria-describedby={erro(nome) ? `${id}-${nome}-erro` : undefined}
        className="campo"
        {...props}
      />
      {erro(nome) && (
        <p id={`${id}-${nome}-erro`} className="mt-1.5 text-sm text-[#f3a397]">
          {erro(nome)}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} action={acao} noValidate={false} className="space-y-5" aria-describedby={`${id}-status`}>
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}

      <div className="grid gap-5 sm:grid-cols-2">
        {campo("nome", "Nome", { autoComplete: "name", maxLength: 120 })}
        {campo("instituicao", "Instituição", { autoComplete: "organization", maxLength: 160 })}
        {campo("cargo", "Cargo", { autoComplete: "organization-title", maxLength: 120 }, false)}
        {campo("email", "E-mail", { type: "email", autoComplete: "email", maxLength: 160 })}
        {campo("telefone", "Telefone / WhatsApp", { type: "tel", autoComplete: "tel", inputMode: "tel", maxLength: 30, placeholder: "(48) 99999-9999" })}
        <div>
          <label htmlFor={`${id}-area`} className="mb-2 block text-sm font-medium text-creme/90">
            Área de atuação
          </label>
          <select id={`${id}-area`} name="area" defaultValue={valor("area", areaInicial)} className="campo">
            <option value="">Selecione…</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-creme/90">Produtos de interesse</legend>
        <div className="flex flex-wrap gap-2">
          {produtos.map((p) => (
            <label key={p.slug} className="cursor-pointer">
              <input
                type="checkbox"
                name="produtos"
                value={p.slug}
                defaultChecked={produtosMarcados.includes(p.slug)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-4 text-sm transition-colors peer-checked:border-ouro peer-checked:bg-ouro peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ouro hover:border-ouro/60">
                {p.nome}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        {campo("cidade", "Cidade", { autoComplete: "address-level2", maxLength: 120 }, false)}
        <div>
          <label htmlFor={`${id}-uf`} className="mb-2 block text-sm font-medium text-creme/90">
            UF
          </label>
          <select id={`${id}-uf`} name="uf" defaultValue={valor("uf")} className="campo" autoComplete="address-level1">
            <option value="">—</option>
            {UFS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-mensagem`} className="mb-2 block text-sm font-medium text-creme/90">
          Mensagem
        </label>
        <textarea
          id={`${id}-mensagem`}
          name="mensagem"
          rows={4}
          maxLength={2000}
          defaultValue={valor("mensagem")}
          className="campo resize-y"
          placeholder="Conte um pouco sobre a sua necessidade (volume mensal, setores, prazos)."
        />
      </div>

      {/* Honeypot: invisível para pessoas e leitores de tela */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-creme/85">
          <input
            type="checkbox"
            name="consentimento"
            required
            aria-invalid={erro("consentimento") ? true : undefined}
            className="mt-0.5 size-5 shrink-0 accent-[#CDA35C]"
          />
          <span>
            Li e concordo com a{" "}
            <Link href="/politica-de-privacidade" target="_blank" className="text-ouro underline underline-offset-4">
              Política de Privacidade
            </Link>{" "}
            e autorizo o uso dos meus dados para retorno sobre esta solicitação. <span className="text-ouro" aria-hidden>*</span>
          </span>
        </label>
        {erro("consentimento") && <p className="mt-1.5 text-sm text-[#f3a397]">{erro("consentimento")}</p>}
      </div>

      {SITE_KEY && <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="dark" data-language="pt-br" />}

      <div id={`${id}-status`} aria-live="polite">
        {estado.status === "erro" && estado.mensagem && (
          <p className="flex items-start gap-2 rounded-xl border border-[#f3a397]/40 bg-[#f3a397]/10 px-4 py-3 text-sm text-[#f7c2b9]">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {estado.mensagem}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={enviando}
        className={clsx(
          "group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ouro px-8 font-semibold text-ink transition-all hover:bg-ouro-claro active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-auto",
        )}
      >
        {enviando ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Enviando…
          </>
        ) : (
          <>
            Enviar solicitação
            <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

function Sucesso() {
  return (
    <AnimatePresence>
      <m.div
        role="status"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center rounded-3xl border border-ouro/30 bg-ouro/5 px-6 py-16 text-center"
      >
        <svg viewBox="0 0 80 80" className="size-24" aria-hidden>
          <m.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#CDA35C"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <m.path
            d="M24 41l11 11 21-23"
            fill="none"
            stroke="#E8CF9B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          />
        </svg>
        <m.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-4xl uppercase"
        >
          Solicitação enviada!
        </m.h3>
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          className="mt-4 max-w-md text-cinza"
        >
          Obrigado pelo contato. Enviamos uma confirmação para o seu e-mail e retornaremos em breve, em horário
          comercial. Se preferir, fale agora pelo{" "}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-ouro underline underline-offset-4">
            WhatsApp {SITE.telefoneExibicao}
          </a>
          .
        </m.p>
      </m.div>
    </AnimatePresence>
  );
}
