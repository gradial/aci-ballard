import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({ items: z.array(z.object({ id: z.string(), heading: z.string(), description: z.string() })) });
export type ContentProps = z.infer<typeof schema>;
export const trustBarContract = defineComponentContract({ id: 'trust_bar', props: schema });
