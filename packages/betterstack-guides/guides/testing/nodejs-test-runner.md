# Node.js Test Runner: A Beginner's Guide

Historically, Node.js lacked an integrated test runner, which forced developers
to rely on third-party frameworks such as Jest or Mocha.

This changed when James M. Snell
[proposed on GitHub](https://github.com/nodejs/node/issues/40954) that a test
runner should be included within Node.js. The proposal developed over time and
was eventually [merged into the core](https://github.com/nodejs/node/pull/42325)
of Node.js.

As a result, Node version 18 or higher includes a built-in test runner, which
removes the need for external testing dependencies.

In this article, you will explore the features of the new test runner along with
some examples.

## Prerequisites

Before proceeding with this tutorial, ensure that you have a
[recent version of Node.js](https://nodejs.org/en/download) installed,
preferably the latest LTS.

## Step 1 — Setting up the directory

In this section, you'll create a project directory for the Node.js code you'll
be testing throughout this tutorial.

To begin, create the directory and move into it with the following command:

```command
mkdir testrunner-demo && cd testrunner-demo
```

Then, initialize the directory as an npm project:

```command
npm init -y
```

This command creates a `package.json` file, which holds essential metadata for
your project.

Afterward, run the command below to enable ES Modules in your project:

```command
npm pkg set type="module"
```

The command adds the `type` key to your `package.json` file and sets its value to
`module`:

```json
[label package.json]
{
  . . .
  "type": "module"
}
```

You're now ready to create the Node.js program that you'll be testing. Here's
the program in full:

```javascript
[label formatter.js]
function formatFileSize(sizeBytes) {
  if (sizeBytes === 0) {
    return '0B';
  }
  const sizeName = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(1024));
  const p = Math.pow(1024, i);
  const s = (sizeBytes / p).toFixed(2);
  return `${s} ${sizeName[i]}`;
}

export { formatFileSize };
```

```javascript
[label index.js]
import { formatFileSize } from './formatter.js';

if (process.argv.length > 2) {
  const sizeBytes = parseInt(process.argv[2]);
  const formattedSize = formatFileSize(sizeBytes);
  console.log(formattedSize);
} else {
  console.log(
    'Please provide the file size in bytes as a command-line argument.'
  );
}
```

The above code transforms file sizes from bytes to a more human-readable format,
such as KBs, MBs, etc. Save the code in their respective files at your project
root, and test it out by providing different inputs:

```command
node index.js 1024
```

```command
node index.js 1073741824
```

```command
node index.js 0
```

Here are the expected results:

```text
[output]
1.00 KB
1.00 GB
0B
```

Now that you understand what needs to be tested, let's move on to the next
section where you'll create your first test through the Node.js test runner.

## Step 2 — Writing your first test

Unit testing is essential for verifying the accuracy of functions across various
scenarios. This validates the functionality and also acts as documentation for
future developers.

In the previous section, we discussed what the demo program does and its
expected outcomes. Instead of manually verifying these outputs, you will set up
unit tests to automate the process.

Start by creating a `tests` directory in your project's root folder:

```command
mkdir tests
```

Next, create a file named `formatter.test.js` within your `tests` with the
following contents:

```command
code tests/formatter.test.js
```

```javascript
[label tests/formatter.test.js]
import { formatFileSize } from "../formatter.js";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("formatFileSize function", () => {
  it('should return "1.00 GB" for sizeBytes = 1073741824', () => {
    assert.strictEqual(formatFileSize(1073741824), "1.00 GB");
  });
});
```

Here, the `formatFileSize()` function is imported along with the testing
functions `describe` and `it` from `node:test`, and `assert` from `node:assert`.

The `describe` function wraps your tests into a group called a test suite, where
you can define multiple tests. The test, encapsulated by `it`, asserts whether
the actual output from `formatFileSize()` matches the expected result, "1.00
GB". This automated approach ensures the function works as intended without
manually checking each output.

## Step 3 — Running your tests

Once you've saved your test file, you're set to run them. To initiate a test
with Node's test runner, use the `--test` flag:

```command
node --test
```

This command prompts Node.js to search for files that fit specific patterns from
the current directory downwards:

- Files with `.js`, `.cjs`, or `.mjs` extensions located in the `test` or
  `tests` directories.
- Any file named "test," regardless of extension, e.g., `test.js`.
- Files beginning with "test-", e.g., `test-feature.cjs`.
- Files ending with ".test", "-test", or "\_test", e.g., `example.test.js`,
  `example-test.cjs`, `example_test.mjs`.

By default, each matching file is executed in a separate child process. If the
child process finishes with an exit code of 0, the test is considered passing;
otherwise, it's considered a failure.

When the tests are executed, the output will look like this:

```text
[output]
▶ formatFileSize function
  ✔ should return "1.00 GB" for sizeBytes = 1073741824 (0.770195ms)
▶ formatFileSize function (4.013289ms)

ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 112.371317
```

The output shows that the test suite with one case for the `formatFileSize()`
function ran successfully, verifying it returns "1.00 GB" for 1073741824 bytes
without failures, cancellations, or skips. The test took about 112.37
milliseconds to complete.

The test runner uses the [TAP output format](https://node-tap.org/tap-format/),
which is already widely established in the ecosystem.

### Watch Mode

Node.js offers a convenient
[watch mode](https://nodejs.org/api/test.html#watch-mode) that automatically
tracks changes in your test files and dependencies. This feature automatically
reruns tests when modifications are detected, ensuring your code continues to
meet its expected outcomes.

To enable and use watch mode, you can use the following command:

```command
node --test --watch
```

```text
[output]
▶ formatFileSize function
  ✔ should return "1.00 GB" for sizeBytes = 1073741824 (0.408844ms)
▶ formatFileSize function (2.391008ms)
```

## Step 4 — Testing with `test` syntax

You've already explored the `describe` and `it` syntax for structuring tests,
which are widely used. However, Node.js also supports the `test` syntax if you
prefer a different style.

Here's how you can adapt the previous example to use the `test` syntax:

```javascript
[label tests/formatter.test.js]
import { formatFileSize } from '../formatter.js';
import { test } from 'node:test';
import assert from 'node:assert';

test('formatFileSize function', (t) => {
  t.test('should return "1.00 GB" for sizeBytes = 1073741824', () => {
    assert.strictEqual(formatFileSize(1073741824), '1.00 GB');
  });
});
```

When run, this test produces output similar to the one you got in the previous
section:

```text
[output]
▶ formatFileSize function
  ✔ should return "1.00 GB" for sizeBytes = 1073741824 (0.927199ms)
▶ formatFileSize function (3.391822ms)

ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 92.568164
```

It's essential to use this syntax carefully, ensuring that the sub tests are
constructed using the `t.test()` method. Using the top-level `test()` function
for subtests will yield an error:

```javascript
[label tests/formatter.test.js
 . . .
test("formatFileSize function", (t) => {
[highlight]
  test('should return "1.00 GB" for sizeBytes = 1073741824', () => {
[/highlight]
    assert.strictEqual(formatFileSize(1073741824), "1.00 GB");
  });
});
```

```text
[output]
▶ formatFileSize function
  ✖ should return "1.00 GB" for sizeBytes = 1073741824 (1.286924ms)
    'test did not finish before its parent and was cancelled'

▶ formatFileSize function (2.843585ms)

ℹ tests 2
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 1
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 71.138765

✖ failing tests:

test at file:/home/ayo/dev/betterstack/demo/testrunner-demo/tests/formatter.test.js:6:3
✖ should return "1.00 GB" for sizeBytes = 1073741824 (1.286924ms)
  'test did not finish before its parent and was cancelled'
```

The `describe/it` syntax is less susceptible to errors like that so we'll
continue to prefer that syntax throughout this article for consistency and
clarity.

## Step 5 — Filtering and limiting tests

In managing a suite of tests, it's common to encounter scenarios where you must
filter or limit the execution of specific tests. This allows focused testing on
particular files, scenarios, or conditions without running the entire suite each
time.

### Filtering tests by name

The Node test runner supports test selection using the `--test-name-pattern`
argument. Here's an example:

```javascript
[label tests/formatter.test.js]
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize } from '../formatter.js';

describe('formatFileSize function', () => {
  it("should return '0B' for sizeBytes = 0", () => {
    assert.strictEqual(formatFileSize(0), '0B');
  });

  it("should return '1.00 MB' for sizeBytes = 1048576", () => {
    assert.strictEqual(formatFileSize(1048576), '1.00 MB');
  });

  it("should return '1.00 GB' for sizeBytes = 1073741824 @large", () => {
    assert.strictEqual(formatFileSize(1073741824), '1.00 GB');
  });

  it("should return '5.00 GB' for sizeBytes = 5368709120 @large", () => {
    assert.strictEqual(formatFileSize(5368709120), '5.00 GB');
  });
});
```

Note that the `@large` tag was added to some tests. This tag can be called
anything you prefer. To run only the tests marked with `@large`, use:

```command
node --test --test-name-pattern @large
```

The output from this command would look like this:

```text
[output]
▶ formatFileSize function
  ﹣ should return '0B' for sizeBytes = 0 (0.882616ms) # test name does not match pattern
  ﹣ should return '1.00 MB' for sizeBytes = 1048576 (0.190468ms) # test name does not match pattern
  ✔ should return '1.00 GB' for sizeBytes = 1073741824 @large (0.365786ms)
  ✔ should return '5.00 GB' for sizeBytes = 5368709120 @large (0.187443ms)
▶ formatFileSize function (6.018844ms)

ℹ tests 4
ℹ suites 1
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 2
ℹ todo 0
ℹ duration_ms 137.936039
```

You could also run a specific test by using a uniquely identifying portion of
the test name like this:

```command
node --test --test-name-pattern 'sizeBytes = 0'
```

```text
[output]
▶ formatFileSize function
  ✔ should return '0B' for sizeBytes = 0 (0.61673ms)
  ﹣ should return '1.00 MB' for sizeBytes = 1048576 (0.112328ms) # test name does not match pattern
  ﹣ should return '1.00 GB' for sizeBytes = 1073741824 @large (0.099617ms) # test name does not match pattern
  ﹣ should return '5.00 GB' for sizeBytes = 5368709120 @large (0.114415ms) # test name does not match pattern
▶ formatFileSize function (3.244393ms)

. . .
```

### Skipping tests with `skip`

The Node.js test runner also offers a `skip()` method for skipping specific
tests. It can be used as `describe.skip()` for skipping an entire suite, or
`it.skip()` for skipping a subtest. You can write it as:

```javascript
[label tests/formatter.test.js]
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize } from '../formatter.js';

describe('formatFileSize function', () => {
[highlight]
  it.skip("should return '0B' for sizeBytes = 0", () => {
[/highlight]
    assert.strictEqual(formatFileSize(0), '0B');
  });

  . . .
});
```

Or:

```javascript
[label tests/formatter.test.js]
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize } from '../formatter.js';

describe('formatFileSize function', () => {
[highlight]
  it("should return '0B' for sizeBytes = 0", { skip: true }, () => {
[/highlight]
    assert.strictEqual(formatFileSize(0), '0B');
  });

  . . .
});
```

When run, the output will indicate that one test was skipped, while the others
were executed:

```text
[output]
▶ formatFileSize function
[highlight]
  ﹣ should return '0B' for sizeBytes = 0 (0.474751ms) # SKIP
[/highlight]
  ✔ should return '1.00 MB' for sizeBytes = 1048576 (0.276706ms)
  ✔ should return '1.00 GB' for sizeBytes = 1073741824 @large (0.172765ms)
  ✔ should return '5.00 GB' for sizeBytes = 5368709120 @large (0.147009ms)
▶ formatFileSize function (3.439809ms)

. . .
```

## Step 6 — Implementing mocks

Node.js' test runner features built-in mocking capabilities, which are ideal for
testing external APIs, third-party code, or methods. This ensures that your unit
tests are stable and not influenced by external factors such as network
connectivity or file system changes.

For example, the `readFile()` method, which reads from the local disk, can be
mocked to avoid actual disk reads during tests:

```javascript
[label tests/index.test.js]
import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

// Mocking fs.readFile() method
mock.method(fs.promises, 'readFile', async () => 'Hello World');

describe('Mocking fs.readFile in Node.js', () => {
  it('should successfully read the content of a text file', async () => {
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 0);
    assert.strictEqual(
      await fs.promises.readFile('text-content.txt'),
      'Hello World'
    );
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 1);

    // Reset the globally tracked mocks.
    mock.reset();
  });
});
```

This example uses `mock.method()` to substitute the real
`fs.promises.readFile()` with a mock function that returns `Hello World`.

The test checks that the mock function behaves as expected, ensuring it's called
correctly and produces the right output. After the test, `mock.reset()` is used
to clear any globally tracked mock data, maintaining test isolation.

Upon execution, this test setup would generate the following output:

```text
[output]
▶ Mocking fs.readFile in Node.js
  ✔ should successfully read the content of a text file (0.566754ms)
▶ Mocking fs.readFile in Node.js (3.307336ms)

. . .
```

### Mocking timers

In Node.js v20.4.0, a `MockTimers` API was introduced to allow for the
simulation of time-related functions such as `setTimeout()` and `setInterval()`.

Here's how to use this feature with `mock.timers.enable()`:

```javascript
[label tests/index.test.js]
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('Mocking setTimeout in Node.js', () => {
  it('should successfully mock setTimeout', () => {
    const fn = mock.fn();
    mock.timers.enable({ apis: ['setTimeout'] });
    setTimeout(fn, 20);

    mock.timers.tick(10);
    mock.timers.tick(10);

    assert.strictEqual(fn.mock.callCount(), 1);
  });
});
```

In this example, `setTimeout` is overridden to test its behavior without waiting
for real time to pass. The test initiates a timeout to execute a function after
20 milliseconds, then advances the clock in two 10-millisecond steps.

Even though the total time simulated matches the timeout duration, the function
is only deemed to have been called once due to the mock setup. This method
provides a precise way to test time-dependent code without actual delay.

When run, the output resembles the following:

```text
[output]
node:2641257) ExperimentalWarning: The MockTimers API is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
▶ Mocking setTimeout in Node.js
  ✔ should successfully mock setTimeout (1.156348ms)
▶ Mocking setTimeout in Node.js (2.780952ms)

. . .
```

You can also use the `MockTimers` API to simulate and control the behavior of
the `Date` object, which is incredibly useful for testing functionalities that
are dependent on time, such as `Date.now()`.

The following example shows how to mock the `Date` object using this API:

```javascript
[label tests/index.test.js]
import assert from 'node:assert';
import { describe, it, test } from 'node:test';

describe('Mocking the Date object in Node.js', () => {
  it('should effectively mock the Date object starting from 200 milliseconds', (context) => {
    context.mock.timers.enable({ apis: ['Date'], now: 200 });
    assert.strictEqual(Date.now(), 200);

    // Simulate advancing time by 200 milliseconds
    context.mock.timers.tick(200);
    assert.strictEqual(Date.now(), 400);
  });
});
```

In this example, the `Date` object's initial time is 200 milliseconds. The test
verifies that `Date.now()` initially matches this mock setup. It then progresses
time by 200 milliseconds using `context.mock.timers.tick(200)`, and confirms
that `Date.now()` updates accordingly to 400 milliseconds.

When run, the output looks similar to this:

```text
[output]
(node:2644346) ExperimentalWarning: The MockTimers API is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
▶ Mocking the Date object in Node.js
  ✔ should effectively mock the Date object starting from 200 milliseconds (1.496926ms)
▶ Mocking the Date object in Node.js (4.26249ms)

. . .
```

## Step 7 — Using test hooks for setup and teardown tasks

Another useful feature offered by the test runner is hooks, commonly used for
setup and teardown tasks. Setup involves configuring the environment for the
test, while teardown revolves around cleaning or resetting anything set up
during the setup phase.

The following hooks are provided:

- `before`: This hook runs once before any tests execute. It's often used to set
  up the environment, such as establishing a connection to the database or
  loading fixtures.
- `beforeEach()`: This hook runs before each test in a suite. It helps set up
  necessary things for each test, such as initializing objects or test data.
- `after()`: This hook runs after the entire test suite. It can be used to clean
  up resources, like closing database connections.
- `afterEach()`: This hook executes code after each test case.

In the previous section on mocking, you saw an example of mocking a method using
`mock.method` and resetting the mocks. Similar techniques can be used with
hooks, as demonstrated below:

```javascript
[label tests/index.test.js]
import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

describe('Mocking fs.readFile in Node.js', () => {
  beforeEach(() => {
    // Set up mocks or any necessary setup before each test
    mock.method(fs.promises, 'readFile', async () => 'Hello World');
  });

  afterEach(() => {
    // Clean up mocks or any other resources after each test
    mock.reset();
  });

  it('should successfully read the content of a text file', async () => {
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 0);
    assert.strictEqual(
      await fs.promises.readFile('text-content.txt'),
      'Hello World'
    );
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 1);
  });
});
```

Here, `fs.readFile()` method is mocked before each test in the `beforeEach()`
hook and reset in the `afterEach()` to ensure subsequent tests start with a
clean state. This approach helps avoid issues caused by shared state between
tests.

After running the tests, you will see output like this:

```text
[output]
▶ Mocking fs.readFile in Node.js
  ✔ should successfully read the content of a text file (1.186674ms)
▶ Mocking fs.readFile in Node.js (2.618802ms)

. . .
```

## Step 9 — Measuring code coverage

The Node.js test runner includes an experimental feature for tracking code
coverage, which is enabled using the `--experimental-test-coverage` flag. This
provides a detailed summary of how much of your program is exercised by your
tests, a valuable metric for understanding test effectiveness.

To gather code coverage, use the following command:

```command
node --test --experimental-test-coverage
```

The relevant part of the report is shown below:

```text
[output]
. . .
ℹ start of coverage report
ℹ ------------------------------------------------------------------------
ℹ file                    | line % | branch % | funcs % | uncovered lines
ℹ ------------------------------------------------------------------------
ℹ formatter.js            |  83.33 |    66.67 |  100.00 | 3-4
ℹ tests/formatter.test.js |  95.24 |   100.00 |   80.00 | 7
ℹ tests/index.test.js     | 100.00 |   100.00 |  100.00 |
ℹ ------------------------------------------------------------------------
ℹ all files               |  94.74 |    92.86 |   90.91 |
ℹ ------------------------------------------------------------------------
ℹ end of coverage report
```

The coverage report indicates code coverage percentages for the project: the
`formatter.js` file has 83.33% line coverage, 66.67% branch coverage, and 100%
function coverage, with lines 3-4 uncovered.

Additionally, Node.js allows for selective disabling of code coverage analysis
for particular code sections. This is useful for parts of the code that are
platform-specific or otherwise challenging to test. You can disable and then
re-enable coverage analysis like this:

```javascript
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
/* node:coverage enable */
```

With these comments, the code coverage tool will ignore the enclosed code block
during its analysis. This functionality helps maintain the accuracy of your
coverage metrics by excluding sections that do not contribute to your
application's functionality or are impractical to test.

## Step 10 — Generating test reports

The Node.js test runner supports generating detailed test reports, which are
invaluable for analysis, spotting trends, and maintaining documentation of test
results. You can specify the format of these reports using the `--test-reporter`
flag.

Supported reporter formats include:

- **TAP (Test Anything Protocol)**: This format is versatile and can be used
  with other tools that parse TAP output.
- **Spec**: Provides a descriptive output that's easy to read directly in your
  terminal.
- **Dot**: Displays a minimalist dot matrix, where each dot represents a test.
- **JUnit**: Generates XML reports that can be integrated with continuous
  integration tools and other systems that consume JUnit-compatible formats.

To generate a TAP format report:

```command
node --test --test-reporter tap
```

```text
[output]
TAP version 13
# Subtest: formatFileSize function
    # Subtest: should return "1.00 GB" for sizeBytes = 1073741824
    ok 1 - should return "1.00 GB" for sizeBytes = 1073741824
      ---
      duration_ms: 0.66647
      ...
    1..1
ok 1 - formatFileSize function
  ---
  duration_ms: 4.305755
  type: 'suite'
  ...
1..1
# tests 1
# suites 1
# pass 1
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

For a Spec format report, use:

```command
node --test --test-reporter spec
```

You can also direct the output of these reports to a file, which is particularly
useful for archival or integration with other tools. For example, to save a TAP
report to a file:

```command
node --test --test-reporter tap --test-reporter-destination report.txt
```

This command generates a `report.txt` file containing the TAP formatted report.

## Step 11 — Writing a basic server test

This section will demonstrate how to write a basic test for a Node.js server.
We'll utilize [Fastify](https://fastify.dev/docs/latest/Guides/Getting-Started/)
here, but this approach can also be adapted for other similar web frameworks.

First, add Fastify to your project using npm:

```command
npm install fastify
```

Next, set up a basic Fastify server in project root:

```javascript
[label app.js]
import Fastify from 'fastify';

function buildFastify() {
  const fastify = Fastify();

  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' });
  });

  return fastify;
}

export default buildFastify;
```

The above code defines a single route that returns a JSON object when visited.
Now, let's write tests to ensure our Fastify application behaves as expected:

```javascript
[label tests/app.test.js]
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import buildApp from '../app.js';

describe('GET /', () => {
  let app;

  before(async () => {
    app = await buildApp();
  });

  after(async () => {
    await app.close();
  });

  it('returns status 200', async () => {
    const response = await app.inject({
      url: '/',
    });
    assert.deepStrictEqual(response.statusCode, 200);
    assert.strictEqual(
      response.headers['content-type'],
      'application/json; charset=utf-8'
    );
    assert.deepEqual(JSON.parse(response.payload), { hello: 'world' });
  });
});
```

In our testing setup, the `before` hook initializes the Fastify application to
ensure it's ready for testing, while the `after` hook closes the server to
release resources.

The `it` block evaluates the application's response, checking for a 200 status
code, correct content type, and expected JSON output, thus ensuring each test is
conducted under optimal conditions for precise results.

Execute the server test using the Node test runner:

```command
node --test tests/app.test.js
```

```text
[output]
▶ GET /
  ✔ returns status 200 (10.716153ms)
▶ GET / (25.512059ms)

. . .
```

This testing setup provides a reliable method for ensuring your Fastify
applications function correctly in a controlled environment using the Node test
runner.

## Final thoughts

This article offers a detailed guide on using the Node.js test runner to create
and execute tests. It highlights features like mocking, code coverage analysis,
and report generation, which are essential for assessing test effectiveness.

For additional details, please visit the
[documentation page](https://nodejs.org/api/test.html). If you're interested in
how the Node.js test runner compares to other testing frameworks, check out our
[comparison guide](https://betterstack.com/community/guides/testing/best-node-testing-libraries/).

Thanks for reading!