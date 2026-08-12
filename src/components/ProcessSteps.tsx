import type { ContentProps } from '@/cms/contracts/components/processSteps.contract';

export function ProcessSteps({ eyebrow, heading, introduction, steps, ctaLabel, ctaHref }: ContentProps) {
  return (
    <section className="process-section">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="process-section__intro"><h2>{heading}</h2><p>{introduction}</p></div>
      <ol>{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
      {ctaLabel && ctaHref && <a className="button" href={ctaHref}>{ctaLabel}<span aria-hidden="true">→</span></a>}
    </section>
  );
}
