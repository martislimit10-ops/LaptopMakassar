/* =====================================================================
   LAPTOP MAKASSAR - SCRIPT HALAMAN PENGUNJUNG
   Butuh (urutan): supabase-js -> supabase-config.js -> script.js
   Data (produk, info toko, slider) semua dari Supabase + realtime.
   Daftar isi:
   1. Keadaan & pembantu     5. Slider foto toko      9. Pencarian AI
   2. Info toko              6. Halaman Toko         10. Data Supabase
   3. Tema & sidebar         7. Keranjang            11. Mulai
   4. Hero slider            8. Detail produk
   ===================================================================== */

/* ---------- 1. Keadaan & pembantu ---------- */
const CONFIG = { ...CONFIG_AWAL };
let PRODUK = [];
let BANNER = [];
const DEVICE = window.LM_HP ? 'hp' : 'desktop';
const PAGE = 8;
const MAKS_QTY = 5;
const KEY_KERANJANG = 'lm_keranjang';
const kurangGerak = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fotoErr = `onerror="this.onerror=null;this.src=window.FOTO_KOSONG"`;
const waLink = teks => `https://wa.me/${String(CONFIG.wa || '').replace(/\D/g, '')}?text=${encodeURIComponent(teks)}`;

window.addEventListener('resize', () => window.aturSkala && window.aturSkala());
window.addEventListener('orientationchange', () => setTimeout(() => window.aturSkala && window.aturSkala(), 250));

/* Kunci scroll halaman saat dialog/sidebar terbuka */
let jumlahKunci = 0;
function kunci(ya) {
  jumlahKunci = Math.max(0, jumlahKunci + (ya ? 1 : -1));
  document.documentElement.classList.toggle('kunci', jumlahKunci > 0);
}
function bukaDialog(d) { if (!d.open) { d.showModal(); kunci(true); } }
$$('dialog.dlg').forEach(d => {
  d.addEventListener('close', () => kunci(false));
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  $$('[data-tutup]', d).forEach(b => b.addEventListener('click', () => d.close()));
});

let timerToast;
function toast(teks) {
  const t = $('#toast');
  if (t) {
    t.textContent = teks; t.classList.add('tampil');
    clearTimeout(timerToast);
    timerToast = setTimeout(() => t.classList.remove('tampil'), 2200);
  }
}
function gulirKe(sel) {
  const el = $(sel);
  if (el) el.scrollIntoView({ behavior: kurangGerak() ? 'auto' : 'smooth', block: 'start' });
}
function tautanSosmed(nilai, dasar) {
  const v = String(nilai || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return dasar + encodeURIComponent(v.replace(/^@/, ''));
}
const handle = v => '@' + String(v || '').trim().replace(/^https?:\/\/[^/]+\/@?/i, '').replace(/^@/, '').replace(/\/$/, '');

const elTahun = $('#tahun');
if (elTahun) elTahun.textContent = new Date().getFullYear();

/* ---------- 2. Info toko (AMAN dari Error Elemen Hilang) ---------- */
function terapkanConfig() {
  $$('[data-fill]').forEach(el => { el.textContent = CONFIG[el.dataset.fill] ?? ''; });
  $$('[data-wa]').forEach(a => { a.href = waLink(CONFIG.pesan_umum); });
  $$('[data-ig]').forEach(a => { a.href = tautanSosmed(CONFIG.instagram, 'https://www.instagram.com/'); });
  $$('[data-ig-text]').forEach(s => { s.textContent = handle(CONFIG.instagram); });
  $$('[data-tt]').forEach(a => { a.href = tautanSosmed(CONFIG.tiktok, 'https://www.tiktok.com/@'); });
  $$('[data-tt-text]').forEach(s => { s.textContent = handle(CONFIG.tiktok); });
  $$('[data-maps]').forEach(a => { a.href = CONFIG.maps_link; });
  $$('[data-mail]').forEach(a => { a.href = CONFIG.email ? 'mailto:' + CONFIG.email : '#'; a.hidden = !CONFIG.email; });
  
  const peta = $('#peta');
  if (peta) {
    if (CONFIG.peta_embed_url && peta.getAttribute('src') !== CONFIG.peta_embed_url) peta.src = CONFIG.peta_embed_url;
    const pembungkusPeta = peta.closest('.peta');
    if (pembungkusPeta) pembungkusPeta.hidden = !CONFIG.peta_embed_url;
  }
}

/* ---------- 3. Tema & sidebar ---------- */
const saklar = $('#saklarTema');
function setTema(gelap, simpan = true) {
  document.documentElement.toggleAttribute('data-tema', gelap);
  if (gelap) document.documentElement.setAttribute('data-tema', 'gelap');
  if (saklar) saklar.setAttribute('aria-checked', String(gelap));
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = gelap ? '#0f1115' : '#fafafa';
  if (simpan) { try { localStorage.setItem('lm_tema', gelap ? 'gelap' : 'terang'); } catch (e) {} }
}
setTema(document.documentElement.getAttribute('data-tema') === 'gelap', false);
if (saklar) saklar.addEventListener('click', () => setTema(saklar.getAttribute('aria-checked') !== 'true'));

const sidebar = $('#sidebar'), scrim = $('#scrim'), btnMenu = $('#btnMenu');
function bukaSidebar() {
  if (!sidebar) return;
  if (scrim) scrim.hidden = false;
  sidebar.removeAttribute('inert'); sidebar.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => sidebar.classList.add('buka'));
  if (btnMenu) btnMenu.setAttribute('aria-expanded', 'true');
  kunci(true);
  const btnTutup = $('#btnTutupMenu');
  if (btnTutup) btnTutup.focus();
}
function tutupSidebar(fokus = true) {
  if (!sidebar || !sidebar.classList.contains('buka')) return;
  sidebar.classList.remove('buka'); if (scrim) scrim.hidden = true;
  sidebar.setAttribute('inert', ''); sidebar.setAttribute('aria-hidden', 'true');
  if (btnMenu) btnMenu.setAttribute('aria-expanded', 'false');
  kunci(false);
  if (fokus && btnMenu) btnMenu.focus();
}
if (btnMenu) btnMenu.addEventListener('click', bukaSidebar);
const btnTutupMenu = $('#btnTutupMenu');
if (btnTutupMenu) btnTutupMenu.addEventListener('click', () => tutupSidebar());
if (scrim) scrim.addEventListener('click', () => tutupSidebar());
if (sidebar) {
  sidebar.addEventListener('click', e => {
    const go = e.target.closest('[data-goto]');
    if (go) { e.preventDefault(); tutupSidebar(false); gulirKe(go.dataset.goto); }
    else if (e.target.closest('a[target="_blank"]')) tutupSidebar(false);
  });
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (sidebar && sidebar.classList.contains('buka')) tutupSidebar();
  else if (storePage && !storePage.hidden && !document.querySelector('dialog[open]')) tutupToko();
});

