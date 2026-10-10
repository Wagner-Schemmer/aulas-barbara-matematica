<div align="center">

[![Stars](https://img.shields.io/github/stars/Wagner-Schemmer/aulas-barbara-matematica?style=social)](https://github.com/Wagner-Schemmer/aulas-barbara-matematica/stargazers)
[![Live](https://img.shields.io/badge/demo-ao_vivo-ec4899?style=for-the-badge&logo=vercel&logoColor=white)](https://barbara-matematica.vercel.app)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

  <a href="https://barbara-matematica.vercel.app"><img alt="Bárbara — Matemática sem medo" src="docs/banner.svg" /></a>

  <h1>Bárbara · Matemática sem medo</h1>

  <p>
    <b>Aulas particulares online e em Frederico Westphalen.</b>
    <br />
    Site institucional com mural de depoimentos em tempo real e painel onde a professora edita tudo sozinha.
  </p>

  <p>
    <a href="https://barbara-matematica.vercel.app"><b>Demo</b></a> ·
    <a href="#o-que-cada-parte-faz">Partes</a> ·
    <a href="#como-rodar">Como rodar</a> ·
    <a href="#painel-da-professora">Painel</a> ·
    <a href="#stack">Stack</a>
  </p>
</div>

<a href="https://barbara-matematica.vercel.app"><img src="docs/preview.png" alt="Site da Bárbara ao vivo" /></a>

Site da professora Bárbara (licencianda em Matemática - IFFar): apresentação, conteúdos, preços, FAQ, mural de recados que entra no ar na hora e área administrativa com login.

## O que cada parte faz

| Parte | O que faz | Tecnologia |
|---|---|---|
| **Landing** | Hero, benefícios, conteúdos, como funciona, sobre, preços, FAQ, CTA de WhatsApp | HTML + CSS (Caveat + Poppins) |
| **Mural de recados** | Alunas/mães escrevem sem conta e o recado entra no carrossel na hora | Supabase Realtime |
| **Painel da professora** | Edita telefone, preços, foto, apaga recados, troca a senha | Supabase Auth + `site_config` |
| **Admin de conteúdo** | Textos e preços lidos do banco (com padrão se vazio) | Tabela `site_config` |

## Como rodar

1. Abra o `index.html` (Go Live no VSCode ou `python3 -m http.server 8000`).
2. Para o mural funcionar: crie um projeto grátis no Supabase, rode `supabase-mural.sql` e cole `URL` + `anon public` em `supabase-config.js`.
3. Para o painel: rode `supabase-site.sql` e crie o usuário da professora em Authentication → Users.

## Estrutura

```
aulas-barbara-matematica/
├── index.html          # todo o conteúdo (hero, benefícios, conteúdos, preços, FAQ, CTA)
├── admin.html          # painel da professora (login)
├── styles.css          # design fofo + profissional (rosa/lilás)
├── mural.js            # lista/publica recados (Supabase REST, sem dependências)
├── supabase-config.js  # cole URL + anonKey aqui
├── supabase-mural.sql  # tabela depoimentos + RLS
└── supabase-site.sql   # tabela site_config
```

## Personalizar

1. Foto `barbara.jpg`, preços em `#precos` e no FAQ (hoje: online R$45, presencial R$50).
2. WhatsApp e textos em `index.html`.
3. Deploy: arrastar a pasta na Vercel ou conectar o repo.

## Stack

HTML · CSS · JavaScript · Supabase (Auth + Realtime). Sem build.

## Quem faz

<a href="https://github.com/Wagner-Schemmer/aulas-barbara-matematica/graphs/contributors"><img src="https://contrib.rocks/image?repo=Wagner-Schemmer/aulas-barbara-matematica" alt="contribuidores" /></a>

## Star history

<a href="https://www.star-history.com/#Wagner-Schemmer/aulas-barbara-matematica&Date"><img alt="Star History" src="https://api.star-history.com/svg?repos=Wagner-Schemmer/aulas-barbara-matematica&type=Date" /></a>

---
Feito por [Wagner Schemmer](https://wagner-port.vercel.app) · [Portfólio](https://wagner-port.vercel.app) · [LinkedIn](https://www.linkedin.com/in/wagner-schemmer-martins-46950627a)
