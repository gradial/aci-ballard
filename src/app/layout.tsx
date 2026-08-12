import type { ReactNode } from 'react';
import { Roboto_Condensed, Roboto_Slab } from 'next/font/google';
import { DevRefresh } from '@gradial/aci/next';
import '@/design-system/styles.css';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} ${robotoSlab.variable}`}>
      <body>
        {children}
        <DevRefresh />
      </body>
    </html>
  );
}
