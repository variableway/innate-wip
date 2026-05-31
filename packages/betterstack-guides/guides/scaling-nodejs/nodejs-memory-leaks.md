# Preventing and Debugging Memory Leaks in Node.js

Memory leaks can be a big problem in all applications regardless of the
programming languages. Whether leaks happen incrementally or in smaller chunks,
the application will come to a point where it will start getting slow and
eventually crash. This can leave a bad impression on users, so it's important to
be prudent and avoid writing code that can introduce memory leaks.

In this tutorial, we will look at what memory leaks are and their causes. We
will also look at the best practices on how to prevent them, and strategies you
can use to temporarily fix memory leaks as you debug the application for memory
leaks. Finally, we look at how to monitor an application using Prometheus and
configure it to send email alerts.

[summary]
## Side note: Track Node.js exceptions with Better Stack

Stop logging exceptions to files. [Better Stack's error tracking](https://betterstack.com/error-tracking) captures every exception with full context - stack traces, memory state, and environment variables.
[/summary]

![Better Stack error tracking](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91d5b92f-4597-40cd-c51e-5a73c7b2ee00/lg1x =2350x1002)


## Prerequisites

Before proceeding with this tutorial ensure that you have a recent version of
[Node.js](https://nodejs.org/en/download/) and `npm` installed. You should also
have Google Chrome or a Chromium-based browser installed as we'll be making
heavy use of the DevTools for debugging a memory leak in a sample program.

## Understanding the memory lifecycle in Node.js

Let's begin by examining the life cycle of memory to understand what memory
leaks are:

1. **Allocation of memory**: When a program starts, the operating system
   allocates memory to the Node.js process to store values.
2. **Memory usage**: The process utilizes the allocated memory to read and write
   values.
3. **Releasing memory**: When the program completes its execution, the operating
   system frees the memory allocated to the Node.js process, making it available
   to other processes that require it.

If an application's memory consumption exceeds the memory allocated to it by the
operating system, it will be terminated. Increasing the V8 memory limit can
provide temporary relief, but eventually, you may run out of memory or be forced
to pay more for server resources. Therefore, it's critical to understand how to
prevent memory leaks to make the best use of the allocated memory.

## Understanding memory storage in JavaScript

This section will explain how data is stored in memory by the JavaScript engine
utilized by the Node.js runtime. When memory is allocated to a program, the
JavaScript engine stores data in two primary storage areas which are discussed
below:

### 1. Stack

The stack is a Last-In-First-Out (LIFO) data structure that stores data with a
fixed and known size, such as numbers or strings. JavaScript categorizes
fixed-sized values into primitive types, which include `string`, `number`,
`boolean`, `undefined`, `symbol`, and `null`. These data types are stored on the
stack and are immutable, as shown in the following example:

```javascript
let name = "Stanley";
let num = 15;
let isLogged = true;
let check = null;
```

The variables and their values are allocated on the stack, with the `name`
variable added first and the `check` variable added last, as illustrated in the
illustration below:

![Diagram showing variables on a stack](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e92f38d-491e-4238-899b-4e4ddad30d00/orig =1179x778)

### 2. Heap

The heap is a dynamic memory location that stores elements with an unknown size,
such as arrays, functions, and objects. The heap can expand if more memory is
required, or it can shrink if objects are deleted.

JavaScript stores arbitrarily sized objects on the heap, including functions,
arrays, and objects. These objects' sizes are typically unknown and can change
dynamically, such as when elements are added to or removed from an array. Adding
elements requests more memory from the heap, while removing elements frees up
memory.

The following code demonstrates examples of an object, function, and an array,
typically stored on the heap:

```javascript
const user = {
  name: "Stanley",
  email: "user1@mail.com",
};

function printUser() {
  console.log(`name is ${name}`);
}

const interests = ["bikes", "motorcycles"];
```

We can visualize them as follows:

![diagram of a heap](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1011d40e-8d25-4f19-59c3-df78de437100/md1x =1340x778)

In this example, the variable names are stored on the stack, but the values they
reference are placed on the heap instead.

## Understanding how JavaScript objects hold memory

A Garbage Collector (GC) automatically manages the allocation and freeing of
memory in JavaScript. The GC goes through the heap and deletes all objects that
are no longer needed.

Objects occupy memory in the heap in two ways:

1. **Shallow size**: The amount of heap memory allocated to store the object
   itself.
2. **Retained size**: The amount of memory allocated to the object, including
   the size of all objects referenced by it.

Let's examine how an object creates references using the following example:

```javascript
var user = {
  name: "Stanley",
  email: "user1@mail.com",
};
```

When you define the `user` variable, the `global` object in Node.js references
the object stored on the heap. We can represent this using a graph data
structure:

![diagram showing the root node reference references the user object](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7d1d09a0-845c-41cd-a9ad-ce2efb892c00/orig =305x391)

If later in the code, you set `user` to `null`:

```javascript
user = null
```

The reference from the root is lost, and the object in the heap becomes
unreferenced and garbage.

![Diagram showing the object having no references](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1011bdb-0baf-4330-08ba-1c3fb8ee6900/lg2x =305x391)

As your codebase grows and more objects are stored in the heap, you may end up
with complex references:

![Diagram of a memory graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a144bd1-e2d6-4afa-e423-53e76c78a400/public =739x672)

Now that you understand how objects consume memory in JavaScript, let's learn
about how the garbage collector works in the next section.

## Understanding how the JavaScript Garbage Collector works

In languages like C or C++, programmers manually allocate or free memory on the
heap. However, this is not the case in Node.js whose V8 engine contains a
garbage collector. The GC automatically removes objects that are no longer
required in the heap. It starts from the root node, traverses all object
references, and deletes the ones that don't have any references.

In the following diagram, the garbage collector identifies two nodes (objects)
that don't have any references and are no longer needed:

![diagram showing nodes that have no references and can be classified as garbage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a5b4f17b-1e21-4316-0061-2046a453cc00/lg2x =739x672)

Objects that are not referenced are classified as garbage, and their deletion
frees up memory from the heap.

As your program executes, the garbage collector periodically pauses the
application to remove unreferenced objects from the heap. You don't control when
the garbage collector runs; it runs as it sees fit or when it detects a shortage
of free memory.

### The Mark-and-Sweep Algorithm

The garbage collector uses the mark-and-sweep algorithm to eliminate garbage
data and free up space. The algorithm functions in the following manner:

1. **Mark phase**: the GC traverses from the root (global) and marks all
   referenced objects that are reachable from the root.

2. **Sweep phase**: next, the GC examines all memory from start to finish and
   removes all unmarked objects. This frees up memory in the heap.

Now that we've covered how the GC works, we can proceed to learn about how
memory leaks occur.

## What are memory leaks?

As discussed earlier, the garbage collector deletes all objects that are not
reachable from the root node. However, sometimes objects that are no longer
required in the program are still referenced from the root node or another node
reachable from the root. As a result, the garbage collector assumes that these
objects are still required due to the references. So, every time the garbage
collector runs, the garbage objects survive each garbage collection phase,
causing the program's memory usage to continue growing until it runs out of
memory. This is known as a memory leak.

## Causes of Memory Leaks

This section will discuss some of the most common causes of memory leaks in a
Node.js application.

### 1. Global variables

Global variables are directly referenced by the root node, and they remain in
memory for the entire duration of your application. The garbage collector does
not clean them up.

Consider the following example:

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

const data = [];
app.get("/", (req, res) => {
  data.push(req.headers);
  res.status(200).send(JSON.stringify(data));
});
```

In this snippet, you have a global variable data, which is initially empty.
However, every time a user visits the / route, the request headers object is
appended to the data array. If the app receives 1000 requests, the data array
will grow to 1000 elements, and the memory will persist as long as the app runs.
As the app receives more requests, it will eventually exhaust all allocated
memory and crash.

While this memory leak is easy to identify, it is possible to accidentally
introduce global variables in Node.js that cause memory leaks. For example:

```javascript
function setName() {
  name = "Stanley";
}
setName();
console.log(name);
```

In the `setName()` function, a `name` variable is assigned the value `Stanley`.
Although it might appear to be a local variable of the function, it is a global
variable in non-strict mode. The variable is attached to the global object and
remains in memory as long as your app runs.

If you run the program, the `console.log()` method logs the value of the name
variable in the console, even after the `setName()` memory has been destroyed.

```text
[output]
Stanley
```

### 2. Closures

Another common cause of memory leaks in Node.js is closures. A closure is a
function that is returned from another function and retains the memory of the
parent (outer) function. When the closure is returned and invoked, the data it
holds in memory is not destroyed, and it can be accessed in the program at any
time, leading to a memory leak.

Consider the following example, which has a function that returns an inner
function:

```javascript
function outer(elementCount) {
  // Create an array containing numbers from 0 to elementCount value
  let elements = Array.from(Array(elementCount).keys());

  return function inner() {
    // return a random number
    return elements[Math.floor(Math.random() * elements.length)];
  };
}
```

In the `outer()` function, an array is created with numbers ranging from 0 to
the value of the `elementCount` parameter. The function then returns an
`inner()` function that randomly selects a number from the elements array and
returns it. The `inner()` function is a closure because it retains access to the
scope of the `outer()` function.

To execute the closure, you can call it as follows:

```javascript
let getRandom = outer(10000);
console.log(getRandom());
console.log(getRandom());
```

Here, the `outer()` function is invoked with an argument of `10000`, and it
returns the `inner()` function. The `getRandom()` function then retrieves a
random number from the elements array. You can call `getRandom()` as many times
as you want, and it will always return a different result.

```text
[output]
300
8
```

However, once you have finished using the `inner()` function, you might assume
that its memory has been cleaned up. Unfortunately, the closure retains the
memory of the `outer()` function, and it persists in the heap even after you
have finished using it. The garbage collector will not clean it up because it
assumes that the closure is still required and that you might use it later. This
can result in a memory leak.

### 3. Forgotten Timers

Node.js comes with timers such as setTimeout() and setInterval(). The former
executes a callback function after a specified delay, while the latter executes
a callback function repeatedly with a fixed delay between each execution. These
timers can cause memory leaks, especially when used with closures.

Consider this example:

```javascript
function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
    data.push(counter++); // data array is now part of the callback's scope
    console.log(counter);
    console.log(data);
  };
}