/* ---------- 4. Hero slider (foto + video) ---------- */
const hero = { slides: [], idx: 0, timer: null, jeda: false, suara: false, ditahan: false, sig: '' };
const heroEl = $('#hero'), heroTrack = $('#heroTrack');
const IKON = id => `<svg><use href="#${id}"/></svg>`;

function daftarHero() {
  const utama = DEVICE === 'hp' ? 'hero_hp' : 'hero_desktop';
  const cadangan = DEVICE === 'hp' ? 'hero_desktop' : 'hero_hp';
  let l = BANNER.filter(b => b.bagian === utama);
  if (!l.length) l = BANNER.filter(b => b.bagian === cadangan);
  return l;
}
function renderHero() {
  if (!heroTrack) return;
  const l = daftarHero();
  const sig = JSON.stringify(l.map(b => [b.id, b.url, b.jenis, b.judul, b.urutan]));
  if (sig === hero.sig) return;
  hero.sig = sig; hero.slides = l; hero.idx = 0; hero.jeda = false;
  clearTimeout(hero.timer);

  const heroNav = $('#heroNav'), heroKontrol = $('#heroKontrol'), heroCap = $('#heroCap');

  if (!l.length) {
    heroTrack.innerHTML = `<div class="hero-slide"><div class="hero-kosong"><b>Laptop Makassar</b><span>Laptop baru dan bekas berkualitas</span></div></div>`;
    if (heroNav) heroNav.hidden = true; 
    if (heroKontrol) heroKontrol.hidden = true; 
    if (heroCap) heroCap.textContent = '';
    return;
  }
  heroTrack.innerHTML = l.map((b, i) => `<div class="hero-slide" aria-hidden="${i !== 0}">` + (b.jenis === 'video'
    ? `<video src="${esc(b.url)}" muted playsinline preload="${i === 0 ? 'auto' : 'metadata'}" ${l.length === 1 ? 'loop' : ''}></video>`
    : `<img src="${esc(b.url)}" alt="${esc(b.judul || 'Promo Laptop Makassar')}" ${i === 0 ? '' : 'loading="lazy"'} ${fotoErr}>`) + `</div>`).join('');
  $$('video', heroTrack).forEach((v, i) => {
    v.addEventListener('ended', () => { if (hero.slides.length > 1) heroKe(hero.idx + 1); });
    v.addEventListener('error', () => { if (hero.slides[hero.idx] && heroTrack.children[hero.idx]?.contains(v)) jadwalkanHero(6000); });
  });
  const heroBars = $('#heroBars');
  if (heroBars) heroBars.innerHTML = l.map((_, i) => `<button type="button" aria-label="Slide ${i + 1}" data-i="${i}"></button>`).join('');
  if (heroNav) heroNav.hidden = l.length < 2;
  heroKe(0, true);
}
function slideAktif() { return hero.slides[hero.idx]; }
function videoAktif() { return heroTrack?.children[hero.idx]?.querySelector('video') || null; }
function jadwalkanHero(ms) {
  clearTimeout(hero.timer);
  if (hero.slides.length < 2 || hero.ditahan || hero.jeda) return;
  hero.timer = setTimeout(() => heroKe(hero.idx + 1), ms);
}
function heroKe(i, awal = false) {
  const n = hero.slides.length; if (!n || !heroTrack) return;
  if (!awal) hero.jeda = false;
  hero.idx = ((i % n) + n) % n;
  heroTrack.style.transform = `translateX(-${hero.idx * 100}%)`;
  $$('.hero-slide', heroTrack).forEach((s, k) => s.setAttribute('aria-hidden', String(k !== hero.idx)));$$
('#heroBars button').forEach((b, k) => b.setAttribute('aria-current', String(k === hero.idx)));
  const s = slideAktif();
  const heroCap = $('#heroCap'), heroKontrol = $('#heroKontrol');   if (heroCap) heroCap.textContent = s ? (s.judul \vert{}\vert{} '') : '';   if (heroKontrol) heroKontrol.hidden = !s \vert{}\vert{} s.jenis !== 'video';   $$('video', heroTrack).forEach(v => { v.pause(); v.currentTime = 0; v.muted = !hero.suara; });
  perbaruiIkonHero();
  clearTimeout(hero.timer);
  if (s && s.jenis === 'video') {
    const v = videoAktif();
    if (v && !hero.ditahan) v.play().catch(() => jadwalkanHero(6000));
  } else jadwalkanHero(5500);
}
function perbaruiIkonHero() {
  const elJeda = $('#heroJeda'), elSuara = $('#heroSuara');
  if (elJeda) {
    elJeda.innerHTML = IKON(hero.jeda ? 'i-play' : 'i-pause');
    elJeda.setAttribute('aria-label', hero.jeda ? 'Putar video' : 'Jeda video');
  }
  if (elSuara) {
    elSuara.innerHTML = IKON(hero.suara ? 'i-vol' : 'i-mute');
    elSuara.setAttribute('aria-label', hero.suara ? 'Matikan suara' : 'Nyalakan suara');
  }
}
function heroTahan(ya) {
  hero.ditahan = ya;
  const v = videoAktif();
  if (ya) { clearTimeout(hero.timer); if (v) v.pause(); }
  else if (slideAktif()) {
    if (v && !hero.jeda) v.play().catch(() => {});
    else if (slideAktif().jenis !== 'video') jadwalkanHero(5500);
  }
}
const btnJeda = $('#heroJeda'), btnSuara = $('#heroSuara'), btnPrev = $('#heroPrev'), btnNext = $('#heroNext'), elBars = $('#heroBars'); if (btnJeda) btnJeda.addEventListener('click', () => {   const v = videoAktif(); if (!v) return;   hero.jeda = !hero.jeda;   if (hero.jeda) v.pause(); else v.play().catch(() => {});   perbaruiIkonHero(); }); if (btnSuara) btnSuara.addEventListener('click', () => {   hero.suara = !hero.suara;   $$('video', heroTrack).forEach(v => { v.muted = !hero.suara; });
  perbaruiIkonHero();
});
if (btnPrev) btnPrev.addEventListener('click', () => heroKe(hero.idx - 1));
if (btnNext) btnNext.addEventListener('click', () => heroKe(hero.idx + 1));
if (elBars) elBars.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) heroKe(+b.dataset.i); });
if (heroEl) pasangGeser(heroEl, d => heroKe(hero.idx + d));
document.addEventListener('visibilitychange', () => heroTahan(document.hidden || (storePage && !storePage.hidden)));

