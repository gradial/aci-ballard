/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/imageCardGrid.contract';
import { SectionTitle } from './ProductGrid';

export function ImageCardGrid({ heading, variant, cards }: ContentProps) {
  return <section className={`image-grid-section image-grid-section--${variant} section-pad`}>{heading && <SectionTitle heading={heading} />}<div className="image-grid">{cards.map((card) => <article className="image-card" key={card.id}><a className="image-card__image" href={card.href}><img src={card.image} alt={card.imageAlt} /><span className="image-card__shade" /></a><div className="image-card__content">{card.eyebrow && <span className="kicker">{card.eyebrow}</span>}<a className="image-card__title" href={card.href}>{card.title}</a>{card.description && <p>{card.description}</p>}{card.links && <div className="pill-row">{card.links.map((link) => <a className="pill pill--solid pill--small" href={link.href} key={link.label}>{link.label}</a>)}</div>}</div></article>)}</div></section>;
}