setInterval(increment(), 1000);
```

In this example, the `setInterval()` method runs the `inner()` function returned
by the `increment()` function, repeatedly adding an element to the data array
each time it runs. Since the data array is part of the closure created by
inner(), it remains in memory after each call to increment(), even though it's
no longer needed. As a result, the heap keeps growing over time until the
application runs out of memory.

To avoid this issue, you can clear the timer when it's no longer needed, for
example by calling `clearInterval()` or `clearTimeout()`. It's also a good
practice to avoid using closures in timer callbacks unless necessary, to reduce
the risk of memory leaks.

## Preventing Memory Leaks

In this section, we will discuss best practices to prevent memory leaks in your
Node.js applications.

### 1. Reduce global variables usage

While it may be challenging to eliminate global variables completely, it is
essential to avoid using them whenever possible. If you must use global
variables, set them to null once you are done using them, so the garbage
collector can clean them up.

```javascript
const data = [];
// do some stuff

data = null;
```

Avoid using global variables solely because it is easier to pass them around
your codebase. Group functionality that constantly references a variable in a
class or use ES modules. Use functions as much as possible so that variables can
be locally scoped and destroyed after the function finishes executing.

### 2. Avoid accidental global variables

To avoid creating accidental global variables, use
[ES modules](https://nodejs.org/api/esm.html) in Node.js or the browser. ES
modules run in strict mode by default. Therefore, running the following code
will trigger an error:

```javascript
function setName() {
  name = "Stanley";
}
setName();
console.log(name);
```

```text
[output]
ReferenceError: name is not defined
```

To use ES Modules, add the following line in your `package.json` file:

```javascript
[label package.json]
{
  ...
"type": "module"
}

