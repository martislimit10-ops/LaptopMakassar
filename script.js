/* =====================================================================
   1. KONFIGURASI TOKO & LINK BARU
   ===================================================================== */
const CONFIG = {
  wa: '6285117822767',
  alamat: 'Jl. Sepakat, Tamarunang, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92112',
  jam: 'Senin - Minggu: 09.00 - 11.00 WITA',
  instagram: 'laptop_makassar',
  petaQuery: 'Jl. Sepakat, Tamarunang, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92112',
  petaEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8058219468516!2d119.4925!3d-5.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDgnMQuMSJTIDExOWKwDI5JzMzLjAiRQ!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid',
  pesanUmum: 'assalamualaikum laptop Makassar'
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
const HIGHLIGHT = [
        
          
];
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
   5. PRODUK
   ===================================================================== */
let PRODUK = [
  { id: 'p01', kategori: 'gaming', merek: 'ASUS', seri: 'TUF Gaming F15 FX506HC', harga: 8900000, hargaNormal: 9400000,
    tags: ['promo', 'terlaris'], kondisi: 'bekas', foto: 'images/img-11.jpg',
    spek: { processor: 'Intel Core i5-11400H', ram: '16 GB DDR4', storage: '512 GB SSD NVMe', vga: 'NVIDIA GeForce RTX 3050 4 GB', layar: '15,6 inci Full HD 144 Hz' } },

  { id: 'p02', kategori: 'macbook', merek: 'Apple', seri: 'MacBook Air 13 inci M1 (2020)', harga: 9750000,
    tags: ['terlaris'], kondisi: 'bekas', foto: 'images/img-12.jpg',
    spek: { processor: 'Apple M1 (8 core)', ram: '8 GB unified memory', storage: '256 GB SSD', vga: 'GPU M1 7 core (terintegrasi)', layar: '13,3 inci Retina' } },

  { id: 'p03', kategori: 'vivobook', merek: 'ASUS', seri: 'Vivobook 14 A1400EA', harga: 5850000,
    tags: [], kondisi: 'bekas', foto: 'images/img-13.jpg',
    spek: { processor: 'Intel Core i5-1135G7', ram: '8 GB DDR4', storage: '512 GB SSD NVMe', vga: 'Intel Iris Xe (terintegrasi)', layar: '14 inci Full HD' } },

  { id: 'p04', kategori: 'celeron', merek: 'Acer', seri: 'Aspire 3 A314-35', harga: 3450000,
    tags: ['baru'], kondisi: 'baru', foto: 'images/img-14.jpg',
    spek: { processor: 'Intel Celeron N4500', ram: '4 GB DDR4', storage: '256 GB SSD', vga: 'Intel UHD (terintegrasi)', layar: '14 inci HD' } },

  { id: 'p05', kategori: 'lenovo', merek: 'Lenovo', seri: 'ThinkPad T480', harga: 4750000, hargaNormal: 5100000,
    tags: ['promo'], kondisi: 'bekas', foto: 'images/img-15.jpg',
    spek: { processor: 'Intel Core i5-8350U', ram: '8 GB DDR4', storage: '256 GB SSD', vga: 'Intel UHD 620 (terintegrasi)', layar: '14 inci Full HD' } },

  { id: 'p06', kategori: 'hpdell', merek: 'Dell', seri: 'Latitude 5420', harga: 5600000,
    tags: [], kondisi: 'bekas', foto: 'images/img-16.jpg',
    spek: { processor: 'Intel Core i5-1145G7', ram: '16 GB DDR4', storage: '256 GB SSD NVMe', vga: 'Intel Iris Xe (terintegrasi)', layar: '14 inci Full HD' } },

  { id: 'p07', kategori: 'gaming', merek: 'Lenovo', seri: 'Legion 5 15ACH6', harga: 12500000,
    tags: ['terlaris'], kondisi: 'bekas', foto: 'images/img-17.jpg',
    spek: { processor: 'AMD Ryzen 5 5600H', ram: '16 GB DDR4', storage: '512 GB SSD NVMe', vga: 'NVIDIA GeForce RTX 3060 6 GB', layar: '15,6 inci Full HD 165 Hz' } },

  { id: 'p08', kategori: 'macbook', merek: 'Apple', seri: 'MacBook Pro 14 inci M1 Pro (2021)', harga: 19900000,
    tags: ['baru'], kondisi: 'bekas', foto: 'images/img-18.jpg',
    spek: { processor: 'Apple M1 Pro (8 core)', ram: '16 GB unified memory', storage: '512 GB SSD', vga: 'GPU M1 Pro 14 core (terintegrasi)', layar: '14,2 inci Liquid Retina XDR' } },

  { id: 'p09', kategori: 'vivobook', merek: 'ASUS', seri: 'Vivobook 15 X1504ZA', harga: 6250000,
    tags: ['baru'], kondisi: 'baru', foto: 'images/img-19.jpg',
    spek: { processor: 'Intel Core i3-1215U', ram: '8 GB DDR4', storage: '512 GB SSD NVMe', vga: 'Intel UHD (terintegrasi)', layar: '15,6 inci Full HD' } },

  { id: 'p10', kategori: 'celeron', merek: 'ASUS', seri: 'E410MA', harga: 2750000, hargaNormal: 3100000,
    tags: ['promo'], kondisi: 'bekas', foto: 'images/img-20.jpg',
    spek: { processor: 'Intel Celeron N4020', ram: '4 GB DDR4', storage: '256 GB SSD', vga: 'Intel UHD 600 (terintegrasi)', layar: '14 inci HD' } },

  { id: 'p11', kategori: 'lenovo', merek: 'Lenovo', seri: 'IdeaPad Slim 3 15IAH8', harga: 7450000,
    tags: ['baru'], kondisi: 'baru', foto: 'images/img-21.jpg',
    spek: { processor: 'Intel Core i5-12450H', ram: '8 GB DDR4', storage: '512 GB SSD NVMe', vga: 'Intel UHD (terintegrasi)', layar: '15,6 inci Full HD' } },

  { id: 'p12', kategori: 'hpdell', merek: 'HP', seri: 'ProBook 440 G8', harga: 5200000,
    tags: [], kondisi: 'bekas', foto: 'images/img-22.jpg',
    spek: { processor: 'Intel Core i5-1135G7', ram: '8 GB DDR4', storage: '256 GB SSD NVMe', vga: 'Intel Iris Xe (terintegrasi)', layar: '14 inci Full HD' } }
];
const savedProduk = localStorage.getItem('PRODUK_KATALOG');
if (savedProduk) {
  try {
    PRODUK = JSON.parse(savedProduk);
  } catch (e) {
    console.error("Gagal memuat data:", e);
  }
}

/* =====================================================================
   KODE PROGRAM UTAMA
   ===================================================================== */
const $  = (s, r = document) => r.querySelector(s);   const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rupiah = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
const waLink = teks => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(teks)}`;
const namaLengkap = p => `${p.merek} ${p.seri}`;
const kurangGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = 6;

$$('[data-fill]').forEach(el => { el.textContent = CONFIG[el.dataset.fill]; });
$$('[data-wa]').forEach(a => { a.href = waLink(CONFIG.pesanUmum); });$$
('[data-ig]').forEach(a => { a.href = 'https://www.instagram.com/laptop_makassar?stkn=OGt2ZXE5bDQxcGhr'; });
$$('[data-ig-text]').forEach(s => { s.textContent = '@' + CONFIG.instagram; });$$
('[data-maps]').forEach(a => { a.href = 'https://maps.app.goo.gl/CrUqGD1NqXt19Kpy9'; });

const petaFrame = document.getElementById('peta');
if (petaFrame) {
  petaFrame.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8058219468516!2d119.4925!3d-5.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDgnMQuMSJTIDExOWKwDI5JzMzLjAiRQ!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid';
}

const tahunEl = document.getElementById('tahun');
if (tahunEl) tahunEl.textContent = new Date().getFullYear();

/* ---------- Kontrol Pemutar Video ---------- */
const video = document.getElementById('promo');
const videoContainer = document.getElementById('videoContainer');
const pauseOverlay = document.getElementById('pauseOverlay');
const toggleMuteBtn = document.getElementById('toggleMute');
const iconVolOn = document.getElementById('iconVolOn');
const iconVolOff = document.getElementById('iconVolOff');

if (videoContainer && video) {
  videoContainer.addEventListener('click', (e) => {
    if (e.target.closest('#toggleMute')) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => {
    pauseOverlay.classList.add('hidden');
    pauseOverlay.classList.remove('flex');
  });

  video.addEventListener('pause', () => {
    pauseOverlay.classList.remove('hidden');
    pauseOverlay.classList.add('flex');
  });
}

if (toggleMuteBtn && video) {
  toggleMuteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (video.muted) {
      iconVolOff.classList.remove('hidden');
      iconVolOn.classList.add('hidden');
    } else {
      iconVolOff.classList.add('hidden');
      iconVolOn.classList.remove('hidden');
    }
  });
}

/* ---------- Filter Katalog ---------- */
const state = { mode: 'all', key: null, limit: PAGE };

function daftarTerfilter() {
  if (state.mode === 'kategori') return PRODUK.filter(p => p.kategori === state.key);
  if (state.mode === 'tag')      return PRODUK.filter(p => p.tags.includes(state.key));
  return PRODUK;
}
function labelFilter() {
  if (state.mode === 'kategori') return KATEGORI.find(k => k.id === state.key).label;
  if (state.mode === 'tag')      return HIGHLIGHT.find(h => h.tag === state.key).judul;
  return '';
}
function setFilter(mode, key, { gulir = true } = {}) {
  if (mode === state.mode && key === state.key) { mode = 'all'; key = null; }
  state.mode = mode; state.key = key; state.limit = PAGE;
  render();
  if (gulir) $('#katalog').scrollIntoView({ behavior: kurangGerak() ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Render Kategori & Highlight ---------- */
$('#kategoriList').innerHTML = KATEGORI.map(k => `
  <button type="button" class="pick w-36 shrink-0 snap-start text-left sm:w-auto" data-cat="${k.id}" aria-pressed="false">
    <span class="pick-img block aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-[#F9FAFB]">
      <img src="${k.foto}" alt="" loading="lazy" class="h-full w-full object-cover">
    </span>
    <span class="pick-label mt-3 block text-sm font-bold">${k.label}</span>
    <span class="mt-0.5 block text-xs leading-snug text-gray-500 line-clamp-2">${k.desc}</span>
  </button>`).join('');

$('#highlightList').innerHTML = HIGHLIGHT.map(h => {
  const n = PRODUK.filter(p => p.tags.includes(h.tag)).length;
  return `
  <button type="button" class="pick w-[78%] shrink-0 snap-start text-left md:w-auto" data-tag="${h.tag}" aria-pressed="false">
    <span class="pick-img block aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <img src="${h.foto}" alt="" loading="lazy" class="h-full w-full object-cover">
    </span>
    <span class="mt-3 flex items-baseline justify-between gap-3">
      <span class="pick-label text-base font-bold">${h.judul}</span>
      <span class="text-sm text-gray-600">${n} unit</span>
    </span>
    <span class="mt-0.5 block text-sm text-gray-600">${h.teks}</span>
  </button>`;
}).join('');

$('#kategoriList').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (b) setFilter('kategori', b.dataset.cat);
});
$('#highlightList').addEventListener('click', e => {
  const b = e.target.closest('[data-tag]'); if (b) setFilter('tag', b.dataset.tag);
});

/* ---------- Render Katalog & Tombol Edit Biru di Setiap Gambar ---------- */
function kartuProduk(p) {
  const lencana = p.tags.map(t => {
    const gelap = t === 'promo';
    return `<span class="rounded-full px-2.5 py-1 text-xs font-bold ${gelap ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] ring-1 ring-gray-200'}">${LABEL_TAG[t]}</span>`;
  }).join('');
  const ringkas = `${p.spek.processor}, RAM ${p.spek.ram}, ${p.spek.storage}`;
  return `
  <article class="flex flex-col rounded-2xl border border-gray-200 bg-white p-2.5 hover:border-gray-400 sm:p-3 relative">
    <div class="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F9FAFB]">
      <img src="${p.foto}" alt="${namaLengkap(p)}" loading="lazy" class="h-full w-full object-cover">
      ${lencana ? `<div class="absolute left-2 top-2 flex flex-wrap gap-1.5">${lencana}</div>` : ''}
      <!-- Tombol Edit Warna Biru di Setiap Gambar Produk -->
      <button type="button" data-edit-img="${p.id}" class="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1.5 rounded-xl font-bold shadow-md flex items-center gap-1 transition z-10" title="Ganti Foto/Edit Produk">
        ✎ Edit
      </button>
    </div>
    <div class="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
      <h3 class="text-sm font-bold leading-snug line-clamp-2 sm:text-base">${namaLengkap(p)}</h3>
      <p class="mt-1 text-xs leading-snug text-gray-500 line-clamp-2">${ringkas}</p>
      <div class="mt-auto pt-3">
        <p class="flex flex-wrap items-baseline gap-x-2 text-base font-extrabold sm:text-lg">
          ${rupiah(p.harga)}
          ${p.hargaNormal ? `<span class="text-xs font-medium text-gray-500 line-through">${rupiah(p.hargaNormal)}</span>` : ''}
        </p>
        <button type="button" data-open="${p.id}" class="mt-3 w-full rounded-xl bg-[#1F2937] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#111827]">Selengkapnya</button>
      </div>
    </div>
  </article>`;
}

function render() {
  const semua = daftarTerfilter();
  const tampil = semua.slice(0, state.limit);

  $('#status').textContent = semua.length
    ? `Menampilkan ${tampil.length} dari ${semua.length} laptop`
    : 'Belum ada laptop di kategori ini';

  const chip = (aktif, teks, aksi, extra = '') =>
    `<button type="button" data-chip="${aksi}" ${extra} aria-pressed="${aktif}" class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold ${aktif ? 'border-[#111827] bg-[#111827] text-white' : 'border-gray-300 bg-white text-[#111827] hover:border-[#111827]'}">${teks}</button>`;
  $('#filterChips').innerHTML =
    chip(state.mode === 'all', 'Semua produk', 'all') +
    (state.mode !== 'all'
      ? chip(true, `${labelFilter()} <svg class="h-4 w-4"><use href="#i-x"/></svg>`, 'clear', `aria-label="Hapus filter ${labelFilter()}"`)
      : '');

  $('#grid').innerHTML = tampil.length
    ? tampil.map(kartuProduk).join('')
    : `<div class="col-span-full rounded-2xl border border-dashed border-gray-300 p-10 text-center">
         <p class="font-bold">Belum ada unit untuk pilihan ini.</p>
         <p class="mt-1 text-sm text-gray-600">Stok kami bergerak cepat. Tanyakan langsung ketersediaannya lewat WhatsApp.</p>
         <a href="${waLink(CONFIG.pesanUmum)}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-[#111827] hover:brightness-95"><svg class="h-5 w-5"><use href="#i-wa"/></svg>Tanya via WhatsApp</a>
       </div>`;

  const sisa = semua.length - tampil.length;
  $('#more').innerHTML = sisa > 0
    ? `<button type="button" id="moreBtn" class="rounded-xl border border-[#111827] px-6 py-3 text-sm font-semibold hover:bg-[#800000] hover:text-white">Lainnya</button>`
    : '';

  $$('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(state.mode === 'kategori' && state.key === b.dataset.cat)));$$
('[data-tag]').forEach(b => b.setAttribute('aria-pressed', String(state.mode === 'tag' && state.key === b.dataset.tag)));
}

