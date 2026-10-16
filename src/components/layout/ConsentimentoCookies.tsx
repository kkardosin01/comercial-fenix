"use client";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "motion/react";
import { Analytics } from "@vercel/analytics/next";

type Escolha = "aceito" | "recusado" | null;
const CHAVE = "fenix-consentimento-v1";
const EVENTO = "fenix-consentimento";

function lerEscolha(): Escolha {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}
function gravar(v: Escolha) {
  try {
    if (v) localStorage.setItem(CHAVE, v);
    else localStorage.removeItem(CHAVE);
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}
const assinar = (cb: () => void) => {
  window.addEventListener(EVENTO, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENTO, cb);
    window.removeEventListener("storage", cb);
  };
};

/** Botão do rodapé para reabrir as preferências. */
export function BotaoPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => gravar(null)}>
      Preferências de cookies
    </button>
  );
}

export function ConsentimentoCookies() {
  const escolha = useSyncExternalStore(assinar, lerEscolha, () => "pendente" as const);
  // Evita piscar o banner antes de ler o armazenamento local.
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPronto(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {escolha === "aceito" && <Analytics />}
      <AnimatePresence>
        {pronto && escolha === null && (
          <m.div
            role="region"
            aria-label="Aviso de cookies"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-50 max-w-md rounded-2xl border border-white/10 bg-carvao-2/95 p-5 pr-5 shadow-2xl backdrop-blur-xl sm:right-auto sm:left-6 sm:bottom-6 max-sm:mr-20"
          >
            <p className="text-sm leading-relaxed text-creme/90">
              Usamos apenas cookies essenciais para o funcionamento do site. Com a sua permissão, também coletamos
              estatísticas de visita anônimas para melhorar a experiência. Saiba mais na{" "}
              <Link href="/politica-de-privacidade" className="text-ouro underline underline-offset-4">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => gravar("aceito")}
                className="min-h-11 rounded-full bg-ouro px-5 text-sm font-semibold text-ink transition-colors hover:bg-ouro-claro"
              >
                Aceitar estatísticas
              </button>
              <button
                type="button"
                onClick={() => gravar("recusado")}
                className="min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold text-creme transition-colors hover:border-ouro"
              >
                Somente essenciais
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
