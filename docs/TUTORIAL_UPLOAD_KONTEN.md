# Tutorial: Cara Menambah Catatan dan Gambar Baru

Panduan ini menjelaskan alur kerja untuk menambahkan konten baru (catatan dalam format Markdown dan gambar) ke situs portofolio Anda.

## Langkah 1: Tambahkan File Markdown (.md)

1.  Buka direktori `notes/` di root proyek Anda.
2.  Anda bisa menambahkan file `.md` baru langsung di dalam folder `notes/` atau di dalam sub-folder yang sudah ada (misal: `notes/malware-analysis/`).
3.  **Struktur Frontmatter**: Pastikan setiap file `.md` memiliki bagian *frontmatter* di bagian paling atas untuk metadata. Contoh:

    ```yaml
    ---
    title: "Judul Catatan Anda"
    date: "YYYY-MM-DD"
    category: "Kategori Utama" # cth: Malware Analysis, Web Security
    tags:
      - "tag1"
      - "tag2"
      - "teknologi"
    ---

    Konten markdown Anda dimulai di sini...
    ```

## Langkah 2: Tambahkan Gambar

1.  Semua gambar harus ditempatkan di dalam direktori `public/`.
2.  **Sangat disarankan** untuk membuat sub-folder agar rapi. Contoh: `public/images/notes/`.
3.  Salin atau pindahkan file gambar Anda (misal: `.png`, `.jpg`, `.gif`) ke dalam direktori tersebut.

## Langkah 3: Referensi Gambar di dalam Markdown

Untuk menampilkan gambar di dalam catatan Anda, gunakan sintaks Markdown standar dengan path yang dimulai dari `/` (yang mengarah ke folder `public`).

**Contoh:**

Jika gambar Anda berada di `public/images/notes/diagram-keren.png`, maka di dalam file `.md` Anda, tulis seperti ini:

```markdown
![Ini adalah deskripsi gambar untuk aksesibilitas](/images/notes/diagram-keren.png)
```

## Langkah 4: Build dan Deploy

Setelah Anda menambahkan file `.md` dan gambar, Anda perlu membangun ulang situs untuk melihat perubahannya.

1.  **Buka terminal** di root proyek Anda.
2.  **Jalankan perintah build**:
    ```bash
    pnpm build
    ```
3.  Perintah ini akan membuat versi statis dari situs Anda di dalam folder `out/`.
4.  **Commit dan Push**: Lakukan `commit` dan `push` semua perubahan Anda (file `.md` baru, gambar baru di `public/`, dan folder `out/` yang sudah diperbarui) ke repositori GitHub Anda.

Selesai! Perubahan akan otomatis tayang di situs GitHub Pages Anda.