/* Geser jari/mouse kiri-kanan */
function pasangGeser(el, aksi) {
  if (!el) return;
  let x0 = null, y0 = 0;
  el.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; x0 = e.clientX; y0 = e.clientY; });
  el.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) aksi(dx < 0 ? 1 : -1);
  });
  el.addEventListener('pointercancel', () => { x0 = null; });
}

/* ---------- 5. Slider foto "Kunjungi toko kami" (AMAN) ---------- */
const toko = { fotos: [], idx: 0, timer: null, sig: '' };
function renderSliderToko() {
  const root = $('#tokoSlider'), track = $('#tokoTrack');
  if (!root || !track) return;
  const l = BANNER.filter(b => b.bagian === 'toko' && b.jenis === 'foto').slice(0, 5);
  const sig = JSON.stringify(l.map(b => [b.id, b.url, b.judul, b.urutan]));
  if (sig === toko.sig) return;
  toko.sig = sig; toko.fotos = l; toko.idx = 0;
  const dots = $('#tokoDots');
  if (!l.length) {
    track.innerHTML = `<div><img src="images/img-01.jpg" alt="Tampak depan toko Laptop Makassar" ${fotoErr}></div>`;
    if (dots) dots.innerHTML = ''; 
    $$('.tslider-prev,.tslider-next', root).forEach(b => b.hidden = true);
    clearTimeout(toko.timer); return;
  }
  track.innerHTML = l.map((b, i) => `<div><img src="${esc(b.url)}" alt="${esc(b.judul || 'Foto toko Laptop Makassar')}" ${i ? 'loading="lazy"' : ''} ${fotoErr}></div>`).join('');
  if (dots) dots.innerHTML = l.length > 1 ? l.map((_, i) => `<button type="button" aria-label="Foto ${i + 1}" data-i="${i}"></button>`).join('') : '';
  $$('.tslider-prev,.tslider-next', root).forEach(b => b.hidden = l.length < 2);
  tokoKe(0);
}
function tokoKe(i) {
  const track = $('#tokoTrack');
  const n = toko.fotos.length; if (!n || !track) return;
  toko.idx = ((i % n) + n) % n;
  track.style.transform = `translateX(-${toko.idx * 100}%)`;
  $$('#tokoDots button').forEach((b, k) => b.setAttribute('aria-current', String(k === toko.idx)));
  clearTimeout(toko.timer);
  if (n > 1 && !kurangGerak()) toko.timer = setTimeout(() => tokoKe(toko.idx + 1), 5000);
}
const btnTokoPrev = $('#tokoSlider .tslider-prev'), btnTokoNext = $('#tokoSlider .tslider-next'), elTokoDots = $('#tokoDots'), elTokoSlider = $('#tokoSlider');
if (btnTokoPrev) btnTokoPrev.addEventListener('click', () => tokoKe(toko.idx - 1));
if (btnTokoNext) btnTokoNext.addEventListener('click', () => tokoKe(toko.idx + 1));
if (elTokoDots) elTokoDots.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) tokoKe(+b.dataset.i); });
if (elTokoSlider) pasangGeser(elTokoSlider, d => tokoKe(toko.idx + d));

