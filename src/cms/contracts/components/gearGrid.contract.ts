import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  introduction: z.string().optional(),
  cards: z.array(z.object({
    id: z.string(),
    number: z.string().optional(),
    title: z.string(),
    description: z.string(),
    details: z.array(z.string()).optional(),
    href: z.string(),
    linkLabel: z.string(),
    tone: z.enum(['cedar', 'pine', 'stone']).default('stone'),
  })),
});

export type ContentProps = z.infer<typeof schema>;
export const gearGridContract = defineComponentContract({ id: 'gear_grid', props: schema });
