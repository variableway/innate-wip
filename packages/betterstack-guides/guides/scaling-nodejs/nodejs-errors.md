# 16 Common Errors in Node.js and How to Fix Them

While developing Node.js applications, you're bound to encounter various errors.
However, many of these can be prevented or quickly resolved with good coding
practices.

Finding solutions to Node.js errors can be time-consuming as they're often
scattered across forums and GitHub issues. To help streamline this process, I've
compiled this list of 16 common Node.js errors and strategies to fix them.

Although this guide isn't exhaustive, it discusses the common reasons why each
error occurs and offers practical solutions to help you avoid these issues going
forward.

Let's dive in!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xtwlXAsYbz0?si=qVwMRm4OItkqMm9V" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 1. Node.js heap out of memory

The Node.js "Heap Out of Memory" error occurs when your program exceeds the
available memory limit of the V8 JavaScript engine's heap space. This heap space
is where dynamic memory allocation happens for JavaScript objects.

It could be caused by one of the following:

1. **Memory leaks**: Commonly caused by accumulating unused or unreferenced
   objects in memory, without being properly released.
2. **Reading large datasets**: Handling large amounts of data in memory at once
   without efficient memory management or pagination.
3. **Default memory limit**: Node.js has a default memory limit which may not be
   sufficient for all applications.

To fix these issues, profile your application to identify memory leaks and
refactor your code to be more memory efficient. You can also use the
`--max-old-space-size` flag to increase the V8 heap memory limit to a more
appropriate value for your application:

```command
node --max-old-space-size=4096 server.js
```

Or you can do it globally for all your Node.js scripts like this:

```command
export NODE_OPTIONS=--max_old_space_size=4096
```