```

If you cannot switch to ES modules right now, add "use strict" to the top of
each file in your project:

```javascript
"use strict"
...
```

Or use the `--use-strict` flag when running a Node.js program:

```command
node --use-strict program.js
```

In addition, make a habit of using ES6's `const` and `let` to define variables,
which are block-scoped:

```javascript
function setName() {
  [highlight]
  const name = "Stanley";
  [/highlight]
}
setName();
console.log(name);
```

```text
[output]
Uncaught ReferenceError: name is not defined
```

### 3. Clearing timers

As discussed earlier, timers can cause memory leaks if not handled properly. To
prevent such leaks, it's important to clear the timers when they are no longer
needed.

In the following example, we used the `setInterval()` method to repeatedly
execute a function that adds a new item to an array every second:

```javascript
function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
  ...
  };
}
[highlight]
const timerId = setInterval(increment(), 1000);

// Clear the timer after 10 seconds
setTimeout(() => {
  clearInterval(timerId);
}, 10000);
[/highlight]
```

In the code above, the ID of the timer returned by `setInterval()` is stored in
the `timerId` variable, and `setTimeout()` is used to clear the timer after 10
seconds by passing the `timerId` to `clearInterval()` to ensure that the timer
stops running after the specified duration.

Remember that the same principles can be applied to other types of timers, such
as setTimeout(), as well as event listeners or
[EventEmitters](https:/nodejs.org/api/events.html). Always clear the timers and
listeners when they are no longer needed to prevent memory leaks.

## Coping with memory leaks in production

Finding and fixing memory leaks in a large application can be challenging and
time-consuming. While investigating the root cause of the issue, it helps to
deploy some temporary measures to prevent the memory leak from getting out of
hand.

One common strategy is to configure a process manager to auto-restart the
application process when the memory reaches a pre-configured threshold. This
approach helps to clear the process memory, including the heap, allowing the
application to start afresh with an empty memory.

Here's an example that configures [PM2](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/) to auto restart a node
application when it exceeds a certain limit (400 Megabytes in this case):

```javascript
[label ecosystem.config.js:]
module.exports = {
  apps : [{
    name: 'app_name',
    script: 'app.js',
    [highlight]
    max_memory_restart: '400M'
    [/highlight]
    ...
  }]
}
```

With this in place, `pm2` will automatically check memory usage every 30 seconds
and restart the application when the memory limit `400M` has been reached. You
can also use the `--max-memory-restart` option when starting the application:

```command
pm2 start app.js --max-memory-restart 400M
```

Once you have such auto restart strategy in place, you can focus on debugging
and fixing the memory leak, and that's what we will focus on in the rest of this
article.


[summary]
## Side note: Catch memory leaks before they crash your app

While PM2's `max_memory_restart` helps temporarily, [Better Stack's infrastructure monitoring](https://betterstack.com/infrastructure-monitoring) + [error tracking](https://betterstack.com/error-tracking) work together to identify memory leaks before they cause crashes. Track Node.js memory metrics (`nodejs_external_memory_bytes`, heap size, RSS) alongside exception rates to see the full picture.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


[/summary]


## Debugging Node.js memory leaks

In this section, you will learn how to debug the application to identify the
memory leak source and fix it permanently. Starting with Node.js v11.13.0 or
higher, you can use `writeHeapSnapshot()` method of the
[`v8`](https://nodejs.org/api/v8.html) module to take a heap snapshot as your
application is running. If you are using a Node.js version lower than v11.13,
use the [heapdump](https://www.npmjs.com/package/heapdump) package instead.

Once the snapshots have been taken, you can load them in the Chrome DevTools.
The DevTools have a memory panel that allows you to load heap snapshots, compare
them, and give you a summary of the memory usage.

To debug a memory leak, first, create a project directory and move into it:

Before we begin to describe the process of debugging memory leaks, let's create
a Node.js project that contains a memory leak first. Start by creating and
changing into a new project directory using the command below:

```command
mkdir memoryleak_demo && cd memoryleak_demo
```

Next, initialize the project with a `package.json` file:

```command
npm init -y
```

Afterward, install [Express](https://expressjs.com/) and
[`loadtest`](https://www.npmjs.com/package/loadtest) packages in your project
directory. The former is for creating a simple Node.js server, while the latter
is for sending traffic to the server.

```command
npm i express loadtest
```

Once the dependencies are installed, open a new `index.js` file in your text
editor, then add the following code:

```javascript
[label index.js]
const express = require("express");
const app = express();
const PORT = 3000;

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
```

In the above snippet, a memory leak is introduced through the use of the
`headersArray` global variable. Upon each request to the `/` route, the route
handler pushes an object that contains the visitor's user agent to the
`headersArray` array.

Next, modify the code to create a heap snapshot when the `SIGUSR2` signal is
sent to the server:

```javascript
[label index.js]
[highlight]
const v8 = require("v8");
[/highlight]
const express = require("express");
const app = express();
const PORT = 3000;

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

