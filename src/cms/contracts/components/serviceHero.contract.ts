import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';
export const schema = z.object({ image: z.string(), imageAlt: z.string(), eyebrow: z.string(), heading: z.string(), description: z.string(), layout: z.enum(['overlay', 'split']).optional(), links: z.array(z.object({ label: z.string(), href: z.string(), primary: z.boolean().optional() })) });
export type ContentProps = z.infer<typeof schema>;
export const serviceHeroContract = defineComponentContract({ id: 'service_hero', props: schema });
