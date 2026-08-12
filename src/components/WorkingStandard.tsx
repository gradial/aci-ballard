import type { ContentProps } from '@/cms/contracts/components/workingStandard.contract';
import Image from 'next/image';

export function WorkingStandard({ eyebrow, heading, paragraphs, facts, linkLabel, linkHref, markSrc, markAlt, reversed }: ContentProps) {
  return (
    <section className={`working-standard${reversed ? ' working-standard--reversed' : ''}`}>
      <div className="working-standard__panel">
        {markSrc ? <Image src={markSrc} alt={markAlt ?? ''} width={1200} height={300} /> : <div className="working-standard__rings" aria-hidden="true"><span>WORKING</span><span>STANDARD</span></div>}
      </div>
      <div className="working-standard__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        {linkLabel && linkHref && <a className="text-link" href={linkHref}>{linkLabel}<span aria-hidden="true">→</span></a>}
      </div>
    </section>
  );
}
