/* =====================================================================
   LAPTOP MAKASSAR - PANEL ADMIN
   Butuh: supabase-js -> supabase-config.js -> admin.js
   Tab: Bento Grid (7 kotak + banner bawah), Info & Kontak, Produk.
   Sekali klik "Simpan" -> data masuk Supabase -> halaman depan
   terbarui otomatis (realtime), tanpa mengubah file di GitHub.
   ===================================================================== */

const BATAS_MB = 50;            // batas file Supabase Storage (paket gratis)
let sudahMuat = false;

/* ---------- Pembantu ---------- */
let timerToast;
function toast(teks) {
  const t = $('#toast'); t.textContent = teks; t.classList.add('tampil');
  clearTimeout(timerToast); timerToast = setTimeout(() => t.classList.remove('tampil'), 2600);
}
const pesanGalat = e => (e && (e.message || e.error_description)) || 'Terjadi kesalahan';
function setPesan(el, teks, galat = false) {
  el.textContent = teks || ''; el.classList.toggle('galat', !!galat); if (el.hasAttribute('hidden') || el.id.startsWith('pesanProduk')) el.hidden = !teks;
}
const penanda = `/storage/v1/object/public/${BUCKET}/`;
function pathStorage(url) {
  const i = String(url || '').indexOf(penanda);
  return i < 0 ? null : decodeURIComponent(url.slice(i + penanda.length).split('?')[0]);
}
async function hapusFileStorage(url) {
  const p = pathStorage(url);
  if (p) { try { await sb.storage.from(BUCKET).remove([p]); } catch (e) { console.warn('Gagal hapus file lama:', e); } }
}
function kompres(file, maks = 1920, kualitas = 0.85) {
  return new Promise((ok, gagal) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, maks / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => { URL.revokeObjectURL(u); b ? ok(b) : gagal(new Error('Gagal memproses gambar')); }, 'image/jpeg', kualitas);
    };
    img.onerror = () => { URL.revokeObjectURL(u); gagal(new Error('Gambar tidak bisa dibaca')); };
    img.src = u;
  });
}
async function unggah(file, folder) {
  let blob = file, ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  if (file.type.startsWith('image/') && !/gif|svg/.test(file.type)) { blob = await kompres(file); ext = 'jpg'; }
  if (blob.size > BATAS_MB * 1024 * 1024) throw new Error(`"${file.name}" lebih dari ${BATAS_MB} MB`);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { cacheControl: '31536000', upsert: false, contentType: blob.type || file.type });
  if (error) throw error;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/* ---------- Login / sesi ---------- */
function tampilkan(session) {
  const masuk = !!session;
  $('#viewLogin').hidden = masuk; $('#viewPanel').hidden = !masuk;
  if (masuk && !sudahMuat) { sudahMuat = true; muatSemuaTab(); }
  if (!masuk) sudahMuat = false;
}
$('#formLogin').addEventListener('submit', async e => {
  e.preventDefault();
  const b = $('#btnMasuk'), p = $('#loginPesan'); b.disabled = true; p.hidden = true;
  const { error } = await sb.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#sandi').value });
  b.disabled = false;
  if (error) { p.textContent = 'Email atau kata sandi salah.'; p.hidden = false; }
  else $('#sandi').value = '';
});
$('#btnKeluar').addEventListener('click', () => sb.auth.signOut());

/* ---------- Tab ---------- */
const tabs = $$('[role="tab"]');
function pilihTab(nama, fokus = false) {
  tabs.forEach(t => {
    const aktif = t.dataset.tab === nama;
    t.setAttribute('aria-selected', String(aktif)); t.tabIndex = aktif ? 0 : -1;
    $('#' + t.getAttribute('aria-controls')).hidden = !aktif;
    if (aktif && fokus) t.focus();
  });
  try { history.replaceState(null, '', '#' + nama); } catch (e) {}
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => pilihTab(t.dataset.tab));
  t.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
    e.preventDefault(); pilihTab(tabs[(i + k + tabs.length) % tabs.length].dataset.tab, true);
  });
});

/* =====================================================================
   BENTO GRID BERANDA (tabel home_banners, satu baris per kotak)
   Perubahan ditampung dulu, baru dikirim saat klik "Simpan".
   ===================================================================== */
