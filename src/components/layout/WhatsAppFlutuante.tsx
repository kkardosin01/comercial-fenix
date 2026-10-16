"use client";
import { m } from "motion/react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFlutuante() {
  return (
    <m.a
      href={whatsappLink("Olá! Vim pelo site da Comercial Fênix e gostaria de mais informações sobre o i-STAT.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp (abre em nova aba)"
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-3 md:right-6 md:bottom-6"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-carvao-2 px-4 py-2 text-sm font-medium text-creme opacity-0 shadow-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Fale conosco
      </span>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-[#0A0A0A] shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/40" aria-hidden />
        <svg viewBox="0 0 32 32" className="relative size-7" aria-hidden fill="currentColor">
          <path d="M16.04 3C9.4 3 4 8.32 4 14.88c0 2.32.68 4.48 1.86 6.32L4 29l8.04-1.82a12.2 12.2 0 0 0 4 .68C22.68 27.86 28 22.54 28 15.98 28 9.42 22.68 3 16.04 3Zm0 22.62c-1.28 0-2.52-.24-3.68-.72l-.26-.12-4.78 1.08 1.1-4.56-.18-.28a9.6 9.6 0 0 1-1.5-5.14c0-5.34 4.02-9.66 9.3-9.66 5.24 0 9.5 4.4 9.5 9.76 0 5.36-4.26 9.64-9.5 9.64Zm5.2-7.1c-.28-.14-1.68-.82-1.94-.92-.26-.1-.46-.14-.64.14-.2.28-.74.92-.9 1.1-.16.2-.34.2-.62.08-.28-.14-1.2-.44-2.28-1.4-.84-.74-1.4-1.66-1.58-1.94-.16-.28-.02-.44.12-.58.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.2.04-.36-.02-.5-.08-.14-.64-1.54-.88-2.1-.22-.56-.46-.48-.64-.48h-.54c-.2 0-.5.06-.76.36-.26.28-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.94.14.2 2 3.06 4.86 4.28.68.3 1.2.46 1.62.6.68.22 1.3.18 1.8.1.54-.08 1.68-.68 1.92-1.34.24-.66.24-1.22.16-1.34-.06-.12-.26-.2-.54-.32Z" />
        </svg>
      </span>
    </m.a>
  );
}
