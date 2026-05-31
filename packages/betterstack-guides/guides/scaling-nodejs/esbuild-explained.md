# Getting Started with esbuild

[esbuild](https://esbuild.github.io/) is a fast and simple tool that helps you bundle JavaScript code. It’s built for speed and supports the latest JavaScript features, making it a great choice whether you’re working on a small project or a full-scale app.

In this article, you’ll learn how to set up esbuild and use its features to improve your JavaScript development workflow.

[ad-logs]

## Prerequisites

Before you start, make sure you have [Node.js](https://nodejs.org/en/download/) version 20 or higher and npm installed on your computer. You should also have a basic understanding of JavaScript and how build tools work.


## What is esbuild?

esbuild is a fast JavaScript bundler and minifier built by Evan Wallace, the co-founder of Figma. It’s known for its impressive speed, thanks to a few smart design choices:

* It’s written in Go, so it runs much faster than tools built in JavaScript
* It uses all your CPU cores to process files in parallel
* It works in a single pass with minimal file handling
* It has highly optimized code for parsing, printing, and minifying
* It generates machine code directly instead of relying on slower JavaScript layers

But esbuild isn’t just fast. It also gives you:

* Support for JavaScript and TypeScript
* Built-in JSX transformation
* Tree shaking to remove unused code
* CSS bundling
* Source map generation
* A plugin system to add custom features

Overall, esbuild focuses on speed and simplicity, making it much easier to use than many other build tools.

## Getting started with esbuild

To understand how esbuild works, let’s walk through a simple example project. You’ll see how easy it is to set up and start using esbuild in your JavaScript workflow.

First, create a new folder for your project and initialize it with npm:


```command
mkdir esbuild-demo && cd esbuild-demo
```
```command
npm init -y
```

Now install esbuild as a development dependency:

```command
npm install --save-dev esbuild
```


You’ll probably notice how fast the installation finishes—esbuild makes a strong first impression with its speed.

Next, set up a basic project structure with the following commands:


```command
mkdir src
```
```command
touch src/main.js
```
```command
touch src/utils.js
```

Now add some simple code to these files to test your setup:

```javascript
[label src/utils.js]
export function greet(name) {
  return `Hello, ${name}!`;
}

export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}
```
This utility file includes two functions:

* `greet(name)` returns a friendly greeting.
* `getCurrentTime()` returns the current time in a readable format.

Next, let's use these functions in your main JavaScript file.

```javascript
[label src/main.js]
import { greet, getCurrentTime } from './utils';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  const heading = document.createElement('h1');
  heading.textContent = greet('esbuild user');
  
  const timeDisplay = document.createElement('p');
  timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  
  app.appendChild(heading);
  app.appendChild(timeDisplay);
  
  console.log('Application initialized!');
});
```
This script waits for the page to load, then adds a heading and a paragraph to the page. The content comes from the utility functions you just wrote.

Now, create a basic HTML file in the root directory to load your bundled JavaScript:

```html
[label index.html]
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>esbuild Demo</title>
  <script src="dist/bundle.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

The HTML file includes a `<div>` with the ID `app`—where your JavaScript will add content. It also loads the bundled JavaScript file that you'll create with esbuild in the next step.

With your files set up, it’s time to bundle your code using esbuild. Open your `package.json` and add these scripts:

```json
[label package.json]
{
  "name": "esbuild-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
[highlight]
    "build": "esbuild src/main.js --bundle --outfile=dist/bundle.js",
    "dev": "esbuild src/main.js --bundle --outfile=dist/bundle.js --watch"
[/highlight]
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "esbuild": "^0.20.1"
  }
}
```

Let's run the build command:

```command
npm run build
```

```text
[output]
> esbuild-demo@1.0.0 build
> esbuild src/main.js --bundle --outfile=dist/bundle.js


  dist/bundle.js  15b 

⚡ Done in 78ms
```

Even with a slightly larger file size or more features, the build time stays incredibly fast. 

In this case, it finished in just 78 milliseconds. That kind of speed is one of the reasons developers love esbuild.

To see your app in action, open `index.html` in your browser. You should see a heading that says **"Hello, esbuild user!"** and a line showing the current time.

![Screenshot of a basic esbuild application showing the heading "Hello, esbuild user!" and the current time](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/991f218b-3632-41a5-1c1f-06cffd56b500/md2x =3248x1996)

With everything set up and running in the browser, you've seen how fast and easy it is to get started with esbuild. 

But the real advantage shows up during active development, where quick rebuilds help you stay productive.


## Development workflow with esbuild

esbuild really shines during development, especially with its watch mode.

This feature automatically rebuilds your project whenever you make changes to your files, so you don’t have to run the build command manually each time.


```command
npm run dev
```

```text
[output]
> esbuild-demo@1.0.0 dev
> esbuild src/main.js --bundle --outfile=dist/bundle.js --watch

[watch] build finished, watching for changes...
```

Now, build will watch your files and rebuild them automatically when they change. Let's modify `src/utils.js`:

```javascript
[label src/utils.js]
export function greet(name) {
[highlight]// Make the greet function more sophisticated
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  return `${greeting}, ${name}! Welcome to esbuild.`;[/highlight]
}
export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}
```
As soon as you save, you'll see esbuild instantly rebuild:

```text
[output]
[watch] build finished, watching for changes...
[watch] build started (change: "src/utils.js")
[watch] build finished
```
Refresh your browser, and you'll see the updated text:

![Screenshot showing the updated esbuild application in the browser after a rebuild, displaying the new greeting and current time](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/93903386-e9e3-41b2-6098-f4b8f80aed00/lg2x =3248x1996)

Other bundlers often take several seconds or more to rebuild after changes. With esbuild, updates happen almost instantly. This quick feedback helps you stay focused and makes development smoother, especially as your project grows.


## Working with ESM format

Modern JavaScript relies heavily on ECMAScript Modules (ESM). esbuild supports ESM out of the box, making it perfect for contemporary web development. Let's update your project to use proper ESM format.

First, update your HTML file to load JavaScript as an ES module:

```html
[label index.html]
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>esbuild Demo</title>
[highlight]
  <script type="module" src="dist/bundle.js"></script>
