"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cartCount,
  orderTotals,
  MAX_QTY,
  EMPTY_CUSTOMER,
  type CartItem,
  type CustomerInfo,
  type OrderableProduct,
} from "@/lib/order";

const STORAGE_KEY = "tgm-cart-v1";

type CartContextValue = {
  items: CartItem[];
  /** Data pembeli (form nama & alamat di panel) — bukan bagian daftar item. */
  customer: CustomerInfo;
  /** Total jumlah semua item (untuk badge). */
  count: number;
  total: number;
  hasUnknownPrice: boolean;
  hasKnownPrice: boolean;
  /** true setelah localStorage selesai dibaca. */
  ready: boolean;
  add: (product: OrderableProduct, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setCustomerName: (name: string) => void;
  setCustomerAddress: (address: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number): number {
  return Math.min(Math.max(Math.round(qty), 1), MAX_QTY);
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.qty === "number" &&
    Number.isFinite(item.qty) &&
    item.qty > 0 &&
    (item.price === null || typeof item.price === "number")
  );
}

/**
 * Baca data tersimpan. Data lama atau rusak diabaikan sebagian, bukan
 * membuat halaman gagal — daftar pesanan bukan data kritis.
 *
 * Format lama (tanpa field `customer`) tetap terbaca: customer diisi kosong.
 */
function readStoredCart(): { items: CartItem[]; customer: CustomerInfo } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], customer: EMPTY_CUSTOMER };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null)
      return { items: [], customer: EMPTY_CUSTOMER };
    const stored = parsed as { items?: unknown; customer?: unknown };
    const items = Array.isArray(stored.items)
      ? stored.items.filter(isCartItem).map((item) => ({
          ...item,
          qty: clampQty(item.qty),
        }))
      : [];
    const rawCustomer =
      typeof stored.customer === "object" && stored.customer !== null
        ? (stored.customer as Partial<CustomerInfo>)
        : {};
    return {
      items,
      customer: {
        name:
          typeof rawCustomer.name === "string" ? rawCustomer.name : "",
        address:
          typeof rawCustomer.address === "string" ? rawCustomer.address : "",
      },
    };
  } catch {
    return { items: [], customer: EMPTY_CUSTOMER };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [ready, setReady] = useState(false);

  // Dibaca setelah mount, bukan saat render pertama, supaya HTML dari server
  // dan hasil hidrasi di browser identik.
  useEffect(() => {
    const stored = readStoredCart();
    setItems(stored.items);
    setCustomer(stored.customer);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, items, customer })
      );
    } catch {
      // localStorage bisa diblokir (mode privat) — daftar tetap jalan di memori.
    }
  }, [items, customer, ready]);

  const add = useCallback((product: OrderableProduct, qty = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (!existing) return [...current, { ...product, qty: clampQty(qty) }];
      return current.map((item) =>
        item.id === product.id
          ? // Nama & harga diambil dari data terbaru, jumlahnya ditambahkan.
            { ...item, ...product, qty: clampQty(item.qty + qty) }
          : item
      );
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: clampQty(qty) } : item
      )
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  // "Kosongkan" hanya menghapus item; nama & alamat pembeli dipertahankan
  // supaya pembeli lama tidak perlu mengetik ulang.
  const clear = useCallback(() => setItems([]), []);

  const setCustomerName = useCallback((name: string) => {
    setCustomer((current) => ({ ...current, name }));
  }, []);

  const setCustomerAddress = useCallback((address: string) => {
    setCustomer((current) => ({ ...current, address }));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totals = orderTotals(items);
    return {
      items,
      customer,
      count: cartCount(items),
      total: totals.total,
      hasUnknownPrice: totals.hasUnknownPrice,
      hasKnownPrice: totals.hasKnownPrice,
      ready,
      add,
      setQty,
      remove,
      clear,
      setCustomerName,
      setCustomerAddress,
    };
  }, [
    items,
    customer,
    ready,
    add,
    setQty,
    remove,
    clear,
    setCustomerName,
    setCustomerAddress,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>");
  }
  return context;
}