const SLOT_BENTO = [
  { id: 'k1',    nama: 'Kotak 1 - Banner utama atas',        info: 'Lebar penuh',                  saran: '1600 × 336 px (rasio 4,8 : 1)' },
  { id: 'k2',    nama: 'Kotak 2 - Gambar sedang (kiri)',     info: 'Sejajar dengan kotak 3',       saran: '1200 × 510 px (rasio 2,4 : 1)' },
  { id: 'k3',    nama: 'Kotak 3 - Gambar sedang (kanan)',    info: 'Sejajar dengan kotak 2',       saran: '1200 × 510 px (rasio 2,4 : 1)' },
  { id: 'k4',    nama: 'Kotak 4 - Banner di bawah area sedang', info: 'Banner lebar',              saran: '1600 × 506 px (rasio 3,2 : 1)' },
  { id: 'k5',    nama: 'Kotak 5 - Gambar sedang (tegak)',    info: 'Di samping kotak 4, 6, 7',     saran: '800 × 1053 px (rasio 3 : 4)' },
  { id: 'k6',    nama: 'Kotak 6 - Gambar kecil (kiri)',      info: 'Sejajar dengan kotak 7',       saran: '800 × 514 px (rasio 1,6 : 1)' },
  { id: 'k7',    nama: 'Kotak 7 - Gambar kecil (kanan)',     info: 'Sejajar dengan kotak 6',       saran: '800 × 514 px (rasio 1,6 : 1)' },
  { id: 'bawah', nama: 'Banner bawah',                       info: 'Lebar penuh, di bawah Bento',  saran: '1600 × 336 px (rasio 4,8 : 1)' }
];

/* Link: kosong = tidak bisa diklik. "wa.me/628..." otomatis diberi https:// */
function rapikanLink(v) {
  v = String(v || '').trim();
  if (!v) return { ok: true, v: null };
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v)) return { ok: true, v };
  if (/^[^\s/]+\.[^\s]+$/.test(v)) return { ok: true, v: 'https://' + v };
  return { ok: false, v };
}

