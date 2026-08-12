import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const linkSchema = z.object({ id: z.string(), label: z.string(), href: z.string() });

export const schema = z.object({
  brandLogo: z.object({ src: z.string(), alt: z.string() }),
  statement: z.string(),
  columns: z.array(z.object({ id: z.string(), title: z.string(), links: z.array(linkSchema) })),
  legalLinks: z.array(linkSchema),
  copyright: z.string(),
});

export type ContentProps = z.infer<typeof schema>;
export const siteFooterContract = defineComponentContract({ id: 'site_footer', props: schema });
