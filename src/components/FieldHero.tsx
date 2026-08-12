import type { ContentProps } from '@/cms/contracts/components/fieldHero.contract';

export function FieldHero({ eyebrow, headline, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref, note, tone }: ContentProps) {
  return (
    <section className={`field-hero field-hero--${tone}`}>
      <div className="field-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{headline}</h1>
        <p className="field-hero__description">{description}</p>
        {(primaryLabel || secondaryLabel) && (
          <div className="button-row">
            {primaryLabel && primaryHref && <a className="button" href={primaryHref}>{primaryLabel}<span aria-hidden="true">→</span></a>}
            {secondaryLabel && secondaryHref && <a className="text-link" href={secondaryHref}>{secondaryLabel}<span aria-hidden="true">→</span></a>}
          </div>
        )}
      </div>
      <div className="field-hero__field" aria-hidden="true">
        <span>53.5° N</span>
        <span>RAIN / WIND / WORK</span>
        <span>SEA LEVEL</span>
      </div>
      {note && <p className="field-hero__note">{note}</p>}
    </section>
  );
}
