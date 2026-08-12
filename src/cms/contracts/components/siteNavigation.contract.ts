import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const linkSchema = z.object({ id: z.string(), label: z.string(), href: z.string() });

export const schema = z.object({
  brandHref: z.string(),
  brandLabel: z.string(),
  brandLogo: z.object({ src: z.string(), alt: z.string() }),
  navigation: z.array(linkSchema),
  utility: linkSchema.optional(),
});

export type ContentProps = z.infer<typeof schema>;
export const siteNavigationContract = defineComponentContract({ id: 'site_navigation', props: schema });
