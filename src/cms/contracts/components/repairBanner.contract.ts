import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  image: z.string(), imageAlt: z.string(), eyebrow: z.string(), heading: z.string(), description: z.string(), label: z.string(), href: z.string(),
});
export type ContentProps = z.infer<typeof schema>;
export const repairBannerContract = defineComponentContract({ id: 'repair_banner', props: schema });
