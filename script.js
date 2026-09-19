// Menu mobile
const btn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
btn?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Mini calculadora interativa
const input = document.getElementById('calcInput');
const cBtn = document.getElementById('calcBtn');
const msg = document.getElementById('calcMsg');
function check() {
  const v = (input.value || '').trim().replace(',', '.');
  if (v === '56') {
    msg.textContent = '🎉 Isso! 7 × 8 = 56. Comigo você aprende até tabuada cantando ♡';
    msg.style.color = '#4ADE80';
  } else if (!v) {
    msg.textContent = 'Tenta aí, sem medo de errar 😉';
    msg.style.color = '#FDE68A';
  } else {
    msg.textContent = 'Quase! Tenta de novo — errar faz parte 💪';
    msg.style.color = '#FCA5A5';
  }
}
cBtn?.addEventListener('click', check);
input?.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
