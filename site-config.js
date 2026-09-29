// Aplica telefone, preços e foto editados pela Bárbara (tabela site_config)
(function () {
  const cfg = window.MURAL_CONFIG || {};
  if (!cfg.url || !cfg.anonKey) return;
  const H = { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey };
  fetch(cfg.url + "/rest/v1/site_config?select=chave,valor", { headers: H })
    .then(r => r.json()).then(rows => {
      if (!Array.isArray(rows)) return;
      const c = Object.fromEntries(rows.map(r => [r.chave, r.valor]));
      if (c.whatsapp && /^\d{10,13}$/.test(c.whatsapp)) {
        document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
          a.href = a.href.replace(/wa\.me\/\d+/, "wa.me/" + c.whatsapp);
        });
        const d = c.whatsapp.replace(/^55/, "");
        const f = d.length === 11
          ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
          : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        document.querySelectorAll(".wa-num").forEach(e => e.textContent = f);
      }
      if (c.preco_online) document.querySelectorAll('[data-preco="online"]').forEach(e => e.textContent = c.preco_online);
      if (c.preco_presencial) document.querySelectorAll('[data-preco="presencial"]').forEach(e => e.textContent = c.preco_presencial);
      const img = document.querySelector("img.photo");
      if (img && (c.foto_url || "").startsWith("http")) img.src = c.foto_url;
    }).catch(() => {});
})();
