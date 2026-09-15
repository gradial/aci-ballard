import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';
export const schema = z.object({ heading: z.string(), steps: z.array(z.object({ number: z.string(), title: z.string(), description: z.string() })) });
export type ContentProps = z.infer<typeof schema>;
export const stepGridContract = defineComponentContract({ id: 'step_grid', props: schema });