[/highlight]
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

The key change is adding `type="module"` to the script tag, telling the browser to treat your bundle as an ES module.

Now update your build script in `package.json` to explicitly output ESM format:

```json
[label package.json]
"scripts": {
[highlight]
  "build": "esbuild src/main.js --bundle --outfile=dist/bundle.js --format=esm",
  "dev": "esbuild src/main.js --bundle --outfile=dist/bundle.js --format=esm --watch"
[/highlight]
}
```

The `--format=esm` flag ensures esbuild generates a proper ES module bundle.



Let's now add a simple module to demonstrate ESM's organization benefits. Create a new file for UI helpers:

```javascript
[label src/ui.js]
// Simple helper functions for UI elements
export function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

export function addStyles(element, styles) {
  Object.assign(element.style, styles);
  return element;
}
```
In this module, `createButton` helps you easily make a button with a click event, and `addStyles` lets you apply inline styles using a plain JavaScript object. These small utilities help keep your main code cleaner and more focused.

Now update your `main.js` to use these helpers:


```javascript
[label src/main.js]
import { greet, getCurrentTime } from './utils';
import { createButton, addStyles } from './ui';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Create heading
  const heading = document.createElement('h1');
  heading.textContent = greet('esbuild user');
  
  // Create time display
  const timeDisplay = document.createElement('p');
  timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  timeDisplay.id = 'time-display';
  
  // Create refresh button using our UI module
  const refreshButton = createButton('Refresh Time', () => {
    timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  });
  
  // Add some simple styles
  addStyles(heading, {
    color: '#3b82f6',
    marginBottom: '0.5rem'
  });
  
  addStyles(timeDisplay, {
    color: '#4b5563',
    fontWeight: 'bold'
  });
  
  // Add everything to the page
  app.appendChild(heading);
  app.appendChild(timeDisplay);
  app.appendChild(refreshButton);
  
  console.log('Application initialized with ESM!');
});
```
Here, you’re importing utility functions from separate modules to build and style the UI. This keeps your main script focused on app logic while offloading repetitive tasks to reusable helpers—one of the key benefits of using ES modules.


