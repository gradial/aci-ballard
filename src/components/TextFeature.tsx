/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/textFeature.contract';

export function TextFeature({ paragraphs, image, imageAlt = '', facts = [] }: ContentProps) {
  return <section className={`text-feature section-pad${image ? ' text-feature--image' : ''}`}><div className="text-feature__copy">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{image ? <div className="text-feature__image"><img src={image} alt={imageAlt} /></div> : <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}</section>;
}
