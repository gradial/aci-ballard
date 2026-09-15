import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(),
  emptyMessage: z.string(),
  mensHref: z.string(),
  womensHref: z.string(),
  mensLabel: z.string(),
  womensLabel: z.string(),
  checkoutMessage: z.string(),
});
export type ContentProps = z.infer<typeof schema>;
export const cartContract = defineComponentContract({ id: 'shopping_cart', props: schema });
