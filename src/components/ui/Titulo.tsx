import { clsx } from "clsx";
import { TextReveal } from "./TextReveal";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  titulo: string;
  destaque?: string[];
  texto?: string;
  alinhamento?: "esquerda" | "centro";
  claro?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export function Titulo({ eyebrow, titulo, destaque, texto, alinhamento = "esquerda", claro, as = "h2", className }: Props) {
  return (
    <div className={clsx("max-w-3xl", alinhamento === "centro" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={12}>
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
      )}
      <TextReveal
        as={as}
        texto={titulo}
        destaque={destaque}
        className={clsx(
          "text-4xl leading-[1.02] font-medium uppercase md:text-6xl",
          claro ? "text-ink" : "text-creme",
        )}
      />
      {texto && (
        <Reveal delay={0.15}>
          <p className={clsx("mt-6 text-lg leading-relaxed", claro ? "text-cinza-escuro" : "text-cinza")}>{texto}</p>
        </Reveal>
      )}
    </div>
  );
}