To avoid CORS errors when working with ES modules locally, you need a web server:

```command
npm install --save-dev serve
```

Then update your `package.json` scripts:

```json
[label package.json]
"scripts": {
  "build": "esbuild src/main.js --bundle --outfile=dist/bundle.js --format=esm",
  "dev": "esbuild src/main.js --bundle --outfile=dist/bundle.js --format=esm --watch",
[highlight]
  "serve": "serve ."
[/highlight]
}
```

Run the build and serve commands to bundle your code and start a local server:


```command
npm run build
```
```command
npm run serve
```

Visit `http://localhost:3000` to see your updated app with the refresh button:

![Screenshot showing the updated ESM-based UI with a refresh time button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f79a4b2a-138b-4417-32b6-525ccb044900/orig =3248x1996)

This simplified approach shows how ES modules make it easier to organize your code into clear, focused files. Each module handles a specific task, which keeps your codebase clean and easier to manage as your project grows, without adding unnecessary complexity.


## Adding styles with esbuild

Now that your project is working with ES modules, let's enhance it with proper CSS styling. esbuild can handle CSS files directly alongside your JavaScript.

Create a new file called `src/styles.css`:

```css
[label src/styles.css]
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f7f8fa;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #3b82f6;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1.5rem;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}

#time-display {
  font-weight: 500;
  color: #4b5563;
}
```

Now, modify your `main.js` file to import this CSS file:

```javascript
[label src/main.js]
[highlight]
import './styles.css';
[/highlight]
import { greet, getCurrentTime } from './utils';
import { createButton, addStyles } from './ui';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Create heading
  const heading = document.createElement('h1');
  heading.textContent = greet('esbuild user');
  
  // Create time display
  const timeDisplay = document.createElement('p');
  timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  timeDisplay.id = 'time-display';
  
  // Create refresh button using our UI module
  const refreshButton = createButton('Refresh Time', () => {
    timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  });
  
  [highlight]
// No need for inline styles anymore, using CSS file instead
[/highlight]
  
  // Add everything to the page
  app.appendChild(heading);
  app.appendChild(timeDisplay);
  app.appendChild(refreshButton);
  
  console.log('Application initialized with CSS and ESM!');
});
```

Notice the key change at the top: `import './styles.css';`. With this simple import, esbuild will automatically handle the CSS file. You also don't need the inline styles anymore since you have a proper CSS file.


Then, update your HTML to include the CSS file:

```html
[label index.html]
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>esbuild Demo</title>
  [highlight]
<link rel="stylesheet" href="dist/bundle.css">
[/highlight]
  <script type="module" src="dist/bundle.js"></script>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```
Rerun the build command:

```command
npm run build
```

```text
[output]
> esbuild-demo@1.0.0 build
> esbuild src/main.js --bundle --outfile=dist/bundle.js --format=esm


  dist/bundle.js   1.3kb
  dist/bundle.css  595b 

⚡ Done in 15ms
```

When you refresh your browser, you'll see the updated styles(make sure the server is still running):

![Screenshot showing the application with proper CSS styling applied, displaying a blue header, styled text, and a blue button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6aa6b3c6-4a55-44ff-e8c3-8adcd731c000/md1x =3248x1996)

Notice that esbuild now outputs two files: one for JavaScript and one for CSS. This approach can be better for production as it allows the browser to cache them separately.

## Final thoughts

esbuild is a fast and minimal bundler that’s great for quick setups and learning how modern JavaScript builds work. It keeps things simple while delivering impressive speed.

For more features like hot reloading and a smoother dev experience, consider [Vite](https://vitejs.dev/). It builds on esbuild and adds everything you need for larger, more dynamic projects.

Check out [this article on getting started with Vite](https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/) to explore further.
