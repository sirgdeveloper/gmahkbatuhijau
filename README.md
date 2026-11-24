# Website GMAHK Batu Hijau

Website resmi Gereja Masehi Advent Hari Ketujuh (GMAHK) Jemaat Batu Hijau, Maluk, Kabupaten Sumbawa Barat, Nusa Tenggara Barat.
Pendeta Jemaat: Pdtm. Grifin Sakul.

Website ini adalah situs statis (HTML, CSS, JavaScript, dan JSON). Tidak perlu server, database, atau biaya hosting: cukup diunggah ke GitHub Pages.

---

## Isi folder

| Berkas / folder | Fungsi |
|---|---|
| `index.html` | Struktur halaman. Jarang perlu diubah. |
| `data/content.json` | **Seluruh isi website** (teks, khotbah, berita, jadwal, rekening, kontak, media sosial, materi, dokumentasi, tanya jawab). Ubah di sini. |
| `css/style.css` | Tampilan (warna, ukuran, tata letak, mode gelap). |
| `js/app.js` | Logika: ayat harian, hitung mundur Sabat, filter khotbah, formulir doa, salin rekening. |
| `assets/img/` | Semua gambar: logo, foto pendeta, foto latar, dan gambar ayat harian. |
| `site.webmanifest` | Agar website bisa dipasang ke layar utama HP. |
| `robots.txt`, `404.html`, `.nojekyll` | Pengaturan mesin pencari, halaman tidak ditemukan, dan GitHub Pages. |

---

## 1. Cara publish di GitHub Pages

1. Buka github.com, lalu buat repository baru, misalnya `gmahk-batu-hijau`. Pilih **Public**.
2. Klik **Add file > Upload files**.
3. Seret **seluruh isi folder ini** (termasuk folder `assets`, `css`, `data`, `js`, dan file `.nojekyll`) ke halaman unggah, lalu klik **Commit changes**.
   - Jika unggahan gagal membawa folder, unggah per folder, atau gunakan GitHub Desktop.
4. Masuk ke **Settings > Pages**.
5. Di **Build and deployment**, pilih Source: **Deploy from a branch**, Branch: **main**, folder: **/(root)**, lalu **Save**.
6. Tunggu 1–2 menit. Alamat website akan muncul di bagian atas halaman Pages, bentuknya:
   `https://<nama-pengguna-github>.github.io/gmahk-batu-hijau/`

---

## 2. Cara mengubah isi website

Semua perubahan isi dilakukan di **`data/content.json`**. Tidak perlu mengubah kode lain.

1. Di repository GitHub, buka `data/content.json`, lalu klik ikon pensil (**Edit**).
2. Ubah teks yang diinginkan. Jangan hapus tanda kutip `"`, tanda koma `,`, atau kurung `{ }` / `[ ]`.
3. Klik **Commit changes**.
4. Tunggu 1–2 menit, lalu muat ulang halaman website.

Contoh mengganti nomor WhatsApp dan email gereja:

```json
"gereja": {
  "whatsapp": "6281234567890",
  "email": "gmahk.batuhijau@contoh.com",
  ...
}
```

Nomor WhatsApp ditulis dengan kode negara tanpa tanda `+`, spasi, atau strip. Jika kosong (`""`), tombol WhatsApp akan memberi tahu pengunjung untuk memakai email atau datang langsung.

### Daftar bagian di content.json

| Kunci | Isinya |
|---|---|
| `gereja` | Nama, lokasi, WhatsApp, email, jam respons, catatan darurat, teks footer. |
| `sosial` | Tautan Facebook, Instagram, YouTube, TikTok, Saluran WhatsApp, Spotify. Kosongkan (`""`) yang belum ada; tombolnya otomatis disembunyikan. |
| `beranda` | Judul, deskripsi, ayat utama, dan dua kotak ajakan di bagian atas. |
| `tentang` | Misi, visi, dan profil pendeta. |
| `pelayanan` | Enam bidang pelayanan. |
| `berita` | Dua berita utama dan daftar berita lainnya. |
| `wawasan` | Artikel dengan tombol "Baca Selengkapnya". |
| `khotbah` | Daftar khotbah, kategori filter, ringkasan. |
| `renungan` | Renungan harian yang bisa diganti dengan tombol "Renungan Berikutnya". |
| `ayat_harian` | Daftar ayat yang berganti otomatis setiap hari (waktu WITA). Gambar cadangan per ayat. |
| `ayat_harian_gambar` | Pengaturan gambar latar otomatis (sumber, ukuran, aktif/nonaktif). |
| `jadwal` | Jadwal Sabat, tengah minggu, dan kegiatan harian. |
| `kesaksian` | Kesaksian jemaat. |
| `dokumentasi` | Galeri foto atau video kegiatan (lihat bagian 4). |
| `materi` | Daftar file atau tautan materi (lihat bagian 3). |
| `donasi` | Nama bank, nomor rekening, atas nama, dan panduan transfer. |
| `doa` | Judul dan pilihan kebutuhan pada formulir doa. |
| `tanya_jawab` | Pertanyaan yang sering diajukan. |

Catatan: nilai yang berupa daftar (contohnya `daftar`, `item`, `ayat_harian`) bisa ditambah atau dikurangi. Salin satu blok yang sudah ada, lalu tempel dan ubah isinya. Pastikan blok sebelumnya diakhiri koma, kecuali blok terakhir.

