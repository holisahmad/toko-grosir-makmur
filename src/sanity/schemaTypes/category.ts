import { defineField, defineType } from "sanity";

/**
 * "Kategori Produk" — tampil di section Kategori Produk.
 */
export const category = defineType({
  name: "category",
  title: "Kategori Produk",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama kategori",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (alamat filter)",
      description:
        "Dipakai di URL katalog, contoh: /produk?kategori=sembako. Klik Generate setelah mengisi nama.",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "note",
      title: "Keterangan",
      description: "Contoh: Beras, minyak, gula, dll",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Gambar kategori",
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
