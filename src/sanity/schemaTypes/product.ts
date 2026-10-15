import { defineField, defineType } from "sanity";

/**
 * "Produk / Paket Grosir" — tampil di section "Contoh Harga Grosir".
 * Pemilik toko menambah & mengubah ini dari panel admin /studio.
 */
export const product = defineType({
  name: "product",
  title: "Produk / Paket Grosir",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama produk / paket",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (alamat halaman)",
      description:
        "Dipakai di URL halaman detail, contoh: /produk/paket-sembako-dasar. Klik Generate setelah mengisi nama.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      description: "Dipakai untuk filter di halaman katalog.",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Isi paket / kemasan",
      description: "Contoh: Beras 5kg × 4, Minyak 2L × 6, Gula 1kg × 10",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      description:
        "Tampil di halaman detail produk dan dipakai mesin pencari. Tulis 1–3 kalimat yang jelas.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "price",
      title: "Harga (Rp)",
      description: "Isi angka saja, tanpa titik. Contoh: 485000",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "note",
      title: "Catatan",
      description: "Contoh: Minimal order 1 paket",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Gambar produk",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Urutan tampil",
      description: "Angka lebih kecil tampil lebih dulu.",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Urutan tampil",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "note", media: "image" },
  },
});
