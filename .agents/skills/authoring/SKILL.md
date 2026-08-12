---
name: authoring
description: Author content and build components for ACI sites. Use when creating or editing content JSON, adding components, writing contracts, wiring the component registry, working with design tokens, building Storybook stories, or understanding the contract/runtime split.
---

# Authoring — Content and Components

## Content Authoring

### Content Locations

| Path | Purpose |
|------|---------|
| `.content/config/site.json` | Site metadata, SEO defaults |
| `.content/config/robots.txt` | Authored crawler rules; publish bundles this file verbatim as `assets/robots.txt` when present |
| `.content/pages/{slug}/_index.json` | Page content (slug maps to route) |
| `.content/fragments/{id}/_index.json` | Shared fragments (navbar, footer — used by layout defaults) |
| `.aci/schemas/page.schema.json` | Page validation schema (auto-generated from contracts) |

### Page Structure

Every page JSON requires:

```json
{
  "$type": "page",
  "id": "unique-page-id",
  "status": "published",
  "layout": "default",
  "metadata": {
    "title": "Page Title",
    "description": "Meta description",
    "sitemap": { "visible": true }
  },
  "regions": {
    "main": []
  }
}
```

Base page fields are SDK-owned and included in the generated
`.aci/schemas/page.schema.json`.

#### Sitemap visibility

`metadata.sitemap.visible` controls whether the page appears in the generated
`sitemap.xml` release artifact:

- **Omit or `true`** (default) — the page is included in the sitemap when other
  filters allow it (published status, robots.txt rules).
- **`false`** — the page is excluded from the sitemap. The page still renders
  normally; only its sitemap presence changes.

```json
{
  "metadata": {
    "title": "Private Campaign Page",
    "sitemap": { "visible": false }
  }
}
```

Use `false` for pages that should publish but stay out of search engine
discovery: temporary campaign pages, event-specific landing pages, staging
pages, or pages already blocked by `robots.txt` (setting it explicitly makes
the intent clear in content).

This does **not** add a `noindex` meta tag — it only controls sitemap inclusion.

The `layout` field is required — it determines which slots the page can
fill. The `default` layout provides `header`/`main`/`footer` slots with
fragment defaults for chrome (navbar, footer). Pages typically only fill
`regions.main`; chrome comes from the layout's fragment defaults.

### Route Mapping

Pages map to URL routes by their folder path under `/pages/`:

| Page Path | Route |
|-----------|-------|
| `/pages/home/_index.json` | `/` |
| `/pages/about/_index.json` | `/about` |
| `/pages/products/_index.json` | `/products` |
| `/pages/products/shoes/_index.json` | `/products/shoes` |

The `home` slug is special-cased to route `/`. All other slugs map directly.

### Content Rules

- Never hard-code content inside component code. All content lives in JSON.
- Migrate copy verbatim. Do not paraphrase, summarize, or invent.
- Global elements (header, footer, nav) are CMS-managed fragments in
  `.content/fragments/`, rendered via layout fragment defaults. They are
  not hardcoded in framework layout files.
- Use `$ref:` prefixes for cross-references between content documents.

### Block Structure

```json
{
  "id": "hero-section",
  "component": "home_hero",
  "props": {
    "headline": "Ship content updates across every framework.",
    "ctaLabel": "Get started",
    "ctaHref": "/docs"
  }
}
```

- `component` must match a contract `id` exactly.
- `props` must validate against the contract's Zod schema.
- `id` is unique within the page.

### Nested Blocks

Components that accept child blocks use `blockRef()` in their Zod schema
instead of a separate `slots` property. Nested blocks live inside `props`,
not in a sibling `slots` field.

**Contract:**
```ts
import { defineComponentContract, blockRef } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  theme: z.enum(['auto', 'light', 'dark']).optional(),
  className: z.string().optional(),
  content: blockRef({
    allowed: ['button', 'feature_grid', 'stats_bar'],
    multiple: true,
  }).optional(),
});

export const containerContract = defineComponentContract({
  id: 'container',
  props: schema,
});
```

**Content JSON:**
```json
{
  "id": "cta-section",
  "component": "container",
  "props": {
    "className": "space-y-4",
    "content": [
      {
        "id": "primary-cta",
        "component": "button",
        "props": {
          "label": "Get started",
          "href": "#start",
          "variant": "primary"
        }
      },
      {
        "id": "secondary-cta",
        "component": "button",
        "props": {
          "label": "Learn more",
          "href": "#learn",
          "variant": "secondary"
        }
      }
    ]
  }
}
```

The `blockRef()` function:
- Takes `{ allowed: string[], multiple?: boolean }`.
- `allowed` restricts which component IDs can be nested.
- `multiple: true` (default) allows an array of blocks.
- The compiler scans the schema for `blockRef` fields and auto-discovers
  block slots — no separate `blockSlots` declaration needed.

