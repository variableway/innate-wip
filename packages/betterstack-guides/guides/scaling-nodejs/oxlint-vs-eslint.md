# Oxlint vs ESLint: Comparing JavaScript Linters

ESLint has been the JavaScript linting standard since 2013. Every project uses it. Every developer knows it. The plugin ecosystem covers accessibility, security, React patterns, and thousands of other specialized checks. It works, but it's slow.

Recently, Oxlint emerged as a faster alternative. Written in Rust and released in December 2023, it processes files faster than ESLint. 

The tradeoff is coverage. Oxlint ships with 520 built-in rules but lacks ESLint's plugin ecosystem. No accessibility checking. No security scanning. Limited type-aware linting. You get speed at the cost of specialized rules that catch bugs ESLint would find.

This guide compares both linters across real projects.


## What is Oxlint?

<iframe width="100%" height="315" src="https://www.youtube.com/embed/mXOEzbvz3KY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


[Oxlint](https://oxc.rs/docs/guide/usage/linter) is a linter for JavaScript and TypeScript that prioritizes speed and zero-configuration defaults. Part of the Oxc project (Oxidation Compiler), it's written in Rust and shares a parser with other tools in the VoidZero ecosystem.

The project started in late 2023 when Boshen began building Rust-based JavaScript tooling. VoidZero, founded by Evan You (creator of Vue and Vite), backs the development. The linter hit 1.0 stability in June 2025 after 18 months of community contributions from over 200 developers.

Oxlint runs without configuration files. Install it, point it at your code, and it starts linting using carefully chosen default rules. This differs from ESLint's blank-slate approach where you must configure everything yourself. The defaults cover common JavaScript mistakes, TypeScript issues, and framework-specific problems for React, Vue, Svelte, and Astro.

The performance comes from Rust's execution speed and the shared Oxc parser. When Oxlint processes your files, it's using the same AST (Abstract Syntax Tree) that other Oxc tools need. This shared infrastructure means less duplicate work compared to running separate JavaScript-based tools.

## What is ESLint?

![ESLint logo and description](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8d47acac-67d1-4585-8b86-6c78a5442600/lg2x =1200x600)

[ESLint](https://eslint.org/) is a pluggable linting utility for JavaScript that analyzes code for problems. Nicholas C. Zakas created it in 2013 to solve the rigid configuration problems of earlier linters like JSHint. The tool became the JavaScript linting standard through its plugin architecture.

ESLint's key innovation was making everything configurable. You're not stuck with the linter author's opinions about code style. Want semicolons? Configure it. Hate semicolons? Configure that too. Need to enforce specific patterns for your company? Write a custom rule.

The plugin ecosystem defines ESLint's reach. React developers use eslint-plugin-react for component patterns. TypeScript projects need @typescript-eslint for type-aware rules. Accessibility requires eslint-plugin-jsx-a11y. Security teams add eslint-plugin-security. These plugins turn ESLint from a JavaScript linter into a tool that understands your entire stack.

ESLint's flat config system, introduced in v9.0 (April 2024), simplified configuration significantly. The old `.eslintrc` format required understanding complex inheritance chains. Flat config uses JavaScript arrays you can reason about directly. This change made ESLint more approachable while maintaining backward compatibility.

## Oxlint vs ESLint: quick comparison

| Feature | Oxlint | ESLint |
|---------|--------|--------|
| First released | December 2023 | June 2013 |
| Language | Rust | JavaScript (Node.js) |
| Latest stable | 1.24.0 (October 2025) | 9.37.0 (October 2025) |
| License | MIT | MIT |
| Default config | Zero-config, 99 rules enabled | Blank slate, must configure |
| Total rules | 520+ built-in rules | 200+ core, 1000s via plugins |
| Speed (4800 files) | ~0.7 seconds | ~30-50 seconds |
| Plugin system | JavaScript plugins (preview) | Mature JavaScript plugin API |
| TypeScript support | Native, built-in | Requires @typescript-eslint |
| Type-aware linting | Preview (via tsgolint) | Yes, fully supported |
| Framework support | React, Vue, Svelte, Astro | All via dedicated plugins |
| Multi-file analysis | Yes, import cycles etc | Limited without plugins |
| Auto-fix support | Yes | Yes |
| Configuration format | .oxlintrc.json | eslint.config.js (flat) |
| Nested configs | Yes | Yes |
| Editor integration | VS Code, IntelliJ, Zed | All major editors |
| CI/CD usage | Single binary | Requires Node.js |
| Accessibility rules | No | Via eslint-plugin-jsx-a11y |
| Security rules | No | Via dedicated plugins |
| Custom rules | Rust or JavaScript (preview) | JavaScript plugin API |
| Migration tool | oxlint-migrate | Built-in for old configs |
| Parallel processing | Native multi-threading | Single-threaded by default |
| Memory usage | Lower (Rust) | Higher (Node.js) |
| Companies using | Airbnb, Shopify, Mercedes-Benz | Nearly all JavaScript companies |

## Installation and getting started

I set up both linters in a React TypeScript project with 800 files to see how the initial experience differed. The installation process revealed their design philosophies immediately.

Oxlint installed with one command:

```command
npm install --save-dev oxlint
```

Running it required no setup:

```command
npx oxlint
```

That's it. The linter scanned all JavaScript and TypeScript files, applied its default rules, and showed me actual problems in the code. No configuration file, no decisions about which rules to enable, no plugin installation. It found unused variables, potential bugs, and React-specific issues without me telling it to look for those things.

The output looked clean:

```
[output]
  ⚠ eslint(no-unused-vars): 
  ╭─[src/components/Button.tsx:5:7]
  5 │ const Button = ({ label, onClick, disabled }) => {
  6 │   const unusedValue = 'test';
    ·         ───────────
  7 │   return (
  ╰────
  
Finished in 412ms
Found 1 warning
```

ESLint needed more ceremony:

```command
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

For React support, add more packages:

```command
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
```

Then create the configuration:

```command
npx eslint --init
```

This started an interactive prompt asking about my project setup, code style preferences, and which frameworks I use. After answering six questions, it generated an `eslint.config.js`:

```javascript
[label eslint.config.js]
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
```

Running ESLint required specifying file paths:

```command
npx eslint .
```

The tool checked my code against the configured rules. But I had to consciously choose which rules mattered. Want to catch accessibility issues? Install another plugin. Need import sorting? Another plugin. Security checks? Yet another plugin.

This flexibility is ESLint's strength and weakness. You can build exactly the linting setup your team needs, but you need to know what you need first.

## Running your first lint check

After installation, I ran both linters on the same 800-file codebase to see what they caught and how long each took.

Oxlint completed in 0.8 seconds:

```command
npx oxlint src/
```

```
[output]
  ⚠ eslint(no-unused-vars): Variable 'userId' is declared but never used
  ⚠ react/jsx-key: Missing "key" prop for element in iterator
  ⚠ typescript/no-explicit-any: Unexpected any. Specify a different type
  
Found 47 warnings in 0.8s
```

The default rules caught real issues: unused variables, missing React keys, and overly permissive `any` types. No configuration needed. The warnings focused on bugs, not style preferences. I didn't see complaints about semicolons, quote styles, or indentation.

ESLint took 28 seconds with my basic configuration:

```command
npx eslint src/
```

```
[output]
/src/components/Button.tsx
  15:7   error  'handleClick' is defined but never used  no-unused-vars
  23:5   error  Missing return type on function          @typescript-eslint/explicit-module-boundary-types
  
/src/utils/api.ts
  8:3    error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 52 problems (52 errors, 0 warnings)
```

ESLint caught similar issues but reported them as errors instead of warnings. The difference matters in CI. Warnings let you commit. Errors block you. With Oxlint's default rules being warnings, I could gradually fix issues. ESLint's errors stopped me immediately.

The 35x speed difference became obvious. Oxlint finished before I looked away from my terminal. ESLint gave me time to check Slack, lose my train of thought, and forget what I was working on.

## Configuration and customization

Those default rules work for straightforward projects. Real codebases need customization. Monorepos have different rules per package. Teams have style preferences. Some projects need stricter checks than others.

Oxlint uses `.oxlintrc.json`:

```json
[label .oxlintrc.json]
{
  "rules": {
    "typescript/no-explicit-any": "error",
    "react/jsx-key": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts"],
      "rules": {
        "typescript/no-explicit-any": "off"
      }
    }
  ]
}
```

The format resembles ESLint v8's configuration. You enable or disable rules by name, set severity levels (off, warn, error), and apply overrides to specific file patterns. Nested configs work for monorepos where each package needs different rules.

For projects already using ESLint, `oxlint-migrate` converts your config:

```command
npx oxlint-migrate eslint.config.js
```

This generates an `.oxlintrc.json` with equivalent rules. Not every ESLint rule has an Oxlint equivalent, so the migration tool comments out unsupported rules for review.

ESLint's flat config gives you programmatic control:

```javascript
[label eslint.config.js]
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
```

This JavaScript array lets you compute configuration. Need different rules based on environment variables? Write JavaScript. Want to share config logic across projects? Export functions. The format trades JSON simplicity for programming flexibility.

## TypeScript and React support

My project used TypeScript with React hooks. Both linters needed to understand JSX syntax, TypeScript types, and React-specific patterns like hook rules.

Oxlint handled this out of the box. No parser configuration. No plugin installation. It just worked:

```typescript
[label src/hooks/useUser.ts]
// src/hooks/useUser.ts
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  
  // Oxlint catches this - conditional hook call
  if (id) {
    useEffect(() => {
      fetchUser(id).then(setUser);
    }, [id]);
  }
  
  return user;
}
```

Oxlint flagged the conditional `useEffect` call immediately. React hooks must be called unconditionally at the top level. This rule prevents subtle bugs where hooks run in different orders on different renders.

The linter also caught TypeScript issues:

```typescript
[label processData.ts]
// Oxlint warns: no-explicit-any
function processData(data: any) {
  return data.map((item: any) => item.value);
}
```

ESLint required explicit TypeScript and React setup:

```javascript
[label eslint.config.js]
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

