import type { Metadata } from "next";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { TextoLegal } from "@/components/ui/TextoLegal";
import { AVISO_INFORMATIVO, AVISO_MARCAS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições de uso do site da Comercial Fênix SC Ltda.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermosPage() {
  return (
    <>
      <CabecalhoPagina eyebrow="Condições" titulo="Termos de Uso" />
      <TextoLegal atualizado="16 de outubro de 2026">
        <p>
          Ao acessar este site, você concorda com estes Termos de Uso. Se não concordar, por favor não utilize o site.
          O site é mantido pela {SITE.nome}
          {SITE.cnpj ? `, CNPJ ${SITE.cnpj}` : ""}.
        </p>

        <h2>1. Finalidade do site</h2>
        <p>
          Este site apresenta a empresa, os produtos que fornecemos e canais de contato comercial. As informações sobre
          produtos e áreas de aplicação têm caráter exclusivamente informativo e não constituem orientação médica,
          veterinária ou recomendação de uso clínico.
        </p>
        <p>{AVISO_INFORMATIVO}</p>

        <h2>2. Preços, disponibilidade e propostas</h2>
        <p>
          O site não realiza vendas. Preços, prazos de entrega e disponibilidade são informados em proposta comercial,
          após contato, e podem variar conforme a região, o volume e a disponibilidade junto ao fabricante.
        </p>

        <h2>3. Marcas e propriedade intelectual</h2>
        <p>
          {AVISO_MARCAS} Demais marcas citadas pertencem aos seus respectivos titulares e são mencionadas apenas para
          identificar instituições atendidas, com autorização. Os textos, a identidade visual e os elementos gráficos
          próprios deste site pertencem à {SITE.nome} e não podem ser reproduzidos sem autorização.
        </p>

        <h2>4. Uso adequado</h2>
        <ul>
          <li>Não envie pelo formulário dados de pacientes ou informações sensíveis.</li>
          <li>Não tente acessar áreas restritas, contornar mecanismos de segurança ou sobrecarregar o site.</li>
          <li>Não utilize o site para envio de conteúdo ilícito, ofensivo ou não solicitado (spam).</li>
        </ul>

        <h2>5. Links externos</h2>
        <p>
          O site pode conter links para serviços de terceiros (como WhatsApp e Google Maps). Não nos responsabilizamos
          pelo conteúdo ou pelas práticas de privacidade desses serviços.
        </p>

        <h2>6. Privacidade</h2>
        <p>
          O tratamento de dados pessoais é descrito na nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>

        <h2>7. Alterações e foro</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. Fica eleito o foro da Comarca de Florianópolis/SC para
          dirimir eventuais controvérsias, com renúncia a qualquer outro, observados os direitos do consumidor.
        </p>
      </TextoLegal>
    </>
  );
}
