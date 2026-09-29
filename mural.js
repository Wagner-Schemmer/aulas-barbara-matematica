// Mural do orgulho — cliente oficial supabase-js + realtime (com fallback)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

(function () {
  const cfg = window.MURAL_CONFIG || {};
  const track = document.getElementById("muralTrack");
  const form = document.getElementById("muralForm");
  const status = document.getElementById("mStatus");
  let stars = 5;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const hearts = n => "♥".repeat(n) + "♡".repeat(5 - n);
  const ready = !!(cfg.url && cfg.anonKey);
  const sb = ready ? createClient(cfg.url, cfg.anonKey) : null;

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
    const base = items.length ? items : [{ nome: "Mural fresquinho", relacao: "aguardando", mensagem: "Nenhum recado ainda — o seu pode ser o primeiro! ♡", estrelas: 5 }];
    const reps = base.length < 4 ? 4 : 2;
    track.innerHTML = Array(reps).fill(base.map(card).join("")).join("");
    track.style.animationDuration = Math.max(18, base.length * reps * 4) + "s";
  }

  async function load() {
    if (!sb) { paint([{ nome: "Ativando o mural", relacao: "mural", mensagem: "Estamos ligando o mural agora — volta em instantes! ♡", estrelas: 5 }]); return; }
    const { data, error } = await sb.from("depoimentos")
      .select("nome,relacao,mensagem,estrelas").eq("aprovado", true)
      .order("criado_em", { ascending: false }).limit(30);
    paint(error ? [{ nome: "Ops", relacao: "offline", mensagem: "Não consegui carregar agora. Tenta de novo em instantes ♡", estrelas: 5 }] : data);
  }

  let lastSent = 0;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (document.getElementById("mTrap").value) return;
    if (!sb) { status.textContent = "Mural ativando… tenta de novo em instantes ♡"; return; }
    const anon = anonBox.checked;
    const nome = anon ? "Anônimo 🕵️" : nomeInput.value.trim();
    const relacao = document.getElementById("mRelacao").value;
    const mensagem = document.getElementById("mMsg").value.trim();
    if ((!anon && nomeInput.value.trim().length < 2) || mensagem.length < 4) { status.textContent = "Escreve seu nome e um recadinho maior ♡"; return; }
    if (Date.now() - lastSent < 30000) { status.textContent = "Espera uns segundinhos antes de enviar outro ♡"; return; }
    lastSent = Date.now();
    status.textContent = "Publicando…";
    const { error } = await sb.from("depoimentos").insert({ nome, relacao, mensagem, estrelas: stars, aprovado: true });
    if (error) { status.textContent = "Falha ao publicar. Tenta de novo ♡"; return; }
    status.textContent = "Publicado! Olha ele passando no carrossel ♡";
    form.reset();
    nomeInput.disabled = false;
    nomeInput.placeholder = "Seu nome (ex: Maria)";
    stars = 5;
    document.querySelectorAll("#mStars button").forEach(x => x.classList.toggle("on", true));
    load();
  });

  load();
  if (sb) {
    // Tempo real: recado novo aparece sem recarregar (precisa do SQL de realtime, senão o polling abaixo cobre)
    try {
      sb.channel("mural").on("postgres_changes", { event: "INSERT", schema: "public", table: "depoimentos" }, load).subscribe();
    } catch { /* fallback abaixo */ }
    setInterval(() => { if (!document.hidden) load(); }, 45000);
    window.addEventListener("focus", load);
  }
})();
