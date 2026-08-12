# Canon Migration Reference

This document provides repo-specific migration guidance to the frontend canon.
Use it alongside the canonical spec (`tasks/frontend-canon-decisions.md`) and
survey divergence matrix (`tasks/frontend-canon-survey.md`).

---

## General Migration Steps (All Repos)

### 1. Update SDK Version

All repos to `@gradial/aci` version `^0.1.31` (caret range, no exact pinning).

```bash
npm install @gradial/aci@^0.1.31
```

### 2. Update Zod Version

All repos to `zod` version `^4.0.0` (latest major, caret range).

```bash
npm install zod@^4.0.0
```

### 3. Bare `withAci()` Config

Simplify framework config to bare `withAci()` call:

**Next.js:**
```ts
// next.config.ts
import { withAci } from '@gradial/aci/next/config';
export default withAci();
```

**Astro:**
```mjs
// astro.config.mjs
import { withAci } from '@gradial/aci/astro';
export default defineConfig({
  integrations: [withAci()],
});
```

Delete manual env-var plumbing, outputFileTracing, custom rewrites/redirects
for ACI concerns.

### 4. Middleware: Require `siteId`

Update middleware to pass explicit `siteId`:

```ts
// src/middleware.ts
import { createGradialMiddleware } from '@gradial/aci/next/middleware';
export { config } from '@gradial/aci/next/middleware';
export default createGradialMiddleware({ siteId: 'your-tenant-id' });
```

Re-export the SDK's canonical matcher via `config`. Delete custom matchers
unless site-specific static paths require exclusions.

### 5. Path Shape: `[[...slug]]` (Optional Catch-All)

Ensure the filesystem route is `[[...slug]]` (optional catch-all):

```bash
# If the repo has a required catch-all, rename to optional:
mv src/app/\[...slug\] src/app/\[\[...slug\]\]
```

Update `.aci.yaml`:
```yaml
routes:
  cmsManaged: "/[[...slug]]"
```

Production middleware always rewrites to `/__r/{releaseId}/routes/{path}` so
slug is non-empty there, but file-provider local dev passes requests
unrewritten so `/` arrives with an empty slug. A required catch-all 404s
the dev homepage.

### 6. DevRefresh Mandated

Add `<DevRefresh />` to the root layout:

```tsx
// src/app/layout.tsx
import { DevRefresh } from '@gradial/aci/next';

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

### 7. Layout Contracts: Use SDK Helpers

Replace plain object literals with SDK helpers:

```ts
// src/cms/contracts/layouts/index.ts
import { defineLayoutContract, slot, fragmentDefault } from '@gradial/aci';

export default [
  defineLayoutContract({
    name: 'default',
    slots: [
      slot('header'),
      slot('main', true),
      slot('footer'),
    ],
    defaults: {
      header: fragmentDefault('navbar'),
      footer: fragmentDefault('site-footer'),
    },
  }),
];
```

### 8. Content Compilation: Standardize CLI Command

Update `package.json`:

```json
{
  "scripts": {
    "content:compile": "aci content compile --content .content --out .aci/compiled"
  }
}
```

Replace bespoke scripts like `gradial-aci build --skip-code ...` with the
standard command.

### 9. Storybook: Upgrade to v10

For repos on Storybook 9, upgrade to Storybook 10:

**Next.js:**
```bash
npx storybook@latest upgrade
npm install --save-dev @storybook/nextjs-vite
```

**Astro:**
```bash
npx storybook@latest upgrade
npm install --save-dev @storybook-astro/framework
```

### 10. Replace `aci doctor` with Testing Preset

Delete references to `npm run aci:doctor` and `aci doctor` commands. Add the
SDK testing preset to your CI test suite:

```ts
// tests/conformance.test.ts
import { conformancePreset } from '@gradial/aci/testing';

