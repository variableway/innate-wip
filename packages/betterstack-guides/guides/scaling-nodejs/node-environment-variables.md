# Managing Environment Variables in Node.js

Environment variables let you change how your Node.js app runs without touching the code. You can use them to set things like API keys, database URLs, or app settings for different environments such as development, testing, or production.

 This guide shows you how to use environment variables in Node.js, starting with the basics and moving on to more advanced techniques.

[ad-uptime]

## Prerequisites

Before getting started, make sure you have:

- [Node.js](https://nodejs.org/) installed on your system (version 20.x or newer recommended)
- Basic familiarity with running Node.js applications

## Why use environment variables?

Environment variables offer several key benefits when building Node.js applications:

* They help you keep sensitive information like API keys and credentials from your code.
* You can easily change settings based on the environment: development, staging, or production.
* They make your app more portable, so you can run it in different environments without changing the code.
* They support best practices like the twelve-factor app approach used in modern software development.

Think of environment variables as an external configuration layer. They let you control how your app behaves without changing how it works on the inside.

## Accessing environment variables

To use environment variables in Node.js, you don't need any extra libraries—Node.js gives you built-in access through the `process.env` object.

 This object holds all the environment variables available to your app, and you can read from it just like a regular JavaScript object.

Create a new directory for our project:

```command
mkdir env-demo && cd env-demo
```

Create a file named `app.js`:

```javascript
[label app.js]
console.log('Current user is:', process.env.USER);
console.log('Home directory is:', process.env.HOME);
```

Run the application:

```command
node app.js
```

You should see output showing your system's environment variables:

```text
[output]
Current user is: stanley
Home directory is: /Users/stanley
```

In this example, you're accessing environment variables that your operating system already provides: `USER` and `HOME`. These come built into your environment.

But you can also define your own environment variables. Let's look at how to do that next.

## Setting variables for a single command

When you're just testing or want to temporarily set environment variables, the fastest method is to define them directly in the terminal as part of the command. This doesn't save the variables anywhere—they only exist for that one command execution. It's simple and effective for quick setups or one-off runs.

First, update your `app.js` file to read and display the environment variables:

```javascript
[label app.js]
console.log('Server port:', process.env.PORT);
console.log('API key:', process.env.API_KEY);
```

Now run your app with the variables set inline:

```command
PORT=3000 API_KEY=abc123 node app.js
```

This should output:

```text
[output]
Server port: 3000
API key: abc123
```

This approach works well when you only need the variables for a single run. But if you want the values to stick around during your terminal session, you can export them instead.

On Linux or macOS, run:

```command
export PORT=3000
```
```command
export API_KEY=abc123
```

Now you can run your app normally without redefining the variables each time:

```command
node app.js
```

And you’ll still get:

```text
[output]
Server port: 3000
API key: abc123
```

To make your app more reliable and flexible, it’s smart to add default values if the environment variables aren’t set. This prevents errors and keeps your app running with fallback settings.

Update `app.js` like this:

```javascript
[label app.js]
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || 'default-key';

console.log('Server port:', port);
console.log('API key:', apiKey);
```

Now your app will still work even if `PORT` or `API_KEY` aren’t set—using the defaults you’ve provided.


## Using `.env` Files in Node.js 20+


Starting with Node.js 20, you can load environment variables from a `.env` file without extra libraries. 

This built-in support makes it easier to manage configuration settings, especially when you want to keep sensitive or environment-specific values out of your code.

If you want to test `.env` files or run with fresh values, open a new terminal session or unset the exported variables first:

```command
unset PORT
```
```command
unset API_KEY
```

This clears the session-level variables, so your app can now load new values from a `.env` file or use the fallback values in your code.


Then, create a `.env` file in your project folder:

```
[label .env]
PORT=4000
API_KEY=secret-key-123
DATABASE_URL=mongodb://localhost:27017/myapp
```

This file contains key-value pairs that define your environment variables. Each variable is available to your application through `process.env`.

In your code, you can access the variables like this:

```javascript
[label app.js]
console.log('Server port:', process.env.PORT);
console.log('API key:', process.env.API_KEY);
console.log('Database URL:', process.env.DATABASE_URL);
```


To load the `.env` file, run your app with the `--env-file` flag:

```command
node --env-file=.env app.js
```


When you run the app, you’ll see:

```text
[output]
Server port: 4000
API key: secret-key-123
Database URL: mongodb://localhost:27017/myapp
```

### Using multiple environment files

As your application moves through different stages of the development lifecycle, it requires different configurations. 

Development environments need detailed logging and local resources, testing environments require isolated and reproducible conditions, while production environments prioritize performance, security, and reliability.

Using environment-specific .env files allows you to maintain these different configurations cleanly.

![Comparison of Different Environments](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c8b65dd-0881-4ea3-170d-ad886d10eb00/public =800x500)

Start with a base `.env` file for shared settings:

```
[label .env]
NODE_ENV=development
LOG_LEVEL=info
```

Then create a file for development-specific variables:

```
[label .development.env]
PORT=4000
API_KEY=dev-key
DATABASE_URL=mongodb://localhost:27017/dev_db
```

And another for production:

```
[label .production.env]
PORT=8080
API_KEY=prod-key
DATABASE_URL=mongodb://prod-server:27017/prod_db
```

The `.env` file holds common values that apply across environments, while `.development.env` and `.production.env` define the settings for each environment.

Update your app to read and log these variables:

```javascript
[label app.js]
console.log('Environment:', process.env.NODE_ENV);
console.log('Log level:', process.env.LOG_LEVEL);
console.log('Server port:', process.env.PORT);
console.log('API key:', process.env.API_KEY);
console.log('Database URL:', process.env.DATABASE_URL);
```

Now run your app with both the shared and the environment-specific files.

For development:

```command
node --env-file=.env --env-file=.development.env app.js
```

```text
[output]

Environment: development
Log level: info
Server port: 4000
API key: dev-key
Database URL: mongodb://localhost:27017/dev_db
```

For production:

```command
node --env-file=.env --env-file=.production.env app.js
```

```text
[output]
Environment: development
Log level: info
Server port: 8080
API key: prod-key
Database URL: mongodb://prod-server:27017/prod_db
```

When you use multiple `--env-file` flags, Node.js loads the files in the order you specify. 

If the same variable appears in more than one file, the value from the last file takes priority. 

This gives you a clean way to separate shared settings from environment-specific ones while keeping everything easy to manage.


## Using `dotenv` for older node.js versions

If you're working with an older version of Node.js (before version 20), built-in support for `.env` files isn't available. In that case, you can use the popular `dotenv` package to load environment variables from a `.env` file.

First, initialize your project and install `dotenv`:

```command
npm init -y
```

```command
npm install dotenv
```

Then enable ES modules (ESM) by setting the project type to `module`. You can do this by running:

```command
npm pkg set type=module
```

Now create a `.env` file in your project directory:

```
[label .env]
PORT=4000
API_KEY=secret-key-123
DATABASE_URL=mongodb://localhost:27017/myapp
```

Update your `app.js` file to load the `.env` file using ESM syntax:

```javascript
[label app.js]
import dotenv from 'dotenv';

dotenv.config();

console.log('Server port:', process.env.PORT);
console.log('API key:', process.env.API_KEY);
console.log('Database URL:', process.env.DATABASE_URL);
```

Finally, run your application:

```command
node app.js
```

The `dotenv` package reads the `.env` file and loads the variables into `process.env`, giving you similar behavior to Node.js 20’s built-in support—perfect for older versions.

## Final thoughts
Environment variables make it easy to change how your Node.js app runs without touching the code. Whether you're running a quick test or managing different settings for development, testing, or production, they help keep your app clean, secure, and easy to manage. 

Node.js 20 and newer can load `.env` files without any extra tools, while older versions can use the `dotenv` package to achieve the same result.

For more information, check out:

* [Node.js Documentation](https://nodejs.org/api/process.html#processenv)