/* ---------- 6. Halaman Toko (#toko) ---------- */
const storePage = $('#storePage'), storeSelect = $('#storeKategori'), storeCari = $('#storeCari');
const state = { mode: 'all', key: null, q: '', semua: false };
let tokoDariDalam = false;

function sinkronToko() {
  if (!storePage) return;
  const buka = location.hash === '#toko';
  if (storePage.hidden !== buka) return;
  storePage.hidden = !buka;
  const app = $('#app');
  if (app) app.inert = buka;
  heroTahan(buka);
  if (buka) storePage.scrollTop = 0;
}
function bukaToko() {
  tokoDariDalam = true;
  if (location.hash !== '#toko') location.hash = '#toko'; else sinkronToko();
}
function tutupToko() {
  if (tokoDariDalam) { tokoDariDalam = false; history.back(); }
  else { history.replaceState(null, '', location.pathname + location.search); sinkronToko(); }
}
window.addEventListener('hashchange', sinkronToko);
const btnToko = $('#btnToko'), storeBack = $('#storeBack'); if (btnToko) btnToko.addEventListener('click', bukaToko); if (storeBack) storeBack.addEventListener('click', tutupToko); $$('a[href="#toko"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); bukaToko(); }));

if (storeSelect) {
  storeSelect.innerHTML =
    '<option value="all">Semua laptop</option>' +
    '<optgroup label="Kategori">' + KATEGORI.map(k => `<option value="kategori:${k.id}">${esc(k.label)}</option>`).join('') + '</optgroup>' +
    '<optgroup label="Label">' + Object.entries(LABEL_TAG).map(([id, t]) => `<option value="tag:${id}">${esc(t)}</option>`).join('') + '</optgroup>';
  storeSelect.addEventListener('change', () => {
    const v = storeSelect.value;
    if (v === 'all') { state.mode = 'all'; state.key = null; }
    else { const [m, k] = v.split(':'); state.mode = m; state.key = k; }
    state.semua = false; renderKatalog(); 
  });
}
if (storeCari) {
  storeCari.addEventListener('input', () => { state.q = storeCari.value.trim(); state.semua = false; renderKatalog(); });
}

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
function rincianSpek(p) {
  const sp = p.spek || {};
  return [['Processor', sp.processor], ['RAM', sp.ram], ['Storage', sp.storage], ['VGA', sp.vga], ['Layar', sp.layar], ['Kondisi', (KONDISI[p.kondisi] || KONDISI.bekas).label]]
    .filter(r => r[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
}
function kartuProduk(p) {
  const sp = p.spek || {};
  const nama = namaLengkap(p);
  const lencana = p.tags.filter(t => LABEL_TAG[t]).map(t => `<span class="${t === 'promo' ? 'promo' : ''}">${esc(LABEL_TAG[t])}</span>`).join('');
  const ringkas = [sp.processor, sp.ram && `RAM ${sp.ram}`, sp.storage].filter(Boolean).map(esc).join(', ');
  const hemat = p.hargaNormal && p.hargaNormal > p.harga ? p.hargaNormal - p.harga : 0;
  return `
  <article class="kartu">
    <div class="kartu-foto">
      <img src="${esc(p.foto)}" alt="${esc(nama)}" loading="lazy" ${fotoErr}>
      ${lencana ? `<div class="lencana">${lencana}</div>` : ''}
    </div>
    <div class="kartu-isi">
      <h3>${esc(nama)}</h3>
      <p class="ringkas">${ringkas}</p>
      <details class="spec-box">
        <summary>Spesifikasi lengkap<svg viewBox="0 0 24 24"><use href="#i-chev-r"/></svg></summary>
        <dl>${rincianSpek(p) || '<p class="ringkas">Belum ada rincian.</p>'}</dl>
      </details>
      <p class="harga">${rupiah(p.harga)}${hemat ? `<s>${rupiah(p.hargaNormal)}</s>` : ''}</p>
      ${hemat ? `<p class="hemat">Hemat ${rupiah(hemat)}</p>` : ''}
      <div class="kartu-aksi">
        <button type="button" class="btn btn-kecil" data-tambah="${esc(p.id)}" aria-label="Tambah ${esc(nama)} ke keranjang">+ Keranjang</button>
        <button type="button" class="btn btn-kecil btn-garis" data-open="${esc(p.id)}">Pelajari</button>
      </div>
    </div>
  </article>`;
}
let sedangMemuat = true, gagalMemuat = false;
function renderKatalog() {
  const elStatus = $('#status'), elGrid = $('#grid'), elMore = $('#more');
  if (!elGrid) return;
  const semua = daftarTerfilter();
  const tampil = state.semua ? semua : semua.slice(0, PAGE);
  if (elStatus) {
    elStatus.textContent = sedangMemuat ? 'Memuat katalog...'
      : gagalMemuat && !PRODUK.length ? 'Katalog belum bisa dimuat.'
      : semua.length ? `Menampilkan ${tampil.length} dari ${semua.length} laptop` : 'Belum ada laptop yang cocok';
  }

  if (sedangMemuat) {
    elGrid.innerHTML = Array.from({ length: 4 }, () => '<div class="skel"></div>').join('');
    if (elMore) elMore.innerHTML = '';
  } else if (gagalMemuat && !PRODUK.length) {
    elGrid.innerHTML = `<div class="kosong"><p><b>Data laptop belum bisa dimuat.</b></p><p>Periksa koneksi internet, lalu coba lagi.</p><button type="button" class="btn" id="ulangMuat">Muat ulang</button></div>`;
    if (elMore) elMore.innerHTML = '';
  } else {
    elGrid.innerHTML = tampil.length ? tampil.map(kartuProduk).join('')
      : `<div class="kosong"><p><b>Belum ada unit untuk pilihan ini.</b></p><p>Stok kami bergerak cepat. Tanyakan ketersediaannya lewat WhatsApp.</p><a class="btn" data-wa target="_blank" rel="noopener" href="${waLink(CONFIG.pesan_umum)}">Tanya via WhatsApp</a></div>`;
    if (elMore) elMore.innerHTML = (!state.semua && semua.length > PAGE) ? `<button type="button" id="moreBtn" class="btn btn-garis">Lainnya (${semua.length - PAGE} lagi)</button>` : '';
  }
}
const elMoreBox = $('#more'), elGridBox = $('#grid');
if (elMoreBox) {
  elMoreBox.addEventListener('click', e => {
    if (!e.target.closest('#moreBtn')) return;
    state.semua = true; renderKatalog();
    const k = $('#grid')?.children[PAGE]; if (k) k.querySelector('button')?.focus();
  });
}
if (elGridBox) {
  elGridBox.addEventListener('click', e => {
    if (e.target.closest('#ulangMuat')) { muatSemua(); return; }
    const t = e.target.closest('[data-tambah]'); if (t) { tambahKeranjang(t.dataset.tambah); return; }
    const o = e.target.closest('[data-open]'); if (o) bukaDetail(o.dataset.open);
  });
}

/* ---------- 7. Keranjang (disimpan di perangkat pembeli) ---------- */
let KERANJANG = (() => { try { const k = JSON.parse(localStorage.getItem(KEY_KERANJANG) || '[]'); return Array.isArray(k) ? k.filter(x => x && x.id) : []; } catch (e) { return []; } })();
const keranjang = $('#keranjang');
const cariProduk = id => PRODUK.find(p => String(p.id) === String(id));
function simpanKeranjang() { try { localStorage.setItem(KEY_KERANJANG, JSON.stringify(KERANJANG)); } catch (e) {} renderKeranjang(); }
function tambahKeranjang(id) {
  id = String(id);
  const it = KERANJANG.find(x => x.id === id);
  if (it) { if (it.qty >= MAKS_QTY) { toast(`Maksimal ${MAKS_QTY} unit per produk`); return; } it.qty++; }
  else KERANJANG.push({ id, qty: 1 });
  simpanKeranjang();
  toast('Ditambahkan ke keranjang');
}
function bersihkanKeranjang() {
  if (!PRODUK.length) return;
  const sebelum = KERANJANG.length;
  KERANJANG = KERANJANG.filter(x => cariProduk(x.id));
  if (KERANJANG.length !== sebelum) simpanKeranjang(); else renderKeranjang();
}
function isiKeranjang() { return KERANJANG.map(x => ({ p: cariProduk(x.id), qty: x.qty })).filter(x => x.p); }
function pesanCheckout() {
  const l = isiKeranjang();
  const baris = l.map((x, i) => `${i + 1}. ${namaLengkap(x.p)}\n   ${x.qty} x ${rupiah(x.p.harga)} = ${rupiah(x.p.harga * x.qty)}`);
  const total = l.reduce((s, x) => s + x.p.harga * x.qty, 0);
  return `Halo Laptop Makassar, saya ingin memesan:\n\n${baris.join('\n')}\n\nTotal: ${rupiah(total)}\n\nMohon info ketersediaan unit dan cara pembayarannya. Terima kasih.`;
}
function renderKeranjang() {
  const l = isiKeranjang();
  const jumlah = l.reduce((s, x) => s + x.qty, 0);
  const total = l.reduce((s, x) => s + x.p.harga * x.qty, 0);
  $$('[data-badge]').forEach(b => { b.textContent = jumlah; b.hidden = !jumlah; });
  const cartbar = $('#cartbar'), cbJumlah = $('#cbJumlah'), cbTotal = $('#cbTotal'), krTotal = $('#krTotal'), krFoot = $('#krFoot'), btnCheckout = $('#btnCheckout'), krIsi = $('#krIsi');
  if (cartbar) cartbar.hidden = !jumlah;
  if (cbJumlah) cbJumlah.textContent = `${jumlah} item`;
  if (cbTotal) cbTotal.textContent = rupiah(total);
  if (krTotal) krTotal.textContent = rupiah(total);
  if (krFoot) krFoot.hidden = !l.length;
  if (btnCheckout) btnCheckout.href = l.length ? waLink(pesanCheckout()) : '#';
  if (krIsi) {
    krIsi.innerHTML = l.length ? l.map(({ p, qty }) => `
      <div class="kr-item">
        <div class="kr-foto"><img src="${esc(p.foto)}" alt="" ${fotoErr}></div>
        <div>
          <p class="kr-nama">${esc(namaLengkap(p))}</p>
          <p class="kr-harga">${rupiah(p.harga)}</p>
          <div class="kr-baris">
            <div class="qty">
              <button type="button" data-qty="${esc(p.id)}" data-d="-1" aria-label="Kurangi"><svg viewBox="0 0 24 24"><use href="#i-minus"/></svg></button>
              <span aria-live="polite">${qty}</span>
              <button type="button" data-qty="${esc(p.id)}" data-d="1" aria-label="Tambah"><svg viewBox="0 0 24 24"><use href="#i-plus"/></svg></button>
            </div>
            <span class="kr-sub">${rupiah(p.harga * qty)}</span>
          </div>
          <button type="button" class="kr-hapus" data-hapus="${esc(p.id)}"><svg viewBox="0 0 24 24"><use href="#i-trash"/></svg>Hapus</button>
        </div>
      </div>`).join('') : '<p class="kr-kosong">Keranjang masih kosong.</p>';
  }
}
const krIsiBox = $('#krIsi'), cartBarBox = $('#cartbar'), storeKrBtn = $('#storeKeranjang'), checkoutBtn = $('#btnCheckout');
if (krIsiBox) {
  krIsiBox.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]'), h = e.target.closest('[data-hapus]');
    if (q) {
      const it = KERANJANG.find(x => x.id === String(q.dataset.qty)); if (!it) return;
      it.qty += +q.dataset.d;
      if (it.qty > MAKS_QTY) { it.qty = MAKS_QTY; toast(`Maksimal ${MAKS_QTY} unit per produk`); }
      if (it.qty < 1) KERANJANG = KERANJANG.filter(x => x !== it);
      simpanKeranjang();
    } else if (h) { KERANJANG = KERANJANG.filter(x => x.id !== String(h.dataset.hapus)); simpanKeranjang(); }
  });
}
if (cartBarBox) cartBarBox.addEventListener('click', () => keranjang && bukaDialog(keranjang));
if (storeKrBtn) storeKrBtn.addEventListener('click', () => keranjang && bukaDialog(keranjang));
if (checkoutBtn) checkoutBtn.addEventListener('click', e => { if (!isiKeranjang().length) e.preventDefault(); });

