import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(), image: z.string(), imageAlt: z.string(), badge: z.string().optional(), title: z.string(), href: z.string(), description: z.string(), price: z.string(), colors: z.array(z.string()),
  category: z.string().optional(),
  conditions: z.array(z.string()).optional(), materials: z.array(z.string()).optional(), sizes: z.array(z.string()).optional(),
});
export const schema = z.object({
  breadcrumb: z.array(z.object({ label: z.string(), href: z.string() })), heading: z.string(), description: z.string(),
  categories: z.array(z.union([z.string(), z.object({ label: z.string(), key: z.string() })])), products: z.array(productSchema),
});
export type ContentProps = z.infer<typeof schema>;
export const productListingContract = defineComponentContract({ id: 'product_listing', props: schema });
