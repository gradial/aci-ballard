/* eslint-disable @next/next/no-img-element */
import type { ContentProps } from '@/cms/contracts/components/storeLocator.contract';

export function StoreLocator({ heading, description, image, imageAlt, stores }: ContentProps) {
  return <div className="store-locator section-pad"><section className="store-locator__header"><h1>{heading}</h1><p>{description}</p><form action="/stores"><input name="q" aria-label="City or postal code" placeholder="City or postal code" /><button type="submit">Search</button></form></section><section className="store-locator__body"><ul>{stores.map((store) => <li key={store.id}><div><h2>{store.name}</h2>{store.badge && <span>{store.badge}</span>}</div><p>{store.address}</p><p>{store.hours}</p><ul>{store.services.map((service) => <li key={service}>{service}</li>)}</ul></li>)}</ul><div className="store-locator__image"><img src={image} alt={imageAlt} /></div></section></div>;
}
