/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/featuredStories.contract';

export function FeaturedStories({ heading, stories }: ContentProps) {
  return <section className="featured-stories section-pad"><h2>{heading}</h2><div>{stories.map((story) => <article key={story.id}><a className="featured-story__copy" href={story.href}><span>{story.category}</span><h3>{story.title}</h3><small>{story.readTime}</small></a><a className="featured-story__image" href={story.href}><img src={story.image} alt={story.imageAlt} /></a></article>)}</div></section>;
}
