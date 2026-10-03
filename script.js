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
  t.textContent = teks; t.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => t.classList.remove('tampil'), 2200);
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

$('#tahun').textContent = new Date().getFullYear();

/* ---------- 2. Info toko ---------- */
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
  if (peta && CONFIG.peta_embed_url && peta.getAttribute('src') !== CONFIG.peta_embed_url) peta.src = CONFIG.peta_embed_url;
  if (peta) peta.closest('.peta').hidden = !CONFIG.peta_embed_url;
}

/* ---------- 3. Tema & sidebar ---------- */
const saklar = $('#saklarTema');
function setTema(gelap, simpan = true) {
  document.documentElement.toggleAttribute('data-tema', gelap);
  if (gelap) document.documentElement.setAttribute('data-tema', 'gelap');
  saklar.setAttribute('aria-checked', String(gelap));
  $('meta[name="theme-color"]').content = gelap ? '#0f1115' : '#fafafa';
  if (simpan) { try { localStorage.setItem('lm_tema', gelap ? 'gelap' : 'terang'); } catch (e) {} }
}
setTema(document.documentElement.getAttribute('data-tema') === 'gelap', false);
saklar.addEventListener('click', () => setTema(saklar.getAttribute('aria-checked') !== 'true'));

const sidebar = $('#sidebar'), scrim = $('#scrim'), btnMenu = $('#btnMenu');
function bukaSidebar() {
  scrim.hidden = false;
  sidebar.removeAttribute('inert'); sidebar.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => sidebar.classList.add('buka'));
  btnMenu.setAttribute('aria-expanded', 'true');
  kunci(true);
  $('#btnTutupMenu').focus();
}
function tutupSidebar(fokus = true) {
  if (!sidebar.classList.contains('buka')) return;
  sidebar.classList.remove('buka'); scrim.hidden = true;
  sidebar.setAttribute('inert', ''); sidebar.setAttribute('aria-hidden', 'true');
  btnMenu.setAttribute('aria-expanded', 'false');
  kunci(false);
  if (fokus) btnMenu.focus();
}
btnMenu.addEventListener('click', bukaSidebar);

