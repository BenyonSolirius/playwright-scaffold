import * as eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

// Temporary ESLint configuration with strict rules and common pitfalls checks.
// Ideally, the team should agree on a shared rule set for consistency.
// While no rule set is perfect, aligning the team and enforcing guardrails
// improves code quality, maintainability, and reduces subtle bugs.

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    ignores: ['**/*.mjs'],
  },
  {
    languageOptions: { parserOptions: { projectService: true } },
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
            'Do not use process.env, please import any environment variable using env.lib.ts',
        },
      ],
      // There is rarely a reason to not await a playwright command
      // but it's easy to forget to add one, and can be hard to debug when
      // you do, this rule will give an error when an await is forgotten.
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
]);
