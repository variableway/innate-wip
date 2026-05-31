# Getting Started with PNPM

PNPM is a package manager that optimizes dependency management and reduces disk usage with a symlink-based approach, eliminating duplication. It's commonly used by frameworks like Vue and Svelte.  

Unlike traditional managers, PNPM stores each package version once and links it as needed, preventing redundancy. It supports workspaces, strict dependency checks, fast installs, and it remains compatible with the npm registry.  

This guide covers how to use PNPM for faster, more reliable workflows while avoiding common dependency issues.

## Prerequisites

Before proceeding with the rest of this article, ensure you have a recent version of [Node.js](https://nodejs.org/en/download/) (version 22.x or later) installed locally on your machine. This article also assumes you are familiar with the basic concepts of [package management in Node.js](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager).

## Getting started with PNPM

To get the most out of this tutorial, create a new Node.js project to try out the concepts we will be discussing. 

Start by installing PNPM globally using npm:

```command
npm install -g pnpm@latest-10
```

Alternatively, you can install PNPM using other methods as described in the [official documentation](https://pnpm.io/installation).

Once installed, verify that PNPM is correctly set up by checking its version:

```command
pnpm --version
```
```text
[output]
10.6.4
```

Now, let's initialize a new project using PNPM:

```command
mkdir pnpm-demo && cd pnpm-demo
```

```command
pnpm init
```

This will create a basic `package.json` file in your project directory.

```json
[label package.json]
{
  "name": "pnpm-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.6.4"
}
```

Let's now add a simple dependency to see PNPM in action:

```command
pnpm add express
```

```text
[output]
Packages: +69
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 69, reused 0, downloaded 69, added 69, done

dependencies:
+ express 4.21.2

Done in 8.3s using pnpm v10.6.4
```

After running this command, you'll notice that PNPM creates a `node_modules` directory.

Let's create a simple Express application to test our setup:

```javascript
[label index.js]
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from PNPM!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Run the application:

```command
node index.js
```

When you visit http://localhost:3000 in your browser, you should see "Hello from PNPM!" displayed:

![Screenshot of the Node app output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e799d234-dea6-4bfb-63df-9dc3e062f700/lg1x =3208x1954)


Now stop the server and use `Ctrl + C` in the terminal.

## Understanding PNPM's node modules structure

After setting up a basic project with PNPM, it's worth taking a deeper look at how PNPM organizes dependencies - one of its most innovative features. 

Unlike npm or Yarn, which create flat dependency trees (often leading to "dependency hell"), PNPM creates a nested structure that more accurately represents the dependency relationships.

Let's examine the structure of our project's `node_modules` directory more thoroughly:

```command
find node_modules -type l | head -10
```

```text
[output]
node_modules/.pnpm/accepts@1.3.8/node_modules/mime-types
node_modules/.pnpm/accepts@1.3.8/node_modules/negotiator
node_modules/.pnpm/finalhandler@1.3.1/node_modules/encodeurl
node_modules/.pnpm/finalhandler@1.3.1/node_modules/unpipe
node_modules/.pnpm/finalhandler@1.3.1/node_modules/escape-html
node_modules/.pnpm/finalhandler@1.3.1/node_modules/statuses
node_modules/.pnpm/finalhandler@1.3.1/node_modules/parseurl
node_modules/.pnpm/finalhandler@1.3.1/node_modules/on-finished
node_modules/.pnpm/finalhandler@1.3.1/node_modules/debug
node_modules/.pnpm/side-channel-list@1.0.0/node_modules/es-errors
```

What we're seeing here are the symlinks for the nested dependencies. Notice how each package has its own isolated dependencies - for example, `accepts@1.3.8` has its own `mime-types` and `negotiator` modules, while `finalhandler@1.3.1` has its own set of dependencies like `encodeurl` and `unpipe`. This demonstrates how PNPM creates a true hierarchical node_modules structure that accurately reflects the dependency tree.

Interestingly, we don't see Express in this list because we're only viewing the first 10 symlinks, which happen to be deeper nested dependencies. Let's look specifically for our main dependency:

```command
ls -la node_modules/express
```

```text
[output]
... express -> .pnpm/express@4.21.2/node_modules/express
```

This output shows that the `express` module in your root `node_modules` directory is actually a symlink that points to the actual package stored in `.pnpm/express@4.21.2/node_modules/express`. This is a key aspect of how PNPM organizes dependencies.

The key aspects of this structure include:

- **Content-addressable storage**: All packages are organized by name and version in a `.pnpm` directory. For example, Express is stored at `.pnpm/express@4.21.2/node_modules/express`, with the version number directly in the path.

- **Symlinks for direct dependencies**: Packages your project depends on (like express) appear at the root of `node_modules` as symlinks pointing to their location in the `.pnpm` directory.

- **Nested dependencies**: Each package's dependencies are nested under its own `node_modules` directory, maintaining a clear dependency tree.


### Preventing phantom dependencies

One of the most significant advantages of PNPM's approach is preventing "phantom dependencies" - a common issue where a package can access dependencies it hasn't explicitly declared in its own `package.json`.

To demonstrate this important difference between npm and PNPM, let's run a simple experiment:

First, exit your current directory and create a new project with npm to show the problem:

```command
cd ..
```
```command
mkdir npm-phantom-test && cd npm-phantom-test
```
```command
npm init -y
```

Install express with npm (which will include many dependencies):

```command
npm install express
```

Create a file that tries to use a dependency that Express uses but you haven't directly installed:

```javascript
[label phantom-npm.js]
// With npm, this might work even though we didn't install mime-types
try {
  const mime = require('mime-types');
  console.log('Successfully loaded mime-types:', mime.lookup('json'));
} catch (e) {
  console.error('Failed to load mime-types:', e.message);
}
```

Run it with npm's node_modules:

```command
node phantom-npm.js
```

```text
[output]
Successfully loaded mime-types: application/json
```

Notice that the script works with npm even though you never explicitly installed mime-types! This is because of npm's flat node_modules structure, which makes all nested dependencies accessible.

Now return to your PNPM project and try the same test:

```command
cd ../pnpm-demo
```

Create a test file in the PNPM project:

```javascript
[label phantom.js]
// With PNPM, this should fail because we didn't install mime-types
try {
  const mime = require('mime-types');
  console.log('Successfully loaded mime-types:', mime.lookup('json'));
} catch (e) {
  console.error('Failed to load mime-types:', e.message);
}
```

Run it with PNPM's node_modules structure:

```command
node phantom.js
```

```text
[output]
Failed to load mime-types: Cannot find module 'mime-types'
Require stack:
- /Users/username/pnpm-demo/phantom.js
```

With PNPM, the script fails because it can't access dependencies that weren't explicitly declared in your project's `package.json, even though Express uses mime-types.

This strict dependency checking helps prevent "it works on my machine" issues and makes your applications more reliable by ensuring all dependencies are correctly declared. If you want to use mime-types with PNPM, you need to add it explicitly:

```command
pnpm add mime-types
```

After installing it properly, the script will work as expected:

```command
node phantom.js
```

```text
[output]
Successfully loaded mime-types: application/json
```
Now your dependencies are correctly stated in your `package.json`, making your project more maintainable and predictable.


To better understand your project's dependencies, you can use PNPM to generate a dependency graph:

```command
pnpm why express
```

```text
[output]
Legend: production dependency, optional only, dev only

pnpm-demo@1.0.0 /Users/username/pnpm-demo

dependencies:
express 4.21.2
```

This tool helps untangle dependency relationships and identify potential issues for more complex projects.

Now that you understand PNPM's unique approach to dependency management, you explore some everyday operations for managing packages in your project.


## Managing dependencies with PNPM

Now that we understand PNPM's unique approach to dependency management, let's explore common operations for managing packages in your project. PNPM provides familiar commands that mirror npm's functionality while adding some powerful enhancements.

### Installing dependencies

To add a new dependency to your project, you use the `add` command:

```command
pnpm add lodash
```

```text
[output]
Packages: +1
+
Progress: resolved 70, reused 69, downloaded 1, added 1, done

dependencies:
+ lodash 4.17.21

Done in 2.1s using pnpm v10.6.4
```

This will add the `lodash` package to your project and update your `package.json` file accordingly.

To add a development dependency, use the `-D` flag:

```command
pnpm add -D jest
```

```text
[output]
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 331, reused 70, downloaded 261, added 261, done

devDependencies:
+ jest 29.7.0

Done in 23.6s using pnpm v10.6.4
```

You can also install a specific version of a package:

```command
pnpm add react@17.0.2
```

### Installing all dependencies

If you've just cloned a project that uses PNPM, you can install all dependencies defined in the `package.json` file:

```command
pnpm install
```

This command is also aliased as `pnpm i` for convenience.

### Updating dependencies

To check for outdated packages:

```command
pnpm outdated
```

To update all dependencies according to your version constraints in `package.json`:

```command
pnpm update
```

To update a specific package:

```command
pnpm update lodash
```

To update a package to the latest version, ignoring version constraints:

```command
pnpm update lodash --latest
```

### Removing dependencies

To remove a package:

```command
pnpm remove lodash
```

```text
[output]
Packages: -1
-
Progress: resolved 330, reused 330, downloaded 0, added 0, done

dependencies:
- lodash 4.17.21

Done in 526ms using pnpm v10.6.4
```

### Script execution

Like npm, PNPM allows you to define scripts in your `package.json` file:

```json
{
  ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  }
}
```

To run a script:

```command
pnpm start
```

PNPM also supports several shorthand notations:

```command
pnpm run test 
```
```command
pnpm test
```

To pass arguments to scripts, use double dashes:

```command
pnpm test -- --watch
```

### Listing installed packages

To see all installed packages:

```command
pnpm list
```

For a more concise view showing only your direct dependencies:

```command
pnpm list --depth=0
```

### Auditing dependencies for security issues

To check your dependencies for known security vulnerabilities:

```command
pnpm audit
```

To automatically fix issues when possible:

```command
pnpm audit fix
```

## Working with lockfiles

PNPM generates a `pnpm-lock.yaml` file that records the exact version of each dependency installed in your project. This ensures that everyone working on the project gets exactly the same dependency versions.


The `pnpm-lock.yaml` file is automatically created and updated when you install or update dependencies. It contains:

- A record of all installed packages
- Their exact versions
- Integrity checksums to verify package content
- Dependencies of each package


Always commit the `pnpm-lock.yaml` file to your version control system. This ensures that:

1. All developers work with the same dependency versions
2. CI/CD builds are reproducible
3. Production deployments use the exact dependencies you tested against

To install dependencies exactly as specified in the lock file:

```command
pnpm install --frozen-lockfile
```

This is particularly useful in CI/CD environments to ensure build consistency.

## Optimizing your PNPM workflow

You can create a `.npmrc` file in your project to configure PNPM behavior:

```ini
[label .npmrc]
# Save exact versions in package.json
save-exact=true

# Prefer offline mode to speed up installations
prefer-offline=true

# Enable strict mode to prevent installing packages with incorrect peer dependencies
strict-peer-dependencies=true
```

### Using shorter commands

PNPM commands can become tedious to type repeatedly. You can create an alias by adding the following to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
[.bashrc]
....
alias pn=pnpm
```

Now you can use shorter commands like:

```command
pn add lodash
```
```command
pn dev
```

This minor productivity enhancement can save you many keystrokes throughout your development workflow.

## Final thoughts
In this article, we've explored how PNPM addresses common pain points in JavaScript dependency management. Its innovative symlink-based approach provides true dependency isolation, preventing phantom dependencies while maintaining compatibility with the npm ecosystem.

As JavaScript projects continue to grow in complexity, adopting a package manager like PNPM can help ensure your dependency management scales with your project's needs. Consider exploring PNPM's more advanced features like [workspaces](https://pnpm.io/workspaces).