Once configured, ESLint caught the same issues. But it also provided more React-specific rules. The `exhaustive-deps` rule checks that useEffect dependencies are complete:

```typescript
useEffect(() => {
  fetchUser(userId);
}, []); // ESLint warns: missing dependency 'userId'
```

This prevents bugs where effects don't re-run when they should. Oxlint doesn't have this rule yet. You'd need to catch these issues through testing or runtime errors.

## Type-aware linting differences

React hooks rules work with AST analysis. Type-aware linting requires understanding your TypeScript types. This catches bugs that syntax checking misses.

ESLint offers full type-aware linting through @typescript-eslint:

```javascript
export default [
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
];
```

These rules catch async mistakes:

```typescript
async function saveUser(user: User) {
  await db.users.insert(user);
}

function handleSubmit(user: User) {
  // ESLint error: floating promise
  saveUser(user);
  showSuccess();
}
```

The missing `await` means `showSuccess()` runs before the save completes. Type-aware rules prevent this by understanding that `saveUser` returns a Promise that should be awaited.

The cost is speed. Type-aware rules need TypeScript's type checker. On my 800-file project, ESLint jumped from 28 seconds to 85 seconds with type-checking enabled. The linter had to load `tsconfig.json`, resolve all type definitions, and perform type inference.

Oxlint handles type-aware linting differently. The 1.0 release doesn't include type-checking. A preview feature called tsgolint is in development, which wraps tsgo (the Go port of TypeScript's compiler):

