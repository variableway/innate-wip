# A Beginner's Guide to NVM

[NVM](https://github.com/nvm-sh/nvm) is a powerful version manager for Node.js that easily installs, switches between, and manages multiple Node.js versions. It eliminates the headaches of manually upgrading or downgrading Node.js installations, providing a smooth experience across different projects and requirements.

This article will walk you through setting up NVM and show you how to optimize your Node.js development workflow.

## Prerequisites

Before you start using NVM, it's helpful to have a basic understanding of the command line. NVM works on Unix-based systems like macOS and Linux, and also on Windows if you're using the Windows Subsystem for Linux (WSL). If you're on Windows without WSL, you can use [nvm-windows](https://github.com/coreybutler/nvm-windows), which offers similar features.

## Why use NVM?

Before you jump into using NVM, it helps to know why it makes your Node.js development life easier. Here’s what makes it so useful:

- Use multiple Node.js versions: Need Node.js 19 for one project and Node.js 22 for another? NVM makes switching between them easy and safe.

- Set a version per project: You can tell each project which Node.js version to use, so your setup stays consistent across different machines and team members.

- Switch versions instantly: Change Node.js versions with one command—no need to reinstall or mess with your system.

- Keep environments separate: Each Node.js version has its own global packages, so tools in one project won’t clash with another.

NVM is a must-have if you're working on several projects that need different versions of Node.js. It keeps everything organized and just works.


## Installing NVM

In this section, you will install NVM to manage your Node.js versions.

The easiest way to install NVM is using the official installation script:

```command
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

This downloads and runs the installation script, which places NVM files in `~/.nvm` and adds the necessary initialization code to your profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

After installation, you need to either restart your terminal or source your profile file:

```command
source ~/.bashrc
```

To verify that NVM has been installed successfully, run:

```command
nvm --version
```

```text
[output]
0.40.2
```

This output confirms that NVM has been installed successfully and is ready to use.

## Getting started with NVM

Once you install NVM, you can use it to manage Node.js versions on your system. NVM makes it easy to install, use, and switch between different versions with just a few commands.

To get started, install the latest LTS (Long Term Support) version of Node.js by running:


```command
nvm install --lts
```

```text
[output]
Installing latest LTS version.
Downloading and installing node v22.14.0...
Checksums matched!
Now using node v22.14.0 (npm v10.9.2)
```

This command does three things:

- It downloads the latest LTS version of Node.js
- It installs it in the NVM directory structure
- It automatically switches to use this version

You can verify the current Node.js version with:

```command
node --version
```

```text
[output]
v22.14.0
```

NVM allows you to install multiple Node.js versions. Let's install a specific version:

```command
nvm install v23.10.0
```

```text
[output]

Downloading and installing node v23.10.0...
Downloading https://nodejs.org/dist/v23.10.0/node-v23.10.0-darwin-arm64.tar.xz...
Computing checksum with sha256sum
Checksums matched!
Now using node v23.10.0 (npm v10.9.2)
```

To switch between installed versions, use the `use` command:

```command
nvm use 23
```

```text
[output]
Now using node v23.10.0 (npm v10.9.2)
```

NVM is smart enough to match partial version numbers, automatically selecting the highest installed version that matches. You can see all installed versions with:

```command
nvm ls
```

![Screenshot of a list of the Node.js versions installed on your system](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5c69f2ba-6b49-4bb2-de84-d90e83ff8600/md2x =1404x1170)

The arrow indicates the currently active version. With these basics, you can manage multiple Node.js versions effectively.


## Project-specific Node.js versions

So far, you've seen how to install and switch between different Node.js versions using NVM. But there's an even better way—automatically using the right Node.js version for each project.

This helps keep your environment consistent across machines and teams, reducing those annoying "it works on my machine" issues.

To see how it works, create a new project directory:

```command
mkdir nvm-demo && cd nvm-demo
```

Inside this directory, tell NVM which Node.js version to use by creating a `.nvmrc` file. Instead of using version 23.10.0, let’s set it to use the latest LTS version, which is v22.14.0:

```command
echo "22.14.0" > .nvmrc
```

This simple file tells NVM which Node.js version to use for this project. With the `.nvmrc` file in place, you can automatically switch to the specified version by running:

```command
nvm use
```

```text
[output]
Found 'path/to/nvm-demo/.nvmrc' with version <22.14.0>
Now using node v22.14.0 (npm v10.9.2)
```

Without any version argument, `nvm use` reads the `.nvmrc` file and switches to the specified version. This ensures consistency across all development environments.

You can now initialize your project with:

```command
npm init -y
```

Let's create a simple application to demonstrate this in action. Create a file named `app.js` in your project directory:

```command
echo 'console.log(`Hello from Node.js ${process.version}!`);' > app.js
```

After running `nvm use`, when you invoke the `node` command directly, it will use the version from your `.nvmrc` file:

```command
node app.js
```

```text
[output]
Hello from Node.js v22.14.0!
```

You can verify the active Node.js version at any time with:

```command
node -v
```

```text
[output]
v22.14.0
```
This setup ensures your project always uses the correct Node.js version. The `.nvmrc` file acts like a version lock—anyone working on the project can run `nvm use` to instantly switch to the right version.

It's handy when managing multiple projects with different Node.js requirements. With NVM, you don’t have to remember which version to use—just let `.nvmrc` handle it.


## Advanced NVM features

Now that you understand the basics of using NVM to manage Node.js versions, let's explore some of its more advanced features that can make your workflow even smoother.

### Setting a default Node.js version

When you open a new terminal window, NVM doesn't automatically select a Node.js version unless you tell it which one to use by default. To set a default version:

```command
nvm alias default 22
```

```text
[output]
default -> 22 (-> v22.14.0)
```

This sets Node.js v22.14.0 as your default version. Now, this version will be automatically selected whenever you open a new terminal.

You can also set the default always to use the latest LTS version:

```command
nvm alias default 'lts/*'
```

```text
[output]
default -> lts/* (-> v22.14.0)
```

### Using version aliases

NVM provides special aliases that make it easier to access specific Node.js versions:

- `node` - the latest released Node.js version
- `lts/*` - the latest LTS version
- `lts/hydrogen` - the latest in the Hydrogen LTS line (v18.x)
- `lts/iron` - the latest in the Iron LTS line (v20.x)
- `lts/gallium` - the latest in the Gallium LTS line (v16.x)

For example, to install the latest Node.js version (not necessarily LTS):

```command
nvm install node
```

```text
[output]
Downloading and installing node v23.10.0...
Checksums matched!
Now using node v23.10.0 (npm v10.9.2)
```

Or to use the latest LTS version:

```command
nvm use 'lts/*'
```

```text
[output]
Now using node v22.14.0 (npm v10.9.2)
```

You can also create your own aliases for versions you use frequently:

```command
nvm alias project1 23
```

```text
[output]
project1 -> 23 (-> v23.10.0)
```

Now you can switch to this version using:

```command
nvm use project1
```

```text
[output]
Now using node v23.10.0 (npm v10.9.2)
```

### Running commands without switching versions

Sometimes you want to run a command with a specific Node.js version without changing your current version. NVM makes this easy:

```command
nvm exec 22 node -v
```

```text
[output]
Running node v22.14.0 (npm v10.9.2)
v22.14.0
```

This runs the `node -v` command using Node.js v22.14.0 without changing your currently active version.


### Listing available Node.js versions

To see all Node.js versions available for installation:

```command
nvm ls-remote
```

```text
[output]
...
       v22.11.0   (LTS: Jod)
       v22.12.0   (LTS: Jod)
       v22.13.0   (LTS: Jod)
       v22.13.1   (LTS: Jod)
->     v22.14.0   (Latest LTS: Jod)
        v23.0.0
        v23.1.0
        v23.2.0
        v23.3.0
        v23.4.0
        v23.5.0
        v23.6.0
        v23.6.1
        v23.7.0
        v23.8.0
        v23.9.0
       v23.10.0
```
This command lists all available Node.js versions that you can install with NVM. Since the list is quite long, you might want to filter it:

```command
nvm ls-remote --lts
```

```text
[output]
...
       v20.19.0   (Latest LTS: Iron)
       v22.11.0   (LTS: Jod)
       v22.12.0   (LTS: Jod)
       v22.13.0   (LTS: Jod)
       v22.13.1   (LTS: Jod)
->     v22.14.0   (Latest LTS: Jod)
```

This shows only the LTS versions, which are recommended for most production applications.

### Removing unused Node.js versions

As you install more versions, you might want to clean up ones you no longer need:

```command
nvm uninstall 23
```

```text
[output]
Uninstalled node v23.10.0
```

This removes Node.js v23.10.0 from your system, freeing up disk space. Ensure you're not removing a version that's still needed by any of your projects.

These advanced features make NVM an even more powerful tool for managing your Node.js development environment, giving you precise control over which versions are used where and when.

## Final thoughts
NVM takes the hassle out of managing different Node.js versions and keeps version conflicts out of your way.
  
Whether you're working on an old project or trying out the latest features, NVM gives you the control you need to stay productive. 

If you want to learn more, check out the [official NVM documentation](https://github.com/nvm-sh/nvm).
