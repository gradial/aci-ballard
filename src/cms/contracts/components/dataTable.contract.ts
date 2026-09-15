import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  heading: z.string(), theme: z.enum(['white', 'paper']).optional(),
  columns: z.array(z.string()), rows: z.array(z.object({ id: z.string(), cells: z.array(z.string()) })),
});
export type ContentProps = z.infer<typeof schema>;
export const dataTableContract = defineComponentContract({ id: 'data_table', props: schema });
