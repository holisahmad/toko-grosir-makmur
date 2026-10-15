"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatRupiah } from "@/lib/format";
import { orderMessage, MAX_QTY } from "@/lib/order";
import { waLink } from "@/lib/site";

const stepperButton =
  "rounded-button border border-border p-1.5 text-text-muted transition-colors hover:text-text-primary disabled:opacity-40";

/**
 * Tombol melayang + panel daftar pesanan pembeli.
 *
 * Dipasang sekali di root layout. Tersembunyi saat daftar masih kosong dan
 * di halaman panel admin (`/studio`), yang punya UI sendiri.
 */
export function CartWidget() {
  const pathname = usePathname();
  const {
    items,
    customer,
    count,
    total,
    hasUnknownPrice,
    hasKnownPrice,
    ready,
    setQty,
    remove,
    clear,
    setCustomerName,
    setCustomerAddress,
  } = useCart();
  const [open, setOpen] = useState(false);

  const isStudio = pathname?.startsWith("/studio") ?? false;
  // Panel admin Sanity punya UI sendiri; daftar kosong juga tidak perlu tombol.
  const visible = !isStudio && ready && count > 0;

  useEffect(() => {
    // Kunci gulir hanya saat panel benar-benar tampil. Kalau daftar dikosongkan
    // ketika panelterbuka, `visible` jadi false dan kunci gulir ikut dilepas —
    // tanpa ini halaman jadi tidak bisa di-scroll.
    if (!open || !visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, visible]);

  if (!visible) return null;

  // Tombol kirim aktif hanya kalau nama & alamat terisi, supaya pesan yang
  // terkirim ke toko selalu lengkap — tidak ada baris kosong yang menunggu
  // diisi pembeli di dalam chat.
  const customerComplete =
    customer.name.trim() !== "" && customer.address.trim() !== "";
  const message = orderMessage(items, customer);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Buka daftar pesanan (${count} item)`}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-soft transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Daftar pesanan
        <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-semibold">
          {count}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Tutup daftar pesanan"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-text-primary/40"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Daftar pesanan"
            className="relative flex h-full w-full max-w-md flex-col bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold">Daftar pesanan</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="rounded-button p-2 text-text-muted transition-colors hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="border-b border-border px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-text-primary">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {item.price != null
                          ? `${formatRupiah(item.price)} × ${item.qty} = ${formatRupiah(item.price * item.qty)}`
                          : "Harga menyusul"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Hapus ${item.name}`}
                      className="rounded-button p-1.5 text-text-muted transition-colors hover:text-text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label={`Kurangi jumlah ${item.name}`}
                      className={stepperButton}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      disabled={item.qty >= MAX_QTY}
                      aria-label={`Tambah jumlah ${item.name}`}
                      className={stepperButton}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
                Data pemesan
              </p>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="cart-customer-name"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Nama pemesan
                  </label>
                  <input
                    id="cart-customer-name"
                    type="text"
                    value={customer.name}
                    onChange={(event) => setCustomerName(event.target.value)}
                    maxLength={60}
                    autoComplete="name"
                    placeholder="mis. Budi Santoso"
                    className="w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cart-customer-address"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Alamat pengiriman
                  </label>
                  <input
                    id="cart-customer-address"
                    type="text"
                    value={customer.address}
                    onChange={(event) =>
                      setCustomerAddress(event.target.value)
                    }
                    maxLength={300}
                    autoComplete="street-address"
                    placeholder="mis. Jl. Melati No. 5, Jakarta Timur"
                    className="w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  {hasKnownPrice ? "Estimasi total" : "Total"}
                </span>
                <span className="text-lg font-semibold text-text-primary">
                  {hasKnownPrice ? formatRupiah(total) : "Harga menyusul"}
                </span>
              </div>
              <p className="mb-4 text-xs text-text-muted">
                {hasUnknownPrice ? "Sebagian harga menyusul. " : ""}Belum
                termasuk ongkir — kami konfirmasi lewat WhatsApp.
              </p>

              {customerComplete ? (
                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Kirim daftar via WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn-primary w-full disabled:pointer-events-none disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Kirim daftar via WhatsApp
                </button>
              )}

              {!customerComplete ? (
                <p className="mt-2 text-xs text-text-muted">
                  Isi nama & alamat pengiriman dulu supaya pesanan langsung
                  lengkap.
                </p>
              ) : null}

              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full rounded-button px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Kosongkan daftar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
