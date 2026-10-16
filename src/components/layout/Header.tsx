"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "motion/react";
import { Menu, X, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolado(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao navegar
  const [rotaAnterior, setRotaAnterior] = useState(pathname);
  if (rotaAnterior !== pathname) {
    setRotaAnterior(pathname);
    setAberto(false);
  }

  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-(--ease-premium)",
        rolado ? "border-b border-white/5 bg-ink/80 py-2 backdrop-blur-xl" : "bg-transparent py-4",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-ouro px-4 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex items-center justify-between gap-6">
        <Logo compacto={rolado} />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={ativo(item.href) ? "page" : undefined}
                  className={clsx(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    ativo(item.href) ? "text-ouro" : "text-creme/85 hover:text-creme",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-ouro transition-transform duration-500 ease-(--ease-premium)",
                      ativo(item.href) ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contato#orcamento"
            className="hidden rounded-full bg-ouro px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ouro-claro md:inline-flex"
          >
            Solicitar orçamento
          </Link>

          <Dialog.Root open={aberto} onOpenChange={setAberto}>
            <Dialog.Trigger
              className="inline-flex size-12 items-center justify-center rounded-full border border-white/10 text-creme lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>
            <AnimatePresence>
              {aberto && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild forceMount>
                    <m.div
                      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild forceMount>
                    <m.div
                      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-carvao p-6 shadow-2xl"
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="eyebrow">Menu</Dialog.Title>
                        <Dialog.Close
                          className="inline-flex size-12 items-center justify-center rounded-full border border-white/10"
                          aria-label="Fechar menu"
                        >
                          <X className="size-5" aria-hidden />
                        </Dialog.Close>
                      </div>
                      <Dialog.Description className="sr-only">Navegação principal do site</Dialog.Description>
                      <nav aria-label="Menu móvel" className="mt-10 flex-1">
                        <ul className="space-y-1">
                          {NAV.map((item, i) => (
                            <m.li
                              key={item.href}
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <Link
                                href={item.href}
                                aria-current={ativo(item.href) ? "page" : undefined}
                                className={clsx(
                                  "block py-3 font-display text-3xl uppercase",
                                  ativo(item.href) ? "text-ouro" : "text-creme",
                                )}
                              >
                                {item.label}
                              </Link>
                            </m.li>
                          ))}
                        </ul>
                      </nav>
                      <div className="space-y-3 border-t border-white/10 pt-6">
                        <Link
                          href="/contato#orcamento"
                          className="flex min-h-12 items-center justify-center rounded-full bg-ouro font-semibold text-ink"
                        >
                          Solicitar orçamento
                        </Link>
                        <a
                          href={SITE.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ouro/50 font-semibold"
                        >
                          <MessageCircle className="size-4" aria-hidden /> {SITE.telefoneExibicao}
                        </a>
                      </div>
                    </m.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
