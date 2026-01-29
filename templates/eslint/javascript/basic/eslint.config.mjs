import * as eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';

// Temporary ESLint configuration.
// Ideally, the team should agree on a shared rule set for consistency.
// While no rule set is perfect, aligning the team and enforcing guardrails
// improves code quality, maintainability, and reduces subtle bugs.

/**
 * @see https://eslint.org/docs/latest/rules/
 */
export default defineConfig([
  eslint.configs.recommended,
  {
    ignores: ['**/*.mjs'],
  },
]);
