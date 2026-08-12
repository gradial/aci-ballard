# Asset Rendering Reference

## Rules

- **NEVER** construct `<img>` tags manually with `src`/`srcSet` from
  image sources.
- **ALWAYS** use the SDK's `imageAttrs()` function from `@gradial/aci`
  or the `Image`/`Picture` component from `@gradial/aci/react`.
- **NEVER** duplicate the `Image` type locally — always import from
  `@gradial/aci`.

## SDK Exports

### From `@gradial/aci`

| Export | Type | Purpose |
|--------|------|---------|
| `Image` | type | The DAM-backed image type (`$type`, `assetId`, `versionId`, `alt`, `sources`) |
| `ImageSource` | type | A single responsive derivative (`src`, `width`, `height`, `type`) |
| `imageAttrs(image, overrides?)` | function | Returns a complete attributes object for `<img>` |
| `primaryImageSource(image)` | function | Picks the largest-width source from an image |
| `ImageSchema` | Zod schema | Schema for image fields in contracts |

### From `@gradial/aci/react`

| Export | Type | Purpose |
|--------|------|---------|
| `Image` | component | Renders an `Image` as `<img>` with computed attrs |
| `Picture` | component | Renders an `Image` as responsive `<img>` (delegates to `imageAttrs()`) |
| `Media` | component | Renders media assets (images, videos) with type detection |

## imageAttrs()

`imageAttrs(image, overrides?)` returns a complete attributes object
including `src`, `alt`, `width`, `height`, `srcSet`, `sizes`, `loading`,
and `decoding`. Spread the result into a native `<img>` element:

```tsx
import { imageAttrs, type Image } from '@gradial/aci';

export function HeroImage({ image }: { image: Image }) {
  return <img {...imageAttrs(image)} />;
}
```

Override specific attributes by passing a second argument:

```tsx
<img {...imageAttrs(image, { loading: 'eager' })} />
```

## SDK Components

```tsx
import { Picture, Image } from '@gradial/aci/react';

// Picture: delegates to imageAttrs() internally
<Picture image={image} />

// Image: same behavior, accepts image or value prop
<Image image={image} />
```

Both components call `imageAttrs()` internally and spread the result
into a native `<img>` element.

## CSS Background Images

For CSS background images, use `primaryImageSource()` to get the URL:

```tsx
import { primaryImageSource } from '@gradial/aci';

export function HeroBackground({ image }: { image: Image }) {
  const src = primaryImageSource(image).src;
  return (
    <div style={{ backgroundImage: `url(${src})` } as React.CSSProperties} />
  );
}
```

## In Contracts

Use `ImageSchema` for DAM-managed image fields:

```ts
import { ImageSchema, defineComponentContract } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  image: ImageSchema,
  cards: z.array(z.object({
    image: ImageSchema.optional(),
  })),
});
```

Declare `imageSlots` matching every `ImageSchema` field, including
nested dot paths like `cards.image`. See
`references/image-assets.md` for full image slot configuration.

## Anti-Patterns

- Manually building `srcSet` strings from `image.sources` — use
  `imageAttrs()` instead
- Constructing `<img src={image.sources[0].src} />` — use `imageAttrs()`
  or SDK components
- Duplicating the `Image` type locally — import from `@gradial/aci`
- Ignoring `width`/`height` — `imageAttrs()` includes them to prevent
  layout shift