function buatManajerBento(root) {
  let st = {};
  let sibuk = false;

  root.innerHTML = `
    <div class="bagian-kepala"><div><h2>Bento Grid &quot;Kunjungi toko kami&quot;</h2><p class="muted" data-hitung></p></div></div>
    <p class="aturan">Setiap kotak = 1 gambar + 1 link (opsional). Gambar ditampilkan bersih tanpa teks tambahan. Di HP, gambar yang sangat lebar (banner) terpotong sedikit di kiri-kanan, jadi taruh bagian penting di tengah. Perubahan baru dikirim setelah menekan Simpan.</p>
    <div class="bento-adm" data-daftar></div>
    <div class="bar-simpan"><button type="button" class="btn" data-simpan>Simpan</button><span class="pesan" data-pesan role="status"></span></div>`;
  const elDaftar = $('[data-daftar]', root), elHitung = $('[data-hitung]', root), elPesan = $('[data-pesan]', root), btnSimpan = $('[data-simpan]', root);

  const kosongkan = () => { st = {}; SLOT_BENTO.forEach(s => { st[s.id] = { url: '', link: '', linkAwal: '', file: null, preview: null, hapus: false }; }); };
  kosongkan();

  function gambar() {
    const terisi = SLOT_BENTO.filter(s => { const x = st[s.id]; return x.file || (x.url && !x.hapus); }).length;
    elHitung.textContent = `${terisi} dari ${SLOT_BENTO.length} kotak sudah berisi gambar`;
    elDaftar.innerHTML = SLOT_BENTO.map(s => {
      const x = st[s.id];
      const tampil = x.preview || (x.hapus ? '' : x.url);
      const aksiHapus = x.file ? 'Batalkan file baru' : x.hapus ? 'Batalkan hapus' : 'Hapus gambar';
      return `
      <div class="slot ${x.file ? 'baru' : ''} ${x.hapus ? 'hapus' : ''}" data-slot="${s.id}">
        <div class="slot-thumb">${tampil ? `<img src="${esc(tampil)}" alt="" onerror="this.onerror=null;this.src=window.FOTO_KOSONG">` : '<span class="muted">Belum ada gambar</span>'}</div>
        <div class="slot-isi">
          <b>${esc(s.nama)}</b>
          <small>${esc(s.info)}. Saran ukuran: ${esc(s.saran)}</small>
          <div class="media-baris">
            ${x.file ? '<span class="tag tag-baru">Baru, belum disimpan</span>' : ''}
            ${x.hapus ? '<span class="tag tag-baru">Akan dihapus</span>' : ''}
          </div>
          <label for="bf-${s.id}">${x.url || x.file ? 'Ganti gambar' : 'Unggah gambar'}</label>
          <input id="bf-${s.id}" type="file" accept="image/*" data-aksi="file">
          <label for="bl-${s.id}">Link tujuan (opsional)</label>
          <input id="bl-${s.id}" type="text" inputmode="url" data-f="link" placeholder="https://..." value="${esc(x.link)}" autocomplete="off">
          <div class="media-baris"><button type="button" class="btn btn-bahaya btn-kecil" data-aksi="hapus" ${!x.url && !x.file ? 'disabled' : ''}>${aksiHapus}</button></div>
        </div>
      </div>`;
    }).join('');
  }

  elDaftar.addEventListener('input', e => {
    const k = e.target.closest('[data-slot]'); if (!k || e.target.dataset.f !== 'link') return;
    st[k.dataset.slot].link = e.target.value;
  });
  elDaftar.addEventListener('change', e => {
    const k = e.target.closest('[data-slot]'); if (!k || e.target.dataset.aksi !== 'file') return;
    const x = st[k.dataset.slot], f = e.target.files[0]; if (!f) return;
    if (!f.type.startsWith('image/')) { e.target.value = ''; return toast(`"${f.name}" bukan gambar`); }
    if (f.size > BATAS_MB * 1024 * 1024) { e.target.value = ''; return toast(`"${f.name}" lebih dari ${BATAS_MB} MB`); }
    if (x.preview) URL.revokeObjectURL(x.preview);
    x.file = f; x.preview = URL.createObjectURL(f); x.hapus = false;
    setPesan(elPesan, ''); gambar();
  });
  elDaftar.addEventListener('click', e => {
    const b = e.target.closest('[data-aksi="hapus"]'), k = e.target.closest('[data-slot]'); if (!b || !k) return;
    const x = st[k.dataset.slot];
    if (x.file) { URL.revokeObjectURL(x.preview); x.file = x.preview = null; }
    else x.hapus = !x.hapus;
    gambar();
  });

  async function muat() {
    const { data, error } = await sb.from('home_banners').select('*');
    if (error) { elDaftar.innerHTML = `<div class="kosong">Gagal memuat: ${esc(pesanGalat(error))}. Pastikan schema.sql sudah dijalankan.</div>`; return; }
    Object.values(st).forEach(x => { if (x.preview) URL.revokeObjectURL(x.preview); });
    kosongkan();
    (data || []).forEach(r => { if (st[r.slot]) Object.assign(st[r.slot], { url: r.image_url || '', link: r.link_url || '', linkAwal: r.link_url || '' }); });
    gambar();
  }

  btnSimpan.addEventListener('click', async () => {
    if (sibuk) return;
    /* validasi semua link dulu, sebelum mengunggah apa pun */
    const baris = [];
    for (const s of SLOT_BENTO) {
      const x = st[s.id], l = rapikanLink(x.link);
      if (!l.ok) return setPesan(elPesan, `Link "${s.nama}" tidak valid. Awali dengan https://`, true);
      if (x.file || x.hapus || (l.v || '') !== (x.linkAwal || '')) baris.push({ s, x, link: l.v });
    }
    if (!baris.length) return setPesan(elPesan, 'Tidak ada perubahan untuk disimpan.');
    sibuk = true; btnSimpan.disabled = true; setPesan(elPesan, 'Menyimpan...');
    const baru = [], lama = [], rows = [];
    try {
      for (const { s, x, link } of baris) {
        let image_url = x.url || null;
        if (x.file) {
          setPesan(elPesan, `Mengunggah ${s.nama}...`);
          image_url = await unggah(x.file, 'bento'); baru.push(image_url);
          if (x.url) lama.push(x.url);
        } else if (x.hapus) { image_url = null; if (x.url) lama.push(x.url); }
        rows.push({ slot: s.id, image_url, link_url: link, updated_at: new Date().toISOString() });
      }
      const { error } = await sb.from('home_banners').upsert(rows, { onConflict: 'slot' });
      if (error) throw error;
      for (const u of lama) await hapusFileStorage(u);
      await muat();
      setPesan(elPesan, 'Tersimpan. Tampilan website terbarui otomatis.'); toast('Tersimpan');
    } catch (e) {
      console.error(e);
      for (const u of baru) await hapusFileStorage(u);   // batalkan unggahan yatim
      setPesan(elPesan, 'Gagal menyimpan: ' + pesanGalat(e), true);
    } finally { sibuk = false; btnSimpan.disabled = false; }
  });

  return { muat };
}

