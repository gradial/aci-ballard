/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/editorialHero.contract';

export function EditorialHero({ image, imageAlt, eyebrow, titleLead, titleTail, description }: ContentProps) {
  return <section className="editorial-hero"><img src={image} alt={imageAlt} /><span className="editorial-hero__shade" /><div>{eyebrow && <p className="kicker">{eyebrow}</p>}<h1><strong>{titleLead}</strong>{titleTail && <span>{titleTail}</span>}</h1>{description && <p>{description}</p>}</div></section>;
}
