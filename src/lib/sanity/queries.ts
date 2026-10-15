import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";
import { urlForImage } from "./image";
import { formatRupiah } from "@/lib/format";
import { slugify } from "@/lib/slug";
import {
  categories as staticCategories,
  packages as staticPackages,
} from "@/lib/content";

export type CategoryView = {
  id: string;
  name: string;
  note: string;
  /** URL gambar; kosong berarti tidak ada gambar (komponen render placeholder). */
  imageUrl: string;
  /**
   * Nilai untuk URL filter katalog (`/produk?kategori=…`).
   * Slug kalau sudah diisi di panel admin, kalau belum pakai ID dokumen —
   * supaya filter tetap berfungsi walau slug belum dibuat.
   */
  filterValue: string;
};

export type ProductView = {
  id: string;
  /** Slug halaman detail; fallback ke slugify(nama) kalau belum diisi. */
  slug: string;
  name: string;
  items: string;
  description: string;
  /** Harga mentah untuk data terstruktur (JSON-LD). */
  price: number | null;
  /** Harga siap tampil, mis. "Rp 485.000". Kosong = hubungi kami. */
  priceLabel: string;
  note: string;
  imageUrl: string | null;
  categoryFilterValue: string | null;
  categoryName: string | null;
};

const CATEGORIES_QUERY = /* groq */ `
  *[_type == "category"] | order(order asc, name asc){
    _id, name, note, image, "slugCurrent": slug.current
  }
`;

/**
 * Daftar produk dengan filter opsional.
 *
 * Kedua parameter SELALU dikirim sebagai string ("" = tanpa filter).
 * Alasannya: API Sanity menolak query yang memakai parameter yang tidak
 * dikirim sama sekali ("param $search referenced, but not provided"),
 * jadi pola `!defined(...)` berisiko gagal. Satu query ini melayani katalog
 * penuh, hasil pencarian, dan filter kategori.
 */
const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"
    && ($category == "" || category->slug.current == $category || category->_id == $category)
    && ($search == ""
        || name match "*" + $search + "*"
        || coalesce(items, "") match "*" + $search + "*"
        || coalesce(description, "") match "*" + $search + "*"
        || coalesce(note, "") match "*" + $search + "*")
  ] | order(order asc, name asc){
    _id, name, items, description, price, note, image,
    "slugCurrent": slug.current,
    "categoryFilterValue": coalesce(category->slug.current, category->_id),
    "categoryName": category->name
  }
`;

const PRODUCT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "product" && (slug.current == $slug || _id == $slug)][0]{
    _id, name, items, description, price, note, image,
    "slugCurrent": slug.current,
    "categoryFilterValue": coalesce(category->slug.current, category->_id),
    "categoryName": category->name
  }
`;

type RawCategory = {
  _id: string;
  name: string;
  note?: string;
  image?: SanityImageSource;
  slugCurrent?: string | null;
};

type RawProduct = {
  _id: string;
  name: string;
  items?: string;
  description?: string;
  price?: number;
  note?: string;
  image?: SanityImageSource;
  slugCurrent?: string | null;
  categoryFilterValue?: string | null;
  categoryName?: string | null;
};

/** Gambar lokal dari content.ts, dicocokkan berdasarkan nama (fallback sementara). */
function staticCategoryImage(name: string): string {
  return (
    staticCategories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    )?.image ?? ""
  );
}

function toProductView(raw: RawProduct): ProductView {
  return {
    id: raw._id,
    slug: raw.slugCurrent?.trim() || slugify(raw.name),
    name: raw.name,
    items: raw.items ?? "",
    description: raw.description ?? "",
    price: typeof raw.price === "number" ? raw.price : null,
    priceLabel: formatRupiah(raw.price),
    note: raw.note ?? "",
    imageUrl: urlForImage(raw.image),
    categoryFilterValue: raw.categoryFilterValue ?? null,
    categoryName: raw.categoryName ?? null,
  };
}

/* ---------- Fallback statis (dipakai saat Sanity belum dikonfigurasi) ---------- */

