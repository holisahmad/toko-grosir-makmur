# Toko Grosir Makmur — Landing Page Skeleton

Skeleton production-ready untuk landing page UMKM toko grosir.

Dibangun mengikuti 3 prompt anti-AI-slop:
1. **General Rules** — design philosophy & constraints
2. **Prompt Khusus** — business context + locked design system
3. **Detail Spec** — colors, typography, spacing, sections

## Design System (Locked)

| Token            | Value     | Role                    |
|------------------|-----------|-------------------------|
| background       | `#FAFAF9` | Page background         |
| surface          | `#FFFFFF` | Cards / header / footer |
| border           | `#E7E5E4` | Borders                 |
| text-primary     | `#1C1917` | Main text               |
| text-muted       | `#78716C` | Secondary text          |
| primary          | `#0F766E` | CTA only                |
| primary-hover    | `#0D9488` | CTA hover               |

- Font: Inter
- Border radius: 8px (button), 10px (card)
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Max container: 1120px

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Sanity (headless CMS: database + upload gambar + panel admin di `/studio`)
- No shadcn / cva (belum dipakai; install saat dibutuhkan)

## Struktur

```
src/
├── app/
│   ├── globals.css      # Design tokens + utility classes
│   ├── layout.tsx
│   ├── page.tsx         # Composition of all sections (ISR 60s)
│   ├── not-found.tsx    # Halaman 404
│   ├── produk/
│   │   ├── page.tsx         # Katalog: pencarian + filter kategori
│   │   └── [slug]/page.tsx  # Detail produk + metadata SEO per produk
│   └── studio/          # Panel admin Sanity, tersedia di /studio
├── components/
│   ├── cart/            # Daftar pesanan: CartProvider, CartWidget, AddToCartButton
│   ├── catalog/         # CatalogSearch + ProductCard
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── Keunggulan.tsx
│       ├── KategoriProduk.tsx   # data dari Sanity (fallback statis)
│       ├── HargaGrosir.tsx      # data dari Sanity (fallback statis)
│       ├── CaraOrder.tsx
│       ├── Testimoni.tsx
│       ├── FAQ.tsx
│       └── FinalCTA.tsx
├── sanity/
│   └── schemaTypes/     # Skema dokumen: category, product
└── lib/
    ├── site.ts          # SATU sumber data BISNIS: nama, WA, alamat, email, jam, nav
    ├── content.ts       # Konten statis (fallback saat Sanity belum dikonfigurasi)
    ├── format.ts        # formatRupiah() — murni, aman dipakai di client & server
    ├── order.ts         # Logika daftar pesanan: item, total, susunan pesan WA
    ├── sanity/          # client, GROQ queries, image URL builder
    ├── slug.ts          # slugify() — slug cadangan kalau field slug kosong
    └── utils.ts

sanity.config.ts         # Konfigurasi Sanity Studio (root)
sanity.cli.ts            # Konfigurasi Sanity CLI (dataset import, cors, dll)
sanity/seed.ndjson       # Data awal untuk diimpor ke Sanity
```

Data bisnis yang tidak berubah (nama, WA, alamat) ada di `src/lib/site.ts`.
Kategori & produk dikelola dari panel admin Sanity; `src/lib/content.ts`
tetap ada sebagai fallback supaya situs tidak pernah kosong.

## Cara Menjalankan

```bash
cd toko-grosir-makmur
npm install
npm run dev
npm run typecheck   # tsc --noEmit
npm run lint
```

Buka http://localhost:3000

## Langkah Selanjutnya (untuk AI Agent)

1. Ganti nomor WhatsApp, alamat (`mapsUrl`), email, jam buka, area di `src/lib/site.ts`
2. Siapkan proyek Sanity + environment (lihat "Panel Admin (Sanity)")
3. Import data awal: `npx sanity dataset import sanity/seed.ndjson production --replace`
4. Kelola kategori & produk dari `/studio`: isi **slug** (alamat halaman),
pilih **kategori** (untuk filter), upload gambar, lalu Publish
5. Ganti testimoni/FAQ di `src/lib/content.ts` dengan yang asli
6. Set `NEXT_PUBLIC_SITE_URL` di Vercel untuk metadata/OG
7. Deploy ke Vercel

