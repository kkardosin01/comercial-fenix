"use client";
import { clsx } from "clsx";
import type { MouseEvent, ReactNode } from "react";

// Card com brilho dourado que segue o cursor (microinteração).
export function CartaoLuz({ children, className }: { children: ReactNode; className?: string }) {
  const mover = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      onMouseMove={mover}
      className={clsx(
        "group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-carvao transition-all duration-500 ease-(--ease-premium) hover:-translate-y-1 hover:border-ouro/40",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(205,163,92,0.14), transparent 45%)",
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
