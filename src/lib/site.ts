/**
 * Fallback terakhir bila semua env tidak tersedia saat build.
 * Dipakai domain produksi nyata (bukan localhost) agar sitemap/OG/canonical
 * tetap benar di produksi walau env salah isian — untuk localhost dev,
 * NEXT_PUBLIC_SITE_URL di .env.local tetap yang menang.
 */
const PRODUCTION_FALLBACK_URL = "https://toko-grosir-makmur.vercel.app";

/**
 * SATU sumber data bisnis.
 * Ganti nilai di bawah ini saja — jangan hardcode WA/alamat/email di komponen.
 *
 * ⚠️  NILAI DI BAWAH MASIH CONTOH. Ganti sebelum production:
 *     whatsapp, phoneDisplay, email, address, mapsUrl, dan hours.
 */

// URL situs dipakai metadataBase/sitemap/robots, yang membutuhkan URL absolut
// yang valid (new URL() melempar error kalau string kosong / tanpa skema).
// Nilai env yang salah tidak boleh membuat build gagal — kembali ke default.
function resolveSiteUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return PRODUCTION_FALLBACK_URL;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    new URL(withScheme); // validasi
    return withScheme.replace(/\/+$/, "");
  } catch {
    return PRODUCTION_FALLBACK_URL;
  }
}

export const siteConfig = {
  name: "Toko Grosir Makmur",
  tagline: "Grosir sembako & kebutuhan rumah tangga",
  since: 2015,

  // GANTI: format internasional tanpa "+" atau "0" di depan (contoh: 6281234567890)
  whatsapp: "6281234567890",
  phoneDisplay: "0812-3456-7890",
  email: "info@tokogrosirmakmur.com",

  address: "Jl. Raya Pasar No. 12, Jakarta Timur",
  // GANTI: link Google Maps ke lokasi toko (dipakai footer)
  mapsUrl: "https://maps.google.com/?q=Jl.+Raya+Pasar+No.+12+Jakarta+Timur",

  // Area layanan yang tampil di Hero
  area: "Jabodetabek",

  hours: {
    open: "Senin – Sabtu: 07.00 – 17.00",
    closed: "Minggu: Tutup",
  },

  // Di Vercel: set NEXT_PUBLIC_SITE_URL ke domain final (metadata/OG/sitemap).
  // Kosong / salah / belum diisi tidak merusak build — env sistem Vercel
  // (VERCEL_PROJECT_PRODUCTION_URL) dipakai, dan terakhir domain produksi.
  url: resolveSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ),
} as const;

/** Jumlah pelanggan aktif (tampil di Hero) */
export const activeCustomers = "500+";

/** Tahun berjalan sejak `since` — otomatis bertambah */
export const yearsInBusiness = new Date().getFullYear() - siteConfig.since;

// Tautan section memakai "/#..." (bukan "#...") supaya tetap benar
// saat diklik dari halaman lain seperti /produk.
export const navItems = [
  { label: "Katalog", href: "/produk" },
  { label: "Harga Grosir", href: "/#harga" },
  { label: "Cara Order", href: "/#cara-order" },
  { label: "FAQ", href: "/#faq" },
] as const;

export function waLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WA_ORDER_MESSAGE = "Halo, saya ingin order grosir";
