/**
 * Format angka rupiah untuk tampilan: 485000 → "Rp 485.000".
 *
 * Sengaja dipisah ke modul murni (tanpa dependency) supaya komponen browser
 * bisa memakainya tanpa ikut menarik klien Sanity ke bundle.
 */
export function formatRupiah(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