/* [PATCH-HEADER] Perilaku navigasi laptop (aman: tidak melakukan apa-apa jika elemen tidak ada) */
(function () {
  const nav = document.querySelector('.hdr-nav');
  if (!nav) return;
  nav.addEventListener('click', e => {
    const go = e.target.closest('[data-goto]');
    if (go) { e.preventDefault(); gulirKe(go.dataset.goto); }
  });
  const tema = document.getElementById('btnTemaHdr');
  if (tema) tema.addEventListener('click', () => setTema(saklar.getAttribute('aria-checked') !== 'true'));
})();
$('#btnTutupMenu').addEventListener('click', () => tutupSidebar());
scrim.addEventListener('click', () => tutupSidebar());
sidebar.addEventListener('click', e => {
  const go = e.target.closest('[data-goto]');
  if (go) { e.preventDefault(); tutupSidebar(false); gulirKe(go.dataset.goto); }
  else if (e.target.closest('a[target="_blank"]')) tutupSidebar(false);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (sidebar.classList.contains('buka')) tutupSidebar();
  else if (!storePage.hidden && !document.querySelector('dialog[open]')) tutupToko();
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
  const l = daftarHero();
  const sig = JSON.stringify(l.map(b => [b.id, b.url, b.jenis, b.judul, b.urutan]));
  if (sig === hero.sig) return;
  hero.sig = sig; hero.slides = l; hero.idx = 0; hero.jeda = false;
  clearTimeout(hero.timer);

  if (!l.length) {
    heroTrack.innerHTML = `<div class="hero-slide"><div class="hero-kosong"><b>Laptop Makassar</b><span>Laptop baru dan bekas berkualitas</span></div></div>`;
    $('#heroNav').hidden = true; $('#heroKontrol').hidden = true; $('#heroCap').textContent = '';
    return;
  }
  heroTrack.innerHTML = l.map((b, i) => `<div class="hero-slide" aria-hidden="${i !== 0}">` + (b.jenis === 'video'
    ? `<video src="${esc(b.url)}" muted playsinline preload="${i === 0 ? 'auto' : 'metadata'}" ${l.length === 1 ? 'loop' : ''}></video>`
    : `<img src="${esc(b.url)}" alt="${esc(b.judul || 'Promo Laptop Makassar')}" ${i === 0 ? '' : 'loading="lazy"'} ${fotoErr}>`) + `</div>`).join('');
  $$('video', heroTrack).forEach((v, i) => {
    v.addEventListener('ended', () => { if (hero.slides.length > 1) heroKe(hero.idx + 1); });
    v.addEventListener('error', () => { if (hero.slides[hero.idx] && heroTrack.children[hero.idx].contains(v)) jadwalkanHero(6000); });
  });
  $('#heroBars').innerHTML = l.map((_, i) => `<button type="button" aria-label="Slide ${i + 1}" data-i="${i}"></button>`).join('');
  $('#heroNav').hidden = l.length < 2;
  heroKe(0, true);
}
function slideAktif() { return hero.slides[hero.idx]; }
function videoAktif() { return heroTrack.children[hero.idx]?.querySelector('video') || null; }
function jadwalkanHero(ms) {
  clearTimeout(hero.timer);
  if (hero.slides.length < 2 || hero.ditahan || hero.jeda) return;
  hero.timer = setTimeout(() => heroKe(hero.idx + 1), ms);
}
function heroKe(i, awal = false) {
  const n = hero.slides.length; if (!n) return;
  if (!awal) hero.jeda = false;
  hero.idx = ((i % n) + n) % n;
  heroTrack.style.transform = `translateX(-${hero.idx * 100}%)`;
  $$('.hero-slide', heroTrack).forEach((s, k) => s.setAttribute('aria-hidden', String(k !== hero.idx)));$$
('#heroBars button').forEach((b, k) => b.setAttribute('aria-current', String(k === hero.idx)));
  const s = slideAktif();
  $('#heroCap').textContent = s.judul || '';
  /* kontrol jeda/suara HANYA untuk slide video; slide foto tanpa kontrol */
  $('#heroKontrol').hidden = s.jenis !== 'video';   $$('video', heroTrack).forEach(v => { v.pause(); v.currentTime = 0; v.muted = !hero.suara; });
  perbaruiIkonHero();
  clearTimeout(hero.timer);
  if (s.jenis === 'video') {
    const v = videoAktif();
    if (v && !hero.ditahan) v.play().catch(() => jadwalkanHero(6000));
  } else jadwalkanHero(5500);
}
function perbaruiIkonHero() {
  $('#heroJeda').innerHTML = IKON(hero.jeda ? 'i-play' : 'i-pause');
  $('#heroJeda').setAttribute('aria-label', hero.jeda ? 'Putar video' : 'Jeda video');
  $('#heroSuara').innerHTML = IKON(hero.suara ? 'i-vol' : 'i-mute');
  $('#heroSuara').setAttribute('aria-label', hero.suara ? 'Matikan suara' : 'Nyalakan suara');
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
$('#heroJeda').addEventListener('click', () => {
  const v = videoAktif(); if (!v) return;
  hero.jeda = !hero.jeda;
  if (hero.jeda) v.pause(); else v.play().catch(() => {});
  perbaruiIkonHero();
});
$('#heroSuara').addEventListener('click', () => {   hero.suara = !hero.suara;   $$('video', heroTrack).forEach(v => { v.muted = !hero.suara; });
  perbaruiIkonHero();
});
$('#heroPrev').addEventListener('click', () => heroKe(hero.idx - 1));
$('#heroNext').addEventListener('click', () => heroKe(hero.idx + 1));
$('#heroBars').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) heroKe(+b.dataset.i); });
pasangGeser(heroEl, d => heroKe(hero.idx + d));
document.addEventListener('visibilitychange', () => heroTahan(document.hidden || !storePage.hidden));

/* Geser jari/mouse kiri-kanan */
function pasangGeser(el, aksi) {
  let x0 = null, y0 = 0;
  el.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; x0 = e.clientX; y0 = e.clientY; });
  el.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) aksi(dx < 0 ? 1 : -1);
  });
  el.addEventListener('pointercancel', () => { x0 = null; });
}