## Panel Admin (Sanity)

Pemilik toko menambah & mengubah kategori/produk — termasuk **upload gambar** —
langsung dari panel admin di **`/studio`**, tanpa deploy ulang. Situs mengambil
data dari Sanity dan di-revalidate tiap 60 detik (ISR), jadi perubahan muncul
otomatis dalam ≤1 menit.

### Setup sekali saja

1. Buat akun & proyek di [sanity.io](https://sanity.io) (gratis). Catat
   **Project ID** dan dataset (`production`).
2. Isi environment di `.env.local` (lokal) **dan** di Vercel → Settings →
   Environment Variables:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Nilai ini memang publik (dipakai browser Studio), bukan kredensial rahasia.

3. Login CLI lalu import data awal (kategori + paket yang sekarang tampil).
   Perintah CLI membaca `.env.local` lewat `sanity.cli.ts`, jadi Project ID
   tidak perlu ditulis ulang:

   ```bash
   npx sanity login
   npx sanity dataset import sanity/seed.ndjson production --replace
   ```

   `--replace` membuat perintah ini aman diulang (ID dokumen di seed sudah tetap).

   ⚠️ Seed berisi **data contoh** (6 kategori + 11 produk, harga karangan).
   Ganti dengan data asli toko, atau hapus dokumen contohnya dari `/studio`.

4. Daftarkan origin CORS **dengan kredensial** (lihat bagian CORS di bawah) —
   tanpa ini Studio berhenti di layar “Connect this studio to your project”.

5. Jalankan `npm run dev`, buka `http://localhost:3000/studio`, login dengan
   akun Sanity Anda (Google / GitHub / e-mail), lalu tambah produk / upload
   gambar / publikasikan.

### Yang bisa dikelola

| Dokumen | Tampil di |
|---------|-----------|
| `product` (Produk / Paket Grosir) | Katalog `/produk`, detail `/produk/[slug]`, dan teaser "Contoh Harga Grosir" di beranda |
| `category` (Kategori Produk) | Section "Kategori Produk" + chip filter di `/produk` |

Field penting pada `product`: `slug` (alamat halaman, mis.
`/produk/beras-premium-5-kg`), `category` (dipakai filter), `description`
(isi halaman detail + meta description), `price`, `items`, `image`.

Urutan tampil diatur field `order` (angka kecil tampil lebih dulu), dan
`HargaGrosir` di beranda hanya menampilkan 3 produk pertama sebagai teaser.

Field `slug` pada `category` dipakai di URL filter (`/produk?kategori=sembako`).
Kalau slug dikosongkan, sistem memakai ID dokumen — filter tetap jalan, hanya
URL-nya kurang enak dibaca.

Skema ada di `src/sanity/schemaTypes/`. Menambah field = ubah file itu.

### Halaman Katalog & SEO

| URL | Isi | Metadata |
|-----|-----|----------|
| `/produk` | Semua produk + kotak pencarian + chip kategori | title/description sendiri, canonical `/produk` |
| `/produk?kategori=sembako` | Produk satu kategori | tetap boleh diindeks (halaman kategori) |
| `/produk?q=beras` | Hasil pencarian | `noindex` — konten tipis dan jumlahnya tak terbatas |
| `/produk/[slug]` | Detail produk + produk terkait | title/description/Open Graph per produk + JSON-LD `Product` |

- Pencarian dan filter dikerjakan **di server lewat GROQ**, jadi hasilnya bisa
dibagikan lewat tautan dan tetap jalan tanpa JavaScript. Kotak pencarian hanya
memperbarui URL (300 ms setelah berhenti mengetik), lalu server merender ulang.
- Halaman detail di-prerender (`generateStaticParams`) dan di-revalidate tiap
60 detik. Produk yang baru ditambahkan tetap tampil walau belum di-prerender.
- `sitemap.xml` memuat beranda, `/produk`, dan setiap produk.
- `robots.txt` menutup `/studio` dari mesin pencari.
- URL detail memakai field `slug`; kalau kosong dipakai `slugify(nama)`,
sehingga tautan tidak pernah menampilkan ID acak.

### Daftar Pesanan (WhatsApp)

Pembeli bisa memilih banyak produk lalu mengirim **satu daftar pesanan** lewat
WhatsApp dalam sekali klik.

- Setiap kartu katalog dan halaman detail produk punya pemilih jumlah
  (stepper −/+) plus tombol **"Tambah ke pesanan"**, jadi pembeli bisa langsung
  menambah lebih dari satu tanpa membuka halaman detail. Di kartu, jumlah
  kembali ke 1 setelah produk masuk daftar.
- Tombol melayang di kanan bawah menampilkan jumlah item; diklik untuk membuka
  panel daftar pesanan: ubah jumlah, hapus baris, kosongkan daftar.
- Panel memuat form **nama pemesan** & **alamat pengiriman**. Tombol
  **"Kirim ke WhatsApp"** baru aktif setelah keduanya diisi (ada petunjuk
  singkat di bawahnya), sehingga pesan yang terkirim sudah lengkap: daftar
  + subtotal tiap baris, estimasi total, permintaan konfirmasi harga & stok,
  lalu nama & alamat terisi penuh. Setelah itu WhatsApp terbuka
  (desktop/app) atau wa.me.

Kerja teknisnya:

- State tersimpan di `localStorage`, jadi daftar bertahan saat halaman
di-refresh dan saat pindah halaman. Tidak ada akun, tidak ada server.
- Nama & alamat pembeli ikut tersimpan di perangkatnya bersama daftar;
"Kosongkan daftar" menghapus item tetapi mempertahankan data pembeli
(pembeli lama tidak perlu mengetik ulang). Data tersimpan versi lama
(tanpa `customer`) tetap terbaca — field-nya diisi kosong.
- Logika murni di `src/lib/order.ts` (tipe `CartItem`, `orderTotals`,
`orderMessage`) terpisah dari komponen, sehingga format pesan bisa diuji dan
berubah tanpa menyentuh UI. `formatRupiah` dipindah ke `src/lib/format.ts`
(supaya `order.ts` tidak menarik klien Sanity ke bundle browser).
- Nama & harga di-*snap* saat produk ditambahkan: pesan tetap utuh walau harga
berubah di panel admin, dan pesan selalu meminta konfirmasi harga terbaru.
- Produk tanpa harga tampil sebagai "harga menyusul"; total hanya menjumlah
item yang harganya diketahui.
- Widget disembunyikan otomatis di `/studio` dan tidak ikut ter-render di
sisi server (mencegah hydration mismatch).
- Isi pesan di-`encodeURIComponent`, jadi spasi & tanda baca aman di URL.

### Kalau Sanity belum dikonfigurasi

Situs tetap tampil memakai konten statis dari `src/lib/content.ts`, dan
`/studio` menampilkan petunjuk setup — tidak ada yang crash.

### CORS (wajib, dan harus mengizinkan kredensial)

Studio berjalan di browser dan memanggil API Sanity langsung dengan cookie
sesi. Karena itu origin Anda harus terdaftar **dengan kredensial diizinkan**:

```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://domain-anda.com --credentials
npx sanity cors list
```

Bisa juga lewat Sanity → Project → API → **CORS origins** (centang
“Allow credentials”).

Dua gejala kalau origin didaftarkan **tanpa** kredensial:

- console browser menampilkan error CORS pada `…/users/me`, dan
- Studio berhenti di layar **“Connect this studio to your project”**, seolah
  project belum tertaut — padahal konfigurasi sudah benar.

Catatan: kalau port dev bukan 3000 (mis. 3001 karena port terpakai), tambahkan
origin `http://localhost:PORT` itu juga dengan `--credentials`. Origin tanpa
kredensial tidak bisa dipakai Studio.


## Anti-Slop Checklist

- [x] Tidak ada purple / neon gradient
- [x] Tidak ada glassmorphism
- [x] Tidak ada ilustrasi generik
- [x] Border radius maksimal 10px
- [x] Primary color hanya untuk CTA
- [x] Typography hierarchy jelas
- [x] Whitespace cukup
- [x] Fokus trust & clarity

## Changelog Perbaikan

- **Font Inter sebenarnya tidak terpasang** (Tailwind memakai nama "Inter", bukan `var(--font-inter)`) → diperbaiki
- Anchor menu tertutup header sticky → `scroll-padding-top`; smooth scroll hormati `prefers-reduced-motion`
- FAQ: teks bisa terpotong (`max-h-40`) dan panel tertutup masih bisa difokus → grid-rows + `inert` + ARIA
- Header: hapus `backdrop-blur` (melanggar aturan no-glassmorphism); tambah `aria-expanded`, Escape menutup menu
- Primary color dikembalikan hanya untuk CTA (eyebrow, ikon, nomor langkah, hover kartu/footer sebelumnya melanggar)
- Skala spacing 4/8/12/16/24/32/48/64 ditegakkan (`py-14/20`, `gap-10`, `p-5`, `px-5`, `py-2.5` diganti); tombol kini ≥44px
- Hero: teks + CTA di atas gambar pada mobile
- Nomor WA/data bisnis yang tersebar di 7 tempat dipusatkan ke `lib/site.ts`
- `next.config.ts`: hapus `dangerouslyAllowSVG` + CSP yang tidak perlu
- Tambah `eslint.config.mjs` (ESLint 9 flat config; `next lint` sebelumnya tidak bisa jalan), script `typecheck`
- Hapus dependency `class-variance-authority`, warna `success`, folder kosong
- Metadata: `metadataBase`, Open Graph; alt dekoratif pada ikon kategori; typo "Resellerer"
- Sentralisasi konten ke `src/lib/content.ts` (kategori, paket harga, fitur, langkah order, testimoni, FAQ) — komponen jadi thin renderer
- `site.ts`: tambah `tagline`, `mapsUrl`, `area`, `activeCustomers`; stat "tahun" kini dihitung otomatis dari `since`
- Footer: alamat kini menautkan ke Google Maps (`mapsUrl`)
- **Panel admin Sanity** di `/studio`: skema `product` + `category`, upload gambar,
  dan situs membaca dari Sanity dengan fallback `content.ts` + revalidate ISR 60s
- **Katalog produk** `/produk` + detail `/produk/[slug]`: pencarian & filter
  kategori dikerjakan di server lewat GROQ, metadata SEO per produk, JSON-LD
  `Product`, sitemap memuat semua produk, `noindex` untuk halaman hasil
  pencarian, dan halaman 404 kustom
- `sanity.cli.ts` ditambahkan — CLI Sanity butuh `api.projectId`, tanpa itu
  `dataset import` / `cors` gagal dengan error yang membingungkan
- **CORS wajib memakai `--credentials`**: tanpa itu Studio berhenti di layar
  "Connect this studio to your project" walau konfigurasi proyek sudah benar
- Skema: `product` dapat field `slug`, `category`, `description`;
  `category` dapat field `slug`
- `imageUrlBuilder` (deprecated) diganti `createImageUrlBuilder`
- `outputFileTracingRoot` diset: menghilangkan warning "multiple lockfiles"
  yang membuat file tracing menunjuk ke direktori home
- `.gitignore`: `.env.example` tidak lagi ikut terabaikan
- Ketergantungan Sanity dipatok ke lini `next-sanity@11` / `sanity@4` (kompatibel Next 15 + React 19)

## Deploy ke Vercel

1. Isi data asli di `src/lib/site.ts` (WA, alamat, email, jam) + konten section
2. Siapkan proyek Sanity + environment (lihat "Panel Admin (Sanity)")
3. `npm install && npm run typecheck && npm run build` (pastikan lolos di lokal)
4. Push ke GitHub → vercel.com → Add New Project → pilih repo (framework Next.js terdeteksi otomatis)
5. Environment Variables di Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
6. Deploy, lalu sambungkan domain di Settings → Domains
7. Tambahkan domain final ke CORS di Sanity → Project → API → CORS origins