### Button Block

The `button` component is a common atomic block:

```json
{
  "id": "cta-button",
  "component": "button",
  "props": {
    "label": "Get started",
    "href": "https://example.com",
    "variant": "primary",
    "icon": "arrow_forward",
    "iconPosition": "after",
    "newWindow": true
  }
}
```

- `label` and `href` are required.
- `variant`: `primary` | `secondary` | `outline` | `tertiary`
- `icon`: a registered icon name.
- `iconPosition`: `before` | `after`
- `newWindow`: boolean for `target="_blank"`.

### Site Config

Global elements (navigation, footer, branding, SEO) live in
`.content/config/site.json`:

```json
{
  "$type": "site",
  "id": "meridian",
  "status": "published",
  "title": "Meridian",
  "domain": "www.meridian.local",
  "defaultLocale": "en-us",
  "locales": ["en-us"],
  "brandHref": "/",
  "brandLogo": {
    "src": "/assets/meridian-logo.svg",
    "alt": "Meridian"
  },
  "seo": {
    "title": "Meridian",
    "description": "Global satellite internet from anywhere on Earth.",
    "siteName": "Meridian"
  },
  "navigation": [
    { "id": "home", "label": "Home", "href": "/" },
    { "id": "about", "label": "About", "href": "/about/" }
  ],
  "footer": {
    "columns": [...],
    "social": [...],
    "legalLinks": [...],
    "copyright": "Copyright (c) 2026 ..."
  }
}
```

### ID Conventions

- Every block must have a unique `id` within the page.
- Use kebab-case: `hero-heading`, `feature-cta`, `card-1-image`.
- Prefix with section context for clarity: `callouts-heading`, `demo-cta`.

### className Validation

The `className` field accepts any valid Tailwind CSS utility class, as
long as every value ultimately derives from the design system's CSS custom
properties. The validator rejects raw hex/px/rem bracket values (e.g.,
`[#fff]`, `[12px]`) but allows `[var(--...)]` bracket syntax for CSS
variable references.

### Image References

Use DAM asset references for images:

```json
{
  "image": {
    "$type": "dam.assetRef",
    "assetId": "ast_site_home_hero",
    "alt": "Hero illustration"
  }
}
```

The compiler resolves these to Gradial image objects with primary URLs,
sources, and dimensions.

## Component Development

### Contract / Runtime Split

Every CMS-managed component has two parts:

1. **Contract** (`src/cms/contracts/components/{name}.contract.ts`) —
   compile-time metadata: component name, Zod schema, render modes, image
   slots. Imports only `@gradial/aci` and `zod`.

2. **Runtime** (`src/components/`) — the actual framework component
   (Astro or React). May import contract types for prop typing.

The ACI compiler imports only contracts. Contracts must never import
framework components, CSS, browser globals, or runtime modules.

Only Next.js and Astro are supported. SvelteKit support has been removed.

### Adding a New Component

#### 1. Create the contract

```ts
// src/cms/contracts/components/featureShowcase.contract.ts
import { defineComponentContract, ImageSchema } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  headline: z.string().min(1),
  description: z.string().optional(),
  image: ImageSchema,
  features: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export type ContentProps = z.infer<typeof schema>;

export const featureShowcaseContract = defineComponentContract({
  id: 'feature_showcase',
  props: schema,
  imageSlots: {
    image: {
      formats: ['image/avif', 'image/webp', 'image/jpeg'],
      sizes: '50vw',
      outputs: [
        { aspectRatio: '16:9', widths: [640, 960, 1280] },
      ],
    },
  },
});
```

#### 2. Export from the barrel

```ts
// src/cms/contracts/components/index.ts
import { featureShowcaseContract } from './featureShowcase.contract';

export default [
  // ... existing contracts
  featureShowcaseContract,
];
```

#### 3. Create the runtime component

**Astro:**
```astro
---
// src/components/sections/FeatureShowcase.astro
import { primaryImageSource } from '@gradial/aci';
import type { ContentProps } from '../../cms/contracts/components/featureShowcase.contract';

interface Props extends ContentProps {
  className?: string;
}

const { headline, description, image, features, ctaLabel, ctaHref, className } = Astro.props;
---
<section class={`py-[var(--spacing-section-y)] ${className ?? ''}`}>
  <div class="mx-auto max-w-[var(--max-width-container)] px-[var(--spacing-container)]">
    <h2 class="text-[length:var(--text-size-h2)]">{headline}</h2>
    {description && <p class="text-[length:var(--text-size-body-large)]">{description}</p>}
    {image && <img src={primaryImageSource(image).src} alt={image.alt ?? ''} />}
    {features?.map(f => (
      <div>
        <h3>{f.title}</h3>
        <p>{f.description}</p>
      </div>
    ))}
  </div>
</section>
```