/* ---------- 5. Galeri "Kunjungi toko kami" (3-4 slot, dikelola dari admin) [PATCH-GALERI] ---------- */
const GALERI_MAKS = 4, GALERI_MIN = 3;
const galeri = { sig: '' };
/* Nama fungsi sengaja dipertahankan agar pemanggil lama (muatSemua & bagian Mulai) tetap jalan */
function renderSliderToko() {
  const root = $('#galeriToko'); if (!root) return;
  const l = BANNER.filter(b => b.bagian === 'toko' && b.jenis === 'foto').slice(0, GALERI_MAKS);
  const sig = JSON.stringify(l.map(b => [b.id, b.url, b.judul, b.urutan]));
  if (sig === galeri.sig) return;
  galeri.sig = sig;
  const slot = Math.max(GALERI_MIN, l.length);
  let html = '';
  for (let i = 0; i < slot; i++) {
    const b = l[i];
    html += b
      ? `<figure class="galeri-item"><img src="${esc(b.url)}" alt="${esc(b.judul || 'Foto toko Laptop Makassar')}" loading="lazy" ${fotoErr}>${b.judul ? `<figcaption>${esc(b.judul)}</figcaption>` : ''}</figure>`
      : `<figure class="galeri-item galeri-kosong"><img src="${window.FOTO_KOSONG}" alt="" loading="lazy"></figure>`;
  }
  root.innerHTML = html;
}

/* ---------- 6. Halaman Toko (#toko) ---------- */
const storePage = $('#storePage'), storeSelect = $('#storeKategori'), storeCari = $('#storeCari');
const state = { mode: 'all', key: null, q: '', semua: false };
let tokoDariDalam = false;

