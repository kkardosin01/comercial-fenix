import { Mail, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

// Exibido no lugar do formulário enquanto o envio online não está configurado.
export function ContatoDireto() {
  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed text-creme/90">
        Fale direto com a nossa equipe e receba seu orçamento rapidamente. Conte qual é a sua área de atuação, os
        cartuchos de interesse e o volume estimado.
      </p>
      <a
        href={whatsappLink("Olá! Gostaria de solicitar um orçamento do i-STAT 1 / cartuchos.")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-ouro px-6 font-semibold text-ink transition-colors hover:bg-ouro-claro"
      >
        <MessageCircle className="size-5" aria-hidden /> Pedir orçamento pelo WhatsApp
      </a>
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`tel:${SITE.telefoneE164}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ouro/60 px-5 font-semibold transition-colors hover:bg-ouro/10"
        >
          <Phone className="size-4 text-ouro" aria-hidden /> {SITE.telefoneExibicao}
        </a>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent("Solicitação de orçamento — i-STAT")}`}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ouro/60 px-5 font-semibold transition-colors hover:bg-ouro/10"
        >
          <Mail className="size-4 text-ouro" aria-hidden /> Enviar e-mail
        </a>
      </div>
      <p className="text-sm text-cinza">Atendimento de segunda a sexta, das 8h às 18h.</p>
    </div>
  );
}
