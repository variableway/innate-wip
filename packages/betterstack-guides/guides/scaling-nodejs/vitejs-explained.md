# Vite.js: A Beginner's Guide


[Vite.js](https://vite.dev/) is a modern build tool designed for speed and simplicity. It's popular among front-end developers and integrates smoothly with frameworks like Vue, React, and Svelte.

It features Hot Module Replacement (HMR), fast dependency handling, and a flexible plugin system. By using native ES modules during development, Vite enables quick startup and responsive updates without full page reloads.

Its straightforward configuration and performance make it a great fit for projects of any size, from small prototypes to full production apps.

In this article, you’ll set up a development environment with Vite and learn how to customize it for your specific needs.

[ad-logs]

## Prerequisites

Before you begin, make sure you have [Node.js](https://nodejs.org/en/download/) version 16 or higher and `npm` installed. You should also be familiar with JavaScript or TypeScript and basic front-end development concepts.

## What is Vite.js?

Vite is a next-generation build tool created by Evan You, the developer behind Vue.js. It improves the development experience with features like:

* Instant server startup
* Fast updates through Hot Module Replacement
* Built-in support for TypeScript, JSX, CSS, and static assets
* Dependency pre-bundling with esbuild
* Production builds powered by Rollup
* A flexible plugin system

Vite also supports advanced capabilities like WebAssembly, Web Workers, and CSS preprocessors, all with minimal setup. It's designed to feel fast and stay simple, no matter which framework or tools you use.

## Getting started with Vite.js

Before we dive in, let’s set up a fresh Vite project so you can follow along and test everything as you go. 

Run the following command to get started quickly:

```command
npm create vite@latest
```

The Vite CLI will prompt you to select a project name, framework, and variant (JavaScript or TypeScript). For this tutorial, let's select "Vanilla" and "JavaScript" to understand Vite's core features without framework-specific complexities:

```text
[output[
> npx
> create-vite

│
◇  Project name:
│  vite-project
│
◇  Select a framework:
│  Vanilla
│
◇  Select a variant:
│  JavaScript
│
◇  Scaffolding project in /Users/stanley/vite-project...
│
└  Done. Now run:

  cd vite-project
  npm install
```

After the setup completes, navigate to your project directory and install the dependencies:

```command
cd vite-project
```
```command
npm install
```
Now, let's go ahead and start the development server:

```command
npm run dev
```
```html
[output]
> vite-project@0.0.0 dev
> vite


  VITE v6.3.5  ready in 433 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

You should observe your browser automatically opening to `http://localhost:3000/` with a basic Vite application running:


![Screenshot of a web browser displaying the default Vite welcome page running at `localhost:5173`](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d7f114e5-9687-4828-82a7-1c6b698a2300/md2x =3248x1996)

The first thing you'll notice about the output is how incredibly fast Vite starts up - often in milliseconds rather than seconds or minutes like traditional bundlers. This is due to Vite's innovative development approach, which we'll explore further.


## Understanding Vite's development mode

One of the key reasons people love Vite is its fast and seamless development experience, powered by Hot Module Replacement. HMR allows you to see updates instantly in the browser as you save changes, without losing the current state of your app.

First, clear any existing files in the `src` directory to start fresh. Then, open your `index.html` file, clear all existing contents, and replace it with the following:

```html
[label index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite App</title>
    <script type="module" src="/src/main.js"></script>
  </head>
  <body>
    <h1>Hello from Vite</h1>
    <p id="message">This is a Vite-powered page.</p>
  </body>
</html>
```

If you save the file, Vite won't be able to find `src/main.js` and you'll see an error like this in the terminal:

```text
[output]
3:56:48 PM [vite] (client) page reload index.html
3:57:08 PM [vite] Pre-transform error: Failed to load url /src/main.js (resolved id: /src/main.js). Does the file exist?
```

This error occurs because `main.js` doesn't exist in the src directory yet. In this setup, the `index.html` file tries to load `main.js` from the `src` folder.

Now, create a new file called `main.js` in the `src` directory of your project and add this code:

```javascript
[label src/main.js]
const message = document.getElementById('message');
message.textContent = 'Vite is running and watching for changes!';

// Example: log a message to the console
console.log('Vite HMR is active');
```

Save the file and then save `index.html` again. You should see the updated output:

```text
[output]
3:57:03 PM [vite] (client) page reload index.html 
3:57:08 PM [vite] Pre-transform error: Failed to load url /src/main.js (resolved id: /src/main.js). Does the file exist?
3:58:28 PM [vite] (client) page reload index.html
```

Go back to your browser. Vite should reload the page automatically and update the content:

![Screenshot 2025-05-05 at 3.35.23 PM.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/42f265eb-9842-4ebf-49c9-18a864054a00/lg2x =3248x1996)

Now update the `message.textContent` line in `src/main.js` to test HMR in action:

```javascript
[label src/main.js]
const message = document.getElementById("message");
[highlight]
message.textContent = 'You just triggered HMR!';
[/highlight]

// Example: log a message to the console
console.log('Vite HMR is active');
```

Save the file. Vite detects the change instantly and updates the DOM without reloading the full page:

![Screenshot 2025-05-05 at 3.37.09 PM.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9925f017-1b57-4cf1-6232-0d05dfe6b800/lg2x =3248x1996)

You didn't have to refresh your browser or restart the server. That's the power of Vite's HMR. It updates only the parts of your app that changed and keeps everything else in place—great for fast feedback and efficient debugging.

This fast, state-preserving workflow is one of the most significant advantages of using Vite in modern frontend development.


## Working with CSS and assets in Vite

Vite makes handling styles and assets remarkably simple compared to other bundlers. Let's explore how Vite manages these resources with minimal configuration.

### CSS support

Vite supports CSS out of the box. Create a new file called `style.css` in your src directory:

```css
[label src/style.css]
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #646cff;
}
```

Then import it directly into your JavaScript file:

```javascript
[label src/main.js]
[highlight]
import "./style.css";
[/highlight]

const message = document.getElementById("message");
message.textContent = "You just triggered HMR!";

// Example: log a message to the console
console.log("Vite HMR is active");
```

When you save `style.css` and `main.js` files, Vite applies the styles instantly without a page refresh. 

![Screenshot showing updated styling after applying `style.css`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/43a0069b-f551-43b2-cd87-01fc0d31ab00/lg2x =3248x1996)

As you can see, the styles take effect immediately without refreshing the page. 

### CSS preprocessors

Vite supports popular CSS preprocessors with minimal setup. Let's see how to use Sass:

First, install the Sass package:

```command
npm add -D sass-embedded 
```

Now create a new file called `style.scss` in your src directory:

```scss
[label src/style.scss]
$primary-color: #646cff;
$secondary-color: #535bf2;

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: $primary-color;
  
  &:hover {
    color: $secondary-color;
  }
}
```

Then update your JavaScript file to import the Sass file instead:

```javascript
[label src/main.js]
[highlight]
import "./style.scss";
[/highlight]

const message = document.getElementById("message");
message.textContent = "You just triggered HMR!";

// Example: log a message to the console
console.log("Vite HMR is active");
```

Vite automatically processes the Sass file and applies the styles when you save these files. You can hover over the heading to see the color change defined by the nested rule.

Other preprocessors like Less and Stylus work similarly. Just install the necessary package and use the appropriate file extension.


### Static assets

Vite handles static assets like images with the same level of simplicity. First, create an assets folder inside the `src` directory:

```command
mkdir -p src/assets
```
After that, download the Vite logo:

```command
curl -o src/assets/vite-logo.png https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/820px-Vitejs-logo.svg.png
```

Now update your HTML to include the image:

```html
[label index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite App</title>
    <script type="module" src="/src/main.js"></script>
  </head>
  <body>
    <h1>Hello from Vite</h1>
    [highlight]
    <img src="/src/assets/vite-logo.png" alt="Vite Logo" width="100">
    [/highlight]
    <p id="message">This is a Vite-powered page.</p>
  </body>
</html>
```

After saving the file, you should see the Vite logo appear on the page.

You can also manage images directly in JavaScript. Update your main.js file:

```javascript
[label src/main.js]
import "./style.css";
[highlight]
import logoUrl from './assets/vite-logo.png';

// Create an image element
const logo = document.createElement('img');
logo.src = logoUrl;
logo.alt = 'Vite Logo';
logo.width = 100;

// Insert it before the message paragraph
const message = document.getElementById('message');
message.parentNode.insertBefore(logo, message);
[/highlight]

message.textContent = "You just triggered HMR!";

// Example: log a message to the console
console.log("Vite HMR is active");
```
When you save and return to the browser, you'll now see two logos on the page—one loaded from HTML and the other added through JavaScript:

![Screenshot 2025-05-05 at 4.17.20 PM.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2c3e32f9-d8c9-4e95-369d-fe87699b1800/lg1x =3248x1996)

When you import an image in JavaScript, Vite processes it and replaces the import with a URL pointing to the final asset. In development, this URL points directly to the source. In production, Vite optimizes the image, renames it with a content hash for cache busting, and updates all references automatically.

This approach works not just for images, but for fonts, videos, audio, and other static files. Just import them in your code, and Vite will handle the rest.


## Customizing Vite with `vite.config.js`

Vite works great out of the box, but as your project grows, you'll likely want to customize its behavior. Vite makes this easy with its configuration file.

Create a `vite.config.js` file in your project root:

```javascript
[label vite.config.js]
export default {
  // configuration options go here
}
```

### Changing the development server port

Let's start with a simple change - updating the server port. Add this to your config file:

```javascript
[label vite.config.js]
export default {
[highlight]
  server: {
    port: 3000,    // Change from default 5173
    open: true     // Auto-open browser
  }
[/highlight]
}
```

Now restart the development server:

```command
npm run dev
```

You should see different output in your terminal:

```text
[output]
  VITE v6.3.5  ready in 180 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Notice the server now runs on port `3000` instead of `5173`, and your browser should open automatically to the new address.

### Enabling smarter configuration with `defineConfig`

To prepare for more advanced customization, update your `vite.config.js` file to use Vite’s `defineConfig` helper:

```javascript
[label vite.config.js]
[highlight]
import { defineConfig } from 'vite'

export default defineConfig({
[/highlight]
  server: {
    port: 3000,
    open: true
  }
[highlight]
})
[/highlight]
```


In this code, you import the `defineConfig` helper from Vite and use it to wrap your configuration object.

This doesn’t change how the configuration behaves, but it gives you better editor support, like autocompletion and inline documentation.

It also makes your config easier to extend later if you want to add conditions based on the environment or other custom logic.

### Using environment variables

Vite makes it easy to define values that change between development and production using environment variables. 

These variables are typically stored in `.env` files and automatically loaded based on the current mode (`development` or `production`).

Create a `.env` file in the root of your project with some example values:

```env
[label .env]
VITE_API_URL=https://dev.example.com/api
VITE_APP_NAME=My Vite App
```

> Note: Only variables prefixed with `VITE_` are exposed to your client-side code. This helps avoid accidentally exposing sensitive information.

You can access these variables in your application code using `import.meta.env`:

```javascript
[label src/main.js]
...
message.parentNode.insertBefore(logo, message);

message.textContent = "You just triggered HMR!";

[highlight]
// Log environment values
console.log("App name:", import.meta.env.VITE_APP_NAME);
console.log("API URL:", import.meta.env.VITE_API_URL);
[/highlight]
console.log("Vite HMR is active");
```

These logs will print your `.env` values to the browser console when the page loads:

![Screenshot of the dev console containing the `.env` values](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22526438-9c88-4d0c-79c1-4699beb0aa00/orig =3248x1996)

This provides a clean and reliable way to manage environment-specific values.



## Setting up testing with Vitest

Vite pairs perfectly with [Vitest](https://vitest.dev/), a fast test runner designed to feel like Jest but built for modern tools. You can write unit tests, run them with a UI, and get instant feedback—all integrated with your existing Vite project.

Start by installing Vitest and its UI:

```command
npm install -D vitest @vitest/ui
```

If you plan to test DOM code, install `jsdom` too:

```command
npm install -D jsdom
```

Next, update your existing `vite.config.js` to include a `test` section. Here's how to add it without removing your current setup:

```javascript
[label vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
[highlight]
  test: {
    globals: true,
    environment: 'jsdom',
    ui: true
  }
[/highlight]
});
```

This keeps your dev server config intact and supports Vitest, enabling test globals (like `describe`, `it`, and `expect`) and setting up a browser-like environment with `jsdom`.


Now, create a new file called `src/main.test.js` and add a simple test:

```javascript
[label src/main.test.js]
import { describe, it, expect } from 'vitest'

describe('sample test', () => {
  it('adds numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
});
```

You can run the tests using:

```command
npx vitest
```
You should see output like this in your terminal:

```text
[output]
 DEV  v3.1.3 /Users/stanley/vite-project
      UI started at http://localhost:51204/__vitest__/

 ✓ src/main.test.js (1 test) 1ms
   ✓ sample test > adds numbers correctly 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:05:24
   Duration  655ms (transform 16ms, setup 0ms, collect 11ms, tests 1ms, environment 405ms, prepare 45ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```
As you can see, Vitest runs the test quickly and keeps watching for changes. It provides detailed output, showing exactly what passed and how long each step took.

You can also run Vitest in interactive mode with a built-in browser UI:


```command
npx vitest --ui
```

This starts a visual test runner at a local address where you can:

* View live test results
* Re-run tests instantly
* Explore errors and stack traces
* Navigate test files with a modern interface

![Screenshot 2025-05-05 at 5.07.58 PM.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/869f0dd5-ebc5-44b7-c113-b9cd6153e000/public =3248x1996)

This interface is especially helpful during active development, giving you immediate feedback as you write or update tests.

## Final thoughts
Vite gives you a fast and modern way to build web apps.

It works with ES modules, TypeScript, CSS preprocessors, and static assets right out of the box, so you don’t need extra setup.

Using it together with Vitest gives you a simple but powerful testing setup that fits easily into your project.

To learn more, check out:

* [Vite Official Guide](https://vitejs.dev/guide/)
* [Vitest Documentation](https://vitest.dev/guide/)
* [Vite Config Reference](https://vitejs.dev/config/)
