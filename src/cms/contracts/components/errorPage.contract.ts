import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  code: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  links: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    href: z.string().min(1),
    variant: z.enum(['primary', 'outline']).default('outline'),
  })).min(1),
});

export type ContentProps = z.infer<typeof schema>;

export const errorPageContract = defineComponentContract({
  id: 'error_page',
  props: schema,
});
