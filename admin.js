// Painel da professora — login + edições (cliente oficial supabase-js)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const cfg = window.MURAL_CONFIG || {};
const $ = id => document.getElementById(id);
const msg = (id, t, ok) => { const e = $(id); e.textContent = t; e.className = "amSG" + (ok === true ? " ok" : ok === false ? " err" : ""); };
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hearts = n => { n = Math.max(0, Math.min(10, n || 0)); return "♥".repeat(n) + "♡".repeat(10 - n); };

if (!cfg.url || !cfg.anonKey) {
  msg("aLoginMsg", "Painel ainda ligando… volta em instantes ♡", false);
  throw new Error("sem config");
}
const sb = createClient(cfg.url, cfg.anonKey);

async function session() {
  const { data } = await sb.auth.getSession();
  const on = !!data.session;
  $("loginBox").style.display = on ? "none" : "";
  $("panel").style.display = on ? "" : "none";
  if (on) { loadConfig(); loadRecados(); }
}

$("aLogin").onclick = async () => {
  msg("aLoginMsg", "Entrando…");
  const { error } = await sb.auth.signInWithPassword({ email: $("aEmail").value.trim(), password: $("aPass").value });
  if (error) msg("aLoginMsg", "E-mail ou senha errados. Tenta de novo ♡", false);
  else { msg("aLoginMsg", ""); session(); }
};
$("aEmail").addEventListener("keydown", e => { if (e.key === "Enter") $("aLogin").click(); });
$("aPass").addEventListener("keydown", e => { if (e.key === "Enter") $("aLogin").click(); });
$("aLogout").onclick = async () => { await sb.auth.signOut(); session(); };

async function loadConfig() {
  const { data } = await sb.from("site_config").select("chave,valor");
  if (!data) return;
  const c = Object.fromEntries(data.map(r => [r.chave, r.valor]));
  if (c.whatsapp) { $("cWa").value = c.whatsapp; $("cWaPrev").textContent = c.whatsapp; }
  if (c.preco_online) $("cOn").value = c.preco_online;
  if (c.preco_presencial) $("cPre").value = c.preco_presencial;
  if ((c.foto_url || "").startsWith("http")) $("cPhotoPrev").src = c.foto_url;
}
async function save(key, value) {
  return sb.from("site_config").upsert({ chave: key, valor: value }, { onConflict: "chave" });
}

$("cWa").addEventListener("input", e => { $("cWaPrev").textContent = e.target.value || "—"; });
$("cWaSave").onclick = async () => {
  const v = $("cWa").value.replace(/\D/g, "");
  if (!/^\d{10,13}$/.test(v)) { msg("cWaMsg", "Confere o número: só dígitos, com 55 na frente.", false); return; }
  const { error } = await save("whatsapp", v);
  msg("cWaMsg", error ? "Falhou, tenta de novo ♡" : "Telefone atualizado no site! ♡", !error);
};

$("cPrSave").onclick = async () => {
  const on = $("cOn").value.trim(), pre = $("cPre").value.trim();
  if (!/^\d{1,4}$/.test(on) || !/^\d{1,4}$/.test(pre)) { msg("cPrMsg", "Preços só com números (ex: 45).", false); return; }
  const a = await save("preco_online", on), b = await save("preco_presencial", pre);
  msg("cPrMsg", (a.error || b.error) ? "Falhou, tenta de novo ♡" : "Preços atualizados no site! ♡", !(a.error || b.error));
};

$("cPhSave").onclick = async () => {
  const f = $("cPhoto").files[0];
  if (!f) { msg("cPhMsg", "Escolhe uma foto primeiro ♡", false); return; }
  if (f.size > 5 * 1024 * 1024) { msg("cPhMsg", "Foto muito grande (máx 5MB).", false); return; }
  msg("cPhMsg", "Enviando…");
  const { error } = await sb.storage.from("site").upload("barbara.jpg", f, { upsert: true, contentType: f.type || "image/jpeg" });
  if (error) { msg("cPhMsg", "Falhou: " + error.message, false); return; }
  const url = `${cfg.url}/storage/v1/object/public/site/barbara.jpg?t=${Date.now()}`;
  const s = await save("foto_url", url);
  if (s.error) { msg("cPhMsg", "Foto enviada, mas falhou salvar. Tenta de novo.", false); return; }
  $("cPhotoPrev").src = url;
  msg("cPhMsg", "Foto trocada no site! ♡", true);
};

async function loadRecados() {
  const box = $("cRecList");
  box.innerHTML = "<p class='micro'>Carregando…</p>";
  const { data, error } = await sb.from("depoimentos").select("id,nome,relacao,mensagem,estrelas,criado_em")
    .order("criado_em", { ascending: false }).limit(50);
  if (error) { box.innerHTML = "<p class='micro'>Falhou carregar.</p>"; return; }
  box.innerHTML = data.length ? data.map(d => `
    <div class="arec" data-id="${d.id}">
      <div>“${esc(d.mensagem)}”</div>
      <footer>— ${esc(d.nome)} · ${esc(d.relacao)} <span style="color:#EC4899">${hearts(d.estrelas)}</span> · ${new Date(d.criado_em).toLocaleDateString("pt-BR")}</footer>
      <button class="del" data-id="${d.id}">🗑 Apagar</button>
    </div>`).join("") : "<p class='micro'>Nenhum recado ainda.</p>";
}
$("cReLoad").onclick = loadRecados;
$("cRecList").addEventListener("click", async e => {
  const id = e.target.dataset?.id;
  if (!id || !e.target.classList.contains("del")) return;
  if (!confirm("Apagar este recado?")) return;
  const { error } = await sb.from("depoimentos").delete().eq("id", id);
  if (!error) e.target.closest(".arec").remove();
});

$("cPassSave").onclick = async () => {
  const p = $("cPass").value;
  if (p.length < 6) { msg("cPassMsg", "Mínimo 6 caracteres.", false); return; }
  const { error } = await sb.auth.updateUser({ password: p });
  msg("cPassMsg", error ? "Falhou: " + error.message : "Senha trocada! ♡", !error);
  if (!error) $("cPass").value = "";
};

session();