conformancePreset({
  framework: 'next',
  siteId: 'your-tenant-id',
});
```

---

## Repo-Specific Migration Notes

### Honeywell Aerospace (aci-honeywell-aerospace)

**Most divergent Next.js repo.** Requires the most comprehensive migration.

#### Critical Changes

1. **Replace Custom Page Entry with `createPage`**

   Delete `src/app/[[...slug]]/page.tsx` (60+ line custom implementation) and
   replace with canonical SDK pattern:

   ```tsx
   // src/app/[[...slug]]/page.tsx
   import { createPage } from '@gradial/aci/next/page';
   import { registry } from '@/cms/registry';

   const page = createPage(registry);
   export const dynamic = 'force-dynamic';
   export const generateMetadata = page.generateMetadata;
   export default page.default;
   ```

   This eliminates:
   - Custom `resolveRouteFromParams`
   - Custom `loadPage`/`loadSiteConfig` via `src/lib/content.ts`
   - Custom `<CmsPage>` render component
   - `generateStaticParams` with direct `FileContentProvider` imports

2. **Adopt `createRegistry()` (Delete Hand-Rolled Map)**

   Replace the hand-rolled `Record<string, ComponentType<any>>` map in
   `src/components/cms/renderBlock.tsx` with a typed registry:

   ```ts
   // src/cms/registry.ts
   import { createRegistry } from '@gradial/aci';
   import { heroContract } from './contracts/components/hero.contract';
   import { Hero } from '@/components/sections/Hero';
   // ... import all contracts and components

   export const registry = createRegistry([
     [heroContract, Hero],
     // ... all other [contract, component] tuples
   ]);
   ```

   The contracts already exist in `src/cms/contracts/` — wire them into the
   registry and delete the hand-rolled map.

3. **Delete Custom Content Provider**

   Delete `src/lib/content.ts` (thin wrapper over SDK server functions). Use
   SDK server functions directly:

   ```ts
   import { getSiteConfig, getPage } from '@gradial/aci/next';
   ```

4. **Remove Custom Asset Route**

   Delete `src/app/gradial/assets/[releaseId]/[...path]/route.ts` (with extra
   `[releaseId]` segment). Replace with standard path:

   ```ts
   // src/app/gradial/assets/[...path]/route.ts
   export { GET, runtime, dynamic } from '@gradial/aci/next/asset-route';
   ```

   The SDK asset-route handler resolves releaseId internally. No need for an
   explicit path segment.

5. **Delete `content-assets` Route and `.gradial-dam` Rewrite**

   Delete `src/app/content-assets/[...key]/route.ts` and remove the
   `.gradial-dam` rewrite from `next.config.ts`. The SDK asset route handles
   both dev-mode file serving and deployed S3 serving.

6. **Delete Runtime `layouts.ts`**

   Delete `src/cms/layouts.ts` (runtime layout definition duplicating the
   contract-side definition). `createPage` reads layouts from the contract/
   compiled data, not a runtime definition.

7. **Update Layout Contract Defaults**

   Replace raw `{kind: 'fragment-ref' as const, ...}` objects with
   `fragmentDefault()`:

   ```ts
   defaults: {
     header: fragmentDefault('navbar'),
     footer: fragmentDefault('site-footer'),
   }
   ```

8. **Update `.aci.yaml` siteId**

   Change `siteId: site_nextjs` (generic/wrong) to `siteId: honeywell-aerospace`
   (matches tenant name in infrastructure).

#### Risk Mitigation

- Verify `createPage` handles the honeywell component set without regressions.
- Test the full page render pipeline after migrating from custom page entry.
- Ensure all contracts are correctly wired into the new typed registry.

---

### BNC (aci-bnc)

**Cleanest follower.** Minimal divergence.

#### Required Changes

1. **Update Layout Contract Style**

   Replace plain object literals with SDK helpers:

   ```ts
   // src/cms/contracts/layouts/index.ts
   import { defineLayoutContract, slot, fragmentDefault } from '@gradial/aci';

   export default [
     defineLayoutContract({
       name: 'default',
       slots: [
         slot('header'),
         slot('main', true),
         slot('footer'),
       ],
       defaults: {
         header: fragmentDefault('navbar'),
         footer: fragmentDefault('site-footer'),
       },
     }),
   ];
   ```

2. **Add `siteId` to Middleware**

   Update middleware to pass explicit `siteId`:

   ```ts
   export default createGradialMiddleware({ siteId: 'bnc' });
   ```

3. **General Migration Steps**

   Apply all general migration steps (SDK version, Zod version, Storybook
   upgrade, etc.).

---

### Optimum (aci-optimum)

**Only Astro repo in production.** Needs Astro-specific patterns.

#### Required Changes

1. **Replace Manual Page Entry with `getPageData()`**

   Replace the ~60-line manual page entry in `src/pages/[...slug].astro` with
   the SDK's `getPageData()` helper (the Astro equivalent of Next.js `createPage`):

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
   <!-- render data.layout.slots via renderChildren -->
   ```

   This eliminates all direct `FileContentProvider` imports and manual
   layout/slot resolution from the page entry.

   For DAM asset URLs, use `damAssetUrl()` from `@gradial/aci/astro`:

   ```astro
   ---
   import { damAssetUrl } from '@gradial/aci/astro';
   ---
   <img src={damAssetUrl('images/hero.webp')} alt="Hero" />
   ```