$('#filterChips').addEventListener('click', e => {
  const c = e.target.closest('[data-chip]'); if (!c) return;
  state.mode = 'all'; state.key = null; state.limit = PAGE; render();
});
$('#more').addEventListener('click', e => {
  if (!e.target.closest('#moreBtn')) return;
  const sebelum = state.limit;
  state.limit += PAGE;
  render();
  const kartuBaru = $('#grid').children[sebelum];
  if (kartuBaru) kartuBaru.querySelector('button').focus();
});

/* ---------- Fitur Modal Edit Produk saat Tombol Biru Diklik ---------- */
function pastikanModalTokoAda() {
  // Hapus modal lama jika ada agar teks dan input fotonya ter-update total
  const oldModal = document.getElementById('modalEditToko');
  if (oldModal) oldModal.remove();

  const htmlToko = `
    <dialog id="modalEditToko" class="p-0 rounded-2xl shadow-2xl max-w-md w-full backdrop:bg-black/50 outline-none">
      <form method="dialog" id="formEditTokoContent" class="p-6 bg-white space-y-4">
        <div class="flex justify-between items-center pb-3 border-b">
          <h3 class="text-base font-bold text-gray-900">Edit Info Toko, Maps & Foto</h3>
          <button type="button" onclick="document.getElementById('modalEditToko').close()" class="text-gray-500 font-bold px-2 py-1">✕</button>
        </div>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block font-semibold mb-1 text-gray-700">Nomor WhatsApp (Tanpa 0, contoh: 62851...)</label>
            <input type="text" id="inputWa" class="w-full border p-2.5 rounded-xl">
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-700">Alamat Toko</label>
            <textarea id="inputAlamat" rows="2" class="w-full border p-2.5 rounded-xl"></textarea>
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-700">Link Google Maps (Embed URL)</label>
            <input type="text" id="inputMaps" class="w-full border p-2.5 rounded-xl text-xs">
          </div>
          <div>
            <label class="block font-semibold mb-1 text-gray-700">Ganti Foto Toko (Tampak Depan)</label>
            <input type="file" id="inputFotoTokoFile" accept="image/*" class="w-full border p-2.5 rounded-xl text-xs bg-gray-50">
          </div>
        </div>
        <div class="flex gap-2 pt-3 border-t">
          <button type="button" onclick="document.getElementById('modalEditToko').close()" class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold">Batal</button>
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold">Simpan</button>
        </div>
      </form>
    </dialog>`;
  document.body.insertAdjacentHTML('beforeend', htmlToko);
}


  /* ---------- Fitur Modal Edit Produk & Penyimpanan Permanen (LocalStorage) ---------- */
