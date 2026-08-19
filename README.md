# Emojify-Recon

**Sistem Rekonstruksi Representasi Visual Berbasis Emoji dari Data Alfanumerik A–Z Menggunakan Pendekatan *Image Reconstruction* Offline.**

Setiap huruf A–Z dipetakan ke satu emoji, satu ucapan, dan satu rekonstruksi wajah pada karakter layar bernama **REKA** (Rekonstruksi Ekspresi Karakter Alfanumerik). Tekan `CTRL` + huruf di keyboard fisik, dan REKA akan menirukan ekspresi tersebut lengkap dengan suara — semuanya berjalan **100% di browser, tanpa server, dan tetap bisa dipakai offline** setelah dimuat sekali (PWA + Service Worker).

> **Catatan desain:** karakter "REKA" adalah desain orisinal (SVG buatan sendiri, bukan gambar/aset pihak ketiga). Saya sengaja tidak meniru wajah Karen (SpongeBob) secara langsung karena itu karakter berlisensi milik Paramount/Nickelodeon — sebagai gantinya REKA mengambil *esensi* idenya (komputer dengan wajah ekspresif) dalam bentuk yang sepenuhnya baru, aman dipakai publik/di repo GitHub.

---

## ✨ Fitur

- **26 rekonstruksi wajah unik** (SVG, vector — tajam di semua ukuran layar), satu untuk tiap huruf A–Z, sesuai tabel emoji & ucapan yang kamu berikan.
- **Trigger `CTRL`/`⌘` + huruf** di keyboard fisik, dengan **keypad on-screen** sebagai fallback (penting untuk HP/tablet, dan untuk kombinasi yang dikunci browser seperti `CTRL+T`, `CTRL+W`, `CTRL+N`).
- **Suara**: bunyi "blip" komputer (Web Audio API, disintesis langsung, tanpa file audio) + ucapan diucapkan (Web Speech API / `speechSynthesis`, suara bawaan OS/browser).
- **Log konsol** di panel kanan, mencatat histori huruf yang ditekan.
- **Offline-first**: Service Worker meng-cache seluruh app shell saat pertama kali dibuka, lalu bisa dipakai tanpa internet (bisa juga di-*install* sebagai aplikasi lewat PWA).
- Tanpa dependency build/framework — murni HTML/CSS/JS, jadi bisa langsung di-deploy sebagai *static site*.

## 📁 Struktur proyek

```
emojify-recon/
├── index.html            # markup utama
├── style.css              # tema CRT terminal (token warna, layout, animasi)
├── app.js                 # data A–Z, render wajah SVG, keyboard/klik, audio, logging
├── manifest.webmanifest   # metadata PWA
├── sw.js                  # service worker (cache-first, offline)
├── vercel.json             # konfigurasi ringan untuk Vercel
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable-512.png
└── README.md
```

## 🚀 Menjalankan secara lokal

Karena pakai Service Worker, sebaiknya dibuka lewat server lokal (bukan `file://`):

```bash
cd emojify-recon
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

Atau dengan Node:

```bash
npx serve .
```

## 📦 Push ke GitHub

```bash
cd emojify-recon
git init
git add .
git commit -m "init: Emojify-Recon"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

## ▲ Deploy ke Vercel

**Lewat dashboard (paling gampang):**
1. Buka [vercel.com/new](https://vercel.com/new), pilih **Import Git Repository**, arahkan ke repo yang baru kamu push.
2. Framework preset: pilih **Other** (proyek ini static, tanpa build step).
3. Build command: kosongkan. Output directory: kosongkan / `.` (root).
4. Klik **Deploy** — selesai dalam hitungan detik.

**Lewat CLI:**
```bash
npm i -g vercel
cd emojify-recon
vercel        # ikuti prompt untuk link/buat project
vercel --prod # deploy ke production
```

Setelah live, buka URL Vercel-nya sekali (supaya Service Worker ter-*install* dan meng-cache semua aset), setelah itu halaman bisa dibuka lagi walau internet mati.

## 📴 Cara pakai offline / install sebagai app

1. Buka URL deploy-annya minimal sekali saat online.
2. Di Chrome/Edge (desktop maupun Android): klik ikon **install** di address bar, atau menu ⋮ → **Install app**.
3. Di iOS Safari: Share → **Add to Home Screen**.
4. Setelah ter-install, REKA bisa dibuka tanpa koneksi internet sama sekali. Panel status di pojok kanan atas akan berubah jadi `● offline (cache aktif)`.

## ⌨️ Tentang trigger `CTRL + huruf`

Browser mengunci beberapa kombinasi `CTRL` untuk fungsinya sendiri dan **tidak bisa** di-*override* JavaScript, contohnya:

- `CTRL+T` (tab baru), `CTRL+N` (window baru), `CTRL+W` (tutup tab)
- `CTRL+S` (save), `CTRL+P` (print) — di beberapa browser/OS

Untuk huruf-huruf itu, gunakan **keypad on-screen** di panel kanan (atau klik huruf di layar) — hasil rekonstruksinya identik, hanya beda cara memicunya. Kombinasi lain (`CTRL+A/B/D/E/F/G/H/I/J/K/L/M/O/Q/R/U/V/X/Y/Z`, dst.) umumnya berhasil di-intercept dengan aman di sebagian besar browser modern.

## 🔊 Tentang suara

- **Bunyi "blip"** dibuat langsung lewat Web Audio API (osilator + envelope singkat) — tidak butuh file `.mp3`/`.wav`, jadi tetap kecil dan tetap jalan offline.
- **Ucapan** dibacakan lewat `speechSynthesis` bawaan browser (voice `id-ID` jika tersedia di perangkat). Kualitas & ketersediaan suara tergantung OS/browser masing-masing pengguna; toggle "Suara & ucapan" di panel kanan bisa dimatikan kapan saja.

## 🎨 Data A–Z

Tabel emoji, ucapan, dan warna aksen per huruf ada di `app.js` pada objek `FACES` — silakan sunting teks, emoji, atau warna di sana untuk menyesuaikan sesuai kebutuhanmu.

## Lisensi

Kode ini bebas kamu pakai/modifikasi untuk proyekmu (silakan tambahkan file `LICENSE` — mis. MIT — kalau repo-nya publik).
