import * as p from '@clack/prompts';
import chalk from 'chalk';
import pkg from '../package.json' with { type: 'json' };
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
    let projectName = await p.text({
        message: 'What is your project named?',
        placeholder: 'my-framework-name',
        validate: (v) => {
            if (!v?.trim().length)
                return 'Project name is required.';
            if (!v?.match(/^[a-zA-Z0-9-]{1,50}$/))
                return 'Invalid directory name, must be alphanumeric.';
        },
    });
    quitEarlyOnCancelled(projectName);
    async function askLanguage() {
        const language = await p.select({
            message: 'Which language would you like to use?',
            options: [
                { value: 'typescript', label: 'TypeScript' },
                { value: 'javascript', label: 'JavaScript' },
            ],
        });
        quitEarlyOnCancelled(language);
        if (language !== 'typescript') {
            const confirmed = await p.confirm({
                message: "Are you sure? It's highly recommended that you use TypeScript for type safety and linting",
                initialValue: false,
            });
            quitEarlyOnCancelled(confirmed);
            if (!confirmed) {
                process.stdout.write('\x1b[6A');
                process.stdout.write('\x1b[0J');
                return await askLanguage();
            }
            return 'javascript';
        }
        return language;
    }
    const language = await askLanguage();
    quitEarlyOnCancelled(language);
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
                disabled: true,
            },
        ],
    });
    quitEarlyOnCancelled(model);
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
                message: 'Are you sure? Prettier and ESLint help ensure consistent, high-quality code formatting and catch common issues early.',
                initialValue: false,
            });
            quitEarlyOnCancelled(confirmed);
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
    let eslintConfig = 'solirius';
    if (!codeQualityUnsure && tools.includes('eslint')) {
        eslintConfig = (await p.select({
            message: 'Which ESLint rule configuration would you like to use?',
            options: [
                { value: eslintConfig, label: withComment('Solirius', 'recommended') },
                { value: 'basic', label: 'Basic' },
            ],
        }));
    }
    quitEarlyOnCancelled(eslintConfig);
    return {
        projectName: projectName,
        language,
        model: model,
        tools,
        eslintConfig,
    };
}
//# sourceMappingURL=prompts.js.map