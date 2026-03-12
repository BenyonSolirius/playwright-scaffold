import fs, { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { execa } from 'execa';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import type { ProjectConfig, PackageJSON } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const waitPromise = async (ms: number): Promise<null> =>
  new Promise((res) => setTimeout(() => res(null), ms));

function createNvmConfig(targetDir: string): void {
  try {
    const nodeVersion = execSync('node -v', { encoding: 'utf8' }).trim();
    const version = nodeVersion.startsWith('v') ? nodeVersion.slice(1) : nodeVersion;
    fs.writeFileSync(`${targetDir}/.nvmrc`, version + '\n', 'utf8');
  } catch (err) {
    console.error('Error writing .nvmrc:', (err as Error).message);
    process.exit(1);
  }
}

export async function installDeps(dependencies: string[], targetDir: string, tools: string[] = []): Promise<void> {
  const sanitizedUrl = targetDir.replace(/\/$/, '');
  const segments = sanitizedUrl.split('/');
  const project = segments[segments.length - 1];

  const pkg: PackageJSON = {
    name: project,
    version: '1.0.0',
    type: 'module',
    scripts: {
      test: 'playwright test',
      'test:ui': 'playwright test --ui',
      ...(tools.includes('eslint') && { lint: 'eslint' }),
      ...(tools.includes('prettier') && { format: 'prettier . --write --log-level=silent' }),
    },
  };

  writeFileSync(`${targetDir}/package.json`, JSON.stringify(pkg, null, 2));

  const sp = p.spinner();
  sp.start('Installing dependencies...');
  await execa('npm', ['install', ...dependencies, '--save-dev'], { cwd: targetDir });
  await waitPromise(1500);
  sp.stop('Dependencies installed');

  sp.start('Installing Playwright browsers...');
  await execa('npx', ['playwright', 'install'], { cwd: targetDir });
  await waitPromise(1500);
  sp.stop('Setup complete!');
}

export async function generateProject(config: ProjectConfig): Promise<void> {
  const language = config.language.toLowerCase();
  const model = config.model.split(' ')[0].toLowerCase();
  const tools = config.tools;
  const projectName = config.projectName;
  const eslintConfig = config.eslintConfig ?? 'basic';

  const dependencies: string[] = [];
  const targetDir = path.resolve(process.cwd(), projectName);

  const commonDir = path.resolve(__dirname, `../templates/common`);
  if (!existsSync(commonDir)) throw new Error('Could not find template folder for, ' + commonDir);

  const baseLanguageDir = path.resolve(__dirname, `../templates/${language}`);
  if (!existsSync(baseLanguageDir)) throw new Error('Could not find template folder for, ' + baseLanguageDir);

  const modelDir = path.resolve(__dirname, `../templates/models/${model}/${language}`);
  if (!existsSync(modelDir)) throw new Error('Could not find template folder for, ' + modelDir);

  const prettierDir = path.resolve(__dirname, `../templates/prettier/${language}`);
  if (!existsSync(prettierDir)) throw new Error('Could not find template folder for, ' + prettierDir);

  const eslintDir = path.resolve(__dirname, `../templates/eslint/${language}/${eslintConfig}`);
  if (!existsSync(eslintDir)) throw new Error('Could not find template folder for, ' + eslintDir);

  p.log.info(`Creating project at ${chalk.blue.underline(targetDir)}`);

  fs.cpSync(commonDir, targetDir, { recursive: true, errorOnExist: true });
  fs.renameSync(path.join(targetDir, 'gitignore'), path.join(targetDir, '.gitignore'));
  fs.renameSync(path.join(targetDir, 'env.local'), path.join(targetDir, '.env.local'));

  fs.cpSync(baseLanguageDir, targetDir, { recursive: true });
  fs.cpSync(modelDir, targetDir, { recursive: true });

  if (tools.includes('eslint')) {
    fs.cpSync(eslintDir, targetDir, { recursive: true });
  }
  if (tools.includes('prettier')) {
    fs.cpSync(prettierDir, targetDir, { recursive: true });
  }

  createNvmConfig(targetDir);

  const baseDeps = ['@playwright/test', 'dotenv', 'zod'];
  const tsDeps = ['@types/node'];
  const prettierDeps = ['prettier'];
  const baseEslintDeps = ['eslint', '@eslint/js', 'eslint-plugin-playwright'];
  const jsEslintDeps = [...baseEslintDeps];
  const tsEslintDeps = [...baseEslintDeps, 'typescript-eslint', 'globals', 'jiti'];

  dependencies.push(...baseDeps);

  if (language === 'typescript') {
    dependencies.push(...tsDeps);
  }

  if (tools.includes('eslint')) {
    if (language === 'typescript') {
      dependencies.push(...tsEslintDeps);
    } else if (language === 'javascript') {
      dependencies.push(...jsEslintDeps);
    }
  }

  if (tools.includes('prettier')) {
    dependencies.push(...prettierDeps);
  }

  await installDeps(dependencies, targetDir, tools);
}
