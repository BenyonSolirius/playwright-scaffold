# Playwright Framework Scaffolder

This is a CLI tool to scaffold a new Playwright test framework.

## Features

- **Quick Setup:** Generate a complete Playwright framework in seconds.
- **TypeScript and JavaScript Support:** Choose between TypeScript and JavaScript for your project.
- **ESLint Integration:** Includes basic and Solirius ESLint configurations.
- **Page Object Model (POM):** Comes with a pre-defined structure for Page Object Model.
- **Customizable Templates:** Easily customize the generated code to fit your needs.

## Getting Started

1.  **Run the CLI:**
    ```bash
    npm init @solirius/playwright
    ```
2.  **Follow the prompts:** The CLI will guide you through the setup process, asking for your preferences on language, ESLint configuration, and more.
3.  **Installation:** Once the framework is generated, navigate to the new directory to continue:
    ```bash
    cd your-project-name
    ```
4.  **Run Tests:**
    ```bash
    npx playwright test
    ```

## Project Structure

The generated project has the following structure:

```
.
├── data/
│   ├── example.js
│   └── example.json
├── fixtures/
│   └── test.fixture.js
├── lib/
│   └── env.lib.js
├── pages/
│   ├── dashboard.page.js
│   └── login.page.js
├── tests/
│   └── login.test.js
├── .gitignore
├── eslint.config.mjs
├── package.json
└── playwright.config.js
```

- **data:** Contains test data files.
- **fixtures:** Contains test fixtures.
- **lib:** Contains library files, such as environment configuration.
- **pages:** Contains page object models.
- **tests:** Contains test files.

## Customization

The templates for the generated code are located in the `templates` directory. You can modify these templates to change the generated output.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any ideas or improvements.

## License

This project is licensed under the MIT License.
