import type { ReactNode } from "react";

export function TextoLegal({ atualizado, children }: { atualizado: string; children: ReactNode }) {
  return (
    <section className="pb-24 md:pb-32">
      <div className="container-site">
        <div className="max-w-3xl text-creme/85 [&_a]:text-ouro [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:text-creme [&_h2]:uppercase [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <p className="text-sm text-cinza">Última atualização: {atualizado}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
