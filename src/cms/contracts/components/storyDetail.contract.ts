import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const storyCard = z.object({ id: z.string(), image: z.string(), imageAlt: z.string(), title: z.string(), description: z.string(), readTime: z.string(), href: z.string() });
export const schema = z.object({
  kind: z.string(), title: z.string(), description: z.string(), author: z.string(), date: z.string(), readTime: z.string(),
  image: z.string(), imageAlt: z.string(), paragraphs: z.array(z.string()), more: z.array(storyCard),
});
export type ContentProps = z.infer<typeof schema>;
export const storyDetailContract = defineComponentContract({ id: 'story_detail', props: schema });
