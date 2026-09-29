-- Painel da professora — rode UMA vez no SQL Editor (depois do supabase-mural.sql)
-- Cria: tabela de configurações + permissão da Bárbara (login) + foto no Storage

-- 1) Configurações do site (telefone, preços, foto)
create table if not exists site_config (
  chave text primary key,
  valor text not null
);
insert into site_config (chave, valor) values
  ('whatsapp', '5549991887763'),
  ('preco_online', '45'),
  ('preco_presencial', '50'),
  ('foto_url', '')
on conflict (chave) do nothing;

alter table site_config enable row level security;
drop policy if exists "config publica" on site_config;
create policy "config publica" on site_config for select using (true);
drop policy if exists "config admin" on site_config;
create policy "config admin" on site_config for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 2) Recados: só a Bárbara (logada) pode apagar/editar
drop policy if exists "mural admin apaga" on depoimentos;
create policy "mural admin apaga" on depoimentos
  for delete using (auth.role() = 'authenticated');
drop policy if exists "mural admin edita" on depoimentos;
create policy "mural admin edita" on depoimentos
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3) Foto: pasta pública "site" (leitura livre, escrita só logada)
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

drop policy if exists "foto publica" on storage.objects;
create policy "foto publica" on storage.objects
  for select using (bucket_id = 'site');
drop policy if exists "foto admin" on storage.objects;
create policy "foto admin" on storage.objects
  for insert with check (bucket_id = 'site' and auth.role() = 'authenticated');
drop policy if exists "foto admin atualiza" on storage.objects;
create policy "foto admin atualiza" on storage.objects
  for update using (bucket_id = 'site' and auth.role() = 'authenticated')
  with check (bucket_id = 'site' and auth.role() = 'authenticated');