```command
npx oxlint --type-aware
```

This experimental mode enables type-aware rules but requires installing the separate `oxlint-tsgolint` package. The approach delegates to TypeScript's actual compiler rather than reimplementing type inference. This guarantees compatibility with TypeScript's behavior but adds a dependency on tsgo's development pace.

As of October 2025, this feature is still preview-only. For production use, Oxlint can't replace ESLint's type-aware rules yet.

## Multi-file analysis capabilities

Some linting rules need information from multiple files. Import cycles, for example, require following imports across your entire codebase.

Oxlint supports multi-file analysis natively:

```javascript
// api/users.ts
import { formatDate } from '../utils';

// utils/index.ts
import { api } from '../api';

// This creates a cycle: api → utils → api
```

Running `oxlint --import-plugin`:

```
[output]
error: Dependency cycle detected
  ┌─ api/users.ts:1:1
  │
1 │ import { formatDate } from '../utils';
  │ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  │
  = api/users.ts → utils/index.ts → api/users.ts
```

The linter mapped the entire import graph to find the cycle. On Airbnb's 126,000-file codebase, this analysis completes in 7 seconds. ESLint with eslint-plugin-import takes significantly longer for the same check.

Oxlint also includes `oxc/no-barrel-file`, which discourages barrel files (index.ts files that re-export many modules):

