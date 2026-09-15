import type { ContentProps } from '@/cms/contracts/components/trustBar.contract';

export function TrustBar({ items }: ContentProps) {
  return <section className="trust-bar">{items.map((item) => <article key={item.id}><h2>{item.heading}</h2><p>{item.description}</p></article>)}</section>;
}
