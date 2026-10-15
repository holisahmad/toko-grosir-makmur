import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCategories, getProducts } from "@/lib/sanity/queries";
import { siteConfig, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Halaman katalog: seluruh produk dari Sanity, dengan pencarian (`?q=`)
 * dan filter kategori (`?kategori=`). Filter dikerjakan di server lewat GROQ
 * supaya halaman bisa dibagikan lewat tautan dan tetap jalan tanpa JavaScript.
 */
export const revalidate = 60;

type CatalogParams = {
  q?: string | string[];
  kategori?: string | string[];
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function chipHref(categoryValue: string, search: string): string {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (categoryValue) params.set("kategori", categoryValue);
  const query = params.toString();
  return query ? `/produk?${query}` : "/produk";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<CatalogParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = firstValue(params.q).trim();

  const title = search
    ? `Hasil pencarian “${search}”`
    : "Katalog Produk Grosir";
  const description = search
    ? `Hasil pencarian produk grosir untuk “${search}” di ${siteConfig.name}.`
    : `Katalog grosir sembako dan kebutuhan rumah tangga di ${siteConfig.name}. Lihat harga, isi paket, dan hubungi kami lewat WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: "/produk" },
    // Halaman hasil pencarian isinya tipis dan bisa tak terbatas jumlahnya,
    // jadi tidak perlu diindeks mesin pencari.
    robots: search ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", locale: "id_ID" },
  };
}

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogParams>;
}) {
  const params = await searchParams;
  const search = firstValue(params.q).trim();
  const category = firstValue(params.kategori).trim();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ search, category }),
  ]);

  const activeCategory =
    categories.find((item) => item.filterValue === category) ?? null;
  const isFiltered = Boolean(search || activeCategory);

  return (
    <>
      <Header />
      <main>
        <section className="section-padding bg-background">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
              <Link href="/" className="hover:text-text-primary">
                Beranda
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-text-primary">Katalog</span>
            </nav>

            <div className="mb-8 max-w-2xl">
              <h1 className="mb-3 text-3xl font-semibold tracking-tight">
                Katalog Produk
              </h1>
              <p className="text-text-muted">
                Semua yang kami sediakan untuk warung, toko, dan reseller.
                Gunakan pencarian atau pilih kategori untuk mempersempit daftar.
              </p>
            </div>

            <div className="mb-6 max-w-xl">
              <CatalogSearch initialQuery={search} category={category} />
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href={chipHref("", search)}
                className={cn(
                  "rounded-button border px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory
                    ? "border-border bg-surface text-text-muted hover:text-text-primary"
                    : "border-primary bg-primary text-white"
                )}
              >
                Semua
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.id}
                  href={chipHref(item.filterValue, search)}
                  className={cn(
                    "rounded-button border px-4 py-2 text-sm font-medium transition-colors",
                    activeCategory?.id === item.id
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text-muted hover:text-text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <p className="mb-6 text-sm text-text-muted">
              {products.length} produk
              {activeCategory ? ` di kategori ${activeCategory.name}` : ""}
              {search ? ` untuk pencarian “${search}”` : ""}
            </p>

            {products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showCategory
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-border bg-surface p-8 text-center">
                <h2 className="mb-2 text-lg font-semibold">
                  Produk tidak ditemukan
                </h2>
                <p className="mb-6 text-sm text-text-muted">
                  Coba kata kunci lain, atau lihat seluruh katalog kami.
                </p>
                <Link href="/produk" className="btn-secondary">
                  Lihat semua produk
                </Link>
              </div>
            )}

            {isFiltered && products.length ? (
              <p className="mt-8 text-sm text-text-muted">
                <Link
                  href="/produk"
                  className="font-medium text-primary hover:underline"
                >
                  Tampilkan semua produk
                </Link>
              </p>
            ) : null}

            <div className="mt-12 rounded-card border border-border bg-surface p-8 text-center">
              <h2 className="mb-2 text-lg font-semibold">
                Butuh harga khusus atau jumlah besar?
              </h2>
              <p className="mb-6 text-sm text-text-muted">
                Kirim daftar kebutuhan Anda, kami kirim penawaran dan cek stok.
              </p>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
