import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({ description: z.string(), suggestions: z.array(z.string()) });
export type ContentProps = z.infer<typeof schema>;
export const searchPanelContract = defineComponentContract({ id: 'search_panel', props: schema });
