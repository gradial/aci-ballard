# Image Slots and Assets

## ImageSchema

Use `ImageSchema` for DAM-managed image fields in contracts:

```ts
import { ImageSchema } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  image: ImageSchema,
  cards: z.array(z.object({
    image: ImageSchema.optional(),
  })),
});
```

## Image Slots Configuration

Declare `imageSlots` matching every `ImageSchema` field, including nested array
paths:

```ts
export const contract = defineComponentContract({
  name: 'cards',
  schema,
  imageSlots: {
    image: {
      formats: ['image/webp'],
      sizes: '100vw',
      outputs: [{ aspectRatio: '16:9', widths: [960, 1280] }],
    },
    'cards.image': {
      formats: ['image/webp'],
      sizes: '50vw',
      outputs: [{ aspectRatio: '1:1', widths: [320, 640] }],
    },
  },
});
```

## Runtime Image Rendering Rules

- Read image values from CMS props, never hard-code.
- Render Gradial images as `<picture>` when sources are present.
- Use `primaryImageSource(image).src` from `@gradial/aci` to get the primary URL.
- Preserve `width`/`height` from the primary source to prevent layout shift.
- For CSS backgrounds, set a CSS custom property from the content asset URL.
- Treat image URLs as opaque props — do not synthesize placeholder images
  during code artifact builds.

> **API note:** The schema helper is named `ImageSchema` (not
> `GradialImageSchema`). The runtime helper is `primaryImageSource()`.
> Use `primaryImageSource(image).src` for the primary URL.

## Content Image References

In content JSON, use DAM asset references:

```json
{
  "image": {
    "$type": "dam.assetRef",
    "assetId": "ast_site_home_hero",
    "alt": "Hero illustration"
  }
}
```

The compiler resolves these to Gradial image objects with `sources`, `alt`,
`assetId`, and `versionId`. Each source carries `src`, `width`, `height`, and
`type`.
