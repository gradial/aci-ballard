'use client';
/* eslint-disable @next/next/no-html-link-for-pages, aci-rules/no-raw-tailwind-values */

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ContentProps } from '@/cms/contracts/components/productListing.contract';
import { CommerceProductCard } from './CommerceProductCard';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'newest';

function priceValue(price: string) { return Number(price.replace(/[^0-9.]/g, '')); }

function Chevron({ className = '' }: { className?: string }) {
  return <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={`shrink-0 transition-transform ${className}`}><path d="M2 5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Disclosure({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="border-b hairline"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[length:var(--text-15)] font-medium"><span>{title}</span><Chevron className={open ? 'rotate-180' : ''} /></button>{open && <div className="pb-4 text-sm leading-relaxed text-ink-2">{children}</div>}</div>;
}

export function ProductListing({ breadcrumb, heading, description, categories, products }: ContentProps) {
  const categoryOptions = categories.map((category) => typeof category === 'string' ? { label: category, key: category === 'All' ? '' : category } : category);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [condition, setCondition] = useState('');
  const [material, setMaterial] = useState('');
  const [queryReady, setQueryReady] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setSelectedCategory(query.get('sub') ?? ''); setCondition(query.get('condition') ?? ''); setMaterial(query.get('material') ?? '');
    setColors(query.getAll('color')); setSizes(query.getAll('size')); setQueryReady(true);
  }, []);
  useEffect(() => { if (!queryReady) return; const query = new URLSearchParams(); if (selectedCategory) query.set('sub', selectedCategory); if (condition) query.set('condition', condition); if (material) query.set('material', material); colors.forEach((color) => query.append('color', color)); sizes.forEach((size) => query.append('size', size)); window.history.replaceState(null, '', `${window.location.pathname}${query.size ? `?${query}` : ''}`); }, [queryReady, selectedCategory, condition, material, colors, sizes]);
  const categoryProducts = useMemo(() => selectedCategory === '' ? products : products.filter((product) => product.category === selectedCategory), [products, selectedCategory]);
  const filtered = useMemo(() => {
    const list = categoryProducts.filter((product) => (colors.length === 0 || product.colors.some((color) => colors.includes(color))) && (sizes.length === 0 || product.sizes?.some((size) => sizes.includes(size))) && (!condition || product.conditions?.includes(condition)) && (!material || product.materials?.includes(material)));
    if (sort === 'price-asc') return [...list].sort((a, b) => priceValue(a.price) - priceValue(b.price));
    if (sort === 'price-desc') return [...list].sort((a, b) => priceValue(b.price) - priceValue(a.price));
    if (sort === 'newest') return [...list].sort((a, b) => Number(Boolean(b.badge?.toLowerCase().includes('new'))) - Number(Boolean(a.badge?.toLowerCase().includes('new'))));
    return list;
  }, [categoryProducts, colors, sizes, condition, material, sort]);
  const allColors = useMemo(() => Array.from(new Set(products.flatMap((product) => product.colors))), [products]);
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes ?? []))), [products]);
  const allConditions = useMemo(() => Array.from(new Set(products.flatMap((product) => product.conditions ?? []))), [products]);
  const allMaterials = useMemo(() => Array.from(new Set(products.flatMap((product) => product.materials ?? []))), [products]);
  const activeCount = Number(selectedCategory !== '') + colors.length + sizes.length + Number(Boolean(condition)) + Number(Boolean(material));
  const clearFilters = () => { setSelectedCategory(''); setColors([]); setSizes([]); setCondition(''); setMaterial(''); };
  const toggleColor = (color: string) => setColors((current) => current.includes(color) ? current.filter((item) => item !== color) : [...current, color]);
  const filters = (
    <div className="text-sm">
      <Disclosure title="Category" defaultOpen><ul className="space-y-2">{categoryOptions.filter((category) => category.key).map((category) => <li key={category.key}><button type="button" onClick={() => setSelectedCategory((current) => current === category.key ? '' : category.key)} className={`flex items-center gap-2 ${selectedCategory === category.key ? 'font-semibold text-ink' : ''}`}><span className={`h-4 w-4 rounded border ${selectedCategory === category.key ? 'border-ink bg-ink' : 'border-line'}`} aria-hidden="true" />{category.label}</button></li>)}</ul></Disclosure>
      <Disclosure title="Condition"><ul className="space-y-2">{allConditions.map((item) => <li key={item}><button type="button" onClick={() => setCondition((value) => value === item ? '' : item)} className="flex items-center gap-2"><span className={`h-4 w-4 rounded border ${condition === item ? 'border-ink bg-ink' : 'border-line'}`} />{item}</button></li>)}</ul></Disclosure>
      <Disclosure title="Size"><div className="flex flex-wrap gap-2">{allSizes.map((size) => <button key={size} type="button" onClick={() => setSizes((value) => value.includes(size) ? value.filter((item) => item !== size) : [...value, size])} className={`rounded-full border px-3 py-1 text-xs ${sizes.includes(size) ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'}`}>{size}</button>)}</div></Disclosure>
      <Disclosure title="Color"><ul className="space-y-2">{allColors.map((color) => <li key={color}><button type="button" onClick={() => toggleColor(color)} aria-pressed={colors.includes(color)} className={`flex items-center gap-2 ${colors.includes(color) ? 'font-semibold text-ink' : ''}`}><span className={`h-4 w-4 rounded-full ring-1 ${colors.includes(color) ? 'ring-2 ring-ink' : 'ring-black/10'}`} style={{ backgroundColor: color }} aria-hidden="true" />{color}</button></li>)}</ul></Disclosure>
      <Disclosure title="Material"><ul className="space-y-2">{allMaterials.map((item) => <li key={item}><button type="button" onClick={() => setMaterial((value) => value === item ? '' : item)} className="flex items-center gap-2"><span className={`h-4 w-4 rounded border ${material === item ? 'border-ink bg-ink' : 'border-line'}`} />{item}</button></li>)}</ul></Disclosure>
      <Disclosure title="Repair"><p>Everything with a seam, zip, snap, or coating is repair-eligible. <a href="/repair" className="underline underline-offset-4">How it works</a></p></Disclosure>
      {activeCount > 0 && <button type="button" onClick={clearFilters} className="mt-4 text-xs underline underline-offset-4">Clear all filters</button>}
    </div>
  );

  return <div className="container-x pb-16 pt-6">
    <nav className="flex gap-3 text-sm text-ink-3" aria-label="Breadcrumb">{breadcrumb.map((item, index) => <span key={`${item.href}-${item.label}`} className="flex gap-3"><a href={item.href}>{item.label}</a>{index < breadcrumb.length - 1 && <span aria-hidden="true">›</span>}</span>)}</nav>
    <h1 className="!mt-4 text-4xl font-semibold tracking-tight md:text-[40px]">{heading}</h1>
    <p className="!mt-2 max-w-2xl text-[length:var(--text-15)] text-ink-2">{description}</p>
    <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto border-b hairline px-4 pb-4 md:mx-0 md:px-0">
      {categoryOptions.map((category) => <button key={category.key} type="button" onClick={() => setSelectedCategory(category.key)} className={`btn btn-sm shrink-0 ${selectedCategory === category.key ? 'btn-primary' : 'border hairline bg-white hover:bg-paper'}`}>{category.label}</button>)}
    </div>
    <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">{filters}</aside>
      <div>
        <div className="flex items-center justify-between gap-4"><p className="text-sm text-ink-2">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p><div className="flex items-center gap-2"><button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-sm border hairline bg-white lg:hidden">Filters{activeCount > 0 ? ` (${activeCount})` : ''}</button><label className="flex items-center gap-2 text-sm"><span className="sr-only">Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="h-9 rounded-full border hairline bg-white px-3 text-sm"><option value="featured">Sort by</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="newest">Newest</option></select></label></div></div>
        {filtered.length === 0 ? <div className="mt-16 text-center"><p className="text-sm text-ink-2">Nothing matches those filters.</p><button type="button" onClick={clearFilters} className="btn btn-outline mt-4">Clear filters</button></div> : <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{filtered.map((product, index) => <CommerceProductCard key={product.id} product={product} priority={index < 3} />)}</div>}
      </div>
    </div>
    {filtersOpen && <div className="fixed inset-0 z-[60] lg:hidden"><button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-black/40" /><div role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Filters</h2><button type="button" onClick={() => setFiltersOpen(false)} className="text-sm underline underline-offset-4">Done</button></div><div className="mt-4">{filters}</div></div></div>}
  </div>;
}
