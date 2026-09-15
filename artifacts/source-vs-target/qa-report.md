# Ballard source-versus-target QA

Source: `https://ballard-five.vercel.app/` (upstream commit `448f49b`)

Target: `http://localhost:3002/`

Checked during the source-driven migration on 2026-09-13. Measurements are rendered CSS pixel dimensions, not image-diff estimates.

## Passed interaction coverage

- Header desktop mega-menu, rotating announcement, mobile drawer, and breakpoint change (mobile through 768px; desktop at 1024px) are present.
- Product selection: colors, size-required state, condition tabs, accordions, add-to-bag, drawer auto-open, quantity +/-/remove, Escape close, and `ballard-cart-v1` persistence were exercised successfully.
- Empty cart structure and populated cart drawer mirror the upstream accessibility roles and controls.
- Catalog mobile filter drawer, URL-backed size filtering, category/condition/material/color controls, sort, and clearable state are now present after the metadata import.
- Product size-required state, color selection, repaired/new tabs, add-to-bag drawer opening, drawer quantity controls, remove, Escape close, and body-scroll lock remain intact after the source-fidelity reset fix.

## Product and bag source-fidelity pass

At each canonical viewport (390, 640, 768, 1024, 1280, 1440, and 1536), target measurements exactly match upstream commit `448f49b` for the following rendered elements:

| Route/state | Matched elements |
| --- | --- |
| `/products/salmon-bay-parka` | Breadcrumb, gallery, detail column, buy panel, copy/tradeoff, accordion stack, related grid, and full document height. |
| `/cart` empty | Container, heading, count, empty state/action row, and full document height. |
| `/cart` one item | Container, item list, line item, responsive summary, and full document height. |
| Cart drawer, one item | Drawer, header, scroll body, footer/subtotal panel, including 390px full-width and 448px desktop panel states. |

The 1440px product route, for example, is source = target: breadcrumb `44,141,1352×16`; gallery `44,177,749.09×1384.14`; detail `841.09,177,554.91×1384.14`; buy panel `841.09,263.89,554.91×460`; related grid `44,1625.14,1352×627.13`; document height `2773`. At 390px, source = target: gallery `16,161,358×725`; detail `16,918,358×1580.13`; buy panel `16,1002.5,358×520`; document height `4760`.

The correction removes unlayered reset rules that had overridden Tailwind margin/font utilities, then uses the source's `1.5` base line-height and `-0.015em` heading tracking. This restores exact source control typography and vertical rhythm without changing JSON-driven content or cart interaction behavior.

## Geometry snapshots

| Page / viewport | Source | Target | Status |
| --- | ---: | ---: | --- |
| Home, 1440: header / hero / main | 121 / 620 / 4314 | 121 / 620 / 4264 | close |
| Home, 390: header / hero / main | 105 / 776 / 5768 | 105 / 775 / 5769 | close |
| Product, 390: header / main / footer | 105 / 3363 / 1292 | 105 / 3324 / 1292 | main close |
| Catalog, 390: header / main / footer | 105 / 2588 / 1292 | 105 / 2587.75 / 1292 | exact (0.25px main delta) |
| Story detail, 390: header / main / footer | 105 / 2512 / 1292 | 105 / 2326 / 1292 | article is short |
| Repair, 390: header / main / footer | 105 / 4134 / 1292 | 105 / 3942 / 1292 | page is short |
| Stores, 390: header / main / footer | 105 / 1475 / 1292 | 105 / 1315 / 1292 | page/type is short |

## Remaining acceptance failures

1. `/search?q=rain` is static in the target: it shows suggestions and zero results, while the source returns 30 product/story results. Port source query parsing and result grids.
2. Repair and Field forms lack source form semantics: input names, required constraints, and GET action/query behavior. The current target form submits/reloads without preserving values.
3. At 390px, Stores H1 is target 30px versus source 36px. Recheck other mobile content pages after responsive CSS alignment.
4. Home H1 must be fixed 60px at `md` and above, matching source `text-5xl md:text-6xl`. Target's clamp is 52px at 1024, 53.76px at 1280, 60.48px at 1440, and 64.512px at 1536; source is 60px across 768–1536.

## Catalog revalidation — 2026-09-13

- At 390px, the target is 3985px tall, matching the captured source exactly. Header, main, and footer are 105px / 2587.75px / 1292px; the captured source values are 105px / 2588px / 1292px. The main delta is -0.25px (0.01%).
- The product grid begins at y=410.5px (captured source: y=410px) and its first card image is 213.75px high (captured source: 214px): both are below 0.13% variance. All six row starts are within 1px of the captured source after restoring source card spacing and source alphabetical ordering.
- Target breakpoints were exercised at 390, 640, 768, 1024, 1280, 1440, and 1536. The grid follows the upstream two-column mobile / three-column tablet-and-up behavior; desktop enables the 240px filter rail at 1024px.
- The deployed source now leaves its product request in the visible `Loading gear` fallback, so fresh visual card comparisons above 390px cannot be sampled until that upstream Contentful request resolves. The local implementation uses the checked-in upstream page and `ProductGrid`/`ProductCard` markup and classes verbatim; the 390px captured source remains the direct rendered reference.
- Verified behavior: selecting `Jackets and shells` changes the target URL to `?sub=jackets` and product count to 6; returning to `All` restores the canonical URL and all 12 products.

## Required final gate

After the remaining fixes, rerun these route checks at 390, 640, 768, 1024, 1280, 1440, and 1536: `/`, `/shop/mens`, `/products/salmon-bay-parka`, `/repair`, `/stories/how-to-reproof-waxed-cotton`, `/stores`, `/cart`, and `/search?q=rain`. Then run content compile, typecheck, lint, tests, production build, and Storybook.
