import Link from "next/link";
import { clsx } from "clsx";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variante = "ouro" | "contorno" | "escuro";

const estilos: Record<Variante, string> = {
  ouro: "bg-ouro text-ink hover:bg-ouro-claro shadow-[0_10px_40px_-12px_rgba(205,163,92,0.55)]",
  contorno: "border border-ouro/60 text-creme hover:border-ouro hover:bg-ouro/10",
  escuro: "bg-ink text-creme hover:bg-carvao-2",
};

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variante?: Variante;
  icone?: ReactNode | false;
  className?: string;
  externo?: boolean;
};

export function Botao({ variante = "ouro", icone, className, children, externo, ...rest }: Props) {
  const ext = externo ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link
      {...rest}
      {...ext}
      className={clsx(
        "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-semibold tracking-wide transition-all duration-300 ease-(--ease-premium) active:scale-[0.97]",
        estilos[variante],
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icone === false ? null : (
          icone ?? (
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )
        )}
      </span>
    </Link>
  );
}
