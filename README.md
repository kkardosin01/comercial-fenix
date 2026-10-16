# Comercial Fênix SC Ltda — site institucional

Site institucional da Comercial Fênix (fornecimento do analisador **i-STAT 1** e cartuchos, tecnologia Abbott i-STAT), com explorador interativo por área, captação de leads e painel administrativo com 2FA.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Radix UI · Supabase (Postgres + Auth + Storage, RLS) · Resend · Cloudflare Turnstile · Upstash Redis · Vercel.

---

## 1. Rodando localmente

Requisitos: Node.js 20.9+ (recomendado 22) e npm.

```bash
npm install
cp .env.example .env.local   # preencha o que tiver; o site funciona sem nada configurado
npm run dev                  # http://localhost:3000
```

Sem Supabase configurado, o site usa o conteúdo de `src/lib/content/seed.ts` e o formulário apenas registra o lead no log do terminal. O painel `/admin` exige Supabase.

Comandos úteis:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build && npm start` | build e servidor de produção |
| `npm run lint` / `npm run typecheck` / `npm test` | qualidade (ESLint, TypeScript, Vitest) |
| `npm run audit` | vulnerabilidades em dependências de produção |
| `npm run db:seed:generate` | regenera `supabase/seed.sql` a partir de `src/lib/content/seed.ts` |
| `npm run logo:gerar` | regenera favicon, ícones, imagem OG e logos transparentes a partir de `assets/brand/logo-original.png` |

## 2. Estrutura

```
src/
  app/(site)/          páginas públicas (início, produtos, áreas, clientes, sobre, contato, LGPD)
  app/admin/           painel: (acesso) login e 2FA · (painel) leads, conteúdo, auditoria
  actions/             Server Actions (lead público e ações do admin)
  components/          UI (home, explorador, clientes, contato, admin, ilustrações)
  lib/
    content/seed.ts    conteúdo inicial (fonte do seed SQL e fallback sem banco)
    data.ts            leitura cacheada do conteúdo ("use cache" + tag "conteudo")
    seguranca/         CSP, rate limit, Turnstile, checagem de origem
    admin/             autenticação/2FA, entidades editáveis, upload seguro
    site.ts            telefone, e-mail, endereço, horário, logo Abbott
  proxy.ts             CSP do painel + renovação de sessão no /admin
supabase/
  migrations/          schema, RLS, triggers de auditoria, retenção, bucket
  seed.sql             áreas, produtos e clientes iniciais
docs/                  guia do painel e checklist de segurança
```

## 3. Banco de dados (Supabase)

1. Crie um projeto em <https://supabase.com> (região **São Paulo — sa-east-1**).
2. Rode a migration e o seed (pelo SQL Editor, colando os arquivos, ou pela CLI):
   ```bash
   npx supabase link --project-ref SEU_PROJECT_REF
   npx supabase db push              # aplica supabase/migrations
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```
3. **Auth → Providers → Email:** mantenha e-mail/senha ativos e **desative "Allow new users to sign up"** (o painel não tem cadastro público).
4. **Auth → Multi-Factor:** habilite **TOTP**.
5. **Auth → Sessions** (plano Pro): defina *Time-box user sessions* = 8h e *Inactivity timeout* = 1h. O app também encerra sessões do admin 8h após o 2FA.
6. Crie o usuário administrador em **Auth → Users → Add user** (com senha forte) e promova-o a admin no SQL Editor:
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
   where email = 'email-do-admin@exemplo.com';
   ```
   No primeiro acesso a `/admin`, o sistema obriga a configurar o aplicativo autenticador.
7. **Retenção LGPD (24 meses):** em *Database → Extensions* ative `pg_cron` e rode:
   ```sql
   select cron.schedule('purga-leads', '0 4 * * *', 'select public.purgar_leads_antigos()');
   ```
8. **Backups:** o plano Pro do Supabase faz backup diário automático (7 dias). Para retenção maior ou recuperação a um ponto no tempo, ative PITR em *Database → Backups*.

