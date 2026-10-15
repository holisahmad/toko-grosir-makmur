"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { MAX_QTY, type OrderableProduct } from "@/lib/order";

const FEEDBACK_MS = 1600;

/**
 * Tombol "Tambah" ke daftar pesanan.
 *
 * Kedua varian punya pengatur jumlah, supaya pembeli bisa langsung menambah
 * lebih dari satu tanpa membuka halaman detail:
 *
 * - `compact`: untuk kartu katalog — stepper kecil + tombol "Tambah";
 *   jumlah kembali ke 1 setelah produk masuk daftar.
 * - `full`: untuk halaman detail — stepper besar + tombol "Tambah ke daftar".
 */
export function AddToCartButton({
  product,
  variant = "compact",
}: {
  product: OrderableProduct;
  variant?: "compact" | "full";
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    add(product, qty);
    setAdded(true);
    // Kartu: kembalikan ke 1 supaya penambahan berikutnya dimulai dari awal.
    if (variant === "compact") setQty(1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), FEEDBACK_MS);
  }

  /** "3×" untuk label; "" kalau jumlah 1 supaya label tetap ringkas. */
  const qtyLabel = qty > 1 ? `${qty}× ` : "";

  if (variant === "full") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-button border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setQty((current) => Math.max(1, current - 1))}
            disabled={qty <= 1}
            aria-label="Kurangi jumlah"
            className="rounded-button p-2 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span aria-live="polite" className="w-9 text-center text-sm font-medium">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((current) => Math.min(MAX_QTY, current + 1))}
            disabled={qty >= MAX_QTY}
            aria-label="Tambah jumlah"
            className="rounded-button p-2 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button type="button" onClick={handleAdd} className="btn-secondary">
          {added ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {added ? "Masuk daftar" : "Tambah ke daftar pesanan"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-button border border-border bg-surface p-0.5">
        <button
          type="button"
          onClick={() => setQty((current) => Math.max(1, current - 1))}
          disabled={qty <= 1}
          aria-label={`Kurangi jumlah ${product.name}`}
          className="rounded-button p-2 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span aria-live="polite" className="w-6 text-center text-xs font-medium">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((current) => Math.min(MAX_QTY, current + 1))}
          disabled={qty >= MAX_QTY}
          aria-label={`Tambah jumlah ${product.name}`}
          className="rounded-button p-2 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        aria-label={
          added
            ? `${product.name} masuk daftar pesanan`
            : `Tambah ${qtyLabel}${product.name} ke daftar pesanan`
        }
        className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {added ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
        {added ? "Masuk" : "Tambah"}
      </button>
    </div>
  );
}
