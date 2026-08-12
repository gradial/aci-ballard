# Type Safety Reference

## ContentProps from Contracts

Contracts export `ContentProps = z.infer<typeof schema>`. Use this type
in runtime components for prop typing:

```ts
// src/cms/contracts/components/hero.contract.ts
import { defineComponentContract, ImageSchema } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  headline: z.string().min(1),
  image: ImageSchema,
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export type ContentProps = z.infer<typeof schema>;

export const heroContract = defineComponentContract({
  id: 'hero',
  props: schema,
});
```

```tsx
// src/components/sections/Hero.tsx
import type { ContentProps } from '@/cms/contracts/components/hero.contract';

type HeroProps = ContentProps & { className?: string };

export function Hero({ headline, image, ctaLabel, ctaHref, className }: HeroProps) {
  // ...
}
```

## Rules

### No `as any` casts

**NEVER** use `as any` or `as any[]` casts in component code. If the
type doesn't fit, fix the contract schema.

```tsx
// BAD
const items = props.items as any[];

// GOOD — fix the schema to match the actual shape
export const schema = z.object({
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});
```

### No passthrough schemas

Contracts must define proper schemas. Do not use
`z.object({}).passthrough()` or `z.record(z.any())`:

```ts
// BAD — hides type errors and allows any content
export const schema = z.object({}).passthrough();
export const schema = z.record(z.any());

// GOOD — explicit fields
export const schema = z.object({
  headline: z.string(),
  items: z.array(z.object({ title: z.string() })),
});
```

### CSS custom properties

For React `style` props with CSS custom properties, use
`as React.CSSProperties` (not `as any`):

```tsx
// BAD
<div style={{ '--accent': 'red' } as any} />

// GOOD
<div style={{ '--accent': 'red' } as React.CSSProperties} />
```

### Image type

Use the `Image` type from `@gradial/aci` for image props. Never
duplicate the type locally:

```tsx
// BAD — local duplicate
interface Image { src: string; alt: string; }

// GOOD — import from SDK
import type { Image } from '@gradial/aci';
```

### Site config

Define a `SiteConfig` interface and pass it to `getSiteConfig()`:

```tsx
import { getSiteConfig } from '@gradial/aci/next';

interface SiteConfig {
  title: string;
  domain: string;
  defaultLocale: string;
  navigation: NavItem[];
  footer: FooterConfig;
}

const config = await getSiteConfig<SiteConfig>();
// config is typed as SiteConfig
```

### Block slot types

Use `RenderChildren` from `@gradial/aci/react` and `BlockRef` from
`@gradial/aci` for block slot component props:

```tsx
import type { BlockRef } from '@gradial/aci';
import type { RenderChildren } from '@gradial/aci/react';
import type { ContentProps } from '@/cms/contracts/components/container.contract';

export async function ContainerSection({
  blocks = [],
  renderChildren,
}: ContentProps & {
  renderChildren?: RenderChildren<readonly BlockRef[]>;
}) {
  // ...
}
```

See `references/block-slots.md` for the full block slot pattern.
