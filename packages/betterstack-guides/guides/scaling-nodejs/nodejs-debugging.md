# Three Ways to Debug Node.js Applications

The most prevalent method for debugging Node.js code is by using `console.log()`
statements to log information to the console. While this approach can be quick
and effective in many situations, it lacks the flexibility offered by dedicated
debugging tools, which allow you to pause code execution and perform many
complex debugging tasks.

In this article, we'll explore three primary methods for debugging Node.js
applications using specialized debugging tools. We'll start by examining the
built-in command-line debugger, followed by an overview of the Node.js inspector
protocol which is accessible via a number of open source and commercial
debuggers.

[ad-logs]

## Prerequisites

Before proceeding with this article, ensure that you have a recent version of
Node.js and `npm` installed on your computer. You also need to download and
install [Google Chrome](https://www.google.com/chrome/) or the open-source
[Chromium](https://download-chromium.appspot.com/) browser, and
[Visual Studio Code](https://code.visualstudio.com/).

## 1. Debugging Node.js using the command-line

A command-line debugging utility is included in every installation of Node.js
which can come in handy when debugging simple scripts. While its not a
fully-featured debugger, it provides enough features to help you step through
and examine your code and its data.

Here's a simple Node.js script that uses the
[Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)
algorithm to find all the prime numbers up to a given limit.

```javascript
[label index.js]
function getPrimes(max) {
  const sieve = {};
  const primes = [];

  for (let i = 2; i <= max; ++i) {
    if (!sieve[i]) {
      primes.push(i);

      for (let j = i << 1; j <= max; j += i) {
        sieve[j] = true;
      }
    }
  }

  return primes;
}

console.log(getPrimes(100));
```

When you run this script, you will get the following output:

```command
node index.js
```

```text
[output]
[
   2,  3,  5,  7, 11, 13, 17, 19,
  23, 29, 31, 37, 41, 43, 47, 53,
  59, 61, 67, 71, 73, 79, 83, 89,
  97
]
```

You can utilize the `node inspect` command to launch a debugging session that
uses the command-line debugger:

```command
node inspect index.js
```

```text
[output]
< Debugger listening on ws://127.0.0.1:9229/4b213303-bf46-44ab-b01b-3cbe85f6e5e5
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in index.js:18
 16 }
 17
>18 console.log(getPrimes(100));
 19
debug>
```

By default, the debugger will pause code execution on the first executable line
as indicated with `>` in the output above. It also ends with the `debug>` line
which indicates that the debugger is ready to accept new commands.

You can change the behavior of the debugger so that it runs the code until it
finds a `debugger` statement in your code by setting the
`NODE_INSPECT_RESUME_ON_START` environmental variable to 1.

```command
NODE_INSPECT_RESUME_ON_START=1 node inspect index.js
```

Since we don't have a `debugger` statement in the `index.js` file, running the
above command will execute the script to completion and wait for the debugger to
disconnect.

```text
[output]
< Debugger listening on ws://127.0.0.1:9229/c1835fa2-1569-442b-ae48-b5408988a546
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< [
<    2,  3,  5,  7, 11, 13, 17, 19,
<   23, 29, 31, 37, 41, 43, 47, 53,
<   59, 61, 67, 71, 73, 79, 83, 89,
<   97
< ]
<
< Waiting for the debugger to disconnect...
<
debug>
```

To fix this, return to your editor and add a `debugger` statement at the point
where you want to pause code execution.

```javascript
[label index.js]
function getPrimes(max) {
  const sieve = {};
  const primes = [];

  for (let i = 2; i <= max; ++i) {
    [highlight]
    debugger;
    [/highlight]
    if (!sieve[i]) {
      primes.push(i);

      for (let j = i << 1; j <= max; j += i) {
        sieve[j] = true;
      }
    }
  }

  return primes;
}

console.log(getPrimes(100));
```

Afterward, type `restart` in your debug prompt. It will restart the debugging
session and pick up any changes you've made to the script.

```text
debug> restart
```

```text
[output]
< Debugger listening on ws://127.0.0.1:9229/2f6b1ece-11f3-4244-9fa0-1ad001285090
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
break in index.js:6
  4
  5   for (let i = 2; i <= max; ++i) {
> 6     debugger;
  7     if (!sieve[i]) {
  8       primes.push(i);
```

You can now see that the code is paused where the `debugger` statement is
placed. Instead of adding `debugger` statements in your code to pause the
script, it might be more convenient to do this via the debugger itself.

Go ahead and remove the `debugger` statement from your `index.js` file, then
exit the debug prompt by pressing `Ctrl-D`. Afterward, restart the debugger
without the setting environmental variable. It should pause on the first
executable line as before.

```command
node inspect index.js
```

```text
[output]
. . .
Break on start in index.js:18
 16 }
 17
>18 console.log(getPrimes(100));
 19
```

Before we resume code execution, let's set a breakpoint through the
`setBreakpoint()` or `sb()` method. When used without an argument, it sets a
breakpoint on the current line, but we can also pass other arguments such as a
specific line in the current script or some other script.

Let's go ahead and set a breakpoint on line 6 by entering the following in the
debug prompt:

```text
debug> sb(6)
```

```text
[output]
  1 function getPrimes(max) {
  2   const sieve = {};
  3   const primes = [];
  4
  5   for (let i = 2; i <= max; ++i) {
> 6     if (!sieve[i]) {
  7       primes.push(i);
  8
  9       for (let j = i << 1; j <= max; j += i) {
 10         sieve[j] = true;
```

The above output indicates that the breakpoint has been set on line 6
successfully. We can now continue code execution by using the `c` or `cont`
command which will pause the code at the next breakpoint.

```text
debug> c
```

```text
[output]
break in index.js:5
  4
  5   for (let i = 2; i <= max; ++i) {
> 6     if (!sieve[i]) {
  7       primes.push(i);
  8
```

Instead of using `c` as above, you can also use the `s` or `step` command to
step into the function and pause on its first line.

```text
debug> s
```

```text
[output]
break in index.js:2
  1 function getPrimes(max) {
> 2   const sieve = {};
  3   const primes = [];
  4
```

If you use this option, you can type `n` or `next` to go to the next non-empty
line.

```text
debug> n
```

```text
[output]
break in index.js:3
  1 function getPrimes(max) {
  2   const sieve = {};
> 3   const primes = [];
  4
  5   for (let i = 2; i <= max; ++i) {
```

You can also type `c` to skip ahead to the next breakpoint as demonstrated
earlier.

Let's assume you're on the breakpoint on line 6. This line initiates the for
loop that finds the prime numbers. It begins its search at `2` which is the
smallest prime number, and pushes this number to the `primes` array if not found
in the `sieves` object.

The `sieves` object helps us keep track of numbers that are not primes. It is
populated in the inner loop by marking the multiples of each discovered prime as
non-primes.

We can monitor the values of each entity as the loop progresses by using the
adding them to the watchers list through `watch()`. Go ahead and type the
following into the debug prompt:

```text
debug> watch('primes')
debug> watch('sieve')
debug> watch('i')
```

Afterward, type `watchers` to view the list of actively watched entities and
their values:

```text
debug> watchers
```

```text
[output]
  0: primes = [  ]
  1: sieve = {  }
  2: i = 2
```

As you can see, both `primes` and `sieve` are empty while `i` is set to `2` at
the first iteration. You can type `c` to continue the code execution so that the
first iteration of the loop is completed.

```text
debug> c
```

You should observe the following output:

```text
break in index.js:6
Watchers:
  0: primes = [ 2 ]
  1: sieve =
    { 4: true,
      6: true,
      8: true,
      . . .
      96: true,
      98: true,
      100: true }
  2: i = 3

  4
  5   for (let i = 2; i <= max; ++i) {
> 6     if (!sieve[i]) {
  7       primes.push(i);
  8
```

Note that the first prime (`2`) as been found, and a bunch of numbers have been
added to the sieve indicating that they are not primes. `i` has also been
incremented to 3, and the breakpoint on line 6 has been reached again so the
code is paused once more.

You can resume execution by typing `c` or you can enter `n` to execute the next
line. Each time code execution is paused, the values in the watchers list will
be printed out as before.

You can also remove a value from the watchers list by typing
`unwatch('<expr>')`. Go ahead and unwatch `sieve` by typing the following:

```text
debug> unwatch('sieve')
```

When you type `c` or `n` once more, you will no longer observe `sieve` amongst
the watchers.

```text
debug> c
```

```text
break in index.js:6
Watchers:
  0: primes = [ 2, 3 ]
  1: i = 4

  4
  5   for (let i = 2; i <= max; ++i) {
> 6     if (!sieve[i]) {
  7       primes.push(i);
  8
```

Perhaps you'd like to see the value of a variable or expression without watching
its value, you can use the `exec <expr>` syntax.

```text
debug> exec sieve
```

```text
[output]
{ 4: true,
  6: true,
  . . .
  99: true,
  100: true }
```

If you want to inspect multiple values, it may be quicker to use the debugger's
`repl`:

```text
debug> repl
```

```text
[output]
Press Ctrl+C to leave debug repl
```

At this point, you can type any expression in the current context to print its
value:

```text
> primes
```

```text
[output]
[ 2, 3 ]
```

```text
> i
```

```text
[output]
4
```

When you're ready to leave the debug repl, press `Ctrl-C`. You can clear a
breakpoint by using the `clearBreakpoint()` or `cb()` method. It takes the
script name as its first argument, and the line number as the second.

```text
debug> cb('index.js', 6)
```

Once you're through with your debugging session, type `.exit` or `Ctrl-D` to
leave the debug prompt and return to the terminal console.

## 2. Debugging Node.js through the Chrome DevTools

To demonstrate this process of debugging Node.js applications with the popular
Chrome DevTools, we will utilize a basic application that searches Wikipedia.
Here's the relevant script in its entirety:

```javascript
[label server.js]
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600 });
const app = express();
const port = 3000;

async function searchWikipedia(searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${searchQuery}`;
  const response = await axios.get(endpoint);
  return response.data;
}

app.get("/", async (req, res) => {
  let searchQuery = req.query.q || "";
  searchQuery = searchQuery.trim();

  if (!searchQuery) {
    res.status(400).send("Search query cannot be empty");
    return;
  }

  const cacheKey = "wikipedia:" + searchQuery;

  try {
    let data = myCache.get(cacheKey);

    if (data == null) {
      data = await searchWikipedia(searchQuery);
      myCache.set(cacheKey, data, 300);
    }

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

const server = app.listen(port, () => {
  console.log(`Wikipedia app listening on port ${port}`);
});
```

To get started with debugging your Node.js application using the Chrome
DevTools, you need to activate the Node.js inspector when executing your script:

```command
node --inspect server.js
```

```text
[output]
Debugger listening on ws://127.0.0.1:9229/c8b45bff-c900-42c3-a270-7cae84596482
For help, see: https://nodejs.org/en/docs/inspector
Wikipedia app listening on port 3000
```

The command above causes the Node.js process to listen for a debugging client at
host 127.0.0.1 and port 9229. A unique UUID
(c8b45bff-c900-42c3-a270-7cae84596482) is also assigned to the process. At this
point, you can use an inspector client (such as the Chrome DevTools or a
compatible IDE) to connect to the process via the provided URL.

Go ahead and launch a Chromium-based browser (Google Chrome, Chromium, Brave,
etc) on your computer, then navigate to `chrome://inspect` in the address bar.

![Chrome inspect page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ecacab26-7d04-48a8-9a7d-5bb735f01300/public
=1366x754)

Ensure that you are in the **Devices** section, then click the **Open dedicated
DevTools for Node** link.

![Node.js dedicated DevTools](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e0122ef2-8112-4265-27e2-fc68f0127300/public
=1232x768)

Navigate to the **Sources** tab and expand the file tree on the left-hand side
until you get to the `server.js` entry.

![Node.js dedicated DevTools sources tab](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/82aaf550-71e5-492d-3663-3d64e983dd00/public
=1326x768)

At this point, you're ready to debug your Node.js script. You will see a
"Debugger attached" message if you return to the terminal where your Node.js
application is running.

Let's start by setting a breakpoint on line 19 of the file. We'd like to inspect
the incoming search query from the client. Click on line 19 in the Sources
editor to set a breakpoint. You should notice a blue icon on the line number
column.

![Chrome DevTools breakpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a9fb860c-87ca-45f7-ceeb-7ac570bc5d00/public
=1326x768)

Return your terminal and type the following command to make a request to your
running application:

```command
curl 'http://localhost:3000?q=javascript'
```

In the DevTools' window, you'll notice that the code execution is paused on
line 19. You should also see that the DevTools prints out the values of the
`req` and `searchQuery` entities to the right of each line's semi-colon. You can
also mouse over a variable's name to examine its value.

![Chrome DevTools inspect variables](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c15eb00-8a74-47c5-a1e6-d160c0fffe00/public
=1326x768)

Let's examine the data received from Wikipedia by setting another breakpoint on
line 31. Afterward, resume script execution by pressing `F8` on your keyboard.
You should observe the following:

![Chrome DevTools inspect variables](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b04732c3-eaad-4d8c-82fc-abc9fa6a7d00/public
=1326x768)

If you mouse over the `data` variable on line 10, you'll be able to inspect all
the properties of the JSON object from the Wikipedia API.

![Chrome DevTools inspect variables](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/43ed91e3-dd97-45be-e341-adf9c6e02200/public
=1326x768)

Once you're done examining the values, you can resume script execution once
more. Clearing breakpoints can be done by clicking each highlighted line number,
or right-clicking the **Breakpoints** section on the right and selecting the
appropriate option.

![Chrome DevTools clearing breakpoints](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fd297826-39af-4385-4c3a-aa62962ce600/public
=1326x768)

The Chrome Debugger provides a lot more functions and tools for debugging your
JavaScript code, but we cannot cover them all here. Head over to the
[official documentation](https://developer.chrome.com/docs/devtools/javascript/sources/)
to learn more about leveraging it in your development workflow.

## 3. Debugging Node.js in Visual Studio Code

As mentioned in the previous section, the V8 inspector in Node.js allows any
debugging client that can communicate using the
[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
to debug and profile Node.js processes. This includes the built-in debugging
tools found in editors and IDEs such as
[Visual Studio Code](https://code.visualstudio.com/) and
[Webstorm](https://www.jetbrains.com/webstorm).

This section will describe the process of performing a Node.js debugging session
in VS Code. It's sometimes preferable to using the browser DevTools since you
don't have to switch between windows

### Launching a debugging session

There are several ways to start a debugging session in VS Code. The first method
involves toggling the **Auto Attach** feature in the editor that allows it to
automatically attach to Node.js processes that are launched from the integrated
terminal.

Press `Ctrl+Shift+P` to open the Command Palette, then search for **Toggle Auto
Attach**.

![VS Code command palette](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4746e3ba-ca62-4863-980f-bcf27a64fe00/public
=1355x768)

Press `Enter` on the appropriate option, then select your preferred auto attach
mode (you can set it to **Only with Flag**). You will notice that a new status
bar item is added at the bottom of the window when auto attach is enabled. You
can click this item to change the auto attach mode or disable it entirely.

![VS Code toggle auto attach](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a0bc2e6f-8b82-4290-f44b-76faa6db5300/public
=1355x768)

After enabling the auto attach feature, launch a new integrated terminal
instance with Ctrl+Shift+` and start a debugging session by typing the following
command:

```command
node --inspect server.js
```

```text
[output]
Debugger listening on ws://127.0.0.1:9229/43e56825-67de-4da3-9a88-33bf1425a31d
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
Wikipedia app listening on port 3000
```

You'll notice that the debugger is automatically attached and VS Code status bar
turns orange to indicate that the debugging process can begin.

![VS Code debugging session](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/49eb8986-d93e-45af-53a0-06852340e200/public
=1355x768)

Another way to debug your code is to execute it in a **JavaScript Debug
Terminal**. Press `Ctrl+Shift+` to open the integrated terminal, then select the
**JavaScript Debug Terminal** option from the **Launch Profile** drop-down menu.

![VS Code Select JavaScript Debug Terminal](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c798dee-32e6-4dc8-a54f-db86b83f8a00/public
=1322x768)

Once the terminal profile is open, navigate to your project directory and start
your Node.js project normally. You'll notice that the debugger is attached
automatically to the process.

![VS Code Select JavaScript Debug Terminal](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2c315597-4f1b-4758-babf-7a5e9478ec00/public
=1355x768)

A third way to launch a debugging session is by going to the **Run** menu and
selecting the **Start Debugging** entry or pressing `F5`. This will execute the
currently active file in the background and start a debugging session
immediately. If VS Code fails to detect your debug environment, you can choose
one manually from the resulting dialog:

![VS Code debugging environments](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa2b9041-a7d1-457d-38b4-1ff72f217100/public
=1218x359)

It's also possible to debug Node.js applications that were started outside of VS
Code. After enabling the V8 inspector on the application, you can open the VS
Code command palette once again and find the **Debug: Attach to Node Process**
option.

![VS Code attach to node process](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4b993785-0e18-4c4d-aa41-278880dd9400/public
=1355x768)

This will open a menu that lists all the Node.js processes on your machine that
are available to the VS Code debugger. Find the option you'd like to debug and
select it. It should launch the debugging session immediately.

![VS Code attach to node process](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e667b3ad-3505-4cf9-a836-b83027420300/public
=1355x768)

You may also prefer to set up a configuration file that describes a reusable
debugging setup for anyone working on the project. This involves creating a
`launch.json` file inside the `.vscode` folder in the project root.

Assuming you have your project folder open in VS Code, you can create this
configuration file by clicking the **create a launch.json file** link in the
**RUN AND DEBUG** panel. Ensure to select the **Node.js** environment if
prompted.

![VS Code create launch.json file](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/61276613-5045-470e-469f-6c1f8512da00/public
=1355x768)

The `launch.json` file will be created and opened in the editor:

```javascript
[label .vscode/launch.json]
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            [highlight]
            "name": "Launch Wikipedia App",
            [/highlight]
            "skipFiles": [
                "<node_internals>/**"
            ],
            [highlight]
            "program": "${workspaceFolder}/server.js"
            [/highlight]
        }
    ]
}
```

The `program` field specifies the file that will be executed when launching the
debugger, while the `name` field specifies a recognizable name for the Debug
launch configuration drop-down. There are
[several other options](https://code.visualstudio.com/docs/editor/debugging#_launchjson-attributes)
that can be configured to support a variety of debugging scenarios so this
options is good for a complex project with several contributors.

Once you're done with setting up the debugging configuration for your project,
you can launch a session by clicking the green button beside the **RUN AND
DEBUG** configuration drop-down.

![VS Code run and debug](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/21cae11b-37ca-4681-437f-1a9de61ec300/public
=1366x746)

### Creating breakpoints

Once a debugging session is active, you can set breakpoints by clicking the line
numbers in the file. Once a breakpoint is set, a bright red indicator is
displayed to the left or the number. Clicking this red indicator will remove the
breakpoints, or you can right-click the breakpoint to view other options. You
can also add or remove breakpoints via the **BREAKPOINTS** panel on the left.

![VS Code create breakpoints](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d6e8595c-4d85-4cc3-b2ca-4a4c15c41a00/public
=1322x768)

### Creating logpoints

A logpoint is a method of logging messages or values to the console without
using `console.log()` in the code itself. You can add one by right-clicking the
gutter beside a line number (one without an active breakpoint), then select the
**Add Logpoint** option.

![VS Code create logpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aa42d629-a5fc-4238-58da-939680a7f700/public
=1322x768)

You will observe the appearance of an input field, and this is where you can add
a message to log to the **DEBUG CONSOLE** when that line is reached during the
course of program execution. If you want to log the value of a variable in the
scope of execution, place it within curly braces.

![VS Code create logpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0512a578-0142-4c22-70d6-5361e6b47300/public
=1322x768)

Logpoints are denoted by a red diamond and, unlike breakpoints, they do not
pause the code execution. Instead

### Inspecting values

When a breakpoint is hit, you'll be able to inspect the values of variables and
expressions in the scope of program execution by hovering your cursor on the
entity. You can also use the **VARIABLES** pane to easily inspect the values in
the current block, local or global scope, and closure.

![VS Code debug variables pane](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a6bb2cba-b64c-4b02-30f1-790402eba700/public
=1322x768)

If you need to monitor one or more values during code execution, you can add
them to the **WATCH** pane by right-clicking the value in **VARIABLES** and
selecting **Add to Watch**. This helpful when inspecting a deeply nested
property or when comparing the values of several variables at once.

![VS Code debug watch pane](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/492a78a6-2951-4af8-87d8-b20bb9f64b00/public
=1322x768)

## Final thoughts

In this tutorial, we've addressed three different ways to debug Node.js code. We
started by exploring the built-in command-line debugger, before exploring the
debugging process using Chrome DevTools and VS Code. To learn more about each of
these debugging tools, visit the
[Node.js documentation](https://nodejs.org/api/debugger.html),
[Chrome DevTools documentation](https://developers.google.com/web/tools/chrome-devtools/javascript),
or the
[VS Code debugger docs](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

Thanks for reading, and happy debugging!
