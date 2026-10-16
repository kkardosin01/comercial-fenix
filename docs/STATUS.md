# Status do projeto — Comercial Fênix (atualizado em 16/10/2026)

Leia este arquivo antes de continuar o trabalho em uma sessão nova.

## No ar
- Site: https://www.hospitalaresfenix.com.br (o domínio sem www redireciona com 308). Endereço provisório: https://comercial-fenix.vercel.app
- Código: GitHub `kkardosin01/comercial-fenix` (privado), branch `main`. Todo push em `main` publica automaticamente na Vercel.
- Push: este repositório usa `gh auth git-credential` como credential helper (o keychain do macOS travava o push).

## Serviços configurados
| Serviço | Onde | Observações |
| --- | --- | --- |
| Vercel | equipe `fin-ez`, projeto `comercial-fenix` (plano Hobby) | O conector MCP da Vercel **não** tem acesso a essa equipe: usar o painel pelo Chrome |
| DNS | GoDaddy (`ns55/ns56.domaincontrol.com`) | A @ → 216.198.79.1; CNAME www → 9f9919f76876e981.vercel-dns-017.com; registros do Resend (resend._domainkey, rsend, send, _dmarc); TXT @ `google-site-verification=…` (não remover: mantém a verificação do Search Console) |
| Google Business Profile | conta fenix.hospitalares@gmail.com, "Comercial Fênix SC Ltda." (já existia e está confirmado) | Categoria Fornecedor de Artigos Hospitalares; endereço público com Sala 707; área: SC, PR, RS, SP, MG, Fortaleza, Florianópolis; site trocado para https://www em 16/10/2026 (aguardava revisão do Google) |
| Google Search Console | propriedade de domínio `hospitalaresfenix.com.br`, proprietária fenix.hospitalares@gmail.com | Verificada por DNS em 16/10/2026; sitemap enviado (`/sitemap.xml`); home já indexada |
| Supabase | projeto `comercial-fenix`, ref `gxbqwnsmfuntbmfltqey`, região sa-east-1 | Migrations aplicadas (`supabase/migrations`), seed carregado (5 produtos, 12 áreas, 35 clientes). Cadastro público **desativado**. Retenção LGPD: `pg_cron` ativo, job `purga-leads` diário às 04:00 UTC (apaga leads com mais de 24 meses). O conector MCP do Supabase funciona |
| Cloudflare Turnstile | widget "Site Comercial Fenix" | Hostnames: hospitalaresfenix.com.br e comercial-fenix.vercel.app |
| Resend | domínio hospitalaresfenix.com.br (verificado, sa-east-1) | Chave `site-comercial-fenix` (só envio). Remetente: contato@hospitalaresfenix.com.br |
| Upstash Redis | banco `comercial-fenix-redis`, integração da Vercel (Storage), região gru1, plano Free | Conectado ao projeto com prefixo `KV` (Production e Preview); `src/lib/seguranca/limite.ts` lê `KV_REST_API_URL`/`KV_REST_API_TOKEN` |

Variáveis na Vercel (Production): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFICACAO`, e as criadas pela integração Upstash (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_REDIS_URL`, `KV_URL`, também em Preview).
Variáveis `NEXT_PUBLIC_*` precisam ser do tipo **Config** na Vercel (o tipo Secret é recusado).

## Admins do painel (/admin)
- cardosopedro0709@gmail.com — admin, 2FA configurado
- fenix.hospitalares@gmail.com — admin, 2FA ainda não configurado (será pedido no primeiro login)

## Testado e funcionando
- Formulário: Turnstile → grava em `leads` → e-mail de aviso para fenix.hospitalares@gmail.com e confirmação para o cliente (ambos chegaram).
- Painel: login com senha + 2FA.
- CNPJ (33.280.738/0001-09) na Política de Privacidade e nos Termos; logo da Abbott (`public/parceiros/abbott.png`, fornecida pela Fênix) na home e na página do i-STAT 1.
- Rate limit no Upstash: login em produção depois do deploy b5ccf63 sem o aviso "[limite] Upstash não configurado" nos logs da Vercel.
- Lighthouse local (mobile): desempenho 91–94; acessibilidade, boas práticas e SEO 100.
- Domínio final (16/10/2026): securityheaders.com **A** (limitado pelo `'unsafe-inline'` da CSP, decisão abaixo); SSL Labs **A+** (TLS 1.2 e 1.3); Lighthouse em produção: mobile 95–96 / 100 / 100 / 100 (LCP simulado 2,8 s no título da home; real ~0,2 s), desktop 100 em tudo. A API pública do PageSpeed estava sem cota; usei o Lighthouse 12 local.

## Pendências
1. Logos dos clientes (pelo painel, com autorização): nenhum dos 35 tem logo. Prioridade: os 10 em destaque (carrossel da home); só logos boas (SVG ou PNG transparente, 400 px+) e, no carrossel, todos com logo ou todos em texto.
2. Opcional: adicionar cardosopedro0709@gmail.com como usuário no Search Console.
3. Avaliar plano Vercel Pro (uso comercial).
4. Opcional: remover `comercial-fenix.vercel.app` do widget Turnstile depois que o domínio estiver estável para todos.

## Decisões importantes
- Next.js 16 com Cache Components: a CSP usa `'unsafe-inline'` em scripts (CSP com nonce quebrava a hidratação do shell pré-renderizado, inclusive no /admin).
- Sem Supabase + Turnstile em produção, a página de contato mostra WhatsApp/telefone/e-mail no lugar do formulário (`src/lib/formulario.ts`).
- Conteúdo público é cacheado ("use cache", 1h) e revalidado pelo painel ao salvar.
- Sem HSTS preload por enquanto (16/10/2026): ganho pequeno (o HSTS de 2 anos já vale após a primeira visita), saída da lista leva meses e obrigaria HTTPS em todos os subdomínios futuros. O domínio sem www é redirecionado pela Vercel e só envia `max-age`, então o hstspreload.org recusa. Reavaliar se o site ganhar área de cliente ou pagamentos.
