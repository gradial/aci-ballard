# aci-ballard

A Next.js site powered by [ACI](https://docs.gradial.com/aci) (Agentic Content Infrastructure).

## Quick Start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`. Content changes in `.content/`
are picked up automatically via the ACI adapter in `next.config.mjs`.

## Adding Your First Component

See `.agents/skills/authoring/SKILL.md` for a step-by-step guide to:
1. Define a component contract in `src/cms/contracts/components/`
2. Build the React component in `src/components/`
3. Register it in `src/cms/registry.ts`
4. Add content to `.content/pages/`

## Skills

| Skill | When to read |
|-------|-------------|
| [aci](.agents/skills/aci/SKILL.md) | Architecture, commands, testing, troubleshooting |
| [authoring](.agents/skills/authoring/SKILL.md) | Creating content, building components, design tokens |
| [migration](.agents/skills/migration/SKILL.md) | Migrating an existing site into ACI |

## Commands

```bash
npm run dev              # Start Next.js dev server (auto-compiles content)
npm run build            # Production build
npm run typecheck        # TypeScript type checking
npm test                 # Run conformance tests
npm run content:compile  # Compile content into .aci/compiled/
```

## Project Structure

```
.aci.yaml              ACI config (siteId, framework, routes)
.content/              Content source (JSON pages, config, fragments)
src/cms/               Contracts and component registry
src/components/        Runtime React components
src/design-system/     Design tokens and global styles
src/app/               Next.js App Router pages and routes
src/middleware.ts       ACI middleware (siteId, release routing)
.agents/skills/        Skills for humans and agents
```
