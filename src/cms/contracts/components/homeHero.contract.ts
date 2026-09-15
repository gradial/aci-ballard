import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const linkSchema = z.object({ label: z.string(), href: z.string() });
export const schema = z.object({
  image: z.string(),
  imageAlt: z.string(),
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  primary: linkSchema,
  secondary: z.array(linkSchema),
});
export type ContentProps = z.infer<typeof schema>;
export const homeHeroContract = defineComponentContract({ id: 'home_hero', props: schema });
