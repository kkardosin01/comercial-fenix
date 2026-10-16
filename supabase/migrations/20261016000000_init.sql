-- Comercial Fênix — schema inicial
-- Tabelas de conteúdo (leitura pública dos registros ativos), leads (somente admin),
-- auditoria automática por trigger e bucket de logos.
-- Admin = usuário com app_metadata.role = 'admin' e sessão com 2FA (aal2).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
     and coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Conteúdo
-- ---------------------------------------------------------------------------
create table public.produtos (
  slug          text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  nome          text not null check (char_length(nome) between 1 and 120),
  tipo          text not null check (tipo in ('analisador', 'cartucho')),
  resumo        text not null default '' check (char_length(resumo) <= 400),
  descricao     text not null default '' check (char_length(descricao) <= 4000),
  parametros    text[] not null default '{}',
  destaques     text[] not null default '{}',
  sob_consulta  boolean not null default false,
  imagem_url    text,
  ordem         integer not null default 0,
  ativo         boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.areas (
  slug                text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  nome                text not null check (char_length(nome) between 1 and 120),
  icone               text not null default 'stethoscope',
  resumo              text not null default '' check (char_length(resumo) <= 400),
  cenarios            text[] not null default '{}',
  beneficios          text[] not null default '{}',
  cartuchos           text[] not null default '{}',
  segmentos_clientes  text[] not null default '{}',
  ordem               integer not null default 0,
  ativo               boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.clientes (
  id                      uuid primary key default gen_random_uuid(),
  nome                    text not null check (char_length(nome) between 1 and 160),
  logo_url                text,
  segmento                text not null check (segmento in ('redes','hospitais','veterinaria','reproducao','pesquisa','outros')),
  segmentos_relacionados  text[] not null default '{}',
  unidades                text check (char_length(unidades) <= 600),
  cidade                  text check (char_length(cidade) <= 120),
  uf                      char(2) check (uf ~ '^[A-Z]{2}$'),
  destaque                boolean not null default false,
  ordem                   integer not null default 0,
  ativo                   boolean not null default true,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table public.depoimentos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null check (char_length(nome) between 1 and 120),
  cargo        text not null check (char_length(cargo) between 1 and 120),
  instituicao  text not null check (char_length(instituicao) between 1 and 160),
  texto        text not null check (char_length(texto) between 1 and 1200),
  ordem        integer not null default 0,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leads (formulário de orçamento)
-- ---------------------------------------------------------------------------
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  nome             text not null check (char_length(nome) between 2 and 120),
  instituicao      text not null check (char_length(instituicao) between 2 and 160),
  cargo            text check (char_length(cargo) <= 120),
  email            text not null check (char_length(email) <= 160),
  telefone         text not null check (char_length(telefone) <= 30),
  area             text check (char_length(area) <= 120),
  produtos         text[] not null default '{}',
  cidade           text check (char_length(cidade) <= 120),
  uf               char(2),
  mensagem         text check (char_length(mensagem) <= 2000),
  consentimento_em timestamptz not null,
  origem           text,
  status           text not null default 'novo' check (status in ('novo','em_contato','proposta','fechado')),
  notas            text check (char_length(notas) <= 4000)
);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

-- ---------------------------------------------------------------------------
-- Auditoria
-- ---------------------------------------------------------------------------
create table public.admin_audit_log (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  user_id     uuid,
  user_email  text,
  acao        text not null,
  tabela      text,
  registro    text,
  detalhes    jsonb
);
create index admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  reg text;
begin
  reg := coalesce(
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'slug',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id'
  );
  insert into public.admin_audit_log (user_id, user_email, acao, tabela, registro, detalhes)
  values (
    auth.uid(),
    auth.jwt() ->> 'email',
    lower(tg_op),
    tg_table_name,
    reg,
    case
      when tg_op = 'UPDATE' then jsonb_build_object('antes', to_jsonb(old), 'depois', to_jsonb(new))
      when tg_op = 'DELETE' then jsonb_build_object('antes', to_jsonb(old))
      else jsonb_build_object('depois', to_jsonb(new))
    end
  );
  return coalesce(new, old);
end;
$$;

-- Triggers de updated_at e auditoria
do $$
declare t text;
begin
  foreach t in array array['produtos','areas','clientes','depoimentos','leads'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.tocar_updated_at()', t, t);
  end loop;
  foreach t in array array['produtos','areas','clientes','depoimentos'] loop
    execute format('create trigger %I_auditoria after insert or update or delete on public.%I for each row execute function public.registrar_auditoria()', t, t);
  end loop;
end $$;
-- Em leads só auditamos alterações feitas pelo painel (o INSERT vem do formulário público).
create trigger leads_auditoria after update or delete on public.leads
  for each row execute function public.registrar_auditoria();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.produtos        enable row level security;
alter table public.areas           enable row level security;
alter table public.clientes        enable row level security;
alter table public.depoimentos     enable row level security;
alter table public.leads           enable row level security;
alter table public.admin_audit_log enable row level security;

-- Leitura pública apenas de conteúdo ativo
create policy "publico le produtos ativos"    on public.produtos    for select to anon, authenticated using (ativo or public.is_admin());
create policy "publico le areas ativas"       on public.areas       for select to anon, authenticated using (ativo or public.is_admin());
create policy "publico le clientes ativos"    on public.clientes    for select to anon, authenticated using (ativo or public.is_admin());
create policy "publico le depoimentos ativos" on public.depoimentos for select to anon, authenticated using (ativo or public.is_admin());

-- Escrita de conteúdo: somente admin com 2FA
create policy "admin insere produtos"    on public.produtos    for insert to authenticated with check (public.is_admin());
create policy "admin altera produtos"    on public.produtos    for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui produtos"    on public.produtos    for delete to authenticated using (public.is_admin());
create policy "admin insere areas"       on public.areas       for insert to authenticated with check (public.is_admin());
create policy "admin altera areas"       on public.areas       for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui areas"       on public.areas       for delete to authenticated using (public.is_admin());
create policy "admin insere clientes"    on public.clientes    for insert to authenticated with check (public.is_admin());
create policy "admin altera clientes"    on public.clientes    for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui clientes"    on public.clientes    for delete to authenticated using (public.is_admin());
create policy "admin insere depoimentos" on public.depoimentos for insert to authenticated with check (public.is_admin());
create policy "admin altera depoimentos" on public.depoimentos for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui depoimentos" on public.depoimentos for delete to authenticated using (public.is_admin());

-- Leads: nenhum acesso anônimo (o formulário grava pelo servidor com a chave de serviço)
create policy "admin le leads"     on public.leads for select to authenticated using (public.is_admin());
create policy "admin altera leads" on public.leads for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin exclui leads" on public.leads for delete to authenticated using (public.is_admin());

-- Auditoria: somente leitura para admin; gravação apenas pelos triggers/servidor
create policy "admin le auditoria" on public.admin_audit_log for select to authenticated using (public.is_admin());

revoke all on public.admin_audit_log from anon;
revoke all on public.leads from anon;

-- ---------------------------------------------------------------------------
-- LGPD: retenção de leads (24 meses). Agende com pg_cron (ver README):
--   select cron.schedule('purga-leads', '0 4 * * *', 'select public.purgar_leads_antigos()');
-- ---------------------------------------------------------------------------
create or replace function public.purgar_leads_antigos(meses integer default 24)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  delete from public.leads where created_at < now() - make_interval(months => meses);
  get diagnostics n = row_count;
  insert into public.admin_audit_log (acao, tabela, detalhes)
  values ('purga_retencao', 'leads', jsonb_build_object('removidos', n, 'meses', meses));
  return n;
end;
$$;
revoke execute on function public.purgar_leads_antigos(integer) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: bucket público (leitura) para logos e imagens; upload só admin
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('midia', 'midia', true, 2097152, array['image/svg+xml','image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

create policy "admin envia midia"   on storage.objects for insert to authenticated with check (bucket_id = 'midia' and public.is_admin());
create policy "admin altera midia"  on storage.objects for update to authenticated using (bucket_id = 'midia' and public.is_admin());
create policy "admin exclui midia"  on storage.objects for delete to authenticated using (bucket_id = 'midia' and public.is_admin());
