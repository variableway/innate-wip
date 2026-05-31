# Getting Started with Rspack

Rspack is a fast JavaScript bundler built in Rust, offering excellent speed and compatibility with the webpack ecosystem. Its quick build times and familiar configuration make it a great choice for projects of all sizes, from small prototypes to large applications.

In this article, you'll set up a development environment with Rspack and learn how to customize it for your specific needs.

[ad-logs]

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/en/download/) version 16 or higher, along with a package manager like npm, yarn, or pnpm installed. You should also have a basic understanding of JavaScript or TypeScript and front-end development concepts.

## What is Rspack?

Rspack is a high-performance JavaScript bundler developed by ByteDance (the company behind TikTok) to address performance challenges in large-scale applications. It enhances the development experience with features such as:

* Near-instant server startup
* Extremely fast Hot Module Replacement (HMR)
* Native support for TypeScript, JSX, CSS, and static assets
* Highly parallelized build process
* Production-ready optimizations
* Strong compatibility with the webpack ecosystem

Rspack stands out due to its implementation in Rust, which offers exceptional performance while maintaining compatibility with Webpack. This allows you to leverage your existing webpack knowledge, along with many webpack plugins and loaders, without sacrificing speed.

## Getting started with Rspack
Let's set up a fresh Rspack project so you can follow along and test everything as you go.

Run the following command to get started quickly:

```command
npm create rspack@latest
```

The Rspack CLI will prompt you to select a project name and template. For this tutorial, choose "vanilla" to focus on Rspack's core features without any framework-specific complexities.


```text
[output]
Welcome to Create Rspack, powered by @rspack/create-rspack

? Project name: rspack-demo
? Select a template: › - Use arrow-keys. Return to submit.
    vue
    react
    react-ts
❯   vanilla
    vanilla-ts
```

After the setup completes, navigate to your project directory and install the dependencies:

```command
cd rspack-demo
```
```command
npm install
```

Now, let's start the development server:

```command
npm run dev
```
```text
[output]

> rspack-project@1.0.0 dev
> rspack dev

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8081/, http://[::1]:8081/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.167:8081/
<i> [webpack-dev-server] Content not from webpack is served from '/Users/stanley/rspack-project/public' directory
●  ━━━━━━━━━━━━━━━━━━━━━━━━━ (100%) emitting after emit                                                                                          Rspack compiled successfully in 49 ms
```

You should observe your browser automatically opening to `http://localhost:8081/` with a basic Rspack application running:

![Screenshot of a basic Rspack application running in the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4d1759a-244d-4b48-3f66-2be19b509c00/orig =3208x1958)

Rspack starts up incredibly fast, usually in just milliseconds instead of the seconds or minutes that traditional bundlers take. That speed comes from its Rust-based design, which you'll learn more about soon.

## Understanding Rspack's development mode

People love Rspack because it makes development fast and smooth, thanks to Hot Module Replacement (HMR). HMR lets you see changes in the browser right after you save, without resetting your app’s state.

Now, check your project folder. It should look something like this:

```
rspack-demo/
├── node_modules/
├── public/
├── src/
│   ├── index.js
│   └── style.css
├── index.html
├── package.json
└── rspack.config.js
```

The `index.html` file is the main entry point, and it typically looks like this:

```html
[label index.html]
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Rspack App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./src/main.js"></script>
  </body>
</html>
```

Now, let's create a custom "Hello World" application by updating the `src/index.js` file:

```javascript
[label src/index.js]
import './style.css';

const root = document.getElementById('root');
const header = document.createElement('h1');
header.textContent = 'Hello from Rspack!';

const message = document.createElement('p');
message.id = 'message';
message.textContent = 'Rspack is running and watching for changes!';

root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');
```

And update the `src/style.css` file:

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
  color: #d04f4f;
}
```

Save both files and check your browser. Rspack should automatically reload the page and display your new content:

![Screenshot showing Rspack has automatically reloaded the page with new content](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9536944a-0d96-4577-f3d6-a2585ff04d00/lg1x =3208x1958)


Now let's test HMR by modifying the message in `index.js`:

```javascript
[label src/index.js]
...
const message = document.createElement('p');
message.id = 'message';
[highlight]
message.textContent = 'You just triggered HMR!';
[/highlight]

root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');

