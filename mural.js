// Mural do orgulho — lista + publica recados (Supabase; fallback WhatsApp)
(function () {
  const cfg = window.MURAL_CONFIG || {};
  const ready = cfg.url && cfg.anonKey;
  const list = document.getElementById("muralList");
  const form = document.getElementById("muralForm");
  const status = document.getElementById("mStatus");
  let stars = 5;
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const hearts = n => "♥".repeat(n) + "♡".repeat(5 - n);

  document.querySelectorAll("#mStars button").forEach(b => b.onclick = () => {
    stars = +b.dataset.s;
    document.querySelectorAll("#mStars button").forEach(x => x.classList.toggle("on", +x.dataset.s <= stars));
  });

  const card = d => `<blockquote class="quote reveal visible">“${esc(d.mensagem)}”<footer>— ${esc(d.nome)} · ${esc(d.relacao)} <span class="hearts">${hearts(d.estrelas)}</span></footer></blockquote>`;

  async function load() {
    if (!ready) {
      list.innerHTML = card({ nome: "Seja a primeira", relacao: "mural novo", mensagem: "Deixe seu recado no formulário abaixo e estreie o mural! ♡", estrelas: 5 });
      return;
    }
    try {
      const r = await fetch(`${cfg.url}/rest/v1/depoimentos?select=nome,relacao,mensagem,estrelas&aprovado=eq.true&order=criado_em.desc&limit=30`, {
        headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey }
      });
      const rows = await r.json();
      list.innerHTML = rows.length ? rows.map(card).join("")
        : card({ nome: "Mural fresquinho", relacao: "aguardando", mensagem: "Nenhum recado aprovado ainda — o seu pode ser o primeiro! ♡", estrelas: 5 });
    } catch {
      list.innerHTML = card({ nome: "Ops", relacao: "offline", mensagem: "Não consegui carregar o mural agora. Tenta de novo em instantes. ♡", estrelas: 5 });
    }
  }

  let lastSent = 0;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (document.getElementById("mTrap").value) return; // honeypot anti-robô
    const nome = document.getElementById("mNome").value.trim();
    const relacao = document.getElementById("mRelacao").value;
    const mensagem = document.getElementById("mMsg").value.trim();
    if (nome.length < 2 || mensagem.length < 4) { status.textContent = "Escreve seu nome e um recadinho um pouco maior ♡"; return; }
    if (Date.now() - lastSent < 30000) { status.textContent = "Calma, espera uns segundinhos antes de enviar outro ♡"; return; }
    lastSent = Date.now();

    if (!ready) {
      // Fallback: manda pelo WhatsApp e a Bárbara publica no mural
      const txt = encodeURIComponent(`💌 Recado pro mural do site:\nNome: ${nome}\nSou: ${relacao}\nNota: ${stars}/5\n${mensagem}`);
      window.open(`https://wa.me/${window.MURAL_WHATSAPP}?text=${txt}`, "_blank");
      status.textContent = "Abrimos seu WhatsApp — é só apertar enviar que a Bárbara publica seu recado! ♡";
      form.reset();
      return;
    }
    status.textContent = "Enviando…";
    try {
      const r = await fetch(`${cfg.url}/rest/v1/depoimentos`, {
        method: "POST",
        headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ nome, relacao, mensagem, estrelas: stars })
      });
      if (!r.ok) throw 0;
      status.textContent = "Obrigada! Seu recado aparece aqui após aprovação ♡";
      form.reset();
    } catch { status.textContent = "Falha ao enviar. Tenta de novo ou chama no WhatsApp ♡"; }
  });

  load();
})();
