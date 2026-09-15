/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/categoryRail.contract';

export function CategoryRail({ items }: ContentProps) {
  return <section className="category-rail" aria-label="Featured categories"><div className="category-rail__track">{items.map((item) => <article className="image-card image-card--rail" key={item.id}><a className="image-card__image" href={item.href}><img src={item.image} alt={item.imageAlt} /><span className="image-card__shade" /></a><div className="image-card__content"><span className="kicker">{item.eyebrow}</span><a className="image-card__title" href={item.href}>{item.title}</a><div className="pill-row">{item.links.map((link) => <a className="pill pill--solid pill--small" href={link.href} key={link.label}>{link.label}</a>)}</div></div></article>)}</div></section>;
}
