import Image from "next/image";
import Link from "next/link";
import emblema from "../../../public/brand/fenix-emblem.png";

export function Logo({ compacto = false }: { compacto?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src={emblema}
        alt=""
        priority
        sizes="56px"
        className={`h-auto transition-transform duration-500 ease-(--ease-premium) group-hover:scale-105 ${compacto ? "w-11" : "w-14"}`}
      />
      <span className="font-display text-[1.15rem] leading-none font-medium tracking-wide text-ouro md:text-[1.3rem]">
        Comercial Fênix
        <span className="mt-1 block text-[0.62rem] tracking-[0.34em] text-ouro-claro/80 uppercase">SC Ltda.</span>
      </span>
    </Link>
  );
}