[highlight]
process.on('SIGUSR2', () => {
   const fileName = v8.writeHeapSnapshot();
   console.log(`Created heapdump file: ${fileName}`);

});
[/highlight]

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
```

In this snippet, an event listener is attached to the Node.js process to listen
for the `SIGUSR2` signal which is sent when the `kill` command is executed with
the `-SIGUSR2` option in Linux. Once this event is detected, the callback
function is executed and a heap snapshot file is created in the current
directory.

Once you are done adding the new lines, save the file and execute the program to
start the server on port 3000:

```command
node index.js
```

```text
[output]
Server listening on http://localhost:3000/
```

The output confirms that the server is listening on port `3000`.

Now, let's create our first heap snapshot.

Open another terminal window (or tab) and ensure the application server is still
running in the first terminal. In the second terminal, run the following command
to get the process ID of the Node application that is running on port 3000:

```command
ss -lptn 'sport = :3000'
```

The output will look similar to the following(though the process ID will
differ):

```text
State           Recv-Q          Send-Q                     Local Address:Port                     Peer Address:Port          Process
LISTEN          0               511                                    *:3000                                *:*              users:(("node",pid=13446,fd=21))
```

Copy the process ID in the `process` column, which is the number after `pid=`.
Substitute it on the following command in the second terminal:

```command
kill -SIGUSR2 <the_process_id>
```

Here, you provided the `-SIGUSR2` option to the `kill` command to send a
`SIGUSR2` signal to the Node.js process instead of terminating it. This causes a
new heap snapshot file to the current directory.

Note that creating a heap snapshot is a synchronous operation that will block
the event loop until it is finished, and the time taken to create the snapshot
depends on the size of the heap. Therefore, it's a good idea to create heap
snapshots only when the application traffic is low.

Return to the first terminal window to see the confirmation that the heap dump
has been created:

```text
[output]
Server listening on http://localhost:3000/
Created heapdump file: Heap.20230226.163127.14272.0.001.heapsnapshot
```

Now that the first snapshot has been created, you will use the `loadtest`
package to simulate 7000 HTTP requests to the Node.js app server. In the second
terminal, run the following command:

```command
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```

You will observe a output that looks similar to this:

```text
[output]
INFO Requests: 0 (0%), requests per second: 0, mean latency: 0 ms
INFO Requests: 1817 (26%), requests per second: 364, mean latency: 2.8 ms
INFO Requests: 3367 (48%), requests per second: 310, mean latency: 3.1 ms
INFO Requests: 4689 (67%), requests per second: 264, mean latency: 3.7 ms
INFO Requests: 5802 (83%), requests per second: 223, mean latency: 4.4 ms
INFO Requests: 6779 (97%), requests per second: 195, mean latency: 5 ms
INFO
INFO Target URL:          http://localhost:3000/
INFO Max requests:        7000
INFO Concurrency level:   1
INFO Agent:               keepalive
INFO
INFO Completed requests:  7000
INFO Total errors:        0
INFO Total time:          26.827927721000002 s
INFO Requests per second: 261
INFO Mean latency:        3.7 ms
INFO
INFO Percentage of the requests served within a certain time
INFO   50%      3 ms
INFO   90%      4 ms
INFO   95%      5 ms
INFO   99%      8 ms
INFO  100%      436 ms (longest request)
```

In the output, `Completed requests: 7000` confirms that the requests have been
successfully sent. To regain the prompt in the second terminal so that you can
enter more commands, press `CTRL+ C`.

Next, run the `kill` command again to create a second heap snapshot that you
will use soon for comparison:

```command
kill -SIGUSR2 <your_process_id>
```

In the first terminal, you will see confirmation that the second snapshot file
has been created:

```text
[output]
Server listening on http://localhost:3000/
Created heapdump file: Heap.20230226.163127.14272.0.001.heapsnapshot
Created heapdump file: Heap.20230226.163444.14272.0.002.heapsnapshot
```

At this point, you have created two snapshot files. One when the application
just started running, and the other after some load has been sent to the server:

Next, open Chrome and visit `http://localhost:3000/` to get an idea of the data
stored in the `headersArray`:

