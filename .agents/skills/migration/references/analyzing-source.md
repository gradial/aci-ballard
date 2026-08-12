# Analyzing Source Sites

This guide covers how to probe live sites for migration: Playwright
patterns, spatial relationships, interactive states, and CSS extraction.

## Visual Inspection

Before touching code, describe what you see:

1. Open the source site in a browser (or via Playwright/headless browser).
2. Take screenshots at desktop and mobile widths.
3. Write a prose description:
   - Overall layout (header, hero, sections, footer)
   - Color palette (primary, secondary, accents, surfaces)
   - Type scale (heading sizes, body size, eyebrow/caption sizes)
   - Spacing rhythm (tight vs airy, section padding)
   - Accent treatments (gradients, borders, shadows)
   - Interactive elements (nav dropdowns, carousels, tabs, accordions)

This description becomes the reference for Phase 1 style transfer.

## CSS Extraction

Inspect the source site's CSS to extract exact values:

### Colors

```javascript
// Via Playwright evaluate
const styles = getComputedStyle(document.querySelector('.hero'));
console.log(styles.color, styles.backgroundColor, styles.borderColor);
```

Or inspect the source CSS files directly:
- Look for `:root` or `body` custom properties
- Find the brand color palette
- Note semantic color usage (text, surface, border, accent)

### Typography

Extract:
- Font family declarations (`font-family`)
- Font weights used (`font-weight`)
- Font sizes at each heading level
- Line heights
- Letter spacing
- Font loading mechanism (`@font-face`, Google Fonts, etc.)

### Spacing

Look for:
- Container max-width
- Section vertical padding
- Card padding
- Gap values in grids/flex
- Header/footer height

### Responsive Breakpoints

Scan CSS for `@media` rules across loaded stylesheets:

```javascript
// Via Playwright
const sheets = Array.from(document.styleSheets);
const breakpoints = new Set();
for (const sheet of sheets) {
  try {
    const rules = sheet.cssRules;
    for (const rule of rules) {
      if (rule instanceof CSSMediaRule) {
        const match = rule.conditionText.match(/min-width:\s*(\d+)/);
        if (match) breakpoints.add(parseInt(match[1]));
      }
    }
  } catch (e) { /* cross-origin */ }
}
console.log([...breakpoints].sort((a, b) => a - b));
```

Record the canonical breakpoint set. These are the only viewports for
visual-diff comparisons.

## DOM Inspection

### Classify each element

For every content element on the source page, classify:

1. **Is it text or an image?**
   - Use `textContent` or `innerHTML` to extract copy.
   - Check if eyebrows/badges/logos that look like text are actually
     `<img>` elements.

2. **How is imagery rendered?**
   - `<img>` child element
   - CSS `background-image` on the root element
   - CSS `background-image` on a wrapper element
   - Check with: `getComputedStyle(el).backgroundImage`

3. **Is it interactive?**
   - Click to check for dropdowns, tabs, carousels
   - Scroll to check for sticky elements
   - Look for `transform`, `overflow-x`, `scroll-snap-type` (carousel
     indicators)
   - Look for `animation`, `transition`, `keyframes` (animated elements)

### Extract copy from HTML

```javascript
// Via Playwright
const hero = document.querySelector('.hero');
const headline = hero.querySelector('h1')?.textContent;
const description = hero.querySelector('p')?.textContent;
const cta = hero.querySelector('a')?.textContent;
const ctaHref = hero.querySelector('a')?.getAttribute('href');
```

Do NOT extract copy from screenshots. Agents drift when reading text off
images. Always use HTML parsing.

### Identify components by class name

Look at the class names of root elements to determine component names:
- `.ancillary-nav` → `ancillaryNav` component
- `.home-hero` → `homeHero` component
- `.footer-zip-code` → `footerZipCode` component

Don't invent names from visual impressions. Use the source's class names
as the guide.

## Interactive State Inspection

### Navigation dropdowns

```javascript
// Hover or click to reveal dropdowns
const navItem = document.querySelector('.nav-item-has-children');
navItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
// Wait, then inspect the revealed dropdown
```

### Carousels

Check for:
- `transform: translateX` on a container
- `scroll-snap-type` CSS property
- Prev/next control buttons
- Carousel library class names (`slick`, `swiper`, `glide`)

A carousel migrated as a grid will fail visual-diff. Inspect before
deciding markup.

### Tabs

Click each tab to verify other panes exist and contain content. Note the
tab labels and pane content for the content model.

### Accordions

Click to expand/collapse. Note which items are expanded by default.

## Responsive Inspection

View the source at multiple viewport sizes:

```javascript
// Via Playwright
await page.setViewportSize({ width: 360, height: 800 });
await page.screenshot({ path: 'source-mobile.png' });

await page.setViewportSize({ width: 768, height: 1024 });
await page.screenshot({ path: 'source-tablet.png' });

await page.setViewportSize({ width: 1280, height: 800 });
await page.screenshot({ path: 'source-desktop.png' });
```

Note layout changes at each breakpoint:
- Does the nav switch to hamburger?
- Do multi-column grids stack?
- Does the hero image change aspect ratio?
- Are there mobile-only or desktop-only elements?

## Background Image Detection

Easy to miss because they're CSS `background-image` and don't show in a
child-element inventory:

```javascript
// Check every section root
const sections = document.querySelectorAll('section, header, footer, .hero');
for (const section of sections) {
  const bg = getComputedStyle(section).backgroundImage;
  if (bg && bg !== 'none') {
    console.log(section.className, 'has background image:', bg);
  }
}
```

If the source root carries the image, the target root must too — don't
substitute with a media-then-body card.

## Recording Findings

As you inspect, record:
1. Component names (from class names)
2. Content (from HTML parsing)
3. Imagery mode (img child vs background-image)
4. Interactive behavior (carousel, tabs, accordion, sticky)
5. CSS values for style transfer (colors, fonts, spacing)
6. Breakpoints for visual-diff
7. Selector pairs for the selector map

Update the selector map (`artifacts/source-vs-target/selector-map.json`)
every time you inspect an element.
