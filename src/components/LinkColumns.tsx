import type { ContentProps } from '@/cms/contracts/components/linkColumns.contract';

export function LinkColumns({ variant = 'plain', items }: ContentProps) {
  return <section className={`link-columns link-columns--${variant} section-pad`}>{items.map((item) => <article id={item.id} key={item.id}><h2>{item.heading}</h2><p>{item.description}</p>{item.label && item.href && <a href={item.href}>{item.label}</a>}</article>)}</section>;
}