/* ---------- 8. Detail produk ---------- */
const detail = $('#detail');
let detailId = null;
function bukaDetail(id) {
  if (!detail) return;
  const p = cariProduk(id); if (!p) return;
  detailId = p.id;
  const k = KONDISI[p.kondisi] || KONDISI.bekas, sp = p.spek || {}, nama = namaLengkap(p);
  const baris = (n, v) => `<div><dt>${n}</dt><dd>${esc(v || '-')}</dd></div>`;
  const hemat = p.hargaNormal && p.hargaNormal > p.harga;
  const detailBody = $('#detailBody'), detailWa = $('#detailWa');
  if (detailBody) {
    detailBody.innerHTML = `
    <div class="detail-grid detail">
      <div class="detail-foto"><img src="${esc(p.foto)}" alt="${esc(nama)}" ${fotoErr}></div>
      <div>
        <div class="tag-baris"><span class="tag tag-gelap">${esc(k.label)}</span>${p.tags.filter(t => LABEL_TAG[t]).map(t => `<span class="tag">${esc(LABEL_TAG[t])}</span>`).join('')}</div>
        <h3 class="detail-nama" style="margin-top:10px">${esc(nama)}</h3>
        <p class="detail-harga">${rupiah(p.harga)}${hemat ? `<s>${rupiah(p.hargaNormal)}</s>` : ''}</p>
        ${hemat ? `<p class="hemat">Hemat ${rupiah(p.hargaNormal - p.harga)}</p>` : ''}
        <h3>Spesifikasi</h3>
        <dl>${baris('Merek', p.merek)}${baris('Seri', p.seri)}${baris('Processor', sp.processor)}${baris('RAM', sp.ram)}${baris('Storage', sp.storage)}${baris('Kartu grafis (VGA)', sp.vga)}${baris('Ukuran layar', sp.layar)}</dl>
        <h3>Kondisi unit</h3><p class="p">${esc(k.detail)}</p>
        <h3>Kelengkapan</h3><p class="p">${esc(k.kelengkapan)}</p>
        <h3>Garansi toko</h3><p class="p">${esc(k.garansi)}</p>
      </div>
    </div>`;
    detailBody.scrollTop = 0;
  }
  if (detailWa) detailWa.href = waLink(`Halo kak, ${nama} masih ada?`);
  bukaDialog(detail);
}
const detailTambahBtn = $('#detailTambah');
if (detailTambahBtn) detailTambahBtn.addEventListener('click', () => { if (detailId !== null) { tambahKeranjang(detailId); detail?.close(); } });

