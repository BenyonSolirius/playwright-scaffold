export interface ProjectConfig {
    projectName: string;
    language: 'typescript' | 'javascript';
    model: string;
    tools: string[];
    eslintConfig?: 'solirius' | 'basic';
}
export interface PackageJSON {
    name: string;
    version: string;
    type: string;
    scripts: Record<string, string>;
}
//# sourceMappingURL=types.d.ts.map