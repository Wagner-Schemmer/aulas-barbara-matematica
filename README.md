# Bárbara • Aulas Particulares de Matemática

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

## Mural de recados (alunas/mães escrevem, sem conta)
1. Crie projeto grátis em supabase.com → SQL Editor → rode `supabase-mural.sql`
2. Project Settings → API: copie `URL` + `anon public` para `supabase-config.js`
3. Pronto: recados entram como `aprovado=false`; a Bárbara aprova no dashboard e aparece no site
4. **Sem config?** O formulário manda o recado pelo WhatsApp dela e ela publica depois — funciona desde o dia 1

## Personalizar (com a Bárbara)
1. `index.html` — trocar avatar `B ♡` por `<img src="barbara.jpg">`
2. Depoimentos marcados com `*` → depoimentos reais
3. Preço / aula experimental → seção FAQ + CTA final
4. Instagram: [@babi.vbtt](https://instagram.com/babi.vbtt) • WhatsApp: (49) 99188-7763

## Deploy
Vercel / Netlify: arrastar a pasta ou conectar o repo `aulas-barbara-matematica`.
