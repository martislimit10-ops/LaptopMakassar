/* =====================================================================
   LAPTOP MAKASSAR - PANEL ADMIN
   Login: Supabase Auth. Data: tabel produk, config, video.
   File: Supabase Storage (bucket publik "media").
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rupiah = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const KATEGORI = [
  { id: 'gaming', label: 'Laptop Gaming' },
  { id: 'macbook', label: 'MacBook' },
  { id: 'vivobook', label: 'Asus Vivobook' },
  { id: 'celeron', label: 'Celeron / Daily' },
  { id: 'lenovo', label: 'Lenovo' },
  { id: 'hpdell', label: 'HP & Dell' }
];
const LABEL_TAG = { promo: 'Promo', baru: 'Baru masuk', terlaris: 'Terlaris' };
const MAKS_VIDEO = 50 * 1024 * 1024;

let daftar = [];          // produk dari database
let configRow = null;     // baris tabel config
let videoRow = null;      // baris tabel video
let sedangEditId = null;  // null = tambah baru
let fotoLamaEdit = '';    // URL foto produk sebelum diedit

/* ---------- Util ---------- */
function toast(pesan) {
  const t = $('#toast');
  t.querySelector('p').textContent = pesan;
  t.classList.remove('hidden'); t.classList.add('flex');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.classList.add('hidden'); t.classList.remove('flex'); }, 3200);
}
function tampilError(el, pesan) {
  el.textContent = pesan;
  el.classList.toggle('hidden', !pesan);
}
function pesanError(err) {
  const m = (err && err.message) || String(err);
  if (/row-level security|permission|JWT|not authorized|Unauthorized/i.test(m)) return 'Sesi admin tidak valid atau sudah habis. Keluar lalu masuk lagi.';
  if (/Failed to fetch|NetworkError|network/i.test(m)) return 'Koneksi internet bermasalah. Coba lagi.';
  return m;
}
function sibuk(btn, aktif, teks) {
  if (aktif) { btn.dataset.teks = btn.textContent; btn.textContent = teks; btn.disabled = true; }
  else { btn.textContent = btn.dataset.teks || btn.textContent; btn.disabled = false; }
}

/* ---------- Storage ---------- */
const pathDariUrl = url => {
  const bagian = String(url || '').split(`/object/public/${STORAGE_BUCKET}/`);
  return bagian.length === 2 ? decodeURIComponent(bagian[1].split('?')[0]) : null;
};
async function hapusFile(url) {
  const path = pathDariUrl(url);
  if (path) { try { await sb.storage.from(STORAGE_BUCKET).remove([path]); } catch (e) { /* abaikan */ } }
}
async function unggah(blob, folder, ext, type) {
  const nama = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(nama, blob, { contentType: type, cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return sb.storage.from(STORAGE_BUCKET).getPublicUrl(nama).data.publicUrl;
}
async function kompresGambar(file, maks = 1400, kualitas = 0.85) {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const skala = Math.min(1, maks / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * skala);
    c.height = Math.round(bmp.height * skala);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', kualitas));
    if (blob) return { blob, ext: 'jpg', type: 'image/jpeg' };
  } catch (e) { /* pakai file asli */ }
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  return { blob: file, ext, type: file.type || 'image/jpeg' };
}
async function unggahGambar(file, folder) {
  const { blob, ext, type } = await kompresGambar(file);
  return unggah(blob, folder, ext, type);
}
function pratinjau(inputFile, imgEl) {
  inputFile.addEventListener('change', () => {
    const f = inputFile.files && inputFile.files[0];
    if (f) { imgEl.src = URL.createObjectURL(f); imgEl.classList.remove('hidden'); }
  });
}

/* =====================================================================
   LOGIN / SESI
   ===================================================================== */
function tampilkanView(session) {
  const masuk = !!session;
  $('#viewLogin').classList.toggle('hidden', masuk);
  $('#viewPanel').classList.toggle('hidden', !masuk);
  $('#btnKeluar').classList.toggle('hidden', !masuk);
  if (masuk) setTimeout(muatSemua, 0);
}

$('#formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#loginError'); tampilError(err, '');
  const btn = $('#btnMasuk'); sibuk(btn, true, 'Memeriksa...');
  const { error } = await sb.auth.signInWithPassword({
    email: $('#loginEmail').value.trim(),
    password: $('#loginPass').value
  });
  sibuk(btn, false);
  if (error) {
    tampilError(err, /invalid/i.test(error.message) ? 'Email atau password salah.' : pesanError(error));
    return;
  }
  $('#loginPass').value = '';
});

