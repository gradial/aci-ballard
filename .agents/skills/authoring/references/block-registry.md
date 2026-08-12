# Component Registry Patterns

The component registry maps contract names to runtime components. It is built
using `createRegistry` from `@gradial/aci` with raw `[contract, component]` tuples.

The tuple form provides **type-level validation** — the component must accept
at least the props derived from the contract's Zod schema. If you register a
component with the wrong prop type, TypeScript will fail at the call site.

**Never use `Record<string, ComponentType<any>>`.** This hides prop
mismatches and name typos until runtime.

**Never alias** — each contract name maps to exactly one runtime component.
No `hero` + `page_hero` pointing to the same component.

## Registry File

All frameworks use a single `src/cms/registry.ts` file:

```ts
import { createRegistry } from '@gradial/aci';
import { homeHeroContract } from './contracts/components/homeHero.contract';
import { containerContract } from './contracts/components/container.contract';
import { buttonContract } from './contracts/components/button.contract';
import { HomeHero } from '@/components/sections/HomeHero';
import { ContainerSection } from '@/components/sections/ContainerSection';
import { ButtonBlock } from '@/components/elements/ButtonBlock';

export const registry = createRegistry([
  [homeHeroContract, HomeHero],
  [containerContract, ContainerSection],
  [buttonContract, ButtonBlock],
]);
```

When adding a new component:
1. Create the contract in `src/cms/contracts/components/{name}.contract.ts`
2. Export it from `src/cms/contracts/components/index.ts`
3. Create the runtime component in `src/components/{elements|sections|chrome}/`
4. Add a `[contract, component]` tuple in `src/cms/registry.ts`

## Next.js Pattern

The SDK provides `createPage(registry)` which owns param normalization, content
loading, layout resolution, metadata generation, notFound handling, slot
resolution (including fragment defaults), and block rendering.

Path shape: `/__r/{releaseId}/routes/{...slug}`. The SDK extracts releaseId
internally; middleware rewrites public URLs to `/__r/{releaseId}/routes/{path}`
for the app-level route. The `routes` namespace leaves room for future siblings
under the release prefix. The filesystem uses an **optional catch-all** `[[...slug]]`
(not required `[...slug]`). Production middleware always rewrites to
`/__r/{releaseId}/routes/{path}`, but file-provider local dev passes requests
unrewritten so `/` arrives with an empty slug.

Chrome (Header/Footer) is **not** in `layout.tsx`. It is CMS-managed via
layout fragment defaults. The `layout.tsx` file is minimal and includes
`<DevRefresh />`:

```tsx
// src/app/layout.tsx — minimal, no chrome
import type { ReactNode } from 'react';
import { DevRefresh } from '@gradial/aci/next';
import '@/design-system/styles.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <DevRefresh />
      </body>
    </html>
  );
}
```

```tsx
// src/app/[[...slug]]/page.tsx — SDK owns all rendering
import { createPage } from '@gradial/aci/next/page';
import { registry } from '@/cms/registry';

const page = createPage(registry);
export const dynamic = 'force-dynamic';
export const generateMetadata = page.generateMetadata;
export default page.default;
```

`createPage` loads the page's layout, resolves all slots (filling from page
regions or layout fragment defaults), and renders blocks via the registry.
The `main` slot is wrapped in `<main>`; other slots render as fragments.

## Custom Server Composition

For route-specific server behavior such as blogs, events, and product detail
pages, use public server-only providers:

```ts
import { loadRenderInput } from '@gradial/aci/content';
import { FileContentProvider } from '@gradial/aci/providers/file';

const provider = new FileContentProvider();
const input = await loadRenderInput(provider, '/events');
```

Do not import providers from client components. Browser fetch should go through
an app-owned HTTP endpoint backed by a server-side `ContentProvider`.

## Astro Pattern

The SDK provides `getPageData(Astro)` as the Astro equivalent of Next.js
`createPage`. It encapsulates route normalization, content resolution (preview
render input vs FileContentProvider), metadata derivation, layout resolution,
slot filling, and collect-tag emission into a single call.