function sinkronToko() {
  const buka = location.hash === '#toko';
  if (storePage.hidden !== buka) return;
  storePage.hidden = !buka;
  $('#app').inert = buka;
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
$('#btnToko').addEventListener('click', bukaToko);
$('#storeBack').addEventListener('click', tutupToko); $$('a[href="#toko"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); bukaToko(); }));

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
storeCari.addEventListener('input', () => { state.q = storeCari.value.trim(); state.semua = false; renderKatalog(); });

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
  const semua = daftarTerfilter();
  const tampil = state.semua ? semua : semua.slice(0, PAGE);
  $('#status').textContent = sedangMemuat ? 'Memuat katalog...'
    : gagalMemuat && !PRODUK.length ? 'Katalog belum bisa dimuat.'
    : semua.length ? `Menampilkan ${tampil.length} dari ${semua.length} laptop` : 'Belum ada laptop yang cocok';

  if (sedangMemuat) {
    $('#grid').innerHTML = Array.from({ length: 4 }, () => '<div class="skel"></div>').join('');
    $('#more').innerHTML = '';
  } else if (gagalMemuat && !PRODUK.length) {
    $('#grid').innerHTML = `<div class="kosong"><p><b>Data laptop belum bisa dimuat.</b></p><p>Periksa koneksi internet, lalu coba lagi.</p><button type="button" class="btn" id="ulangMuat">Muat ulang</button></div>`;
    $('#more').innerHTML = '';
  } else {
    $('#grid').innerHTML = tampil.length ? tampil.map(kartuProduk).join('')
      : `<div class="kosong"><p><b>Belum ada unit untuk pilihan ini.</b></p><p>Stok kami bergerak cepat. Tanyakan ketersediaannya lewat WhatsApp.</p><a class="btn" data-wa target="_blank" rel="noopener" href="${waLink(CONFIG.pesan_umum)}">Tanya via WhatsApp</a></div>`;
    /* Hanya SATU tombol "Lainnya": dibuat ulang tiap render, tidak pernah dobel */
    $('#more').innerHTML = (!state.semua && semua.length > PAGE) ? `<button type="button" id="moreBtn" class="btn btn-garis">Lainnya (${semua.length - PAGE} lagi)</button>` : '';
  }
}
$('#more').addEventListener('click', e => {
  if (!e.target.closest('#moreBtn')) return;
  state.semua = true; renderKatalog();
  const k = $('#grid').children[PAGE]; if (k) k.querySelector('button').focus();
});
$('#grid').addEventListener('click', e => {
  if (e.target.closest('#ulangMuat')) { muatSemua(); return; }
  const t = e.target.closest('[data-tambah]'); if (t) { tambahKeranjang(t.dataset.tambah); return; }
  const o = e.target.closest('[data-open]'); if (o) bukaDetail(o.dataset.open);
});

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
  $$('[data-badge]').forEach(b => { b.textContent = jumlah; b.hidden = !jumlah; });$('#cartbar').hidden = !jumlah;
  $('#cbJumlah').textContent = `${jumlah} item`;
  $('#cbTotal').textContent = rupiah(total);
  $('#krTotal').textContent = rupiah(total);
  $('#krFoot').hidden = !l.length;
  $('#btnCheckout').href = l.length ? waLink(pesanCheckout()) : '#';
  $('#krIsi').innerHTML = l.length ? l.map(({ p, qty }) => `
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
$('#krIsi').addEventListener('click', e => {
  const q = e.target.closest('[data-qty]'), h = e.target.closest('[data-hapus]');
  if (q) {
    const it = KERANJANG.find(x => x.id === String(q.dataset.qty)); if (!it) return;
    it.qty += +q.dataset.d;
    if (it.qty > MAKS_QTY) { it.qty = MAKS_QTY; toast(`Maksimal ${MAKS_QTY} unit per produk`); }
    if (it.qty < 1) KERANJANG = KERANJANG.filter(x => x !== it);
    simpanKeranjang();
  } else if (h) { KERANJANG = KERANJANG.filter(x => x.id !== String(h.dataset.hapus)); simpanKeranjang(); }
});
$('#cartbar').addEventListener('click', () => bukaDialog(keranjang));
$('#storeKeranjang').addEventListener('click', () => bukaDialog(keranjang));
$('#btnCheckout').addEventListener('click', e => { if (!isiKeranjang().length) e.preventDefault(); });

/* ---------- 8. Detail produk ---------- */
const detail = $('#detail');
let detailId = null;
function bukaDetail(id) {
  const p = cariProduk(id); if (!p) return;
  detailId = p.id;
  const k = KONDISI[p.kondisi] || KONDISI.bekas, sp = p.spek || {}, nama = namaLengkap(p);
  const baris = (n, v) => `<div><dt>${n}</dt><dd>${esc(v || '-')}</dd></div>`;
  const hemat = p.hargaNormal && p.hargaNormal > p.harga;
  $('#detailBody').innerHTML = `
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
  $('#detailWa').href = waLink(`Halo kak, ${nama} masih ada?`);
  $('#detailBody').scrollTop = 0;
  bukaDialog(detail);
}
$('#detailTambah').addEventListener('click', () => { if (detailId !== null) { tambahKeranjang(detailId); detail.close(); } });

/* ---------- 9. Pencarian Lokal Cerdas (Interaksi Super Luas & Natural Ala CS Toko) ---------- */
const dialogCari = $('#cari'), cariInput = $('#cariInput'), cariHasil = $('#cariHasil');
function bukaCari() { bukaDialog(dialogCari); setTimeout(() => cariInput.focus(), 50); }
$('#btnCari').addEventListener('click', bukaCari);
$('#cariContoh').addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  cariInput.value = c.textContent; jalankanCari();
});
$('#cariKirim').addEventListener('click', jalankanCari);
cariInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); jalankanCari(); } });

