---
name: migration
description: Migrate existing websites, Figma designs, or screenshots into ACI repos. Use when reverse-engineering a live site, extracting design tokens, modeling content from HTML, building components to match a visual source, or running a pixel-perfect migration workflow.
---

# Migration — Reverse-Engineering into ACI

## Goal

A pixel-perfect migration. Phase 3 targets <10% visual variance per
section. Phase 4 targets <1% variance per element.

"We reused existing components and called it done" is not a successful
migration. Build new components and copy CSS 1:1 when needed. Visual
fidelity wins over design-system purity.

## Phases

### Phase 1: Style Transfer

1. Visually inspect the live source site using browser automation.
2. Describe the style visually first (color palette, type scale, spacing
   rhythm, accent treatments) before touching code.
3. Inspect source CSS files to extract exact font families, color hex/rgb
   values, and typography specs.
4. Scan source CSS for responsive breakpoints. Record the canonical
   breakpoint set (e.g., `[360, 768, 1024, 1280, 1400]`).
5. Translate findings into design tokens and populate
   `src/design-system/tokens/`.
6. Update base styling of the target: header, footer, logo, CTAs/buttons,
   typography, accents.
   - The customer logo must be downloaded and wired in Phase 1.
   - Header and footer chrome colors must be extracted from source CSS,
     not eyeballed.
   - Font family must match.
7. Visually inspect the target site, note discrepancies, then fix base
   styling iteratively.

### Phase 2: Content Modeling

**CONTENT DRIVES LAYOUT.** The content model in `_index.json` and
`site.json` describes every element you'll need to render.

Rules:
1. **Never hard-code content inside component code.** All content lives in
   the JSON content model.
2. **Do not use bare atomic blocks for migration-phase content modeling.**
   Stub out named components with named props — even if the component
   doesn't exist yet. The content model is a contract for what components
   must be built.
3. **Name components by inspecting the source HTML.** Look at class names
   of root elements (e.g., `ancillary-nav`, `home-hero`) — that's your
   component name.
4. **Extract copy from HTML markup, not from visual inspection.** Use HTML
   parsing to pull exact strings. Agents drift when reading text off
   screenshots.
5. **Classify imagery:** `<img>` child vs CSS `background-image` on the
   root vs CSS `background-image` on a wrapper. This drives the component's
   markup.
6. **Migrate copy verbatim.** Do not paraphrase, summarize, or invent
   marketing claims, policy text, or CTAs.
7. **Stub every content element you observe.** Missing nav items, social
   links, fine print — if it's on the source page, it's in the content
   model.

For global elements (header, footer, nav), put their content under
`.content/config/site.json`, not in page content.

### Phase 3: Component Development

The default assumption is that **new components will be built.** If you
finish a section and built no new components, re-inspect for missed detail.

1. Work one page section at a time, starting with global sections (header,
   footer).
2. Build an atomic component system for reused elements.
3. For each section: isolate single, reused, atomic elements first, then
   build the broader section.
4. Use browser tools to visually compare source -> target.
5. Rely on visual descriptions first — describe layout, don't migrate
   markup 1:1.
6. Build Storybook stories for every component/block.
7. For polish: if visual flourishes can't be expressed via existing
   design-system primitives, build a new component or variant.

**Variance bar: <10% per section.** If a section is over 10%, you're
missing a structural element — fix that before moving on.

### Phase 4: Polish (Pixel-Level Visual Regression)

**<1% visual variance per element is the bar for "done."**

1. Go element by element, not section by section.
2. Inspect applied CSS on the source for each element using DevTools or
   `getComputedStyle`.
3. Copy CSS verbatim into the target when needed. Fidelity wins over
   abstraction.
4. Decide per element: extend the design system, or do a 1:1 CSS
   migration?
5. Diff workflow: scope the visual-diff to a single element. Diff, fix
   one delta, re-diff. Iterate until under 1%.
6. Compare at the same dimensions at every breakpoint from the source's
   CSS breakpoint set.
7. Report prose discrepancies, not just percentages.

## Decision Principles

- **Visual fidelity first, markup parity never.** Match the visual, build
  the structure idiomatically.
- **Atomic before composite.** Always migrate the smallest reusable unit
  first.
- **Describe before implementing.** Write a prose description of what you
  see before writing code.
- **Pixel fidelity beats design-system purity.** If the design system
  can't express the source faithfully, build a new component or variant.
- **Migrate copy verbatim.** Never paraphrase or invent content.
- **One section at a time.** Resist the urge to scaffold everything at
  once.

## Deep Dive: Analyzing Source Sites

Read `references/analyzing-source.md` for Playwright patterns, CSS
extraction, DOM inspection, interactive state probing, and responsive
inspection techniques.

## Deep Dive: Component Migration

Read `references/component-migration.md` for building components to spec,
header/footer inventory checklists, visual verification workflows, CSS
discipline rules, and interactivity approach.

## Deep Dive: Selector Map

Read `references/selector-map.md` for the source-to-target selector
mapping format that tracks every migrated element.

## Deep Dive: Canon Migration

Read `references/canon-migration.md` for per-repo migration guidance to the
frontend canon. This document provides specific migration steps for each repo
based on the survey divergence matrix (honeywell, optimum, bnc, website-v2).

## Validation Gates

Before considering any change complete:

1. Run `npm run aci:compile` — contract + content compile (validates content)
2. Run `npm run typecheck && npm run build` — CI build steps
3. Run visual regression comparisons
4. Verify Storybook stories render correctly

## Asset Handling

Default: treat customer fonts and imagery as proprietary. Substitute the
closest licensed/open alternative and use neutral placeholders.

**Demo override:** If this is a demo/proof-of-concept, download assets and
serve them locally. Do NOT hot-link the customer's CDN.

1. Fonts: extract `@font-face` declarations, download font files, rewrite
   URLs to local paths.
2. Images: download hero shots and section imagery, preserving `srcset`
   variants.
3. Logos: download the customer's logo and reference locally.
4. Organize under a customer-scoped subdirectory
   (e.g., `public/images/<customer>/`).
