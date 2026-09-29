// Mural do orgulho — salva direto no Supabase + carrossel automático
(function () {
  const cfg = window.MURAL_CONFIG || {};
  const ready = !!(cfg.url && cfg.anonKey);
  const track = document.getElementById("muralTrack");
  const form = document.getElementById("muralForm");
  const status = document.getElementById("mStatus");
  let stars = 5;
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const hearts = n => "♥".repeat(n) + "♡".repeat(5 - n);
  const H = (t, f) => ({ nome: t, relacao: "mural", mensagem: f, estrelas: 5 });

  document.querySelectorAll("#mStars button").forEach(b => b.onclick = () => {
    stars = +b.dataset.s;
    document.querySelectorAll("#mStars button").forEach(x => x.classList.toggle("on", +x.dataset.s <= stars));
  });
  const anonBox = document.getElementById("mAnon");
  const nomeInput = document.getElementById("mNome");
  anonBox.addEventListener("change", () => {
    nomeInput.disabled = anonBox.checked;
    nomeInput.placeholder = anonBox.checked ? "Anônimo 🕵️" : "Seu nome (ex: Maria)";
  });

  const card = d => `<blockquote class="quote slide">“${esc(d.mensagem)}”<footer>— ${esc(d.nome)} · ${esc(d.relacao)} <span class="hearts">${hearts(d.estrelas)}</span></footer></blockquote>`;

  function paint(items) {
    const base = items.length ? items : [H("Mural fresquinho", "Nenhum recado ainda — o seu pode ser o primeiro! ♡")];
    const reps = base.length < 4 ? 4 : 2; // garante faixa cheia p/ o loop
    track.innerHTML = Array(reps).fill(base.map(card).join("")).join("");
    track.style.animationDuration = Math.max(18, base.length * reps * 4) + "s";
  }

  async function load() {
    if (!ready) {
      paint([H("Ativando o mural", "Estamos ligando o mural agora — volta em instantes! ♡")]);
      return;
    }
    try {
      const r = await fetch(`${cfg.url}/rest/v1/depoimentos?select=nome,relacao,mensagem,estrelas&aprovado=eq.true&order=criado_em.desc&limit=30`, {
        headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey }
      });
      paint(await r.json());
    } catch { paint([H("Ops", "Sem conexão agora — os recados voltam em instantes ♡")]); }
  }

  let lastSent = 0;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (document.getElementById("mTrap").value) return;
    if (!ready) { status.textContent = "Mural ativando… tenta de novo em instantes ♡"; return; }
    const anon = anonBox.checked;
    const nome = anon ? "Anônimo 🕵️" : nomeInput.value.trim();
    const relacao = document.getElementById("mRelacao").value;
    const mensagem = document.getElementById("mMsg").value.trim();
    if ((!anon && nomeInput.value.trim().length < 2) || mensagem.length < 4) { status.textContent = "Escreve seu nome e um recadinho maior ♡"; return; }
    if (Date.now() - lastSent < 30000) { status.textContent = "Espera uns segundinhos antes de enviar outro ♡"; return; }
    lastSent = Date.now();
    status.textContent = "Publicando…";
    try {
      const r = await fetch(`${cfg.url}/rest/v1/depoimentos`, {
        method: "POST",
        headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ nome, relacao, mensagem, estrelas: stars, aprovado: true })
      });
      if (!r.ok) throw 0;
      status.textContent = "Publicado! Olha ele passando no carrossel ♡";
      form.reset();
      nomeInput.disabled = false;
      nomeInput.placeholder = "Seu nome (ex: Maria)";
      stars = 5;
      document.querySelectorAll("#mStars button").forEach(x => x.classList.toggle("on", true));
      load();
    } catch { status.textContent = "Falha ao publicar. Tenta de novo ♡"; }
  });

  load();
})();
