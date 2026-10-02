const SUPABASE_URL      = 'https://yoafuzhmyhchochqkrpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYWZ1emhteWhjaG9jaHFrcnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjI5MjQsImV4cCI6MjEwNjIzODkyNH0.-oT62ybhKl04uBMIgc2EFD4p_bvdsC3aUB7sp0KWboc';

const BUCKET = 'media'; // bucket Storage publik untuk semua foto & video

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Gambar pengganti jika foto gagal dimuat */
window.FOTO_KOSONG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#eceef1"/>' +
  '<g fill="none" stroke="#9aa1ab" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="130" y="95" width="140" height="95" rx="8"/><path d="M110 210h180"/></g></svg>');

/* Nilai awal info toko (dipakai bila tabel config masih kosong) */
const CONFIG_AWAL = {
  wa: '6285117822767',
  alamat: 'Jl. Sepakat, Tamarunang, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan 92112',
  jam: 'Senin - Minggu: 09.00 - 11.00 WITA',
  instagram: 'laptop_makassar',
  tiktok: 'laptop_makassar',
  email: 'ibnrfy01@gmail.com',
  maps_link: 'https://maps.app.goo.gl/CrUqGD1NqXt19Kpy9',
  peta_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8058219468516!2d119.4925!3d-5.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDgnMQuMSJTIDExOWKwDI5JzMzLjAiRQ!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid',
  pesan_umum: 'Assalamualaikum, Laptop Makassar',
  deskripsi: 'Toko laptop baru dan bekas berkualitas di Makassar dan Gowa. Semua unit sudah dicek, bergaransi, dan harganya jujur.'
};

/* Kategori, label, dan kondisi produk (id harus sama dengan isi kolom produk.kategori) */
const KATEGORI = [
  { id: 'gaming',   label: 'Laptop Gaming' },
  { id: 'macbook',  label: 'MacBook' },
  { id: 'vivobook', label: 'Asus Vivobook' },
  { id: 'celeron',  label: 'Celeron / Daily' },
  { id: 'lenovo',   label: 'Lenovo' },
  { id: 'hpdell',   label: 'HP & Dell' }
];
const LABEL_TAG = { promo: 'Promo', baru: 'Baru masuk', terlaris: 'Terlaris' };
const KONDISI = {
  bekas: { label: 'Bekas, mulus', detail: 'Sudah dicek semua fungsi: layar, keyboard, port, baterai, dan wifi. Tidak ada minus yang mengganggu pemakaian.', kelengkapan: 'Charger dan dus laptop', garansi: 'Garansi toko 1 bulan' },
  baru:  { label: 'Baru, segel',  detail: 'Unit baru dari distributor dan belum pernah dipakai.', kelengkapan: 'Charger original, dus, dan buku panduan', garansi: 'Garansi toko 1 tahun' }
};

/* Pembantu umum */
const $  = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rupiah = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(n) || 0);
const namaLengkap = p => `${p.merek || ''} ${p.seri || ''}`.trim();
