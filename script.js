/* =====================================================================
   LAPTOP MAKASSAR - SCRIPT UTAMA (halaman pengunjung)
   Semua data (produk, info toko, video) diambil dari Supabase.
   Tidak ada lagi data yang disimpan di localStorage.
   Butuh: supabase-config.js dimuat lebih dulu.
   ===================================================================== */

/* Bersihkan sisa data lama (penyebab gambar "gorila nyasar" & beda tampilan antar perangkat) */
try {
  localStorage.removeItem('PRODUK_KATALOG');
  localStorage.removeItem('CONFIG_TOKO');
} catch (e) { /* abaikan */ }

/* =====================================================================
   1. KONFIGURASI TOKO (nilai awal / cadangan, ditimpa data dari Supabase)
   ===================================================================== */
const CONFIG = {
  wa: '6285117822767',
  alamat: 'Jl. Sepakat, Tamarunang, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92112',
  jam: 'Senin - Minggu: 09.00 - 11.00 WITA',
  instagram: 'laptop_makassar',
  mapsLink: 'https://maps.app.goo.gl/CrUqGD1NqXt19Kpy9',
  petaEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8058219468516!2d119.4925!3d-5.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDgnMQuMSJTIDExOWKwDI5JzMzLjAiRQ!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid',
  pesanUmum: 'assalamualaikum laptop Makassar',
  fotoToko: ''
};

/* =====================================================================
   2. KATEGORI
   ===================================================================== */
const KATEGORI = [
  { id: 'gaming',   label: 'Laptop Gaming',   desc: 'ASUS ROG, TUF, Acer Nitro, Lenovo Legion',    foto: 'images/img-02.jpg' },
  { id: 'macbook',  label: 'MacBook',         desc: 'MacBook Air / MacBook Pro semua seri',        foto: 'images/img-03.jpg' },
  { id: 'vivobook', label: 'Asus Vivobook',   desc: 'Core i3 / i5 / i7',                           foto: 'images/img-04.jpg' },
  { id: 'celeron',  label: 'Celeron / Daily', desc: 'Hemat untuk pelajar dan kerja ringan',        foto: 'images/img-05.jpg' },
  { id: 'lenovo',   label: 'Lenovo',          desc: 'ThinkPad / IdeaPad Series',                   foto: 'images/img-06.jpg' },
  { id: 'hpdell',   label: 'HP & Dell',       desc: 'Office / Business Class',                     foto: 'images/img-07.jpg' }
];

/* =====================================================================
   3. HIGHLIGHT
   ===================================================================== */
const HIGHLIGHT = [];
const LABEL_TAG = { promo: 'Promo', baru: 'Baru masuk', terlaris: 'Terlaris' };

/* =====================================================================
   4. KONDISI UNIT
   ===================================================================== */
const KONDISI = {
  bekas: {
    label: 'Bekas, mulus',
    detail: 'Sudah dicek semua fungsi: layar, keyboard, port, baterai, dan wifi. Tidak ada minus yang mengganggu pemakaian.',
    kelengkapan: 'Charger dan dus laptop',
    garansi: 'Garansi toko 1 bulan'
  },
  baru: {
    label: 'Baru, segel',
    detail: 'Unit baru dari distributor dan belum pernah dipakai.',
    kelengkapan: 'Charger original, dus, dan buku panduan',
    garansi: 'Garansi toko 1 tahun'
  }
};

/* =====================================================================
   5. PRODUK (diisi dari Supabase)
   ===================================================================== */
let PRODUK = [];

/* =====================================================================
   KODE PROGRAM UTAMA
   ===================================================================== */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rupiah = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
