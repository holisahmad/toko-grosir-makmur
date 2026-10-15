"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Kotak pencarian katalog.
 *
 * Hasil tetap dirender di server: setelah berhenti mengetik (300 ms), URL
 * diperbarui dan halaman mengambil ulang data dari Sanity. Kategori yang
 * sedang aktif ikut dipertahankan. Formulir ini juga tetap berfungsi tanpa
 * JavaScript (tombolnya submit ke /produk).
 */
export function CatalogSearch({
  initialQuery,
  category,
}: {
  initialQuery: string;
  category: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  // Kategori disimpan di ref supaya perubahan kategori (klik chip) tidak
  // memicu navigasi ulang dari efek ini.
  const categoryRef = useRef(category);
  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      if (categoryRef.current) params.set("kategori", categoryRef.current);
      const query = params.toString();
      router.replace(query ? `/produk?${query}` : "/produk", { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <form
      role="search"
      action="/produk"
      onSubmit={(event) => event.preventDefault()}
      className="relative"
    >
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari produk, mis. beras atau minuman"
        aria-label="Cari produk"
        className="w-full rounded-button border border-border bg-surface py-3 pl-11 pr-11 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      {category ? <input type="hidden" name="kategori" value={category} /> : null}
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-button p-1 text-text-muted transition-colors hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </form>
  );
}
