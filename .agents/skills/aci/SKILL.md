---
name: aci
description: Onboarding, running builds, validating, and troubleshooting ACI sites. Use when understanding ACI architecture, running CLI commands, diagnosing build errors, or checking project health.
---

# ACI — Onboarding and Troubleshooting

## Creating a New Site

```bash
# Scaffold-only (default) — golden-path skeleton, no demo content
# Astro is standard for new customer sites
aci init my-site --template astro-starter

# Next.js is for specific SSR properties
aci init my-site --template next-starter

# With demo content, components, and stories
aci init my-site --template astro-starter --with-starter-content

# List available templates
aci init --list
```

The **scaffold** is the new-customer entry point: config, framework wiring,
page route, empty registry, design system, and agent skills. Add your own
contracts and components from here.

The **--with-starter-content** flag overlays demo material on top of the
scaffold: `.content/` fixtures, demo components (sections, elements, chrome),
a full registry, stories, and fixtures.

## How ACI Works

```
.content/  ──aci build──▶  .aci/compiled/  ──framework build──▶  dist/
   JSON                      compiled JSON            static HTML
```

1. You author content as JSON files under `.content/`.
2. The `aci` CLI compiles contracts (component schemas) and content into
   `.aci/compiled/`.
3. Your framework (Astro or Next.js) reads the compiled content at build
   or render time and produces HTML.

## Contracts vs Runtime

The most important architectural rule: **contracts are separate from
runtime components**.

| Layer | Location | Imports | Purpose |
|-------|----------|---------|---------|
| Contracts | `src/cms/contracts/` | `@gradial/aci`, `zod` only | Component IDs, Zod schemas, image slots, block refs |
| Runtime | `src/components/` | Framework code, CSS, contract types | Actual UI components (Astro, React) |

The ACI compiler imports only `src/cms/contracts/**`. Contract files must
never import framework components, CSS, browser globals, or runtime
modules. Runtime components may import contract types to keep props
connected to schemas.

## Framework Integration

Each framework uses a packaged SDK adapter for ACI dev/build behavior:

- **Astro**: `withAci()` in `astro.config.mjs`
- **Next.js**: `withAci()` in `next.config.ts`

These adapters own canonical ACI behavior: content watch/reload, local DAM
derivative serving at `/.gradial-dam/*`, asset path rewrites, output mode,
outputFileTracingRoot, base-path/build-mode/dist-dir env injection, CDN
headers, and content-watch plugin. Repos should pass an empty `withAci()`
call and rely on SDK defaults. Use `passthroughRoutes` only for
site-specific non-CMS routes.

Only Next.js and Astro are supported. SvelteKit support has been removed.

## CLI Commands

All commands run from the site directory (where `.aci.yaml` lives).

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with content hot-reload (auto-compiles content). |
| `npm run build` | Framework production build. |
| `npm run typecheck` | TypeScript type checking. |
| `npm test` | Run conformance tests. |
| `npm run content:compile` | Compile content from `.content/` into `.aci/compiled/`. Standard: `aci content compile --content .content --out .aci/compiled` |

## Development Workflow

### Start dev server

```bash
npm install
npm run dev
```

The dev server compiles content on startup — no manual compile needed.

The dev server watches for content changes and re-compiles automatically
via the framework's ACI adapter. Edit `.content/` files and see changes
in the browser. No manual compile step needed before `dev`.

### Full local build

```bash
npm run content:compile
npm run typecheck
```

### Content editing loop

1. Edit `.content/pages/{slug}/_index.json` or `.content/config/site.json`.
2. Run `npm run content:compile` to compile content.
3. Run `npm run build` to build the site.
4. Check the output for your changes.

## Test Order (Fastest to Slowest)

1. `npm run typecheck` — TypeScript
2. `npm test` — conformance tests
3. `npm run content:compile` — content compile
4. `npm run build` — framework build
5. `npm run build:storybook` — Storybook (if configured)

## Conformance Checks

Repos run conformance tests in CI using the `@gradial/aci/testing` preset:

```ts
import { conformancePreset } from '@gradial/aci/testing';

conformancePreset({
  framework: 'next',
  siteId: 'your-tenant-id',
});
```

Default checks validate:
- `config` -- `withAci()` present in config
- `registry` -- `createRegistry()` usage (no hand-rolled maps)
- `pageEntry` -- `createPage(registry)` usage in catch-all route
- `middleware` -- `createGradialMiddleware({ siteId })` with correct siteId
- `noFileContentProvider` -- no direct `FileContentProvider` imports in app code
- `noCustomContent` -- no `src/lib/content.ts` shim
- `noLegacyAssetRoute` -- no `[releaseId]` segment in asset route path
- `sdkVersion` -- SDK version compatibility

Optional (disabled by default):
- `buildSucceeds` -- full build completes
- `contentCompile` -- content compilation succeeds

## Troubleshooting

### "Unknown component" error during content compile

The content JSON references a `component` name that is not in the contract
barrel (`src/cms/contracts/components/index.ts`). Add the contract or fix
the content.

### Contract compile fails with CSS/framework import error

A contract file is importing runtime code. Contract files may only import
`@gradial/aci`, `zod`, and shared schema helpers. Move the import to a
runtime component file.

### Images not loading in dev

Check that `ACI_CONTENT_ROOT` is set and the framework adapter is wired.
Compiled DAM derivatives should be served at `/.gradial-dam/*`. Verify:

```bash
curl -I http://localhost:4321/.gradial-dam/derivatives/sha256/.../image.webp
```

Expected: `200` with `Content-Type: image/webp` (or similar image type).

### `aci` command not found

The CLI is provided by `@gradial/aci`. Run `npm install` first. The npm
scripts use `node ./node_modules/@gradial/aci/bin/aci.js` to find it
locally.

### Content value not surviving compile/build

If a value doesn't survive the round-trip, check:
- The field is in the contract schema (or it will be stripped).
- The field name matches between content JSON and contract schema.
- The field type matches (string vs number vs object).

## Key Files

| File | Purpose |
|------|---------|
| `.aci.yaml` | ACI config: contract paths, framework, routes, capabilities |
| `src/cms/contracts/components/index.ts` | Component contract barrel |
| `src/cms/contracts/layouts/index.ts` | Layout contract barrel |
| `src/cms/registry.ts` | Component registry (`createRegistry` with `[contract, component]` tuples) |
| `src/components/` | Runtime component implementations |
| `src/design-system/` | Design tokens and global styles |
| `.content/` | Local content for development |

## Deep Dive: Authoring

Read `.agents/skills/authoring/SKILL.md` for content authoring, component
development, design tokens, and the full contract/runtime split.

## Deep Dive: Migration

Read `.agents/skills/migration/SKILL.md` for reverse-engineering a live
site or design into ACI.
