import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';
export const schema = z.object({ leftHeading: z.string(), rows: z.array(z.object({ label: z.string(), value: z.string() })), rightSections: z.array(z.object({ heading: z.string(), paragraphs: z.array(z.string()) })) });
export type ContentProps = z.infer<typeof schema>;
export const infoSplitContract = defineComponentContract({ id: 'info_split', props: schema });