### Mengecek kesalahan format JSON

Sebelum commit, tempel isi `content.json` ke https://jsonlint.com. Jika ada tanda merah, perbaiki dulu. Jika ada kesalahan, website akan menampilkan kotak peringatan "Konten belum bisa dimuat".

---

## 3. Materi (file unduhan, PDF, PPT, video)

File tidak perlu diunggah ke website. Unggah file ke **Google Drive**, **YouTube**, atau layanan lain, lalu tempel tautannya.

Di `data/content.json`, bagian `materi` → `daftar`:

```json
{
  "judul": "Warta Jemaat — Minggu, 29 November 2026",
  "jenis": "PDF",
  "keterangan": "Warta mingguan dan jadwal pelayanan.",
  "tautan": "https://drive.google.com/file/d/CONTOH/view"
}
```

- `jenis` ditampilkan sebagai label, misalnya PDF, PPT, DOCX, Audio, atau Video.
- Pastikan tautan Google Drive diatur **"Siapa saja yang memiliki link: Penampil"** agar pengunjung bisa membukanya.

---

## 4. Dokumentasi kegiatan (galeri foto/video)

Galeri ada di bagian `dokumentasi` → `daftar`. Setiap item bisa berisi foto dan/atau tautan:

```json
{
  "judul": "Bakti Sosial di Maluk",
  "keterangan": "8 November 2026",
  "gambar": "assets/img/bakti-sosial-1.webp",
  "tautan": "https://www.youtube.com/watch?v=CONTOH"
}
```

- Foto: letakkan file di folder `assets/img/`, lalu tulis jalurnya di `gambar`. Gunakan format **WebP** atau **JPG** dengan lebar sekitar 1200 px agar ringan dimuat.
- Video: isi `tautan` dengan link YouTube atau Google Drive. Pengunjung akan mengetuk tombol **Buka**.
- Jika `gambar` kosong, item tetap tampil sebagai kartu teks.

Untuk mengunggah foto ke GitHub: buka folder `assets/img`, klik **Add file > Upload files**, lalu commit.

---

## 5. Mengganti gambar

Ganti file yang ada di `assets/img/` dengan nama yang sama (misalnya `logo.webp`, `pendeta.webp`, `hero.webp`), atau tambahkan file baru lalu ubah jalurnya di `content.json`.

---

## 6. Menguji sebelum publish (opsional)

Jika punya komputer dengan Python, buka terminal di folder ini lalu jalankan:

```
python -m http.server 8000
```

Buka `http://localhost:8000` di peramban. Catatan: membuka `index.html` langsung dari file (dobel-klik) tidak akan memuat isi karena keterbatasan peramban terhadap berkas JSON. Gunakan cara di atas, atau cukup lihat hasilnya di GitHub Pages.

---

## 7. Hal yang perlu diketahui

- **Donasi:** Bank Mandiri a/n GMAHK Batu Hijau, No. Rek. 1610004484742. Periksa kembali nomor ini sebelum mengubahnya.
- **Ayat harian:** berganti otomatis setiap pergantian hari menurut WITA. Ada 14 ayat dalam daftar. Untuk menambah atau mengganti ayat, edit `ayat_harian`.
- **Gambar latar ayat harian:** diambil otomatis dari Lorem Picsum (https://picsum.photos), yaitu foto open source dari Unsplash, tanpa login atau kunci API. Gambar berganti setiap hari WITA dan sama sepanjang hari. Jika layanan tidak bisa dijangkau, website memakai gambar cadangan dari `ayat_harian`. Untuk mematikan fitur ini, ubah `"aktif": false` di `ayat_harian_gambar`. Karena fotonya dipilih acak dari layanan, gambar mungkin tidak selalu sesuai dengan tema ayat.
- **Hitung mundur:** menghitung ke Sabat berikutnya pukul 08.30 WITA.
- **Formulir doa:** tidak menyimpan data. Pesan langsung dikirim lewat WhatsApp atau email pilihan pengunjung. Tombol email muncul hanya jika alamat email di `content.json` terisi.
- **Mode gelap:** otomatis mengikuti pengaturan perangkat, dan pengunjung bisa mengganti lewat tombol 🌓.
- **Pengelolaan lewat browser dihapus:** versi sebelumnya memiliki panel "Kelola Website" dengan password yang menyimpan data di browser masing-masing. Versi ini memakai `content.json` sebagai satu sumber tunggal, sehingga semua pengunjung melihat isi yang sama dan perubahan tercatat di riwayat GitHub.

---

## 8. Pemecahan masalah

| Gejala | Penyebab dan solusi |
|---|---|
| Kotak merah "Konten belum bisa dimuat" | Ada kesalahan format di `content.json`. Cek dengan jsonlint.com. |
| Gambar tidak muncul | Nama file atau jalurnya salah, atau huruf besar/kecil berbeda. Di GitHub, nama file bersifat peka huruf besar/kecil. Gambar latar ayat harian bergantung pada koneksi ke picsum.photos. |
| Perubahan belum terlihat | Tunggu 1–2 menit, lalu tekan Ctrl+F5 (atau muat ulang di HP). |
| Halaman 404 | Pastikan `index.html` berada di folder paling atas repository. |
| Font terlihat berbeda | Font diambil dari Google Fonts; perlu koneksi internet. |
