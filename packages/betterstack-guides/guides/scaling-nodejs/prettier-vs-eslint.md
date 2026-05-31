# Prettier vs ESLint: Choosing the Right Tool for Code Quality

Prettier and ESLint are essential JavaScript development tools, improving code quality with different approaches.

[Prettier](https://prettier.io/) is the go-to code formatter, focusing exclusively on code style and formatting. It takes and rewrites your code according to a consistent style, removing debates about formatting preferences from your development process.

[ESLint](https://eslint.org/) is a comprehensive linting tool that identifies problematic patterns in your JavaScript code. It goes beyond formatting to enforce best practices, catch bugs, and maintain code quality standards through customizable rules.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/mXOEzbvz3KY?si=4rmGCxZJiDJDMcGH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This article will break down their differences, strengths, and ideal use cases to help you decide which tool best suits your project—or how to use them together effectively.

## What is Prettier?

![Screenshot of Prettier Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b0148032-00ba-440f-7b63-c1dc9e8e6000/lg1x =1200x500)

Prettier is an opinionated code formatter created by James Long in 2017 to end debates about code style. It supports multiple languages including JavaScript, TypeScript, CSS, HTML, JSON, and more.

Unlike other linters, Prettier takes a different approach—it parses your code into an abstract syntax tree (AST), then pretty-prints the AST with its own formatting rules. This means Prettier completely rewrites your code rather than just flagging issues, ensuring consistency across your entire codebase with minimal effort.

Prettier focuses exclusively on formatting concerns like line length, indentation, and spacing. It intentionally offers few configuration options, embracing the philosophy that consistency matters more than personal preferences.

## What is ESLint?

![Screenshot of ESLint Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fa5f114f-190c-4e35-38a6-a0faa0562b00/lg2x =1200x600)

ESLint was created by Nicholas C. Zakas in 2013 as a tool for identifying and fixing problems in JavaScript code. It analyzes your code to find issues ranging from simple style violations to serious bugs and suspicious code patterns.

With a plugin-based architecture, ESLint offers remarkable flexibility. You can customize every aspect of its behavior through configuration files, selecting which rules to enforce, at what error level, and even writing custom rules when needed. This makes ESLint adaptable to team preferences, project requirements, and specialized coding standards.

ESLint has evolved into the standard linter for JavaScript projects, with extensive integration across the ecosystem. Its vibrant community continuously updates and expands its capabilities, creating specialized rule sets for frameworks like React, Vue, and Angular.

## Prettier vs. ESLint: a quick comparison

Understanding the differences between these tools helps you leverage their strengths effectively. Each addresses different aspects of code quality, making them complementary rather than competitive in many workflows.

The following comparison highlights key differences to consider:

| Feature                 | Prettier  | ESLint  |
|-----------------------------|--------------|--------------|
| Primary focus              | Code formatting | Code quality and bug prevention |
| Configuration options      | Minimal, opinionated | Highly configurable |
| Learning curve             | Simple, works out of the box | Steeper, requires understanding rules |
| Supported languages        | Multiple (JS, TS, CSS, HTML, etc.) | JavaScript/TypeScript focused |
| Integration with editors   | Straightforward, consistent | More complex setup |
| Auto-fix capabilities      | Rewrites entire code | Fixes specific issues |
| Performance                | Generally faster | More intensive analysis |
| Rule customization         | Limited by design | Extensive, plugin-based |
| Framework support          | Language-agnostic | Framework-specific plugins |
| Error detection            | No error detection | Catches potential bugs |
| Community adoption         | Widespread for formatting | Standard for JS linting |
| Configuration file         | .prettierrc | .eslintrc |
| CLI command                | prettier | eslint |
| Style enforcement          | Enforces its own style | Configurable styles |
| Output format              | Formatted code | List of issues/warnings |
| Integration with CI/CD     | Simple pass/fail check | Detailed reporting |
| Handling of comments       | Preserves but may move | Doesn't affect |
| Project maintenance        | Active, focused | Active, broad scope |

## Installation and setup

Getting started with both tools involves different approaches to configuration and implementation, reflecting their distinct philosophies.

Prettier prioritizes simplicity in its setup process. You can quickly add it to your project with a minimal configuration:

```bash
# Install Prettier
npm install --save-dev prettier

# Create a basic configuration
echo {} > .prettierrc
```

With just this basic setup, you can immediately start formatting files:

```bash
# Format a specific file
npx prettier --write src/index.js

# Format all files in your project
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss}"
```

Prettier's configuration options are intentionally limited. A typical `.prettierrc` file might look like this:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

These few options control the major formatting decisions, while Prettier handles everything else according to its opinionated defaults. This simplicity makes Prettier easy to adopt across teams—there are simply fewer decisions to argue about.

ESLint setup requires more consideration since it focuses on enforcing a wide range of code quality rules. Installation begins similarly:

```bash
# Install ESLint
npm install --save-dev eslint

# Initialize ESLint configuration
npx eslint --init
```

The initialization process will prompt you with questions about your project, such as which frameworks you're using, whether you're using TypeScript, and your preferred style guide. Based on your answers, ESLint creates a configuration file that might look something like this:

```javascript
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn"
  }
}
```

This configuration shows ESLint's flexibility—you can specify environments, extend popular configurations, include plugins for frameworks like React, and customize individual rules with different error levels.

Running ESLint involves checking files and optionally fixing issues:

```bash
# Check files for issues
npx eslint src/

# Fix automatically fixable issues
npx eslint src/ --fix
```

The difference in setup complexity reveals the tools' different priorities: Prettier focuses on doing one thing with minimal configuration, while ESLint provides extensive customization for comprehensive code quality enforcement.

## Code formatting approach

The core philosophies of these tools become clear when examining their approaches to code formatting.

Prettier takes a holistic, non-negotiable approach to formatting. When you run Prettier on your code, it completely rewrites it according to its style rules, with no regard for your original formatting. This approach eliminates debates over style and ensures consistency.

Consider this disorganized JavaScript code:

```javascript
function HelloWorld({greeting = "hello", greeted = '"World"', silent = false, onMouseOver,}) {

  if(!greeting){return null};

     // TODO: Don't use random in render
  let num = Math.floor (Math.random() * 1E+7).toString().replace(/\.\d+/gi, "")

  return <div className='HelloWorld' title={`You are visitor number ${num}`} onMouseOver={onMouseOver}>
    <strong>{ greeting.slice( 0, 1 ).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
    {greeting.endsWith(",") ? " " : <span style={{color: '\grey'}}>, </span> }
    <em>
	{ greeted }
	</em>
    {silent
      ? "."
      : "!"}
  </div>;

}
```

After running Prettier with default settings, the code becomes:

```javascript
function HelloWorld({
  greeting = "hello",
  greeted = '"World"',
  silent = false,
  onMouseOver,
}) {
  if (!greeting) {
    return null;
  }

  // TODO: Don't use random in render
  let num = Math.floor(Math.random() * 1e7)
    .toString()
    .replace(/\.\d+/gi, "");

  return (
    <div
      className="HelloWorld"
      title={`You are visitor number ${num}`}
      onMouseOver={onMouseOver}
    >
      <strong>
        {greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}
      </strong>
      {greeting.endsWith(",") ? (
        " "
      ) : (
        <span style={{ color: "grey" }}>, </span>
      )}
      <em>{greeted}</em>
      {silent ? "." : "!"}
    </div>
  );
}
```

Prettier has completely reformatted the code—adjusting indentation, line breaks, spacing, and parentheses—without changing its functionality. The result is consistently formatted code regardless of who wrote it or their personal style preferences.

ESLint takes a more targeted approach to formatting. It identifies specific style violations according to your configured rules and can automatically fix them, but it doesn't completely rewrite your code.

Consider this code with several ESLint issues:

```javascript
var x = 5
var y = 10;
if(x == y) {
    console.log("Equal!");
} else {
    console.log("Not equal!")
}
```

Running ESLint with common rules might produce these warnings:

```
line 1: Missing semicolon
line 2: 'y' is defined but never used
line 3: Expected '===' and instead saw '=='
line 5: Missing semicolon
```

After running `eslint --fix`, the code might look like:

```javascript
var x = 5;
var y = 10;
if(x === y) {
    console.log("Equal!");
} else {
    console.log("Not equal!");
}
```

ESLint has fixed the missing semicolons and the equality operator, but it still flags the unused variable as a warning. Unlike Prettier, ESLint doesn't reformat the entire file—it only addresses the specific issues defined by its rules.

This fundamental difference highlights why many developers use both tools: Prettier handles all formatting concerns, while ESLint focuses on code quality issues beyond formatting.

## Rule configuration

The approach to rule configuration represents another key difference between these tools.

Prettier intentionally limits configuration options to maintain its core philosophy of ending style debates. You can adjust a few key settings like line length, tabs vs. spaces, and whether to use semicolons, but most formatting decisions are made by Prettier itself.

Here's a typical Prettier configuration file:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

These few options cover the major formatting preferences, and Prettier handles everything else. This limitation is by design—Prettier believes that having consistent formatting across projects is more valuable than accommodating every personal preference.

ESLint offers significantly more granular control over its rules. Each rule can be set to "off", "warn", or "error", and many rules accept additional options to fine-tune their behavior.

A typical ESLint configuration demonstrates this flexibility:

```javascript
module.exports = {
  "rules": {
    // Disable requiring semicolons
    "semi": ["error", "never"],
    
    // Require single quotes with some exceptions
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    
    // Customize indentation
    "indent": ["error", 2, { 
      "SwitchCase": 1,
      "VariableDeclarator": 1,
      "outerIIFEBody": 1
    }],
    
    // Disallow unused variables but allow unused arguments prefixed with _
    "no-unused-vars": ["error", { 
      "vars": "all", 
      "args": "after-used",
      "argsIgnorePattern": "^_" 
    }],
    
    // Custom rule for React Hook dependencies
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherCustomHook)"
    }]
  }
}
```

This extensive customization allows ESLint to adapt to specific project requirements, coding standards, and team preferences. You can also extend popular configurations like Airbnb's style guide or Standard JS:

```javascript
module.exports = {
  "extends": [
    "eslint:recommended",
    "airbnb",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended" // For integrating with Prettier
  ]
}
```

The `extends` feature lets you build on existing rule sets, while overriding specific rules that don't fit your project's needs. This hierarchical approach to configuration makes ESLint highly adaptable.

The difference in configuration philosophy reflects each tool's purpose: Prettier removes formatting decisions from your workflow, while ESLint gives you precise control over code quality standards.

## Integration with development workflow

Both tools offer various integration points with your development workflow, but their different purposes lead to different integration patterns.

Prettier works best when it runs automatically. The most common integration is with your code editor, where Prettier formats your code on save:

```javascript
[label settings.json]
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

This smooth integration ensures your code is always properly formatted without requiring a conscious action. You can also integrate Prettier with Git hooks using tools like Husky and lint-staged:

```json
[label package.json]
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

This setup automatically formats staged files before they're committed, ensuring that all code in your repository follows consistent formatting regardless of individual developer settings.

ESLint can be integrated at similar points but often serves a different purpose in the workflow. While you might run Prettier on save to handle formatting, you typically want ESLint's more substantive feedback during development:

```javascript
[label settings.json]
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

This configuration shows ESLint's issues in real-time and can automatically fix problems on save. ESLint also works well with Git hooks:

```json
[label package.json]
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "git add"
    ]
  }
}
```

For continuous integration pipelines, ESLint provides detailed reports about code quality issues:

```yaml
# In a GitHub Actions workflow
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm ci
      - run: npm run lint
