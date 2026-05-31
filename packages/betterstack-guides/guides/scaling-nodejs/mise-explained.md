# Getting Started with Mise

Development environments grow complex as projects multiply and technology stacks diversify. Your Go API needs Go 1.21, your legacy Rails app requires Ruby 2.7, and your infrastructure scripts depend on Terraform 1.5. Managing these versions alongside environment variables, project-specific configurations, and tool dependencies creates layers of complexity that distract from actual development work.

[Mise](https://mise.jdx.dev/) addresses these challenges through a fast, Rust-built tool that combines version management, environment variable handling, and task running in a single interface. Originally known as rtx, Mise reimagines development environment management by prioritizing speed and developer experience while maintaining compatibility with existing tool ecosystems.

This tutorial explores Mise installation, its core capabilities, and effective workflows for managing development environments across multiple projects.

## Prerequisites

You'll need a Unix-based system (Linux or macOS) to follow this tutorial's examples. Windows users can install Mise natively using [Scoop](https://scoop.sh/), [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/), or [Chocolatey](https://chocolatey.org/), though the command examples here use Unix-style paths and shells. Basic command-line familiarity helps you follow along, though we'll explain each step clearly.

Mise handles runtime installation independently, so you don't need languages pre-installed. The tool downloads and configures everything through its built-in functionality.

## What distinguishes Mise?

<iframe width="100%" height="315" src="https://www.youtube.com/embed/eKJCnc0t8V0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Understanding what makes Mise different from alternatives helps clarify when and why to use it. The tool combines several development workflow concerns into a unified system.

Most version managers focus solely on switching between runtime versions. Mise takes a broader view by managing not just versions but also environment variables, project tasks, and tool configurations. This integration means fewer separate tools competing for control over your shell environment.

Performance sets Mise apart technically. Written in Rust rather than shell scripts, Mise operates significantly faster than tools like asdf or rbenv. Where traditional version managers might add noticeable latency to shell startup, Mise keeps overhead minimal even with dozens of tools configured.

Mise maintains compatibility with existing ecosystems rather than forcing migration. It reads `.tool-versions` files from asdf, `.node-version` files from nvm, `.ruby-version` files from rbenv, and other legacy formats. This compatibility lets you adopt Mise incrementally without converting entire codebases immediately.

The tool also provides features beyond version management. Built-in task running replaces simple Makefiles or npm scripts. Environment variable management through `.mise.toml` eliminates the need for separate dotenv tools. Configuration profiles let you maintain different settings for development, staging, and production contexts.

Mise plugins work differently from asdf plugins. While asdf relies on bash scripts for each plugin, Mise builds common language support directly into its core, using plugins only for less common tools. This architectural decision improves reliability and installation speed for mainstream languages.

## Installing Mise

Installing Mise involves downloading the binary and configuring your shell to activate it. The process varies slightly by operating system but remains straightforward.

The quickest installation method uses the official install script:

```command
curl https://mise.run | sh
```

This downloads the appropriate Mise binary for your system and places it in `~/.local/bin/`. The script handles architecture detection automatically.

Configure your shell to activate Mise. For bash, add this to `~/.bashrc`:

```command
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
```

For zsh, add it to `~/.zshrc`:

```command
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
```

The activation command sets up shell integration that enables automatic version switching and environment configuration.

Restart your terminal or source your shell configuration:

```command
source ~/.bashrc
```

Verify Mise installed correctly:

```command
mise --version
```

```text
[output]
2025.10.0 linux-x64 (2025-10-01)
```

This confirms Mise is installed and ready to use. The version number reflects Mise's calendar-based versioning scheme.


## Installing and using tools

Mise provides a streamlined interface for installing runtimes and tools. The commands stay consistent regardless of which tool you're installing.

List available versions for a tool:

```command
mise ls-remote node
```

This displays Node.js versions available for installation. The list includes stable releases, LTS versions, and nightly builds. Output can be lengthy, so filtering helps:

```command
mise ls-remote node | grep "^22"
```

Install a specific version:

```command
mise install node@22.20.0
```

```text
[output]
gpg: Signature made Wed Sep 24 13:11:16 2025 UTC
gpg:                using RSA key C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C
gpg: Good signature from "Richard Lau <rlau@redhat.com>" [unknown]
```

Mise downloads and installs Node.js 22.20.0. Installation typically completes faster than alternatives because Mise uses pre-compiled binaries when available rather than compiling from source.

Install multiple tools at once:

```command
mise install node@24 ruby@3.4 python@3.13
```

Mise processes installations in parallel when possible, speeding up initial environment setup.

List installed tools:

```command
mise list
```

```text
[output]
Tool    Version           Source            Requested
node    22.20.0           ~/.tool-versions  22.20.0
node    24.9.0
python  3.13.7
ruby    3.4.6             ~/.tool-versions  3.4.6
```

The output shows which versions you've installed locally. None are active yet because you haven't configured any versions to use.

Remove versions you no longer need:

```command
mise uninstall node@22.20.0
```

This deletes the installation directory and frees disk space.

Mise also supports installing tools from other sources beyond its built-in backends. You can install tools via cargo, npm, or custom scripts, though we'll focus on standard version management here.



## Configuring tool versions

After installing versions, you need to specify which versions to use. Mise provides both global and local configuration, with local settings taking precedence.

Set a global version for everyday use:

```command
mise use --global node@24
```

This writes to `~/.config/mise/config.toml` and makes Node.js 24.9.0 your default across all projects.

Verify the version is active:

```command
node --version
```

```text
[output]
v24.9.0
```

Set multiple global versions:

```command
mise use --global ruby@3.4 python@3.13
```

For project-specific versions, navigate to your project and configure locally:

```command
mkdir node-app && cd node-app
```
```command
mise use node@22
```

This creates a `.mise.toml` file in your project directory:

```command
cat .mise.toml
```

```text
[output]
[tools]
node = "22"
```

The `.mise.toml` file should be committed to version control. Team members with Mise will automatically use the correct versions when they work in this directory.

Add additional tools to the configuration:

```command
mise use python@3.13
```

The `.mise.toml` file now specifies multiple tools:

```toml
[tools]
[tools]
node = "22"
python = "3.13"
```

Test automatic version switching by moving between directories:

```command
cd ..
```
```command
node --version
```

```text
[output]
v24.9.0
```

```command
cd node-app
```
```command
node --version
```

```text
[output]
v22.20.0
```

Mise switches versions automatically based on `.mise.toml` files it encounters as you navigate your filesystem.

## Managing environment variables

Beyond version management, Mise handles environment variables through the same configuration files. This integration eliminates the need for separate dotenv tools or shell scripts.

Add environment variables to your project configuration. You're still in the `node-app` directory, so edit the existing `.mise.toml`:

```toml
[tools]
node = "22"
python = "3.13"

[highlight]
[env]
DATABASE_URL = "postgresql://localhost/myapp_dev"
API_KEY = "dev-key-123"
LOG_LEVEL = "debug"
[/highlight]
```

Environment variables defined here become available automatically when you're in this directory:

```command
echo $DATABASE_URL
```

```text
[output]
postgresql://localhost/myapp_dev
```

Mise sets these variables when you cd into the directory and unsets them when you leave. This scoping prevents environment pollution where variables from one project leak into another.

Use templates for dynamic values:

```toml
[env]
PROJECT_ROOT = "{{ config_root }}"
DATA_DIR = "{{ config_root }}/data"
```

Mise provides several template variables like `config_root` (the directory containing `.mise.toml`) and `home` (your home directory). These templates make configurations portable across different machines.

For sensitive values, use `.mise.local.toml` instead:

```toml
[env]
API_SECRET = "actual-secret-key"
DATABASE_PASSWORD = "sensitive-password"
```

Add `.mise.local.toml` to `.gitignore` to keep secrets out of version control. Mise reads both files and merges their configurations, with `.mise.local.toml` taking precedence.

You can also load environment variables from external files:

```toml
[env]
_.file = ".env"
```

This loads variables from a `.env` file in the dotenv format, maintaining compatibility with existing dotenv workflows.

## Running tasks with Mise

Mise includes a task runner that replaces simple Makefiles or package.json scripts. Tasks live in your `.mise.toml` file alongside tool and environment configuration.

Define tasks in your project configuration. Still in the `node-app` directory, update `.mise.toml`:

```toml
[tools]
node = "22"
python = "3.13"

[env]
DATABASE_URL = "postgresql://localhost/myapp_dev"
API_KEY = "dev-key-123"
LOG_LEVEL = "debug"

[highlight]
[tasks.hello]
run = "echo 'Hello from Mise!'"
description = "Simple greeting task"

[tasks.versions]
run = "node --version && python --version"
description = "Display tool versions"

[tasks.check-env]
run = "echo $DATABASE_URL"
description = "Verify environment variables"
[/highlight]
```

List available tasks:

```command
mise tasks
```

```text
[output]
Name       Description
check-env  Verify environment variables
hello      Simple greeting task
versions   Display tool versions
```

Run a task:

```command
mise run hello
```

```text
[output]
[hello] $ echo 'Hello from Mise!'
Hello from Mise!
```

Tasks run in the context of your configured tools and environment variables. This ensures consistency between development and CI environments.

Check that environment variables are available:

```command
mise run check-env
```

```text
[output]
check-env] $ echo $DATABASE_URL
postgresql://localhost/myapp_dev
```

### Task dependencies and advanced features

Beyond simple commands, tasks support dependencies and additional properties. Here are examples showing common patterns you'd use in real projects:

Tasks can depend on other tasks:

```toml
[tasks.test]
run = "npm test"
depends = ["build"]

[tasks.build]
run = "npm run build"
```

When you run mise run test, Mise automatically executes build first.

Multi-line commands use triple-quote syntax:

```toml
[tasks.deploy]
run = """
npm run build
rsync -av dist/ server:/var/www/
"""
description = "Build and deploy to production"
dir = "{{config_root}}"
```

The dir property controls where the task executes. These examples show features you'd adapt to your specific workflow when working with real projects.

## Final thoughts
This guide covered Mise's integrated approach to development environment management. You've seen how to install and configure Mise, manage multiple tool versions across projects, handle environment variables through `.mise.toml` files, and automate common tasks within your development workflow.

Mise simplifies environment management by consolidating functionality that typically requires multiple tools. Its Rust-based implementation provides speed advantages while maintaining compatibility with existing version management ecosystems through support for legacy configuration files.

The declarative configuration in `.mise.toml` serves as executable documentation that travels with your project, making team onboarding straightforward and ensuring everyone works with identical tool versions and environment settings.

For detailed information and advanced configuration options, explore the [official Mise documentation](https://mise.jdx.dev/). The site includes comprehensive guides on backends, task configuration, and integration with CI/CD systems.

Thanks for reading!