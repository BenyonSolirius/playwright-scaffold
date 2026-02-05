#!/usr/bin/env node
import { promptUser } from '../src/prompts.js';
import { generateProject } from '../src/generator.js';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { isCodeCmdAvailable } from '../src/utils.js';

(async () => {
  const config = await promptUser();
  await generateProject(config);

  const cmd = (await isCodeCmdAvailable())
    ? chalk.blue('code ' + config.projectName)
    : chalk.blue('cd ' + config.projectName);

  p.outro(`🎉  You're all set. Run ${cmd} to get started.`);
})();
