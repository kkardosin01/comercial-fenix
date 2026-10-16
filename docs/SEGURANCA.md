# Checklist de segurança

Legenda: ✅ implementado e verificado localmente · 🔲 verificar após o deploy em produção · ⚙️ configuração em painel externo

## Transporte e cabeçalhos
- ✅ HSTS `max-age=63072000; includeSubDomains; preload` (`src/lib/seguranca/csp.ts`)
- ✅ Content-Security-Policy restritiva: `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`; libera apenas Google Maps (iframe), Cloudflare Turnstile e o host do Supabase. Fontes self-hosted (next/font), sem chamadas ao Google Fonts.
- ✅ Painel `/admin` com CSP por **nonce + strict-dynamic** (gerada no `src/proxy.ts`).
- ✅ `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (câmera, microfone, geolocalização, pagamento, USB desativados), `Cross-Origin-Opener-Policy: same-origin`, cabeçalho `X-Powered-By` removido.
- ℹ️ Páginas públicas são pré-renderizadas (melhor desempenho), então a CSP pública usa `'unsafe-inline'` em `script-src` para os scripts inline do Next.js. O risco é mitigado porque nenhum conteúdo do usuário é renderizado como HTML. Para eliminar o `'unsafe-inline'`, aplicar a CSP com nonce também no site público (custo: renderização dinâmica em todas as páginas).
- 🔲 <https://securityheaders.com> → meta **A+**
- 🔲 <https://www.ssllabs.com/ssltest/> → meta **A+** (TLS gerenciado pela Vercel)
- 🔲 Enviar o domínio para <https://hstspreload.org>

## Formulário de orçamento
- ✅ Validação no cliente (HTML5) e no servidor (Zod), com limites de tamanho por campo
- ✅ Sanitização: remoção de caracteres de controle/bidi; saída sempre escapada (React e e-mails com `esc()`)
- ✅ Área e produtos aceitos só se existirem no cadastro
- ✅ Honeypot (`website`) e Cloudflare Turnstile validado no servidor (recusa em produção se a chave faltar)
- ✅ Rate limit por IP: 5 envios / 10 min (Upstash, com fallback em memória)
- ✅ Limite de payload: 32 KB no envio público; 3 MB no total para Server Actions (uploads do admin)
- ✅ CSRF: Server Actions verificam Origin/Host (Next.js) + checagem explícita de `Origin` obrigatório (`origemValida`)
- ✅ Testado localmente: envio completo com área pré-preenchida, mensagem de sucesso, e conteúdo `<script>` tratado como texto

## Banco de dados (Supabase)
- ✅ RLS ativado em **todas** as tabelas (`produtos`, `areas`, `clientes`, `depoimentos`, `leads`, `admin_audit_log`)
- ✅ Público lê apenas conteúdo ativo; `leads` sem nenhum acesso anônimo
- ✅ Escrita só para `app_metadata.role = 'admin'` **com sessão `aal2` (2FA)** — checado no próprio banco
- ✅ Queries via cliente Supabase (PostgREST, parametrizado); busca do admin escapa caracteres de filtro
- ✅ Auditoria por trigger `security definer` (insert/update/delete de conteúdo e leads) + eventos de login/logout/exportação
- ✅ Chave de serviço apenas no servidor (`import "server-only"`), nunca com prefixo `NEXT_PUBLIC_`
- ⚙️ Desativar cadastro público de usuários, habilitar MFA TOTP, configurar tempo de sessão
- ⚙️ Backups diários (plano Pro) e, se possível, PITR
- ⚙️ Retenção de leads: `pg_cron` diário chamando `purgar_leads_antigos()` (24 meses)

## Painel administrativo
- ✅ Login com e-mail + senha e **2FA obrigatório** (TOTP); sem 2FA não há acesso às páginas nem ao banco
- ✅ Sessão expira 8h após o 2FA (checagem do `amr` no servidor)
- ✅ Cookies de sessão `HttpOnly`, `Secure` (produção), `SameSite=Strict`
- ✅ Bloqueio após 5 falhas de senha (por e-mail) ou de código 2FA (por usuário) por 15 min; limite por IP
- ✅ Mensagens genéricas e atraso uniforme no login (evita enumeração de usuários)
- ✅ `noindex` e `Cache-Control: no-store` em `/admin`; `/admin` bloqueado no `robots.txt`
- ✅ Uploads: só SVG/PNG/JPG/WebP até 2 MB, tipo verificado pela assinatura do arquivo, SVG higienizado (DOMPurify, sem scripts/eventos/links externos), nome aleatório
- ✅ Exportação CSV protegida contra injeção de fórmulas

## Infraestrutura e processo
- ✅ CI (GitHub Actions): lint, typecheck, testes, `npm audit --audit-level=high`, build e CodeQL
- ✅ Dependabot semanal (npm) e mensal (GitHub Actions)
- ✅ `npm audit` sem vulnerabilidades na data da entrega
- ⚙️ Vercel Firewall: regras de rate limit para `POST /contato` e `/admin/*`; Attack Challenge Mode em incidentes
- ⚙️ Domínio de e-mail com SPF, DKIM e DMARC na Resend

## LGPD
- ✅ Coleta mínima; consentimento obrigatório com link para a Política de Privacidade e data registrada
- ✅ Política de Privacidade e Termos de Uso; canal para o titular (e-mail com assunto “LGPD — Solicitação do titular”)
- ✅ Exclusão definitiva de lead pelo painel (auditada); retenção definida (24 meses)
- ✅ Banner de cookies: estatísticas (Vercel Analytics, sem cookies) só carregam após consentimento; reabrível no rodapé

## Desempenho e qualidade (Lighthouse)

Medição local em 16/10/2026 (`next build && next start`, Lighthouse 12, perfil **mobile** com 4G e CPU simulados):

| Página | Desempenho | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Início | 91 | 100 | 100 | 100 |
| Produtos | 93 | 100 | 100 | 100 |
| Produto (i-STAT 1) | 93 | 100 | 100 | 100 |
| Áreas de atuação | 92 | 100 | 100 | 100 |
| Clientes | 92 | 100 | 100 | 100 |
| Sobre | 93 | 100 | 100 | 100 |
| Contato | 93 | 100 | 100 | 100 |
| Política de Privacidade | 94 | 100 | 100 | 100 |

Desktop (Início): 99 em desempenho. 🔲 Repetir no domínio de produção (PageSpeed Insights) após o deploy.
