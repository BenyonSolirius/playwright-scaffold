import * as eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

// Temporary ESLint configuration with strict rules and common pitfalls checks.
// Ideally, the team should agree on a shared rule set for consistency.
// While no rule set is perfect, aligning the team and enforcing guardrails
// improves code quality, maintainability, and reduces subtle bugs.

/**
 * @see https://eslint.org/docs/latest/rules/
 * @see https://typescript-eslint.io/rules/
 */
export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['**/*.mjs'],
  },
  {
    languageOptions: { parserOptions: { projectService: true } },
  },
]);
