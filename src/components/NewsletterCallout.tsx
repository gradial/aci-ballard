import type { ContentProps } from '@/cms/contracts/components/newsletterCallout.contract';

export function NewsletterCallout({ heading, description, label, formDescription }: ContentProps) {
  return <section className="newsletter-callout section-pad"><div><h2>{heading}</h2><p>{description}</p></div><form><label htmlFor="callout-email">{label}</label><p>{formDescription}</p><div><input id="callout-email" type="email" placeholder="Email" /><button type="submit">Sign up</button></div></form></section>;
}
