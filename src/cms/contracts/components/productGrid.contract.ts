import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(), allLabel: z.string(), allHref: z.string(),
  columns: z.enum(['2', '3', '4']).optional(), theme: z.enum(['white', 'paper']).optional(),
  products: z.array(z.object({
    id: z.string(), image: z.string(), imageAlt: z.string(), badge: z.string().optional(), title: z.string(), href: z.string(),
    description: z.string(), price: z.string(), colors: z.array(z.string()), category: z.string().optional(), conditions: z.array(z.string()).optional(), materials: z.array(z.string()).optional(), sizes: z.array(z.string()).optional(),
  })),
});
export type ContentProps = z.infer<typeof schema>;
export const productGridContract = defineComponentContract({ id: 'product_grid', props: schema });
