import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel Comercial Fênix" },
  robots: { index: false, follow: false },
};

export default function AdminRaiz({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-ink text-creme">{children}</div>;
}
