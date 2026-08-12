import type { ContentProps } from '@/cms/contracts/components/siteFooter.contract';
import Image from 'next/image';

export function SiteFooter({ brandLogo, statement, columns, legalLinks, copyright }: ContentProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead">
        <Image src={brandLogo.src} alt={brandLogo.alt} width={1200} height={300} />
        <p>{statement}</p>
      </div>
      <div className="site-footer__columns">
        {columns.map((column) => (
          <div key={column.id}>
            <h2>{column.title}</h2>
            <ul>{column.links.map((link) => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="site-footer__base">
        <p>{copyright}</p>
        <ul>{legalLinks.map((link) => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}</ul>
      </div>
    </footer>
  );
}
