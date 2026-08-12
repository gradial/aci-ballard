# Component Migration

This guide covers building components to spec, visual verification, and
variance targets during the component development phase.

## Building Components

### Start with global sections

Work in this order:
1. Header (navigation, branding, ancillary nav, utility buttons)
2. Footer (columns, social links, legal links, copyright)
3. Page sections (hero, feature grids, CTAs, etc.)

### Atomic before composite

Always migrate the smallest reusable unit first:

1. Identify reused elements (buttons, icons, cards, logos)
2. Build them as `elements/` components
3. Compose sections from elements

### Build new components

The default assumption is that **new components will be built.** If you
finish a section and built no new components, that's a smell — re-inspect
for missed detail before declaring done.

### Visual description first

Before writing component code:
1. Describe what you see in prose (layout, colors, spacing, imagery)
2. Identify the source CSS class names for the component
3. Determine the imagery mode (img child vs background-image)
4. Note interactive behavior

Then build the component to match the visual description, not the source
markup.

## Component Tiers

Use the three-tier structure:

| Tier | Directory | Purpose |
|------|-----------|---------|
| elements | `src/components/elements/` | Small reusable UI + atomic content blocks |
| sections | `src/components/sections/` | Page-level section components |
| chrome | `src/components/chrome/` | Site chrome (Header, Footer, Nav) |

Do not create additional tiers. Three directories are sufficient.

## Header Inventory Checklist

Verify every item is present:
- [ ] Customer logo (image, linked to brandHref)
- [ ] Ancillary nav (top strip — residential/business switcher, phone, etc.)
- [ ] Primary nav with hover/click flyouts for sub-links
- [ ] Utility buttons (Support, Sign In) with icons
- [ ] Address-availability signup form (if present on source)
- [ ] Mobile: hamburger on correct side, mobile logo, mobile-nav icons,
      mobile ancillary nav, full-screen drawer behavior

**Mobile nav pro-tip:** do NOT try to contort the desktop nav into a
mobile nav by re-arranging the same elements. Duplicate the nav elements
for mobile and show/hide via media queries and JS-applied open/closed
classes. Markup duplication is cheaper than the state machine you'll
otherwise build.

## Footer Inventory Checklist

- [ ] Customer logo
- [ ] Left column: phone number, address, legal disclaimer, copyright,
      social icon links
- [ ] Footer nav columns (Company, Products, Support, etc.)
- [ ] Any sub-footer / accessibility links

## Storybook Stories

Build stories for every component/block, including variants and all states
(hover, mobile-open, signed-in, etc.):

```ts
// src/stories/HomeHero.stories.ts
export default {
  title: 'Sections/HomeHero',
  component: HomeHero,
};

export const Default = {
  args: {
    eyebrow: 'Welcome',
    headline: 'Build something great',
    ctaLabel: 'Get started',
    ctaHref: '#start',
  },
};

export const NoEyebrow = {
  args: {
    headline: 'Build something great',
    ctaLabel: 'Get started',
    ctaHref: '#start',
  },
};
```

## Visual Verification

### Phase 3: <10% variance per section

1. Render both source and target at the same viewport size.
2. Take screenshots of each section.
3. Compare visually and compute variance percentage.
4. If over 10%, identify the missing structural element and fix it.

Common Phase 3 failures:
- Missing nav item
- Missing icon
- Wrong markup tree (e.g., media-then-body when source is
  background-image overlay)
- Missing entire section

### Phase 4: <1% variance per element

1. Go element by element (a single button, a single nav link, a single
   heading).
2. Inspect applied CSS on the source for each element.
3. Copy CSS verbatim when the design system can't express the fidelity.
4. Diff, fix one delta, re-diff. Iterate until under 1%.

Common Phase 4 failures:
- Wrong hex color
- Wrong font weight (source uses 500/600 where you used 400/700)
- Wrong padding between text elements
- Missing icon
- Wrong icon size
- Missing accent line/underline
- Wrong border-radius

## CSS Discipline

Phase 4 says "copy applied CSS verbatim" — that is the intent, not the
implementation. The implementation must respect design-token discipline:

- **Raw hex colors are banned in component CSS.** If the source uses
  `#002864`, find the matching token or add a new one in
  `src/design-system/tokens/colors.css`.
- **Raw px/rem/em units are banned in component CSS.** Use existing
  spacing/typography tokens, or add new ones. `px` is permitted for border
  widths and inside `@media` declarations only.
- **Tokens live in `src/design-system/tokens/`.** Add to these files when
  source values don't map, then reference from component CSS.

Workflow for a Phase 4 fix:
1. Pull the value via `getComputedStyle`.
2. Check if a token exists that matches.
3. If not, add the token to the appropriate `tokens/*.css` file.
4. Reference the token from the component.

## Images-as-Text Detection

Eyebrows, brand wordmarks, and badges that *look like text* are often
`<img>` elements. Check the DOM:

```javascript
const eyebrow = document.querySelector('.hero .eyebrow');
console.log(eyebrow.tagName); // 'IMG' or 'SPAN' or 'DIV'
```

If it's an `<img>`, treat it as an image in the content model, not text.

## Interactivity Approach

Apply interactivity with a light touch:
- Click through tabs to verify other panes
- Scroll to verify sticky elements
- Use class name toggles over markup restructuring
- Use show/hide variant content based on applied classes
- Prefer style attributes and class application over drastic markup changes

## Page Section Strategy

- Stub sections with base container/column grid first
- Most layouts should be child blocks within base layout blocks
- Promote a section to its own section block only when it requires:
  - Interactive elements
  - Animations
  - Dynamic data (product listings, tabs, carousels)

## Responsive Verification

Always view pages at multiple viewport sizes (mobile, tablet, desktop)
before declaring a section complete. Use the source's breakpoint set as
the reference viewports.

## When to Ask for Clarification

- The design system lacks tokens for a clearly important visual element
- A section's interactivity model is unclear (carousel vs static grid)
- Content modeling decisions have multiple valid interpretations
