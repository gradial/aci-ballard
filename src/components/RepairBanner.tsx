/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/repairBanner.contract';

export function RepairBanner({ image, imageAlt, eyebrow, heading, description, label, href }: ContentProps) {
  return <section className="repair-banner"><img src={image} alt={imageAlt} /><div className="repair-banner__shade" /><div className="repair-banner__content"><p className="repair-banner__eyebrow">{eyebrow}</p><h2>{heading}</h2><p>{description}</p><a className="pill pill--solid" href={href}>{label}</a></div></section>;
}
