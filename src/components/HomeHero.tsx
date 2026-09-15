/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/homeHero.contract';

export function HomeHero({ image, imageAlt, eyebrow, heading, description, primary, secondary }: ContentProps) {
  const headingLines = heading.split('\n');
  return <section className="home-hero"><div className="home-hero__image"><img src={image} alt={imageAlt} /></div><div className="home-hero__copy"><p className="home-hero__eyebrow">{eyebrow}</p><h1>{headingLines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < headingLines.length - 1 && <br />}</span>)}</h1><p>{description}</p><div className="pill-row"><a className="pill pill--solid" href={primary.href}>{primary.label}</a>{secondary.map((link) => <a className="pill" href={link.href} key={link.label}>{link.label}</a>)}</div></div></section>;
}