function cariLokalCerdas(q) {
  const t = q.toLowerCase().trim();
  const noWa = CONFIG.wa || 'Admin';
  const linkWaCustom = waLink(`Halo Kak, saya mau konsultasi / cari unit laptop dengan detail: "${q}"`);

  // --- KAMUS PERCAKAPAN LENGKAP & NATURAL ---
  const sapaanList = ['halo', 'hai', 'hallo', 'hei', 'p', 'assalamu', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'min', 'admin', 'gan', 'bos', 'bro'];
  const konfirmasiYa = ['iya', 'iya nih', 'yup', 'boleh', 'mau', 'ada', 'oke', 'ok', 'siap', 'boleh banget', 'betul', 'yoi', 'pasti'];
  const konfirmasiTidak = ['gak', 'nggak', 'tidak', 'ga', 'belum', 'nanti dulu', 'makasih', 'terima kasih', 'thanks', 'cukup', 'tdk'];
  
  // Tanya Toko & Alamat
  const tanyaToko = ['toko', 'lokasi', 'alamat', 'dimana', 'di mana', 'tempat', 'store', 'datang langsung', 'offline', 'maps', 'peta'];
  const tanyaJam = ['buka jam', 'jam berapa', 'tutup', 'operasional', 'hari apa aja', 'senin sampai'];
  
  // Tanya Layanan, Cicilan & Tukar Tambah
  const tanyaCicilan = ['cicil', 'kredit', 'angsuran', 'dp', 'paylater', 'spaylater', 'kartu kredit', 'leasing'];
  const tanyaTradeIn = ['tukar tambah', 'tukar', 'trade in', 'tambah bayar', 'barter', 'jual laptop lama'];
  const tanyaGaransi = ['garansi', 'segel', 'rusak', 'garansi toko', 'service', 'servis', 'ada garansinya'];
  const tanyaKondisi = ['kondisi', 'fisik', 'mulus', 'bekas', 'second', 'baru', 'lelangan', 'ex display'];
  const tanyaBonus = ['bonus', 'dapat apa aja', 'kelengkapan', 'tas', 'mouse', 'charger', 'dus'];

  // Cek Sapaan
  if (sapaanList.some(s => t === s || t.startsWith(s + ' '))) {
    return {
      jawaban: "Halo juga Kak! 😊 Selamat datang di toko kami. Ada yang bisa dibantu atau lagi cari laptop apa nih?",
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Konfirmasi Ya
  if (konfirmasiYa.some(k => t === k || t.includes('iya nih'))) {
    return {
      jawaban: "Siap Kak! Silakan sebutkan budget, merek, atau kebutuhan laptopnya ya (misalnya: buat kuliah, gaming, atau desain), nanti saya carikan unit terbaik yang ready! 😊",
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Konfirmasi Tidak
  if (konfirmasiTidak.some(k => t === k)) {
    return {
      jawaban: "Baik Kak! Kalau sewaktu-waktu butuh bantuan atau mau tanya soal laptop, kabari saja ya. Jangan ragu mampir ke toko! 😊",
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Lokasi Toko
  if (tanyaToko.some(k => t.includes(k))) {
    return {
      jawaban: `Lokasi toko kami bertempat di ${CONFIG.alamat || 'Makassar'}. Kakak bisa langsung mampir ke toko fisik kami atau cek peta di halaman utama ya! 😊`,
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Jam Buka
  if (tanyaJam.some(k => t.includes(k))) {
    return {
      jawaban: `Untuk jam operasional toko kami: ${CONFIG.jam || 'Setiap hari buka'}. Silakan datang di jam tersebut ya Kak! 😊`,
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Cicilan / Kredit
  if (tanyaCicilan.some(k => t.includes(k))) {
    return {
      jawaban: "Untuk sistem pembayaran cicilan atau kredit, Kakak bisa langsung diskusikan dengan admin kami via WhatsApp ya agar dibantu simulasi dan persyaratannya! 💬",
      rekomendasi: [], linkWa: linkWaCustom
    };
  }
  // Cek Tukar Tambah
  if (tanyaTradeIn.some(k => t.includes(k))) {
    return {
      jawaban: "Bisa banget Kak! Kami melayani tukar tambah laptop lama dengan unit yang ada di toko. Cek spesifikasi laptop lama Kakak lalu kirim fotonya ke WhatsApp admin ya! 📱",
      rekomendasi: [], linkWa: linkWaCustom
    };
  }
  // Cek Garansi
  if (tanyaGaransi.some(k => t.includes(k))) {
    return {
      jawaban: "Tenang saja Kak, semua unit di toko kami sudah lolos uji QC (Quality Control) ketat dan diberikan garansi toko untuk keamanan pemakaian! 👍",
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Kondisi Laptop
  if (tanyaKondisi.some(k => t.includes(k))) {
    return {
      jawaban: "Kami menyediakan unit pilihan terbaik, mulai dari kondisi mulus seperti baru (like new) hingga unit seken berkualitas tinggi yang siap pakai. Silakan cari atau tanya unit spesifiknya ya Kak! 😊",
      rekomendasi: [], linkWa: null
    };
  }
  // Cek Bonus & Kelengkapan
  if (tanyaBonus.some(k => t.includes(k))) {
    return {
      jawaban: "Umumnya setiap pembelian laptop di toko kami sudah termasuk unit, charger original, tas/pouch, dan bonus menarik lainnya (selama persediaan masih ada ya Kak)! 🎒",
      rekomendasi: [], linkWa: null
    };
  }

  // --- DETEKSI HARGA & BUDGET ---
  let maksHarga = null, minHarga = null;
  const rentangMatch = t.match(/(\d+)\s*(?:sampai|sampai dengan|-)\s*(\d+)\s*(juta|jt)/);
  const hargaMatch = t.match(/(?:di bawah|dibawah|kurang dari|maksimal|maks)\s*(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb)/);
  const hargaUmum = t.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb)/);

  if (rentangMatch) {
    minHarga = parseFloat(rentangMatch[1]) * 1e6;
    maksHarga = parseFloat(rentangMatch[2]) * 1e6;
  } else if (hargaMatch) {
    const n = parseFloat(hargaMatch[1].replace(',', '.'));
    maksHarga = /^j/.test(hargaMatch[2]) ? n * 1e6 : n * 1e3;
  } else if (hargaUmum && (/juta|jt|ribu|rb/.test(t))) {
    const n = parseFloat(hargaUmum[1].replace(',', '.'));
    const val = /^j/.test(hargaUmum[2]) ? n * 1e6 : n * 1e3;
    if (t.includes('jutaan')) {
      minHarga = val - 500000;
      maksHarga = val + 1500000;
    } else {
      maksHarga = val + 250000;
    }
  }

  // --- DETEKSI KEBUTUHAN UTAMA ---
  const isGaming = /\b(gaming|game|rog|tuf|nitro|legion|rtx|gtx|geforce|esports)\b/.test(t);
  const isEdit = /\b(edit|render|desain|design|autocad|premiere|corel|photoshop|blender|3d)\b/.test(t);
  const isKantor = /\b(kantor|office|kerja|kuliah|sekolah|tugas|ngetik|mahasiswa|admin|word|excel)\b/.test(t);
  const isTipis = /\b(tipis|ringan|ultrabook|mudah dibawa|portable|zenbook|macbook|air)\b/.test(t);

  const kataArray = t.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(k => k.length > 1);

  // --- PROSES SKORING PRODUK ---
  const hasilSkor = PRODUK.map(p => {
    let skor = 0;
    const sp = p.spek || {};
    const teksProduk = [namaLengkap(p), p.kategori, sp.processor, sp.ram, sp.storage, sp.vga].join(' ').toLowerCase();

    if (maksHarga && p.harga > maksHarga) return { p, skor: -999 };
    if (minHarga && p.harga < minHarga) return { p, skor: -999 };

    kataArray.forEach(k => {
      if (teksProduk.includes(k)) skor += 2;
    });

    if (isGaming && (teksProduk.includes('rtx') || teksProduk.includes('gtx') || teksProduk.includes('rog') || teksProduk.includes('tuf') || teksProduk.includes('nitro') || teksProduk.includes('legion'))) {
      skor += 6;
    }
    if (isEdit && (teksProduk.includes('16gb') || teksProduk.includes('32gb') || teksProduk.includes('i7') || teksProduk.includes('ryzen 7') || teksProduk.includes('ssd'))) {
      skor += 6;
    }
    if (isKantor && (teksProduk.includes('i5') || teksProduk.includes('i3') || teksProduk.includes('vivobook') || teksProduk.includes('ideapad') || teksProduk.includes('ssd'))) {
      skor += 4;
    }
    if (isTipis && (teksProduk.includes('zenbook') || teksProduk.includes('swift') || teksProduk.includes('slim') || teksProduk.includes('macbook'))) {
      skor += 5;
    }

    return { p, skor };
  }).filter(x => x.skor > 0);

  hasilSkor.sort((a, b) => b.skor - a.skor || a.p.harga - b.p.harga);

  const rekomendasiFinal = hasilSkor.slice(0, 5).map(x => ({
    id: String(x.p.id),
    alasan: [x.p.spek?.processor, x.p.spek?.ram && `RAM ${x.p.spek.ram}`, x.p.spek?.storage, x.p.vga && `GPU ${x.p.vga}`].filter(Boolean).join(', ')
  }));

  let jawabanTeks = '';
  let finalLinkWa = null;

  if (rekomendasiFinal.length > 0) {
    jawabanTeks = `Ketemu nih Kak! 😊 Berdasarkan pencarian "${q}", berikut beberapa pilihan unit terbaik yang ready di toko kami:`;
  } else {
    // JIKA TIDAK ADA / SPESIFIKASI KOSONG -> LANGSUNG TERANGKAN KONTAK ADMIN WHATSAPP
    jawabanTeks = `Waduh, untuk spesifikasi atau kriteria "${q}" pas lagi kosong atau belum ada di daftar stok online kami Kak.\n\nTapi tenang! Kakak bisa langsung hubungi admin kami untuk cek ketersediaan unit custom atau pesan khusus via WhatsApp di nomor *${noWa}* atau klik tombol di bawah ini ya! 👇`;
    finalLinkWa = linkWaCustom;
  }

  return { jawaban: jawabanTeks, rekomendasi: rekomendasiFinal, linkWa: finalLinkWa };
}

/* Panel Chat / Interaksi */
const chat = { sibuk: false };
function gulirChat() { const b = cariHasil.closest('.dlg-body'); if (b) b.scrollTop = b.scrollHeight; }
function gelembung(role, teks) {
  const d = document.createElement('div');
  d.className = 'gel ' + (role === 'user' ? 'gel-user' : 'gel-bot');
  d.textContent = teks;
  cariHasil.appendChild(d); gulirChat();
}
function kartuChat(daftar, linkWa) {
  const l = (daftar || []).map(h => ({ p: cariProduk(h.id), alasan: h.alasan })).filter(x => x.p);
  
  if (l.length > 0) {
    const w = document.createElement('div'); w.className = 'gel-kartu';
    w.innerHTML = l.map(({ p, alasan }) => `
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
      </div>`).join('');
    cariHasil.appendChild(w);
  } 
  
  if (linkWa) {
    // Tombol langsung chat WhatsApp admin
    const w = document.createElement('div'); w.className = 'gel-kartu';
    w.innerHTML = `<div style="text-align:center; padding: 12px;"><a href="${linkWa}" target="_blank" rel="noopener" class="btn" style="background:#25d366; color:#fff; display:inline-block; text-decoration:none; padding:10px 18px; border-radius:8px; font-weight:600;">💬 Chat Admin WhatsApp (${esc(CONFIG.wa || 'Admin')})</a></div>`;
    cariHasil.appendChild(w);
  }
  gulirChat();
}

const HALAMAN_ADMIN = 'admin.html';
function adalahPerintahAdmin(teks) {
  const t = String(teks).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t || t.split(' ').length > 5) return false;
  if (!/\badmin(istrator)?\b|loginadmin/.test(t)) return false;
  return /login|log in|masuk|buka|panel|halaman|dashboard/.test(t);
}

function jalankanCari() {
  const q = cariInput.value.trim();
  if (!q) { cariInput.focus(); return; }
  if (adalahPerintahAdmin(q)) {
    cariInput.value = '';
    window.location.href = HALAMAN_ADMIN;
    return;
  }
  if (chat.sibuk) return;
  chat.sibuk = true; $('#cariKirim').disabled = true;
  cariInput.value = '';
  gelembung('user', q);
  
  const ketik = document.createElement('div');
  ketik.className = 'gel gel-bot gel-ketik'; ketik.innerHTML = '<span></span><span></span><span></span>';
  cariHasil.appendChild(ketik); gulirChat();

  setTimeout(() => {
    ketik.remove();
    const hasilCerdas = cariLokalCerdas(q);
    gelembung('model', hasilCerdas.jawaban);
    kartuChat(hasilCerdas.rekomendasi, hasilCerdas.linkWa);
    chat.sibuk = false; $('#cariKirim').disabled = false; cariInput.focus();
  }, 250);
}

gelembung('model', 'Halo Kak! 😊 Silakan ketik apa saja yang ingin ditanyakan. Bisa tanya soal laptop gaming, cicilan, tukar tambah, alamat toko, atau spesifikasi khusus.');

cariHasil.addEventListener('click', e => {
  const t = e.target.closest('[data-tambah]'); if (t) { tambahKeranjang(t.dataset.tambah); return; }
  const o = e.target.closest('[data-open]'); if (o) { dialogCari.close(); bukaDetail(o.dataset.open); }
});
