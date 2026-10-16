"use client";
import { m } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section";
};

// Fade + slide suave ao entrar na tela. O MotionConfig raiz respeita prefers-reduced-motion.
export function Reveal({ delay = 0, y = 28, as = "div", children, className, style }: Props) {
  const Comp = as === "li" ? m.li : as === "section" ? m.section : m.div;
  return (
    <Comp
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
