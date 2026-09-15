'use client';

/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import { useEffect } from 'react';
import { useCart } from './CartProvider';

const formatPrice = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal, count } = useCart();
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, setOpen]);

  return <div aria-hidden={!open} className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`}>
    <button type="button" aria-label="Close bag" onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
    <aside role="dialog" aria-modal="true" aria-label="Your bag" className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between border-b hairline px-5 py-4"><h2 className="text-lg font-semibold">Bag ({count})</h2><button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-paper-2" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
      <div className="flex-1 overflow-y-auto px-5">{items.length === 0 ? <div className="py-16 text-center"><p className="text-sm text-ink-2">Your bag is empty.</p><a href="/shop/mens" onClick={() => setOpen(false)} className="btn btn-primary mt-6">Shop men&apos;s</a></div> : <ul className="divide-y hairline">{items.map((item) => <li key={item.id} className="flex gap-4 py-4"><div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-paper-2"><img src={item.image} alt={item.name} className="h-full w-full object-cover" /></div><div className="flex flex-1 flex-col"><div className="flex justify-between gap-2"><a href={`/products/${item.slug}`} onClick={() => setOpen(false)} className="text-sm font-medium hover:underline underline-offset-4">{item.name}</a><span className="text-sm">{formatPrice(item.price * item.qty)}</span></div><p className="mt-0.5 text-xs text-ink-3">{item.color} · {item.size}</p><div className="mt-auto flex items-center justify-between"><div className="inline-flex items-center rounded-full border hairline"><button type="button" aria-label="Decrease quantity" onClick={() => setQty(item.id, item.qty - 1)} className="h-8 w-8 text-lg leading-none">−</button><span className="w-6 text-center text-sm tabular-nums">{item.qty}</span><button type="button" aria-label="Increase quantity" onClick={() => setQty(item.id, item.qty + 1)} className="h-8 w-8 text-lg leading-none">+</button></div><button type="button" onClick={() => remove(item.id)} className="text-xs text-ink-3 underline underline-offset-4 hover:text-ink">Remove</button></div></div></li>)}</ul>}</div>
      {items.length > 0 && <div className="border-t hairline px-5 py-4"><div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div><p className="mt-1 text-xs text-ink-3">Shipping and tax calculated at checkout. Free shipping over $99.</p><a href="/cart" onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">Review bag</a></div>}
    </aside>
  </div>;
}
