#!/usr/bin/env node
import { promptUser } from '../src/prompts.js';
import { generateProject } from '../src/generator.js';
import * as p from '@clack/prompts';

(async () => {
  const config = await promptUser();
  await generateProject(config);
  p.outro(`🎉  You're all set!`);
})();