2. **CloudFront Asset Behavior (Infrastructure Change)**

   DAM derivative assets are content-addressed and globally shared — staged once
   at the hosting bucket's global `.gradial-dam/` location and shared across all
   releases. The existing CloudFront function in
   `infra/modules/hosting-cloudfront-site/function.js.tftpl` already handles the
   rewrite automatically, rewriting `/.gradial-dam/*` requests to
   `{keyPrefix}/.gradial-dam/*` with no release lookup.

   **No infrastructure changes are needed** — the CloudFront function rewrite is
   already in place and handles DAM asset serving automatically with immutable
   caching (`max-age=31536000`).

3. **Update Layout Contract Defaults**

   Replace raw inline objects with `fragmentDefault()`:

   ```ts
   defaults: {
     header: fragmentDefault('navbar'),
     footer: fragmentDefault('site-footer'),
   }
   ```

4. **General Migration Steps**

   Apply all general migration steps (SDK version, Zod version, Storybook
   upgrade, etc.).

---

### Website-v2 (gradial/website-v2)

**Golden reference (Next.js).** Needs only minor updates.

#### Required Changes

1. **SDK Version Bump**

   Bump from `^0.1.28` to `^0.1.31`. Test on gradial-dev first (has the most
   content/components and potential for breakage).

2. **General Migration Steps**

   Apply all general migration steps. Website-v2 is already close to the canon;
   the main task is updating to the latest SDK and conformance preset.

---

### Website-v2-Astro (gradial/website-v2-astro)

**MISNAMED — Actually Next.js.** Despite the name, this repo is a Next.js 15
app, not Astro. It mirrors website-v2's structure.

#### Required Changes

Same as website-v2 (it's a near-clone). Treat as a Next.js repo, not an Astro
repo.

---

## Conformance Validation

After migration, validate conformance using the SDK testing preset:

```ts
import { conformancePreset } from '@gradial/aci/testing';

conformancePreset({
  framework: 'next',
  siteId: 'your-tenant-id',
});
```

The preset validates (default checks):
- `config` -- `withAci()` present in config
- `registry` -- `createRegistry()` usage (no hand-rolled maps)
- `pageEntry` -- `createPage(registry)` usage in catch-all route
- `middleware` -- `createGradialMiddleware({ siteId })` with correct siteId
- `noFileContentProvider` -- no direct `FileContentProvider` imports in app code
- `noCustomContent` -- no `src/lib/content.ts` shim
- `noLegacyAssetRoute` -- no `[releaseId]` segment in asset route path
- `sdkVersion` -- SDK version >= 0.1.31

Optional (disabled by default, shell out):
- `buildSucceeds` -- full build completes
- `contentCompile` -- content compilation succeeds

---

## Spec Ambiguities (Veto Pending)

The following interpretations from the spec may need clarification:

| Ruling | Interpretation | Risk |
|--------|----------------|------|
| 7 (Asset routes) | `withAci()` for Next.js; CloudFront for Astro. Asset-route export stays transitional. | May want immediate deletion |
| 11 (Content compile) | npm-wrapped Go CLI: `npx @gradial/aci content compile` | May mean new TS-native command |
| 12 (Slug shape) | `[[...slug]]` optional — file-provider dev needs empty slug for `/` | N/A (resolved) |
| 15 (Zod version) | zod 4.x caret range | May mean pin exact minor |

> **Note:** If any of these interpretations are incorrect, the implementing
> workstreams (A/B/C) will also need guidance. Flag ambiguities early.