/* =====================================================================
   INFO & KONTAK TOKO (tabel config, satu baris)
   ===================================================================== */
const formInfo = $('#formInfo');
let idConfig = null;
async function muatInfo() {
  const { data, error } = await sb.from('config').select('*').order('id', { ascending: true }).limit(1);
  if (error) { setPesan($('#pesanInfo'), 'Gagal memuat: ' + pesanGalat(error), true); return; }
  const c = (data && data[0]) || null; idConfig = c ? c.id : null;
  [...formInfo.elements].forEach(el => {
    if (!el.name) return;
    el.value = (c && c[el.name]) ?? CONFIG_AWAL[el.name] ?? '';
  });
}
formInfo.addEventListener('submit', async e => {
  e.preventDefault();
  const b = $('#btnSimpanInfo'), p = $('#pesanInfo'); b.disabled = true; setPesan(p, 'Menyimpan...');
  const isi = {};
  [...formInfo.elements].forEach(el => { if (el.name) isi[el.name] = el.value.trim(); });
  isi.wa = isi.wa.replace(/\D/g, '').replace(/^0/, '62');
  isi.instagram = isi.instagram.replace(/^@/, ''); isi.tiktok = isi.tiktok.replace(/^@/, '');
  if (!isi.wa) { b.disabled = false; return setPesan(p, 'Nomor WhatsApp wajib diisi.', true); }
  const q = idConfig ? sb.from('config').update(isi).eq('id', idConfig) : sb.from('config').insert(isi);
  const { error } = await q;
  b.disabled = false;
  if (error) { setPesan(p, 'Gagal menyimpan: ' + pesanGalat(error), true); return; }
  setPesan(p, 'Tersimpan. Sidebar, footer, dan tombol Contact terbarui otomatis.'); toast('Tersimpan');
  if (!idConfig) muatInfo();
});

/* =====================================================================
   PRODUK
   ===================================================================== */
let produkList = [];
const dlgProduk = $('#dlgProduk'), formProduk = $('#formProduk');
let editId = null, fotoLama = '';
$('#p-kategori').innerHTML = KATEGORI.map(k => `<option value="${k.id}">${esc(k.label)}</option>`).join('');
$('#p-tags').innerHTML = Object.entries(LABEL_TAG).map(([id, t]) => `<label><input type="checkbox" value="${id}"> ${esc(t)}</label>`).join('');
dlgProduk.addEventListener('click', e => { if (e.target === dlgProduk) dlgProduk.close(); });
$$('[data-tutup]', dlgProduk).forEach(b => b.addEventListener('click', () => dlgProduk.close()));

