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
| DNS | GoDaddy (`ns55/ns56.domaincontrol.com`) | A @ → 216.198.79.1; CNAME www → 9f9919f76876e981.vercel-dns-017.com; registros do Resend (resend._domainkey, rsend, send, _dmarc) |
| Supabase | projeto `comercial-fenix`, ref `gxbqwnsmfuntbmfltqey`, região sa-east-1 | Migrations aplicadas (`supabase/migrations`), seed carregado (5 produtos, 12 áreas, 35 clientes). Cadastro público **desativado**. O conector MCP do Supabase funciona |
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
- Lighthouse local (mobile): desempenho 91–94; acessibilidade, boas práticas e SEO 100.

## Pendências
1. Upstash Redis: banco criado e conectado; falta publicar o código que lê `KV_REST_API_*` e confirmar que o aviso "[limite] Upstash não configurado" sumiu dos logs.
2. Retenção LGPD: ativar `pg_cron` no Supabase e agendar `select public.purgar_leads_antigos()` (ver README).
3. Material do cliente: logo oficial da Abbott (`ABBOTT_LOGO` em `src/lib/site.ts`), logos dos clientes (pelo painel, com autorização), CNPJ (`SITE.cnpj`).
4. Google Search Console (enviar `/sitemap.xml`) e Google Business Profile.
5. Testes no domínio final: securityheaders.com, SSL Labs, hstspreload.org, PageSpeed Insights.
6. Avaliar plano Vercel Pro (uso comercial).
7. Opcional: remover `comercial-fenix.vercel.app` do widget Turnstile depois que o domínio estiver estável para todos.

## Decisões importantes
- Next.js 16 com Cache Components: a CSP usa `'unsafe-inline'` em scripts (CSP com nonce quebrava a hidratação do shell pré-renderizado, inclusive no /admin).
- Sem Supabase + Turnstile em produção, a página de contato mostra WhatsApp/telefone/e-mail no lugar do formulário (`src/lib/formulario.ts`).
- Conteúdo público é cacheado ("use cache", 1h) e revalidado pelo painel ao salvar.