**React (Next.js):**
```tsx
// src/components/sections/FeatureShowcase.tsx
import { primaryImageSource } from '@gradial/aci';
import type { ContentProps } from '../../cms/contracts/components/featureShowcase.contract';

type FeatureShowcaseProps = ContentProps & { className?: string };

export function FeatureShowcase({ headline, description, image, features, className }: FeatureShowcaseProps) {
  return (
    <section className={`py-[var(--spacing-section-y)] ${className ?? ''}`}>
      <div className="mx-auto max-w-[var(--max-width-container)] px-[var(--spacing-container)]">
        <h2 className="text-[length:var(--text-size-h2)]">{headline}</h2>
        {description && <p className="text-[length:var(--text-size-body-large)]">{description}</p>}
        {image && <img src={primaryImageSource(image).src} alt={image.alt ?? ''} />}
      </div>
    </section>
  );
}
```

#### 4. Wire into the component registry

Add a `[contract, component]` tuple in `src/cms/registry.ts`:

```ts
import { createRegistry } from '@gradial/aci';
import { featureShowcaseContract } from './contracts/components/featureShowcase.contract';
import { FeatureShowcase } from '@/components/sections/FeatureShowcase';

export const registry = createRegistry([
  // ... existing entries
  [featureShowcaseContract, FeatureShowcase],
]);
```

See `references/block-registry.md` for the full registry pattern for each
framework.

#### 5. Add content

```json
// .content/pages/home/_index.json (inside regions.main)
{
  "id": "features",
  "component": "feature_showcase",
  "props": {
    "headline": "Why teams choose us",
    "image": {
      "$type": "dam.assetRef",
      "assetId": "feature_image",
      "alt": "Product dashboard"
    },
    "features": [
      { "title": "Fast", "description": "Sub-second page loads" },
      { "title": "Secure", "description": "SOC 2 compliant" }
    ]
  }
}
```

#### 6. Verify

```bash
npm run aci:compile     # Contracts + content compile
npm run typecheck       # Types check
npm run build           # Framework builds
```

### Contract Rules

- Import `@gradial/aci`, `zod`, and shared schema helpers only.
- Export a conventional `<camelName>Contract` value.
- Export `ContentProps` from `z.infer<typeof schema>`.
- Use `defineComponentContract({ id, props: schema })` — the `id` is the
  contract name used in content JSON `component` fields and the registry.
- `imageSlots` must match all `ImageSchema` fields, including
  nested dot paths like `items.image`.
- `renderModes` has been removed from the contract API. There is no
  `renderModes` field on `defineComponentContract`.

### Composition Props

Props like `className`, slots, and rendered child nodes stay outside the
CMS contract. They are framework concerns, not content:

```ts
// Contract: only content props
export const schema = z.object({
  headline: z.string(),
});

// Runtime: content props + composition props
type Props = ContentProps & { className?: string };
```

### Import Rules

1. **Contract files** import only `@gradial/aci`, `zod`, and shared
   schema helpers. No React, Astro, CSS, browser globals, or runtime
   modules.
2. **Runtime components** may import contract types and framework code.
3. **Registry files** (`src/cms/registry.ts`) import both contracts and
   runtime components — they are the wiring point.
4. Use `@gradial/aci` as the SDK package. Do not use `@baremetal/runtime`.

### Layout Contracts

Layouts define page-level slot structure and optional fragment defaults
for chrome. Use `defineLayoutContract`, `slot()`, and `fragmentDefault()`
from the SDK:

```ts
// src/cms/contracts/layouts/index.ts
import { defineLayoutContract, slot, fragmentDefault } from '@gradial/aci';

export default [
  defineLayoutContract({
    name: 'default',
    slots: [
      slot('header'),         // filled by fragment default
      slot('main', true),     // filled by page regions (required)
      slot('footer'),         // filled by fragment default
    ],
    defaults: {
      header: fragmentDefault('navbar'),
      footer: fragmentDefault('site-footer'),
    },
  }),
];
```

Fragment content lives in `.content/fragments/{id}/_index.json` and has
a `component` + `props` just like page blocks. Chrome components (Header,
Footer) are registered in the registry alongside page components.

The `layout` field in page JSON is **required** — there is no implicit
default. Every page must declare which layout it uses.

## Component Tiers

Three directories, no more:

| Tier | Directory | Purpose |
|------|-----------|---------|
| elements | `src/components/elements/` | Small reusable UI + atomic content blocks |
| sections | `src/components/sections/` | Page-level section components |
| chrome | `src/components/chrome/` | Site chrome (Header, Footer, Nav) |

Do not create additional tiers (molecules, patterns, atoms as separate
directories). Three directories are sufficient.

## Design System

### Design Tokens

