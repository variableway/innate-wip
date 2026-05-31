# Testing in Node: A Comparison of the Top 9 Libraries

Node.js has historically relied on third-party testing libraries. However, with
the introduction of Node.js v18, the landscape underwent a significant shift.
Node.js shipped with an experimental
[built-in test runner](https://nodejs.org/api/test.html), which received
stabilization status in Node.js 20. This move aimed to minimize reliance on
third-party dependencies.

You might be curious about how the built-in library compares to other
third-party alternatives and whether it should be exclusively employed for all
purposes. This article will assess nine testing libraries to assist you in
selecting the most suitable test runner for your upcoming project.

| Feature            | Node.js TR  | Vitest | Jest        | Mocha       | Japa               | Node-Tap    | Ava         | Uvu     | Jasmine      |
| ------------------ | ----------- | ---------- | ----------- | ----------- | ------------------ | ----------- | ----------- | ------- | ------------ |
| Snapshots          | ✖️          | ✔         | ✔          | ✖️          | ✔                 | ✔          | ✔          | ✖️      | ✖️           |
| Mocking            | ✔          | ✔         | ✔          | via Sinon   | via @japa/snapshot | ✔          | ✖️          | ✖️      | ✔           |
| Watch Mode         | ✔          | ✔         | ✔          | ✖️          | ✔                 | ✔          | ✔          | ✖️      | ✖️           |
| Code Coverage      | ✔          | ✔         | ✔          | via nyc     | ✔                 | ✔          | via c8      | ✔      | via istanbul |
| Reporters          | via TAP     | Lots       | Lots        | Lots        | via TAP            | Lots       | via TAP     | via TAP | Lots         |
| TS Support         | via ts-node | ✔         | via ts-jest | via ts-node | via ts-node        | ✔          | via ts-node | via esm | via ts-node  |

[ad-logs]

## 1. Node.js test runner

![Screenshot of Node.js Test Runner](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/aca3eeb0-f374-469f-2ea4-ce29d2e1ef00/lg2x
=3014x1758)

When Node.js was released in 2009, it did not include a built-in test runner.
Consequently, third-party test runners like Jest, Ava, and Mocha were introduced
to address this need. In recent years, many languages such as Rust and Go have
built-in test runners, and new runtimes like Deno and Bun also come with a test
runner. This left Node.js behind.

With the release of Node.js 18 in early 2022, it shipped with a built-in test
runner via the [node:test](https://nodejs.org/api/test.html) module. The Node.js
test runner has various useful features, including mocking, coverage, test
reports, and test filtering. It also ships with the built-in
[assert](https://nodejs.org/api/assert.html) module.

Getting started is as simple as creating a test file in the `tests` directory:

```javascript
[label tests/maths.js]
import test from "node:test";
import assert from "node:assert/strict";

test("calculateTotal", () => {
  const cartItems = [{ price: 20 }, { price: 30 }];

  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price;
  });

  assert.equal(totalPrice, 50);
});
```

Now you can run the tests like so:

```command
node --test tests/*.js
```

You will receive output that looks similar to this, confirming that the tests
pass:

```text
[output]
✔ calculateTotal (0.748834ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 65.683375
```

If you modify the test to fail, you will get a more descriptive failure output:

![Screenshot showing a failing test](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/705fed53-57cf-4907-bc26-c793b5219400/lg2x
=1031x639)

To develop efficiently, you can run the Node.js test runner with watch mode by
adding the `--watch` option:

```command
node --watch --test tests/*.js
```

```text
[output]
✔ calculateTotal (0.663041ms)
```

As you make changes and save, the Node.js test runner automatically reruns the
tests.

Optionally, if you prefer the `describe` and `it` syntax, you can write your
code sample like this:

```javascript
[label tests/maths]
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('calculateTotal', () => {
  it('should calculate the total price correctly', () => {
    ...
    assert.equal(totalPrice, 50);
  });
});
```
To generate reports, you can use TAP, which is the default:

```command
node --test --test-reporter tap
```

You can also skip certain tests you prefer not executing using
the `skip` method.

```javascript
it.skip("skip this test", () => {
  assert.equal(2, 5);
});
```

The Node.js test runner also includes hooks, such as `beforeEach`, `afterEach`,
`before`, and `after`, allowing specific actions to be performed before and
after each test or the entire test suite:

```javascript
describe("tests", async () => {
  before(() => console.log("about to run some test"));
  it("is a subtest", () => {
    assert.ok("some relevant assertion here");
  });
});
```

So far, the earlier code samples have used `node:assert/strict`, which offers a
basic set of assertion methods. You also have the option to integrate
third-party libraries like Chai. Chai provides a richer set of assertion methods
and styles, enhancing the flexibility and expressiveness of your tests.

```javascript
import { assert } from "chai";
```

Another key advantage of the Node.js test runner is its built-in mocking
capability. This feature allows you to simulate the behavior of complex code
pieces or external modules within your tests. Here's an example of mocking
building upon an example similar to the one we saw earlier:

```javascript
[label tests/maths.js]
import { mock, it } from "node:test";
import assert from "assert/strict";

it("calculates total in shopping cart", () => {
  const shoppingCart = {
    items: [{ price: 20 }, { price: 30 }, { price: 15 }],
    calculateTotal() {
      return this.items.reduce((sum, item) => sum + item.price, 0);
    },
  };

  // Original behavior: Ensure the original total calculation is correct
  assert.equal(shoppingCart.calculateTotal(), 65);

  // Mocking: Replace the "calculateTotal" method with a mock that returns 100
  mock.method(shoppingCart, "calculateTotal", () => 100);

  // Assert: Confirm the modified total calculation with the mock
  assert.equal(shoppingCart.calculateTotal(), 100);

  // Verification: Check if the "calculateTotal" method was called once
  assert.equal(shoppingCart.calculateTotal.mock.calls.length, 1);

  // Restoration: Restore the original behavior of the "calculateTotal" method
  shoppingCart.calculateTotal.mock.restore();

  // Assert: Verify that the original total calculation is restored
  assert.equal(shoppingCart.calculateTotal(), 65);
});
```

### Pros

- No dependencies because it comes bundled with Node.js.
- Offers first-class support for ES modules
- Has built-in features like mocking and coverage.
- Flexible and can work with third-party libraries.

### Cons

- The Node.js test runner is missing functionalities like snapshot testing,
  which can be crucial for specific testing scenarios.
- It cannot mock clocks and timers, a feature similar to Jest's
  `jest.useFakeTimers()`, which helps test time-dependent code.
- Currently, it does not offer the option to exclude specific files or
  directories from the coverage report. This feature can be important for
  focusing coverage metrics on relevant code areas.


## 2. Vitest

![Screenshot of Vitest Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/82a81b7b-1f4c-4026-b05f-bb1d08d07600/md2x
=1200x600)

If the default test runner falls short of your expectations, consider using [Vitest](https://vitest.dev), a third-party testing framework for Node.js. It achieves its remarkable performance through the use of
Worker threads. The framework has essential features, including snapshot
creation, mocking, and coverage analysis.

To facilitate your workflow, Vitest automatically activates watch mode and
provides a user-friendly interface for test visualization and interaction within
the browser. Should your requirements extend beyond its built-in features,
Vitest offers an API plugin that allows the creation of custom extensions.

To add Vitest to your project, run the following command:

```command
npm install -D vitest
```

Working with Vitest alongside Node.js is relatively straightforward, as
demonstrated in the subsequent example:

```javascript
[label maths.test.js]
import { describe, it, expect } from "vitest";

describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
});
```

You can now run the tests with Vitest:

```command
npx vitest
```

When you run this command, you can expect an output similar to the one below,
which confirms that the test passes:

```text
[output]
 ✓ maths.test.js (1)
   ✓ sample test (1)
     ✓ Should return the square root of a positive number

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:42:40
   Duration  124ms (transform 12ms, setup 0ms, collect 5ms, tests 1ms, environment 0ms, prepare 40ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

The final part of the output, "Waiting for file changes," signifies that Vitest
is in watch mode. This means it will automatically re-run tests when it detects
any file changes in the test files.

When you need to run tests only on files that have been changed (this includes both staged and unstaged changes), Vitest provides a handy `--changed` option:

```command
npx vitest --changed
```

Additionally, if you want to test changes that were committed most recently, you can use `HEAD~1` to specify the last commit:

```command
npx vitest --changed HEAD~1
```

Vitest also allows for greater versatility by enabling you to specify a particular commit hash or branch name for testing.

Vitest offers effortless integration with TypeScript right from the start. For projects using TypeScript, the setup involves just two steps: installing Vitest and creating a `.ts` extension test file:

```typescript
// maths.test.ts
import { describe, it, expect } from "vitest";

describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
});
```

There's no need for a separate TypeScript compilation step. To run your tests, use the `npx vitest` command. You'll receive an output akin to what you've seen in previous runs.

A notable feature worth exploring in Vitest is in-source testing, which allows you to run tests directly within your source code right next to the implementation. This approach is similar to the module tests you would find in Rust.

Consider the following example:

```javascript
[label src/stringManipulation.ts]
// Implementation of a utility function to reverse a string
export function reverseString(input: string): string {
  return input.split("").reverse().join("");
}

// In-source test suites using a vitest
if (import.meta.vitest) {
  const { test, assert } = import.meta.vitest;

  // Test case for the reverseString function
  test("reverseString", () => {
    assert.equal(reverseString("hello"), "olleh");
  });
}
```
In the provided code example, a `reverseString()` function is implemented to reverse a string. Right alongside the implementation are in-source tests  included to verify the functionality of the `reverseString` function

To enable this feature, you must set up a `vite.config.ts` configuration file in your project's root directory. Then add the `includeSource` option to target files within the `src` directory:


```javascript
[label vite.config.ts]
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'], 
  },
})
```

Upon running tests, you'll observe that the tests pass even though they are not in a separate file:

```text
[output]
 ✓ src/stringManipulation.ts (1)
   ✓ reverseString

 Test Files  1 passed (1)
      Tests  1 passed (1)
