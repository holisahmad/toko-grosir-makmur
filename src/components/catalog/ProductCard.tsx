import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { ProductView } from "@/lib/sanity/queries";

/**
 * Kartu produk — dipakai di katalog, "Produk terkait", dan teaser halaman depan.
 *
 * Tautan dan tombol "Tambah" sengaja dipisah (tombol tidak di dalam tautan)
 * supaya menambahkan produk tidak sekaligus membuka halaman detail.
 */
export function ProductCard({
  product,
  showCategory = false,
}: {
  product: ProductView;
  showCategory?: boolean;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-border bg-background transition-colors hover:border-text-muted">
      <Link
        href={`/produk/${encodeURIComponent(product.slug)}`}
        className="flex flex-1 flex-col"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={640}
            height={400}
            className="h-40 w-full object-cover"
          />
        ) : null}
        <div className="flex flex-1 flex-col p-6">
          {showCategory && product.categoryName ? (
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              {product.categoryName}
            </p>
          ) : null}
          <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-text-muted">
            {product.items}
          </p>
        </div>
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-border px-6 py-4">
        <div className="min-w-0">
          <p className="text-2xl font-semibold text-text-primary">
            {product.priceLabel || "Hubungi kami"}
          </p>
          {product.note ? (
            <p className="mt-1 text-xs text-text-muted">{product.note}</p>
          ) : null}
        </div>
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
          }}
        />
      </div>
    </div>
  );
}
