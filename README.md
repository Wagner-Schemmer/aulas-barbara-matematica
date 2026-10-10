# Bárbara • Aulas Particulares de Matemática

[![Live](https://img.shields.io/badge/demo-ao_vivo-4ade80?style=for-the-badge&logo=vercel&logoColor=white)](https://barbara-matematica.vercel.app)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

Site institucional para a professora Bárbara (licencianda em Matemática - IFFar).
Aulas particulares em Frederico Westphalen (presencial) e online para todo Brasil.

## Estrutura
```
aulas-barbara-matematica/
├── index.html  # todo o conteúdo (hero, benefícios, conteúdos, como funciona, sobre, FAQ, CTA)
├── styles.css  # design misto fofo + profissional (rosa/lilás, Caveat + Poppins)
├── mural.js           # lista/publica recados (Supabase REST, sem dependências)
├── supabase-config.js # cole URL + anonKey aqui
└── supabase-mural.sql # tabela depoimentos + RLS (moderação)
```

## Rodar
Go Live no VSCode (index.html) ou `python3 -m http.server 8000`

## Painel da professora (`admin.html`)
A Bárbara edita sozinha: telefone, preços, foto, apaga recados, troca a senha.
1. Rode `supabase-site.sql` no SQL Editor (1 vez)
2. Dashboard → Authentication → Users → **Add user** (e-mail dela + senha) → passe login e URL `/admin.html` para ela
3. Site lê tudo da tabela `site_config` (com valores padrão se vazio)

## Mural de recados (alunas/mães escrevem, sem conta, aparece na hora)
OBRIGATÓRIO (5 min, 1 vez só):
1. Crie projeto grátis em supabase.com → SQL Editor → rode `supabase-mural.sql`
2. Project Settings → API: copie `URL` + `anon public` para `supabase-config.js`
3. Pronto: recado salva direto e entra no carrossel automático (sem WhatsApp, sem moderação)
4. Spam? Apague no dashboard (Table Editor). Para reativar moderação: fale com o Wagner

## Personalizar (com a Bárbara)
1. ✅ Foto `barbara.jpg` no ar
2. Preços: online R$45, presencial R$50 (seção #precos + FAQ)

## Deploy
Vercel / Netlify: arrastar a pasta ou conectar o repo `aulas-barbara-matematica`.
