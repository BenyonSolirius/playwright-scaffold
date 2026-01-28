/* eslint-disable no-restricted-properties */
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

// --------------------
// Environment File Setup
// --------------------
// Some CI/CD pipelines may change the current working directory.
// Explicitly defining the root path ensures the correct .env file is loaded.
// ⚠️ Adjust the filename if your environment file differs.
const envFilePath = resolve(__dirname, '../', '.env.local');
dotenv.config({ path: envFilePath });

// --------------------
// Environment Variable Validation
// --------------------
/**
 * Zod is a schema validation library that ensures environment variables
 * conform to the expected types and constraints.
 *
 * @see https://zod.dev/basics
 */
const envSchema = z.object({
  // Optional environment variable; parsing will succeed even if missing
  BASE_URL: z.string().optional(),
  // Required environment variables; parsing fails at runtime if missing
  // ⚠️ In some CI/CD pipelines, these may not be set during pre-checks.
  // ⚠️ If that causes failures, consider making them optional with `.optional()`
  API_KEY: z.string(),
  API_SECRET: z.string(),
});

// --------------------
// Export Validated Environment
// --------------------
/**
 * Parse and validate environment variables immediately at startup.
 * Early validation enables faster failure and easier debugging.
 */
export const env = envSchema.parse(process.env);
