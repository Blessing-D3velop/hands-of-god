const WA = '27713025238';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const MENU = {
  'Massages': { cols: ['Per person', 'Couple'], items: [
    ['Swedish Massage', '60 mins', 'R450', 'R850'],
    ['Hotstone Massage', '60 mins', 'R520', 'R1,000'],
    ['Back Massage', '45 mins', 'R370', 'R700']] },
  'Facials': { items: [
    ['Melanin Express Facial', '30 mins', 'R250'],
    ['Signature Facial', '45 mins', 'R350'],
    ['Deep Cleansing & Steam', '60 mins', 'R420']] },
  'Waxing': { items: [
    ['Chin', '', 'R180'], ['Underarm', '', 'R200'], ['Chest', '', 'R250'],
    ['Brazilian', '', 'R300'], ['Hollywood', '', 'R300'], ['Calves', '', 'R350']] },
  'Lash Extensions': { items: [['Cluster Lashes', '', 'R250'], ['Individual Lashes', '', 'R350']] },
  'Nails & Foot Care': { items: [
    ['Gel X', '', 'R220'], ['Polygel', '', 'R280'], ['Pedicure', '', 'R250'],
    ['Foot Care Treatment', '', 'R300'], ['Foot Soak & Scrub', '', 'R250'], ['Gel Toes', '', 'R200']] }
};

// Tabs
const tabs = document.getElementById('tabs'), panel = document.getElementById('panel');
function show(cat) {
  [...tabs.children].forEach(b => b.setAttribute('aria-selected', b.textContent === cat));
  const d = MENU[cat];
  panel.innerHTML = (d.cols ? `<div class="hd">${d.cols.map(c => `<span>${c}</span>`).join('')}</div>` : '') +
    d.items.map(([n, t, ...p]) => `<button class="row" data-book="Hi, I'd like to book the ${n}">
      <span class="nm">${n}${t ? `<small>${t}</small>` : ''}</span>
      ${p.map(x => `<span class="pr">${x}</span>`).join('')}</button>`).join('');
}
Object.keys(MENU).forEach(c => {
  const b = document.createElement('button');
  b.role = 'tab'; b.textContent = c; b.onclick = () => show(c); tabs.appendChild(b);
});
show('Massages');

// WhatsApp booking (delegated, so dynamic rows work too)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-book]');
  if (!el) return;
  e.preventDefault();
  window.open(waLink(el.dataset.book), '_blank', 'noopener');
});

// Mobile menu + nav shadow
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
menu.querySelectorAll('a').forEach(a => a.onclick = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 10), { passive: true });

// Opening hours (JS getDay: 0 = Sunday)
const HOURS = [['Sunday', null], ['Monday', null], ['Tuesday', [11, 18]], ['Wednesday', [11, 18]],
  ['Thursday', [11, 18]], ['Friday', [11, 18]], ['Saturday', [10, 17]]];
const fmt = h => String(h).padStart(2, '0') + ':00';
const order = [1, 2, 3, 4, 5, 6, 0];
const now = new Date(), today = now.getDay();
document.getElementById('hoursList').innerHTML = order.map(i => {
  const [d, h] = HOURS[i];
  return `<li class="${i === today ? 'today' : ''}"><span>${d}</span><span>${h ? `${fmt(h[0])} – ${fmt(h[1])}` : 'Closed'}</span></li>`;
}).join('');
const th = HOURS[today][1], hr = now.getHours() + now.getMinutes() / 60;
document.getElementById('todayPill').textContent = !th ? 'Closed today. Message us to book your next visit.'
  : hr >= th[0] && hr < th[1] ? `Open now until ${fmt(th[1])}` : `Today: ${fmt(th[0])} – ${fmt(th[1])}`;

// Gallery (falls back to a styled tile if the photo is missing)
const labels = ['Treatment room', 'Pool area', 'Candles & towels', 'Fresh flowers', 'Massage beds', 'Welcome to Hands of Gold'];
const grid = document.getElementById('grid');
labels.forEach((l, i) => {
  const t = document.createElement('div'); t.className = 'tile'; t.textContent = l;
  const img = new Image(); img.alt = l; img.loading = 'lazy'; img.src = `images/gallery-${i + 1}.jpg`;
  img.onload = () => { t.textContent = ''; t.appendChild(img); };
  t.onclick = () => { if (img.parentNode === t) { lb.innerHTML = ''; const c = img.cloneNode(); lb.appendChild(c); lb.classList.add('open'); } };
  grid.appendChild(t);
});
const lb = document.createElement('div'); lb.className = 'lb'; lb.onclick = () => lb.classList.remove('open'); document.body.appendChild(lb);

// Fade-in
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('yr').textContent = now.getFullYear();