```typescript
[label utils/index.ts]
export * from './strings';
export * from './dates';
export * from './numbers';
export * from './arrays';
```

Barrel files hurt bundler tree-shaking and slow down cold starts. The rule suggests importing directly from the source files instead.

ESLint needs plugins for these checks:

```command
npm install --save-dev eslint-plugin-import
```

```javascript
import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-cycle': 'error',
    },
  },
];
```

The eslint-plugin-import works but runs slower. It wasn't designed for the scale that Oxlint targets. Projects with thousands of files see the difference most clearly.

## Pre-commit hooks and developer experience

CI times affect deployment. Pre-commit hooks affect developer flow. A slow hook disrupts your thought process every time you commit.

I configured both linters with husky and lint-staged:

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["oxlint"]
  }
}
```

Committing 10 changed files took 0.4 seconds with Oxlint. The hook felt instant. I barely noticed it running.

ESLint on the same 10 files:

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix"]
  }
}
```

This took 3.8 seconds. Not terrible, but noticeable. I'd start the commit, wait, and sometimes forget what I was doing. Over dozens of commits per day, these seconds add up.

Worse, some developers started skipping the hook:

```command
git commit --no-verify -m "quick fix"
```

The slow hook made people bypass the checks it was supposed to enforce. Oxlint's speed kept the hook fast enough that nobody complained.

## Plugin ecosystem and extensibility

Speed matters, but so does catching the issues your team cares about. This is where ESLint's decade-long head start shows.

ESLint has plugins for nearly everything:

```bash
# Accessibility
npm install --save-dev eslint-plugin-jsx-a11y

# Security
npm install --save-dev eslint-plugin-security

# Performance
npm install --save-dev eslint-plugin-perf-standard

# Node.js best practices
npm install --save-dev eslint-plugin-node
```

Each plugin adds specialized rules. The jsx-a11y plugin alone has 40+ rules for accessibility:

```javascript
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
    },
  },
];
```

These rules catch issues that affect real users:

```jsx
// Error: img missing alt text
<img src="/avatar.jpg" />

// Error: click without keyboard handler
<div onClick={handleClick}>Click me</div>

// Error: invalid ARIA property
<button aria-labeledby="invalid">Submit</button>
```

Accessibility bugs are hard to catch without automated checks. Manual testing misses issues. Oxlint doesn't have accessibility rules yet, so you lose this safety net.

Security plugins provide another layer:

