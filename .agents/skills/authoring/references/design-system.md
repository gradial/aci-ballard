# Design System Reference

## Source of Truth

Design tokens are CSS custom properties defined in `@theme` blocks under
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

## Using Design Tokens

### Direct Tailwind utilities (preferred)

Tailwind v4 derives utilities from `@theme` tokens. Use these directly:

- **Color**: `text-fg`, `text-fg-muted`, `bg-surface-default`, `bg-page-inverse`, `border-edge`
- **Radii**: `rounded-card`, `rounded-button`
- **Shadows**: `shadow-card-default`

Standard spacing/sizing utilities (`px-4`, `gap-6`, `w-24`, `max-w-3xl`)
are safe because Tailwind v4 derives its spacing scale from `--spacing`.

Layout utilities (`items-center`, `overflow-hidden`, `aspect-video`,
`uppercase`, `text-lg`, breakpoint prefixes like `lg:`) are all fine.

### Bracket syntax (for tokens without direct utilities)

For values without a direct Tailwind utility mapping — gradients,
typography tokens, complex custom properties — use `var(--...)` bracket
syntax:

- **Gradients**: `bg-[image:var(--gradient-cta-dark)]`, `bg-[image:var(--gradient-hero-overlay)]`
- **Typography**: `text-[length:var(--text-size-body)]`, `font-[var(--font-weight-semibold)]`, `[font-family:var(--font-family-heading)]`, `leading-[var(--leading-heading)]`
- **Spacing tokens**: `py-[var(--spacing-section-y)]`, `p-[var(--spacing-card)]`

## Forbidden Values

**No raw hex colors**: `text-[#8b72ff]`, `bg-[#f6f6f7]`
**No raw pixel values**: `p-[12px]`, `w-[200px]`, `gap-[24px]`
**No raw rem values**: `text-[1.25rem]`, `p-[0.75rem]`
**No Tailwind named colors**: `text-gray-500`, `bg-purple-400`

Use CSS variable tokens instead. If a token doesn't exist for a value you
need, add it to the appropriate `tokens/*.css` file.

The ESLint rule `no-raw-tailwind-values` enforces this in component code.
Raw values are allowed only inside `src/design-system/tokens/` and
`src/design-system/styles.css`.

## Component CSS Discipline

- Use Tailwind classes for layout, spacing, responsive behavior, display,
  flex/grid, sizing, and positioning.
- Use CSS custom properties from the design system for colors, surfaces,
  borders, typography, font sizes, radii, shadows, gradients, spacing
  scales, and theme behavior.
- Do not hard-code color, font family, or font size values in component
  markup when a design token can express the intent.
- Do not create component-specific text color tokens when contextual tokens
  are enough. Prefer `--color-text-default`, `--color-text-default-muted`,
  `--color-surface-default`, `--color-border-default`.
- Keep button variant tokens explicit for contrast-sensitive states.

## Theme System

Three theme classes control semantic token resolution:

| Class | Use Case |
|-------|----------|
| `theme-auto` | Normal page content following browser light/dark preference |
| `theme-dark` | Fixed dark surfaces (header, footer, hero) |
| `theme-accent` | CTA-style accent surfaces |

Theme classes override semantic tokens:

```css
.theme-dark {
  --color-fg: var(--color-fg-inverse);
  --color-surface-default: var(--color-page-inverse);
  --color-edge: var(--color-edge-inverse);
  /* ... */
}
```

Apply theme classes to wrapper elements:

```html
<div class="theme-dark">
  <p class="text-fg">This text uses the dark theme fg color.</p>
</div>
```

### Chrome-Specific Override Scopes

Header, footer, and mobile nav have dedicated class scopes for
self-contained chrome theming:

| Scope | Purpose |
|-------|---------|
| `.bm-header` | Header background, text, borders, button overrides |
| `.bm-footer` | Footer background, text, borders, button overrides |
| `.bm-mobile-nav` | Mobile nav background, text, borders |

These scopes set their own token values independently of the theme system.
Use them to override chrome appearance without leaking overrides into page
content.

## Grid Layout

Use a 12-column grid mental model for layout sections. Grid components
that render a variable number of children must compute column classes
dynamically:

| Items | Columns | Responsive Pattern |
|-------|---------|-------------------|
| 1 | 12 | full width |
| 2 | 6 each | `sm:grid-cols-2` |
| 3 | 4 each | `sm:grid-cols-2 lg:grid-cols-3` |
| 4 | 3 each | `sm:grid-cols-2 lg:grid-cols-4` |

### Critical: Tailwind Purge Safety

Tailwind purges unused CSS classes at build time. Dynamic column classes
must appear as **complete string literals** in source code — not assembled
via string interpolation.

**Bad** (class is purged, no CSS generated):
```tsx
<div className={`grid-cols-${columns}`}>
```

**Good** (complete literal, survives purge):
```tsx
const gridClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};
<div className={gridClasses[columns]}>
```

This applies to all dynamic Tailwind classes, not just grid columns. Any
class that is conditionally applied must be a complete literal visible to
the Tailwind scanner.

## Adding New Tokens

When a source value doesn't map to an existing token:

1. Add the token to the appropriate `tokens/*.css` file inside `@theme`:
```css
@theme {
  --color-brand-500: #6b5ce7;
}
```
2. Reference it from component code:
```html
<div class="text-[var(--color-brand-500)]">
```
3. Tailwind v4 will auto-generate a utility if the token name matches a
   Tailwind namespace (e.g. `--color-*` generates `text-*`, `bg-*`).