![screenshot of the data shown on route "/"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b7737b30-ea96-437d-4c59-2a8b527c3700/md1x =1045x641)

Due to the simulated 7000 visits to the server using `loadtest`, the
`headersArray` has 7000 objects with the `userAgentUsed` property set to the
`loadtest/5.2.0` value.



## Analyzing Node.js heap snapshots using the Chrome DevTools

After creating the snapshot files, you need to analyze them using Chrome
DevTools to locate the memory leak. Therefore, open the Chrome DevTools in your
browser tab and switch to the memory panel:

![Screenshot of the memory panel](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf01be2c-be5d-4233-df6e-7e56c7119700/md2x =1294x743)

Click the **Load** button to open your operating system's file picker. Locate
the first heap dump in your application directory and select it:

![Screenshot of the "load" button marked](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ee9d72e1-6881-40a5-cad5-89336e730f00/public =1294x743)

Repeat the process once again to load the second heap dump file. You will now
see the two heap dumps loaded:

![Heap dumps loaded in Chrome](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d298c5c8-ad75-4806-22be-53314db83800/md2x =1294x743)

Now, click the second heap dump file and select **Statistics**. The panel will
give you an idea of what kind of data is taking space in the heap:

![Screenshot of showing the memory usage of code, strings, arrays, etc](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/395f9e68-7939-443d-e773-5120fe7f1e00/orig =1035x320)

If you observe closely, you will notice that **Strings** is using most of the
memory in the heap, which is 3046kb. It is followed by the **Code**, which
includes your application code, as well as all the code in the `node_modules`
directory.

Observing the statistics give you a hint of the objects you need to investigate
to find the memory leak. We already know that we have over 7000 objects in the
`headersArray`. This can mislead you into thinking that **JS arrays** should be
the one using the most memory since `headersArray` is an array. The best thing
you can do for now is to trust the data you are looking at on the chart and take
note of what is taking the most memory, which is the strings here.

Next, you will compare the differences between the two heap snapshots by
selecting the **Comparison** option:

![Screenshot showing the Comparison option selected](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a50b9910-7736-4c3b-a8c1-fbb9d4718c00/lg2x =1294x743)

When you select this option, the objects in the heap of the first snapshot will
be compared with the ones in the second snapshot.

Let's go over some of the columns in the table and what they mean:

- **Constructor**: Shows the type of Constructor used.
- **New**: The new objects that have been added to the heap.
- **Deleted**: The objects that have been deleted.
- **Delta**: The number of objects created and deleted in the heap. If a number
  is prefixed with `+`, it represents the number of objects added. When prefixed
  with `-`, it represents the number of objects deleted.
- **Alloc. Size**: The amount of memory allocated to the constructor
- **Freed Size**: The amount of memory freed after deleting objects.

Our focus will be on the **Delta** column. First, click on the **Delta** column
header twice to sort the column values from highest to lowest.

![Screenshot of the delta column sorted](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/579ca2f2-99bf-4189-6018-c68caee88300/md2x =1266x336)

If you look at the column, you will see that over 7000 new objects have been
added for the constructor **Object** and **(string)** also has close to 7000
objects. This confirms that there is a memory leak. Usually, when there is no
memory leak, the column shows you negative values, 0, or smaller positive
values.

To investigate the source of the memory leak, we will need to expand the
**(string)** object. This is easier to do in the **Summary** panel. To switch to
the panel, choose the **Summary** option, and then select the **Objects
allocated between snapshot 1 and snapshot 2** option.

![Screenshot of the summary panel](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4b8c1935-fb72-4a4f-1e51-20bb4eab6500/orig =1091x472)

Once you are in the **Summary** panel, double-click the **Shallow Size** panel
to sort the column from highest to lowest.

