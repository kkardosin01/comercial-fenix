import Image from "next/image";
import emblema from "../../../../public/brand/fenix-emblem.png";

export default function AcessoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-carvao p-8 md:p-10">
        <Image src={emblema} alt="Comercial Fênix" className="mx-auto h-auto w-20" priority />
        <p className="eyebrow mt-6 text-center">Painel administrativo</p>
        {children}
      </div>
    </main>
  );
}