/* ---------- 9. Pencarian AI ---------- */
const dialogCari = $('#cari'), cariInput = $('#cariInput'), cariHasil = $('#cariHasil');
function bukaCari() { if (dialogCari) { bukaDialog(dialogCari); setTimeout(() => cariInput?.focus(), 50); } }
const btnCari = $('#btnCari'), cariContoh = $('#cariContoh'), cariKirim = $('#cariKirim');
if (btnCari) btnCari.addEventListener('click', bukaCari);
if (cariContoh) {
  cariContoh.addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    if (cariInput) cariInput.value = c.textContent; 
    jalankanCari();
  });
}
if (cariKirim) cariKirim.addEventListener('click', jalankanCari);
if (cariInput) cariInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); jalankanCari(); } });

const KATA_KUNCI = {
  gaming: ['gaming', 'rog', 'tuf', 'nitro', 'legion', 'rtx', 'gtx', 'geforce'],
  game: ['gaming', 'rog', 'tuf', 'nitro', 'legion', 'rtx', 'gtx', 'geforce'],
  edit: ['rtx', 'gtx', 'ryzen 7', 'i7', 'i5', '16 gb', '32 gb', 'macbook', 'm1', 'm2'],
  video: ['rtx', 'gtx', 'ryzen 7', 'i7', 'i5', '16 gb', '32 gb', 'macbook', 'm1', 'm2'],
  desain: ['rtx', 'gtx', 'ryzen 7', 'i7', '16 gb', 'macbook', 'm1', 'm2'],
  kantor: ['thinkpad', 'latitude', 'elitebook', 'probook', 'vivobook', 'i5'],
  kerja: ['thinkpad', 'latitude', 'elitebook', 'probook', 'vivobook', 'i5'],
  kuliah: ['celeron', 'vivobook', 'aspire', 'i3', 'i5'],
  sekolah: ['celeron', 'vivobook', 'aspire', 'i3'],
  murah: ['celeron', 'i3', 'aspire']
};
function cariLokal(q) {
  const t = q.toLowerCase();
  let maks = null;
  const m = t.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb)/);
  if (m) { const n = parseFloat(m[1].replace(',', '.')); maks = /^j/.test(m[2]) ? n * 1e6 : n * 1e3; }
  const kata = t.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(k => k.length > 2);
  const istilah = new Set(); kata.forEach(k => { istilah.add(k); (KATA_KUNCI[k] || []).forEach(x => istilah.add(x)); });
  const hasil = PRODUK.filter(p => !maks || p.harga <= maks).map(p => {
    const jerami = [namaLengkap(p), p.kategori, ...Object.values(p.spek || {})].join(' ').toLowerCase();
    let skor = 0; istilah.forEach(k => { if (jerami.includes(k)) skor++; });
    return { p, skor };
  }).filter(x => x.skor > 0 || (maks && !istilah.size)).sort((a, b) => b.skor - a.skor || a.p.harga - b.p.harga).slice(0, 5);
  return {
    ringkasan: 'Hasil pencarian kata kunci (asisten AI sedang tidak tersedia).',
    hasil: hasil.map(x => ({ id: String(x.p.id), alasan: [x.p.spek?.processor, x.p.spek?.ram && `RAM ${x.p.spek.ram}`, x.p.spek?.storage].filter(Boolean).join(', ') }))
  };
}
let nomorCari = 0;
async function jalankanCari() {
  if (!cariInput || !cariHasil) return;
  const q = cariInput.value.trim(); if (!q) { cariInput.focus(); return; }
  const no = ++nomorCari;
  cariHasil.innerHTML = '<div class="cari-muat"><span class="putar"></span>Mencari laptop yang cocok...</div>';
  await siapProduk;
  let data;
  try {
    const r = await sb.functions.invoke('cari-ai', { body: { q } });
    if (r.error || !r.data || r.data.error) throw r.error || new Error(r.data?.error || 'kosong');
    data = r.data;
  } catch (e) { console.warn('Pencarian AI gagal, memakai pencarian lokal:', e); data = cariLokal(q); }
  if (no !== nomorCari) return;
  const l = (data.hasil || []).map(h => ({ p: cariProduk(h.id), alasan: h.alasan })).filter(x => x.p);
  cariHasil.innerHTML = `<p class="cari-ring">${esc(data.ringkasan || '')}</p>` + (l.length ? l.map(({ p, alasan }) => `
    <div class="cari-kartu">
      <div class="kr-foto"><img src="${esc(p.foto)}" alt="" ${fotoErr}></div>
      <div>
        <p class="kr-nama">${esc(namaLengkap(p))}</p>
        <p class="kr-harga"><b>${rupiah(p.harga)}</b></p>
        <p class="cari-alasan">${esc(alasan)}</p>
        <div class="cari-aksi">
          <button type="button" class="btn btn-kecil btn-garis" data-open="${esc(p.id)}">Pelajari</button>
          <button type="button" class="btn btn-kecil" data-tambah="${esc(p.id)}">Tambah</button>
        </div>
      </div>
    </div>`).join('') : '<p class="kecil">Belum ada yang cocok. Coba ubah anggaran atau kebutuhanmu.</p>');
}
if (cariHasil) {
  cariHasil.addEventListener('click', e => {
    const t = e.target.closest('[data-tambah]'); if (t) { tambahKeranjang(t.dataset.tambah); return; }
    const o = e.target.closest('[data-open]'); if (o) { dialogCari?.close(); bukaDetail(o.dataset.open); }
  });
}

