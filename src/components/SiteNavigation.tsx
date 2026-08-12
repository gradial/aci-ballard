import type { ContentProps } from '@/cms/contracts/components/siteNavigation.contract';
import Image from 'next/image';

export function SiteNavigation({ brandHref, brandLabel, brandLogo, navigation, utility }: ContentProps) {
  return (
    <header className="site-header">
      <a className="site-header__brand" href={brandHref} aria-label={`${brandLabel} home`}>
        <Image src={brandLogo.src} alt={brandLogo.alt} width={1200} height={340} priority />
      </a>
      <nav aria-label="Primary navigation">
        <ul className="site-header__links">
          {navigation.map((link) => <li key={link.id}><a href={link.href}>{link.label}</a></li>)}
        </ul>
      </nav>
      {utility && <a className="button button--small" href={utility.href}>{utility.label}</a>}
    </header>
  );
}
