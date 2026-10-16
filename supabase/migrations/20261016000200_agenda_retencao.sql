-- ---------------------------------------------------------------------------
-- Retenção LGPD: apaga leads com mais de 24 meses todo dia às 04:00 UTC
-- (01:00 em Brasília). cron.schedule com o mesmo nome substitui o job.
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;

select cron.schedule('purga-leads', '0 4 * * *', 'select public.purgar_leads_antigos()');