## 4. E-mail (Resend)

1. Crie conta em <https://resend.com>, adicione o domínio (ex.: `hospitalaresfenix.com.br`) e publique no DNS os registros **SPF, DKIM** e um **DMARC** (ex.: `v=DMARC1; p=quarantine; rua=mailto:fenix.hospitalares@gmail.com`).
2. Gere a API key e preencha `RESEND_API_KEY`, `EMAIL_FROM` (endereço do domínio verificado) e `EMAIL_NOTIFICACAO`.

A cada envio do formulário: o lead é gravado, a equipe recebe a notificação (com *reply-to* do cliente) e o cliente recebe a confirmação assinada por Tulio Cardoso.

## 5. Anti-robô e rate limit

- **Turnstile:** crie um widget em Cloudflare → Turnstile para o domínio e preencha `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`. Em produção, sem a chave secreta, o formulário recusa envios (de propósito).
- **Upstash:** crie um banco Redis (região próxima de `gru1`) e preencha `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. Sem ele, o limite funciona só em memória por instância.

## 6. Deploy na Vercel

1. Suba o repositório para o GitHub e importe em <https://vercel.com/new>.
2. Em *Settings → Environment Variables*, cadastre todas as variáveis do `.env.example` (Production e Preview).
3. *Settings → Functions → Region*: **São Paulo (gru1)**.
4. *Settings → Domains*: adicione `hospitalaresfenix.com.br` e `www.hospitalaresfenix.com.br` (redirecionando para o domínio principal).
5. *Firewall*: ative o **Vercel Firewall / Attack Challenge Mode** quando necessário e crie uma regra de rate limit para `POST /contato` e `/admin/*` (proteção DDoS da plataforma já é automática).
6. *Analytics*: ative **Web Analytics** no projeto. O script só é carregado após o visitante aceitar estatísticas no banner.
7. Após o primeiro deploy: envie `https://www.hospitalaresfenix.com.br` para <https://hstspreload.org> (o cabeçalho HSTS já tem `preload`).

## 7. SEO e Google

- Metadados por página, Open Graph (`opengraph-image.png`), `sitemap.xml`, `robots.txt` e dados estruturados `MedicalBusiness/LocalBusiness` (endereço, telefone, e-mail, horário e coordenadas) já estão no código.
- **Google Search Console:** adicione a propriedade de domínio e envie `/sitemap.xml`.
- **Google Business Profile:** crie/reivindique o perfil com o mesmo nome, endereço e telefone do site (NAP idêntico), categoria *Fornecedor de equipamentos médicos*, e use o site como link. Confira as coordenadas em `SITE.geo` (`src/lib/site.ts`) com as do perfil.

## 8. Itens a completar pelo cliente

- **Logo oficial da Abbott:** salve o arquivo oficial em `public/parceiros/` e informe em `ABBOTT_LOGO` (`src/lib/site.ts`). Até lá o site mostra apenas o texto “Trabalhamos com a tecnologia Abbott i-STAT”, sem reproduzir a marca. Respeite o manual de marca (área de proteção, cores originais, sem distorcer).
- **Logos dos clientes:** envie pelo painel (*Clientes → Editar → Logo*). Use apenas logos com autorização das instituições. Sem logo, o nome aparece em tipografia.
- **CNPJ:** preencha `SITE.cnpj` em `src/lib/site.ts` (aparece na Política de Privacidade e nos Termos).
- **Fotos do i-STAT 1 e cartuchos:** opcionais, pelo painel (*Produtos → Imagem*). Sem foto, o site usa ilustrações próprias.
- **Depoimentos:** só reais, com nome, cargo e instituição, cadastrados no painel.

## 9. Documentação adicional

- [Guia rápido do painel administrativo](docs/GUIA-ADMIN.md)
- [Checklist de segurança](docs/SEGURANCA.md)