function pastikanModalEditAda() {
  if (!document.getElementById('formEditModal')) {
    const modalHtml = `
      <dialog id="formEditModal" class="p-0 rounded-2xl shadow-2xl max-w-sm w-full backdrop:bg-black/50 outline-none">
        <form method="dialog" id="formEditContent" class="p-6 bg-white space-y-4">
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="text-base font-bold text-gray-900">Edit Produk & Foto</h3>
            <button type="button" onclick="document.getElementById('formEditModal').close()" class="text-gray-500 font-bold px-2 py-1">✕</button>
          </div>
          <div class="space-y-3 text-sm">
            <div><label class="block font-semibold mb-1 text-gray-700">Merek</label><input type="text" id="editMerek" class="w-full border p-2.5 rounded-xl"></div>
            <div><label class="block font-semibold mb-1 text-gray-700">Seri</label><input type="text" id="editSeri" class="w-full border p-2.5 rounded-xl"></div>
            <div><label class="block font-semibold mb-1 text-gray-700">Harga (Rp)</label><input type="number" id="editHarga" class="w-full border p-2.5 rounded-xl"></div>
            <div><label class="block font-semibold mb-1 text-gray-700">Ganti Foto (Pilih File)</label><input type="file" id="editFotoFile" accept="image/*" class="w-full border p-2.5 rounded-xl text-xs bg-gray-50"></div>
          </div>
          <div class="flex gap-2 pt-3 border-t">
            <button type="button" onclick="document.getElementById('formEditModal').close()" class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold">Batal</button>
            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold">Simpan</button>
          </div>
        </form>
      </dialog>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

const gridTarget = $('#grid');
if (gridTarget) {
  gridTarget.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit-img]');
    if (editBtn) {
      const id = editBtn.dataset.editImg;
      const p = PRODUK.find(x => String(x.id) === String(id));
      if (!p) return;
      pastikanModalEditAda();
      
      document.getElementById('editMerek').value = p.merek;
      document.getElementById('editSeri').value = p.seri;
      document.getElementById('editHarga').value = p.harga;
      document.getElementById('editFotoFile').value = '';
      
      const modalEdit = document.getElementById('formEditModal');
      modalEdit.showModal();

      document.getElementById('formEditContent').onsubmit = (ev) => {
        ev.preventDefault();
        p.merek = document.getElementById('editMerek').value;
        p.seri = document.getElementById('editSeri').value;
        p.harga = Number(document.getElementById('editHarga').value);

        const fileInput = document.getElementById('editFotoFile');
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            p.foto = event.target.result; // Simpan Base64 ke objek
            localStorage.setItem('PRODUK_KATALOG', JSON.stringify(PRODUK)); // Simpan permanen ke browser
            render();
            modalEdit.close();
            alert('Produk dan foto berhasil diperbarui secara permanen!');
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          localStorage.setItem('PRODUK_KATALOG', JSON.stringify(PRODUK)); // Simpan permanen ke browser
          render();
          modalEdit.close();
          alert('Produk berhasil diperbarui secara permanen!');
        }
      };
      return;
    }

    const b = e.target.closest('[data-open]'); 
    if (b) bukaDetail(b.dataset.open);
  });
}

/* ---------- Pop-up Detail Produk ---------- */
const modal = $('#detail');

function barisSpek(nama, nilai) {
  return `<div class="grid grid-cols-[8.5rem_1fr] gap-3 py-2.5"><dt class="text-gray-500">${nama}</dt><dd class="font-semibold">${nilai}</dd></div>`;
}

function bukaDetail(id) {
  const p = PRODUK.find(x => String(x.id) === String(id));
  if (!p) return;
  const k = KONDISI[p.kondisi];
  const nama = namaLengkap(p);
  const lencana = p.tags.map(t => `<span class="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-xs font-bold ring-1 ring-gray-200">${LABEL_TAG[t]}</span>`).join('');

  $('#detailBody').innerHTML = `
  <div class="grid gap-6 p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10 md:p-8">
    <div class="md:sticky md:top-0 md:self-start">
      <div class="aspect-[4/3] overflow-hidden rounded-2xl bg-[#F9FAFB]">
        <img src="${p.foto}" alt="${nama}" class="h-full w-full object-cover">
      </div>
    </div>
    <div>
      <div class="flex flex-wrap gap-2 md:pr-10">
        <span class="rounded-full bg-[#111827] px-2.5 py-1 text-xs font-bold text-white">${k.label}</span>
        ${lencana}
      </div>
      <h2 id="detailTitle" class="mt-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">${nama}</h2>
      <p class="mt-2 flex flex-wrap items-baseline gap-x-3 text-2xl font-extrabold">
        ${rupiah(p.harga)}
        ${p.hargaNormal ? `<span class="text-sm font-medium text-gray-500 line-through">${rupiah(p.hargaNormal)}</span>` : ''}
      </p>

      <h3 class="mt-6 font-bold">Spesifikasi</h3>
      <dl class="mt-2 divide-y divide-gray-200 border-y border-gray-200 text-sm">
        ${barisSpek('Merek', p.merek)}
        ${barisSpek('Seri', p.seri)}
        ${barisSpek('Processor', p.spek.processor)}
        ${barisSpek('RAM', p.spek.ram)}
        ${barisSpek('Storage', p.spek.storage)}
        ${barisSpek('Kartu grafis (VGA)', p.spek.vga)}
        ${barisSpek('Ukuran layar', p.spek.layar)}
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

/* ---------- Mulai ---------- */
render();
/* =====================================================================
   TAMBAHAN FITUR: MODAL EDIT INFO TOKO, MAPS, & VIDEO
   ===================================================================== */
function pastikanModalTokoAda() {
  if (!document.getElementById('modalEditToko')) {
    const htmlToko = `
      <dialog id="modalEditToko" class="p-0 rounded-2xl shadow-2xl max-w-md w-full backdrop:bg-black/50 outline-none">
        <form method="dialog" id="formEditTokoContent" class="p-6 bg-white space-y-4">
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="text-base font-bold text-gray-900">Edit Info Toko & Maps</h3>
            <button type="button" onclick="document.getElementById('modalEditToko').close()" class="text-gray-500 font-bold px-2 py-1">✕</button>
          </div>
          <div class="space-y-3 text-sm">
            <div>
              <label class="block font-semibold mb-1 text-gray-700">Nomor WhatsApp (Tanpa 0, contoh: 62851...)</label>
              <input type="text" id="inputWa" class="w-full border p-2.5 rounded-xl">
            </div>
            <div>
              <label class="block font-semibold mb-1 text-gray-700">Alamat Toko</label>
              <textarea id="inputAlamat" rows="2" class="w-full border p-2.5 rounded-xl"></textarea>
            </div>
            <div>
              <label class="block font-semibold mb-1 text-gray-700">Link Google Maps (Embed URL)</label>
              <input type="text" id="inputMaps" class="w-full border p-2.5 rounded-xl text-xs">
            </div>
          </div>
          <div class="flex gap-2 pt-3 border-t">
            <button type="button" onclick="document.getElementById('modalEditToko').close()" class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold">Batal</button>
            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold">Simpan</button>
          </div>
        </form>
      </dialog>`;
    document.body.insertAdjacentHTML('beforeend', htmlToko);
  }

  if (!document.getElementById('modalEditVideo')) {
    const htmlVideo = `
      <dialog id="modalEditVideo" class="p-0 rounded-2xl shadow-2xl max-w-sm w-full backdrop:bg-black/50 outline-none">
        <form method="dialog" id="formEditVideoContent" class="p-6 bg-white space-y-4">
          <div class="flex justify-between items-center pb-3 border-b">
            <h3 class="text-base font-bold text-gray-900">Ganti Video Toko</h3>
            <button type="button" onclick="document.getElementById('modalEditVideo').close()" class="text-gray-500 font-bold px-2 py-1">✕</button>
          </div>
          <div class="space-y-3 text-sm">
            <div>
              <label class="block font-semibold mb-1 text-gray-700">Pilih File Video Baru</label>
              <input type="file" id="inputVideoFile" accept="video/*" class="w-full border p-2.5 rounded-xl text-xs bg-gray-50">
            </div>
          </div>
          <div class="flex gap-2 pt-3 border-t">
            <button type="button" onclick="document.getElementById('modalEditVideo').close()" class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold">Batal</button>
            <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold">Simpan</button>
          </div>
        </form>
      </dialog>`;
    document.body.insertAdjacentHTML('beforeend', htmlVideo);
  }
}

// Inisialisasi Tombol Edit Toko & Edit Video secara otomatis di halaman
/* =====================================================================
   FITUR EDIT INFO TOKO, MAPS & FOTO TOPO (BERSIH & FINAL)
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Muat data config tersimpan saat halaman dibuka
  const savedConfig = localStorage.getItem('CONFIG_TOKO');
  if (savedConfig && typeof CONFIG !== 'undefined') {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      CONFIG.wa = parsedConfig.wa || CONFIG.wa;
      CONFIG.alamat = parsedConfig.alamat || CONFIG.alamat;
      CONFIG.petaEmbedUrl = parsedConfig.petaEmbedUrl || CONFIG.petaEmbedUrl;
      
      if (typeof $$!== 'undefined') {$$('[data-fill]').forEach(el => { el.textContent = CONFIG[el.dataset.fill]; });
      }
      if (typeof petaFrame !== 'undefined' && petaFrame) {
        petaFrame.src = CONFIG.petaEmbedUrl;
      }

      if (parsedConfig.fotoToko) {
        const imgTokoEl = document.querySelector('img[data-ph*="Tampak depan"]');
        if (imgTokoEl) imgTokoEl.src = parsedConfig.fotoToko;
      }
    } catch (e) {
      console.error("Gagal memuat config toko:", e);
    }
  }

  // 2. Cari judul lokasi untuk menyematkan tombol edit
  const headingToko = [...document.querySelectorAll('h2, h3, h1')].find(el => el.textContent.toLowerCase().includes('toko kami') || el.textContent.toLowerCase().includes('lokasi'));
  
  if (headingToko && !document.getElementById('btnEditTokoTrigger')) {
    const btnToko = document.createElement('button');
    btnToko.id = 'btnEditTokoTrigger';
    btnToko.type = 'button';
    btnToko.className = 'ml-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-md inline-flex items-center gap-1 transition';
    btnToko.innerHTML = '✎ Edit Info Toko & Foto';
    headingToko.appendChild(btnToko);

    btnToko.onclick = () => {
      // Hapus modal lama jika ada agar form selalu fresh
      const existingModal = document.getElementById('modalEditToko');
      if (existingModal) existingModal.remove();

      // Buat modal baru dengan input file foto di dalamnya
      const modalHtml = `
        <dialog id="modalEditToko" class="p-0 rounded-2xl shadow-2xl max-w-md w-full backdrop:bg-black/50 outline-none">
          <form method="dialog" id="formEditTokoContent" class="p-6 bg-white space-y-4">
            <div class="flex justify-between items-center pb-3 border-b">
              <h3 class="text-base font-bold text-gray-900">Edit Info Toko, Maps & Foto</h3>
              <button type="button" onclick="document.getElementById('modalEditToko').close()" class="text-gray-500 font-bold px-2 py-1">✕</button>
            </div>
            <div class="space-y-3 text-sm">
              <div>
                <label class="block font-semibold mb-1 text-gray-700">Nomor WhatsApp (Tanpa 0, contoh: 62851...)</label>
                <input type="text" id="inputWa" class="w-full border p-2.5 rounded-xl">
              </div>
              <div>
                <label class="block font-semibold mb-1 text-gray-700">Alamat Toko</label>
                <textarea id="inputAlamat" rows="2" class="w-full border p-2.5 rounded-xl"></textarea>
              </div>
              <div>
                <label class="block font-semibold mb-1 text-gray-700">Link Google Maps (Embed URL)</label>
                <input type="text" id="inputMaps" class="w-full border p-2.5 rounded-xl text-xs">
              </div>
              <div>
                <label class="block font-semibold mb-1 text-gray-700">Ganti Foto Toko (Tampak Depan)</label>
                <input type="file" id="inputFotoTokoFile" accept="image/*" class="w-full border p-2.5 rounded-xl text-xs bg-gray-50">
              </div>
            </div>
            <div class="flex gap-2 pt-3 border-t">
              <button type="button" onclick="document.getElementById('modalEditToko').close()" class="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold">Batal</button>
              <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold">Simpan</button>
            </div>
          </form>
        </dialog>`;
      
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      const modalToko = document.getElementById('modalEditToko');

      // Masukkan data aktif saat ini ke dalam form input
      if (typeof CONFIG !== 'undefined') {
        document.getElementById('inputWa').value = CONFIG.wa || '';
        document.getElementById('inputAlamat').value = CONFIG.alamat || '';
        document.getElementById('inputMaps').value = CONFIG.petaEmbedUrl || '';
      }
      
      modalToko.showModal();

      // Handle saat tombol Simpan ditekan
      document.getElementById('formEditTokoContent').onsubmit = (e) => {
        e.preventDefault();
        if (typeof CONFIG !== 'undefined') {
          CONFIG.wa = document.getElementById('inputWa').value;
          CONFIG.alamat = document.getElementById('inputAlamat').value;
          CONFIG.petaEmbedUrl = document.getElementById('inputMaps').value;

          if (typeof $$!== 'undefined') {$$('[data-fill]').forEach(el => { el.textContent = CONFIG[el.dataset.fill]; });
          }
          if (typeof petaFrame !== 'undefined' && petaFrame) {
            petaFrame.src = CONFIG.petaEmbedUrl;
          }
        }

        const fileInput = document.getElementById('inputFotoTokoFile');
        const imgTokoEl = document.querySelector('img[data-ph*="Tampak depan"]');

        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64FotoToko = event.target.result;
            if (imgTokoEl) imgTokoEl.src = base64FotoToko;

            const dataToSave = {
              wa: typeof CONFIG !== 'undefined' ? CONFIG.wa : '',
              alamat: typeof CONFIG !== 'undefined' ? CONFIG.alamat : '',
              petaEmbedUrl: typeof CONFIG !== 'undefined' ? CONFIG.petaEmbedUrl : '',
              fotoToko: base64FotoToko
            };
            localStorage.setItem('CONFIG_TOKO', JSON.stringify(dataToSave));

            modalToko.close();
            alert('Informasi toko dan foto berhasil diperbarui secara permanen!');
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          const existingData = JSON.parse(localStorage.getItem('CONFIG_TOKO') || '{}');
          const dataToSave = {
            wa: typeof CONFIG !== 'undefined' ? CONFIG.wa : '',
            alamat: typeof CONFIG !== 'undefined' ? CONFIG.alamat : '',
            petaEmbedUrl: typeof CONFIG !== 'undefined' ? CONFIG.petaEmbedUrl : '',
            fotoToko: existingData.fotoToko || (imgTokoEl ? imgTokoEl.src : '')
          };
          localStorage.setItem('CONFIG_TOKO', JSON.stringify(dataToSave));

          modalToko.close();
          alert('Informasi toko berhasil diperbarui!');
        }
      };
    };
  }
});

  // Tambah Tombol Edit Video di dekat elemen video promo
  const vContainer = document.getElementById('videoContainer');
  if (vContainer && !document.getElementById('btnEditVideoTrigger')) {
    const btnVid = document.createElement('button');
    btnVid.id = 'btnEditVideoTrigger';
    btnVid.type = 'button';
    btnVid.className = 'absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-md inline-flex items-center gap-1 transition z-20';
    btnVid.innerHTML = '✎ Edit Video';
    vContainer.style.position = 'relative';
    vContainer.appendChild(btnVid);

    btnVid.onclick = (e) => {
      e.stopPropagation();
      pastikanModalTokoAda();
      const modalVid = document.getElementById('modalEditVideo');
      modalVid.showModal();

      document.getElementById('formEditVideoContent').onsubmit = (ev) => {
        ev.preventDefault();
        const fInput = document.getElementById('inputVideoFile');
        if (fInput.files && fInput.files[0]) {
          const blobUrl = URL.createObjectURL(fInput.files[0]);
          if (video) {
            video.src = blobUrl;
            video.load();
            video.play();
          }
          alert('Video promo berhasil diperbarui!');
        }
        modalVid.close();
      };
    };
  };
/* =====================================================================
   SISTEM ADMIN RAHASIA (BERSIH, RINGAN, & TIDAK BIKIN FITUR LAIN BUG)
   ===================================================================== */
let isAdminMode = false;
const ADMIN_PASSWORD = "admin123"; // Ganti password sesuai keinginan lu

// Fungsi untuk membuat Banner Indikator di Atas Website
function buatBannerAdmin() {
  if (document.getElementById('adminBannerBar')) return;
  
  const banner = document.createElement('div');
  banner.id = 'adminBannerBar';
  banner.className = 'bg-blue-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 flex justify-between items-center sticky top-0 z-50 shadow-md transition-all';
  banner.innerHTML = `
    <span>⚠️ ANDA SEDANG BERADA DALAM MODE ADMIN (FITUR EDIT AKTIF)</span>
    <button type="button" id="keluarAdminBtn" class="bg-white text-blue-600 px-3 py-1 rounded-lg font-extrabold hover:bg-gray-100 transition">Keluar Mode Admin</button>
  `;
  document.body.prepend(banner);

  document.getElementById('keluarAdminBtn').onclick = () => {
    isAdminMode = false;
    banner.remove();
    document.body.classList.remove('admin-active');
    aturTampilanTombolEdit();
    alert('Berhasil keluar dari mode admin. Website kembali ke mode normal.');
  };
}

// Fungsi untuk menampilkan/menyembunyikan tombol edit
function aturTampilanTombolEdit() {
  const semuaTombol = document.querySelectorAll('[data-edit-img], #btnEditTokoTrigger, #btnEditVideoTrigger, #btnEditFotoTokoTrigger');
  semuaTombol.forEach(el => {
    el.style.display = isAdminMode ? 'inline-flex' : 'none';
  });
}

/* =====================================================================
   PEMICU MODE ADMIN UNTUK HP & LAPTOP
   ===================================================================== */

// 1. Shortcut Keyboard untuk Laptop (Ctrl + Shift + X)
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
    e.preventDefault();
    aktifkanAdmin();
  }
});

