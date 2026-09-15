import type { ContentProps } from '@/cms/contracts/components/errorPage.contract';

/** The source site's compact failure surface, with CMS-owned copy and destinations. */
export function ErrorPage({ code, heading, description, links }: ContentProps) {
  return (
    <section className="error-page container-x" aria-labelledby="error-page-heading">
      <p className="error-page__code">{code}</p>
      <h1 id="error-page-heading">{heading}</h1>
      <p className="error-page__description">{description}</p>
      <div className="error-page__actions">
        {links.map((link) => (
          <a className={`btn btn-${link.variant}`} href={link.href} key={link.id}>
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
