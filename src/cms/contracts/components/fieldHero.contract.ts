import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  description: z.string(),
  primaryLabel: z.string().optional(),
  primaryHref: z.string().optional(),
  secondaryLabel: z.string().optional(),
  secondaryHref: z.string().optional(),
  note: z.string().optional(),
  tone: z.enum(['pine', 'cedar', 'canvas']).default('pine'),
});

export type ContentProps = z.infer<typeof schema>;
export const fieldHeroContract = defineComponentContract({ id: 'field_hero', props: schema });
