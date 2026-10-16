"use client";
import type { ReactNode } from "react";

/** Botão de envio que pede confirmação antes de ações irreversíveis. */
export function BotaoConfirmar({ mensagem, children, className }: { mensagem: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(mensagem)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
