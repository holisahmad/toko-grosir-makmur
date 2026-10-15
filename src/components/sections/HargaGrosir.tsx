import Link from "next/link";
import { waLink } from "@/lib/site";
import { getProducts } from "@/lib/sanity/queries";
import { ProductCard } from "@/components/catalog/ProductCard";

/** Jumlah produk yang ditampilkan sebagai teaser di halaman depan. */
const TEASER_COUNT = 3;

export async function HargaGrosir() {
  const packages = (await getProducts()).slice(0, TEASER_COUNT);

  return (
    <section id="harga" className="section-padding bg-surface">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Contoh Harga Grosir
          </h2>
          <p className="text-text-muted">
            Harga dapat berubah sewaktu-waktu. Hubungi kami untuk update terbaru.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <ProductCard key={pkg.id} product={pkg} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-text-muted">
          <Link href="/produk" className="btn-secondary">
            Lihat katalog lengkap
          </Link>
          <p>
            Ingin harga custom atau cek stok spesifik?{" "}
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Chat kami sekarang
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
