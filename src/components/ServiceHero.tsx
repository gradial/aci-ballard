/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/serviceHero.contract';

/** Mirrors the upstream Hero section while keeping its copy CMS-addressable. */
export function ServiceHero({ image, imageAlt, eyebrow, heading, description, layout = 'overlay', links }: ContentProps) {
  const headingLines = heading.split('\n');

  return <section className={`service-hero service-hero--${layout}`}>
    <img src={image} alt={imageAlt} />
    <span className="service-hero__shade" />
    <div className="service-hero__copy">
      <p className="service-hero__eyebrow">{eyebrow}</p>
      <h1>{headingLines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < headingLines.length - 1 && <br />}</span>)}</h1>
      <p className="service-hero__description">{description}</p>
      {links.length > 0 && <div className="pill-row">{links.map((link) => <a className={`pill${link.primary ? ' pill--solid' : ''}`} href={link.href} key={link.label}>{link.label}</a>)}</div>}
    </div>
  </section>;
}