```astro
---
// src/pages/[...slug].astro
import { getGradialStaticPaths, getPageData, createRenderChildren } from '@gradial/aci/astro';
import { registry } from '../cms/registry';
import SiteLayout from '../layouts/SiteLayout.astro';

export const getStaticPaths = getGradialStaticPaths;

const data = await getPageData(Astro);
const renderChildren = createRenderChildren(registry);
---

<SiteLayout
  title={data.meta.title}
  description={data.meta.description}
  canonical={data.meta.canonical}
  siteName={data.meta.siteName}
  collectTag={data.collectTag}
>
  {data.layout.slots.map((slot) => {
    const blocks = data.slots[slot.name];
    if (!blocks?.length) return null;
    const rendered = renderChildren(blocks);
    if (slot.name === 'main') {
      return (
        <main id="content-main">
          {rendered.map((child) => {
            const Comp = child.Component;
            return Comp ? <Comp {...child.props} /> : null;
          })}
        </main>
      );
    }
    return rendered.map((child) => {
      const Comp = child.Component;
      return Comp ? <Comp {...child.props} /> : null;
    });
  })}
</SiteLayout>
```

`getPageData()` returns a `PageData` object with `{ route, siteConfig, page,
meta, layout, slots, collectTag }`. The page template receives typed data
and only needs to iterate slots and render blocks via the registry.

For DAM asset URLs, use `damAssetUrl()`:

```astro
---
import { damAssetUrl } from '@gradial/aci/astro';
---
<img src={damAssetUrl('images/hero.webp')} alt="Hero" />
```

### Astro Asset Serving

**DAM assets are content-addressed and globally shared.**

DAM derivative assets (processed images, optimized media) are staged ONCE at the
hosting bucket's global `.gradial-dam/` location. The content-addressed filenames
contain hashes, so each unique asset is written only once and shared across all
releases.

The CloudFront function rewrites `/.gradial-dam/*` requests to the global
`{keyPrefix}/.gradial-dam/*` S3 path with no release lookup. These assets are
served with immutable caching (`max-age=31536000`) because the filenames contain
content hashes.

No separate CloudFront origin behavior is needed — the existing CloudFront
function in `infra/modules/hosting-cloudfront-site/function.js.tftpl` handles
the rewrite automatically.

### Astro-Specific Paths

| Concern | Path |
|---------|------|
| Routes | `src/pages/[...slug].astro` |
| Layout | `src/layouts/SiteLayout.astro` |
| Config | `astro.config.mjs` with bare `withAci()` |
| Registry | `src/cms/registry.ts` (shared) |
| Storybook | `.storybook/main.ts`, `.storybook/preview.ts` |
| Assets | CloudFront function rewrite (automatic, no infrastructure changes needed) |

## Middleware

Middleware requires explicit `siteId`. The SDK exports a canonical matcher that
repos re-export:

```ts
// src/middleware.ts
import { createGradialMiddleware } from '@gradial/aci/next/middleware';
export { config } from '@gradial/aci/next/middleware';
export default createGradialMiddleware({ siteId: 'your-tenant-id' });
```

The middleware rewrites public URLs to `/__r/{releaseId}/routes/{path}` for
the app-level route. The SDK extracts releaseId internally.

## Asset Routes

**Preferred: NO app-level asset route.** Assets are served via URL rewrite
(Next.js `withAci()`) or CloudFront function rewrite (Astro/CloudFront) directly
to S3.

DAM derivative assets are content-addressed and globally shared — staged once at
`{keyPrefix}/.gradial-dam/` and shared across all releases. The SDK's `withAci()`
already injects a `/.gradial-dam/:path*` rewrite. For CloudFront, the existing
CloudFront function handles the rewrite automatically.

For transitional compatibility, the SDK still exports an asset route handler:

```ts
// src/app/gradial/assets/[...path]/route.ts (transitional)
export { GET, runtime, dynamic } from '@gradial/aci/next/asset-route';
```

**Note**: Asset URLs do NOT include `[releaseId]` in the path. DAM assets are
globally scoped and content-addressed via filename hashes.

## Anti-Patterns

- `Record<string, any>` or `Record<string, ComponentType<any>>` — hides type errors
- `createRegistryEntry()` wrapper — use raw `[contract, component]` tuples instead
- Aliasing: two contract names → same component
- Hand-rolled content loading in route files instead of `createPage`
- `src/lib/content.ts` shim duplicating SDK behavior
- Local Vite middleware for DAM derivative serving instead of `withAci()`
- SvelteKit patterns (conditional rendering, `svelte:component`) — SvelteKit
  support has been removed
