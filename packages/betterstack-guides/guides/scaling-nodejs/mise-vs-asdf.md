# Mise vs asdf: Which Version Manager Should You Choose?

Managing different language versions across projects gets messy fast. One project needs Node 18, another requires Node 16, and that legacy app still runs on Node 14. Version managers promise to solve this chaos, but mise and asdf take completely different approaches to the same problem.

asdf pioneered the unified version manager concept. It handles multiple languages through a plugin system, giving you one tool for Node, Ruby, Python, and dozens of other runtimes. Each plugin follows asdf's conventions, creating a consistent experience across all your tools.

mise started as asdf's spiritual successor but diverged into something different. It matches asdf's core functionality while adding environment variable management, task running, and built-in support for popular languages. The tool aims to replace not just asdf, but also direnv and make.

Choosing between them means deciding what you value more: asdf's focused, stable approach to version management, or mise's expanding feature set that handles more of your development workflow. Let's look at how they actually work in practice.

## What is asdf?

![Screenshot of asdf Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6a3034a2-9964-4804-061e-5cb0b0e21600/lg2x =1200x600)

[asdf](https://betterstack.com/community/guides/scaling-ruby/asdf-explained/) is a version manager that handles multiple programming languages through a plugin architecture. Created in 2014 to replace separate version managers like rbenv, nvm, and pyenv, asdf gives you one tool that works the same way for every language.

The plugin system forms the core of asdf. When you need a new language, you install its plugin, then use the same commands you already know. Each plugin maintainer handles language-specific installation details while asdf provides the consistent interface.

asdf reads `.tool-versions` files in your project directories. When you enter a folder, asdf automatically switches to the versions specified in that file. This approach keeps different projects isolated without manual intervention.

## What is mise?

<iframe width="100%" height="315" src="https://www.youtube.com/embed/eKJCnc0t8V0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[mise](https://betterstack.com/community/guides/scaling-nodejs/mise-explained/) is a version manager that started as a Rust rewrite of asdf but evolved into a broader development tool. Created by Jeff Dickey in 2022, mise handles version management while also managing environment variables and running project tasks.

The tool maintains compatibility with asdf's plugin ecosystem. You can use most asdf plugins with mise, getting access to hundreds of languages and tools without starting from scratch. mise also includes built-in support for major languages, eliminating plugins entirely for common cases.

mise goes beyond version switching. It replaces direnv for environment variable management and provides a task runner for common project commands. This consolidation means fewer tools to install and configure in your development environment.

## mise vs asdf: quick comparison

| Feature | mise | asdf |
|---------|------|------|
| Installation method | Single binary, package managers | Git clone, shell sourcing |
| Plugin compatibility | Uses asdf plugins | Native plugin system |
| Built-in languages | Node, Python, Ruby, others | Requires plugins for everything |
| Environment variables | Native support (replaces direnv) | Requires separate tools |
| Task runner | Built-in task system | None, use make or similar |
| Configuration files | Multiple formats (.mise.toml, .tool-versions) | .tool-versions only |
| Shell integration | Automatic activation | Manual shell configuration |
| Legacy project support | Reads .tool-versions files | Native format |
| Community size | Growing, newer project | Large, established community |
| Breaking changes | More frequent updates | Stable, careful changes |
| Implementation | Rust | Go (as of v0.16.0) |

## Installation and initial setup

I tried both tools on a fresh development machine to see how quickly I could get started. The installation experience revealed a lot about each tool's design priorities.

asdf requires shell integration during setup:

```bash
# Clone the repository
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.16.1

# Add to your shell (bash example)
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# Restart your shell
exec $SHELL
```

You need to add asdf to your shell's configuration file, then restart your terminal. This integration lets asdf intercept commands and switch versions automatically. The manual setup feels a bit dated, but it works reliably once configured.

mise installs as a standalone binary:

```bash
# Using Homebrew
brew install mise

# Or download directly
curl https://mise.run | sh

# Activate (happens automatically on most shells)
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
```

mise's activation step happens with a single command that you add to your shell config. The single binary approach means faster startup times and simpler updates through your package manager.

## Managing your first language

After getting both tools installed, I wanted to see how the actual version management worked. I needed to set up Node for a new project.

asdf requires installing a plugin first:

```bash
# Install the Node plugin
asdf plugin add nodejs

# List available versions
asdf list all nodejs

# Install a specific version
asdf install nodejs 20.10.0

# Set it globally
asdf global nodejs 20.10.0

# Or set it for a specific project
cd my-project
asdf local nodejs 20.10.0
```

Every language starts with a plugin installation. This two-step process (plugin, then language) feels repetitive when you're setting up multiple languages, but it keeps asdf's core minimal. The `list all` command can be slow because it queries the upstream source each time.

mise streamlines the common cases:

```bash
# Install Node directly (no plugin needed)
mise use --global node@20.10.0

# Or for the current project
mise use node@20.10.0

# Install and set in one command
cd my-project
mise use node@20.10.0 python@3.11
```

mise includes popular languages like Node, Python, and Ruby directly. You skip the plugin step entirely for these common tools. The `use` command installs and activates versions in one go, making the initial setup faster.

## Configuration file formats

That simplified `mise use` command compared to asdf's multi-step plugin installation got me wondering about how each tool stored these settings. I opened up the project files to see what was actually happening behind the scenes.

asdf uses a simple, universal format:

```
[label .tool-versions]
nodejs 20.10.0
ruby 3.2.2
python 3.11.0
terraform 1.6.0
```

The `.tool-versions` file lists each tool with its version on a single line. This format works everywhere asdf works and never changes. Other tools can easily parse it, and you can edit it by hand without consulting documentation.

mise supports multiple configuration formats:

```toml
[label .mise.toml]
[tools]
node = "20.10.0"
ruby = "3.2.2"
python = "3.11.0"

[env]
DATABASE_URL = "postgresql://localhost/myapp"
API_KEY = { file = ".env.local", key = "API_KEY" }

[tasks.test]
run = "npm test"

[tasks.dev]
run = "npm run dev"
depends = ["install"]
```

mise's TOML format includes environment variables and task definitions alongside version specifications. This consolidation keeps related configuration together, but it means learning a new format. mise also reads `.tool-versions` files for compatibility with asdf and projects that use that format.

## Switching between versions

Those configuration files showed me that mise wanted to do more than just version management, but I still needed to see how the core functionality compared. I set up a few projects with different Node versions to test the switching behavior.

asdf switches versions automatically when you change directories:

```bash
# Project A uses Node 18
$ cd ~/projects/legacy-app
$ node --version
v18.19.0

# Project B uses Node 20
$ cd ~/projects/new-app
$ node --version
v20.10.0

# Check what's active
$ asdf current
nodejs          18.19.0         ~/projects/legacy-app/.tool-versions
ruby            3.2.2           ~/.tool-versions
```

asdf reads the `.tool-versions` file in each directory and activates those versions. The `current` command shows which versions are active and where they came from. This works reliably across different shell sessions.

mise provides the same automatic switching:

```bash
# Same automatic behavior
$ cd ~/projects/legacy-app
$ node --version
v18.19.0

# Check active versions
$ mise ls
Tool    Version  Config Source            Requested
node    18.19.0  ~/projects/legacy-app/.tool-versions  18
ruby    3.2.2    ~/.config/mise/config.toml            3.2
```

mise's version switching works identically to asdf since both tools use the same directory-scanning approach. The `ls` command provides more detailed output about where each version came from and what was originally requested versus what's installed.

## Environment variable management

The automatic directory switching worked well with both tools, but I kept thinking about that `.mise.toml` file with environment variables mixed in. I decided to test whether mise's expanded scope actually made development easier or just added complexity.

asdf doesn't handle environment variables directly:

```bash
# You need a separate tool like direnv
$ cat .envrc
export DATABASE_URL="postgresql://localhost/myapp"
export API_KEY="secret-key-here"
export NODE_ENV="development"

# With direnv configured
$ cd my-project
direnv: loading ~/my-project/.envrc
direnv: export +DATABASE_URL +API_KEY +NODE_ENV
```

You install direnv separately and create `.envrc` files for environment variables. This separation means maintaining two tools and two configuration files, but it keeps concerns separated cleanly.

mise manages environment variables natively:

```toml
# .mise.toml
[tools]
node = "20.10.0"

[env]
DATABASE_URL = "postgresql://localhost/myapp"
NODE_ENV = "development"
_.file = ".env"  # Load from .env file
_.path = "/usr/local/bin"  # Add to PATH

# Or use inline in .tool-versions
# mise env add API_KEY=secret
```

mise loads environment variables automatically when you enter the directory. You can define them inline, load them from files, or modify PATH. This consolidation means one less tool to install, though it couples version management with environment configuration.

## Running project tasks

Watching mise automatically load environment variables made me curious about its task runner. I had been using npm scripts and make files to run common commands, and I wanted to see if mise's task system could replace them.

asdf has no task running features:

```bash
# You use whatever task runner your project has
$ cat Makefile
test:
    npm test
    
dev:
    npm run dev
    
install:
    npm install

# Run with make
$ make test
```

You bring your own task runner: make, npm scripts, just, or whatever fits your project. asdf stays focused on version management and doesn't try to replace these tools.

mise includes a built-in task runner:

```toml
[label .mise.toml]
[tasks.install]
run = "npm install"

[tasks.dev]
run = "npm run dev"
depends = ["install"]

[tasks.test]
run = "npm test"
env = { NODE_ENV = "test" }

[tasks.deploy]
run = """
npm run build
aws s3 sync dist/ s3://my-bucket
"""
```

```bash
# List available tasks
$ mise tasks
Name     Description          Source
install  Install dependencies .mise.toml
dev      Start dev server     .mise.toml
test     Run tests           .mise.toml

# Run a task
$ mise run dev
$ mise run test
```

mise executes tasks with access to the project's environment variables and tool versions. You define tasks in the same file as your tool versions, keeping everything together. The task system supports dependencies, custom environments, and multi-line commands.

## Plugin ecosystem and compatibility

That task runner felt convenient, but I still needed languages beyond Node and Python. I wanted to see how well mise's asdf plugin compatibility actually worked with the hundreds of plugins the asdf community had created.

asdf has an extensive plugin ecosystem:

```bash
# Browse available plugins
$ asdf plugin list all
1password-cli
R
actionlint
act
ag
...

# Install a plugin
$ asdf plugin add elixir
$ asdf plugin add kubectl

# Some plugins need additional dependencies
$ asdf plugin add ruby
# May need build tools: apt-get install libssl-dev libreadline-dev
```

The asdf community maintains over 500 plugins for languages, tools, and utilities. Each plugin gets reviewed before joining the official list. However, plugin quality varies, and some require system dependencies that aren't always documented clearly.

mise uses asdf plugins with some caveats:

```bash
# Built-in support for major languages
$ mise use python@3.11  # No plugin needed

# asdf plugins work too
$ mise plugin install elixir https://github.com/asdf-vm/asdf-elixir
$ mise install elixir@1.15.0

# List plugins
$ mise plugins ls
elixir      https://github.com/asdf-vm/asdf-elixir
```

mise includes native support for Node, Python, Ruby, Java, Go, and others. You don't install plugins for these languages—they work immediately. For other tools, mise can use asdf plugins directly. Most plugins work fine, though some might have issues because mise isn't a perfect clone of asdf.

## Handling version installation

I wondered if mise and asdf differed in how they installed language versions. I decided to install the same versions of several languages with both tools to see if the process varied.

asdf downloads and compiles from source for many languages:

```bash
# Installing Ruby takes several minutes
$ time asdf install ruby 3.2.2
Downloading ruby-3.2.2.tar.gz...
Installing ruby-3.2.2...
Installed ruby-3.2.2 to /home/user/.asdf/installs/ruby/3.2.2

real    8m34.221s
user    7m12.445s
sys     0m45.789s

# Node installs from pre-built binaries (faster)
$ time asdf install nodejs 20.10.0
Downloading node-v20.10.0-linux-x64.tar.gz...
Installed nodejs 20.10.0 to /home/user/.asdf/installs/nodejs/20.10.0

real    0m23.445s
user    0m8.123s
sys     0m3.234s
```

Some asdf plugins compile languages from source, taking minutes to install. Others download pre-built binaries. The experience varies depending on which plugin you're using and whether the maintainer provides binaries for your platform.

mise takes a similar approach:

```bash
# Installing languages works much like asdf
$ time mise install ruby@3.2.2
Installing ruby@3.2.2...
Installed ruby-3.2.2 to /home/user/.local/share/mise/installs/ruby/3.2.2

real    8m41.334s
user    7m18.223s
sys     0m48.112s

# Pre-built binaries when available
$ time mise install node@20.10.0
Installing node@20.10.0...
Installed node@20.10.0 to /home/user/.local/share/mise/installs/node/20.10.0

real    0m19.223s
user    0m6.891s
sys     0m2.998s
```

Since mise uses asdf plugins for many languages, installation times match closely. The built-in support for major languages might eventually include better caching or faster installation methods, but right now it's comparable to asdf.

## Update and maintenance patterns

Those long Ruby installation times reminded me that keeping tools updated matters too. I wanted to see how each tool handled updates—both to the version manager itself and to the language versions it managed.

asdf updates through git:

```bash
# Update asdf itself
$ asdf update
Updated asdf from version v0.15.0 to v0.16.0

# Update plugins
$ asdf plugin update --all
Updating nodejs...  updated
Updating ruby...    updated
Updating python...  updated

# Check for outdated versions
$ asdf latest --all
nodejs          20.11.0
ruby            3.3.0
python          3.12.1
```

You update asdf by pulling the latest git changes. Plugin updates happen separately, and you manually check if newer language versions are available. The separation between tool updates and version updates gives you control but requires active maintenance.

mise updates like any other binary:

```bash
# Update mise itself
$ brew upgrade mise
# or: mise self-update

# Check outdated versions
$ mise outdated
Tool    Requested  Current  Latest
node    20.10.0   20.10.0  20.11.0
ruby    3.2.2     3.2.2    3.3.0

# Update all tools
$ mise upgrade
Upgrading node@20.10.0 to node@20.11.0...
Upgrading ruby@3.2.2 to ruby@3.3.0...
```

mise updates through your package manager or its self-update command. The `outdated` command shows newer versions at a glance, and `upgrade` updates everything automatically. This convenience comes with a tradeoff—automatic updates might install versions that break your projects.

## Working with multiple projects

After seeing how both tools handled updates, I wanted to test something closer to real work: managing several projects that all needed different versions of the same languages. This is where version managers either shine or fall apart.

asdf handles this through directory-specific configuration:

```bash
# Project structure
~/work/
  ├── legacy-api/
  │   └── .tool-versions      # node 16.20.0, ruby 2.7.8
  ├── main-app/
  │   └── .tool-versions      # node 18.19.0, ruby 3.1.4
  └── new-service/
      └── .tool-versions      # node 20.10.0, ruby 3.2.2

# Switching is automatic
$ cd ~/work/legacy-api && node --version
v16.20.0

$ cd ~/work/new-service && node --version
v20.10.0

# Global fallback for directories without .tool-versions
$ asdf global nodejs 20.10.0
$ cd ~/scratch && node --version
v20.10.0
```

Each project directory gets its own `.tool-versions` file. When you move between projects, asdf switches versions automatically. The global setting provides a default for directories without their own configuration.

mise works the same way with additional options:

```bash
# Same directory isolation
~/work/
  ├── legacy-api/
  │   └── .tool-versions      # node 16.20.0
  ├── main-app/
  │   └── .mise.toml          # node 18.19.0, env vars, tasks
  └── new-service/
      └── .tool-versions      # node 20.10.0

# Check all project versions at once
$ mise ls --all
Tool  Version   Source
node  16.20.0  ~/work/legacy-api/.tool-versions
node  18.19.0  ~/work/main-app/.mise.toml
node  20.10.0  ~/work/new-service/.tool-versions

# Set versions for a group of projects
$ mise use --path ~/work node@18.19.0  # Sets default for ~/work and subdirectories
```

mise reads `.tool-versions` files just like asdf, but it also supports its own `.mise.toml` format. The `--path` option lets you set defaults for entire directory trees, which helps when multiple projects should use the same versions.

## Shell integration differences

Managing multiple projects showed me that version switching worked smoothly with both tools, but I started wondering about the underlying shell integration. This integration determines how reliably version switching works across different shells and terminal sessions.

asdf requires explicit shell configuration:

```bash
# For bash
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# For zsh  
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc
echo '. "$HOME/.asdf/completions/asdf.zsh"' >> ~/.zshrc

# For fish
echo 'source ~/.asdf/asdf.fish' >> ~/.config/fish/config.fish

# The sourced script adds hooks to your shell
# These hooks run before each command prompt
```

You add asdf to your shell's startup file manually. This explicit configuration means you know exactly what's happening, but it requires setup for each shell you use. The hooks asdf installs intercept your commands and modify PATH to point at the right versions.

mise provides automatic shell activation:

```bash
# mise activates itself when it detects it's needed
# You still add it to your shell config, but it's a single command

# Bash/Zsh
eval "$(~/.local/bin/mise activate bash)"  # or zsh

# Fish
~/.local/bin/mise activate fish | source

# The activation is lighter than asdf's approach
```

mise's activation sets up shell hooks automatically. The Rust implementation makes these hooks efficient. You still modify your shell configuration, but mise handles the details of hooking into your shell's command execution.


## Final thoughts

This article compared mise and asdf. asdf is great at simple version management, but mise goes further. It brings versions, environment variables, and tasks into one tool, which makes your workflow more cohesive. The trade-off is a little more complexity, but the flexibility and convenience usually outweigh that. If you want more than just version switching, mise is the better choice.