![Screenshot of the Summary panel with the **Shallow Size** field marked to sort the column from highest to lowest](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1283db8f-ed53-4f86-d5f0-9baea51e3b00/lg2x =1104x491)

Let's briefly go over over the columns in this panel:

- **Constructor**: Shows the type of Constructor used for the data in the heap.
- **Distance**: The number of references between the root and the object.
- **Shallow size**: The amount of heap memory allocated to store the object
  itself.
- **Retained size**: The amount of memory allocated to the object, including the
  size of all the objects it references.

Following this, looking closely at the **(string)** and **Object** constructor
rows:

![Screenshot showing that **(string)** and **Object** constructors are taking a lot of space in the heap](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/67202791-500f-4697-a244-742b56d44700/md2x =1101x487)

You should now be able to see that both **(string)** and **Object** constructors
show that they have over 7000 objects. In the **Shallow Size** and **Retained
Size** columns, they are also taking a lot of memory in bytes more than the
constructors below. This further confirms what we have seen from the
**Statistics** and the **Comparison** panel. So we are on the right track.

If you recall the **Statistics** panel showed that **String** is taking more
objects. So let's expand **(string)**:

![Screenshot of (string) expanded](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4c1c0fc-84b1-4aef-360c-9ec99c156e00/public =1103x288)

Next, scroll down until you see rows that look like the following:

![Screenshot of the memory leak strings found](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1dbaa484-fb4d-4cee-01a4-f7bb957bab00/lg1x =1091x480)

This matches with what we saw when we visited `http://localhost:3000/` earlier.
So it is a good place to stop and investigate further.

Next, click on the first or any of the strings containing `loadtest/5.2.0`,
which is the user agent of the `loadtest` library.

![Screenshot showing the source of the memory leak](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/44f67235-fbc1-4963-e2ac-0dc685887b00/md2x =1091x664)

If you don't see the expanded objects, drag up the **Retainers** panel.

In the screenshot, there is a lot of important information Chrome is providing.
For starters, `userAgentUsed` has shown up, which is the first hint of where the
string is getting a reference. Second, `[282] in Array`, tells you that the
element `userAgentUsed` resides in an array. Next, you'll see
`headersArray in system`, which tells you the name of the array.

You can use this information to go back to the source code and investigate how
the program is interacting with the array. For our program, we already know that
the source is the `headersArray` global variable, but if we didn't know, this
would have given us a hint. Of course, most memory leaks investigation won't be
a bit straightforward as this. You would have to click on multiple objects or
expand them.

### Fixing the memory leak

You have now found the source of the memory leak, and it is the `headersArray`.
Every time a user visits the `/` endpoint, an object is pushed to the
`headersArray` with no mechanism in place to clear the array.

To fix the memory leak, the following are some of options you can use:

- Store the user agent objects in the file system instead of storing them in the
  `headersArray`. You can write the data to a JSON, CSV, or text file.