Tokens are CSS custom properties in `@theme` blocks under
`src/design-system/tokens/`. Tailwind v4 reads them and auto-generates
utility classes.

| File | Scope |
|------|-------|
| `colors.css` | Brand colors, semantic tokens, surfaces, borders |
| `typography.css` | Font families, sizes, weights, line heights |
| `spacing.css` | Spacing scale, container padding, section spacing |
| `radii.css` | Border radius values |
| `shadows.css` | Card and overlay shadows |
| `components.css` | Component-level tokens (buttons, header, footer) |
| `index.css` | Barrel import for all token files |

### Using Tokens

**Direct Tailwind utilities (preferred):**
- Color: `text-fg`, `text-fg-muted`, `bg-surface-default`, `border-edge`
- Radii: `rounded-card`, `rounded-button`
- Shadows: `shadow-card-default`
- Standard spacing: `px-4`, `gap-6`, `w-24`, `max-w-3xl`

**Bracket syntax (for tokens without direct utilities):**
- Gradients: `bg-[image:var(--gradient-cta-dark)]`
- Typography: `text-[length:var(--text-size-body)]`, `font-[var(--font-weight-semibold)]`
- Spacing tokens: `py-[var(--spacing-section-y)]`, `p-[var(--spacing-card)]`

### Forbidden Values

**No raw hex colors**: `text-[#8b72ff]`, `bg-[#f6f6f7]`
**No raw pixel values**: `p-[12px]`, `w-[200px]`, `gap-[24px]`
**No raw rem values**: `text-[1.25rem]`, `p-[0.75rem]`
**No Tailwind named colors**: `text-gray-500`, `bg-purple-400`

Use CSS variable tokens instead. If a token doesn't exist, add it to the
appropriate `tokens/*.css` file. The ESLint rule `no-raw-tailwind-values`
enforces this in component code.

### Theme System

Three theme classes control semantic token resolution:

| Class | Use Case |
|-------|----------|
| `theme-auto` | Normal page content following browser light/dark preference |
| `theme-dark` | Fixed dark surfaces (header, footer, hero) |
| `theme-accent` | CTA-style accent surfaces |

### Adding New Tokens

1. Add the token to the appropriate `tokens/*.css` file inside `@theme`:
```css
@theme {
  --color-brand-500: #6b5ce7;
}
```
2. Reference it from component code.
3. Tailwind v4 will auto-generate a utility if the token name matches a
   Tailwind namespace.

## Storybook

Every ACI frontend repo should have Storybook configured. Use **Storybook 10+**
with the framework-specific adapter:

- **Next.js**: `@storybook/nextjs-vite`
- **Astro**: `@storybook-astro/framework`

Stories live under `src/stories/` and follow the framework's Storybook setup.

```bash
npm run storybook         # Dev mode
npm run build:storybook   # Build all stories
```

All repos should converge on Storybook 10. Repos on Storybook 9 should upgrade.

## Deep Dive: Component Registry

Read `references/block-registry.md` for the `createRegistry` pattern,
framework-specific usage, and registry rules.

## Deep Dive: Image Slots and Assets

Read `references/image-assets.md` for `ImageSchema` usage, image
slot configuration, nested dot paths, and runtime image rendering rules.

## Deep Dive: Contracts

Read `references/contracts.md` for the full contract file structure,
`defineComponentContract` API, `.aci.yaml` config reference, plain
layout contract objects, and contract barrel patterns.

## Deep Dive: Design System

Read `references/design-system.md` for grid layout patterns, the
critical Tailwind purge warning, component CSS discipline rules,
chrome-specific override scopes, and token creation workflow.

## Deep Dive: Repository Structure

Read `references/repo-structure.md` for the full annotated directory
layout, framework-specific paths, naming conventions, and generated
files list.

## Deep Dive: SDK Server Functions

Read `references/sdk-server-functions.md` for `@gradial/aci/next`
server-side functions (`createPage`, `getSiteConfig`, `getFragment`,
etc.), the three-tier content resolution chain, and the critical rule
against importing `FileContentProvider` or `S3ContentProvider`
directly in app code.

## Deep Dive: Block Slots

Read `references/block-slots.md` for `blockRefArray()` in contracts,
`renderChildren` in components, and the rules for nested block
rendering without hardcoded component name matching.

## Deep Dive: Rich Text

Read `references/rich-text.md` for the SDK `RichText` component from
`@gradial/aci/react`, sanitization policy, and why you should never
use `marked` or `dangerouslySetInnerHTML` directly.

## Deep Dive: Asset Rendering

Read `references/asset-rendering.md` for `imageAttrs()`, `Picture`,
`Image`, `Media` components, and CSS background image patterns.

## Deep Dive: Type Safety

Read `references/type-safety.md` for `ContentProps` from contracts,
`as any` prohibition, CSS custom property typing, site config
generics, and block slot type imports.
