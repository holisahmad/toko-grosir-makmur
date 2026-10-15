import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="section-padding bg-background">
        <div className="container-page">
          <div className="mx-auto max-w-xl rounded-card border border-border bg-surface p-10 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-text-muted">
              Halaman tidak ditemukan
            </p>
            <h1 className="mb-4 text-2xl font-semibold tracking-tight">
              Produk atau halaman ini tidak tersedia
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-text-muted">
              Mungkin tautannya berubah atau barangnya sudah tidak kami
              sediakan. Coba lihat katalog kami.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/produk" className="btn-primary">
                Lihat katalog
              </Link>
              <Link href="/" className="btn-secondary">
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
