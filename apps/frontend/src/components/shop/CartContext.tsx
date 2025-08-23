"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { CartItem, Product } from "./types";

type CartCtx = {
  // state
  items: CartItem[];
  subtotal: number;     // EUR (gerundet auf 2 Nachkommastellen)
  count: number;        // Summe aller Stückzahlen
  isEmpty: boolean;

  // item ops
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  inc: (productId: string, step?: number) => void;
  dec: (productId: string, step?: number) => void;
  getItemQty: (productId: string) => number;
  clear: () => void;

  // UI (Drawer)
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

// LocalStorage-Key
const LS_KEY = "pasiggi.cart.v1";

// ---------- helpers ----------
const clampQty = (n: number) => Math.max(0, Math.floor(Number(n) || 0));
const toCents = (eur: number) => Math.round((Number(eur) || 0) * 100);
const fromCents = (cents: number) => Math.round(cents) / 100;

// ---------- provider ----------
export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initial laden
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        // Defensive Validation
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter((it) => it && it.product && typeof it.product.id === "string")
              .map((it) => ({ ...it, qty: clampQty(it.qty) || 1 }))
          );
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Speichern + minimal debouncen
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_KEY, JSON.stringify(items));
        }
      } catch {
        // ignore write errors
      }
    }, 50);
    return () => clearTimeout(id);
  }, [items]);

  // Tab-Sync: wenn in einem anderen Tab geändert wird
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as CartItem[];
          if (Array.isArray(parsed)) {
            setItems(
              parsed
                .filter((it) => it && it.product && typeof it.product.id === "string")
                .map((it) => ({ ...it, qty: clampQty(it.qty) || 1 }))
            );
          }
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // --- UI controls ---
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  // --- item helpers ---
  const getItemQty = useCallback(
    (productId: string) => items.find((it) => it.product.id === productId)?.qty ?? 0,
    [items]
  );

  const add = useCallback((product: Product, qty: number = 1) => {
    const incBy = clampQty(qty) || 1;
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + incBy };
        return next;
      }
      return [...prev, { product, qty: incBy }];
    });
    openCart(); // Sidebar sofort öffnen
  }, [openCart]);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const q = clampQty(qty);
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === productId);
      if (i === -1) return prev;
      if (q <= 0) {
        // qty 0 => entfernen
        const copy = [...prev];
        copy.splice(i, 1);
        return copy;
        }
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const inc = useCallback((productId: string, step: number = 1) => {
    const s = clampQty(step) || 1;
    setItems((prev) =>
      prev.map((it) =>
        it.product.id === productId ? { ...it, qty: it.qty + s } : it
      )
    );
  }, []);

  const dec = useCallback((productId: string, step: number = 1) => {
    const s = clampQty(step) || 1;
    setItems((prev) =>
      prev
        .map((it) =>
          it.product.id === productId ? { ...it, qty: Math.max(0, it.qty - s) } : it
        )
        .filter((it) => it.qty > 0) // 0 => raus
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  // --- derived values ---
  const { subtotal, count, isEmpty } = useMemo(() => {
    const cents = items.reduce((sum, it) => sum + toCents(it.product.price) * it.qty, 0);
    const subtotalEur = fromCents(cents);
    const totalCount = items.reduce((s, it) => s + it.qty, 0);
    return {
      subtotal: subtotalEur,
      count: totalCount,
      isEmpty: totalCount === 0,
    };
  }, [items]);

  const value: CartCtx = useMemo(
    () => ({
      items,
      subtotal,
      count,
      isEmpty,

      add,
      remove,
      setQty,
      inc,
      dec,
      getItemQty,
      clear,

      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, subtotal, count, isEmpty, add, remove, setQty, inc, dec, getItemQty, isOpen, openCart, closeCart, toggleCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
