import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string(),
  introduction: z.string(),
  steps: z.array(z.object({ number: z.string(), title: z.string(), description: z.string() })),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export type ContentProps = z.infer<typeof schema>;
export const processStepsContract = defineComponentContract({ id: 'process_steps', props: schema });