- You can also store the data in a database system, which includes
  [SQlite](https://www.sqlite.org/index.html), [MySQL](https://www.mysql.com/),
  or [Postgres](https://www.postgresql.org/).

Once you have made the changes, you can create two heap snapshots as you have
done earlier in the article and load them in the Chrome Devtools.

When you switch to the **Comparison** panel, you will see that fewer objects
have been added.

![Screenshot of the delta column showing that there are few objects being added](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b976efc-bc4a-408b-0665-0a01195a6c00/lg1x =1293x447)

In the first comparison, you had the constructors **Object** and **(string)** at
the top with close to 7000 objects. That is no longer the case, proving that the
memory leak has been fixed.

That takes care of the memory leaks. Next, you will look at the tools you can
use to detect memory leaks.

## Monitoring memory usage in Node.js with Prometheus

Memory monitoring tools track the memory usage of your application and give you
insights into how your application is using memory through reports/graphs. You
can usually configure such tools to alert you when memory usage is too high. In
this section, you will monitor memory usage with
[Prometheus](https://prometheus.io) and configure it to alert you when a
specified memory threshold is reached.

Before you can proceed, you must [download Prometheus](https://prometheus.io)
and install it on your machine. You may
[follow this tutorial](https://devopscube.com/install-configure-prometheus-linux/)
to download and install Prometheus on Linux, and to get it up and running.

After Prometheus is installed, ensure that it is running before proceeding:

```command
sudo systemctl status prometheus
```

```text
[output]
prometheus.service - Prometheus
     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-03-02 11:41:28 CAT; 36s ago
   Main PID: 19530 (prometheus)
      Tasks: 9 (limit: 9302)
     Memory: 22.3M
        CPU: 287ms
     CGroup: /system.slice/prometheus.service
             └─19530 /usr/local/bin/prometheus --config.file /etc/prometheus/prometheus.yml --storage.tsdb.path /var/lib/prometheus/ --web.co>
```

In the output, if you see `Active: active (running)`, then Prometheus is
running.

Return to your terminal and install the
[prom-client](https://www.npmjs.com/package/prom-client) package in the
application directory. It is a Prometheus client for Node.js applications.

```command
npm install prom-client
```

We'll reuse the original example in the last section that has a memory leak:

```javascript
[label index.js]
const v8 = require("v8");
const express = require("express");
const app = express();
const PORT = 3000;

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  console.log(`Created heapdump file: ${fileName}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
```

Add the highlighted lines to set the `/metrics` endpoint that Prometheus will
scrap later:

```javascript
[label index.js]
const v8 = require("v8");
[highlight]
const client = require("prom-client");
[/highlight]
const express = require("express");
const app = express();
const PORT = 3000;

[highlight]
const register = new client.Registry();
client.collectDefaultMetrics({ register });
[/highlight]

const headersArray = [];
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

[highlight]
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});
[/highlight]

process.on("SIGUSR2", () => {
  const fileName = v8.writeHeapSnapshot();
  console.log(`Created heapdump file: ${fileName}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

```

The `prom-client` module is imported and used to instantiate the registry to
collect metrics for Prometheus. Next, the `/metrics` endpoint is created to
exposes all the metrics collected by Prometheus.

When you're finished, save the file and start the server again:

```command
node index.js
```

Return to Chrome and visit `http://localhost:3000/metrics`. You will see the
following page:

![Screenshot of the metrics that Prometheus will scrap](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/213493ed-0155-43bb-a551-296411d6cb00/md2x =1292x741)

Now that the endpoint is working, you should keep the server running so that
when we configure Prometheus, it should be able to scrap this endpoint.

Prometheus uses a configuration file to define the scraping targets, which are
running instances. The `memoryleak_domo` app instance runs on port `3000`. For
Prometheus to scrap it, you need to define it as the target.

Open the Prometheus configuration file and add the highlighted code to add an
entry for the `memoryleak_demo` app:

```javascript
[label /etc/prometheus/prometheus.yml]
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
[highlight]
  - job_name: 'memoryleak_demo'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:3000']
[/highlight]
```

In the preceding configuration file, Prometheus will scrap two targets:

- `prometheus`: A scrapping job of itself that is scrapped every 5 seconds as
  defined with the `scrape_interval` property.
- `memoryleak_demo`: A scrapping job for the `memoryleak_demo` app you created
  earlier in the section. It will be scrapped every 5 seconds as well.

At this point, restart Prometheus to ensure that the new changes take effect:

```command
sudo systemctl restart prometheus
```

Next, visit `http://localhost:9090/targets` to view the targets that Prometheus
is currently scrapping. You will see that Prometheus recognizes the
`memoryleak_demo` job. It has detected the `http://localhost:3000/metrics`
endpoint in the **Endpoint** field and that the instance is running(`UP`) in the
**State** field.

![Screenshot of Prometheus confirming that it can monitor the endpoint of your app](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10097c48-b8a3-4e9f-ef2d-373f853db700/orig =1292x741)

Next, visit `http://localhost:9090/graph` to view the Prometheus console which
allows you to enter queries. Enter the expression `nodejs_external_memory_bytes`
to check the memory usage. Following that, press **Execute** and switch the
**Graph** tab:

![Screenshot showing a memory usage graph](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ba1627ad-8fdc-42bb-6e87-f397eada6700/public =1292x741)

Prometheus plots a graph that shows the current application's memory usage,
which is around 1MB.

In a second terminal, simulate the traffic to the app:

```command
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```

Return to the Prometheus graph page, and press **Execute** once again. You will
observe that the memory usage has grown to over 5MB:

![Screenshot of the Prometheus Graph 5MB memory usage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/88b671b1-4e04-437e-0b08-0b59e049ac00/md2x =1250x605)

## Send alerts on high memory usage

Now that you can observe your application's memory usage via the Prometheus
interface, the next step is to configure it to alert you when the memory usage
reaches a specific threshold.

You can use the
[Prometheus Alertmanager](https://github.com/prometheus/alertmanager) to send
alerts to your preferred channel which could be Email, Slack, and any service
that provides a webhook receiver.

In this tutorial, we will configure Alertmanager to use Gmail to send email
notifications. First, you need to to install the program on your machine. You
can do this by
[following this tutorial up until step 7](https://acloudguru.com/hands-on-labs/installing-prometheus-alertmanager).

Once you've installed Alertmanager, make sure that it is running on your system:

```command
sudo systemctl status alertmanager
```

You will receive output that looks like this:

```text
[output]
alertmanager.service - Prometheus Alert Manager Service
     Loaded: loaded (/etc/systemd/system/alertmanager.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2023-02-28 21:12:22 CAT; 6s ago
   Main PID: 24277 (alertmanager)
      Tasks: 9 (limit: 9302)
     Memory: 13.2M
        CPU: 205ms
     CGroup: /system.slice/alertmanager.service
             └─24277 /usr/local/bin/alertmanager/alertmanager --config.file=/usr/local/bin/alertmanager/alertmanager.yml

```

The output confirms that the Alertmanager service is active. Visit
`http://localhost:9093/` and you will see the following page, further confirming
that it works:

![screenshot of the Alertmanager homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89646e39-f302-4260-b0e4-abeb502d3500/lg2x =1292x741)

At this stage, you should configure an app password for your Gmail account so
that you can use it to send emails through Alertmanager. You can do this by
heading to
[Google My Account → Security](https://myaccount.google.com/security?hl=en),
and enabling 2-Step Verification.

![Enable Google 2fa](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/64e634c0-af78-4f62-0f63-df519ee2e700/orig =1142x357)

Afterward, find the [App passwords](https://myaccount.google.com/apppasswords)
section, and create a new app password. Choose the **Other (custom name)**
option and type **Alertmanager** in the resulting text field. Once done, click
the **GENERATE** button.

![App passwords](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea9e9ff6-be53-4480-1ee6-08707d880300/orig =983x738)

Copy the password presented in the popup dialog and paste it somewhere safe. You
won't be able to see it again.

![Copy app password screen](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/855efbe6-abdf-4240-d9fe-593b3fb4c800/public =887x691)

Now, return to your terminal and open the `alertmanager.yml` config file in your
text editor:

```command
sudo nano /etc/alertmanager/alertmanager.yml
```

```yml
[label /etc/alertmanager/alertmanager.yml]

global:
  resolve_timeout: 1m

route:
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: 'gmail-notifications'

receivers:
- name: 'gmail-notifications'
  email_configs:
  - to: <example2@gmail.com>
    from: <example@gmail.com>
    smarthost: smtp.gmail.com:587
    auth_username: <example@gmail.com>
    auth_identity: <example@gmail.com>
    auth_password: <app_password>
    send_resolved: true
```

In the Alertmanager config, replace all `example@gmail.com` with the Gmail
account that Alertmanager should use to send emails. Update the `to` property
with the receiver's email address. In the`auth_password` property, replace
`<app_password>` with the app password you generated with your Google account.

Next, add the following in the `alerts.yml` file to define the rules that should
trigger the alert:

```command
sudo nano /etc/prometheus/alerts.yml
```

```yml
[label /etc/prometheus/alerts.yml]
groups:
- name: memory leak
  rules:
  - alert: High memory Usage
    expr: avg(nodejs_external_memory_bytes / 1024) > 2000
    for: 1m
    annotations:
      severity: critical
      description: memory usage high
```

In the preceding code, you configure Prometheus to send an alert when memory
usage for the Node.js application is greater than 2000 KB (2 MB) for 1 minute.
The expression `avg(nodejs_external_memory_bytes / 1024) > 2000` checks if
memory usage is over 2 MB, and `for` is set to `1m` (1 minute).

Now that you have defined the rules, create a reference to the `alerts.yml` file
and add an entry for the Alertmanager in the Prometheus config:

```command
sudo nano /etc/prometheus/prometheus.yml
```

```yml
[label /etc/prometheus/prometheus.yml]
global:
  scrape_interval: 15s

[highlight]
rule_files:
  - "/etc/prometheus/alerts.yml"

alerting:
  alertmanagers:
  - static_configs:
    - targets:
       - localhost:9093
[/highlight]

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'memoryleak_demo'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:3000']
```

Restart Alertmanager to reflect the new changes:

```command
sudo systemctl restart alertmanager
```

Also, restart Prometheus:

```command
sudo systemctl restart prometheus
```

Next, let's do a final load test to trigger the alert:

```command
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```

Visit `http://localhost:9093/#/alerts`. It might take a while to see something
like this:

![Screenshot of Alertmanager confirming that there is an alert](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8c89211b-8321-4e2b-56a5-c150ebe9c000/public =1292x741)

Next, visit `http://localhost:9090/alerts?search=`, which is the Prometheus
alerts page. You should observe that an alert is firing:

![Screenshot of Prometheus comfirming an alert has been fired](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9c307f16-1805-47cb-f809-b42a61201b00/orig =1292x741)

After a few minutes, you should also receive an email that looks like this:

![Screenshot of the email alert received on Gmail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/34791131-653f-41e0-6427-85cb80c7a700/md2x =979x570)

At this point, you have successfully monitored the application using Prometheus,
and configured Alertmanager to send email notifications when memory usage is
high.

## Final thoughts and next steps

In this article, you have gained an understanding of how memory leaks can be
introduced into a codebase, and explored techniques for both preventing and
temporarily fixing such leaks. Furthermore, you have learned how to debug a
memory leak by identifying its source and implementing a solution. Finally, you
have discovered how to monitor an application using Prometheus, and how to
configure it to send email alerts via Gmail.

To continue your journey of memory profiling with DevTools, you can visit the
[Chrome documentation](https://developer.chrome.com/docs/devtools/memory-problems/)
for more information. Also, if you're interested in delving deeper into how
JavaScript manages memory, the
[Memory Management tutorial on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
is a great resource. Lastly, to further enhance your knowledge of monitoring
applications using Prometheus, you can
[explore the Prometheus docs](https://prometheus.io/docs/introduction/overview/)
for a comprehensive overview.

Thanks for reading!