import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  eyebrow: z.string(),
  heading: z.string(),
  paragraphs: z.array(z.string()).min(1),
  facts: z.array(z.object({ label: z.string(), value: z.string() })),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional(),
  markSrc: z.string().optional(),
  markAlt: z.string().optional(),
  reversed: z.boolean().optional(),
});

export type ContentProps = z.infer<typeof schema>;
export const workingStandardContract = defineComponentContract({ id: 'working_standard', props: schema });
