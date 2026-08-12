# SDK Server Functions Reference

## `@gradial/aci/next` Exports

The SDK provides server-side functions that handle content resolution
across preview, local file, and deployed S3 modes. **Always use these
functions instead of directly importing `FileContentProvider` or
`S3ContentProvider`.** The SDK handles the resolution chain automatically.

### `createPage(registry, options?)`

The catch-all route handler for Next.js App Router. Owns param
normalization, content loading via render input, metadata generation,
`notFound` handling, layout resolution, and block rendering via the
registry.

Path shape: in production, middleware rewrites to `/__r/{releaseId}/routes/{...slug}`.
The SDK's `resolveRouteAndRelease` decomposes `['__r', releaseId, 'routes', ...pathSegments]`.
In local dev (`ACI_CONTENT_PROVIDER=file`), requests pass through unrewritten, so `/`
arrives with an empty/undefined slug. The filesystem uses an **optional catch-all**
`[[...slug]]` to handle both shapes.

```tsx
// src/app/[[...slug]]/page.tsx
import { createPage } from '@gradial/aci/next';
import { registry } from '@/cms/registry';

const page = createPage(registry);
export const dynamic = 'force-dynamic';
export const generateMetadata = page.generateMetadata;
export default page.default;
```

`createPage` loads the page's layout, resolves all slots (filling from
page regions or layout fragment defaults), and renders blocks via the
registry. The `main` slot is wrapped in `<main>`; other slots render as
fragments.

### `withAci(nextConfig?, options?)`

Next.js config wrapper. Owns all canonical SDK behavior: output mode,
outputFileTracingRoot, base-path/build-mode/dist-dir env injection, CDN
headers, asset rewrites (`/.gradial-dam` prefix), content-watch plugin,
and public-path scanning. Repos should pass a bare `withAci()` call and
rely on SDK defaults.

```ts
// next.config.ts
import { withAci } from '@gradial/aci/next/config';

export default withAci();
```

For site-specific non-CMS routes, pass `passthroughRoutes`:

```ts
export default withAci({
  passthroughRoutes: ['/api/*', '/admin/*'],
});
```

Do not manually configure outputFileTracing, base-path, build-mode, dist-dir,
or custom rewrites/redirects for ACI concerns. The SDK handles these.

### `getSiteConfig<T>()`

Loads the site configuration. Checks the render input header first
(preview mode), then falls back to file or S3 provider. **MUST be used
in `layout.tsx` instead of `new FileContentProvider()`.**

```tsx
import { getSiteConfig } from '@gradial/aci/next';

const siteConfig = await getSiteConfig<MySiteConfig>();
```

Generic: pass your site config interface for typed access:
`getSiteConfig<SiteConfig>()`.

### `getFragment(name)`

Loads a fragment by name. Checks render input first (preview mode), then
provider fallback.

### `getLayout(name)`

Loads a layout by name. Checks render input first (preview mode), then
provider fallback.

### `getPage(route)`

Loads page content for a specific route. Checks render input first
(preview mode), then provider fallback.

### `getRenderInput(route)`

Loads the full render input (page + siteConfig + domain + locale). Used
internally by `createPage`. Available for custom server composition when
you need the full render context.

### `routeFromNextParams(params)`

Normalizes Next.js catch-all params (`{ slug?: string[] }`) into a route
string. Handles `Promise`-wrapped params from Next.js 15+.

### `isPreviewMode()`

Async function returning the preview release ID string when in preview
mode, or an empty string when not. Use as a truthy check:

```tsx
const previewRelease = await isPreviewMode();
if (previewRelease) { /* preview-specific logic */ }
```

### `createGradialMiddleware(config)`

Creates Next.js middleware for ACI sites. Requires explicit `siteId`.

```ts
// src/middleware.ts
import { createGradialMiddleware } from '@gradial/aci/next/middleware';

export default createGradialMiddleware({ siteId: 'your-tenant-id' });
export { config } from '@gradial/aci/next/middleware';
```