function fallbackCategories(): CategoryView[] {
  return staticCategories.map((c) => ({
    id: c.name,
    name: c.name,
    note: c.note,
    imageUrl: c.image,
    filterValue: slugify(c.name),
  }));
}

function fallbackProducts(options: ProductFilter = {}): ProductView[] {
  const search = options.search?.trim().toLowerCase();
  const category = options.category?.trim();

  return staticPackages
    .map((p) => ({
      id: p.name,
      slug: slugify(p.name),
      name: p.name,
      items: p.items,
      description: "",
      price: null,
      priceLabel: p.price,
      note: p.note,
      imageUrl: null,
      categoryFilterValue: p.category ? slugify(p.category) : null,
      categoryName: p.category ?? null,
    }))
    .filter((p) => {
      if (category && p.categoryFilterValue !== category) return false;
      if (!search) return true;
      return `${p.name} ${p.items} ${p.note}`.toLowerCase().includes(search);
    });
}

export type ProductFilter = {
  /** Kata kunci pencarian bebas. */
  search?: string;
  /** filterValue kategori (slug atau ID dokumen). */
  category?: string;
};

/* ---------- Fungsi publik ---------- */

/**
 * Ambil kategori dari Sanity. Jika Sanity belum dikonfigurasi, kosong,
 * atau gagal, kembalikan konten statis dari `src/lib/content.ts`.
 */
export async function getCategories(): Promise<CategoryView[]> {
  if (!client) return fallbackCategories();
  try {
    const data = await client.fetch<RawCategory[]>(CATEGORIES_QUERY);
    if (!data?.length) return fallbackCategories();
    return data.map((c) => ({
      id: c._id,
      name: c.name,
      note: c.note ?? "",
      // Pakai gambar upload Sanity; jika belum ada, pakai gambar lokal
      // agar tampilan tidak kosong.
      imageUrl: urlForImage(c.image) ?? staticCategoryImage(c.name),
      filterValue: c.slugCurrent?.trim() || c._id,
    }));
  } catch {
    return fallbackCategories();
  }
}

/**
 * Ambil produk dari Sanity dengan pencarian & filter kategori.
 *
 * Saat ada filter aktif, hasil kosong berarti memang tidak ada yang cocok
 * (bukan alasan untuk menampilkan konten statis).
 */
export async function getProducts(
  options: ProductFilter = {}
): Promise<ProductView[]> {
  const search = options.search?.trim();
  const category = options.category?.trim();
  const filtered = Boolean(search || category);

  if (!client) return fallbackProducts(options);

  try {
    const data = await client.fetch<RawProduct[]>(PRODUCTS_QUERY, {
      search: search ?? "",
      category: category ?? "",
    });
    if (!data?.length) return filtered ? [] : fallbackProducts();
    return data.map(toProductView);
  } catch {
    return fallbackProducts(options);
  }
}

/** Ambil satu produk berdasarkan slug (atau ID dokumen). */
export async function getProductBySlug(
  slug: string
): Promise<ProductView | null> {
  const key = slug.trim();
  if (!key) return null;

  if (!client) {
    return (
      fallbackProducts().find(
        (p) => p.slug === key || p.id.toLowerCase() === key.toLowerCase()
      ) ?? null
    );
  }

  try {
    const data = await client.fetch<RawProduct | null>(PRODUCT_BY_SLUG_QUERY, {
      slug: key,
    });
    return data ? toProductView(data) : null;
  } catch {
    return null;
  }
}

/**
 * Produk lain di kategori yang sama — untuk bagian "Produk terkait"
 * di halaman detail. Mengembalikan array kosong kalau tidak ada.
 */
export async function getRelatedProducts(
  product: ProductView,
  limit = 3
): Promise<ProductView[]> {
  if (!product.categoryFilterValue) return [];
  const sameCategory = await getProducts({
    category: product.categoryFilterValue,
  });
  return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
}

/** Dipakai halaman detail untuk daftar prarilis (generateStaticParams). */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}
