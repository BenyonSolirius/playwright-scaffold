# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@solirius/create-playwright` is a CLI scaffolding tool (`npm create @solirius/playwright`) that generates production-ready Playwright testing projects with TypeScript/JavaScript support, ESLint, Prettier, and a Page Object Model (POM) architecture.

## Commands

```bash
npm run build       # Compile TypeScript (src/ → dist/) via tsc
npm run format      # Run Prettier across the project
```

There are no test commands for the CLI tool itself — the `test/` directory is a template only.

To test the CLI locally, run:
```bash
node bin/cli.js
```

## Architecture

### CLI Source (`src/`)

The CLI is written in TypeScript and compiled to `dist/`. The `bin/cli.js` entry point imports from `dist/`.

- **`src/prompts.ts`** — Interactive `@clack/prompts` flow: project name (validated regex), language (TS/JS), model (POM), optional ESLint/Prettier, ESLint style (Solirius strict vs Basic).
- **`src/generator.ts`** — Reads `ProjectConfig`, copies template layers via `fs.cpSync()`, renames special files (gitignore → .gitignore), installs dependencies with `execa`, installs Playwright browsers, writes `.nvmrc`.
- **`src/types.ts`** — `ProjectConfig` and `PackageJSON` interfaces shared across modules.
- **`src/utils.ts`** — Helpers (e.g., `isCodeCmdAvailable()` to detect VS Code CLI).

### Template System (`templates/`)

Templates are layered — the generator copies them sequentially, later layers overwrite earlier ones:

1. `common/` — shared files (.gitignore, .env.local)
2. `{language}/` — language-specific base files
3. `models/pom/{language}/` — Page Object Model structure
4. `prettier/{language}/` — Prettier config (if selected)
5. `eslint/{language}/{basic|solirius}/` — ESLint config (if selected)

### Generated Project Structure

Scaffolded projects follow this pattern:
```
tests/        # Test files — written as user stories ("presentation layer")
pages/        # Page Object Models
fixtures/     # Playwright test fixtures (extend base.extend<>)
lib/          # Env loader (Zod-validated), shared utilities
data/         # Test data and TypeScript types
```

### Key Patterns in Generated Projects

**Environment validation** uses Zod — `process.env` is never accessed directly; all env vars go through a validated schema in `lib/env.ts`. The Solirius ESLint config enforces this with a `no-restricted-properties` rule.

**Page Object Methods** are parameterized public methods with private interaction helpers:
```typescript
public async login(username: string, password: string, parameters?: LoginParameters)
private async enterUsername(username: string)
```

**Playwright Fixtures** wrap page objects:
```typescript
export const test = base.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});
```

**No floating promises** — the Solirius ESLint config enforces `@typescript-eslint/no-floating-promises`, so all Playwright actions must be awaited.

## TypeScript Configuration

- Target: `ES2020`, Module: `ESNext`, Resolution: `bundler`
- Strict mode enabled
- Output: `./dist`, Source: `./src`
- Declarations and source maps enabled

## Best Practices Reference

See `BEST_PRACTICES.md` for the canonical guide on how generated projects should be structured. Key points:
- Tests read like user stories (presentation layer principle)
- Constants in `SCREAMING_SNAKE_CASE`, classes in `PascalCase`, methods in `camelCase`
- JSDoc `@tests` tags link page methods back to test cases
- No `process.env` access outside `lib/env.ts`
