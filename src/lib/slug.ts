/**
 * Ubah teks jadi slug URL: "Susu & Olahan" → "susu-dan-olahan".
 *
 * Dipakai sebagai fallback ketika dokumen Sanity belum punya field `slug`,
 * supaya tautan tetap enak dibaca dan tidak menampilkan ID acak.
 * Fungsi ini murni (tanpa dependency) supaya aman dipakai di server
 * maupun browser.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