...
```


It's noteworthy that Vitest offers APIs compatible with Jest and its ecosystem libraries, making it a potential drop-in replacement for Jest in many projects.

To illustrate compatibility, consider the Vitest example code provided earlier. For it to work  with Jest, you only need to remove the first line:


```javascript
[highlight]
import { describe, it, expect } from "vitest";
[/highlight]

describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
});
```

[Vitest's documentation](https://vitest.dev/guide/migration.html) provides an in-depth migration guide for larger or more complex projects considering the switch. This guide details the differences between the two frameworks. It offers practical advice for a smooth transition, ensuring you can effectively move from Jest to Vitest without significantly disrupting your testing workflow.

Vitest also comes equipped with built-in code coverage support, offering the option to use either the v8 engine's native capabilities or the Istanbul library:

- [v8](https://v8.dev/blog/javascript-code-coverage): This provides native code coverage available in the Node.js v8 engine.
- [Istanbul](https://www.npmjs.com/package/@vitest/coverage-istanbul): A popular library that facilitates detailed code coverage analysis.

To run Vitest with the native v8 code coverage feature enabled, you can use this command:


```command
npx vitest --coverage
```

![Screenshot of Code coverage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5d633f39-b97a-4208-ca15-a1e280863b00/public =872x643)

Additionally, if you prefer a more interactive testing experience with a user
interface, you can install the `vitest-ui` package:

```command
npm i -D @vitest/ui
```

After installation, you can run your tests with the `--ui` flag:

```command
npx vitest --ui
```

Upon execution, this command will automatically open your default browser and
redirect to `http://localhost:51204/__vitest__/#/`:


![Screenshot of Web UI](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/caa74466-bf71-4e59-f0fd-5cacb855ed00/md2x =2770x1676)

### Pros

- Comprehensive TypeScript support straight out of the box.
- Native ES module compatibility.
- Features Jest-expect-compatible APIs, facilitating easy learning and serving
  as a drop-in replacement for Jest.
- Can be used effectively with popular front-end frameworks, including React, Vue, and Svelte.


### Cons

- Has a few [GitHub issues impacting performance](https://github.com/vitest-dev/vitest/issues/579) and a potential [memory leak](https://github.com/vitest-dev/vitest/issues/1135) associated with the use of `threads: true`. 
- Available resources for Vitest are notably skewed towards front-end development, which may limit comprehensive guidance and support for non-front-end use cases.


## 3. Jest

![Screenshot of Jest GitHub repo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/78e3781f-7564-4c90-eebe-59c7c7905300/md2x
=1200x600)

[Jest](https://jestjs.io/) stands out as one of the most widely adopted testing frameworks for
Node.js. It is one of the oldest and among the most influential frameworks,
pivotal in shaping testing patterns within the JavaScript ecosystem.

Jest is zero-configuration, providing a familiar API (`it` and `expect`) to
ensure a quick and seamless start. Additionally, it is feature-rich, offering
built-in support for mocking, snapshots, and coverage. To optimize performance,
Jest runs tests in parallel within their processes.

Installing Jest can be done as follows:

```command
npm i -D jest
```

A typical Jest example resembles the following:

```javascript
[label maths.test.js]
describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
});
```

You can then execute the tests:

```command
npx jest
```

The output should look similar to the following:

```text
[output]

> 02_jest_demo@1.0.0 test
> jest

 PASS  ./maths.test.js
  sample test
    ✓ returns true (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.203 s
```

You can also run Jest in watch mode to enable automatic reloading when changes
are made to your test files:

```command
npx jest --watch
```

Keep in mind that your project directory must be a Git repository for the
`--watch` option to function.

To obtain coverage for your test suite, use the `--coverage` option:

```command
npx jest --coverage
```

![Screenshot of Jest code coverage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7197e5e7-e772-4916-d765-94f54f79c800/md2x =872x643)

### Pros

- Demonstrates good performance.
- Supports automocking.
- Compatible with projects such as React, Angular, VueJS, NodeJS, and others
  using Babel.
- Boasts an active and large community with extensive documentation.

### Cons

- Lacks out-of-the-box TypeScript support, requiring the addition of the
  `ts-jest` package.
- Not ESM first, and its support is experimental, requiring
  [configuration to enable it](https://jestjs.io/docs/ecmascript-modules).
- Development has seen a slowdown in recent years.

## 4. Mocha

![Screenshot of Mocha GitHub page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9a2bb751-8838-4e22-d804-8516a43eec00/public
=1001x764)

[Mocha](https://mochajs.org/) is a high-performance, feature-rich testing framework for Node.js. It
offers an array of features, including async support, coverage reporting,
parallel test execution, and the identification of slow tests to help optimize
performance.

If your project also has a front end, Mocha can be embedded in your HTML to test JavaScript code directly in the browser.

You typically need to install Mocha and Chai, an expectation library, to get
started. However, you have the flexibility to choose any library that suits your
preferences:

```command
npm install -D mocha chai
```

Writing tests with Mocha can be accomplished as demonstrated below:

```javascript
[label test/maths.js]
import { expect } from "chai";

describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).to.equal(2);
  });
});
```

Ensure that your test files are located in the `test` directory.

Now, run the tests:

```command
npx mocha
```

You should observe the tests passing, as shown in the following output:

```text
[output]
> 03_mocha_demo@1.0.0 test
> mocha

  sample test
    ✔ returns true

  1 passing (1ms)
```

For mocking, you'll need a third-party library like
[sinon](https://github.com/sinonjs/sinon). Here's an example that mocks
`console.log`:

```javascript
[label test/maths.js]
import sinon from "sinon";

it("logs Hello", () => {
  const log = sinon.spy(console, "log");
  app();
  if (!log.calledOnceWith("Hello")) {
    throw new Error("Log was not called");
  }
});
```

![Screenshot of Mocha mocking](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/343d84f7-455c-4705-3dcf-1d48fc2de700/lg2x =872x643)

### Pros

- Lightweight with minimal dependencies.
- Native ESM support.
- Support for asynchronous testing.
- Modular and flexible, allowing the use of libraries of your choice for
  assertions, mocking, snapshots, etc.

### Cons

- The watch mode currently does not support ES Module tests.
- Lacks assertion libraries, often requiring reliance on third-party libraries
  like Chai.
- Does not have built-in support for mocking; you'll need Sinon for mocking.
- Configuration can be challenging due to diverse dependencies and requirements.

## 5. Japa

[Japa](https://japa.dev/docs/introduction) is a backend-only test runner explicitly designed for Node.js. It
prioritizes speed, lightweightness, and a concise API. To enhance its speed,
Japa avoids using transpilers to process the source code you write.

To illustrate its lightweight nature, the documentation claims that Japa is nine
times smaller than Vitest and eliminates much bloatware found in other test runners that support browser testing.

Despite its compact framework, Japa supports asynchronous tests, snapshots,
coverage reporting, test organization, and filtering. Additionally, it can be
integrated with Playwright and offers a VS Code extension that allows you to run
Japa tests directly from your code editor.

To swiftly install and set up Japa, use the following command:

```command
npm init japa app-name
```

This command will prompt you to choose the assertion library you want to use and
if you wish to include TypeScript support.

In the following example, Japa uses Jest `expect` assertion to test the addition
of two numbers:

```javascript
[label tests/maths.spec.js]
import { test } from "@japa/runner";

test.group("Maths.add", () => {
  test("add two numbers", ({ expect }) => {
    // Test logic goes here
    expect(1 + 1).toBe(2);
  });
});
```

Run the test:

```command
npm test
```

```text
[output]
> node bin/test.js


Maths.add (tests/maths.spec.js)
  ✔ add two numbers (1.04ms)

 PASSED

Tests  1 passed (1)
 Time  3ms
```

To obtain coverage in Japa, you can choose between c8 and nyc. The following
commands install and set up nyc:

```command
npm i -D nyc
```

You can then generate coverage as follows:

```command
npx nyc node bin/test.js
```

For creating snapshots in Japa, you can use the `japa/snapshot` plugin, which you can install with the following command:

```command
npm i -D @japa/snapshot
```

The initial Japa setup script creates a configuration file, `bin/test.js`, where you can register plugins:

```javascript
[label bin/test.js]
import { configure, processCLIArgs, run } from '@japa/runner'
import { expect } from '@japa/expect'
[highlight]
import { snapshot } from '@japa/snapshot'
[/highlight]


processCLIArgs(process.argv.splice(2))
configure({
  files: ['tests/**/*.spec.js'],
[highlight]
  plugins: [expect(), snapshot()],
[/highlight]
})

run()
```

The following is another example that creates a snapshot:

```javascript
[label tests/maths.spec.js]
import { test } from '@japa/runner'

test('match snapshot', async ({ assert, expect }) => {
  expect('1').toMatchSnapshot()
})
```

Upon running, it will create a new snapshot in the `tests/__snapshots__` with
the following:

```javascript
exports['match snapshot 1'] = `"1"`
```

To use Japa with TypeScript, along with another assertion library like Chai, all
you have to do is rerun `npm init japa` with TypeScript, and it will generate a
similar example:

```javascript
[label tests/maths.spec.ts]
import { test } from '@japa/runner'

test.group('Maths.add', () => {
  test('add two numbers', ({ assert }) => {
    // Test logic goes here
    assert.equal(1 + 1, 2)
  })
})
```

The TypeScript file uses the Chai `assert` instead of Jest `expect`. Running the
tests yield the same result.

Another noteworthy feature provided by Japa is the use of Datasets, allowing you to execute a specific test multiple times with different data on each iteration, as illustrated in the following example:

```javascript
test('validate email', ({ assert }, email) => {
  assert.isTrue(validateEmail(email))
})
.with([
  'some+user@gmail.com',
  'some.user@gmail.com',
  'email@123.123.123.123'
])
```
In this instance, the `with` method accepts an array of values (email addresses) and passes each element to the test callback as a second argument during execution.

Additionally, Japa provides the ability to tag your tests, allowing you to filter tests across multiple test suites and files. In the example below, a test is tagged with `@payment_gateway`:

```javascript
test('remove payment method', () => {
  // Test logic for removing a payment method
})
.tags(['@payment_gateway']);
```

You can then run tests with the `@payment_gateway` tag using the following command:

```command
npm test -- --tags="@payment_gateway"
```

Japa also includes a browser client built on top of the [Playwright library](https://playwright.dev/docs/library). This client can automatically manage browsers and browser contexts, toggle headless mode, provide built-in assertions, and allow decorators to extend browser, context, or page objects.

Here's a basic example:

```javascript
[label tests/browser/visit_japa.spec.js]
import { test } from '@japa/runner'

test('has docs for browser client', async ({ visit }) => {
  const page = await visit('https://japa.dev/docs')
  await page.getByRole('link', { name: 'Browser client' }).click()

  /**
   * Assertions
   */
  await page.assertPath('/docs/plugins/browser-client')
  await page.assertTextContains('body', 'Browser client')
})
```

To run this test in the command line, you can use:

```command
npm test browser
```

For a practical guide on using this feature, refer to the [documentation](https://japa.dev/docs/plugins/browser-client) page.

### Pros

- ES modules first-class support.
- Easy to configure for TypeScript.
- Simple to install and set up with the `npm create-japa` script.
- Flexible, allowing you to choose an assertion library like Chai.js `assert` or
  Jest `expect`.
- Works with other runtimes like Bun.

### Cons

- Only works with ES modules, so it may not be suitable for projects using
  CommonJS.
- Relatively new and less well-known, lacking as many resources as older and
  more popular test runners.


## 6. Node-Tap 
[Node-Tap](https://node-tap.org/) is a Node.js testing framework that follows the Test-Anything protocol (TAP). It has essential features like snapshots, fixtures, and mocking, a thorough code coverage analysis, and a command-line interface (CLI).

A key aspect of Node-Tap is its focus on test isolation. It achieves this by
running each test in a separate process, which helps avoid confusion and
interference between tests. The framework's core functionality includes
essential features like error handling, while more advanced capabilities, such
as mocking, snapshots, and fixtures, are provided through plugins.

This modular approach is beneficial as it allows flexibility to include or
exclude plugins based on your requirements, keeping the framework streamlined.
Node-Tap conveniently comes with some default plugins, so there's no immediate
need for extra installations.

To begin using Node-Tap in your project, you can install it with the command:

```command
npm install --save-dev tap
```

Upon installation, it will set up the `package.json` for you. To ensure the best
compatibility, make sure to enable ES modules.

You can get started with Node-Tap using this simple example:

```javascript
import t from "tap";

t.test("calculateTotal", (t) => {
  const cartItems = [{ price: 20 }, { price: 30 }];

  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price;
  });

  t.equal(totalPrice, 50);
  t.end();
});
```

Run the tests:

```command
npm test
```

When you run it, the output will be similar to the following:

![Screenshot of Node-Tap output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e4416a3e-b413-48fe-6765-5c2a2abcc800/orig
=822x442)

The most unique thing about the output is that coverage is turned on by default.

Another unique feature is the REPL, which allows you to run tests, manage
plugins, or watch for changes.

In your terminal, enter the following command to start the REPL:

```command
npx tap repl
```

In the REPL, you can run the tests:

```command
TAP> tap run
```

```text
[output]
 PASS  test/test.js 1 OK 973ms

...

# No coverage generated
# { total: 1, pass: 1 }
# time=1044.653ms

code: 1
signal: null
```

You can list all plugins available for Node-Tap:

```command
TAP> plugin list
```

```text
[output]
@tapjs/after
@tapjs/after-each
...

@tapjs/worker
code: 0
```

In the REPL, you can add plugins:

```command
TAP> plugin add <plugin_name>
```

Remove plugins:

```command
TAP> plugin rm <plugin_name>
```

### Pros:

- Natively supports TypeScript.
- First class ESM support.
- Offers enhanced flexibility with easily manageable plugins.
- Provides a REPL for interactive testing and configuration.
- Compatible with Node.js's Built-in Test Runner.
- Comprehensive documentation for user guidance.

### Cons:

- As a newer framework, its community is smaller than those of more established
  frameworks.
- Performance can diminish with large test suites.
- Does not support test grouping in the style of Vitest or Jest

## 7. AVA

![Screenshot of Ava Github](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/152f0f5c-0dbd-4cd6-b74f-a03aa5428a00/public
=1200x600)

[AVA](https://github.com/avajs/ava) is another lightweight test runner for Node.js that is steadily gaining
popularity. It runs incredibly fast and has a concise API for simplifying
testing. AVA offers exciting features such as snapshot testing, observable and
async support, TAP reporter, and the ability to run tests concurrently.

One of the core principles of this tool is to ensure test isolation by executing
each test file in a separate worker thread. Further emphasizing isolation, it
does not rely on implicit globals and is incapable of running in a global scope.

You can set up AVA in your project like this:

```command
npm init ava
```

You can start using AVA in your code like this:

```javascript
[label test.js]
import test from "ava";

test("returns true", (t) => {
  t.is(Math.sqrt(4), 2);
});
```
Now, run the tests with `npx` like this:

```command
npx ava
```

And the test will pass like this:

```text
[output]

> 05_ava_demo@1.0.0 test
> ava


  ✔ returns true
  ─

  1 test passed
```

You will see that the test will pass.

To make your testing experience seamless, you can enable the `--watch` mode:

```bash
npx ava --watch
```

![Ava watch mode screenshot](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/43b2574b-7df5-4c5b-b134-28fa17010b00/public =825x457)

AVA natively supports [Observables](https://github.com/zenparsing/es-observable) and can consume an Observable returned from a test to ensure completion before ending the test. Here's an example:

```javascript
test('handles observables', t => {
	t.plan(3);
	return Observable.of(1, 2, 3, 4, 5, 6)
		.filter(n => {
			// Only even numbers
			return n % 2 === 0;
		})
		.map(() => t.pass());
});
```
This code snippet configures the test to expect exactly three assertions (`t.plan(3)`). The Observable emits a sequence of numbers from which only even numbers are filtered. A `t.pass()` assertion is called for each of these even numbers, resulting in three passes. This approach effectively demonstrates how AVA can manage asynchronous test operations by leveraging Observables, ensuring the test completes only after all emissions are processed.

### Pros

- First-class support for ESM.
- Concise test syntax.
- You can debug your tests with Chrome DevTools, VSCode, and WebStorm.
- You can write client-side JavaScript tests.

### Cons

- Lacks built-in mocking and coverage support.
- Has no support for grouping tests with a `describe` block or anything similar
  and has an [open issue](https://github.com/avajs/ava/issues/222) on GitHub
  that has not been resolved for seven years.

## 8. Uvu

![Screenshot of Uvu Github](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6195dfdf-6e69-4e0c-90d8-e0994e5fe600/orig
=1200x600)

[Uvu](https://github.com/lukeed/uvu) is a testing library built for both Node.js and the browser. It is designed
to be fast and lightweight, providing just enough functionality for your basic
needs. As you need more advanced features like mocking or want to use a
different assertion library, you can opt for third-party libraries.

Installing Uvu is as simple as this:

```command
npm i -D uvu
```

The following example demonstrates how you can get started with Uvu:

```javascript
[label tests/maths.js]
import { test } from "uvu";
import * as assert from "uvu/assert";

test("sample test", () => {
  assert.is(Math.sqrt(4), 2);
});

test.run();
```

Following that, you run the tests like this:

```command
npx uvu tests
```

```text
[output]
> 04_uvu_demo@1.0.0 test
> uvu tests

maths.js
•   (1 / 1)

  Total:     1
  Passed:    1
  Skipped:   0
  Duration:  0.57ms
```

If you prefer a different assertion library, you can use one like Chai:

```javascript
[label test/maths.js]
import { test } from "uvu";
import { expect } from "chai";

test("sample test", () => {
  expect(Math.sqrt(4)).to.equal(2);
});

test.run();
```

Make sure to install Chai:

```command
npm i -D chai
```

This setup will produce the same result when run:

![Screenshot of uvu passing test](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a77217a1-1907-4874-42bb-b9468b9d0800/orig =825x457)

If you want to measure code coverage, Uvu doesn't have built-in capabilities,
but you can use [c8](https://www.npmjs.com/package/c8):

```command
npm i -D c8
```

You can then run the following command to get coverage:

```command
npx c8 --include=src npm test
```

![Screenshot of Node.js coverage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b30fa40c-991d-47b4-fdc4-0dd4fc798c00/orig
=822x572)

### Pros

- Lightweight with fewer dependencies.
- Fast performance and showcases its speed with benchmarks in the
  [documentation](https://github.com/lukeed/uvu?tab=readme-ov-file#benchmarks).
- Native ESM support.
- Flexible, allowing you to switch the assertion library or use a mocking
  library like Sinon for mocking.

### Cons

- Uvu executes tests in a single thread, which means tests are not isolated from
  each other.

- Being relatively new (only 4 years old), Uvu doesn't yet have a large
  community, which can impact the availability of resources and support.
- The documentation for Uvu is not as comprehensive, posing challenges in fully
  understanding and utilizing its capabilities.
- Unlike some other frameworks, Uvu doesn't offer built-in support for mocking
- Uvu lacks a built-in watch mode feature, which is helpful for automatically
  rerunning tests upon code changes.

## 9. Jasmine

![Screenshot of Jasmine Github](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6c2b34ec-ebc2-4557-10a2-0500a7c25900/md2x
=1200x600)

[Jasmine](https://jasmine.github.io/) stands as one of the most seasoned and widely embraced behavior-driven
development testing frameworks designed for Node.js. It seamlessly integrates
with Node.js and web browsers, offering excellent features such as synchronous
and asynchronous support, spying, mocking, and the capability to run tests in
parallel.

To incorporate Jasmine into your project, add it as a dependency using the
following command:

```command
npm i -D jasmine
```

Initialize Jasmine in your project with the command:

```bash
npx jasmine init
```

Start using Jasmine by creating a `maths.spec.js` file in the `spec` directory:

```javascript
// [label spec/maths.spec.js]
describe("sample test", () => {
  it("returns true", () => {
    expect(Math.sqrt(4)).toBe(2);
  });
});
```

Upon execution, you'll receive output similar to the following:

```javascript

> 08_jasmine_demo@1.0.0 test
> jasmine

Randomized with seed 23484
Started
.


1 spec, 0 failures
Finished in 0.002 seconds
Randomized with seed 23484 (jasmine --random=true --seed=23484)
```

### Pros

- Jasmine does not rely on the (DOM)

- Utilizes the familiar `describe` and `it` syntax, enhancing readability and
  ease of use.
- Comes with built-in support for mocking, spying, and report creation,
  providing a rich set of tools.
- Allows integration with other assertion libraries, expanding its built-in
  assertion capabilities.

### Cons

- Handling asynchronous testing in Jasmine can be challenging.
- Faces difficulties when comparing binary data, such as Uint8Array, as noted in
  [this issue](https://github.com/jasmine/jasmine/issues/1915).
- Jasmine lacks built-in support for watch mode, which can be a drawback for
  continuous development workflows.
- Many resources related to Jasmine are dated compared to other Node.js
  frameworks.
- Debugging Jasmine's tests can be challenging due to the vague output provided.

## Final thoughts

The introduction of the native test runner marks a significant shift in the
Node.js ecosystem. The need for many third-party libraries diminishes as the
project matures and incorporates more features.

Nevertheless, libraries such as Vitest display a particularly optimistic outlook
due to their unique features and the frequent addition of new functionalities.
Another advantage is their optimization to function smoothly on both the backend
and front end.

Thanks for reading, and happy logging