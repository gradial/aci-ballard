import type { ContentProps } from '@/cms/contracts/components/productGrid.contract';
import { CommerceProductCard } from './CommerceProductCard';

export function ProductGrid({ heading, allLabel, allHref, products, columns = '4', theme = 'white' }: ContentProps) {
  const gridColumns = columns === '2' ? 'md:grid-cols-2 lg:grid-cols-2' : columns === '3' ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4';
  return (
    <section className={`container-x pb-16 pt-16 ${theme === 'paper' ? 'bg-paper' : 'bg-white'}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
        <a href={allHref} className="text-sm underline underline-offset-4">{allLabel}</a>
      </div>
      <div className={`mt-6 grid grid-cols-2 gap-x-4 gap-y-8 ${gridColumns}`}>
        {products.map((product, index) => <CommerceProductCard key={product.id} product={product} priority={index < 3} />)}
      </div>
    </section>
  );
}

export function SectionTitle({ heading, label, href }: { heading: string; label?: string; href?: string }) {
  return <div className="flex items-baseline justify-between gap-4"><h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>{label && href && <a href={href} className="text-sm underline underline-offset-4">{label}</a>}</div>;
}
