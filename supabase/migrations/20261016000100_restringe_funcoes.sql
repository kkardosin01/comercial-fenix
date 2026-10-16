-- Funções de trigger não devem ser chamáveis pela API (/rest/v1/rpc).
revoke execute on function public.registrar_auditoria() from public, anon, authenticated;
revoke execute on function public.tocar_updated_at() from public, anon, authenticated;