$('#btnKeluar').addEventListener('click', async () => { await sb.auth.signOut(); });

sb.auth.getSession().then(({ data }) => tampilkanView(data.session));
sb.auth.onAuthStateChange((_event, session) => tampilkanView(session));

/* ---------- Tab ---------- */
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.setAttribute('aria-selected', String(x === t)));
  $('#tabProduk').classList.toggle('hidden', t.dataset.tab !== 'produk');
  $('#tabToko').classList.toggle('hidden', t.dataset.tab !== 'toko');
  $('#tabVideo').classList.toggle('hidden', t.dataset.tab !== 'video');
}));

/* =====================================================================
   MUAT DATA
   ===================================================================== */
async function muatSemua() {
  await Promise.all([muatProduk(), muatConfig(), muatVideo()]);
}

/* =====================================================================
   PRODUK
   ===================================================================== */
$('#pKategori').innerHTML = KATEGORI.map(k => `<option value="${k.id}">${k.label}</option>`).join('');

async function muatProduk() {
  const { data, error } = await sb.from('produk').select('*').order('id', { ascending: true });
  if (error) { toast(pesanError(error)); return; }
  daftar = data || [];
  renderProduk();
}

function renderProduk() {
  $('#jumlahProduk').textContent = `${daftar.length} produk`;
  $('#daftarProduk').innerHTML = daftar.length ? daftar.map(p => {
    const tags = (p.tags || []).filter(t => LABEL_TAG[t]).map(t => `<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold">${LABEL_TAG[t]}</span>`).join('');
    return `
    <article class="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3">
      <img src="${esc(p.foto || window.FOTO_KOSONG)}" alt="" onerror="this.onerror=null;this.src=window.FOTO_KOSONG" class="h-20 w-24 shrink-0 rounded-xl border border-gray-200 bg-gray-50 object-cover sm:h-24 sm:w-32">
      <div class="flex min-w-0 flex-1 flex-col">
        <h3 class="truncate text-sm font-bold sm:text-base">${esc(p.merek)} ${esc(p.seri)}</h3>
        <p class="mt-0.5 text-sm font-extrabold">${rupiah(p.harga)}${p.harganormal ? ` <span class="text-xs font-medium text-gray-500 line-through">${rupiah(p.harganormal)}</span>` : ''}</p>
        <div class="mt-1 flex flex-wrap gap-1.5 text-xs text-gray-500"><span>${esc(p.kategori)}</span><span>&bull;</span><span>${esc(p.kondisi)}</span></div>
        ${tags ? `<div class="mt-1.5 flex flex-wrap gap-1.5">${tags}</div>` : ''}
        <div class="mt-auto flex gap-2 pt-3">
          <button type="button" class="btn btn-line px-3 py-1.5" data-edit="${p.id}">Edit</button>
          <button type="button" class="btn btn-danger px-3 py-1.5" data-hapus="${p.id}">Hapus</button>
        </div>
      </div>
    </article>`;
  }).join('') : `<div class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="font-bold">Belum ada produk.</p>
      <p class="mt-1 text-sm text-gray-600">Tekan "Tambah produk" untuk membuat yang pertama.</p></div>`;
}