```

Save the file and watch how Rspack updates the DOM without reloading the entire page. The console message remains visible, and only the changed parts of your application are updated:

![Screenshot showing the updated text](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/969e94e1-fa63-4f20-74eb-2f04fe605d00/lg1x =3208x1958)

This fast, state-preserving workflow is one of the most significant advantages of using Rspack in modern front-end development.

## Working with assets in Rspack

Rspack makes handling assets remarkably simple compared to other bundlers. Let's explore how it manages CSS, images, and other resources.


### CSS preprocessing

Rspack supports popular CSS preprocessors with minimal setup, thanks to its built-in CSS processing capabilities. Let's see how to use Sass:

First, install the Sass package:

```command
npm add -D sass
```

Now create a new file called `src/style.scss` in your project:

```scss
[label src/style.scss]
$primary-color: #d04f4f;
$secondary-color: #4fd0c6;

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
import './style.scss';

// Rest of your code...
```

Update your `rspack.config.js` file to properly support Sass with Rspack's native CSS handling:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
[highlight]
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'css' // Use Rspack's built-in CSS processing
      },
[/highlight]
    ]
  }
};
```

After installing the necessary loader:

```command
npm add -D sass-loader
```

When you save these files, Rspack automatically processes the Sass file and applies the styles:

![Screenshot of the browser console confirming that Rspack works with scss](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/85a68e99-3245-4daf-0ef3-89dcb25fbf00/orig =3208x1958)

Other preprocessors like Less work similarly. For example, to use Less, install the less-loader and configure it with `type: 'css'` to leverage Rspack's built-in CSS pipeline.

### Static assets

Rspack handles static assets like images with impressive simplicity. First, create an assets folder inside the `src` directory:

```command
mkdir -p src/assets
```

Download a logo image (or use your own):

```command
curl -o src/assets/rspack-logo.png https://assets.rspack.dev/rspack/navbar-logo-light.png
```

Now update your `rspack.config.js` file to handle image assets:

```javascript
[label rspack.config.js]
...
export default defineConfig({
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
[highlight]
      {
        // Add support for PNG, JPEG, GIF image formats
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      },
[/highlight]
      {
        test: /\.scss$/,
        use: ['sass-loader'],
        type: 'css', // Use Rspack's built-in CSS processing
      },
     ....
    ],
  },
...
});
```


Now update your JavaScript file to include the image:

```javascript
[label src/index.js]
import './style.scss';
[highlight]
import logoUrl from './assets/rspack-logo.png';
[/highlight]

const root = document.getElementById('root');

[highlight]
// Create the logo element
const logo = document.createElement('img');
logo.src = logoUrl;
logo.alt = 'Rspack Logo';
logo.width = 100;
[/highlight]

const header = document.createElement('h1');
header.textContent = 'Hello from Rspack!';

const message = document.createElement('p');
message.id = 'message';
message.textContent = 'You just triggered HMR!';

[highlight]
root.appendChild(logo);
[/highlight]
root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');
```

When you save and return to the browser, you'll see the logo appear on the page:

![Screenshot of the page with the logo](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/84c59f38-0473-4416-1c76-a1b5d9bde100/lg2x =3208x1958)

When you import an image in JavaScript, Rspack processes it and replaces the import with a URL pointing to the final asset. In development, this URL points directly to the source. In production, Rspack optimizes the image, renames it with a content hash for cache busting, and updates all references automatically.

This approach works not just for images but for fonts, videos, audio, and other static files.

## Customizing Rspack with configuration

Rspack works great out of the box, but as your project grows, you'll likely want to customize its behavior. Rspack makes this easy with its configuration file.


### Changing the development server settings

Let's update our server configuration to change the port and enable auto-opening of the browser:

```javascript
[label rspack.config.js]
...
export default defineConfig({
  entry: {
    main: './src/index.js',
  },
[highlight]
  // Add dev server settings
  devServer: {
    port: 3000,
    open: true,
    hot: true
  },
[/highlight]
  module: {
    // ... existing rules
  },
  plugins: [new rspack.HtmlRspackPlugin({ template: './index.html' })],
  experiments: {
    css: true,
  },
});
```

Now restart the development server:

```command
npm run dev
```

```text
[output]
> rspack-project@1.0.0 dev
> rspack dev

<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:3000/, http://[::1]:3000/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.167:3000/
...
```

Notice the server now runs on port `3000` instead of `8081`, and your browser should open automatically to the new address:

![Screenshot of the browser showing the application running under  port `3000`](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a024296-4e1e-4d2a-f0d7-d2a1b0166400/md1x =3208x1958)

## Final thoughts

Rspack delivers a fast, modern bundling experience with strong support for today’s front-end workflows. Its Rust-based architecture, fast Hot Module Replacement, and compatibility with the webpack ecosystem make it a reliable choice for anything from small projects to large applications.

You’ve learned how to set up Rspack, customize its development server, manage assets, and work with modern CSS tools. To dive deeper, visit the [official Rspack documentation](https://www.rspack.dev).
