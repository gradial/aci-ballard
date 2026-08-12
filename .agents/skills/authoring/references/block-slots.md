# Block Slots Reference

## What Block Slots Are

Container components (like `container` and `grid_column`) can render
child blocks. The SDK detects block slots from contracts and injects a
`renderChildren` callback into the component props at render time.

This lets editors nest blocks inside other blocks in content JSON, and
the SDK resolves the child components through the registry — no
hardcoded component name matching needed.

## Defining Block Slots in Contracts

Use `blockRefArray()` from `@gradial/aci` in the contract's Zod schema
to declare a block slot field. The compiler scans the schema for
`blockRefArray` and `blockRef` fields and auto-discovers block slots —
no separate `slots` or `blockSlots` declaration needed.

```ts
import { blockRefArray, defineComponentContract } from '@gradial/aci';
import { z } from 'zod';
import { calloutContract } from './callout.contract';
import { headingContract } from './heading.contract';

export const schema = z.object({
  theme: z.enum(['auto', 'light', 'dark']).optional(),
  className: z.string().optional(),
  blocks: blockRefArray([calloutContract, headingContract]).optional(),
});

export type ContentProps = z.infer<typeof schema>;

export const containerContract = defineComponentContract({
  id: 'container',
  props: schema,
});
```

`blockRefArray()` takes an array of allowed contracts — only those block
types can be placed in the slot. This flows into the generated JSON
schema, so the content validator enforces the allowlist at build time.

For a single (non-array) block slot, use `blockRef(contracts)` instead:

```ts
import { blockRef, defineComponentContract } from '@gradial/aci';
import { headingContract } from './heading.contract';

export const schema = z.object({
  heading: blockRef([headingContract]).optional(),
});
```

## Using renderChildren in Components

The SDK's render system checks `entry.contract.blockSlots` and, if
present, injects a `renderChildren` callback into the component props.
This callback resolves child blocks through the registry.

```tsx
import type { BlockRef, ReactElement } from '@gradial/aci';
import type { RenderChildren } from '@gradial/aci/react';
import type { ContentProps } from '@/cms/contracts/components/container.contract';

export async function ContainerSection({
  theme = 'auto',
  className = '',
  blocks = [],
  renderChildren,
}: ContentProps & { renderChildren?: RenderChildren<readonly BlockRef[]> }) {
  const rendered = blocks.length && renderChildren
    ? await renderChildren(blocks)
    : null;

  return (
    <section className={`theme-${theme} py-[var(--spacing-section-y)] ${className}`}>
      <div className="flex flex-col gap-6">
        {rendered}
      </div>
    </section>
  );
}
```

The `RenderChildren` type is exported from `@gradial/aci/react`:

```ts
type RenderChildren<T extends readonly BlockRef[]> = (blocks: T) => Promise<ReactElement[]>;
```

## Rules

- **Never hardcode component name matching.** No switch statements on
  `block.component`. Always use `renderChildren` from the SDK — it uses
  the registry to resolve components.
- **Always use `blockRefArray()` in contracts** to declare block slot
  fields. The compiler auto-discovers them from the Zod schema.
- **Atomic block contracts must be registered** in the registry with
  their components. `renderChildren` resolves child blocks through the
  same registry used for top-level blocks.
- **`blockRefArray()` takes an array of allowed contracts** — only
  those block types can be placed in the slot. This is enforced at
  content validation time.
- **`renderChildren` is optional** — always guard with a conditional
  (`blocks.length && renderChildren ? await renderChildren(blocks) : null`)
  so the component works in isolation (e.g., Storybook).
- **Nested blocks live inside `props`**, not in a sibling `slots` field.
  The content JSON places child blocks directly in the prop value
  matching the `blockRefArray` field name.

## Content JSON Example

```json
{
  "id": "cta-section",
  "component": "container",
  "props": {
    "theme": "dark",
    "blocks": [
      {
        "id": "primary-cta",
        "component": "callout",
        "props": {
          "headline": "Get started today",
          "body": "Ship content updates in minutes."
        }
      },
      {
        "id": "heading",
        "component": "heading",
        "props": {
          "text": "Why teams choose us",
          "level": 2
        }
      }
    ]
  }
}
```
