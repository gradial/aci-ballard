import type { ContentProps } from '@/cms/contracts/components/gearGrid.contract';

export function GearGrid({ eyebrow, heading, introduction, cards }: ContentProps) {
  return (
    <section className="gear-section">
      <div className="section-heading">
        <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{heading}</h2></div>
        {introduction && <p>{introduction}</p>}
      </div>
      <div className="gear-grid">
        {cards.map((card) => (
          <article className={`gear-card gear-card--${card.tone}`} key={card.id}>
            <div className="gear-card__top"><span>{card.number ?? 'BALLARD'}</span><span aria-hidden="true">↘</span></div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {card.details && <ul>{card.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
            <a href={card.href}>{card.linkLabel}<span aria-hidden="true">→</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}
