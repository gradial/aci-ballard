import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(),
  introduction: z.string(),
  faqGroups: z.array(z.object({
    heading: z.string(),
    questions: z.array(z.object({ title: z.string(), answer: z.string() })),
  })),
  sizes: z.array(z.object({ size: z.string(), chest: z.string(), waist: z.string() })),
  info: z.array(z.object({ heading: z.string(), text: z.string() })),
});
export type ContentProps = z.infer<typeof schema>;
export const helpCenterContract = defineComponentContract({ id: 'help_center', props: schema });
