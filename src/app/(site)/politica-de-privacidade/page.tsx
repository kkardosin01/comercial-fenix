import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/ui/CabecalhoPagina";
import { TextoLegal } from "@/components/ui/TextoLegal";
import { ENDERECO_COMPLETO, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Comercial Fênix trata dados pessoais, em conformidade com a LGPD (Lei 13.709/2018).",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacidadePage() {
  return (
    <>
      <CabecalhoPagina eyebrow="LGPD" titulo="Política de Privacidade" />
      <TextoLegal atualizado="16 de outubro de 2026">
        <p>
          Esta política explica como a {SITE.nome}
          {SITE.cnpj ? `, inscrita no CNPJ sob nº ${SITE.cnpj},` : ""} com sede em {ENDERECO_COMPLETO} (“Comercial
          Fênix”, “nós”), trata os dados pessoais de quem visita este site ou entra em contato conosco, em conformidade
          com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
        </p>

        <h2>1. Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Formulário de orçamento:</strong> nome, instituição, cargo, e-mail, telefone, área de atuação,
            produtos de interesse, cidade/UF e a mensagem que você escrever, além da data do seu consentimento.
          </li>
          <li>
            <strong>Dados técnicos:</strong> endereço IP, usado temporariamente para segurança (prevenção de abuso e
            limite de envios) e para a verificação anti-robô.
          </li>
          <li>
            <strong>Estatísticas de visita</strong> (somente com o seu consentimento): dados agregados e anônimos
            sobre páginas acessadas, sem cookies de rastreamento e sem identificar você.
          </li>
        </ul>
        <p>Não coletamos dados sensíveis nem dados de pacientes por meio deste site. Por favor, não os envie no formulário.</p>

        <h2>2. Para que usamos e com qual base legal</h2>
        <ul>
          <li>Responder à sua solicitação e enviar propostas comerciais — procedimentos preliminares a contrato (art. 7º, V) e consentimento (art. 7º, I).</li>
          <li>Enviar um e-mail de confirmação do recebimento da solicitação — mesmas bases acima.</li>
          <li>Garantir a segurança do site e evitar fraudes e spam — legítimo interesse (art. 7º, IX).</li>
          <li>Medir o uso do site de forma agregada — consentimento (art. 7º, I), que pode ser revogado a qualquer momento.</li>
        </ul>

        <h2>3. Com quem compartilhamos</h2>
        <p>
          Não vendemos dados pessoais. Utilizamos fornecedores que atuam como operadores, apenas para viabilizar o
          funcionamento do site: hospedagem (Vercel), banco de dados (Supabase), envio de e-mails (Resend), proteção
          anti-robô (Cloudflare Turnstile), controle de limite de requisições (Upstash) e mapa incorporado (Google
          Maps). Alguns desses fornecedores podem processar dados fora do Brasil, com salvaguardas contratuais
          adequadas, nos termos do art. 33 da LGPD.
        </p>

        <h2>4. Por quanto tempo guardamos</h2>
        <p>
          Os dados enviados pelo formulário são mantidos por até 24 (vinte e quatro) meses após o último contato, salvo
          se houver relação comercial em andamento ou obrigação legal que exija prazo maior. Depois disso, são
          eliminados automaticamente.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Usamos apenas armazenamento local essencial para lembrar a sua escolha sobre estatísticas. As estatísticas de
          visita só são ativadas se você clicar em “Aceitar estatísticas”. Você pode mudar sua escolha a qualquer
          momento pelo link “Preferências de cookies” no rodapé. O mapa do Google, na página de contato, é carregado
          a partir do Google e está sujeito à política de privacidade do Google.
        </p>

        <h2>6. Seus direitos</h2>
        <p>
          Você pode, a qualquer momento, solicitar: confirmação da existência de tratamento; acesso aos dados; correção
          de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação; portabilidade; informação sobre
          compartilhamento; e revogação do consentimento (art. 18 da LGPD).
        </p>
        <p>
          Para exercer seus direitos, inclusive pedir a <strong>exclusão dos seus dados</strong>, escreva para{" "}
          <a href={`mailto:${SITE.email}?subject=LGPD%20-%20Solicita%C3%A7%C3%A3o%20do%20titular`}>{SITE.email}</a> com o
          assunto “LGPD — Solicitação do titular”. Responderemos em até 15 dias. Você também pode apresentar reclamação
          à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>

        <h2>7. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais para proteger os dados: conexão criptografada (HTTPS), controle de
          acesso com autenticação em dois fatores, registro de auditoria, banco de dados com regras de acesso por linha e
          cópias de segurança diárias.
        </p>

        <h2>8. Contato do controlador</h2>
        <p>
          {SITE.nome} — {ENDERECO_COMPLETO}. E-mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Telefone:{" "}
          <a href={`tel:${SITE.telefoneE164}`}>{SITE.telefoneExibicao}</a>.
        </p>
        <p>Esta política pode ser atualizada. A data da última atualização aparece no topo da página.</p>
      </TextoLegal>
    </>
  );
}
