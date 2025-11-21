---
title: "Markdown Image Usage Guide"
date: "2024-01-01"
category: "guides"
tags: ["markdown", "images", "guide"]
description: "Panduan resmi menambahkan gambar ke catatan beserta struktur direktori dan pipeline pemrosesan."
cover: "https://placehold.co/1200x630/0f172a/34d399.png?text=Markdown+Image+Guide"
---

# Markdown Image Usage Guide

Panduan ini menjelaskan cara menambahkan gambar ke catatan Markdown agar dirender dengan benar di situs.

## Prosedur Membuat Catatan Bergambar

1. **Buat file markdown baru di `notes/`**
   - Nama file menentukan slug otomatis (contoh: `notes/incident-response/forensics.md` → slug `incident-response/forensics`).
   - Sertakan frontmatter minimal berikut:
     ```markdown
     ---
     title: "Incident Response Forensics"
     date: "2025-11-17"
     category: "incident-response"
     tags: ["forensics", "playbook"]
     ---
     ```
2. **Siapkan folder gambar di `public/images/notes/<slug>/`**
   - Gunakan nama folder yang sama dengan slug catatan. Contoh slug `incident-response/forensics` → folder `public/images/notes/incident-response/forensics/`.
   - Salin semua file gambar (PNG, JPG, WEBP, dsb.) ke folder tersebut.
3. **Sematkan gambar di konten markdown**
   - Gunakan jalur absolut ke folder publik:
     ```markdown
     ![Directory Structure](https://placehold.co/800x460/052e16/34d399.png?text=Directory+Structure)
     ```
   - Jika terbiasa dengan Obsidian, Anda boleh menulis `![[https://placehold.co/800x460/052e16/34d399.png?text=Directory+Structure|Directory Structure]]`; renderer akan mengonversi secara otomatis.
4. **Opsional: jalankan skrip pemrosesan gambar**
   - Jika gambar masih berada di lokasi lain (mis. hasil ekspor), jalankan `pnpm process-images -- --note guides/markdown-image-usage --source <folder-asal>` untuk menyalin dan memberi nama sesuai standar.
5. **Bangun dan ekspor situs statis**
   - `pnpm build && pnpm export` akan membaca ulang seluruh catatan dan menghasilkan output di folder `out/`.
   - Deploy isi `out/` ke GitHub Pages (mis. `gh-pages -d out`). Catatan baru beserta gambarnya otomatis muncul setelah deploy.

## 1. Struktur Direktori

```
notes/
  your-note.md
public/
  images/
    notes/
      your-note/
        diagram.png
```

- Simpan gambar di `public/images/notes/<slug-catatan>/`.
- Gunakan nama folder yang sama dengan slug catatan untuk menjaga keteraturan.

## 2. Sintaks Markdown Standar

```markdown
![Diagram Arsitektur](https://placehold.co/800x460/052e16/34d399.png?text=Diagram+Arsitektur)
```

- Gunakan jalur absolut yang diawali `/` agar gambar bisa dilayani oleh Next.js.
- `alt` text (dalam contoh `Diagram Arsitektur`) penting untuk aksesibilitas dan SEO.

## 3. Dukungan Gaya Obsidian

Obsidian syntax `![[path/to/image.png]]` secara otomatis dinormalisasi menjadi bentuk Markdown standar, jadi Anda tetap bisa menulis:

```
![[https://placehold.co/800x460/052e16/34d399.png?text=Diagram+Arsitektur]]
![[https://placehold.co/800x460/052e16/34d399.png?text=Diagram+Arsitektur|Diagram Arsitektur]]
```

Renderer akan mengubahnya menjadi sintaks markdown standar dengan alt text "Diagram Arsitektur" dan path absolut ke gambar sebelum dirender.

## 4. Gambar dari URL Eksternal

```markdown
![Logo OWASP](https://owasp.org/assets/images/logo.png)
```

- Jalur yang dimulai dengan `http://` atau `https://` akan digunakan apa adanya.

## 5. Tips Optimalisasi

1. **Gunakan format efisien** seperti `.webp` untuk mengurangi ukuran file.
2. **Aktifkan lazy loading** dengan tetap menggunakan sintaks standar—renderer menambahkan `loading="lazy"` dan `decoding="async"` secara otomatis.
3. **Pastikan ukuran** gambar tidak melebihi lebar kontainer; renderer sudah mengatur `max-width: 100%` agar gambar responsif.
4. **Sediakan `alt` text deskriptif** untuk membantu pembaca yang menggunakan screen reader.

## 6. Contoh Lengkap

```markdown
![Directory Illustration](https://placehold.co/800x460/052e16/34d399.png?text=Directory+Structure)

> [!info]
> Snapshot diambil sebelum langkah containment dijalankan.

![Sample Rendered Image](https://placehold.co/800x460/001f3f/34d399.png?text=Rendered+Example)
```

Dengan mengikuti panduan ini, seluruh gambar dalam catatan akan dirender konsisten di website.
