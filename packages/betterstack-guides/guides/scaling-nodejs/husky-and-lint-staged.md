# Prevent Bad Commits with Husky and lint-staged

[Husky](https://typicode.github.io/husky/) is a tool that helps run checks on your code before you make a Git commit.

When you pair it with [lint-staged](https://github.com/okonet/lint-staged), it becomes a powerful way to make sure only clean, error-free code gets committed. Together, they help teams keep code quality high and catch problems early.

This guide will show you how to set up a solid pre-commit system using Husky and lint-staged. You’ll learn how to automatically run tools that format code, catch issues, and run tests—only on the files that are about to be committed. 

[ad-logs]

## Prerequisites

Before you start, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` (or `yarn`) installed on your computer. This guide assumes you know the basics of Git and Node.js project structure. 

## Getting started with Husky

To see how Husky and lint-staged work together, create a new Node.js project where you can try out these tools. Start by setting up your project:

```command
mkdir commit-quality-demo && cd commit-quality-demo
```

```command
npm init -y
```

Set up your project to use modern JavaScript modules:

```command
npm pkg set type=module
```

Initialize a Git repository since Husky requires Git to work:

```command
git init
```

Create a basic `.gitignore` file to exclude common files you don't want to commit:

```text
[label .gitignore]
node_modules/
npm-debug.log*
.env
.env.local
.DS_Store
*.log
dist/
build/
```

Install Husky as a development dependency since you only need it during development:

```command
npm install --save-dev husky
```

Initialize Husky in your project to create the necessary Git hooks setup:

```command
npx husky init
```

This command creates a `.husky` folder in your project and adds a `prepare` script to your package.json. The prepare script makes sure Husky hooks get installed automatically when team members run `npm install`, so everyone gets the same setup.

Create a simple JavaScript file to test your configuration:

```javascript
[label src/utils.js]
export function formatUserName(firstName,lastName){
return `${firstName} ${lastName}`
}

export function calculateAge(birthYear){
const currentYear=new Date().getFullYear()
return currentYear-birthYear
}

// This unused variable will trigger an ESLint warning
const unusedVariable = 'test';
```

## Installing and configuring lint-staged

While Husky manages Git hooks, lint-staged makes quality checks run faster by only checking files you're about to commit. This approach saves time in large projects where checking all files would take too long.

Install lint-staged along with the code quality tools you'll need:

```command
npm install --save-dev lint-staged eslint prettier
```

Set up ESLint for your project:

```command
npx eslint --init
```

Choose these options when prompted:

- How would you like to use ESLint? → **To check syntax and find problems**
- What type of modules does your project use? → **JavaScript modules (import/export)**
- Which framework does your project use? → **None of these**
- Does your project use TypeScript? → **No**
- Where does your code run? → **Node**
- What format do you want your config file to be in? → **JSON**

Create a Prettier configuration file to set your formatting rules:

```json
[label .prettierrc]
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

Create a dedicated lint-staged configuration file to tell it which tools to run on which file types:

```json
[label .lintstagedrc.json]
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

This configuration tells lint-staged to run ESLint with automatic fixing followed by Prettier formatting on JavaScript files, and only Prettier on JSON, CSS, and Markdown files.

## Creating a pre-commit hook

Now that you have both Husky and lint-staged configured, create a pre-commit hook that uses these tools. Husky should have created a basic pre-commit hook during setup, but you need to modify it to run lint-staged:

```bash
[label .husky/pre-commit]
lint-staged
```

This simple script runs lint-staged every time you try to commit changes. The process happens automatically and transparently while providing strong quality assurance.


Stage the file and try to commit it:

```command
git add src/utils.js
```
```command
git commit -m "Add utility functions"
```

You'll see lint-staged run automatically, fixing formatting issues and flagging ESLint problems. 

If there are issues that can't be fixed automatically, the commit will fail:

```text
[label output]
✔ Backed up original state in git stash (72d46d5)
⚠ Running tasks for staged files...
  ❯ .lintstagedrc.json — 1 file
    ❯ *.{js,jsx,ts,tsx} — 1 file
      ✖ eslint --fix [FAILED]
      ◼ prettier --write
    ↓ *.{json,css,md} — no files
↓ Skipped because of errors from tasks.
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

✖ eslint --fix:

/Users/stanley/commit-quality-demo/src/utils.js
  11:7  error  'unusedVariable' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)

husky - pre-commit script failed (code 1)`
```

You'll need to fix them manually before you can commit.


## Advanced lint-staged configurations

Now that you've seen how lint-staged catches issues, let's explore how to customize its behavior for different scenarios. The error you just saw shows ESLint catching an unused variable - let's look at how to handle these situations and configure more sophisticated workflows.

### Handling ESLint errors and warnings

The unused variable error can be fixed in several ways. First, you can simply remove the unused variable from your code:

```javascript
[label src/utils.js]
export function formatUserName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

export function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}
```

Now try committing again:

```command
git add src/utils.js
```

```command
git commit -m "Fix formatting and remove unused variable"
```

You should see lint-staged run successfully:

```text
[output]

✔ Backed up original state in git stash (79da3b1)
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[master 8a845e8] Fix formatting and remove unused variable
 1 file changed, 3 deletions(-)
```

### Running multiple commands with different error handling

For more complex validation workflows, you can chain multiple commands and control how failures are handled. Update your `.lintstagedrc.json`:

```json
[label .lintstagedrc.json]
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

Create a test file with warnings to see the strict behavior:

```javascript
[label src/test.js]
export function badFunction(){
  const unused = 'this will cause issues';
  console.log('hello')
}
```

Try to commit this file:

```command
git add src/test.js
```

```command
git commit -m "Test strict ESLint configuration"
```

You'll see it fail because `--max-warnings=0` treats warnings as errors:

```text
[output]
✔ Preparing lint-staged...
⚠ Running tasks for staged files...
  ❯ .lintstagedrc.json — 1 file
    ❯ *.{js,jsx,ts,tsx} — 1 file
      ✖ eslint --fix --max-warnings=0 [FAILED]
      ◼ prettier --write
    ↓ *.{json,css,md} — no files
↓ Skipped because of errors from tasks.
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

✖ eslint --fix --max-warnings=0:

/Users/stanley/commit-quality-demo/src/test.js
  2:9  warning  'unused' is assigned a value but never used  no-unused-vars

✖ 1 problem (0 errors, 1 warning)
ESLint found too many warnings (maximum: 0).

husky - pre-commit script failed (code 1)
```

And here’s what it looks like in your terminal—with colours that make it even easier to spot what went wrong:

![Terminal output showing ESLint blocking commit due to unused variable warning](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/71c829a6-292a-474d-f830-8f7f244be300/orig =1642x1238)

### Debugging lint-staged issues

When lint-staged doesn't behave as expected, you can debug it by running it with verbose output:

```command
npx lint-staged --verbose
```


You can also test your configuration without making a commit:

```command
npx lint-staged --debug
```

For even more detailed debugging, set the debug environment variable:

```command
DEBUG=lint-staged* npx lint-staged
```

```text
[output]
  lint-staged:bin Running lint-staged@15.0.2 +0ms
  lint-staged Loaded config from .lintstagedrc.json +0ms
  lint-staged:cfg Normalized config to: +1ms
  lint-staged:cfg {
  lint-staged:cfg   '*.{js,jsx,ts,tsx}': [ 'eslint --fix --max-warnings=0', 'prettier --write' ],
  lint-staged:cfg   '*.{json,css,md}': [ 'prettier --write' ]
  lint-staged:cfg } +0ms
```

This detailed output shows you exactly which files are being processed and which commands are being executed, helping you troubleshoot configuration issues.


## Final thoughts 
Adding Husky and lint-staged to your project helps catch issues early and keeps your codebase clean. It’s a quick win for both solo developers and teams.

The setup runs fast, only checks staged files, and often fixes problems for you. It encourages consistent code without getting in the way.

To learn more or explore advanced options, check out the official docs:

* [Husky documentation](https://typicode.github.io/husky)
* [lint-staged documentation](https://github.com/okonet/lint-staged)

Thanks for reading, and happy committing!