The SDK exports a canonical middleware matcher via the `config` export. Repos
should re-export it verbatim. Do not hand-roll custom matcher patterns unless
site-specific static paths require exclusions.

**Config interface:**

```ts
export interface GradialMiddlewareConfig {
  siteId: string;                              // REQUIRED
  edgeConfig?: string;
  previewSignKey?: string;
  deploymentId?: string;
  deploymentProtectionBypass?: string;
}
```

The middleware rewrites public URLs to `/__r/{releaseId}/routes/{path}` for
the app-level route. The SDK extracts releaseId and resolves the content route
internally.

### `DevRefresh`

React component for dev-mode content refresh. Connects to the SDK's
content watch WebSocket and triggers a page reload when compiled content
changes. Add to the root layout:

```tsx
import { DevRefresh } from '@gradial/aci/next';

// In layout body:
<DevRefresh />
```

**Mandatory** for Next.js repos. Only active in development
(`NODE_ENV !== 'production'`). Renders `null` in production.

### Error Classes

| Class | Thrown When |
|-------|-------------|
| `PageNotFoundError` | Page not found for a route |
| `FragmentNotFoundError` | Fragment not found by name |
| `LayoutNotFoundError` | Layout not found by name |

`createPage` catches `PageNotFoundError` and calls `notFound()`
automatically.

## Three-Tier Content Resolution

Every SDK server function follows the same resolution chain:

### Tier 1: Render Input (Preview Mode)

When the Go harness sends a render request, it sets the
`x-gradial-render-input-id` header. The SDK checks the
`pendingRenderInputs` in-process map for a matching render input and
returns page data directly from the Go harness's render payload. This
is how preview works — the harness pushes content into the Next.js
process without touching S3 or disk.

### Tier 2: File Provider (`ACI_CONTENT_PROVIDER=file`)

When the `ACI_CONTENT_PROVIDER` environment variable is set to `file`,
the SDK reads compiled content from `.aci/compiled/` on disk. This is
the local development path. Also used as a fallback in preview mode when
no render input header is present.

### Tier 3: S3 Provider (Deployed SSR)

When neither render input nor file provider is active, the SDK reads
from S3. The release ID is resolved from (in order):

1. `x-gradial-release-id` header (set by middleware)
2. `ACI_RELEASE_ID` environment variable
3. Vercel Edge Config active release pointer

## Critical Rule

**NEVER import `FileContentProvider` or `S3ContentProvider` directly in
app code.** Always use `getPage()`, `getSiteConfig()`, `getFragment()`,
`getLayout()`, or `getRenderInput()` from `@gradial/aci/next`. The SDK
handles the resolution chain automatically.

The only exception is the transitional asset route handler
(`src/app/gradial/assets/[...path]/route.ts`), which directly
uses `FileContentProvider` for local asset serving and
`getReleaseAssetResponse` for S3 assets. The preferred path is to use no
app-level asset route at all (`withAci()` handles rewrites for Next.js;
CloudFront function rewrite for Astro). DAM derivative assets are
content-addressed and globally shared — staged once at `{keyPrefix}/.gradial-dam/`
and shared across all releases.

## Layout.tsx Pattern

The root layout is minimal: import CSS, optionally load site config, and
include `<DevRefresh />`. Chrome (Header/Footer) is **not** in layout.tsx —
it is CMS-managed via layout fragment defaults and rendered by `createPage`.

```tsx
import { DevRefresh, getSiteConfig } from '@gradial/aci/next';
import type { ReactNode } from 'react';
import '@/design-system/styles.css';

export default async function Layout({ children }: { children: ReactNode }) {
  const siteConfig = await getSiteConfig<SiteConfig>().catch(() => null);
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

`<DevRefresh />` is **mandatory** for Next.js repos. It provides dev-mode
content hot-reload.

For sites that need site config in the layout (e.g., for fonts or
metadata), use `getSiteConfig<SiteConfig>()` with a `.catch(() => null)`
fallback so the layout doesn't crash if content isn't available during
build.
