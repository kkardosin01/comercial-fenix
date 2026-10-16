"use client";
import { m } from "motion/react";
import { createElement, Fragment, type CSSProperties } from "react";

type Props = {
  texto: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  destaque?: string[]; // palavras exibidas em dourado
  imediato?: boolean; // anima no carregamento (hero) via CSS, sem esperar a hidratação
};

const limpa = (p: string) => p.replace(/[.,;:!?]/g, "");

// Revela o texto palavra a palavra, com máscara (estilo editorial).
export function TextReveal({ texto, as = "h2", className, delay = 0, destaque = [], imediato }: Props) {
  const palavras = texto.split(" ");
  const cor = (p: string) => (destaque.includes(limpa(p)) ? "texto-ouro-gradiente" : "");

  if (imediato) {
    // Versão CSS em bloco único: pintada já no 1º frame (bom para o LCP) e sem esperar a hidratação.
    return createElement(
      as,
      { className: `palavra-sobe ${className ?? ""}`, style: { "--atraso": `${delay}s` } as CSSProperties },
      palavras.map((p, i) => (
        <Fragment key={i}>
          {cor(p) ? <span className={cor(p)}>{p}</span> : p}
          {i < palavras.length - 1 ? " " : ""}
        </Fragment>
      )),
    );
  }

  return createElement(
    as,
    { className, "aria-label": texto },
    <m.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-hidden
    >
      {palavras.map((p, i) => (
        <span key={i} className="-mt-[0.2em] inline-block overflow-hidden pt-[0.2em] pb-[0.08em] align-bottom">
          <m.span
            className={`inline-block ${cor(p)}`}
            variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {p}
          </m.span>
          {i < palavras.length - 1 ? " " : ""}
        </span>
      ))}
    </m.span>,
  );
}