$('#daftarProduk').addEventListener('click', async e => {
  const be = e.target.closest('[data-edit]');
  const bh = e.target.closest('[data-hapus]');
  if (be) bukaFormProduk(daftar.find(x => String(x.id) === be.dataset.edit));
  if (bh) {
    const p = daftar.find(x => String(x.id) === bh.dataset.hapus);
    if (!p || !confirm(`Hapus "${p.merek} ${p.seri}" dari katalog? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await sb.from('produk').delete().eq('id', p.id);
    if (error) { toast(pesanError(error)); return; }
    await hapusFile(p.foto);
    toast('Produk dihapus');
    muatProduk();
  }
});

const dlg = $('#dlgProduk');
$('#btnTambah').addEventListener('click', () => bukaFormProduk(null));
$('#dlgTutup').addEventListener('click', () => dlg.close());
$('#dlgBatal').addEventListener('click', () => dlg.close());
pratinjau($('#pFotoFile'), $('#pFotoPreview'));

function bukaFormProduk(p) {
  sedangEditId = p ? p.id : null;
  fotoLamaEdit = p ? (p.foto || '') : '';
  $('#dlgJudul').textContent = p ? 'Edit produk' : 'Tambah produk';
  tampilError($('#pError'), '');
  let sp = p && p.spek;
  if (typeof sp === 'string') { try { sp = JSON.parse(sp); } catch { sp = {}; } }
  sp = sp || {};
  $('#pKategori').value = p ? p.kategori : KATEGORI[0].id;
  $('#pKondisi').value = p ? p.kondisi : 'bekas';
  $('#pMerek').value = p ? p.merek : '';
  $('#pSeri').value = p ? p.seri : '';
  $('#pHarga').value = p ? p.harga : '';
  $('#pHargaNormal').value = p && p.harganormal ? p.harganormal : '';
  $$('input[name="pTag"]').forEach(c => { c.checked = !!(p && (p.tags || []).includes(c.value)); });
  $('#sProcessor').value = sp.processor || '';
  $('#sRam').value = sp.ram || '';
  $('#sStorage').value = sp.storage || '';
  $('#sVga').value = sp.vga || '';
  $('#sLayar').value = sp.layar || '';
  $('#pFotoFile').value = '';
  $('#pFotoPreview').src = fotoLamaEdit || window.FOTO_KOSONG;
  dlg.showModal();
}

$('#formProduk').addEventListener('submit', async e => {
  e.preventDefault();
  const err = $('#pError'); tampilError(err, '');
  const btn = $('#btnSimpanProduk');
  sibuk(btn, true, 'Menyimpan...');
  try {
    let foto = fotoLamaEdit;
    const file = $('#pFotoFile').files[0];
    if (file) foto = await unggahGambar(file, 'produk');

    const harga = Math.round(Number($('#pHarga').value));
    if (!Number.isFinite(harga) || harga < 0) throw new Error('Harga tidak valid.');
    const hn = $('#pHargaNormal').value === '' ? null : Math.round(Number($('#pHargaNormal').value));

    const payload = {
      kategori: $('#pKategori').value,
      merek: $('#pMerek').value.trim(),
      seri: $('#pSeri').value.trim(),
      harga,
      harganormal: hn,
      tags: $$('input[name="pTag"]').filter(c => c.checked).map(c => c.value),
      kondisi: $('#pKondisi').value,
      foto: foto || null,
      spek: {
        processor: $('#sProcessor').value.trim(),
        ram: $('#sRam').value.trim(),
        storage: $('#sStorage').value.trim(),
        vga: $('#sVga').value.trim(),
        layar: $('#sLayar').value.trim()
      }
    };

    const q = sedangEditId === null
      ? sb.from('produk').insert(payload)
      : sb.from('produk').update(payload).eq('id', sedangEditId);
    const { error } = await q;
    if (error) {
      if (file) await hapusFile(foto); // batalkan unggahan yatim
      throw error;
    }
    if (file && fotoLamaEdit) await hapusFile(fotoLamaEdit);

    dlg.close();
    toast(sedangEditId === null ? 'Produk ditambahkan' : 'Produk diperbarui');
    muatProduk();
  } catch (ex) {
    tampilError(err, pesanError(ex));
  } finally {
    sibuk(btn, false);
  }
});

/* =====================================================================
   INFO TOKO
   ===================================================================== */
pratinjau($('#tFotoFile'), $('#tFotoPreview'));

async function muatConfig() {
  const { data, error } = await sb.from('config').select('*').order('id', { ascending: true }).limit(1);
  if (error) { toast(pesanError(error)); return; }
  configRow = (data && data[0]) || null;
  const c = configRow || {};
  $('#tWa').value = c.wa || '';
  $('#tAlamat').value = c.alamat || '';
  $('#tJam').value = c.jam || '';
  $('#tIg').value = c.instagram || '';
  $('#tPesan').value = c.pesan_umum || '';
  $('#tMapsLink').value = c.maps_link || '';
  $('#tPeta').value = c.peta_embed_url || '';
  $('#tFotoFile').value = '';
  if (c.foto_toko) { $('#tFotoPreview').src = c.foto_toko; $('#tFotoPreview').classList.remove('hidden'); }
  else $('#tFotoPreview').classList.add('hidden');
}

function normalWa(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
}
function ambilSrcEmbed(v) {
  const m = String(v || '').match(/src\s*=\s*["']([^"']+)["']/i);
  return (m ? m[1] : String(v || '')).trim();
}

$('#formToko').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#btnSimpanToko'); sibuk(btn, true, 'Menyimpan...');
  try {
    let fotoToko = configRow ? (configRow.foto_toko || null) : null;
    const file = $('#tFotoFile').files[0];
    const fotoLama = fotoToko;
    if (file) fotoToko = await unggahGambar(file, 'toko');

    const payload = {
      wa: normalWa($('#tWa').value),
      alamat: $('#tAlamat').value.trim(),
      jam: $('#tJam').value.trim(),
      instagram: $('#tIg').value.trim().replace(/^@/, ''),
      pesan_umum: $('#tPesan').value.trim(),
      maps_link: $('#tMapsLink').value.trim(),
      peta_embed_url: ambilSrcEmbed($('#tPeta').value),
      foto_toko: fotoToko
    };
    if (!payload.wa) throw new Error('Nomor WhatsApp wajib diisi.');

    const q = configRow
      ? sb.from('config').update(payload).eq('id', configRow.id)
      : sb.from('config').insert(payload);
    const { error } = await q;
    if (error) { if (file) await hapusFile(fotoToko); throw error; }
    if (file && fotoLama) await hapusFile(fotoLama);
    toast('Info toko disimpan');
    await muatConfig();
  } catch (ex) {
    toast(pesanError(ex));
  } finally {
    sibuk(btn, false);
  }
});

/* =====================================================================
   VIDEO
   ===================================================================== */
async function muatVideo() {
  const { data, error } = await sb.from('video').select('*').order('created_at', { ascending: false }).limit(1);
  if (error) { toast(pesanError(error)); return; }
  videoRow = (data && data[0]) || null;
  const v = $('#vPreview');
  if (videoRow && videoRow.url_video) {
    v.src = videoRow.url_video; v.classList.remove('hidden'); $('#vKosong').classList.add('hidden');
    $('#vUrl').value = /supabase\.co\/storage/.test(videoRow.url_video) ? '' : videoRow.url_video;
  } else {
    v.removeAttribute('src'); v.classList.add('hidden'); $('#vKosong').classList.remove('hidden');
  }
  $('#vFile').value = '';
}

$('#formVideo').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#btnSimpanVideo');
  const file = $('#vFile').files[0];
  const urlManual = $('#vUrl').value.trim();
  if (!file && !urlManual) { toast('Pilih file video atau isi link video.'); return; }
  if (file && file.size > MAKS_VIDEO) { toast('Ukuran video melebihi 50 MB.'); return; }
  if (!file && !/^https:\/\//i.test(urlManual)) { toast('Link video harus diawali https://'); return; }

  sibuk(btn, true, file ? 'Mengunggah video...' : 'Menyimpan...');
  try {
    let url = urlManual;
    if (file) {
      const ext = (file.name.split('.').pop() || 'mp4').toLowerCase();
      url = await unggah(file, 'video', ext, file.type || 'video/mp4');
    }
    const lama = videoRow && videoRow.url_video;
    const q = videoRow
      ? sb.from('video').update({ url_video: url }).eq('id', videoRow.id)
      : sb.from('video').insert({ url_video: url });
    const { error } = await q;
    if (error) { if (file) await hapusFile(url); throw error; }
    if (lama && lama !== url) await hapusFile(lama);
    toast('Video disimpan');
    await muatVideo();
  } catch (ex) {
    toast(pesanError(ex));
  } finally {
    sibuk(btn, false);
  }
});