async function muatProduk() {
  let r = await sb.from('produk').select('*').order('created_at', { ascending: false });
  if (r.error) r = await sb.from('produk').select('*').order('id', { ascending: false });
  const el = $('#daftarProduk');
  if (r.error) { el.innerHTML = `<div class="kosong">Gagal memuat produk: ${esc(pesanGalat(r.error))}</div>`; return; }
  produkList = r.data || [];
  el.innerHTML = produkList.length ? produkList.map(p => {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return `<div class="prod" data-id="${esc(p.id)}">
      <img src="${esc(p.foto || window.FOTO_KOSONG)}" alt="" onerror="this.onerror=null;this.src=window.FOTO_KOSONG">
      <div><b>${esc(namaLengkap(p))}</b><span class="muted">${rupiah(p.harga)} &middot; ${esc((KATEGORI.find(k => k.id === p.kategori) || {}).label || p.kategori || '-')}${tags.length ? ' &middot; ' + tags.map(t => esc(LABEL_TAG[t] || t)).join(', ') : ''}</span></div>
      <div class="prod-aksi"><button type="button" class="btn btn-garis btn-kecil" data-aksi="edit">Ubah</button><button type="button" class="btn btn-bahaya btn-kecil" data-aksi="hapus">Hapus</button></div>
    </div>`;
  }).join('') : '<div class="kosong">Belum ada produk.</div>';
}
function bukaFormProduk(p) {
  editId = p ? p.id : null; fotoLama = p ? (p.foto || '') : '';
  let sp = p ? p.spek : {}; if (typeof sp === 'string') { try { sp = JSON.parse(sp); } catch { sp = {}; } } sp = sp || {};
  const tags = p && Array.isArray(p.tags) ? p.tags : [];
  $('#dlgProdukJudul').textContent = p ? 'Ubah produk' : 'Tambah produk';
  $('#p-kategori').value = p ? p.kategori : KATEGORI[0].id;
  $('#p-kondisi').value = p && KONDISI[p.kondisi] ? p.kondisi : 'bekas';
  $('#p-merek').value = p ? p.merek || '' : ''; $('#p-seri').value = p ? p.seri || '' : '';
  $('#p-harga').value = p ? p.harga : ''; $('#p-normal').value = p && p.harganormal ? p.harganormal : '';
  $('#p-proc').value = sp.processor || ''; $('#p-ram').value = sp.ram || ''; $('#p-storage').value = sp.storage || '';
  $('#p-vga').value = sp.vga || ''; $('#p-layar').value = sp.layar || '';
  $$('#p-tags input').forEach(c => { c.checked = tags.includes(c.value); });
  $('#p-foto').value = ''; $('#p-preview').innerHTML = fotoLama ? `<img src="${esc(fotoLama)}" alt="Foto saat ini">` : '';
  setPesan($('#pesanProduk'), ''); $('#pesanProduk').hidden = true;
  dlgProduk.showModal();
}
$('#btnProdukBaru').addEventListener('click', () => bukaFormProduk(null));
$('#p-foto').addEventListener('change', e => {
  const f = e.target.files[0]; $('#p-preview').innerHTML = f ? `<img src="${URL.createObjectURL(f)}" alt="Pratinjau">` : (fotoLama ? `<img src="${esc(fotoLama)}" alt="Foto saat ini">` : '');
});
$('#daftarProduk').addEventListener('click', async e => {
  const b = e.target.closest('[data-aksi]'), row = e.target.closest('[data-id]'); if (!b || !row) return;
  const p = produkList.find(x => String(x.id) === row.dataset.id); if (!p) return;
  if (b.dataset.aksi === 'edit') return bukaFormProduk(p);
  if (!confirm(`Hapus "${namaLengkap(p)}" dari toko? Tindakan ini tidak bisa dibatalkan.`)) return;
  const { error } = await sb.from('produk').delete().eq('id', p.id);
  if (error) return toast('Gagal menghapus: ' + pesanGalat(error));
  await hapusFileStorage(p.foto); toast('Produk dihapus'); muatProduk();
});
formProduk.addEventListener('submit', async e => {
  e.preventDefault();
  const b = $('#btnSimpanProduk'), pesan = $('#pesanProduk'); b.disabled = true; pesan.hidden = true;
  try {
    const file = $('#p-foto').files[0];
    let foto = fotoLama;
    if (file) { if (!file.type.startsWith('image/')) throw new Error('File foto harus berupa gambar'); foto = await unggah(file, 'produk'); }
    const normal = Number($('#p-normal').value) || null;
    const harga = Number($('#p-harga').value) || 0;
    const isi = {
      kategori: $('#p-kategori').value, kondisi: $('#p-kondisi').value,
      merek: $('#p-merek').value.trim(), seri: $('#p-seri').value.trim(),
      harga, harganormal: normal && normal > harga ? normal : null,
      tags: $$('#p-tags input:checked').map(c => c.value), foto,
      spek: { processor: $('#p-proc').value.trim(), ram: $('#p-ram').value.trim(), storage: $('#p-storage').value.trim(), vga: $('#p-vga').value.trim(), layar: $('#p-layar').value.trim() }
    };
    const { error } = editId !== null ? await sb.from('produk').update(isi).eq('id', editId) : await sb.from('produk').insert(isi);
    if (error) { if (file && foto !== fotoLama) await hapusFileStorage(foto); throw error; }
    if (file && fotoLama && fotoLama !== foto) await hapusFileStorage(fotoLama);
    dlgProduk.close(); toast('Produk tersimpan'); muatProduk();
  } catch (err) { console.error(err); pesan.textContent = 'Gagal menyimpan: ' + pesanGalat(err); pesan.hidden = false; }
  finally { b.disabled = false; }
});

/* ---------- Mulai ---------- */
const manajerBento = buatManajerBento($('#pnl-bento'));
function muatSemuaTab() { manajerBento.muat(); muatInfo(); muatProduk(); }

(async function mulai() {
  const nama = location.hash.slice(1);
  if (tabs.some(t => t.dataset.tab === nama)) pilihTab(nama);
  const { data } = await sb.auth.getSession();
  tampilkan(data.session);
  sb.auth.onAuthStateChange((_e, session) => tampilkan(session));
})();
