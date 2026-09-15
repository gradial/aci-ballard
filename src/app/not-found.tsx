import type { Metadata } from 'next';
import { createNotFound } from '@gradial/aci/next';
import { registry } from '@/cms/registry';

export const metadata: Metadata = { title: 'Page not found' };

// ACI resolves the published /404/ page through the normal Ballard layout,
// retaining the authored navigation and footer while preserving Next's 404 status.
export default createNotFound(registry);
