# The Definitive Guide to Commander.js

[Commander.js](https://github.com/tj/commander.js) is a widely used command-line interface (CLI) framework for Node.js that makes it easier to build command-line applications with a clean and intuitive syntax.  

It provides essential features like command chaining, subcommands, variadic arguments, and automatic help generation. 

This article will walk you through the fundamentals of building command-line applications using Commander.js.


[ad-logs]

## Prerequisites

Before proceeding with the rest of this article, ensure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed locally on your machine. This article assumes you are familiar with the basic concepts of Node.js and have some experience with creating and running JavaScript applications.

## Getting started with Commander.js

To get the most out of this tutorial, create a new Node.js project to try out the concepts this article will discuss.


 Start by initializing a new Node.js project using the command below:

```command
mkdir commander-cli && cd commander-cli
```
Initialize a new Node.js project:

```command
npm init -y
```
Set the project to use ECMAScript modules:


```command
npm pkg set type="module"
```
Afterward, install the latest version of [commander](https://www.npmjs.com/package/commander):


```command
npm install commander
```

Create a new `cli.js` file in the root of your project directory, and populate it with the following contents:

```javascript
[label cli.js]
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0');

program.parse();
```
The `#!/usr/bin/env node` shebang enables direct script execution in Unix-like systems without explicitly calling Node.js. 

The script imports the `Command` class from Commander.js, sets up CLI metadata (name, description, version), and calls `.parse()` to handle user input.

Before running your CLI script, make it executable on Unix-based systems by using:

```command
chmod +x cli.js
```

This command grants execution permissions to `cli.js`, allowing it to be run as a standalone script. 

Now, you can test your CLI by running:  

```command
./cli.js --help
```

If everything is set up correctly, you should see output similar to this:  

```command

Usage: my-cli [options]

A CLI application built with Commander.js

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

This output confirms that Commander.js is correctly parsing the command-line options and generating a help menu automatically.  



## Adding options to your CLI
Options allow users to customize CLI commands, making them more flexible and adaptable to different tasks. 

With Commander.js, you can define options that modify a command’s behavior, such as enabling debug mode, specifying file paths, or setting timeouts.  

In this section, you’ll expand your CLI by adding several options, giving users more control over how the application runs.


To do that, add the highlighted code below:

```javascript
[label cli.js]
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0')
[highlight]
  .option('-d, --debug', 'output extra debugging information')
  .option('-f, --file <path>', 'specify the file to process')
  .option('-t, --timeout <seconds>', 'specify the timeout in seconds', '60')
  .option('-v, --verbose', 'enable verbose output');
[/highlight]
program.parse();

[highlight]
// Access the options
const options = program.opts();
if (options.debug) {
  console.log('Debug mode is enabled');
  console.log('Options:', options);
}
[/highlight]
```
Commander.js allows you to define options that modify your command's behavior. In the example above, you define four options:

- Boolean option (`-d, --debug`): This option doesn't require a value and defaults to `false` if not provided
- Option with required value (`-f, --file <path>`): The angle brackets indicate that a value is required
- Option with default value (`-t, --timeout <seconds>`): This option specifies a default value of '60'
- Option with variadic arguments (`-l, --list <items...>`): The ellipsis indicates that multiple values can be provided


The second highlighted section retrieves all parsed options and conditionally displays debug information if the debug flag was enabled.

Run the CLI with the debug flag:

```command
./cli.js --debug
```

You should see:

```text
[output]
Debug mode is enabled
Options: { timeout: '60', debug: true }
```
Adding options to your CLI enhances its versatility and improves the user experience, giving users control over how commands behave based on their needs.


## Defining commands in your CLI 
Commands allow you to organize your CLI into distinct functionalities. While options modify the behavior of your entire application, commands create separate "subprograms" within your CLI tool, each with its own purpose and options.

After setting up global options in the previous section, you can now expand the CLI to include commands that perform specific tasks. 

Commands follow a noun-based structure (like `list`, `create`, `delete`) that users will find intuitive and memorable.

Let's add a simple command to our CLI:

```javascript
[label cli.js]
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0')
  ....
  .option('-v, --verbose', 'enable verbose output');

[highlight]
program
  .command('list')
  .description('List all items')
  .action(() => {
    console.log('Listing items...');
  });
[/highlight]
program.parse();
// Access the options
const options = program.opts();
...
```

This `list` command provides a basic way to display items. When you run `my-cli list`, the `.action()` callback executes, printing `"Listing items..."` to the console:

```command
./cli.js list
```

```text
[output]
Listing items...
```

Each command can have its own set of options. Let's enhance our `list` command with an option:

```javascript
[label cli.js]
...
program
  .command('list')
  .description('List all items')
[highlight]
  .option('-a, --all', 'list all items, including hidden ones')
  .action((options) => {
    console.log('Listing items...');
    if (options.all) {
      console.log('Including hidden items');
    }
  });
[/highlight]
...
```
When the `--all` flag is provided, the `.action()` callback detects it and prints `"Including hidden items"`, ensuring the output reflects the user's choice.  

Running the command using `--all` expands the output to include hidden items:  

```command
./cli.js list --all
```

```text
[output]
Listing items...
Including hidden items
```

Commands can also accept arguments. Let's add another command that requires an argument:

```javascript
[label cli.js]
program
  .command('list')
  ....

[highlight]
program
  .command('create <name>')
  .description('Create a new item')
  .action((name) => {
    console.log(`Creating item "${name}"`);
  });
[/highlight]

program.parse();
...
```
In this example, `<name>` is a required argument. When a user runs `my-cli create Item1`, the command captures `"Item1"` and passes it to the `.action()` callback.  

Executing the following command:  

```command
./cli.js create my-item
```

```text
[output]
Creating item "my-item"
```

You can combine arguments and options within commands:

```javascript
[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
[highlight]
  .option('-t, --type <type>', 'specify the item type', 'default')
  .action((name, options) => {
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
[/highlight]
```
In the highlighted section, the `create` command accepts both an argument and an option. The `-t, --type <type>` option lets users define its type, defaulting to `"default"`. 


Now when you run:

```command
./cli.js create my-item --type special
```
The command prints:

```text
[output]
Creating item "my-item" of type "special"
```

Building your CLI with commands creates an intuitive interface similar to popular tools like `git`, where commands like `git commit` and `git push` function as distinct operations within the same application.



## Handling arguments and validation  

Now that your CLI can accept commands, arguments, and options, validating user input and handling errors gracefully is essential.

Users may provide incorrect arguments or options without proper validation, leading to unexpected behavior or crashes.

### Validating required arguments  
Commander.js automatically enforces required arguments, but you can provide custom validation logic within the `.action()` callback.

Modify the `create` command to ensure the item name follows specific rules:

```javascript
[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
[highlight]
    if (name.length < 3) {
      console.error('Error: The item name must be at least 3 characters long.');
      process.exit(1); // Exit with an error code
    }
[/highlight]
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
...
```
The `.action()` callback now checks if `name` is at least three characters long. If the condition fails, it prints an error message and exits with `process.exit(1)`, indicating a failure.
 
This prevents users from creating an item with an invalid name.

Now test an invalid input:

```command
./cli.js create ab
```
```text
[output]
Error: The item name must be at least 3 characters long.
```

Test with valid input:

```command
./cli.js create my-item
```
```text
[output]
Creating item "my-item" of type "default"
```


### Ensuring valid option values
Some options require specific values. For example, the `--type` option in the `create` command should only accept predefined types.

Modify the `create` command to validate the `--type` option:

```javascript
[label cli.js]
...
[highlight]
const validTypes = ['default', 'special', 'custom'];
[/highlight]

program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
   if (name.length < 3) {
      ..
    }
[highlight]
    if (!validTypes.includes(options.type)) {
      console.error(`Error: Invalid type "${options.type}". Allowed types: ${validTypes.join(', ')}`);
      process.exit(1);
    }
[/highlight]
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
...
```
 The `validTypes` array defines allowed values. Then the `.action()` callback checks if the provided `--type` value is in the `validTypes` list. If the value is invalid, it displays an error message and exits the script.

Now test with an invalid option value:

```command
./cli.js create my-item --type unknown
```
```text
[output]
Error: Invalid type "unknown". Allowed types: default, special, custom
```

Test with a valid option value:

```command
./cli.js create my-item --type custom
```
```text
[output]
Creating item "my-item" of type "custom"
```
With argument validation and error handling in place, your CLI provides clearer guidance to users and prevents unexpected errors.

## Adding color and style to your CLI output  

Now that your CLI is functional, enhancing its output with color and formatting can make it more engaging and readable. 

Plain text messages work, but adding color helps users quickly identify important messages, differentiate errors from successes, and improve overall usability.

Using color-coded messages makes output more intuitive. Success messages can appear in green, errors in red, warnings in yellow, and general information in blue. This approach improves readability and helps users interact with the CLI more effectively.
  

To introduce color to the CLI, install the [Chalk](https://www.npmjs.com/package/chalk) package, which provides an easy way to add color and formatting to text output. Run the following command:

```command
npm install chalk
```

After installation, import Chalk at the beginning of the script:

```javascript
[label cli.js]
#!/usr/bin/env node
[highlight]
import chalk from 'chalk';
[/highlight]
import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0');
  ...
...
```

With Chalk set up, updating command responses with color makes output clearer. 

Modify the `create` command to improve success and error messages:

```javascript
[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
    if (name.length < 3) {
[highlight]
      console.error(chalk.red('Error: The item name must be at least 3 characters long.'));
[/highlight]
      process.exit(1);
    }
[highlight]
    console.log(chalk.green(`Successfully created item "${name}" of type "${options.type}"`));
[/highlight]
  });
...
```

This update ensures that error messages are displayed in red, while success messages appear in green. This provides instant feedback on whether the command executed correctly.

To test this change, run:

```command
./cli.js create ab
```

Then run a valid command:

```command
./cli.js create my-item --type custom
```
![Screenshot of the output in color](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91774c07-3e36-4ded-01fa-d36d98657c00/lg1x =1404x1170)

The messages now appear in color, making errors easier to spot and confirmations more noticeable.


### Consistent error handling with styled messages  

Ensuring error messages have a uniform format across all commands improves usability. Instead of writing the same error-handling logic repeatedly, create a helper function:

```javascript
[label cli.js]
...
const program = new Command();
[highlight]
function showError(message) {
  console.error(chalk.red.bold(`Error: ${message}`));
  process.exit(1);
}
[/highlight]

program
  .name("my-cli")
  .description("A CLI application built with Commander.js")
...
```

This function makes all errors appear in bold red text, ensuring they are immediately noticeable. 

To integrate it into commands, modify the `create` command:

```javascript
[label cli.js]
const validTypes = ['default', 'special', 'custom'];

program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
    if (!validTypes.includes(options.type)) {
[highlight]
      showError(`Invalid type "${options.type}". Allowed types: ${validTypes.join(', ')}`);
[/highlight]
    }
    console.log(chalk.green(` Successfully created item "${name}" of type "${options.type}"`));
  });

...
```

To test this, run:

```command
./cli.js create my-item --type unknown
```

![Screenshot of the output colored using the `showError` function](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/640bece4-b350-428e-997f-54af98e0f700/md1x =1404x1170)


This structured approach ensures that all error messages follow a consistent format.

Now that CLI output is more readable and visually appealing, the next step is to add interactive prompts with Inquirer.js.


## Enhancing your CLI with interactive prompts  

Now that your CLI has structured commands, options, and styled output, the next step is to improve user interaction by incorporating interactive prompts.

 Instead of requiring users to manually pass all arguments and options, prompts provide a more intuitive experience, guiding users through input collection dynamically.
 

To add interactive prompts, install [Inquirer.js](https://www.npmjs.com/package/inquirer):

```command
npm install inquirer
```

After installation, import it at the beginning of `cli.js`:

```javascript
[label cli.js]
#!/usr/bin/env node
[highlight]
import inquirer from 'inquirer';
[/highlight]
import chalk from "chalk";
import { Command } from "commander";
...
```

Instead of requiring users to provide a `name` and `type` directly in the command, we can prompt them dynamically.

Modify the `create` command:

```javascript
[label cli.js]
...
program
[highlight]
  .command('create')
  .description('Create a new item with interactive input')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the item name:',
        validate: (input) => input.length >= 3 ? true : 'The name must be at least 3 characters long.',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Select the item type:',
        choices: ['default', 'special', 'custom'],
      }
    ]);

    console.log(chalk.green(`Successfully created item "${answers.name}" of type "${answers.type}"`));
  });
[/highlight]
```

This code transforms the create command into an interactive experience using `Inquirer.js`. Instead of requiring command-line arguments, it prompts the user for input when they run `./cli.js` create. 

The first prompt collects and validates the item name, ensuring it's at least three characters. The second prompt presents a dropdown list of valid item types, preventing invalid selections. 

After gathering input, it confirms the creation with a green success message.


Run the `create` command without arguments:

```command
./cli.js create
```
When prompted, enter `my-item` as the item name and choose `special` as the item type. The CLI will display:


![Screenshot of the output from the CLI](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dc222155-a225-4696-b076-172164afc600/md1x =1404x1170)

With interactive prompts in place, your CLI is now easier to use and more flexible.

## Final thoughts
This guide walked you through how to set up a CLI, define options and arguments, create subcommands, validate user input, and enhance output with color formatting using Chalk. 

For more details, explore the official **[Commander.js documentation](https://github.com/tj/commander.js)** to dive deeper into its features and capabilities.