'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CartItem = { id: string; slug: string; name: string; price: number; color: string; size: string; qty: number; image: string };
type NewCartItem = Omit<CartItem, 'id' | 'qty'>;
type CartContextValue = { items: CartItem[]; add: (item: NewCartItem, qty?: number) => void; remove: (id: string) => void; setQty: (id: string, qty: number) => void; count: number; subtotal: number; open: boolean; setOpen: (open: boolean) => void };
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'ballard-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const stored = localStorage.getItem(storageKey); if (stored) setItems(JSON.parse(stored) as CartItem[]); } catch { /* storage may be unavailable */ } setHydrated(true); }, []);
  useEffect(() => { if (!hydrated) return; try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch { /* storage may be unavailable */ } }, [items, hydrated]);
  const add = useCallback((item: NewCartItem, qty = 1) => { const id = `${item.slug}|${item.color}|${item.size}`; setItems((current) => { const found = current.find((entry) => entry.id === id); return found ? current.map((entry) => entry.id === id ? { ...entry, qty: entry.qty + qty } : entry) : [...current, { ...item, id, qty }]; }); setOpen(true); }, []);
  const remove = useCallback((id: string) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => setItems((current) => qty < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, qty } : item)), []);
  const value = useMemo(() => ({ items, add, remove, setQty, count: items.reduce((total, item) => total + item.qty, 0), subtotal: items.reduce((total, item) => total + item.price * item.qty, 0), open, setOpen }), [items, add, remove, setQty, open]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
