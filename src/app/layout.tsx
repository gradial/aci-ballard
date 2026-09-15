import type { ReactNode } from 'react';
import { DevRefresh } from '@gradial/aci/next';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import '@/design-system/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}<CartDrawer /></CartProvider>
        <DevRefresh />
      </body>
    </html>
  );
}
