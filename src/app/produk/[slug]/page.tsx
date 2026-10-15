import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/sanity/queries";
import { siteConfig, waLink } from "@/lib/site";

/**
 * Halaman detail produk.
 * Slug berasal dari field `slug` di Sanity; kalau belum diisi, kode memakai
 * slug hasil `slugify(nama)` sehingga tautan dari katalog tetap konsisten.
 */
export const revalidate = 60;

type DetailParams = { slug: string };

function productDescription(
  product: { description: string; items: string; name: string }
): string {
  const text =
    product.description || product.items || `Produk grosir ${product.name}`;
  return text.replace(/\s+/g, " ").trim().slice(0, 160);
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DetailParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk tidak ditemukan",
      robots: { index: false, follow: true },
    };
  }

  const description = productDescription(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      locale: "id_ID",
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: product.name }]
        : undefined,
    },
  };
}

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<DetailParams>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const description = productDescription(product);

  // Data terstruktur supaya mesin pencari menampilkan harga & nama produk.
  // `availability` sengaja tidak diisi: stok belum dilacak di panel admin.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    ...(product.imageUrl ? { image: [product.imageUrl] } : {}),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "IDR",
            url: `${siteConfig.url}/produk/${product.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          // Data berasal dari CMS sendiri; escape "<" agar tidak bisa
          // menutup tag script lebih awal.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <section className="section-padding bg-background">
          <div className="container-page">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-text-muted">
              <Link href="/" className="hover:text-text-primary">
                Beranda
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <Link href="/produk" className="hover:text-text-primary">
                Katalog
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-text-primary">{product.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-2">
              {product.imageUrl ? (
                <div className="overflow-hidden rounded-card border border-border bg-surface">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={640}
                    height={640}
                    priority
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ) : (
                // Tanpa foto, jangan sisakan kotak kosong setinggi layar:
                // pembatasnya tetap ringkas dan baru mengisi kolom di desktop.
                <div className="flex items-center justify-center rounded-card border border-dashed border-border bg-surface p-10 text-center text-sm text-text-muted lg:aspect-square">
                  Belum ada foto produk. Pemilik toko bisa menambahkannya dari
                  panel admin.
                </div>
              )}

              <div>
                {product.categoryName ? (
                  <Link
                    href={
                      product.categoryFilterValue
                        ? `/produk?kategori=${encodeURIComponent(product.categoryFilterValue)}`
                        : "/produk"
                    }
                    className="mb-3 inline-block text-xs font-medium uppercase tracking-wide text-primary hover:underline"
                  >
                    {product.categoryName}
                  </Link>
                ) : null}

                <h1 className="mb-4 text-3xl font-semibold tracking-tight">
                  {product.name}
                </h1>

                <p className="mb-6 text-3xl font-semibold text-text-primary">
                  {product.priceLabel || "Hubungi kami untuk harga"}
                </p>

                <dl className="mb-8 space-y-4 border-y border-border py-6 text-sm">
                  {product.items ? (
                    <div>
                      <dt className="mb-1 font-medium text-text-primary">
                        Isi / kemasan
                      </dt>
                      <dd className="leading-relaxed text-text-muted">
                        {product.items}
                      </dd>
                    </div>
                  ) : null}
                  {product.note ? (
                    <div>
                      <dt className="mb-1 font-medium text-text-primary">
                        Catatan
                      </dt>
                      <dd className="leading-relaxed text-text-muted">
                        {product.note}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {product.description ? (
                  <p className="mb-8 leading-relaxed text-text-muted">
                    {product.description}
                  </p>
                ) : null}

                <div className="mb-6">
                  <AddToCartButton
                    variant="full"
                    product={{
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={waLink(`Halo, saya ingin order ${product.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Order via WhatsApp
                  </a>
                  <Link href="/produk" className="btn-secondary">
                    Kembali ke katalog
                  </Link>
                </div>
              </div>
            </div>

            {related.length ? (
              <div className="mt-16">
                <h2 className="mb-6 text-xl font-semibold tracking-tight">
                  Produk terkait
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
