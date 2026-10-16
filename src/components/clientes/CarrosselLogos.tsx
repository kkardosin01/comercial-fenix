import type { Cliente } from "@/lib/types";
import { MarcaCliente } from "./MarcaCliente";

// Carrossel infinito em CSS puro (pausa no hover; parado com prefers-reduced-motion).
export function CarrosselLogos({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length === 0) return null;
  const itens = [...clientes, ...clientes];
  return (
    <div
      className="group/marquee relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      style={{ ["--marquee-duration" as string]: `${Math.max(30, clientes.length * 5)}s` }}
    >
      <ul className="sr-only">
        {clientes.map((c) => (
          <li key={c.id}>{c.nome}</li>
        ))}
      </ul>
      <div aria-hidden className="flex w-max animate-marquee items-center group-hover/marquee:[animation-play-state:paused]">
        {itens.map((c, i) => (
          <div key={`${c.id}-${i}`} className="group flex h-20 shrink-0 items-center px-8 md:px-12">
            <MarcaCliente cliente={c} />
            <span className="ml-16 size-1.5 rounded-full bg-ouro/40 md:ml-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
