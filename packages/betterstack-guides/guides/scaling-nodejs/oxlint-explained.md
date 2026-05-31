# Getting Started with Oxlint

[Oxlint](https://oxc.rs/docs/guide/usage/linter) is a fast JavaScript linter built with Rust and part of the Oxidation Compiler (Oxc) project. 

According to its documentation, it runs 50–100 times faster than ESLint. It includes over 500 built-in rules to catch coding issues and works with little to no setup.

This guide shows you how to install Oxlint, understand its speed claims, customize its settings, and add it to your workflow.

[ad-logs]

## Prerequisites

Before you start, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed. This guide assumes you already know the basics of JavaScript development and how linting works.

## Setting up the project directory

In this section, you'll set up a simple JavaScript project and configure it to use Oxlint.

Start by creating a new folder for your project and moving into it. Then, run the following command to set up a new Node.js project:

```command
mkdir oxlint-demo && cd oxlint-demo
```

```command
npm init -y
```

To use modern JavaScript features like `import` statements, you need to enable ECMAScript Modules. Open your `package.json` file and add the following line:

```command
npm pkg set type=module
```

This sets the `type` field to `module` in your `package.json`, so you can use `import` and `export` in your code.

Now, create a simple JavaScript file to test how Oxlint works:

```javascript
[label index.js]
import { readFileSync } from "fs";

// A function with some common issues for linting to catch
function processData(data) {
  let unused = "This variable is never used";
  
  if (data == null) {
    return [];
  }
  
  const results = data.map((item, index) => {
    return {id: index, value: item}
  })
  
  return results;
}

// Try to read a non-existent file
try {
  const data = readFileSync("nonexistent.json", "utf8");
  console.log(processData(JSON.parse(data)));
} catch(error) {
  console.error("Error reading file:", error.message);
}
```

With that, you are now ready to proceed to the next section.


## Getting started with Oxlint

In this section, you'll add Oxlint to your JavaScript project. Oxlint gives you fast linting to help you catch errors early and keep your code clean.

Start by installing Oxlint:

```command
npm install -D oxlint
```

Now, add a lint script to your `package.json` file:

```javascript
[label package.json]
{
..
  "scripts": {
[highlight]
    "lint": "oxlint"
[/highlight]
  },
...
}
```

With this configuration in place, you can run Oxlint against your code:

```command
npm run lint
```

You should see output similar to this:

```text
[output]

> oxlint-demo@1.0.0 lint
> oxlint


  ⚠ eslint(no-unused-vars): Variable 'unused' is declared but never used. Unused variables should start with a '_'.
   ╭─[index.js:5:7]
 4 │ function processData(data) {
 5 │   let unused = "This variable is never used";
   ·       ───┬──
   ·          ╰── 'unused' is declared here
 6 │ 
   ╰────
  help: Consider removing this declaration.

Found 1 warning and 0 errors.
Finished in 3ms on 1 file with 101 rules using 10 threads.
```

Notice how Oxlint immediately identifies an issue in the code:

* The variable `unused` is declared but never used. Oxlint suggests removing it or prefixing it with an underscore (`_`) if it’s meant to be unused.

The output is also clear and color-coded, making it easy to spot problems at a glance, as shown in the screenshot below:

![Screenshot of the terminal showing Oxlint output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c25c27a7-069a-43d8-4db5-7b2348966000/lg2x =1404x1170)

Oxlint processes code incredibly fast, typically in milliseconds for small projects and a few seconds for larger ones.

## Customizing Oxlint

Oxlint works out of the box, but you can customize how it behaves by generating a config file.

Run this command to create one:

```command
npx oxlint --init 
```

This creates an `.oxlintrc.json` file with default settings, enabled plugins, and a full set of linting rules. The `plugins` field enables support for React, TypeScript, Unicorn, and Oxlint-specific rules:

```json
"plugins": ["react", "unicorn", "typescript", "oxc"]
```

The `rules` section defines what Oxlint checks. Most are set to `"warn"` by default, but you can change any rule to `"off"`, `"warn"`, or `"error"` depending on how strict you want linting to be. For example:

```json
"rules": {
  "no-unused-vars": "error",
  "react/jsx-no-undef": "warn",
  "no-debugger": "off",
  "eqeqeq": "warn"
}
```

You can tell Oxlint to ignore certain files or folders using `ignorePatterns`. For example, to skip linting in your `dist/` and `node_modules/` directories:

```json
"ignorePatterns": ["dist/", "node_modules/"]
```

The file also includes `settings` for plugin-specific behavior, like React or JSDoc options. These can usually be left as-is unless you're using those tools. The `env` and `globals` fields let you control which global variables or environments are available, like enabling Node.js built-ins.

If you want to use a config file in a different location or with a different name, you can pass it directly when running Oxlint:

```command
npx oxlint --config path/to/your-config.json
```

Customizing the config lets you fine-tune Oxlint to match your project’s style and standards, while still keeping the performance edge.



## Integrating Oxlint with your development workflow

For Oxlint to be truly effective, it should be integrated into your development process at multiple stages. This ensures code quality is maintained throughout the development lifecycle and helps catch issues as early as possible.

### Editor integration

Real-time feedback during development is crucial for catching issues as you code. Oxlint integrates with popular code editors to provide immediate feedback without requiring manual linting runs.

For Visual Studio Code users, install the [Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) from the marketplace:

```command
code --install-extension oxc.oxc-vscode
```

The extension provides real-time linting directly in your editor, with errors and warnings underlined as you type.

For users of other editors, Oxlint's Language Server Protocol (LSP) support means you can integrate it with tools like:

- Vim/Neovim (using coc.nvim or native LSP support)
- JetBrains IDEs (IntelliJ, WebStorm)
- Sublime Text


### Pre-commit hooks

To prevent problematic code from being committed to your repository, set up Oxlint as a pre-commit hook. This approach ensures all committed code meets your quality standards.

First, initialize a Git repository in your project directory:

```command
git init
```

Create a comprehensive `.gitignore` file using GitHub's official Node.js template:

```command
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore
```

This fetches the standard Node.js `.gitignore` template that excludes node_modules, logs, environment files, and other common files not meant for version control.

Now, install Husky and lint-staged to manage Git hooks:

```command
npm install -D husky lint-staged
```

Initialize Husky with preparation for Git hooks:

```command
npx husky-init && npm install
```

This creates a `.husky` directory and adds a Husky preparation script to your package.json.

Now configure lint-staged in your `package.json`:

```javascript
[label package.json]
{
  ..
  },
  "devDependencies": {
    ...
  },
[highlight]
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "oxlint"
  }
[/highlight]
}
```

Initialize Husky:

```command
npx husky init
```

This creates a `.husky` directory with a pre-commit hook template. Now edit the `.husky/pre-commit` file to run lint-staged:

```bash
[label .husky/pre-commit]
lint-staged
```

With this setup, Oxlint will automatically run on any staged JavaScript or TypeScript files before each commit. If linting fails, the commit is blocked until you fix the issues.

Make an initial commit to ensure everything is working:

```command
git add .
```
```command
git commit -m "Initial commit with Oxlint configuration"
```

If there are any linting issues, you should see output similar to:

```text
[output]
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
[master (root-commit) 179e1a8] Initial commit with Oxlint configuration
 6 files changed, 1250 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 .husky/pre-commit
 create mode 100644 .oxlintrc.json
 create mode 100644 index.js
 create mode 100644 package-lock.json
 create mode 100644 package.json
```
This successful commit indicates that Oxlint ran on your files without finding any blocking issues. If there are linting errors, the commit would be blocked until you fix the identified problems.


## Final thoughts

Oxlint is a fast and reliable linter for JavaScript and TypeScript projects. It helps catch issues early, enforce consistent code standards, and keep your codebase clean with minimal setup. 

Integration with editors, commit hooks, and CI pipelines supports high code quality throughout development. 

For full details and advanced options, visit the official documentation at [oxc.rs/docs/guide/usage/linter](https://oxc.rs/docs/guide/usage/linter).
