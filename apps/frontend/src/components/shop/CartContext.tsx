"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "./types";

type CartCtx = {
  items: CartItem[];
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;

  // NEW: Drawer-Steuerung global
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);
const LS_KEY = "pasiggi.cart.v1";

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const add = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { product, qty }];
    });
    openCart(); // ← NEW: beim Hinzufügen sofort Sidebar öffnen
  };

  const remove = (productId: string) => setItems((prev) => prev.filter((it) => it.product.id !== productId));
  const setQty = (productId: string, qty: number) =>
    setItems((prev) => prev.map((it) => (it.product.id === productId ? { ...it, qty } : it)));
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.product.price * it.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, subtotal, add, remove, setQty, clear, isOpen, openCart, closeCart }),
    [items, subtotal, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
