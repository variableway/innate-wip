# Biome vs ESLint: Comparing JavaScript Linters and Formatters



You're staring at your `package.json`, and it's a mess. ESLint, Prettier, six different plugins, three shareable configs, and a configuration file that's grown to 200 lines. Your CI takes three minutes just to lint. Your pre-commit hook makes you wait long enough to lose your train of thought. There has to be a better way.

Biome promises exactly that: one tool, one config file, and execution times measured in seconds instead of minutes. But ESLint has been the industry standard since 2013. It has plugins for everything. Your team knows it. Your company's style guide is encoded in ESLint rules. Can a two-year-old Rust-based newcomer really replace a decade of JavaScript tooling?

The answer isn't simple. I spent three months migrating projects between both tools, hit edge cases, discovered limitations, and learned where each tool actually shines. ESLint's plugin ecosystem solves problems Biome doesn't even attempt. Biome's speed eliminates entire categories of workflow friction that ESLint users just accept as normal.

This guide walks through real-world usage of both tools. You'll see where ESLint's maturity matters, where Biome's architecture wins, and most importantly, which factors should drive your decision.

## What is Biome?

<iframe width="100%" height="315" src="https://www.youtube.com/embed/lEkXbneUnWg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


[Biome](https://biomejs.dev/) is a toolchain that combines linting and formatting in a single fast binary. Originally developed as Rome in 2020, the community forked it as Biome in 2023 after Rome's development stalled.

The tool treats speed as essential. Written in Rust and compiled to native code, Biome processes files 10-20 times faster than Node.js-based tools. Running Biome on a 500-file project takes 2-3 seconds, where ESLint might take 30 seconds or more.

Biome's unified approach changes how you set up projects. You configure one tool for both linting and formatting instead of coordinating ESLint, Prettier, and their integration plugins. The formatter follows Prettier's output closely, making migration straightforward for existing projects.

## What is ESLint?

![ESLint logo and description](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8d47acac-67d1-4585-8b86-6c78a5442600/lg2x =1200x600)

[ESLint](https://eslint.org/) is a pluggable linting tool that analyzes JavaScript code for problems. Created by Nicholas C. Zakas in 2013, it became the JavaScript linting standard by offering complete customization through plugins and shareable configs.

The tool became the default choice during the modern JavaScript framework era. Its plugin system, familiar configuration format, and integration with every major editor made it the foundation of JavaScript development workflows.

ESLint's plugin architecture **lets you extend the linter with specialized rules**. React projects use eslint-plugin-react for hooks rules and JSX patterns, while TypeScript projects use @typescript-eslint for type-aware linting. This extensibility means you can lint virtually any JavaScript pattern or framework.

## Biome vs ESLint: quick comparison

| Feature | Biome | ESLint |
|---------|-------|--------|
| First released | 2023 (as Biome), 2020 (as Rome) | 2013 |
| License | MIT | MIT |
| Language | Rust | JavaScript (Node.js) |
| Formatter included | Yes, built-in | No, requires Prettier |
| Linting speed (500 files) | 2-3 seconds | 15-30 seconds |
| Plugin ecosystem | GritQL plugins (v2.0+), built-in rules | 1000+ plugins available |
| Configuration format | JSON (biome.json) | JavaScript or JSON (flat config) |
| TypeScript support | Built-in parsing | Requires @typescript-eslint |
| Type-aware linting | Yes (v2.0+, ~85% coverage) | Yes, with @typescript-eslint |
| Multi-file analysis | Yes (v2.0+) | Limited |
| React support | Basic JSX rules | Full support via eslint-plugin-react |
| Vue/Svelte/Angular | Partial support | Full plugin support |
| Import sorting | Yes, built-in | Requires eslint-plugin-import |
| Accessibility checks | No | Via eslint-plugin-jsx-a11y |
| Security linting | No | Via dedicated plugins |
| Custom rules | GritQL or Rust contribution | JavaScript plugin API |
| Auto-fix support | Yes | Yes |
| Editor integration | VS Code, IntelliJ, Zed | All major editors |
| Monorepo support | Native nested configs (v2.0+) | Via cascading configs |
| CI/CD integration | Single binary | Requires Node.js runtime |
| Active rules | ~200 linting rules | 200+ core, 1000s via plugins |
| Format-on-save | Yes, combined with linting | Separate Prettier integration |
| Ignore patterns | biome.json configuration | .eslintignore file |
| Shareable configs | Extends feature | npm packages (eslint-config-*) |
| Community size | Growing, smaller | Large, established |

## Installation and initial setup

I set up both tools in a fresh TypeScript React project to compare the installation experience. Right from the start, the dependency counts told different stories.

Biome requires one package:

```bash
# Install Biome
npm install --save-dev @biomejs/biome

# Initialize configuration
npx @biome/biome init

# This creates biome.json with defaults:
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": []
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

Biome installed one dependency and created one config file. The formatter and linter worked immediately with sensible defaults. I could run `npx @biome/biome check .` without any additional setup.

ESLint needed multiple packages:

```bash
# Install ESLint and TypeScript support
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Prettier and integration
npm install --save-dev prettier eslint-config-prettier

# Install React plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks

# Initialize ESLint
npx eslint --init
```

ESLint required six packages before I could lint a TypeScript React project. Each plugin added its own configuration options and potential version conflicts. I needed to coordinate ESLint's rules with Prettier's formatting to prevent conflicts.

The ESLint flat config looked like this:

```javascript
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  prettier
];
```

This configuration imported five separate packages and merged their rules together. The `prettier` config at the end turned off ESLint's formatting rules to prevent conflicts. I still needed a separate `.prettierrc` file to configure formatting preferences.

## Creating your first linting rules

After getting both tools installed, I added custom rules to catch common mistakes in our codebase. Even this basic task revealed different approaches to extensibility.

Biome uses its built-in rule set:

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noVar": "error",
        "useConst": "error",
        "useTemplate": "warn"
      },
      "suspicious": {
        "noDebugger": "error",
        "noConsoleLog": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useHookAtTopLevel": "error"
      }
    }
  }
}
```

Biome organized rules into categories: style, suspicious, correctness, complexity, and others. Each category grouped related rules together. I turned on recommended rules and customized specific ones. The configuration stayed in one file with clear categorization.

The limitation appeared quickly. I wanted to enforce that all `<img>` tags include `alt` attributes for accessibility. Biome didn't have this rule. I wanted to prevent imports from reaching across package boundaries in our monorepo. Biome couldn't check import paths like that.

ESLint handled these with plugins:

```javascript
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      'jsx-a11y': jsxA11y,
      'import': importPlugin
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: './src/packages/core',
            from: './src/packages/plugins'
          }
        ]
      }],
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }]
    }
  }
];
```

ESLint let me install plugins for accessibility and import management. The plugins provided dozens of additional rules addressing specific needs. When I needed even more specialized checks, I could write custom rules in JavaScript or find community plugins.

## Formatting code automatically

Those accessibility rules caught missing alt text, but the code still needed consistent formatting. I wanted to enforce semicolons, 2-space indentation, and single quotes throughout the project.

Biome formatted code through its built-in formatter:

```json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  }
}
```

The formatter configuration lived in the same `biome.json` file as the linting rules. Running `npx @biome/biome format --write .` formatted all files. Running `npx @biome/biome check --write .` both linted and formatted in one command.

I compared Biome's output against Prettier's formatting on the same files. The results matched exactly except for a few edge cases involving comments inside JSX attributes. For practical purposes, switching from Prettier to Biome didn't require reformatting the codebase.

ESLint required Prettier as a separate tool:

```json
// .prettierrc
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

I configured Prettier separately from ESLint. The configuration format differed slightly from ESLint's. I needed to remember that Prettier used `printWidth` while ESLint used `max-len`, and they measured line length differently.

Running both tools meant two commands:

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "check": "eslint . && prettier --check ."
  }
}
```

Many teams wrapped these in a single command or used tools like `lint-staged` to run both on changed files. The extra coordination added complexity, especially in CI where you needed to ensure both tools ran successfully.

## Handling TypeScript and JSX

My React components used TypeScript with JSX syntax. Both tools needed to parse this hybrid language correctly, but they approached type checking differently.

Biome parsed TypeScript syntax natively:

```typescript
// Component with TypeScript and JSX
interface UserProps {
  name: string;
  email: string;
  onUpdate: (user: User) => void;
}

export function UserCard({ name, email, onUpdate }: UserProps) {
  const [editing, setEditing] = useState(false);
  
  // Biome catches unused variables
  const unusedVar = 'test';
  
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={() => setEditing(true)}>Edit</button>
    </div>
  );
}
```

Biome understood TypeScript interfaces, JSX syntax, and React hooks. It caught the unused variable and warned about React hooks usage. The built-in parser handled both languages without additional configuration.

What Biome didn't do in version 1.x was check types deeply. Starting with Biome 2.0, released in June 2025, the tool gained type inference capabilities. This means Biome can now catch type-related issues without running the TypeScript compiler, though coverage sits around 85% of what typescript-eslint catches.

ESLint with `@typescript-eslint` went further with full type-checking:

```typescript
export default [
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error'
    }
  }
];
```

By pointing ESLint at my `tsconfig.json`, the type-aware rules accessed full type information. These rules caught mistakes like forgetting to await promises or misusing async functions:

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

function displayUser(id: string) {
  // ESLint catches this - missing await
  const user = fetchUser(id);
  console.log(user.name); // Error: user is a Promise, not a User
}
```

Biome 2.0 can now catch this error with its `noFloatingPromises` rule, though it detects about 85% of cases compared to typescript-eslint's full coverage. The TypeScript compiler would eventually catch it, but type-aware linting gives faster feedback in the editor before running the full build.

The tradeoff was speed. Type-aware rules made ESLint 2-3 times slower because it needed to understand your entire type system. On a medium-sized project, this added 10-20 seconds to linting time.

## Running linting in your editor

Those type-aware rules mattered most during development, when I wanted immediate feedback in my editor. Both tools provided VS Code extensions, but they behaved differently.

I installed Biome's extension:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

The extension handled both linting and formatting. When I saved a file, Biome formatted it and showed errors inline. The feedback appeared instantly, usually within 100-200ms even on large files.

Import organization happened automatically. Biome sorted imports into groups (external packages first, then relative imports) and removed unused imports. I didn't need separate tools or commands for this.

ESLint needed coordination between extensions:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

I installed both ESLint and Prettier extensions. The configuration told VS Code to format with Prettier on save and run ESLint's auto-fix separately. Sometimes they conflicted, with Prettier formatting code one way and ESLint complaining about it.

The performance difference showed during heavy editing sessions. Opening a large TypeScript file, ESLint with type-aware rules took 1-2 seconds to show diagnostics. Biome typically finished in under 500ms. Over dozens of file saves, this saved meaningful time.

## Git hooks and pre-commit checks

Performance mattered, but slow pre-commit hooks were brutal because they interrupted my flow every time I committed code.

I set up Biome with husky and lint-staged:

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
npx lint-staged
```

When I committed 5 files, the hook ran in under 1 second. Even committing 20 files rarely took more than 2 seconds. The hook felt fast enough that I never thought about skipping it.

ESLint and Prettier together needed more time:

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

Committing the same 5 files took 3-5 seconds. With 20 files, the wait stretched to 8-12 seconds. This delay was noticeable enough that some developers would stage files separately to avoid checking too many at once.

The difference affected development velocity subtly. Faster hooks meant committing more frequently with smaller changes. Slower hooks encouraged batching commits, which made code review and debugging harder later.

## Monorepo configuration and workspaces

Our project eventually grew into a monorepo with separate frontend, backend, and shared packages. Each package needed its own linting rules while sharing common configuration.

Biome 2.0 introduced nested configuration support for this:

```json
// biome.json (root)
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  }
}
```

```json
// biome.base.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentWidth": 2
  }
}
```

```json
// packages/frontend/biome.json
{
  "extends": ["//"],
  "linter": {
    "rules": {
      "correctness": {
        "useHookAtTopLevel": "error"
      }
    }
  }
}
```

The special `"extends": ["//"]` syntax tells Biome this is a nested config extending from the root. This micro-syntax sets the `root` field to false automatically and avoids wonky relative paths like `"../../biome.json"`. Each package extended the base configuration and added its own rules.

Running `biome check .` from the root checked all packages in sequence. The tool automatically discovered the workspace structure and applied the right configuration to each package.

ESLint required more setup:

```javascript
// eslint.config.js (root)
import baseConfig from './eslint.base.js';

export default [
  ...baseConfig,
  {
    ignores: ['**/dist', '**/node_modules']
  }
];
```

```javascript
// packages/frontend/eslint.config.js
import baseConfig from '../../eslint.base.js';
import react from 'eslint-plugin-react';

export default [
  ...baseConfig,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react
    },
    rules: {
      ...react.configs.recommended.rules
    }
  }
];
```

Each package needed its own config file importing and extending the base. ESLint processed each directory's config separately, loading plugins multiple times. The cascading configuration system worked but felt heavier than Biome's approach.

## Type-aware linting and its tradeoffs

The monorepo revealed another difference. Our backend code used async/await heavily, and we wanted to catch unhandled promises early.

ESLint caught these with type-aware rules:

```typescript
// packages/backend/src/api.ts
import { Request, Response } from 'express';
import { getUserById } from './db';

export async function handleUserRequest(req: Request, res: Response) {
  const userId = req.params.id;
  
  // ESLint error: Promise not handled
  getUserById(userId);
  
  res.json({ status: 'ok' });
}
```

The `@typescript-eslint/no-floating-promises` rule caught the missing await. This prevented a subtle bug where the response sent before the database query completed.

Enabling this required TypeScript project configuration:

```javascript
// packages/backend/eslint.config.js
export default [
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error'
    }
  }
];
```

These rules made linting noticeably slower. Our backend package had 200 files and took 15 seconds to lint with type-aware rules enabled. Disabling them dropped the time to 4 seconds.

Biome 2.0 can now catch this error without the TypeScript compiler:

```typescript
// Biome 2.0 flags this with noFloatingPromises
export async function handleUserRequest(req: Request, res: Response) {
  const userId = req.params.id;
  getUserById(userId); // Warning: floating promise
  res.json({ status: 'ok' });
}
```

Biome's type inference detects about 85% of floating promise cases that typescript-eslint would catch, running at a fraction of the performance cost. Our backend package linted in 6 seconds with Biome's type-aware rules enabled, compared to 15 seconds with ESLint's full type-checking.

## Framework-specific linting and plugin ecosystem

The frontend package used React, and we needed to enforce hooks rules and accessibility standards. This highlighted ESLint's ecosystem advantage.

ESLint handled React comprehensively:

```javascript
// packages/frontend/eslint.config.js
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn'
    }
  }
];
```

The React hooks plugin caught violations of hooks rules, like calling hooks conditionally or in loops. The accessibility plugin flagged missing ARIA attributes, interactive elements without keyboard support, and images without alt text.

These plugins encoded years of React best practices. The hooks rules prevented subtle bugs that only appeared at runtime. The accessibility rules helped us build usable interfaces for everyone.

Biome provided basic React support:

```json
{
  "linter": {
    "rules": {
      "correctness": {
        "useHookAtTopLevel": "error"
      }
    }
  }
}
```

Biome caught hooks called outside components or at the top level. But it didn't check exhaustive dependencies in `useEffect`, conditional hook calls, or most accessibility patterns. I lost dozens of helpful rules when switching from ESLint.

For Vue or Svelte projects, the gap widened further. ESLint had mature plugins for both frameworks with hundreds of framework-specific rules. Biome didn't support these frameworks at all yet.

## Security and code quality plugins

Beyond framework support, ESLint's plugin ecosystem addressed security and code quality concerns that Biome didn't cover.

We used security-focused plugins in production:

```javascript
import security from 'eslint-plugin-security';
import noSecrets from 'eslint-plugin-no-secrets';

export default [
  {
    plugins: {
      security,
      'no-secrets': noSecrets
    },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'no-secrets/no-secrets': 'error'
    }
  }
];
```

The security plugin caught potential injection vulnerabilities and unsafe patterns. The secrets plugin scanned for accidentally committed API keys or passwords. These weren't style issues but real security risks.

Biome had no equivalent. Its rule set focused on correctness and style, not security. Teams serious about catching vulnerabilities before production needed additional tools or relied on code review.

Code complexity plugins offered another dimension:

```javascript
export default [
  {
    rules: {
      'complexity': ['warn', 10],
      'max-depth': ['warn', 4],
      'max-lines-per-function': ['warn', 50]
    }
  }
];
```

These rules flagged overly complex functions that needed refactoring. Biome measured some complexity but didn't offer the same granular controls over function size and nesting depth.

## Final thoughts

This article compared both tools in practical use rather than theory. Biome offers simplicity and speed with one config and fast feedback loops. ESLint offers a larger ecosystem, deeper framework support, and a plugin library that has matured over a decade of real-world usage. That maturity matters for teams that depend on proven rules and broad community support.

For new projects without heavy linting requirements, Biome can be a good starting point. For established codebases or teams that rely on ecosystem coverage and long-term stability, ESLint remains the safer choice. In some cases, a hybrid setup can work well by combining Biome for formatting with ESLint for specialized rules.

There is no universal winner. The right decision comes down to your team’s needs, the complexity of your codebase, and how much you value performance versus ecosystem depth.