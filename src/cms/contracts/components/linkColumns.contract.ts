import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  variant: z.enum(['plain', 'cards']).optional(),
  items: z.array(z.object({ id: z.string(), heading: z.string(), description: z.string(), label: z.string().optional(), href: z.string().optional() })),
});
export type ContentProps = z.infer<typeof schema>;
export const linkColumnsContract = defineComponentContract({ id: 'link_columns', props: schema });
