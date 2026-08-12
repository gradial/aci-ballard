# Repository Structure Reference

## Generation Modes

The `aci init` command generates sites in two modes:

| Mode | Command | What you get |
|------|---------|-------------|
| **Scaffold** (default) | `aci init my-site --template next-starter` | Golden-path skeleton: config, framework wiring, page route, empty registry, design system, agent skills. No demo content or components. This is the starting point for a new customer. |
| **With starter content** | `aci init my-site --template next-starter --with-starter-content` | Scaffold + demo content (`.content/`), demo components (sections, elements, chrome), full registry, stories, and fixtures. Use for demos or learning. |

Available templates: `next-starter`, `astro-starter`.

## Directory Layout

The scaffold generates the structure below. Items marked **(starter content only)** are
only present when `--with-starter-content` is used.

```
.aci.yaml                        ACI config: contract paths, framework, routes
package.json                     Dependencies and scripts
tsconfig.json                    TypeScript config
.content/                        Local content for development
  config/
    site.json                    Site metadata, navigation, footer, branding, SEO
  pages/
    home/_index.json             Homepage (route /)
    about/_index.json            About page (route /about) (starter content only)
  fragments/
    navbar/_index.json           Navbar fragment (layout default)
    site-footer/_index.json      Footer fragment (layout default)
src/
  cms/
    contracts/
      components/                Component contracts (framework-agnostic)
        homeHero.contract.ts     Hero section contract (starter content only)
        button.contract.ts       Button block contract (starter content only)
        container.contract.ts    Container (nested blocks) contract (starter content only)
        featureGrid.contract.ts  Feature grid contract (starter content only)
        featureCard.contract.ts  Feature card contract (starter content only)
        statsBar.contract.ts     Stats bar contract (starter content only)
        siteNavigation.contract.ts  Site navigation contract (starter content only)
        siteFooter.contract.ts   Site footer contract (starter content only)
        index.ts                 Component contract barrel
      layouts/
        index.ts                 Layout contract barrel (plain objects)
    registry.ts                  Component registry — createRegistry([contract, component] tuples)
  components/
    elements/                    Small reusable components + atomic content blocks
      ButtonBlock.astro/.tsx     Button block (renders <a> with variant)
    sections/                    Page-level section components
      HomeHero.astro/.tsx        Hero section
      ContainerSection.astro/.tsx  Container section (renders nested blocks)
      FeatureGrid.astro/.tsx     Feature grid (renders nested feature cards)
      FeatureCard.astro/.tsx     Feature card
      StatsBar.astro/.tsx        Stats bar
    chrome/                      Site chrome (Header, Footer, Nav)
      Header.astro/.tsx          Site header (renders navbar fragment)
      Footer.astro/.tsx          Site footer (renders footer fragment)
  design-system/
    styles.css                   Global stylesheet + Tailwind import
    tokens/
      colors.css                 Brand and semantic color tokens
      typography.css             Font families, sizes, weights, line heights
      spacing.css                Spacing scale
      radii.css                  Border radius values
      shadows.css                Shadow definitions
      components.css             Component-level tokens
      index.css                  Barrel import for all token files
  app/                           Framework routes (Next.js App Router)
    layout.tsx                   Root layout (minimal, imports CSS only)
    [[...slug]]/page.tsx          Optional catch-all for all CMS pages
  pages/                         Framework routes (Astro file-based routing)
    [...slug].astro              Catch-all for all CMS pages
  layouts/                       Page layout wrappers (framework-specific)
  stories/                       Storybook stories (one per component tier)
  fixtures/                      Test fixture data (optional)
public/                          Static assets (images, fonts, logos)
.agents/                         Agent skills and guides
  AGENTS.md                      Site-level agent guide
  skills/
    aci/                         ACI onboarding and troubleshooting skill
    authoring/                   Content authoring and component development skill
    migration/                   Site migration skill
.aci/
  compiled/                      Generated compiled content (not checked in)
  schemas/                       Auto-generated content schemas
.storybook/                      Storybook configuration
  main.ts                        Framework-specific Storybook config
  preview.ts                     Global decorators, theme switching
eslint-rules/
  no-raw-tailwind-values.js      Custom ESLint rule for design token enforcement
```

## Framework-Specific Paths

Only Next.js and Astro are supported. SvelteKit support has been removed.

### Next.js

| Concern | Path |
|---------|------|
| Routes | `src/app/[[...slug]]/page.tsx` (optional catch-all, `force-dynamic`) |
| Root layout | `src/app/layout.tsx` (minimal — imports CSS, includes `<DevRefresh />`, no chrome) |
| Config | `next.config.ts` with bare `withAci()` |
| Registry | `src/cms/registry.ts` (shared, `createRegistry` with `[contract, component]` tuples) |
| Middleware | `src/middleware.ts` with `createGradialMiddleware({ siteId })` and SDK-exported matcher |
| Asset route | `src/app/gradial/assets/[...path]/route.ts` — thin SDK re-export from `@gradial/aci/next/asset-route`. Serves CMS documents (robots.txt, sitemap.xml) via withAci rewrites and local-dev DAM assets. Hand-rolled asset routes and the legacy release-scoped `[releaseId]/[...path]` variant are banned. Astro has no route (CDN/global path). |

### Astro

| Concern | Path |
|---------|------|
| Routes | `src/pages/[...slug].astro` |
| Layout | `src/layouts/SiteLayout.astro` |
| Config | `astro.config.mjs` with `withAci()` |
| Registry | `src/cms/registry.ts` (shared, `createRegistry` with `[contract, component]` tuples) |
| Storybook | `.storybook/main.ts`, `.storybook/preview.ts` |

## Import Rules

1. **Contract files** import only `@gradial/aci`, `zod`, and shared schema
   helpers. No React, Astro, CSS, browser globals, or runtime modules.
2. **Runtime components** may import contract types and framework code.
3. **Registry files** (`src/cms/registry.ts`) import both contracts and
   runtime components — they are the wiring point.
4. Use `@gradial/aci` as the SDK package. Do not use `@baremetal/runtime`.

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Directories | lowercase, singular, no underscores | `sections/`, `chrome/` |
| Component files | PascalCase | `HomeHero.astro`, `FeatureShowcase.tsx` |
| Contract files | camelCase + `.contract.ts` | `homeHero.contract.ts` |
| Contract `id` | snake_case | `home_hero`, `feature_grid` |
| Test files | `*.test.ts` or `*.spec.ts` | `HomeHero.test.ts` |
| Story files | `*.stories.ts` | `HomeHero.stories.ts` |
| CSS files | lowercase, hyphen-separated | `colors.css`, `styles.css` |
| Block `id` in content | kebab-case with section context | `hero-heading`, `feature-cta` |
| Content `$type` | lowercase | `page`, `site`, `dam.assetRef` |

## Generated Files (Not Checked In)

```
.aci/                    Compiled content and build artifacts
node_modules/           Dependencies
dist/                   Astro build output
.next/                  Next.js build output
```

## Package.json Scripts

Standard scripts across all frameworks:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "typecheck": "...",
    "test": "node --import tsx --test tests/**/*.test.ts",
    "content:compile": "aci content compile --content .content --out .aci/compiled"
  }
}
```

The `dev` command auto-compiles content; no manual compile step is needed
before starting the dev server.

Customer repos use `npm` as the package manager. The monorepo uses `pnpm`.

**Note**: `aci doctor` has been removed. Use the `@gradial/aci/testing` conformance preset in CI instead.
