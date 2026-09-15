import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const relatedSchema = z.object({ id: z.string(), image: z.string(), imageAlt: z.string(), badge: z.string().optional(), title: z.string(), href: z.string(), description: z.string(), price: z.string(), colors: z.array(z.string()), category: z.string().optional(), conditions: z.array(z.string()).optional(), materials: z.array(z.string()).optional(), sizes: z.array(z.string()).optional() });
export const schema = z.object({
  breadcrumb: z.array(z.object({ label: z.string(), href: z.string() })), name: z.string(), tagline: z.string(), price: z.string(), colorName: z.string(), colors: z.array(z.string()), sizes: z.array(z.string()),
  colorOptions: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
  made: z.number().optional(),
  gallery: z.array(z.object({ image: z.string(), alt: z.string(), caption: z.string().optional() })),
  delivery: z.array(z.object({ label: z.string(), value: z.string() })), paragraphs: z.array(z.string()), tradeoff: z.string(), fit: z.string(), care: z.string(), repairEligible: z.boolean(), specs: z.array(z.object({ label: z.string(), value: z.string() })), related: z.array(relatedSchema),
});
export type ContentProps = z.infer<typeof schema>;
export const productDetailContract = defineComponentContract({ id: 'product_detail', props: schema });
