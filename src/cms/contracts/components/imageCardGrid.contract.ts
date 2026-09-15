import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const cardSchema = z.object({
  id: z.string(), image: z.string(), imageAlt: z.string(), eyebrow: z.string().optional(), title: z.string(), href: z.string(), description: z.string().optional(),
  links: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
});
export const schema = z.object({ heading: z.string().optional(), variant: z.enum(['condition', 'feature']), cards: z.array(cardSchema) });
export type ContentProps = z.infer<typeof schema>;
export const imageCardGridContract = defineComponentContract({ id: 'image_card_grid', props: schema });
