# ACI Site Agent Guide

This is an ACI (Agentic Content Infrastructure) frontend project. Agents
working in this repo should load skills before making changes.

## Skills

| Skill | Load when |
|-------|-----------|
| `aci` | Onboarding, running builds, validating, troubleshooting |
| `authoring` | Creating or editing content, adding components, design tokens |
| `migration` | Reverse-engineering a live site or design into ACI |

Skills live in `.agents/skills/`. Each has a `SKILL.md` entry point and
`references/` for deeper topics.

## Quick Reference

- Content lives in `.content/` as JSON.
- Contracts live in `src/cms/contracts/` (Zod schemas, no framework imports).
- Runtime components live in `src/components/` (framework code).
- Registry lives in `src/cms/registry.ts` (`createRegistry` with `[contract, component]` tuples).
- Compiled output goes to `.aci/compiled/` (generated, not checked in).
- Framework integration via `withAci()` in the framework config.
- Next.js server functions from `@gradial/aci/next` — use `getSiteConfig()`, `getPage()`, `getFragment()` instead of importing `FileContentProvider` or `S3ContentProvider` directly.
- Rich text from `@gradial/aci/react` — use `RichText` component, never raw `marked`/`dangerouslySetInnerHTML`.
- Images from `@gradial/aci` — use `imageAttrs()` or SDK components, never manual `srcSet` construction.
- Block slots use `blockRefArray()` in contracts and `renderChildren` in components — never hardcoded component name matching.
- No `as any` casts — use `ContentProps` from contracts.
- Supported frameworks: Astro and Next.js (SvelteKit removed).

## Commands

```bash
npm install
npm run dev              # Start dev server (compiles content on startup)
npm run content:compile  # Compile content from .content/ into .aci/
npm run build            # Framework build
npm test                 # Conformance tests
```