When working with large datasets, ensure not to read everything into memory but
use Node.js streams to process them in chunks. In some cases,
[regular application restarts](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/#restarting-based-on-memory-usage)
can help clear the heap space, but this is a temporary workaround.

**Learn more**: [Preventing and Debugging Memory Leaks in
Node.js](https://betterstack.com/community/guides/scaling-nodejs/high-performance-nodejs/nodejs-memory-leaks/)


[summary]
### Track and resolve Node.js errors in production with Better Stack
Knowing how to fix Node.js errors is one thing—catching them in production is another. [Better Stack](https://betterstack.com/error-tracking) provides AI-native error tracking with automatic stack trace analysis, session replay, and one-click integration with Sentry SDKs. Get instant alerts on Slack or email when errors spike, and use built-in incident management to resolve issues faster.
**Sentry-compatible at 1/6th the price.** Start free in minutes.
[/summary]

![Better Stack error tracking dashboard](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/91d5b92f-4597-40cd-c51e-5a73c7b2ee00/lg1x =2350x1002)



## 2. ECONNRESET

The `ECONNRESET` exception occurs when a TCP connection is unexpectedly
terminated by the client or server. This issue could arise when you send an
external request but do not receive a timely response. It could also occur when
you try to respond to a client request, but the connection has already been
closed.

The error usually manifests as a "socket hang up" and displays various details
depending on your Node.js version:

```text
[output]
Error: socket hang up
    at connResetException (node:internal/errors:691:14)
    at Socket.socketOnEnd (node:_http_client:466:23)
    at Socket.emit (node:events:532:35)
    at endReadableNT (node:internal/streams/readable:1346:12)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  code: 'ECONNRESET'
}
```

When this error occurs during an external request, you could retry it or queue
it for later. You could also adjust your timeout settings for longer waits. For
instance:

```javascript
const response = await axios.get(
  'https://example.com',
  {
    [highlight]
    timeout: 5000, // 5 seconds
    [/highlight]
  }
);
```

If the error results from a client intentionally closing a request to your
server, terminate the connection (using `res.end()` or similar), and stop any
ongoing response generation processes (like database queries).

You can detect closed client sockets by monitoring the `close` event on the
request and checking `res.socket.destroyed`:

```javascript
app.get("/", (req, res) => {
  // listen for the 'close' event on the request
  req.on("close", () => {
    console.log("closed connection");
  });

  console.log(res.socket.destroyed); // true if socket is closed
});
```

## 2. ENOTFOUND

The `ENOTFOUND` exception in Node.js arises when it's unable to establish a
connection to a domain due to a DNS error. It is commonly caused by incorrect
`host` values, improper mapping of `localhost` to `127.0.0.1`, or a typo in the
domain name.

This error typically presents itself in the Node.js console as follows:

```text
[output]
Error: getaddrinfo ENOTFOUND http://localhost
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:71:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'http://localhost'
}
```

If you get this error in your Node.js program, try the following strategies to
fix it:

### 1. Verify the domain name

First, ensure that the domain name is entered correctly without typos. You can
also use a tool like [DNS Checker](https://dnschecker.org/) to confirm that the
domain is resolving successfully in your location or region.

![DNS Checker](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/73cc3771-a556-45c7-c17d-5992072c3100/public
=2612x1564)

### 2. Inspect the host value

When using `http.request()` or `https.request()`, the provided `host` property
should only include the domain name or IP address, not the protocol, port, or
path.

```javascript
// Incorrect use
const options = {
  host: 'http://example.com/path/to/resource',
};

// Correct use
const options = {
  host: 'example.com',
  path: '/path/to/resource',
};

http.request(options, (res) => {});
```

### 3. Check your localhost mapping

If attempting to connect to `localhost` leads to an `ENOTFOUND` error, your
`/etc/hosts` file might not include the necessary mapping. For Linux and macOS,
check that the file contains the following:

```text
[label /etc/hosts]
127.0.0.1   localhost
```

After updating, flush your DNS cache. The command varies by system, so ensure
you use the correct one for your OS. For macOS:

```command
sudo killall -HUP mDNSResponder
```

On Linux, refer to your specific distribution and DNS service to determine the
right command.

## 4. ETIMEDOUT

The `ETIMEDOUT` error in Node.js indicates an ongoing connection or HTTP request
was aborted due to a timeout. This error is common if you have specific timeout
settings for your outgoing HTTP requests.

To address this, intercept the error and retry the request, ideally employing an
[exponential backoff method](https://en.wikipedia.org/wiki/Exponential_backoff).
This approach gradually increases the wait time between retries, improving the
chances of success over time or until a maximum retry limit is hit. The
[fetch-retry](https://www.npmjs.com/package/fetch-retry) package can help you
with this.

If `ETIMEDOUT` errors are a regular occurrence, reassess your [request timeout
settings](https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/) to ensure they're optimally configured for the target
URL. You should also ensure that your server's
[keepAliveTimeout](https://nodejs.org/api/http.html#serverkeepalivetimeout)
value is greater than your client timeout. If a client's timeout exceeds the
server's, it might mistakenly perceive a dead socket as active.

```javascript
import express from 'express';
const app = express();
const server = app.listen(8080);

[highlight]
server.keepAliveTimeout = 15 * 1000;
server.headersTimeout = 16 * 1000;
[/highlight]
```

## 5. ECONNREFUSED

The `ECONNREFUSED` error occurs when Node.js attempts to establish a connection
to a specified address but fails because the endpoint is unreachable, typically
due to the target service being inactive. An example of this error is trying to
connect to `http://localhost:8000` without an active listener at that port:

```text
Error: connect ECONNREFUSED 127.0.0.1:8000
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1157:16)
Emitted 'error' event on ClientRequest instance at:
    at Socket.socketErrorListener (node:_http_client:442:9)
    at Socket.emit (node:events:526:28)
    at emitErrorNT (node:internal/streams/destroy:157:8)
    at emitErrorCloseNT (node:internal/streams/destroy:122:3)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -111,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 8000
}
```

To resolve this issue, confirm that the target service is operational and ready
to accept connections at the specified endpoint.

## 6. ERRADDRINUSE

The `ERRADDRINUSE` error arises when a web server tries to bind to a port
already used by another application. This often happens during the initiation or
restart of a server, and it typically looks like this:

```text
Error: listen EADDRINUSE: address already in use :::3001
    at Server.setupListenHandle [as _listen2] (node:net:1330:16)
    at listenInCluster (node:net:1378:12)
    at Server.listen (node:net:1465:7)
    at Function.listen (/home/ayo/dev/demo/node_modules/express/lib/application.js:618:24)
    at Object.<anonymous> (/home/ayo/dev/demo/main.js:16:18)
    at Module._compile (node:internal/modules/cjs/loader:1103:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1357:8)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  code: 'EADDRINUSE',
  errno: -98,
  syscall: 'listen',
  address: '::',
  port: 3001
}
```

To resolve this, consider changing your application to listen on a different
port, ideally by adjusting an environment variable. If you specifically require
the port currently in use, determine the process ID of the offending service
using:

```command
lsof -i tcp:<target_port>
```

As in:

```command
lsof -i tcp:3001
```

You'll see output like:

```text
[output]
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    2902  ayo   19u  IPv6 781904      0t0  TCP *:3001 (LISTEN)
```

Terminate the process occupying the port with the `kill` command and the `PID`
number:

```command
kill -9 2902
```

Executing the command above will forcefully close the application, freeing the
port for your use.

## 7. EADDRNOTAVAIL

The `EADDRNOTAVAIL` error occurs when attempting to run a Node.js server on a
specific port and IP address configuration that isn't available. It often points
to an issue with the IP address setup, like trying to bind the server to an
unavailable static IP:

```javascript
const express = require('express');
const app = express();

const server = app.listen(3000, '192.168.0.101', function () {
  console.log('server listening at port 3000......');
});
```

```text
[output]
Error: listen EADDRNOTAVAIL: address not available 192.168.0.101:3000
    at Server.setupListenHandle [as _listen2] (node:net:1313:21)
    at listenInCluster (node:net:1378:12)
    at doListen (node:net:1516:7)
    at processTicksAndRejections (node:internal/process/task_queues:84:21)
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1357:8)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  code: 'EADDRNOTAVAIL',
  errno: -99,
  syscall: 'listen',
  address: '192.168.0.101',
  port: 3000
}
```

To fix this, confirm that the IP address is correct and currently assigned to
your machine (it might have changed). Alternatively, bind the server to all
available IP addresses using `0.0.0.0`, which allows it to listen on any network
interface:

```javascript
const server = app.listen(3000, '0.0.0.0', function () {
  console.log('server listening at port 3000......');
});
```

[ad-logs]

## 8. ECONNABORTED

The `ECONNABORTED` exception occurs in Node.js when a server prematurely aborts
an active network connection before it finishes reading from the request body or
writing to the response body. Below is an example of how this issue might
manifest in a Node.js application:

```javascript
const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'new.txt'), null, (err) => {
    console.log(err);
  });
  res.end();
});

const server = app.listen(3000, () => {
  console.log('server listening at port 3001......');
});
```

```text
[output]
Error: Request aborted
    at onaborted (/home/ayo/dev/demo/node_modules/express/lib/response.js:1030:15)
    at Immediate._onImmediate (/home/ayo/dev/demo/node_modules/express/lib/response.js:1072:9)
    at processImmediate (node:internal/timers:466:21) {
  code: 'ECONNABORTED'
}
```

The issue arises because `res.end()` is called before `res.sendFile()` can
complete due to its asynchronous nature. To resolve this, ensure `res.end()` is
only called after the file-sending process is complete by placing it inside the
callback function:

```javascript
app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'new.txt'), null, (err) => {
    console.log(err);
    res.end();
  });
});
```

## 9. EHOSTUNREACH

The `EHOSTUNREACH` exception in Node.js signifies a TCP connection attempt's
failure due to the absence of any route to the desired network or host. This
issue might arise from the routing protocols in the operating system, blockages
by firewalls, or signals from intermediate gateways or nodes indicating
inaccessibility.

If you encounter this error, it's advisable to inspect and adjust your system's
routing tables or firewall configurations to establish a clear path to the
target host or network.

## 10. EAI_AGAIN

The `EAI_AGAIN` error in Node.js is thrown when there's a temporary failure in
resolving domain names, often due to a DNS lookup timeout. This indicates
potential issues with your network connection or proxy settings and might occur
when performing tasks like installing an `npm` package:

```text
[output]
npm ERR! code EAI_AGAIN
npm ERR! syscall getaddrinfo
npm ERR! errno EAI_AGAIN
npm ERR! request to https://registry.npmjs.org/nestjs failed, reason: getaddrinfo EAI_AGAIN registry.npmjs.org
```

If your internet connection is stable, the next steps involve checking your DNS
resolver settings, typically found in `/etc/resolv.conf`, and ensuring your
`/etc/hosts` file is correctly configured. These actions can help address and
resolve the temporary DNS resolution failure.

## 11. ENOENT

The `ENOENT` error, standing for "Error No Entity", indicates that the specified
path for a file or directory does not exist in the filesystem. This error is
commonly encountered when using the `fs` module or when a script operates under
an expected directory structure that isn't present.

```javascript
fs.open('non-existent-file.txt', (err, fd) => {
  if (err) {
    console.log(err);
  }
});
```

```text
[output]
[Error: ENOENT: no such file or directory, open 'non-existent-file.txt'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'non-existent-file.txt'
}
```

Ensure the file or directory you're attempting to access exists to resolve this
error. This might involve creating the missing entities or correcting the
script's path to point to the right location.

When working with user-supplied paths, ensure that your program handles such
errors gracefully by reporting the problem in a user-friendly manner or
activating fallback behavior.

## 12. EISDIR

The `EISDIR` error occurs when a Node.js operation expects a file but receives a
directory instead. This typically happens during file system operations where
the target should be a file, but a directory path is provided.

```javascript
// config is a directory
fs.readFile('config', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

```text
[output]
[Error: EISDIR: illegal operation on a directory, read] {
  errno: -21,
  code: 'EISDIR',
  syscall: 'read'
}
```

To remedy this, ensure the path you're using in your operation points to a file
rather than a directory. Adjusting the path to reference a valid file should
resolve the `EISDIR` error.

## 13. ENOTDIR

The `ENOTDIR` error is the opposite of the `EISDIR` error; it occurs when a
directory is expected, but a file path is provided instead.

```javascript
fs.opendir('/etc/passwd', (err, _dir) => {
  if (err) throw err;
});
```

```text
[output]
[Error: ENOTDIR: not a directory, opendir '/etc/passwd'] {
  errno: -20,
  code: 'ENOTDIR',
  syscall: 'opendir',
  path: '/etc/passwd'
}
```

To resolve the `ENOTDIR` error, verify that the path you're referencing in your
operation points to a directory, not a file. Correcting the path to target an
actual directory should eliminate the issue.

## 14. EACCES

The `EACCES` error occurs when an operation attempts to access a file or
resource without the necessary permissions. It's common when trying to read or
modify protected files, install global packages in restricted directories, or
run servers on ports below 1024.

For example, running this program:

```javascript
import fs from 'node:fs';

fs.readFile('/etc/sudoers', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

Results in:

```text
[output]
[Error: EACCES: permission denied, open '/etc/sudoers'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'open',
  path: '/etc/sudoers'
}
```

This error means the user lacks the necessary permissions. While using `sudo`
for script execution can bypass this, it's not recommended due to
[security concerns](https://syskall.com/dont-run-node-dot-js-as-root). Instead,
adjust the permissions with the `chown` command for files or directories as
needed:

```command
sudo chown -R $(whoami) /path/to/directory
```

For `EACCES` errors on ports below 1024, consider using a higher port and
redirect traffic using iptables:

Essentially, this error indicates that the user executing the script does not
have the required permission to access a resource. A quick fix is to prefix the
script execution command with `sudo` so that it is executed as root, but this is
a bad idea
[for security reasons](https://syskall.com/dont-run-node-dot-js-as-root/).

The correct fix for this error is to give the user executing the script the
required permissions to access the resource through the `chown` command on Linux
in the case of a file or directory.

```command
sudo chown -R $(whoami) /path/to/directory
```

For `EACCES` errors on ports below 1024, consider using a higher port and
redirect traffic using `iptables`. The following command forwards HTTP traffic
going from port 80 to port 8080 (assuming your application is listening on port
8080):

```command
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
```

For issues with global installations, it's likely due to the system versions of
Node.js and npm. Uninstall these and use a version manager like
[FNM](https://github.com/Schniz/fnm) or [Volta](https://volta.sh/) for a safer
and more flexible setup.

## 15. EEXIST

The `EEXIST` error in Node.js is a filesystem error that occurs when an
operation is attempted on a file or directory that already exists, but the
operation requires that the entity not exist. A typical scenario is trying to
create a directory with a name that is already taken:

```javascript
import fs from 'node:fs';

fs.mkdirSync('temp', (err) => {
  if (err) throw err;
});
```

```text
[output]
Error: EEXIST: file already exists, mkdir 'temp'
    at Object.mkdirSync (node:fs:1349:3)
    at Object.<anonymous> (/home/ayo/dev/demo/main.js:3:4)
    at Module._compile (node:internal/modules/cjs/loader:1099:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:975:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)
    at node:internal/main/run_main_module:17:47 {
  errno: -17,
  syscall: 'mkdir',
  code: 'EEXIST',
  path: 'temp'
}
```

To avoid this error, it's a good practice to check for the existence of a path
before attempting to create it. Use `fs.existsSync()` to verify if the directory
already exists and proceed accordingly:

```javascript
import fs from 'node:fs';

[highlight]
if (!fs.existsSync('temp')) {
[/highlight]
  fs.mkdirSync('temp', (err) => {
    if (err) throw err;
  });
}
```

## 16. EPERM

The `EPERM` error is typically encountered during operations like installing an
NPM package and signals that the operation couldn't be completed due to
insufficient permissions. It's often seen when an attempt is made to write to a
file that is in a read-only state, and it might sometimes overlap with an
`EACCES` error.

To resolve this issue, consider the following solutions:

1. **Close your editor**: Ensure all instances of your code editor are closed,
   as they might be locking certain files.
2. **Clean the NPM cache**: Run `npm cache clean --force` to clear any corrupted
   or locked cache files.
3. **Disable anti-virus software**: Temporarily turn off any anti-virus software
   that might prevent file access.
4. **Stop development server**: If a server running, shut it down before
   attempting the installation again.
5. **Force installation**: Use the `--force` flag, like `npm install --force`,
   to override minor errors.
6. **Reinstall Node modules**: Remove the `node_modules` directory using
   `rm -rf node_modules` and then reinstall dependencies with `npm install`.

These steps address common permission-related issues that might cause the
`EPERM` error during file operations or package installations.

## Dealing with Node.js errors in production

When programming in Node.js, anticipating and planning for potential errors is
crucial. For example, network requests might fail, so having a contingency plan,
such as retrying the request or informing the user of the error, is essential.

To handle operations that may throw exceptions, you can use try/catch blocks,
error callbacks, failure event listeners, or catch promise rejections, depending
on the situation.

Logging unexpected errors is vital for diagnosing and preventing recurrences.
Utilizing logging frameworks like
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) or
[Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/) allows
you to track and record errors effectively. For instance, this program:

```javascript
import pino from 'pino';

const logger = pino();

function alwaysThrowError() {
  throw new Error('processing error');
}

try {
  alwaysThrowError();
} catch (err) {
  logger.error(
    err,
    'An unexpected error occurred while processing the request'
  );
}
```

Produces the output below:

```json
{
  "level": 50,
  "time": 1703627326917,
  "pid": 228875,
  "hostname": "fedora",
  "err": {
    "type": "Error",
    "message": "processing error",
    "stack": "Error: processing error\n    at alwaysThrowError (file:///home/ayo/dev/betterstack/demo/nodejs-logging/index.js:6:9)\n    at file:///home/ayo/dev/betterstack/demo/nodejs-logging/index.js:10:3\n    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)\n    at async ModuleLoader.import (node:internal/modules/esm/loader:329:24)\n    at async loadESM (node:internal/process/esm_loader:34:7)\n    at async handleMainPromise (node:internal/modules/run_main:113:12)"
  },
  "msg": "An unexpected error occurred while processing the request"
}
```

This record provides detailed information about the error, including its type,
message, stack trace, and other relevant information to help you understand and
diagnose the underlying issue quickly.

![search-filter.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f262700-3623-4162-5a48-7cf7d7ccca00/lg2x
=3080x1942)

After setting up logging, [centralizing your logs](https://betterstack.com/community/guides/logging/log-management/) is the next
step to allow for easier search and management.
[Better Stack](https://betterstack.com/logs), for example, offers a
comprehensive log management solution that not only stores and monitors logs but
also provides advanced search, visualization, and alerting capabilities.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/tMYxH0JLn38" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


For tracking errors specifically, [Better Stack Error Tracking](https://betterstack.com/error-tracking) **provides automatic error grouping, stack trace analysis, and session replay** to help you understand the context around each error. It integrates seamlessly with popular SDKs like Sentry, allowing you to capture exceptions across all your Node.js services without complex setup.

With centralized logging and error tracking, you can set up alerts to notify you when errors spike or when critical issues occur, helping you respond to production problems before they impact users.

![error-alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b17b535-85bf-461e-01c4-8b3c840b9e00/lg2x =1300x650)


## Final thoughts

In this article, we explored 16 of the most common Node.js errors you are likely
to encounter when developing applications or utilizing Node.js-based tools and
we discussed possible solutions to each one.

This by no means an exhaustive list so ensure to check out the
[Node.js errors documentation](https://nodejs.org/api/errors.html) or the
[errno(3) man page](https://man7.org/linux/man-pages/man3/errno.3.html) for a
more comprehensive listing.

Thanks for reading, and happy coding!
