import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const linkSchema = z.object({ id: z.string(), label: z.string(), href: z.string() });
const menuLinkSchema = z.object({ label: z.string(), href: z.string() });
const navigationSchema = linkSchema.extend({
  columns: z.array(z.object({ title: z.string(), links: z.array(menuLinkSchema) })).optional(),
  tile: z.object({ image: z.string(), imageAlt: z.string(), eyebrow: z.string(), title: z.string(), href: z.string() }).optional(),
});

export const schema = z.object({
  brandHref: z.string(),
  brandLabel: z.string(),
  brandLogo: z.string(),
  utilityLinks: z.array(linkSchema),
  promo: linkSchema,
  announcements: z.array(linkSchema).optional(),
  navigation: z.array(navigationSchema),
});

export type ContentProps = z.infer<typeof schema>;
export const siteNavigationContract = defineComponentContract({ id: 'site_navigation', props: schema });