// 2. Ketuk Logo 5 Kali Berturut-turut (Khusus untuk HP)
let hitunganKetuk = 0;
let timerKetuk = null;

document.addEventListener('DOMContentLoaded', () => {
  // Cari logo di header (bisa disesuaikan dengan elemen logo lu)
  const logoToko = document.querySelector('header img, header h1'); 
  if (logoToko) {
    logoToko.addEventListener('click', () => {
      hitunganKetuk++;
      clearTimeout(timerKetuk);
      
      if (hitunganKetuk === 5) {
        hitunganKetuk = 0;
        aktifkanAdmin();
      } else {
        timerKetuk = setTimeout(() => {
          hitunganKetuk = 0;
        }, 1000); // Reset hitungan jika jeda lebih dari 1 detik
      }
    });
  }
});

// Fungsi Utama Masuk Mode Admin
function aktifkanAdmin() {
  if (isAdminMode) {
    alert('Anda sudah berada dalam mode admin!');
    return;
  }

  const passInput = prompt("Masukkan Password Admin:");
  if (passInput === ADMIN_PASSWORD) {
    isAdminMode = true;
    document.body.classList.add('admin-active');
    buatBannerAdmin();
    aturTampilanTombolEdit();
    alert('Berhasil masuk mode admin!');
  } else if (passInput !== null) {
    alert('Password salah!');
  }
}

// Sisipkan pemanggilan aturTampilanTombolEdit() ke dalam fungsi render() asli website lu
const originalRenderFunc = window.render;
if (typeof originalRenderFunc === 'function') {
  window.render = function() {
    originalRenderFunc();
    aturTampilanTombolEdit();
  };
}

// Sembunyikan tombol saat pertama kali load
document.addEventListener('DOMContentLoaded', () => {
  aturTampilanTombolEdit();
});