import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  image: z.string(), imageAlt: z.string(), eyebrow: z.string().optional(), titleLead: z.string(), titleTail: z.string().optional(), description: z.string().optional(),
});
export type ContentProps = z.infer<typeof schema>;
export const editorialHeroContract = defineComponentContract({ id: 'editorial_hero', props: schema });
