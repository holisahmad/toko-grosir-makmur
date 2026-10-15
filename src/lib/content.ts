import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  PackageCheck,
  Truck,
  Headset,
} from "lucide-react";

/**
 * SATU sumber konten section.
 * Ubah teks/harga/kategori di file ini saja — komponen hanya merender data.
 *
 * Catatan: untuk "upload produk" dari dashboard (CMS), data di bawah ini
 * adalah bentuk statisnya. Lihat README bagian "Data Dinamis" untuk opsi CMS.
 */

/* ---------- Keunggulan ---------- */

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: BadgeDollarSign,
    title: "Harga Grosir Kompetitif",
    description: "Harga transparan dan bersaing. Cocok untuk warung dan reseller.",
  },
  {
    icon: PackageCheck,
    title: "Stok Real-time",
    description: "Update stok setiap hari. Tidak ada kejutan barang kosong.",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Pengiriman same-day / next-day untuk area Jabodetabek.",
  },
  {
    icon: Headset,
    title: "Pelayanan Personal",
    description: "Tim siap membantu via WhatsApp dari pagi hingga sore.",
  },
];

/* ---------- Kategori Produk ---------- */
// GANTI `image` dengan foto asli (mis. /images/kategori/sembako.jpg).
// Format didukung: SVG, JPG, PNG, WEBP (via next/image).

export type ProductCategory = {
  name: string;
  note: string;
  image: string;
};

export const categories: ProductCategory[] = [
  { name: "Sembako", note: "Beras, minyak, gula, dll", image: "/images/cat-sembako.svg" },
  { name: "Minuman", note: "Air mineral, teh, kopi, soft drink", image: "/images/cat-minuman.svg" },
  { name: "Makanan Ringan", note: "Snack, biskuit, mie instan", image: "/images/cat-makanan.svg" },
  { name: "Rumah Tangga", note: "Sabun, detergen, pembersih", image: "/images/cat-rumah-tangga.svg" },
  { name: "Susu & Olahan", note: "Susu kental, bubuk, yoghurt", image: "/images/cat-susu.svg" },
  { name: "Bumbu & Rempah", note: "Kecap, saos, bumbu dapur", image: "/images/cat-bumbu.svg" },
];

/* ---------- Harga Grosir ---------- */

export type PricePackage = {
  name: string;
  items: string;
  price: string;
  note: string;
  /**
   * Nama kategori (samakan dengan salah satu `categories`) — dipakai filter
   * katalog saat Sanity belum dikonfigurasi.
   */
  category?: string;
};

export const packages: PricePackage[] = [
  {
    name: "Paket Sembako Dasar",
    items: "Beras 5kg × 4, Minyak 2L × 6, Gula 1kg × 10",
    price: "Rp 485.000",
    note: "Minimal order 1 paket",
    category: "Sembako",
  },
  {
    name: "Paket Minuman",
    items: "Air mineral dus × 10, Teh botol × 5, Kopi sachet box × 8",
    price: "Rp 620.000",
    note: "Minimal order 1 paket",
    category: "Minuman",
  },
  {
    name: "Paket Rumah Tangga",
    items: "Sabun cuci × 12, Detergen × 8, Pewangi × 6",
    price: "Rp 390.000",
    note: "Minimal order 1 paket",
    category: "Rumah Tangga",
  },
];

/* ---------- Cara Order ---------- */

export type OrderStep = {
  number: string;
  title: string;
  description: string;
};

export const orderSteps: OrderStep[] = [
  { number: "01", title: "Hubungi Kami", description: "Chat via WhatsApp atau datang langsung ke toko." },
  { number: "02", title: "Konfirmasi Stok & Harga", description: "Kami cek ketersediaan dan berikan harga terbaik." },
  { number: "03", title: "Pembayaran", description: "Transfer bank atau bayar di tempat (COD area tertentu)." },
  { number: "04", title: "Pengiriman", description: "Barang dikirim sesuai jadwal yang disepakati." },
];

/* ---------- Testimoni ---------- */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Harganya jujur dan stok selalu ada. Sudah langganan 3 tahun, pengiriman juga cepat.",
    name: "Budi Santoso",
    role: "Pemilik Warung, Bekasi",
  },
  {
    quote:
      "Pelayanannya ramah. Kalau ada barang kurang langsung dibantu carikan alternatif.",
    name: "Siti Aminah",
    role: "Reseller, Depok",
  },
  {
    quote:
      "Bisa order malam, pagi sudah dikirim. Sangat membantu untuk restock warung.",
    name: "Andi Wijaya",
    role: "Pemilik Toko Kelontong, Jakarta Timur",
  },
];

/* ---------- FAQ ---------- */

export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: "Berapa minimal order?",
    a: "Minimal order biasanya Rp 300.000 atau setara 1 paket. Untuk detail lebih lanjut silakan hubungi kami via WhatsApp.",
  },
  {
    q: "Apakah bisa kirim ke luar kota?",
    a: "Saat ini fokus pengiriman Jabodetabek. Untuk luar kota bisa dibicarakan terlebih dahulu (via ekspedisi).",
  },
  {
    q: "Metode pembayaran apa saja?",
    a: "Transfer bank (BCA, Mandiri, BRI), e-wallet, dan COD untuk area tertentu.",
  },
  {
    q: "Bagaimana cara cek stok terkini?",
    a: "Chat kami di WhatsApp. Tim akan konfirmasi ketersediaan barang secara real-time.",
  },
  {
    q: "Apakah harga sudah termasuk ongkir?",
    a: "Harga belum termasuk ongkir. Ongkir dihitung berdasarkan lokasi dan volume pesanan.",
  },
  {
    q: "Bisa minta nota / faktur?",
    a: "Bisa. Kami sediakan nota pembelian untuk setiap transaksi.",
  },
];
