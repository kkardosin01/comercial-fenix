import "server-only";
import { Resend } from "resend";
import { SITE } from "./site";
import type { LeadEntrada } from "./validacao";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const ASSINATURA_TXT = `Atenciosamente,\nTulio Cardoso\nComercial Fênix SC Ltda\n${SITE.telefoneExibicao}`;
const ASSINATURA_HTML = `<p style="margin:28px 0 0;color:#333;line-height:1.6">Atenciosamente,<br><strong>Tulio Cardoso</strong><br>Comercial Fênix SC Ltda<br>${SITE.telefoneExibicao}</p>`;

const moldura = (conteudo: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f5f1e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1e8;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0a0a0a;padding:24px 32px"><img src="${SITE.url}/brand/logo-completa.png" alt="Comercial Fênix SC Ltda." width="140" style="display:block;height:auto"></td></tr>
<tr><td style="padding:32px;color:#1a1a1a;font-size:15px">${conteudo}</td></tr>
<tr><td style="background:#0a0a0a;color:#a3a3a3;padding:16px 32px;font-size:12px">${esc(SITE.nome)} · ${esc(SITE.endereco.cidade)}/${SITE.endereco.uf} · i-STAT e Abbott são marcas registradas da Abbott.</td></tr>
</table></td></tr></table></body></html>`;

type Extras = { areaNome: string; produtosNomes: string[] };

function linhas(l: LeadEntrada, x: Extras): [string, string][] {
  return [
    ["Nome", l.nome],
    ["Instituição", l.instituicao],
    ["Cargo", l.cargo || "—"],
    ["E-mail", l.email],
    ["Telefone", l.telefone],
    ["Área de atuação", x.areaNome || "—"],
    ["Produtos de interesse", x.produtosNomes.join(", ") || "—"],
    ["Cidade/UF", [l.cidade, l.uf].filter(Boolean).join("/") || "—"],
    ["Mensagem", l.mensagem || "—"],
  ];
}

export async function enviarEmailsLead(l: LeadEntrada, x: Extras) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM; // ex.: "Comercial Fênix <contato@hospitalaresfenix.com.br>"
  const destino = process.env.EMAIL_NOTIFICACAO ?? SITE.email;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY/EMAIL_FROM não configurados — e-mails não enviados.");
    return { ok: false };
  }
  const resend = new Resend(key);
  const tabela = linhas(l, x)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");

  const notificacao = resend.emails.send({
    from,
    to: [destino],
    replyTo: l.email,
    subject: `Novo pedido de orçamento — ${l.instituicao}`.slice(0, 150),
    html: moldura(`<h1 style="font-size:20px;margin:0 0 16px">Novo pedido de orçamento pelo site</h1><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">${tabela}</table>`),
    text: linhas(l, x).map(([k, v]) => `${k}: ${v}`).join("\n"),
  });

  const confirmacao = resend.emails.send({
    from,
    to: [l.email],
    replyTo: destino,
    subject: "Recebemos sua solicitação — Comercial Fênix",
    html: moldura(
      `<p style="margin:0 0 16px">Olá, ${esc(l.nome.split(" ")[0])}!</p>
<p style="margin:0 0 16px;line-height:1.6">Recebemos sua solicitação de orçamento pelo nosso site. Em breve entraremos em contato pelo telefone ou e-mail informados, em horário comercial (segunda a sexta, 8h às 18h).</p>
<p style="margin:0 0 16px;line-height:1.6">Se preferir, fale com a gente agora mesmo pelo WhatsApp: <a href="${SITE.whatsapp}" style="color:#7a5a22">${SITE.telefoneExibicao}</a>.</p>${ASSINATURA_HTML}`,
    ),
    text: `Olá, ${l.nome.split(" ")[0]}!\n\nRecebemos sua solicitação de orçamento pelo nosso site. Em breve entraremos em contato pelo telefone ou e-mail informados, em horário comercial (segunda a sexta, 8h às 18h).\n\nWhatsApp: ${SITE.telefoneExibicao}\n\n${ASSINATURA_TXT}`,
  });

  const [a, b] = await Promise.allSettled([notificacao, confirmacao]);
  for (const r of [a, b]) {
    if (r.status === "rejected") console.error("[email] falha no envio", r.reason);
    else if (r.value.error) console.error("[email] erro Resend", r.value.error);
  }
  return { ok: a.status === "fulfilled" && !a.value.error };
}
