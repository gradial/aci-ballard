import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(), allLabel: z.string(), allHref: z.string(),
  stories: z.array(z.object({ id: z.string(), image: z.string().optional(), imageAlt: z.string().optional(), eyebrow: z.string().optional(), title: z.string(), description: z.string(), readTime: z.string(), href: z.string() })),
});
export type ContentProps = z.infer<typeof schema>;
export const storyGridContract = defineComponentContract({ id: 'story_grid', props: schema });