/* ---------- 10. Data dari Supabase ---------- */
function dariDb(r) {
  let spek = r.spek;
  if (typeof spek === 'string') { try { spek = JSON.parse(spek); } catch { spek = {}; } }
  let tags = r.tags;
  if (typeof tags === 'string') { try { tags = JSON.parse(tags); } catch { tags = []; } }
  return {
    id: r.id, kategori: r.kategori, merek: r.merek || '', seri: r.seri || '',
    harga: Number(r.harga) || 0, hargaNormal: r.harganormal ? Number(r.harganormal) : null,
    tags: Array.isArray(tags) ? tags : [], kondisi: KONDISI[r.kondisi] ? r.kondisi : 'bekas',
    foto: r.foto || window.FOTO_KOSONG, spek: spek || {}
  };
}
async function muatProduk() {
  let r = await sb.from('produk').select('*').order('created_at', { ascending: false });
  if (r.error) r = await sb.from('produk').select('*').order('id', { ascending: false });
  if (r.error) throw r.error;
  PRODUK = (r.data || []).map(dariDb);
}
async function muatConfig() {
  const { data, error } = await sb.from('config').select('*').order('id', { ascending: true }).limit(1);
  if (error) throw error;
  const c = data && data[0]; if (!c) return;
  Object.keys(CONFIG_AWAL).forEach(k => { if (c[k] !== undefined && c[k] !== null && String(c[k]).trim() !== '') CONFIG[k] = c[k]; });
}
async function muatBanner() {
  const { data, error } = await sb.from('banner').select('*').order('urutan', { ascending: true });
  if (error) throw error;
  BANNER = data || [];
}
let terakhirMuat = 0, siapProduk = Promise.resolve();
async function muatSemua() {
  sedangMemuat = !PRODUK.length; gagalMemuat = false; renderKatalog();
  const pProduk = muatProduk();
  siapProduk = pProduk.catch(() => {});
  const hasil = await Promise.allSettled([pProduk, muatConfig(), muatBanner()]);
  hasil.forEach(h => { if (h.status === 'rejected') console.error('Gagal memuat dari Supabase:', h.reason); });
  gagalMemuat = hasil[0].status === 'rejected';
  sedangMemuat = false; terakhirMuat = Date.now();
  renderKatalog(); terapkanConfig(); renderHero(); renderSliderToko(); bersihkanKeranjang();
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - terakhirMuat > 20000) muatSemua();
});
let timerRealtime = null;
try {
  sb.channel('perubahan-toko')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => { clearTimeout(timerRealtime); timerRealtime = setTimeout(muatSemua, 400); })
    .subscribe();
} catch (e) { console.warn('Realtime tidak aktif:', e); }

/* ---------- 11. Mulai ---------- */
terapkanConfig();
renderHero();
renderSliderToko();
renderKeranjang();
muatSemua();
sinkronToko();
