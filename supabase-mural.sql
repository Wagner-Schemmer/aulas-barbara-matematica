-- Mural do orgulho — rode no SQL Editor do Supabase (projeto gratuito)
create table if not exists depoimentos (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 2 and 60),
  relacao text not null default 'Aluna(o)',
  mensagem text not null check (char_length(mensagem) between 4 and 500),
  estrelas int not null default 10 check (estrelas between 1 and 10),
  aprovado boolean not null default false,
  criado_em timestamptz not null default now()
);

alter table depoimentos enable row level security;

-- Visitantes só LEEM recados aprovados.
-- O site publica com aprovado=true (aparece na hora); para voltar a moderação,
-- troque o insert no mural.js para aprovado:false e aprove no dashboard.
drop policy if exists "leitura aprovados" on depoimentos;
create policy "leitura aprovados" on depoimentos
  for select using (aprovado = true);

-- Visitantes podem INSERIR (sempre entra como aprovado=false; sem update/delete público)
drop policy if exists "insercao publica" on depoimentos;
create policy "insercao publica" on depoimentos
  for insert with check (true);
