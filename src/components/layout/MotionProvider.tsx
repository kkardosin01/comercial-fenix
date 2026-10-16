"use client";
import { LazyMotion, MotionConfig } from "motion/react";

// Recursos de animação carregados sob demanda (tira ~30 KB do caminho crítico).
const carregarRecursos = () => import("./motion-recursos").then((r) => r.default);

// reducedMotion="user": respeita prefers-reduced-motion em todas as animações.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={carregarRecursos} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
