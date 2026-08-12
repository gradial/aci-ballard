# Rich Text Reference

## Rules

- **NEVER** use `marked`, `markdown-it`, or `dangerouslySetInnerHTML`
  directly in component code.
- **ALWAYS** use the SDK's `RichText` component from `@gradial/aci/react`.

The SDK `RichText` component uses `sanitize-html` with an explicit
allowlist. It renders markdown via `markdown-it` (with `html: false` to
prevent raw HTML in markdown) and then sanitizes the output. Links get
`rel="noopener noreferrer"` automatically.

## Usage

```tsx
import { RichText } from '@gradial/aci/react';

export function ArticleBody({ body }: { body: string }) {
  return <RichText value={body} />;
}
```

The `value` prop accepts:

- **`string`** — treated as markdown and rendered to HTML
- **`RichTextValue`** object — `{ format: 'markdown', markdown: '...' }`
  or `{ format: 'html', html: '...' }`

When a string is passed, the component wraps it as
`{ format: 'markdown', markdown: value }` internally.

## In Contracts

Use `RichTextValueSchema` for typed rich text fields:

```ts
import { RichTextValueSchema } from '@gradial/aci';
import { z } from 'zod';

export const schema = z.object({
  body: RichTextValueSchema.optional(),
});
```

Or accept a plain string:

```ts
export const schema = z.object({
  body: z.string().optional(),
});
```

Both forms work with the `RichText` component — it accepts
`RichTextValue | string`.

## Sanitization Policy

The SDK allowlist includes:

- Standard formatting tags: `p`, `br`, `strong`, `em`, `ul`, `ol`, `li`,
  `code`, `pre`, `blockquote`, `h1`–`h6`, `img`
- Links (`a`) with `href`, `name`, `target`, `rel` attributes
- Images (`img`) with `src`, `alt`, `width`, `height`, `loading`
  attributes

Raw HTML in markdown input is rejected by `markdown-it`'s `html: false`
setting. HTML format values are sanitized by `sanitize-html`.

## Anti-Patterns

- Importing `marked` or `markdown-it` directly — the SDK already
  handles this with proper sanitization
- Using `dangerouslySetInnerHTML` with unsanitized content
- Writing a custom markdown-to-HTML pipeline in component code
