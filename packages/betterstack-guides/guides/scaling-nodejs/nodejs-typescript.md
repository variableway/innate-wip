# Using TypeScript with Node.js: A Beginner's Guide

[TypeScript](https://www.typescriptlang.org/) is an extension of the JavaScript
syntax that adds type safety and other features to the language. Since its debut
in 2011, it has continued to grow in popularity and is increasingly being used
for all kinds of projects where reliability is critical.

While emerging JavaScript runtimes like [Deno](https://deno.land/) and
[Bun](https://bun.sh/) come with built-in TypeScript support, Node.js does not.
As a result, you need to invest additional effort to integrate type checking
within the Node.js runtime. This article will teach you how to do just that!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/u_GQSEjis48" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Prerequisites

Before proceeding with this tutorial, ensure that you have installed the latest
versions of [Node.js](https://nodejs.org/en/download) and `npm`. Additionally, a
basic understanding of TypeScript expected as this tutorial focuses solely on
how to integrate it smoothly into a Node.js project.

[summary]
## Side note: Get alerted when your Node.js app goes down

Head over to [Better Stack](https://betterstack.com/uptime/) and start
monitoring your endpoints in 2 minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/YUnoLpCy1qQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[/summary]

## Step 1 — Downloading the demo project (optional)

To illustrate the process of integrating TypeScript seamlessly into a Node.js
project, we'll be working with
[a demo Node.js application](https://github.com/betterstack-community/btc-exchange-rates)
that displays the current Bitcoin price in various crypto and fiat currencies.
While we'll use this specific project for demonstration, feel free to apply the
steps outlined in this guide to any other project you choose.

Start by running the command below to clone the repository to your machine:

```command
git clone https://github.com/betterstack-community/btc-exchange-rates
```

Change into the newly created `btc-exchange-rates` directory and run the command
below to download all the project's dependencies:

```command
npm install
```

Afterward, launch the development server on port 3000 by executing the command
below:

```command
npm run dev
```

Upon successful execution, you should see the following output:

```text
[output]
> btc-exchange-rates@1.0.0 dev
> nodemon server.js

[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
server started on port: 3000
Exchange rates cache updated
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the
application in action:

![BTC Exchange Rates screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d9df0e72-04df-4e64-bb94-9bdb249f0700/public
=1313x768)

You may now proceed to the next section, where you'll install and configure the
TypeScript compiler in your Node.js project.

## Step 2 — Installing and configuring TypeScript

Now that you've set up the demo application go ahead and install the
[TypeScript compiler](https://www.npmjs.com/package/typescript) in our project
through the command below:

```command
npm install typescript
```

Installing TypeScript locally ensures the version is recorded in your project's
`package.json` file so that anyone cloning your project in the future will use
the same TypeScript version, safeguarding against potential breaking changes
between versions.

Once installed, you will have the `tsc` command available in your project, which
you can access through `npx` as shown below:

```command
npx tsc --version
```

```text
[output]
Version 5.2.2
```

You may see a different version of TypeScript depending on when you're following
this tutorial. Typically, a new version is published every three months.

Before you can start compiling JavaScript source files, you need to set up a
`tsconfig.json` configuration file. Without it, the TypeScript compiler will
throw an error when you attempt to compile project. While you can use
command-line flags, a configuration file is more manageable.

![Screenshot from 2023-09-30 20-36-14.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0225515a-ff09-436d-e9a7-902f1c2f8400/public
=2184x1016)

Go ahead and create a `tsconfig.json` file in the root of your project
directory:

```command
code tsconfig.json
```

Once the file is open in your text editor, paste in the following contents:

```json
[label tsconfig.json]
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

TypeScript provides a host of
[configuration options](https://www.typescriptlang.org/tsconfig/) to help you
specify what files should be included and how strict you want the compiler to
be. Here's an explanation of the basic configuration above:

- `extends`: provides a way to inherit from another configuration file. We are
  utilizing the
  [base config for Node v20](https://github.com/tsconfig/bases/blob/main/bases/node20.json)
  in this example, but feel free to utilize a more appropriate
  [base configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases)
  for your Node.js version.
- `include`: specifies what files should be included in the program.
- `exclude`: specifies the files or directories that should be omitted during
  compilation.

Another critical property not shown here is `compilerOptions`. It's where the
majority of TypeScript's configuration takes place, and it covers how the
language should work. When it omitted as above, it defaults to the
`compilerOptions` specified in the base configuration or the TypeScript
[compiler defaults](https://www.typescriptlang.org/tsconfig#compilerOptions):

```json
[label https://github.com/tsconfig/bases/blob/main/bases/node20.json]
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 20",
  "_version": "20.1.0",

[highlight]
  "compilerOptions": {
    "lib": ["es2023"],
    "module": "node16",
    "target": "es2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node16"
  }
[/highlight]
}
```

The base configuration referenced above is provided as an
[NPM package](https://www.npmjs.com/package/@tsconfig/node20), so you need to
install it before it can take effect:

```command
npm install --save-dev @tsconfig/node20
```

After installing the base config, go ahead and execute the command below in your
project's root directory:

```command
npx tsc
```

```text
[label output]
error TS18003: No inputs were found in config file '/home/ayo/dev/demo/btc/tsconfig.json'. Specified 'include' paths were '["src/**/*"]' and 'exclude' paths were '["node_modules"]'.


Found 1 error.
```

You'll encounter the above error since there's no `.ts` file in the `src`
directory. To address this, adjust the `tsconfig.json` config to recognize
JavaScript files through the `allowJs` option. This approach can help you when
transitioning a JavaScript project to TypeScript incrementally. You should also
specify the output directory for compiled JavaScript files using the `outDir`
option:

```json
[label tsconfig.json]
{
  "extends": "@tsconfig/node20/tsconfig.json",
  [highlight]
  "compilerOptions": {
    "allowJs": true,
    "outDir": "dist"
  },
  [/highlight]
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

After saving the file, run the TypeScript compiler once more. You will observe
that no output is produced, which means that compilation was successful.

```command
npx tsc
```

You should now see a `dist` directory containing the compiled `server.js` file
in your project root.

```command
ls dist
```

```text
[output]
server.js
```

You can now modify your `nodemon.json` config to run the compiled file instead
of the source:

```json
[label nodemon.json]
{
  "watch": ["src"],
  "ext": ".js",
  "ignore": [],
[highlight]
  "exec": "node dist/server.js"
[/highlight]
}
```

With these steps, you've successfully integrated TypeScript into your Node.js
project!

## Step 3 — Type checking JavaScript files (optional)

You're now set up to compile both JavaScript and TypeScript files, but type
checking isn't performed on `.js` files by default. If you're transitioning your
Node.js project to TypeScript and want to leverage type checking without
converting all existing `.js` files to `.ts` in one go, you can use the
`checkJs` compiler option to enable type checking on the former:

```json
[label tsconfig.json]
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    [highlight]
    "checkJs": true,
    [/highlight]
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

A word of caution here: enabling `checkJs` in a sizable project might flood you
with errors, and addressing these errors without transitioning to `.ts` files
might not be the most efficient approach.

Even in our single file project with less than 100 lines, we got 20 errors just
by enabling this option:

![Screenshot from 2023-10-01 16-52-49.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/462175e6-3efc-400d-8143-2380da04ae00/md2x
=2324x695)

Instead of globally enabling `checkJs`, you can opt for type checking on a
per-file basis using the `@ts-check` comment at the beginning of each file:

```javascript
[label server.js]
// @ts-check
import express from 'express';
import path from 'node:path';
. . .
```

Conversely, if you've enabled `checkJs` but wish to exclude specific files from
type checking, use the `@ts-nocheck` comment:

```javascript
[label server.js]
// @ts-nocheck
import express from 'express';
import path from 'node:path';
. . .
```

This is handy for temporarily bypassing problematic files that you might not
have the capacity to address immediately.

For more granular control, TypeScript offers the `@ts-ignore` and
`@ts-expect-error`
[comments](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error).
They allow you to control type checking on a line-by-line basis:

```javascript
// @ts-expect-error
const app = express();

// or

// @ts-ignore
const app = express();
```

These special comments are effective in both JavaScript (with `allowJs` enabled)
and TypeScript files.

Given the simplicity of our demo application, we won't use `checkJs` or the
special comments discussed in this section. Instead, we'll transition directly
to TypeScript and address any type errors that arise in the process.

## Step 4 — Migrating your JavaScript files to TypeScript

Transitioning from JavaScript to TypeScript is as straightforward as changing
the file extension from `.js` to `.ts`. Since every valid JavaScript program is
also valid TypeScript, this simple change is often all you need to start
leveraging TypeScript's features.

```command
mv src/server.js src/server.ts
```

Afterward, change the `ext` field in your `nodemon.json` file as follows:

```json
{
  "watch": ["src"],
[highlight]
  "ext": ".js,.ts",
[/highlight]
  "ignore": [],
  "exec": "tsc && node dist/server.js"
}
```

For Node.js projects, it's essential to install the
[@types/node](https://www.npmjs.com/package/@types/node) package. This package
provides type definitions for the built-in Node.js APIs, which the TypeScript
compiler will automatically detect.

```command
npm install --save-dev @types/node
```

At this point, you can run the TypeScript compiler and see if you get any
errors:

```command
npx tsc
```

![Screenshot from 2023-10-01 16-53-46.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c55baa3a-0cc4-4c76-bc24-702088eee200/md2x
=1348x798)

Now that the compiler can ascertain the specific types for the built-in Node.js
APIs, the errors have reduced from 20 to seven. Most of the remaining errors
arise because the compiler is unable to determine the types for some third-party
libraries in use.

TypeScript defaults to the `any` type when it encounters JavaScript libraries
without type definitions. However, implicit usage of `any` is disallowed in
stricter configurations
([see here](https://github.com/tsconfig/bases/blob/main/bases/node20.json#L11)),
leading to these errors. In the next section, you will discover some strategies
for solving this problem.

Once you're done migrating your JavaScript source files to TypeScript, you may
remove the `allowJs` compiler option from your `tsconfig.json`.

## Step 5 — Fixing type errors caused by third-party libraries

While TypeScript is powerful, it often encounters challenges with third-party
libraries written in JavaScript. It relies on type information to ensure type
safety which JavaScript projects cannot provide this out of the box. Let's
address these challenges in this section.

### Understanding the problem

When TypeScript encounters a library written in JavaScript, it defaults to the
`any` type for the entire library. This is a catch-all type that essentially
bypasses TypeScript's type checking. While this might seem convenient, it
defeats the entire purpose of using TypeScript, as you won't get compile-time
type checks.

The `noImplicitAny` compiler option helps mitigate this. When enabled,
TypeScript will throw an error if it can't infer a type, rather than defaulting
to `any`. This option is part of the
[strict configuration](https://www.typescriptlang.org/tsconfig#strict) that
ensures stricter type checking.

### The solution: Type Declarations

To help TypeScript understand JavaScript libraries, authors can provide type
declaration files (ending in `.d.ts`) in their packages. These files describe
the library's structure, enabling TypeScript to check types and provide better
auto-completion in editors.

Some libraries, like `axios`, include type declarations in their main package,
but many others (like `express` and `morgan`) don't. For these libraries, the
TypeScript community often creates and publishes their type declarations
separately under the
[@types scope on NPM](https://www.npmjs.com/search?q=%40types). These are
community-sourced and can be found in the
[DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped).

### Addressing the errors

Here are the first two errors from compiling the program in the previous step:

```text
src/server.ts:1:21 - error TS7016: Could not find a declaration file for module 'express'. '/home/ayo/dev/betterstack/demo/btc-exchange-rates/node_modules/express/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`

1 import express from 'express';
                      ~~~~~~~~~

src/server.ts:4:20 - error TS7016: Could not find a declaration file for module 'morgan'. '/home/ayo/dev/betterstack/demo/btc-exchange-rates/node_modules/morgan/index.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/morgan` if it exists or add a new declaration (.d.ts) file containing `declare module 'morgan';`

4 import morgan from 'morgan';
                     ~~~~~~~~

. . .
```

As the error messages suggest, you can often resolve type issues by installing
the appropriate type declarations from the `@types` scope. For the current
errors related to `express` and `morgan`, run the following command:

```command
npm install --save-dev @types/express @types/morgan
```

After installing the type declarations, re-run the TypeScript compiler. All the
"implicit any" errors should be gone now, leaving only one error:

```command
npx tsc
```

```text
[output]
src/server.ts:76:27 - error TS18046: 'data' is of type 'unknown'.

76       lastUpdated: format(data.timestamp, 'LLL dd, yyyy hh:mm:ss a O'),
                             ~~~~

Found 2 errors in the same file, starting at: src/server.ts:31
```

From now on, if you try something illegal with the library's API, the compiler
will bring your attention to the problem straight away:

```typescript
[label src/server.ts]
// attempting to use a method that does not exist
app.misuse(morganMiddleware);
```

```command
npx tsc
```

```text
[output]
src/server.ts:23:5 - error TS2339: Property 'misuse' does not exist on type 'Express'.

23 app.misuse(morganMiddleware);
       ~~~~~~
```

If you're using a less popular library without available type declarations in
the `@types` scope, you may need to write custom type declaration files for the
library. See the
[TypeScript handbook](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
for guidance on how to do this


[summary]
## Side note: Track errors in your Node.js app

Catch bugs before your users do. [Better Stack](https://betterstack.com/error-tracking) provides AI-native error tracking with full context—Sentry-compatible at 1/6th the price.


![Better Stack error tracking dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91d5b92f-4597-40cd-c51e-5a73c7b2ee00/lg1x =2350x1002)
[/summary]


## Step 6 – Fixing other type errors

In the previous section, you successfully fixed all the "implicit any" errors
caused by a lack of type information in JavaScript libraries, but we still have
one more error to address:

```text
src/server.ts:74:35 - error TS2571: Object is of type 'unknown'.

74       lastUpdated: dateFns.format(data.timestamp, 'LLL dd, yyyy hh:mm:ss a O'),
                                     ~~~~
Found 1 error in src/server.ts:74
```

The underlined `data` entity contains the exchange rates data received from the
Coin Gecko API and the date it was last updated. This error indicates that
TypeScript is unsure about the type of the `data` object so it assigns the
`unknown` type to it.

While `any` allows you to do anything with a variable, `unknown` is more
restrictive: you can't do anything without first asserting or narrowing its
type. To address this error, you need to inform TypeScript of the shape of this
entity by creating custom types.

Go ahead and add the highlighted lines below to your `src/server.ts` file:

```typescript
[label src/server.ts]
. . .

app.set('views', path.join(__dirname, '..', 'views'));

[highlight]
type Currency = {
  name: string;
  unit: string;
  value: number;
  type: string;
};

type Rates = {
  rates: {
    [key: string]: Currency;
  };
};

type ExchangeRateResult = {
  timestamp: Date;
  data: Rates;
};
[/highlight]

. . .
```

Here, `ExchangeRateResult` describes the shape of the `data` entity which looks
like this:

```json
{
    "timestamp": "2023-10-01T04:20:18.357Z",
    "data": {
        "rates": {
            "aed": {
                "name": "United Arab Emirates Dirham",
                "type": "fiat",
                "unit": "DH",
                "value": 99314.944
            },
            "ars": {
                "name": "Argentine Peso",
                "type": "fiat",
                "unit": "$",
                "value": 9464154.224
            }
        }
    }
}
```

The next step is to annotate the return types of your functions with the custom
types, allowing the compiler to understand the shape of the data you're working
with:

```typescript
[label src/server.ts]
. . .
[highlight]
async function getExchangeRates(): Promise<Rates> {
[/highlight]
  // ... function body ...
}

[highlight]
async function refreshExchangeRates(): Promise<ExchangeRateResult> {
[/highlight]
  // ... function body ...
}
. . .
```

Finally, in the root route, specify the type of the `data` object as shown below
to reflect that it can be an `ExchangeRateResult`, `null`, or `undefined` if not
found in the cache.

```typescript
[label src/server.ts]
. . .
app.get('/', async (req, res, next) => {
  try {
    [highlight]
    let data: ExchangeRateResult | undefined = appCache.get('exchangeRates');
    [/highlight]

    . . .
  } catch (err) {
    . . .
  }
});
. . .
```

After making these changes, re-run the TypeScript compiler. With the additional
type information provided, TypeScript should be able to compile your code
without any errors.

```command
npx tsc
```

By following these steps, you've resolved the error and made your codebase more
robust. TypeScript's type system, combined with custom type definitions, ensures
that your code is more predictable, easier to understand, and less prone to
runtime errors.

## Step 7 — Simplifying the development workflow

When working with TypeScript in a Node.js environment, the development workflow
can sometimes feel cumbersome due to the need for type checking and
transpilation. However, with the right tools and configurations, you can
streamline this process, allowing you to focus more on coding.

For example, you can adjust the `nodemon.json` configuration to combine the
TypeScript compilation and Node.js execution into a single command:

```json
[label nodemon.json]
{
  "watch": ["src"],
  "ext": ".js,.ts",
  "ignore": [],
  "exec": "tsc && node dist/server.js"
}
```

With this setup, every time you make a change to a `.ts` file in the `src`
directory, Nodemon will first run the TypeScript compiler and then execute the
compiled JavaScript using Node.js.

While the above setup works, there's still some overhead due to the separate
compilation step. The [tsx package](https://www.npmjs.com/package/tsx) (short
for TypeScript Execute) offers a faster alternative by leveraging the
[esbuild bundler](https://esbuild.github.io/), which is known for its speed. It
allows you to run TypeScript files directly without type checking.

Go ahead and install it in your project through the command below:

```command
npm install tsx --save-dev
```

Afterward, quit the current `nodemon` process by pressing `Ctrl-C`, then execute
the `src/server.ts` file directly with `tsx`:

```command
npx tsx src/server.ts
```

```text
[output]
server started on port: 3000
Exchange rates cache updated
```

For automatic restarts on file changes, use the built-in `watch` mode:

```command
npx tsx watch src/server.ts
```

The main trade-off with `tsx` is that it doesn't perform type checking. To
ensure your code remains type-safe, you can run the TypeScript compiler in watch
mode with the `--noEmit` flag in a separate terminal. This will check for type
errors without producing any output files:

```command
npx tsc --watch --noEmit
```

With this setup, you'll get immediate feedback when type errors occur, but it
won't affect your development velocity since the program will continue to
compile. You can ignore the errors until you're ready to finalize the unit of
work by committing into source control.

## Step 8 — Linting TypeScript with ESLint

Linting is a crucial part of the development process, as it helps maintain code
quality by catching potential errors and enforcing a consistent coding style.
For TypeScript projects, [ESLint](https://www.npmjs.com/package/eslint) is the
recommended linter, especially with the deprecation of
[TSLint](https://www.npmjs.com/package/tslint).

Start by installing ESLint and the necessary plugins for TypeScript:

```command
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

Afterward, create a `.eslintrc.json` file in your project root and update its
contents as follows:

```json
[label .eslintrc.json]
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2024,
    "sourceType": "module",
    "project": "tsconfig.json"
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "env": {
    "node": true
  },
  "rules": {},
  "ignorePatterns": ["dist"]
}
```

This configuration sets up ESLint to parse TypeScript files and apply a set of
recommended linting rules for TypeScript. At this stage, you should get linting
messages in your editor, provided the relevant ESLint plugin is installed.

You can also create a `lint` script that can be executed from the command line:

```json
[label package.json]
"scripts": {
  "dev": "nodemon",
  [highlight]
  "lint": "eslint . --fix"
  [/highlight]
}
```

Running `npm run lint` will now lint your project and automatically fix any
auto-fixable issues.

```command
npm run lint
```

```text
[label output]
/home/ayo/dev/betterstack/demo/btc-exchange-rates/src/server.ts
   80:31  error  'next' is defined but never used             @typescript-eslint/no-unused-vars
  101:7   error  'server' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```

While the recommended set of rules is a good starting point, you might want to
customize them to fit your project's needs. For instance, if you want to disable
the rule that warns about unused variables, you can update the rules section in
your `.eslintrc.json` as follows:

```json
[label .eslintrc.json]
. . .
"rules": {
  "@typescript-eslint/no-unused-vars": "off"
}
. . .
```

Do check out the [ESLint docs](https://eslint.org/docs/user-guide/configuring/)
and
[typescript-eslint repository](https://github.com/typescript-eslint/typescript-eslint)
to learn more about configuring ESLint for JavaScript and TypeScript.

## Step 9 — Formatting TypeScript code with Prettier

[Prettier](https://prettier.io/) is a widely-used code formatter that supports
multiple languages, including TypeScript. Integrating Prettier with ESLint
ensures that your code is linted for potential errors and consistently
formatted. Here's how to set up Prettier for your TypeScript project:

```command
npm install --save-dev prettier
```

Afterward, create a Prettier configuration and update its contents as shown
below:

```json
[label .prettierrc.json]
{
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true
}
```

You can now run Prettier to format your TypeScript files:

```command
npx prettier --write src/server.ts
```

```text
[output]
src/server.ts 134ms
```

To ensure that Prettier's formatting doesn't conflict with ESLint's linting
rules, you'll want to integrate the following packages:

```command
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Afterward, modify your `.eslintrc.json` file as shown below:

```json
[label .eslintrc.json]
"extends": [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  [highlight]
  "plugin:prettier/recommended"
  [/highlight]
]
```

The `plugin:prettier/recommended` configuration does two things:

1. It adds the `prettier` plugin, which runs Prettier as an ESLint rule.
2. It extends the `eslint-config-prettier` configuration, which turns off all
   ESLint rules that might conflict with Prettier.

With this setup, running ESLint with the `--fix` option will also fix Prettier
formatting issues. This is especially useful if you have an editor integration
that automatically fixes ESLint issues on save.

## Step 10 — Debugging TypeScript with Visual Studio Code

Debugging is a crucial aspect of the application development process, and when
working with TypeScript, it's essential to have a seamless debugging experience.
Visual Studio Code provides an integrated debugging environment for TypeScript,
allowing you to debug your code directly within the editor.

Before you can debug your TypeScript code, you need to generate source maps.
Update your `tsconfig.json` to include the `sourceMap` option like this:

```json
[label tsconfig.json]
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
[highlight]
    "sourceMap": true
[/highlight]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Once that's done, set up a launch configuration file for TypeScript as follows:

```json
[label .vscode/launch.json]
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug server.ts",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

This configuration tells VS Code to:

1. Use the Node.js debugger.
2. Compile the TypeScript code before launching the debugger.
3. Debug the server.ts file located in the `src` directory.
4. Look for the compiled JavaScript files in the `dist` directory.

With this configuration in place, you can start debugging by pressing `F5` in
Visual Studio Code. This will compile your TypeScript code, generate source
maps, and start the debugger. Ensure that no other instance of your server is
running or you might get an
[EADDRINUSE error](https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/#5-erraddrinuse).

With source maps enabled and the debugger set up, you'll be debugging your
original TypeScript code, not the transpiled JavaScript. This means that when
you hit a breakpoint, you'll see your TypeScript code in the editor, and the
variable values, call stack, and other debugging information will correspond to
the TypeScript code.

![Debugging TypeScript in VS Code](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90e0fbd2-2f07-4d16-933a-93e28eb31700/public
=1215x714)


[summary]
## Side note: Centralize and visualize your logs

Save hours of sifting through logs. [Better Stack](https://betterstack.com/log-management) provides live tail with instant filtering and search across all your services.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Transform your logs into dashboards that track error rates, performance trends, and application health.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
[/summary]

## Final thoughts

Migrating a Node.js application to TypeScript might seem daunting at first, but
with the right tools and strategies, it becomes a manageable and rewarding
process. TypeScript offers a robust type system that can catch potential errors
at compile-time, making your codebase more maintainable and less prone to
runtime errors.

By following the steps covered in this article, you can ensure that your Node.js
project is set up correctly to benefit from the full range of features that
TypeScript offers. With the added type safety and improved tooling, you'll find
that your development process is more efficient and less error-prone.

The
[typescript branch of the provided GitHub repository](https://github.com/betterstack-community/btc-exchange-rates/tree/typescript)
showcases the result of the migration process so it can serve as a practical
reference when applying what you've learned here to your projects.

Thanks for reading, and happy coding!