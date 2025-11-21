# Markdown Image Usage Guide

Panduan ini menjelaskan cara menambahkan gambar ke catatan Markdown agar dirender dengan benar di situs.

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
![Diagram Arsitektur](/images/notes/your-note/diagram.png)
```

- Gunakan jalur absolut yang diawali `/` agar gambar bisa dilayani oleh Next.js.
- `alt` text (dalam contoh `Diagram Arsitektur`) penting untuk aksesibilitas dan SEO.

## 3. Dukungan Gaya Obsidian

Obsidian syntax `![[path/to/image.png]]` secara otomatis dinormalisasi menjadi bentuk Markdown standar, jadi Anda tetap bisa menulis:

```
![[your-note/diagram.png]]
![[your-note/diagram.png|Diagram Arsitektur]]
```

Renderer akan mengubahnya menjadi `![Diagram Arsitektur](/images/notes/your-note/diagram.png)` sebelum dirender.

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
![Memory Snapshot](/images/notes/incident-response/memory-snapshot.png)

> [!info]
> Snapshot diambil sebelum langkah containment dijalankan.

![Diagram Playbook](/images/notes/incident-response/playbook-diagram.webp)
```

Dengan mengikuti panduan ini, seluruh gambar dalam catatan akan dirender konsisten di website.
