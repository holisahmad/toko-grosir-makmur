import { formatRupiah } from "./format";

/**
 * Satu baris daftar pesanan pembeli.
 * Nama & harga disimpan apa adanya saat produk ditambahkan, jadi daftar tetap
 * utuh walau halaman di-refresh. Pesan WhatsApp selalu meminta konfirmasi
 * harga terbaru karena harga bisa berubah dari panel admin.
 */
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  /** Harga satuan; null berarti harga belum tersedia ("hubungi kami"). */
  price: number | null;
  qty: number;
};

/** Produk yang bisa dimasukkan ke daftar pesanan (belum ada jumlahnya). */
export type OrderableProduct = Omit<CartItem, "qty">;

/** Data pembeli, diisi lewat form di panel daftar pesanan. */
export type CustomerInfo = {
  name: string;
  address: string;
};

export const EMPTY_CUSTOMER: CustomerInfo = { name: "", address: "" };

/** Batas jumlah per baris, sekadar pengaman input. */
export const MAX_QTY = 99;

export type OrderTotals = {
  /** Jumlah harga item yang diketahui; 0 kalau tidak ada harga sama sekali. */
  total: number;
  /** Ada item yang harganya belum tersedia. */
  hasUnknownPrice: boolean;
  /** Ada minimal satu item dengan harga. */
  hasKnownPrice: boolean;
};

export function orderTotals(items: CartItem[]): OrderTotals {
  const priced = items.filter((item) => item.price != null);
  return {
    total: priced.reduce(
      (sum, item) => sum + (item.price as number) * item.qty,
      0
    ),
    hasUnknownPrice: items.length > priced.length,
    hasKnownPrice: priced.length > 0,
  };
}

/** Ringkasan singkat untuk tombol melayang, mis. badge angka. */
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Susun pesan WhatsApp dari daftar pesanan + data pembeli.
 *
 * Contoh keluaran:
 *
 *   Halo, saya ingin order:
 *
 *   1. Paket Sembako Dasar
 *      2 × Rp 485.000 = Rp 970.000
 *   2. Gula Pasir 1 kg
 *      5 × Rp 16.500 = Rp 82.500
 *
 *   Estimasi total: Rp 1.052.500 (belum termasuk ongkir)
 *   Mohon konfirmasi harga dan stok terbaru.
 *
 *   Nama pemesan: Budi Santoso
 *   Alamat pengiriman: Jl. Melati No. 5, Jakarta Timur
 *
 * Baris nama & alamat hanya muncul kalau isinya tidak kosong (UI men-gate
 * tombol kirim agar keduanya selalu terisi), jadi pesan yang terkirim sudah
 * lengkap tanpa perlu pembeli mengetik ulang di chat.
 */
export function orderMessage(
  items: CartItem[],
  customer: CustomerInfo = EMPTY_CUSTOMER
): string {
  if (!items.length) return "";

  const lines = items.map((item, index) => {
    const head = `${index + 1}. ${item.name}`;
    if (item.price == null) {
      return `${head}\n   ${item.qty} × harga menyusul`;
    }
    const lineTotal = item.price * item.qty;
    return `${head}\n   ${item.qty} × ${formatRupiah(item.price)} = ${formatRupiah(lineTotal)}`;
  });

  const { total, hasUnknownPrice, hasKnownPrice } = orderTotals(items);
  const summary: string[] = [];

  if (hasKnownPrice) {
    if (hasUnknownPrice) {
      summary.push(
        `Total sejauh ini: ${formatRupiah(total)} (sebagian harga menyusul, belum termasuk ongkir)`
      );
    } else {
      summary.push(
        `Estimasi total: ${formatRupiah(total)} (belum termasuk ongkir)`
      );
    }
  } else {
    summary.push("Mohon info harga terbaru untuk produk di atas.");
  }

  summary.push("Mohon konfirmasi harga dan stok terbaru.");

  // Data pembeli dari form panel. Hanya baris terisi yang disertakan.
  const customerLines = [
    customer.name.trim() ? `Nama pemesan: ${customer.name.trim()}` : "",
    customer.address.trim()
      ? `Alamat pengiriman: ${customer.address.trim()}`
      : "",
  ].filter(Boolean);

  return [
    "Halo, saya ingin order:",
    "",
    ...lines,
    "",
    ...summary,
    ...(customerLines.length ? ["", ...customerLines] : []),
  ].join("\n");
}
