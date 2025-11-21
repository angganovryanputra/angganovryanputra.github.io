# Script Workflow & Quality Checks

Gunakan panduan ini untuk menjalankan rangkaian skrip yang memastikan situs statis siap dideploy ke GitHub Pages.

## 1. Instalasi Dependensi

```bash
pnpm install
```

Menjamin dependensi, termasuk tool CLI seperti `tsx`, tersedia sebelum menjalankan skrip lainnya.

## 2. Validasi Kode & Type Safety

1. **ESLint** – memastikan gaya dan best practice Next.js
   ```bash
   pnpm lint
   ```
2. **TypeScript** – mendeteksi error tipe
   ```bash
   pnpm typecheck
   ```

> Jalankan kembali setelah perubahan besar pada kode atau konfigurasi TypeScript.

## 3. Validasi Konten Markdown

```bash
pnpm validate:content
```

Skrip ini memeriksa:
- Frontmatter wajib (`title`, `date`, `tags`).
- Alt text gambar dan keberadaan file di `/public/images`.
- Tautan internal ke catatan lain.

Proses berhenti dengan exit code 1 jika ada error.

## 4. Regenerasi Aset Statis

1. **Sitemap**
   ```bash
   pnpm generate:sitemap
   ```
   Menghasilkan `public/sitemap.xml` dengan rute utama dan catatan.

2. **RSS Feed**
   ```bash
   pnpm generate:rss
   ```
   Membuat `public/feed.xml` berisi daftar catatan terbaru.

3. **Proses Gambar Catatan**
   ```bash
   pnpm process-images -- --note "slug-catatan" --source "./temp/images"
   ```
   Menyalin gambar ke `/public/images/notes/<slug>`, memberikan nama unik, menghitung dimensi & hash, lalu membuat `manifest.json`.

   > Parameter `--note` dan `--source` opsional; sesuaikan sumber aset sebelum build statis.

## 5. Pipeline Build

Build resmi menjalankan semua langkah penting secara berurutan:

```bash
pnpm build
```

yang setara dengan:
1. `node scripts/build-search-index.mjs`
2. `pnpm generate:sitemap`
3. `pnpm generate:rss`
4. `next build`

Untuk ekspor statis lengkap:

```bash
pnpm export
```

## 6. Urutan Rekomendasi Sebelum Deploy

1. `pnpm install` (sekali setelah tarik perubahan baru).
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm validate:content`
5. `pnpm process-images -- --note <slug>` (jika ada gambar baru)
6. `pnpm generate:sitemap`
7. `pnpm generate:rss`
8. `pnpm build`
9. `pnpm export`

Pastikan langkah 2–7 sukses tanpa error sebelum mendorong perubahan ke branch `main`.