```javascript
import security from 'eslint-plugin-security';

export default [
  {
    plugins: { security },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
    },
  },
];
```

These catch potential vulnerabilities:

```javascript
// Warning: potential object injection
function getUserData(req) {
  const key = req.params.key;
  return users[key]; // Unsafe if key is '__proto__' or 'constructor'
}

// Error: ReDoS vulnerability
const regex = /(a+)+b/; // Catastrophic backtracking
```

Oxlint lacks these security-focused rules. For projects with security compliance requirements, ESLint remains necessary.

## JavaScript plugin support in Oxlint

Oxlint 1.0 shipped without custom plugin support. This changed in October 2025 with JavaScript plugin preview:

```javascript
// my-rule.js
import { defineRule } from 'oxlint';

export default defineRule({
  createOnce(context) {
    let consoleCount = 0;
    
    return {
      before() {
        consoleCount = 0;
      },
      CallExpression(node) {
        if (node.callee.object?.name === 'console') {
          consoleCount++;
          if (consoleCount > 3) {
            context.report({
              node,
              message: 'Too many console statements',
            });
          }
        }
      },
    };
  },
});
```

Loading custom rules:

```json
{
  "plugins": {
    "custom": "./my-rule.js"
  },
  "rules": {
    "custom/no-excessive-console": "error"
  }
}
```

The plugin API is ESLint-compatible. Many existing ESLint plugins work without modification. However, not all ESLint APIs are implemented yet. Token-based rules (used for formatting) don't work. Some advanced APIs remain unfinished.

The performance impact is significant. Adding JavaScript plugins to Oxlint introduces the transfer overhead between Rust and JavaScript. A benchmark on a 5,000-file project:

- Oxlint (native rules only): 2.1 seconds
- Oxlint (with JS plugins): 15.8 seconds
- ESLint: 92 seconds

Oxlint with plugins is still 6x faster than ESLint, but it loses the 40x advantage. The team is working on optimizations to reduce this overhead.

## Framework-specific linting

React, Vue, Svelte, and Astro each have their own patterns and anti-patterns. Framework-specific linting catches mistakes unique to each.

Oxlint includes framework rules by default. For React:

```typescript
// Warning: missing key prop
{items.map(item => (
  <div>{item.name}</div>
))}

// Warning: invalid hook call
if (condition) {
  useEffect(() => {});
}
```

For Vue:

```vue
<template>
  <!-- Warning: v-if with v-for on same element -->
  <div v-for="item in items" v-if="item.active">
    {{ item.name }}
  </div>
</template>
```

These built-in rules cover common framework mistakes. Oxlint parses `.vue`, `.svelte`, and `.astro` files natively, linting the JavaScript inside `<script>` tags.

ESLint requires framework plugins:

```command
npm install --save-dev eslint-plugin-react eslint-plugin-vue eslint-plugin-svelte
```

```javascript
import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: { react },
    rules: {
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    ...vue.configs['flat/recommended'],
  },
];
```

ESLint's plugins offer more rules. The React plugin has 80+ rules covering component patterns, hooks usage, JSX specifics, and performance issues. Oxlint's built-in React support includes about 20 rules.

For teams with strict framework standards, ESLint's deeper rule coverage matters. For teams wanting to catch obvious mistakes without configuration overhead, Oxlint's defaults suffice.

## Final thoughts
This article compared ESLint and Oxlint across real projects. Oxlint is much faster and easier to set up. It gives instant feedback and works well as a daily linting tool. ESLint is slower but offers deeper coverage through plugins for accessibility, security, and advanced TypeScript rules.

For simple or new projects, Oxlint is usually enough. For larger or stricter codebases, ESLint is still required. Many teams will benefit from using both: Oxlint for quick feedback during development and ESLint for full checks in CI.

The tooling landscape is still evolving. Oxlint is improving quickly and ESLint continues to expand its ecosystem. Choose the tool that fits your current needs and adjust over time as your project grows.