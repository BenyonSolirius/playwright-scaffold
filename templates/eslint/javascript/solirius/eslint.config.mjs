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
  {
    files: ['**/*.{js,ts,mjs,cjs,mts,cts}'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            // Directly accessing process.env does not validate environment variables.
            // Importing them from a central env.lib.ts ensures validation
            // and prevents runtime issues that are hard to debug.
            'Do not use process.env, please import any environment variable using env.lib.js',
        },
      ],
    },
  },
]);
