/* eslint-disable @next/next/no-img-element */
export type CommerceProduct = {
  id: string;
  image: string;
  imageAlt: string;
  badge?: string;
  title: string;
  href: string;
  description: string;
  price: string;
  colors: string[];
};

/** Mirrors the upstream product-card structure. Content stays supplied by ACI JSON. */
export function CommerceProductCard({ product, priority = false }: { product: CommerceProduct; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <a href={product.href} className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-paper-2">
        <img src={product.image} alt={product.imageAlt} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[var(--scale-hover)]" />
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[length:var(--text-11)] font-semibold">{product.badge}</span>}
      </a>
      <div className="mt-3 flex items-center gap-1.5" aria-label={`${product.colors.length} colorways`}>
        {product.colors.slice(0, 5).map((color) => <span key={color} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: color }} />)}
        {product.colors.length > 5 && <span className="text-[length:var(--text-11)] text-ink-3">+{product.colors.length - 5}</span>}
      </div>
      <h3 className="!mt-2 text-[length:var(--text-15)] font-medium leading-snug"><a href={product.href} className="hover:underline underline-offset-4">{product.title}</a></h3>
      <p className="!mt-0.5 text-sm text-ink-2">{product.description}</p>
      <p className="!mt-1 text-sm font-medium">{product.price}</p>
    </article>
  );
}
