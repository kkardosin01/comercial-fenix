"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Contador({ valor, prefixo = "", sufixo = "" }: { valor: number; prefixo?: string; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, margin: "-40px" });
  const reduzir = useReducedMotion();
  const [atual, setAtual] = useState(reduzir ? valor : 0);

  useEffect(() => {
    if (!visivel || reduzir) return;
    const ctrl = animate(0, valor, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAtual(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [visivel, valor, reduzir]);

  return (
    <span ref={ref}>
      <span className="sr-only">{`${prefixo}${valor}${sufixo}`}</span>
      <span aria-hidden>
        {prefixo}
        {reduzir ? valor : atual}
        {sufixo}
      </span>
    </span>
  );
}
