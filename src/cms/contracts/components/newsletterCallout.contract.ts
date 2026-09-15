import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({ heading: z.string(), description: z.string(), label: z.string(), formDescription: z.string() });
export type ContentProps = z.infer<typeof schema>;
export const newsletterCalloutContract = defineComponentContract({ id: 'newsletter_callout', props: schema });
