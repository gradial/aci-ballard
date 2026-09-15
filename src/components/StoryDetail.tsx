/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import type { ContentProps } from '@/cms/contracts/components/storyDetail.contract';

export function StoryDetail({ kind, title, description, author, date, readTime, image, imageAlt, paragraphs, more }: ContentProps) {
  return <article className="story-detail">
    <div className="story-detail__breadcrumbs section-pad"><nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a><i aria-hidden="true">›</i></li><li><a href="/stories">Stories</a><i aria-hidden="true">›</i></li><li><span aria-current="page">{kind}</span></li></ol></nav></div>
    <header><p>{kind}</p><h1>{title}</h1><p className="story-detail__dek">{description}</p><small>{author} · {date} · {readTime}</small></header>
    <div className="story-detail__hero"><img src={image} alt={imageAlt} /></div>
    <div className="story-detail__body">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    <section className="story-detail__more"><h2>More stories</h2><div>{more.map((story) => <article key={story.id}><a className="story-detail__more-image" href={story.href}><img src={story.image} alt={story.imageAlt} /></a><h3><a href={story.href}>{story.title}</a></h3><p>{story.description}</p><small>{story.readTime}</small></article>)}</div></section>
  </article>;
}
