import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/sanity/queries";

export async function KategoriProduk() {
  const categories = await getCategories();

  return (
    <section id="produk" className="section-padding bg-background">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Kategori Produk
          </h2>
          <p className="text-text-muted">
            Berbagai kebutuhan warung dan toko dalam satu tempat. Klik kategori
            untuk melihat produknya.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produk?kategori=${encodeURIComponent(cat.filterValue)}`}
              className="group flex items-center gap-4 rounded-card border border-border bg-surface p-6 transition-colors hover:border-text-muted"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-button border border-border bg-background">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                <p className="text-sm text-text-muted">{cat.note}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          Lihat semua yang kami sediakan di{" "}
          <Link href="/produk" className="font-medium text-primary hover:underline">
            halaman katalog
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
