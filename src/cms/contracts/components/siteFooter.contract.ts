import { defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

const linkSchema = z.object({ id: z.string(), label: z.string(), href: z.string() });

export const schema = z.object({
  brandLogo: z.string(),
  brandHref: z.string().default('/'),
  brandName: z.string().min(1).default('Ballard'),
  statement: z.string(),
  newsletterLabel: z.string(),
  newsletterDescription: z.string(),
  newsletterPlaceholder: z.string().min(1).default('Email'),
  newsletterSubmitLabel: z.string().min(1).default('Sign up'),
  newsletterSuccessMessage: z.string().min(1).default("You're on the list. First email goes out within two weeks."),
  columns: z.array(z.object({ id: z.string(), title: z.string(), links: z.array(linkSchema) })),
  legalLinks: z.array(linkSchema),
  countryLabel: z.string().min(1).default('United States (USD)'),
  copyright: z.string(),
});

export type ContentProps = z.infer<typeof schema>;
export const siteFooterContract = defineComponentContract({ id: 'site_footer', props: schema });
