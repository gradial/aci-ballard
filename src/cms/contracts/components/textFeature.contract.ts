import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  paragraphs: z.array(z.string()),
  image: z.string().optional(), imageAlt: z.string().optional(),
  facts: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});
export type ContentProps = z.infer<typeof schema>;
export const textFeatureContract = defineComponentContract({ id: 'text_feature', props: schema });
