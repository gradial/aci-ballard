import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  items: z.array(z.object({
    id: z.string(), image: z.string(), imageAlt: z.string(), eyebrow: z.string(), title: z.string(), href: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
  })),
});
export type ContentProps = z.infer<typeof schema>;
export const categoryRailContract = defineComponentContract({ id: 'category_rail', props: schema });
