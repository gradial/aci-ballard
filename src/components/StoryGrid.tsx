/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/storyGrid.contract';
import { SectionTitle } from './ProductGrid';

export function StoryGrid({ heading, allLabel, allHref, stories }: ContentProps) {
  return <section className={`stories section-pad${heading === 'Care guides' ? ' stories--care' : ''}`}><SectionTitle heading={heading} label={allLabel} href={allHref} /><div className="story-grid">{stories.map((story) => <article key={story.id}><a className="story-image" href={story.href}>{story.image && <img src={story.image} alt={story.imageAlt ?? ''} />}</a>{story.eyebrow && <small>{story.eyebrow}</small>}<h3><a href={story.href}>{story.title}</a></h3><p>{story.description}</p><span>{story.readTime}</span></article>)}</div></section>;
}
