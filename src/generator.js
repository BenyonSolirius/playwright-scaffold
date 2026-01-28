import fs, { existsSync, writeFileSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { execa } from 'execa';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { spinner } from '@clack/prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const waitPromise = async (ms) => new Promise((res) => setTimeout(() => res(null), ms));

function createNvmConfig(targetDir) {
  try {
    const nodeVersion = execSync('node -v', { encoding: 'utf8' }).trim();
    const version = nodeVersion.startsWith('v') ? nodeVersion.slice(1) : nodeVersion;
    fs.writeFileSync(`${targetDir}/.nvmrc`, version + '\n', 'utf8');
  } catch (err) {
    console.error('Error writing .nvmrc:', err.message);
    process.exit(1);
  }
}

export async function installDeps(dependancies, targetDir) {
  const sanitizedUrl = targetDir.replace(/\/$/, '');
  const segments = sanitizedUrl.split('/');
  const project = segments[segments.length - 1];

  // Creating package first
  const pkg = {
    name: project,
    version: '1.0.0',
    type: 'module',
    scripts: {
      test: 'playwright test',
      'test:ui': 'playwright test --ui',
      lint: 'eslint',
      format: 'prettier . --write --log-level=silent',
    },
  };

  writeFileSync(`${targetDir}/package.json`, JSON.stringify(pkg, null, 2));

  // Deps
  const sp = spinner();
  sp.start('Installing dependencies...');
  await execa('npm', ['install', ...dependancies, '--save-dev'], { cwd: targetDir });
  await waitPromise(1500); // Loading too quick feels wrong psychologically.
  sp.stop('Dependanices installed');

  // Browser
  sp.start('Installing Playwright browsers...');
  await execa('npx', ['playwright', 'install'], {
    cwd: targetDir,
  });
  await waitPromise(1500); // Loading too quick feels wrong psychologically.
  sp.stop('Setup complete!');
}

export async function generateProject(config) {
  const language = config.language.toLowerCase();
  const model = config.model.split(' ')[0].toLowerCase();
  const tools = config.tools;
  const projectName = config.projectName;

  const dependancies = [];
  const targetDir = path.resolve(process.cwd(), projectName);

  const commonDir = path.resolve(__dirname, `../templates/common`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + commonDir);

  const baseLanguageDir = path.resolve(__dirname, `../templates/${language}`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + baseLanguageDir);

  const modelDir = path.resolve(__dirname, `../templates/models/${model}/${language}`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + modelDir);

  const prettierDir = path.resolve(__dirname, `../templates/prettier/${language}`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + prettierDir);

  const eslintDir = path.resolve(__dirname, `../templates/eslint/${language}`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + eslintDir);

  p.log.info(`Creating project at ${chalk.blue.underline(targetDir)}`);

  fs.cpSync(commonDir, targetDir, { recursive: true, errorOnExist: true });
  fs.cpSync(baseLanguageDir, targetDir, { recursive: true, errorOnExist: true });
  fs.cpSync(modelDir, targetDir, { recursive: true, errorOnExist: true });

  // Optional tools
  if (tools.includes('eslint')) {
    fs.cpSync(eslintDir, targetDir, { recursive: true, errorOnExist: true });
  }
  if (tools.includes('prettier')) {
    fs.cpSync(prettierDir, targetDir, { recursive: true, errorOnExist: true });
  }

  createNvmConfig(targetDir);

  const baseDeps = ['@playwright/test', 'dotenv', 'zod'];
  const tsDeps = ['@types/node'];
  const prettierDeps = ['prettier'];
  const baseEslintDeps = ['eslint', '@eslint/js', 'eslint-plugin-playwright'];
  const jsEslintDeps = [...baseEslintDeps];
  const tsEslintDeps = [...baseEslintDeps, 'typescript-eslint', 'globals', 'jiti'];

  // Start with base dependencies
  dependancies.push(...baseDeps);

  // Add TypeScript-specific dependencies
  if (language === 'typescript') {
    dependancies.push(...tsDeps);
  }

  // Add ESLint dependencies based on language
  if (tools.includes('eslint')) {
    if (language === 'typescript') {
      dependancies.push(...tsEslintDeps);
    } else if (language === 'javascript') {
      dependancies.push(...jsEslintDeps);
    }
  }

  // Add Prettier if requested
  if (tools.includes('prettier')) {
    dependancies.push(...prettierDeps);
  }

  await installDeps(dependancies, targetDir);
}
