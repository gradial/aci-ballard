import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';
export const schema = z.object({ heading: z.string(), description: z.string(), kind: z.enum(['repair', 'quote']) });
export type ContentProps = z.infer<typeof schema>;
export const contactFormContract = defineComponentContract({ id: 'contact_form', props: schema });
