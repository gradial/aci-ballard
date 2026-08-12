# Contracts Reference

## Component Contract API

```ts
import { defineComponentContract, ImageSchema } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  headline: z.string().min(1),
  image: ImageSchema,
});

export type ContentProps = z.infer<typeof schema>;

export const heroContract = defineComponentContract({
  id: 'hero',
  props: schema,
  imageSlots: {
    image: {
      outputs: [{ aspectRatio: '16:9', widths: [960, 1280, 1920] }],
      formats: ['webp'],
      sizes: '100vw',
    },
  },
});
```

The `defineComponentContract` function takes:
- `id` — the contract name used in content JSON `component` fields and the
  registry key. snake_case.
- `props` — the Zod schema for content props.
- `imageSlots` (optional) — image processing configuration.
- `displayName` (optional) — human-readable name.
- `validate` (optional) — additional validation functions.

`renderModes` has been removed from the contract API. There is no
`renderModes`, `canStatic`, `canSSR`, or `canClientIsland` field.

## Contract Rules

- Import `@gradial/aci`, `zod`, and shared schema helpers only.
- Do not import React components, Astro components, CSS, browser
  globals, framework runtime modules, or customer content.
- Export a conventional `<camelName>Contract` value.
- Export `ContentProps` from `z.infer<typeof schema>` so runtime
  implementation can use it.
- Use contract `id` as the content JSON `component` value and runtime
  registry key.
- `renderModes` has been removed. Do not include it in contracts.

## Component Barrel

```ts
// src/cms/contracts/components/index.ts
import { heroContract } from './hero.contract';
import { buttonContract } from './button.contract';

export default [heroContract, buttonContract];
```

## Layout Contract API

Use `defineLayoutContract`, `slot()`, and `fragmentDefault()` from the SDK:

```ts
// src/cms/contracts/layouts/index.ts
import { defineLayoutContract, slot, fragmentDefault } from '@gradial/aci';

export default [
  defineLayoutContract({
    name: 'marketing',
    slots: [
      slot('header'),
      slot('main', true),
      slot('footer'),
    ],
    defaults: {
      header: fragmentDefault('site-header'),
      footer: fragmentDefault('site-footer'),
    },
  }),
];
```

Content pages reference layouts by name:

```json
{
  "layout": "marketing",
  "regions": {
    "main": [...]
  }
}
```

The `header` and `footer` slots are filled automatically by fragment defaults
when the page doesn't provide blocks for them.

## Multiple Runtime Mappings

One runtime component may implement multiple contract names. Define
separate contract files, then map each contract name to the same runtime
component explicitly in the registry.

## .aci.yaml Configuration

Declares ACI contract entrypoints and framework behavior. Lives at the
project root.

```yaml
version: "1"
siteId: "site_example"
framework: astro  # astro | next

source:
  root: "./"
  outDir: "dist"       # Astro only
  publicDir: "public"  # Astro only

componentRegistry: ./src/cms/contracts/components/index.ts
layoutRegistry: ./src/cms/contracts/layouts/index.ts

capabilities:
  staticRender: true
  ssr: true
  ssrIslands: true
  clientIslands: true
  fragmentRender: true

routes:
  cmsManaged: "/[[...slug]]"
  frameworkOwned:
    - "/api/*"
    - "/_next/*"       # Next.js
    - "/.gradial-dam/*"

rendererProtocol: stdio-json
```

### Fields

| Field | Purpose |
|-------|---------|
| `version` | Config schema version |
| `siteId` | Unique site identifier |
| `framework` | `astro` or `next` (SvelteKit removed) |
| `source.root` | Source root directory |
| `source.outDir` | Build output directory (Astro) |
| `source.publicDir` | Public assets directory (Astro) |
| `componentRegistry` | Path to component contract barrel |
| `layoutRegistry` | Path to layout contract barrel |
| `capabilities` | Render capabilities (static, SSR, islands, fragments) |
| `routes.cmsManaged` | Catch-all route pattern for CMS pages |
| `routes.frameworkOwned` | Route patterns excluded from CMS routing |
| `rendererProtocol` | Renderer communication protocol |

### Removed fields

- `rendererEntry` has been removed from `.aci.yaml`. Do not include it.

### Rules

- `componentRegistry` and `layoutRegistry` point to contract-only modules.
- No secrets in `.aci.yaml`, docs, fixtures, or generated files.
- The `cmsManaged` route pattern should match the filesystem: use `/[[...slug]]`
  (optional catch-all) for Next.js repos. Production middleware always rewrites
  to `/__r/{releaseId}/routes/{path}` so slug is non-empty, but file-provider
  local dev passes requests unrewritten so `/` arrives with an empty slug.