```

The `npm run lint` script typically runs ESLint with settings that prevent the build from succeeding if there are errors:

```json
[label package.json]
{
  "scripts": {
    "lint": "eslint --max-warnings=0 src/"
  }
}
```

This integration ensures that code quality standards are enforced before code reaches your main branch.

Many projects combine these tools, using Prettier for formatting and ESLint for code quality:

```json

[label package.json]
{
  "scripts": {
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md}'",
    "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}'"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  }
}
```

This combined approach leverages each tool's strengths—Prettier handles all formatting concerns, while ESLint enforces code quality standards and catches potential bugs.

## Handling conflicts and integration

When using both Prettier and ESLint, conflicts can arise when ESLint's formatting rules disagree with Prettier's decisions. Fortunately, the community has developed solutions to make these tools work smoothly together.

The most popular approach is to use `eslint-config-prettier`, which disables all ESLint rules that might conflict with Prettier:

```command
npm install --save-dev eslint-config-prettier
```

Then add it to your ESLint configuration:

```javascript
module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier" // Disables ESLint formatting rules
  ]
}
```

For more integration options, you can use `eslint-plugin-prettier`, which runs Prettier as an ESLint rule:

```command
npm install --save-dev eslint-plugin-prettier
```

Configure it in your ESLint settings:

```javascript
module.exports = {
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

Or use the recommended configuration that combines both approaches:

```javascript
module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended" // Combines eslint-config-prettier and eslint-plugin-prettier
  ]
}
```

This setup allows ESLint to report formatting issues as linting errors, creating a unified workflow while separating concerns between the tools.

Another common pattern is to run Prettier first, then ESLint with the `--fix` option for non-formatting issues:

```json
[label package.json]
{
  "scripts": {
    "format": "prettier --write . && eslint --fix ."
  }
}
```

This sequence ensures that Prettier handles all formatting, and ESLint addresses only code quality concerns without attempting to reformat code.

These integration approaches let you benefit from both tools: Prettier's consistent formatting and ESLint's code quality enforcement, without conflicts or redundancy.

## Performance considerations

Performance differences between these tools stem from their different scopes and approaches.

Prettier generally runs faster than ESLint, especially on large files. Since Prettier only handles formatting and doesn't perform deep code analysis, it processes files quickly:

```bash
# Time prettier formatting a directory
time npx prettier --write src/
# real    0m1.234s

# Time eslint checking the same directory
time npx eslint src/
# real    0m5.678s
```

These performance differences become important in certain contexts:

1. In CI/CD pipelines, where build time matters
2. When using Git hooks to process files on commit
3. When working with very large codebases
4. During editor integration, where responsiveness is crucial

For editor integration, many developers configure Prettier to run on save but set ESLint to run on demand or with a delay. This approach gives you immediate formatting feedback while deferring more intensive analysis:

```javascript
[label settings.json]
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.run": "onType", // or "onSave"
  "eslint.lintTask.enable": true,
  "eslint.lintTask.options": "src/"
}
```

For Git hooks, you might apply optimizations like only linting changed files:

```json
[label package.json]
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix --cache" // --cache improves performance
    ]
  }
}
```

In large projects, you might also configure ESLint to ignore certain files or directories:

```
[label .eslintignore]
build/
dist/
node_modules/
*.min.js
```

These performance considerations highlight another reason why many teams use both tools: Prettier handles fast, consistent formatting, while ESLint provides deeper but more computationally intensive code quality checks.

## Extensibility and plugins

The extensibility of these tools differs significantly, reflecting their different design philosophies.

Prettier intentionally limits extensibility. While you can write plugins to support new languages, you can't customize Prettier's formatting rules through plugins. This limitation is by design—Prettier aims to eliminate debates about formatting by providing a single, opinionated style.

Prettier does support plugins for parsing different file types:

```bash
npm install --save-dev prettier-plugin-svelte prettier-plugin-tailwindcss
```

And you can configure them in your `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  "singleQuote": true
}
```

These plugins primarily extend Prettier to understand new languages or frameworks rather than changing its core formatting behavior.

ESLint, on the other hand, embraces extensibility as a core feature. Its plugin system allows for adding new rules, processors, and environments:

```command
npm install --save-dev eslint-plugin-react eslint-plugin-jsx-a11y eslint-plugin-import
```

You can then configure these plugins in your ESLint settings:

```javascript
module.exports = {
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors"
  ],
  "rules": {
    "react/prop-types": "off",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always"
    }]
  }
}
```

This extensive plugin ecosystem lets ESLint adapt to specific frameworks, libraries, and coding patterns. Popular plugins include:

1. `eslint-plugin-react` for React-specific rules
2. `eslint-plugin-vue` for Vue.js development
3. `eslint-plugin-jsx-a11y` for accessibility checks
4. `eslint-plugin-import` for import/export validation
5. `@typescript-eslint/eslint-plugin` for TypeScript support

You can even write custom ESLint rules for project-specific requirements:

```javascript
// In a custom plugin file
module.exports = {
  rules: {
    "my-custom-rule": {
      create: function(context) {
        return {
          Identifier: function(node) {
            if (node.name === "badIdentifier") {
              context.report({
                node,
                message: "Avoid using 'badIdentifier' as a variable name"
              });
            }
          }
        };
      }
    }
  }
};
```

This extensibility makes ESLint highly adaptable to specific project needs, team standards, and framework requirements.

The different approaches to extensibility highlight the tools' different goals: Prettier aims for consistency and simplicity, while ESLint provides flexibility and customization for comprehensive code quality enforcement.

## Final thoughts
This article compared Prettier and ESLint to help you decide which tool best fits your JavaScript development needs or how to use them together. 

Prettier simplifies code formatting with minimal configuration, while ESLint offers deep analysis, bug detection, and customizable rule enforcement. 

Using both tools together ensures high-quality, consistent code, with Prettier handling formatting and ESLint enforcing best practices.

For more in-depth learning, explore [Prettier's documentation](https://prettier.io/docs/en/) and [ESLint's documentation](https://eslint.org/docs/).