const waLink = teks => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(teks)}`;
const namaLengkap = p => `${p.merek} ${p.seri}`;
const kurangGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FALLBACK_IMG = `onerror="this.onerror=null;this.src=window.FOTO_KOSONG"`;

const tahunEl = document.getElementById('tahun');
if (tahunEl) tahunEl.textContent = new Date().getFullYear();

/* ---------- Terapkan info toko ke halaman ---------- */
const petaFrame = document.getElementById('peta');

function terapkanConfig() {
  $$('[data-fill]').forEach(el => { el.textContent = CONFIG[el.dataset.fill] ?? ''; });
  $$('[data-wa]').forEach(a => { a.href = waLink(CONFIG.pesanUmum); });
  $$('[data-ig]').forEach(a => { a.href = 'https://www.instagram.com/' + encodeURIComponent(CONFIG.instagram); });
  $$('[data-ig-text]').forEach(s => { s.textContent = '@' + CONFIG.instagram; });
  $$('[data-maps]').forEach(a => { a.href = CONFIG.mapsLink; });
  if (petaFrame && petaFrame.getAttribute('src') !== CONFIG.petaEmbedUrl) petaFrame.src = CONFIG.petaEmbedUrl;
  if (CONFIG.fotoToko) {
    const imgToko = $('img[data-ph*="Tampak depan"]');
    if (imgToko && imgToko.getAttribute('src') !== CONFIG.fotoToko) imgToko.src = CONFIG.fotoToko;
  }
}
terapkanConfig();

/* =====================================================================
   HERO: SLIDER FOTO + VIDEO (rasio potret 9:16)
   - Slide video: tombol jeda/putar dan suara tampil.
   - Slide foto: tombol jeda dan suara otomatis disembunyikan.
   ===================================================================== */
const heroSection = $('#hero');
const heroTrack   = $('#heroTrack');
const heroCtl     = $('#heroCtl');
const heroNav     = $('#heroNav');
const heroBars    = $('#heroBars');
const heroPlayBtn = $('#heroPlay');
const heroMuteBtn = $('#heroMute');
const HERO_DETIK_FOTO = 5000;
const HERO = { slides: [], index: 0, muted: true, userPaused: false, timer: null, terlihat: true, sig: '' };

const videoAktif = () => {
  const el = heroTrack.children[HERO.index];
  return el ? el.querySelector('video') : null;
};

function heroSlideHtml(s, i) {
  const cap = s.judul ? `<div class="hero-cap"><p>${esc(s.judul)}</p></div>` : '';
  const label = `role="group" aria-roledescription="slide" aria-label="Slide ${i + 1}"`;
  if (s.jenis === 'video') {
    return `<div class="hero-slide" data-jenis="video" ${label}>
      <video src="${esc(s.url)}" class="h-full w-full object-cover" muted playsinline preload="${i === 0 ? 'auto' : 'metadata'}" aria-label="${esc(s.judul || 'Video promosi Laptop Makassar')}"></video>${cap}</div>`;
  }
  return `<div class="hero-slide" data-jenis="foto" ${label}>
      <img src="${esc(s.url)}" alt="${esc(s.judul || 'Banner Laptop Makassar')}" ${i === 0 ? '' : 'loading="lazy"'} ${FALLBACK_IMG} class="h-full w-full object-cover">${cap}</div>`;
}

function heroSinkronIkon() {
  const v = videoAktif();
  const jeda = !v || v.paused;
  $('#heroPlayIcon').setAttribute('href', jeda ? '#i-play' : '#i-pause');
  heroPlayBtn.setAttribute('aria-label', jeda ? 'Putar video' : 'Jeda video');
  $('#heroMuteIcon').setAttribute('href', HERO.muted ? '#i-vol-off' : '#i-vol-on');
  heroMuteBtn.setAttribute('aria-label', HERO.muted ? 'Suara video, saat ini mati. Ketuk untuk menyalakan' : 'Suara video, saat ini menyala. Ketuk untuk mematikan');
}

function heroMainkan(v) {
  if (!v) return;
  v.muted = HERO.muted;
  const p = v.play();
  if (p && p.catch) p.catch(() => {
    // Browser menolak autoplay bersuara: kembali ke mode senyap
    if (!v.muted) { v.muted = true; HERO.muted = true; heroSinkronIkon(); v.play().catch(() => {}); }
  });
}

function heroJadwalOtomatis() {
  clearTimeout(HERO.timer);
  if (HERO.slides.length < 2 || kurangGerak() || !HERO.terlihat) return;
  const s = HERO.slides[HERO.index];
  if (s && s.jenis === 'foto') HERO.timer = setTimeout(() => heroGeser(1), HERO_DETIK_FOTO);
}

function heroUpdateBars() {
  $$('.hero-bar', heroBars).forEach((b, i) => b.setAttribute('aria-current', String(i === HERO.index)));
}

function heroAktifkan(idx) {
  HERO.index = idx;
  HERO.userPaused = false;
  $$('.hero-slide', heroTrack).forEach((el, i) => {
    const v = el.querySelector('video');
    if (!v) return;
    if (i === idx) { if (HERO.terlihat) heroMainkan(v); }
    else { v.pause(); try { v.currentTime = 0; } catch (e) { /* abaikan */ } }
  });
  const s = HERO.slides[idx];
  heroCtl.classList.toggle('hidden', !(s && s.jenis === 'video')); // slide foto: kontrol hilang
  heroUpdateBars();
  heroSinkronIkon();
  heroJadwalOtomatis();
}

function heroKe(i, halus = true) {
  const n = HERO.slides.length;
  if (!n) return;
  const idx = (i + n) % n;
  const dekat = Math.abs(idx - HERO.index) <= 1;
  heroTrack.scrollTo({ left: idx * heroTrack.clientWidth, behavior: halus && dekat && !kurangGerak() ? 'smooth' : 'auto' });
}
const heroGeser = d => heroKe(HERO.index + d);

function heroToggleMain() {
  const v = videoAktif();
  if (!v) return;
  if (v.paused) { HERO.userPaused = false; heroMainkan(v); }
  else { HERO.userPaused = true; v.pause(); }
}

function heroRender(slides) {
  const sig = JSON.stringify(slides.map(s => [s.jenis, s.url, s.judul]));
  if (sig === HERO.sig) return; // tidak ada perubahan: jangan ulang video
  HERO.sig = sig;
  HERO.slides = slides;
  HERO.index = 0;
  heroSection.classList.toggle('hidden', !slides.length);
  heroTrack.innerHTML = slides.map(heroSlideHtml).join('');
  heroTrack.scrollTo({ left: 0, behavior: 'auto' });
  heroBars.innerHTML = slides.map((_, i) =>
    `<button type="button" class="hero-bar" data-i="${i}" aria-label="Ke slide ${i + 1}" aria-current="false"></button>`).join('');
  heroNav.classList.toggle('hidden', slides.length < 2);
  $$('video', heroTrack).forEach(v => {
    v.loop = slides.length < 2;
    v.addEventListener('play', heroSinkronIkon);
    v.addEventListener('pause', heroSinkronIkon);
    v.addEventListener('ended', () => { if (HERO.slides.length > 1) heroGeser(1); });
  });
  heroAktifkan(0);
}

async function muatHero() {
  let slides = [];
  try {
    const { data, error } = await sb.from('banner').select('*').eq('aktif', true)
      .order('urutan', { ascending: true }).order('created_at', { ascending: false });
    if (error) throw error;
    slides = (data || []).filter(b => b && b.url && (b.jenis === 'foto' || b.jenis === 'video'));
  } catch (e) {
    console.warn('Tabel banner belum siap, memakai video bawaan:', e);
  }
  if (!slides.length) {
    let url = 'video/promo.mp4';
    try {
      const { data } = await sb.from('video').select('url_video').order('created_at', { ascending: false }).limit(1);
      if (data && data[0] && data[0].url_video) url = data[0].url_video;
    } catch (e) { /* pakai video bawaan */ }
    slides = [{ jenis: 'video', url, judul: '' }];
  }
  heroRender(slides);
}

let heroRaf = 0;
heroTrack.addEventListener('scroll', () => {
  cancelAnimationFrame(heroRaf);
  heroRaf = requestAnimationFrame(() => {
    const w = heroTrack.clientWidth || 1;
    const idx = Math.round(heroTrack.scrollLeft / w);
    if (idx !== HERO.index && idx >= 0 && idx < HERO.slides.length) heroAktifkan(idx);
  });
}, { passive: true });

heroTrack.addEventListener('pointerdown', () => clearTimeout(HERO.timer));
['pointerup', 'pointercancel'].forEach(ev => heroTrack.addEventListener(ev, heroJadwalOtomatis));
heroTrack.addEventListener('click', e => { if (!e.target.closest('button')) heroToggleMain(); });
heroTrack.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { e.preventDefault(); heroGeser(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); heroGeser(1); }
});
$('#heroPrev').addEventListener('click', () => heroGeser(-1));
$('#heroNext').addEventListener('click', () => heroGeser(1));
heroBars.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) heroKe(Number(b.dataset.i)); });
heroPlayBtn.addEventListener('click', heroToggleMain);
heroMuteBtn.addEventListener('click', () => {
  HERO.muted = !HERO.muted;
  const v = videoAktif();
  if (v) v.muted = HERO.muted;
  heroSinkronIkon();
});
window.addEventListener('resize', () => {
  heroTrack.scrollTo({ left: HERO.index * heroTrack.clientWidth, behavior: 'auto' });
});

/* Jeda video + timer saat hero tidak terlihat (hemat baterai dan data) */
function heroAturTerlihat(terlihat) {
  HERO.terlihat = terlihat;
  const v = videoAktif();
  if (!terlihat) { clearTimeout(HERO.timer); if (v) v.pause(); }
  else { if (v && !HERO.userPaused) heroMainkan(v); heroJadwalOtomatis(); }
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => heroAturTerlihat(e.isIntersecting), { threshold: 0.35 }).observe(heroSection);
}
document.addEventListener('visibilitychange', () => heroAturTerlihat(document.visibilityState === 'visible'));

/* =====================================================================
   SIDEBAR MENU
   ===================================================================== */
const sidebar = $('#sidebar');
const sbOverlay = $('#sidebarOverlay');
const btnMenu = $('#btnMenu');


function bukaSidebar() {
  sidebar.removeAttribute('inert');
  sidebar.classList.add('open');
  sbOverlay.classList.add('open');
  btnMenu.setAttribute('aria-expanded', 'true');
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('#sidebarClose').focus(), 60);
}
function tutupSidebar(fokus = true) {
  sidebar.classList.remove('open');
  sbOverlay.classList.remove('open');
  sidebar.setAttribute('inert', '');
  btnMenu.setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = '';
  if (fokus) btnMenu.focus();
}
const gulirKe = sel => { const el = $(sel); if (el) el.scrollIntoView({ behavior: kurangGerak() ? 'auto' : 'smooth', block: 'start' }); };

btnMenu.addEventListener('click', bukaSidebar);
$('#sidebarClose').addEventListener('click', () => tutupSidebar());
sbOverlay.addEventListener('click', () => tutupSidebar());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sidebar.classList.contains('open')) tutupSidebar(); });

sidebar.addEventListener('click', e => {
  const go = e.target.closest('[data-goto]');
  if (go) { tutupSidebar(false); gulirKe(go.dataset.goto); }
  else if (e.target.closest('a[target="_blank"]')) { tutupSidebar(false); }
});

/* =====================================================================
   HALAMAN TOKO (katalog) - dibuka dari ikon keranjang, alamat #toko
   ===================================================================== */
const storePage  = $('#storePage');
const storeSelect = $('#storeKategori');
const storeCari  = $('#storeCari');
let tokoDariDalam = false;

function sinkronToko() {
  const buka = location.hash === '#toko';
  const berubah = storePage.hidden === buka;
  storePage.hidden = !buka;
  ['header', 'main', 'footer'].forEach(t => { const el = $(t); if (el) el.inert = buka; });
  if (!berubah) return;
  if (buka) { storePage.scrollTop = 0; heroAturTerlihat(false); }
  else { heroAturTerlihat(true); }
}
function bukaToko(fokusCari = false) {
  tokoDariDalam = true;
  if (location.hash !== '#toko') location.hash = '#toko'; else sinkronToko();
  if (fokusCari) setTimeout(() => storeCari.focus(), 60);
}
function tutupToko() {
  if (tokoDariDalam) { tokoDariDalam = false; history.back(); }
  else { history.replaceState(null, '', location.pathname + location.search); sinkronToko(); }
}
window.addEventListener('hashchange', sinkronToko);
$('#btnStore').addEventListener('click', () => bukaToko());
$('#btnCari').addEventListener('click', () => bukaToko(true));
$('#storeBack').addEventListener('click', tutupToko);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !storePage.hidden && !modal.open && !sidebar.classList.contains('open')) tutupToko();
});

/* ---------- Filter Katalog ---------- */
const PAGE = 8;
const state = { mode: 'all', key: null, q: '', semua: false };

storeSelect.innerHTML =
  '<option value="all">Semua laptop</option>' +
  '<optgroup label="Kategori">' + KATEGORI.map(k => `<option value="kategori:${k.id}">${esc(k.label)}</option>`).join('') + '</optgroup>' +
  '<optgroup label="Label">' + Object.entries(LABEL_TAG).map(([id, t]) => `<option value="tag:${id}">${esc(t)}</option>`).join('') + '</optgroup>';

function daftarTerfilter() {
  let l = PRODUK;
  if (state.mode === 'kategori') l = l.filter(p => p.kategori === state.key);
  else if (state.mode === 'tag') l = l.filter(p => p.tags.includes(state.key));
  if (state.q) {
    const q = state.q.toLowerCase();
    l = l.filter(p => [namaLengkap(p), p.kategori, ...Object.values(p.spek || {})].join(' ').toLowerCase().includes(q));
  }
  return l;
}

storeSelect.addEventListener('change', () => {
  const v = storeSelect.value;
  if (v === 'all') { state.mode = 'all'; state.key = null; }
  else { const [m, k] = v.split(':'); state.mode = m; state.key = k; }
  state.semua = false;
  render();
});
storeCari.addEventListener('input', () => { state.q = storeCari.value.trim(); state.semua = false; render(); });

/* ---------- Render Katalog ---------- */
function kartuProduk(p) {
  const sp = p.spek || {};
  const nama = namaLengkap(p);
  const lencana = p.tags.filter(t => LABEL_TAG[t]).map(t => {
    const gelap = t === 'promo';
    return `<span class="rounded-full px-2.5 py-1 text-xs font-bold ${gelap ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] ring-1 ring-gray-200'}">${LABEL_TAG[t]}</span>`;
  }).join('');
  const ringkas = [sp.processor, sp.ram && `RAM ${sp.ram}`, sp.storage].filter(Boolean).map(esc).join(', ');
  const hemat = p.hargaNormal && p.hargaNormal > p.harga ? p.hargaNormal - p.harga : 0;
  const rincian = [['Processor', sp.processor], ['RAM', sp.ram], ['Storage', sp.storage], ['VGA', sp.vga], ['Layar', sp.layar], ['Kondisi', KONDISI[p.kondisi].label]]
    .filter(r => r[1]).map(([k, v]) => `<div class="flex justify-between gap-3 py-1.5"><dt class="text-gray-500">${k}</dt><dd class="text-right font-semibold">${esc(v)}</dd></div>`).join('');
  const linkBeli = waLink(`halo kak, saya mau beli ${nama} (${rupiah(p.harga)}). Masih ada?`);
  return `
  <article class="flex flex-col rounded-2xl border border-gray-200 bg-white p-2.5 hover:border-gray-400 sm:p-3">
    <div class="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F9FAFB]">
      <img src="${esc(p.foto)}" alt="${esc(nama)}" loading="lazy" ${FALLBACK_IMG} class="h-full w-full object-cover">
      ${lencana ? `<div class="absolute left-2 top-2 flex flex-wrap gap-1.5">${lencana}</div>` : ''}
    </div>
    <div class="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
      <h3 class="text-sm font-bold leading-snug line-clamp-2 sm:text-base">${esc(nama)}</h3>
      <p class="mt-1 text-xs leading-snug text-gray-500 line-clamp-2">${ringkas}</p>
      <details class="spec-box mt-1 text-xs">
        <summary>Spesifikasi lengkap<svg class="h-4 w-4"><use href="#i-chev-r"/></svg></summary>
        <dl class="divide-y divide-gray-100 border-t border-gray-100">${rincian || '<p class="py-1.5 text-gray-500">Belum ada rincian.</p>'}</dl>
      </details>
      <div class="mt-auto pt-2">
        <p class="flex flex-wrap items-baseline gap-x-2 text-base font-extrabold sm:text-lg">
          ${rupiah(p.harga)}
          ${hemat ? `<span class="text-xs font-medium text-gray-500 line-through">${rupiah(p.hargaNormal)}</span>` : ''}
        </p>
        ${hemat ? `<p class="mt-0.5 text-xs font-semibold text-green-700">Hemat ${rupiah(hemat)}</p>` : ''}
        <div class="mt-3 grid grid-cols-2 gap-2">
          <a href="${linkBeli}" target="_blank" rel="noopener" class="grid place-items-center rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-bold text-[#111827] hover:brightness-95">Beli</a>
          <button type="button" data-open="${esc(p.id)}" class="rounded-xl border border-[#1F2937] px-3 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#1F2937] hover:text-white">Pelajari</button>
        </div>
      </div>
    </div>
  </article>`;
}

let sedangMemuat = true;
let gagalMemuat = false;

function render() {
  const semua = daftarTerfilter();
  const tampil = state.semua ? semua : semua.slice(0, PAGE);

  $('#status').textContent = sedangMemuat
    ? 'Memuat katalog...'
    : gagalMemuat
      ? 'Katalog belum bisa dimuat.'
      : semua.length
        ? `Menampilkan ${tampil.length} dari ${semua.length} laptop`
        : 'Belum ada laptop yang cocok';

  if (sedangMemuat) {
    $('#grid').innerHTML = Array.from({ length: PAGE }, () => `
      <div class="animate-pulse rounded-2xl border border-gray-200 bg-white p-3">
        <div class="aspect-[4/3] rounded-xl bg-gray-100"></div>
        <div class="mt-4 h-4 w-3/4 rounded bg-gray-100"></div>
        <div class="mt-2 h-3 w-1/2 rounded bg-gray-100"></div>
        <div class="mt-6 h-9 rounded-xl bg-gray-100"></div>
      </div>`).join('');
    $('#more').innerHTML = '';
  } else if (gagalMemuat && !PRODUK.length) {
    $('#grid').innerHTML = `<div class="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p class="font-bold">Data laptop belum bisa dimuat.</p>
        <p class="mt-1 text-sm text-gray-600">Periksa koneksi internet, lalu coba lagi.</p>
        <button type="button" id="ulangMuat" class="mt-4 rounded-xl bg-[#1F2937] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#111827]">Muat ulang</button>
      </div>`;
    $('#more').innerHTML = '';
  } else {
    $('#grid').innerHTML = tampil.length
      ? tampil.map(kartuProduk).join('')
      : `<div class="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
           <p class="font-bold">Belum ada unit untuk pilihan ini.</p>
           <p class="mt-1 text-sm text-gray-600">Stok kami bergerak cepat. Tanyakan langsung ketersediaannya lewat WhatsApp.</p>
           <a href="${waLink(CONFIG.pesanUmum)}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-[#111827] hover:brightness-95"><svg class="h-5 w-5"><use href="#i-wa"/></svg>Tanya via WhatsApp</a>
         </div>`;
    /* Satu tombol "Lainnya" saja: dibuat ulang tiap render, tidak pernah dobel */
    $('#more').innerHTML = (!state.semua && semua.length > PAGE)
      ? `<button type="button" id="moreBtn" class="rounded-xl border border-[#111827] bg-white px-6 py-3 text-sm font-semibold hover:bg-[#111827] hover:text-white">Lainnya</button>`
      : '';
  }
}

$('#more').addEventListener('click', e => {
  if (!e.target.closest('#moreBtn')) return;
  state.semua = true;
  render();
  const kartuBaru = $('#grid').children[PAGE];
  if (kartuBaru) kartuBaru.querySelector('a, button').focus();
});
$('#grid').addEventListener('click', e => {
  if (e.target.closest('#ulangMuat')) { muatSemua(); return; }
  const b = e.target.closest('[data-open]');
  if (b) bukaDetail(b.dataset.open);
});

/* ---------- Pop-up Detail Produk ---------- */
const modal = $('#detail');

function barisSpek(nama, nilai) {
  return `<div class="grid grid-cols-[8.5rem_1fr] gap-3 py-2.5"><dt class="text-gray-500">${nama}</dt><dd class="font-semibold">${esc(nilai || '-')}</dd></div>`;
}

function bukaDetail(id) {
  const p = PRODUK.find(x => String(x.id) === String(id));
  if (!p) return;
  const k = KONDISI[p.kondisi];
  const nama = namaLengkap(p);
  const sp = p.spek || {};
  const lencana = p.tags.filter(t => LABEL_TAG[t]).map(t => `<span class="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-xs font-bold ring-1 ring-gray-200">${LABEL_TAG[t]}</span>`).join('');

  $('#detailBody').innerHTML = `
  <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10 md:p-8">
    <div class="md:sticky md:top-0 md:self-start">
      <div class="aspect-[4/3] overflow-hidden rounded-2xl bg-[#F9FAFB]">
        <img src="${esc(p.foto)}" alt="${esc(nama)}" ${FALLBACK_IMG} class="h-full w-full object-cover">
      </div>
    </div>
    <div>
      <div class="flex flex-wrap gap-2 md:pr-10">
        <span class="rounded-full bg-[#111827] px-2.5 py-1 text-xs font-bold text-white">${k.label}</span>
        ${lencana}
      </div>
      <h2 id="detailTitle" class="mt-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">${esc(nama)}</h2>
      <p class="mt-2 flex flex-wrap items-baseline gap-x-3 text-2xl font-extrabold">
        ${rupiah(p.harga)}
        ${p.hargaNormal ? `<span class="text-sm font-medium text-gray-500 line-through">${rupiah(p.hargaNormal)}</span>` : ''}
      </p>

      <h3 class="mt-6 font-bold">Spesifikasi</h3>
      <dl class="mt-2 divide-y divide-gray-200 border-y border-gray-200 text-sm">
        ${barisSpek('Merek', p.merek)}
        ${barisSpek('Seri', p.seri)}
        ${barisSpek('Processor', sp.processor)}
        ${barisSpek('RAM', sp.ram)}
        ${barisSpek('Storage', sp.storage)}
        ${barisSpek('Kartu grafis (VGA)', sp.vga)}
        ${barisSpek('Ukuran layar', sp.layar)}
      </dl>

      <div class="mt-6 space-y-4 text-sm">
        <div><h3 class="font-bold">Kondisi unit</h3><p class="mt-1 text-gray-600">${k.detail}</p></div>
        <div><h3 class="font-bold">Kelengkapan</h3><p class="mt-1 text-gray-600">${k.kelengkapan}</p></div>
        <div><h3 class="font-bold">Garansi toko</h3><p class="mt-1 text-gray-600">${k.garansi}</p></div>
      </div>
    </div>
  </div>`;

  $('#detailWa').href = waLink(`halo kak, ${nama} nya msih ada kk?`);
  document.documentElement.style.overflow = 'hidden';
  modal.showModal();
  $('#detailBody').scrollTop = 0;
}

$('#detailClose').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => { document.documentElement.style.overflow = ''; });

/* =====================================================================
   PENGAMBILAN DATA DARI SUPABASE
   ===================================================================== */
function urlFoto(f) {
  if (!f) return window.FOTO_KOSONG;
  return f; // URL publik Supabase (https://...) atau path bawaan repo (images/...)
}

function dariDb(r) {
  let spek = r.spek;
  if (typeof spek === 'string') { try { spek = JSON.parse(spek); } catch { spek = {}; } }
  return {
    id: r.id,
    kategori: r.kategori,
    merek: r.merek || '',
    seri: r.seri || '',
    harga: Number(r.harga) || 0,
    hargaNormal: r.harganormal ? Number(r.harganormal) : null,
    tags: Array.isArray(r.tags) ? r.tags : [],
    kondisi: KONDISI[r.kondisi] ? r.kondisi : 'bekas',
    foto: urlFoto(r.foto),
    spek: spek || {}
  };
}

async function muatProduk() {
  // Produk terbaru di depan. Jika kolom created_at belum ada, pakai id terbesar.
  let r = await sb.from('produk').select('*').order('created_at', { ascending: false });
  if (r.error) r = await sb.from('produk').select('*').order('id', { ascending: false });
  if (r.error) throw r.error;
  PRODUK = (r.data || []).map(dariDb);
}

async function muatConfig() {
  const { data, error } = await sb.from('config').select('*').order('id', { ascending: true }).limit(1);
  if (error) throw error;
  const c = data && data[0];
  if (!c) return; // tabel kosong: pakai nilai bawaan
  CONFIG.wa           = c.wa || CONFIG.wa;
  CONFIG.alamat       = c.alamat || CONFIG.alamat;
  CONFIG.jam          = c.jam || CONFIG.jam;
  CONFIG.instagram    = (c.instagram || CONFIG.instagram).replace(/^@/, '');
  CONFIG.mapsLink     = c.maps_link || CONFIG.mapsLink;
  CONFIG.petaEmbedUrl = c.peta_embed_url || CONFIG.petaEmbedUrl;
  CONFIG.pesanUmum    = c.pesan_umum || CONFIG.pesanUmum;
  CONFIG.fotoToko     = c.foto_toko || '';
  terapkanConfig();
}

let terakhirMuat = 0;
async function muatSemua() {
  sedangMemuat = !PRODUK.length;
  gagalMemuat = false;
  render();
  const hasil = await Promise.allSettled([muatProduk(), muatConfig(), muatHero()]);
  hasil.forEach(h => { if (h.status === 'rejected') console.error('Gagal memuat dari Supabase:', h.reason); });
  gagalMemuat = hasil[0].status === 'rejected';
  sedangMemuat = false;
  terakhirMuat = Date.now();
  render();
  terapkanConfig();
}

/* Muat ulang otomatis saat tab/aplikasi dibuka kembali (data selalu terbaru) */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - terakhirMuat > 20000) muatSemua();
sinkronToko();
});

/* Realtime: perubahan dari panel admin langsung muncul tanpa refresh */
let timerRealtime = null;
try {
  sb.channel('perubahan-toko')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      clearTimeout(timerRealtime);
      timerRealtime = setTimeout(muatSemua, 400);
    })
    .subscribe();
} catch (e) { console.warn('Realtime tidak aktif:', e); }

/* ---------- Mulai ---------- */
muatSemua();
sinkronToko();
