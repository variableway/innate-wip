# Varlock: schema-driven, type-safe environment variable management

[Varlock](https://varlock.dev/) is an open-source tool that **replaces the `.env` file with a schema-first approach to environment variable management**. Instead of storing secrets as plaintext on disk, it defines the shape and rules of configuration in a `.env.schema` file that is safe to commit to version control, then resolves actual values at runtime, either from defaults or from external secret managers like 1Password, AWS Secrets Manager, or Azure Key Vault.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/nxH-BrsCPTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



## Problems with traditional `.env` files

The standard `.env` workflow has several well-known failure modes. New developers cloning a repository need to track down a copy of the file, typically over a chat message or email, because the file is excluded from version control. An `.env.example` file helps, but it's a manually maintained document that frequently falls out of sync with what the application actually needs.

More critically, `.env` files store API keys, database credentials, and tokens as plaintext on disk. A single accidental `git add` can expose secrets in the repository's history. A compromised developer machine gives an attacker direct access to every secret in every project.

A newer concern is AI coding assistants. Tools like GitHub Copilot and Cursor read open files for context. A `.env` file open in the editor is visible to these tools, and its contents can end up in suggestions, logs, or training data. Varlock addresses this by design: the `.env.schema` file that developers work with directly contains no sensitive values.

## The `.env.schema` file

The `.env.schema` file is the single source of truth for a project's configuration. It defines variable names, types, defaults, and validation rules using a DSL called `@env-spec`, which extends standard `.env` syntax with special decorator comments.

Because it contains no secrets, `.env.schema` is committed to version control. Developers cloning a repository immediately have a complete, authoritative description of what configuration the application requires.

## Installation and initialization

Install Varlock as a development dependency:

```command
npm install -D varlock
```

Initialize it in the project root:

```command
npx varlock init
```

This scans for any existing `.env` or `.env.example` files and generates an initial `.env.schema`. If neither is found, it creates an empty schema file.

## Defining variables and using decorators

A basic variable definition looks identical to a standard `.env` entry:

```text
[label .env.schema]
APP_ENV=testing
```

Running `varlock load` against this schema produces:

```text
[output]
✅ APP_ENV* 🔒sensitive
   [hidden]
```

Varlock treats every variable as sensitive by default. The value is hidden even though it appears plainly in the schema file. This "secure by default" behavior prevents accidental exposure when running validation commands.

### Root decorators

Root decorators appear at the top of the file and apply globally. The `@defaultSensitive=false` decorator changes the default so variables are visible unless explicitly marked sensitive. The `# ---` line conventionally separates the decorator block from variable definitions.

```text
[label .env.schema]
# @defaultSensitive=false
# ---

APP_ENV=testing
```

Running `varlock load` now shows the value:

```text
[output]
✅ APP_ENV*
   "testing"
```

### Item decorators

Item decorators apply to the variable immediately below them. They add type enforcement, required validation, and sensitivity flags:

```text
[label .env.schema]
# @type=string @required @sensitive
APP_ENV=testing

# @type=port
PORT=3002
```

`@type=string` enforces that the value is a string. `@required` ensures the variable has a value. `@sensitive` overrides the global `@defaultSensitive=false` for this variable. `@type=port` validates that the value is a valid network port number.

### Type validation

If a variable's value does not match its declared type, `varlock load` produces an immediate error rather than letting the mismatch surface at runtime:

![Terminal output showing a validation error: "Configuration is currently invalid" with the message "Unable to coerce string to number" for the APP_ENV variable](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/14538328-991a-4030-a076-d8b66a0b4a00/lg1x =1920x1080)

```text
[output]
🚨🚨🚨 Configuration is currently invalid 🚨🚨🚨

Invalid items:

🔴 APP_ENV*
   undefined < coerced from "testing"
   - Unable to coerce string to number

💥 Resolved config/env did not pass validation 💥
```

This catches misconfigurations during development rather than in production.

## Runtime injection with `varlock run`

`varlock run` wraps any command, resolves all variables from `.env.schema`, and injects them as standard environment variables into the spawned process. The application reads them through normal means like `process.env.PORT` and has no dependency on Varlock itself.

```command
npx varlock run -- vite
```

Varlock resolves `PORT` from the schema and injects it before Vite starts:

![Terminal output showing the Vite development server started and listening on http://localhost:3002, the port specified in the schema](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b21190f4-6f3b-4a78-13e4-f509f1628400/md1x =1920x1080)

```text
[output]
VITE v7.3.1 ready in 326 ms

  ➜  Local:   http://localhost:3002/
  ➜  Network: http://192.168.5.184:3002/
```

The `--` separator distinguishes Varlock's own arguments from the arguments of the command being wrapped.

## Integrating with secret managers

Fetching secrets from an external manager at runtime eliminates plaintext values from the local filesystem entirely. The 1Password integration illustrates how this works across all supported providers.

### 1Password setup

Create a service account in your 1Password account and grant it access only to the specific vault containing the secrets this project needs, not to personal or other sensitive vaults. The service account token is what Varlock uses to authenticate.

Install the 1Password plugin:

```command
npm install -D @varlock/1password-plugin
```

### Configuring the plugin in `.env.schema`

![The .env.schema file showing the complete configuration for the 1Password plugin including the @plugin, @initOp, and OP_TOKEN variable with its special type](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b71e198d-24f1-40b7-3391-25b2eaa21e00/orig =1920x1080)

```text
[label .env.schema]
# @defaultSensitive=false
# @plugin(@varlock/1password-plugin)
# @initOp(token=$OP_TOKEN)
# ---

# @type=opServiceAccountToken
OP_TOKEN=op://...[service account token]...
```

`@plugin(@varlock/1password-plugin)` loads the plugin. `@initOp(token=$OP_TOKEN)` initializes it using the value of `OP_TOKEN`, referenced with `$` syntax. `@type=opServiceAccountToken` is a type provided by the plugin that marks the token as sensitive and validates its format.

### Fetching a secret

With the plugin configured, secrets are referenced using a URI function call syntax. For a secret stored in a vault named "Test", in an item named "openai", with a field named "credential":

```text
[label .env.schema]
# @sensitive
OPENAI_API_KEY=op(op://Test/openai/credential)
```

Running `varlock load` fetches the value from 1Password and confirms it resolved correctly:

![Terminal output from varlock load showing OPENAI_API_KEY has been successfully resolved with its sensitive value fetched from 1Password and hidden](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa8095c0-7925-4ec0-b810-06a02229bb00/lg2x =1920x1080)

```text
[output]
✅ OPENAI_API_KEY* 🔒sensitive
   sk-********************
```

The actual key value never exists on disk. It is fetched at runtime and injected directly into the process environment.

## Additional features

![Grid of logos showing Varlock's supported plugins including 1Password and AWS, integrations including Next.js and Vite, and language support for TypeScript, JavaScript, Python, and Go](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3acca9c3-8d79-41a3-039a-70a9992ba100/public =1920x1080)

**Automatic type generation:** The `@generateTypes(lang=ts, path='./env.d.ts')` root decorator generates a TypeScript declaration file from the schema, providing autocompletion and type safety for `process.env` across the codebase.

**Runtime leak prevention:** The `@redactLogs` and `@preventLeaks` decorators automatically redact sensitive values from `console.log` output and scan outgoing HTTP responses for secrets.

**Modular configuration:** The `@import` decorator splits configuration across multiple schema files. Imports can be conditional based on the current environment, which is useful for separating base configuration from environment-specific overrides.

**Ecosystem tooling:** An official VS Code extension provides syntax highlighting and autocompletion for `@env-spec`. A GitHub Actions integration validates the schema on every push, catching missing or invalid configuration before it reaches production.

## Practical considerations

Fetching secrets from cloud providers requires an internet connection. Offline development needs a fallback strategy, typically a separate local schema file with safe placeholder values.

There is a small startup latency when Varlock makes network requests to resolve secrets. For most applications this is a few seconds and only occurs at process start, but it is a tradeoff worth accounting for in time-sensitive startup paths.

Varlock injects variables into the process environment, but variables already set in the shell environment may take precedence depending on the operating system and how the process is launched. Keeping the local shell free of project-specific variables and letting Varlock manage them entirely avoids precedence conflicts.

## Final thoughts

**Varlock's `@env-spec` DSL is the key design decision that makes its approach work**. By making the schema safe to commit, it solves the onboarding and synchronization problems of traditional `.env` files without requiring a shared secrets database or manual documentation. The secret manager integrations go further, removing plaintext values from local development entirely.

The tool is most valuable on projects where **multiple developers share configuration, secrets rotate regularly, or compliance requirements mandate that credentials** never touch developer machines. The [Varlock documentation](https://varlock.dev/docs) covers the full decorator reference and all supported provider integrations.