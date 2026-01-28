import * as p from '@clack/prompts';
import chalk from 'chalk';
import pkg from '../package.json' with { type: 'json' };
import { existsSync } from 'node:fs';

const withComment = (item, hint) => item + chalk.grey(` (${hint})`);

function quitEarlyOnCancelled(value) {
  if (p.isCancel(value)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }
}

export async function promptUser() {
  console.clear();
  p.intro(pkg.name);

  //
  const defaultName = 'playwright-tests';
  let projectName = await p.text({
    message: 'What is your project named?',
    placeholder: defaultName,
    validate: (v) => {
      const folderPath = v?.trim();
      const folderExists = folderPath ? existsSync(folderPath) : false;
      return folderExists ? 'A directory with that name already exists.' : undefined;
    },
  });
  quitEarlyOnCancelled(projectName);

  if (!projectName.trim().length) {
    process.stdout.write('\x1b[1A');
    process.stdout.write('\x1b[0J');
    console.log(chalk.gray(p.S_BAR + '  ' + defaultName));
    projectName = defaultName;
  }

  //
  const language = await p.select({
    message: 'Which language would you like to use?',
    options: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'javascript', label: 'JavaScript' },
    ],
  });
  quitEarlyOnCancelled(language);

  //
  const model = await p.select({
    message: 'Which action abstract layer to use?',
    options: [
      {
        value: 'pom',
        label: withComment('Page Object Model', 'recommended'),
        hint: 'behavior-centric pages with parameterised actions',
      },
      {
        value: 'spm',
        label: withComment('Screenplay Model', 'not implemented'),
        // hint: 'recommended only for experienced users, advanced pattern with higher complexity',
        disabled: true,
      },
    ],
  });
  quitEarlyOnCancelled(model);

  //
  let codeQualityUnsure = false;
  async function askTools() {
    const tools = await p.multiselect({
      message: withComment('Which tools would you like to add?', 'use space to select options'),
      options: [
        { value: 'prettier', label: 'Prettier (recommended)' },
        { value: 'eslint', label: 'ESLint (recommended)' },
      ],
      required: false,
    });
    quitEarlyOnCancelled(tools);

    if (tools.length === 0) {
      codeQualityUnsure = true;
      const confirmed = await p.confirm({
        message:
          'Are you sure? Prettier and ESLint help ensure consistent, high-quality code formatting and catch common issues early.',
        initialValue: false,
      });
      quitEarlyOnCancelled(confirmed);

      // TODO: Possibly make it add a MD file explaining the benefits to prettier/eslint
      if (!confirmed) {
        process.stdout.write('\x1b[6A');
        process.stdout.write('\x1b[0J');
        return await askTools();
      }
      return [];
    }

    return tools;
  }
  const tools = await askTools();

  // Don't ask if the user is unsure, just use the recommened option.
  let eslintConfig = 'solirius'; // default recommended value
  if (!codeQualityUnsure && tools.includes('eslint')) {
    eslintConfig = await p.select({
      message: 'Which ESLint rule configuration would you like to use?',
      options: [
        { value: eslintConfig, label: withComment('Solirius', 'recommended') },
        { value: 'basic', label: 'Basic' },
      ],
    });
  }
  quitEarlyOnCancelled(eslintConfig);

  return {
    projectName,
    language,
    model,
    tools,
    eslintConfig,
  };
}
