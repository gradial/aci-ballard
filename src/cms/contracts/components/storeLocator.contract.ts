import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(), description: z.string(), image: z.string(), imageAlt: z.string(),
  stores: z.array(z.object({ id: z.string(), name: z.string(), badge: z.string().optional(), address: z.string(), hours: z.string(), services: z.array(z.string()) })),
});
export type ContentProps = z.infer<typeof schema>;
export const storeLocatorContract = defineComponentContract({ id: 'store_locator', props: schema });
