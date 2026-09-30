/* =====================================================================
   KONFIGURASI SUPABASE (dipakai index.html & admin.html)
   Anon key memang aman untuk publik. Keamanan data dijaga oleh RLS.
   JANGAN pernah menaruh service_role key di file ini.
   ===================================================================== */
const SUPABASE_URL = 'https://yoafuzhmyhchochqkrpu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYWZ1emhteWhjaG9jaHFrcnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjI5MjQsImV4cCI6MjEwNjIzODkyNH0.-oT62ybhKl04uBMIgc2EFD4p_bvdsC3aUB7sp0KWboc';
const STORAGE_BUCKET = 'media';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Placeholder jika foto gagal dimuat (menggantikan ikon gambar rusak) */
window.FOTO_KOSONG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F3F4F6"/>' +
  '<g fill="none" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="140" y="105" width="120" height="80" rx="8"/><path d="M120 205h160"/></g></svg>'
);
