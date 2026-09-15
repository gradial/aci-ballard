import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(), stories: z.array(z.object({ id: z.string(), category: z.string(), title: z.string(), readTime: z.string(), href: z.string(), image: z.string(), imageAlt: z.string() })),
});
export type ContentProps = z.infer<typeof schema>;
export const featuredStoriesContract = defineComponentContract({ id: 'featured_stories', props: schema });
