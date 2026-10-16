import { clsx } from "clsx";
import type { Cliente } from "@/lib/types";

// Logo do cliente (escala de cinza → cor no hover) ou, sem logo, o nome em tipografia elegante.
export function MarcaCliente({ cliente, className }: { cliente: Pick<Cliente, "nome" | "logo_url">; className?: string }) {
  if (cliente.logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cliente.logo_url}
        alt={cliente.nome}
        loading="lazy"
        className={clsx(
          "max-h-14 w-auto max-w-[180px] object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0",
          className,
        )}
      />
    );
  }
  return (
    <span
      className={clsx(
        "font-display text-xl leading-tight tracking-wide whitespace-nowrap text-creme/60 uppercase transition-colors duration-500 group-hover:text-ouro md:text-2xl",
        className,
      )}
    >
      {cliente.nome}
    </span>
  );
}
