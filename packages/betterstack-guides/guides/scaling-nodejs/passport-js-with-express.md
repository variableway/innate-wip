# Integrating Passport.js with Express

[Passport.js](https://www.passportjs.org) is the most popular authentication middleware for Node.js, supporting over 500 strategies with flexible, modular design. 

It simplifies the implementation of both complex and straightforward authentication flows, ranging from local logins to OAuth with social providers. 

This guide covers configuring multiple strategies, securing routes, and best practices to build robust, user-friendly authentication systems in your Express.js app.

[ad-logs]

## Prerequisites

Before diving into the implementation details, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your development machine. This guide assumes you are familiar with the basics of Express.js and fundamental web authentication concepts, such as sessions, cookies, and HTTP status codes.

## Step 1 — Creating a basic Express server

Building secure authentication requires starting with a solid foundation. You'll begin with a minimal Express server and progressively add authentication capabilities.

Create your project directory and navigate into it:

```command
mkdir passport-express-auth && cd passport-express-auth
```

Initialize your Node.js project:

```command
npm init -y
```

Configure your project to use ES modules:

```command
npm pkg set type="module"
```

Install Express to get started:

```command
npm install express
```

Create a basic server file called `app.js`:

```javascript
[label app.js]
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World - Authentication Server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Set up your development script for automatic restarts:

```command
npm pkg set scripts.dev="node --watch app.js"
```

Start your server:

```command
npm run dev
```

You should see:

```text
[output]
Server running on http://localhost:3000
```

Now visit `http://localhost:3000` in the browser of your choice.

You should see the JSON response with your "Hello World" message, confirming that Express is working correctly.

![Basic Express server response showing Hello World JSON message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/25b4b631-bedf-46fc-35dd-658646f22100/lg2x =3248x1994)

This basic setup provides us with a working Express server that can respond with JSON. The server runs on port `3000` and handles GET requests with a simple message, serving as the foundation for building our authentication system.


## Step 2 — Adding essential middleware

Authentication systems require several middleware components for request parsing, logging, and handling cross-origin requests. You'll add these foundational pieces before implementing Passport.js to ensure your server can properly handle authentication requests.

Install the additional middleware packages:

```command
npm install morgan cors
```

These middleware components serve specific purposes in your authentication system:

- `morgan` provides HTTP request logging for monitoring and debugging
- `cors` enables Cross-Origin Resource Sharing for API accessibility

Update your `app.js` to include the essential middleware:

```javascript
[label app.js]
import express from 'express';
[highlight]
import morgan from 'morgan';
import cors from 'cors';
[/highlight]

const app = express();

[highlight]
// Essential middleware
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
[/highlight]

app.get('/', (req, res) => {
  res.json({ message: 'Hello World - Authentication Server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

In the updated code, you are building a strong middleware foundation for authentication. 


Morgan logging displays all incoming requests in your terminal, making it significantly easier to debug authentication flows as they occur. 

The CORS configuration allows credentials to be sent explicitly across different origins, which becomes essential when implementing session-based authentication.

Additionally, you're enabling both JSON and URL-encoded request parsing, ensuring your server can handle authentication requests whether they come as JSON payloads from API clients or form submissions from web interfaces.

Save your changes, and you'll notice Morgan now logs each request to your terminal. Visit `http://localhost:3000` again and you should see a log entry like:

```text
[output]
Server running on http://localhost:3000
GET / 200 2.141 ms - 49
```

This confirms your middleware stack is configured correctly and ready for authentication integration.

## Step 3 — Installing Passport.js, sessions, and creating user storage

Authentication systems require three foundational components working together: session management for maintaining user state, Passport.js for handling authentication strategies, and a user storage system. You'll set up all three components in this step to create a cohesive authentication foundation.

Install all the required dependencies for authentication and database functionality:

```command
npm install express-session passport passport-local sequelize sqlite3 bcrypt uuid
```

These packages work together to provide complete authentication capabilities. Express-session maintains user sessions across requests, while passport and passport-local handle the authentication logic. 

Sequelize and sqlite3 provide database functionality, bcrypt ensures secure password hashing, and uuid generates unique user identifiers.

Add session configuration and Passport initialization to your server:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
[highlight]
import session from 'express-session';
import passport from 'passport';
[/highlight]

const app = express();

// Essential middleware
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

[highlight]
// Session configuration
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
[/highlight]

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World - Authentication Server',
    [highlight]
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
    [/highlight]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

In this setup, you're configuring the session middleware to create secure user sessions with optimized settings.

 The `resave: false` and `saveUninitialized: false` options prevent unnecessary session writes, boosting performance. Passport initialization sets up the authentication framework and integrates seamlessly with your existing session system. 

You've also updated the root route to display authentication status using Passport's `req.isAuthenticated()` method.

Now create the directory structure for your database and models:

```command
mkdir -p config models data
```


Create your database configuration file:

```javascript
[label config/database.js]
import { Sequelize } from 'sequelize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'auth.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

export default sequelize;
```

This configuration establishes your SQLite database connection, creating the database file in a `data` directory and disabling query logging for cleaner output.

Create a secure User model with automatic password hashing:

```javascript
[label models/user.js]
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const saltRounds = 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  }
});

// Add password validation method
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
```

This model defines your user table with UUID primary keys, automatic password hashing using bcrypt hooks, and a secure password validation method for authentication.

The User model includes automatic password hashing through Sequelize hooks, ensuring passwords are never stored in plain text. The `validatePassword` method provides secure password comparison using bcrypt's built-in timing-safe comparison.

Finally, integrate the database with your Express application:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
[highlight]
import sequelize from './config/database.js';
import User from './models/user.js';
[/highlight]

const app = express();

...
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

[highlight]
// Database initialization
async function initDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database error:', error);
  }
}
[/highlight]

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World - Authentication Server',
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});

const PORT = process.env.PORT || 3000;
[highlight]
app.listen(PORT, async () => {
[/highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  [highlight]
  await initDatabase();
  [/highlight]
});
```

This updated app imports your database configuration and User model, then initializes the database when the server starts, creating tables automatically through Sequelize's sync method.

Save your changes and you should see the complete initialization:

```text
[output]
Server running on http://localhost:3000
Database synchronized
```

Your authentication foundation is now complete with sessions, Passport integration, and secure user storage all working together.

Visit `http://localhost:3000` to confirm everything is working. You should see the authentication status in the response:


![Screenshot of the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/574d2469-c235-4e29-f67f-aa3505e90b00/md1x =3248x1994)


```json
[output]
{"message":"Hello World - Authentication Server","authenticated":false}
```

The `authenticated: false` status is expected since you haven't implemented login functionality yet. This confirms that your Express server, sessions, Passport.js initialization, and database synchronization are all working correctly together.

## Step 4 — Configuring Passport local strategy

With your database and Passport foundation ready, you need to configure Passport's Local Strategy to handle username/password authentication. This involves telling Passport how to verify credentials and manage user sessions.

Create a configuration file for your Passport strategies:

```javascript
[label config/passport.js]
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';

// Configure Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;
```

This strategy configuration defines how Passport verifies user credentials. It looks up users by username and uses the `validatePassword` method you created earlier for secure password comparison.

Now add session serialization to handle user sessions:

```javascript
[label config/passport.js]
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';

// Configure Local Strategy
passport.use(new LocalStrategy(
  ...
));

[highlight]
// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
[/highlight]

export default passport;
```

Session serialization stores only the user ID in the session for efficiency, while deserialization retrieves the full user object when needed. This keeps sessions lightweight while maintaining complete user access throughout your application.

Import this configuration in your main app:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import sequelize from './config/database.js';
import User from './models/user.js';
[highlight]
import './config/passport.js';
[/highlight]

// ... rest of your app remains the same
```

This import ensures your Passport strategy configuration is loaded when the application starts, making the Local Strategy available for authentication requests.

Save your changes and restart your server. You should see the same output as before, but now Passport is configured with your Local Strategy and ready to authenticate users:

```text
[output]
Server running on http://localhost:3000
Database synchronized
```

Your Passport configuration is now complete and ready to handle user authentication. In the next step, you'll create the authentication routes that users will interact with.



## Step 5 — Creating authentication routes

Now that Passport is configured with your Local Strategy, you'll create the actual authentication endpoints that users will interact with. You'll start with registration and login routes to handle user account creation and authentication.

Create a routes directory and authentication router:

```command
mkdir routes
```

```javascript
[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

export default router;
```

This creates the foundation for your authentication routes using Express Router, which allows you to organize routes in separate modules.

Now add the registration endpoint:

```javascript
[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

[highlight]
// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user (password will be hashed automatically)
    const user = await User.create({ username, password });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
[/highlight]

export default router;
```

This registration endpoint creates new users while preventing duplicates and automatically hashing passwords through your Sequelize hook. The response excludes the password for security reasons.

Add the login endpoint that uses your Passport Local Strategy:

```javascript
[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await User.create({ username, password });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

[highlight]
// Login endpoint
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: info.message || 'Login failed' });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }
      
      res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    });
  })(req, res, next);
});
[/highlight]

export default router;
```

The login endpoint uses Passport's `authenticate` method with a custom callback, giving you complete control over the authentication response format and error handling.

Connect your authentication routes to the main application:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import sequelize from './config/database.js';
import User from './models/user.js';
import './config/passport.js';
[highlight]
import authRoutes from './routes/auth.js';
[/highlight]

const app = express();

...
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

[highlight]
// Routes
app.use('/auth', authRoutes);
[/highlight]

// Database initialization
async function initDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database error:', error);
  }
}
...
```

This mounts your authentication routes under the `/auth` path, making them accessible at `/auth/register` and `/auth/login`.

Save your changes, and you should see the familiar server startup:

```text
[output]
Server running on http://localhost:3000
Database synchronized
```

Your authentication routes are now ready for testing. In the next step, you'll test the registration and login functionality using command-line tools.


## Step 6 — Testing user registration and login

With your authentication routes in place, you can now test the complete registration and login functionality. You'll use curl commands to simulate client requests, though you can also use Postman or any other API testing tool for a more visual experience.

First, test user registration by creating a new account:

```command
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -s | jq
```

You should receive a successful registration response:

```json
[output]
{
  "message": "User created successfully",
  "user": {
    "id": "50c45f88-2934-4ff3-94d0-2db9be0a19ba",
    "username": "testuser"
}
```

If you prefer using Postman, create a POST request to `http://localhost:3000/auth/register` with the same JSON body but a different username:

![Postman registration request showing POST method, URL, and JSON body with username and password](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d54b21c-7adb-492c-ff21-ac079989a900/lg2x =3248x1996)

The response confirms that your user was created successfully with a unique UUID and that the password was automatically hashed before storage.

Now test the login functionality using the credentials you just created:

```command
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt \
  -s | jq
```

The `-c cookies.txt` flag saves the session cookie for subsequent requests. You should see a successful login response:

```json
[output]
{
  "message": "Login successful",
  "user": {
    "id": "50c45f88-2934-4ff3-94d0-2db9be0a19ba",
    "username": "testuser"
}
```

This confirms that your Passport Local Strategy successfully authenticated the user and created a session.

Test the authentication status by visiting the root route with your saved session cookie:

```command
curl http://localhost:3000/ \
  -b cookies.txt \
  -s | jq
```

You should now see that the authentication status has changed:

```json
[output]
{
  "message": "Hello World - Authentication Server",
  "authenticated": true
}
```


The `authenticated: true` status confirms that your session is working correctly and that Passport recognizes the logged-in user.

Now test error handling by attempting to register a duplicate user:

```command
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"anotherpass"}' \
  -s | jq
```

You should receive an error response:

```json
[output]
{
  "error": "User already exists"
}
```

Test invalid login credentials to verify authentication security:

```command
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"wrongpassword"}' \
  -s | jq
```

You should see an authentication failure:

```json
[output]
{
  "error": "Invalid username or password"
}
```

These tests confirm that your registration prevents duplicates, your login authentication works correctly with valid credentials, sessions are maintained properly, and invalid credentials are rejected securely. 

Whether you use curl or Postman, your authentication system is now fully functional and ready for additional features.



## Step 7 — Adding logout and protected routes

Complete your authentication system by implementing logout functionality and demonstrating how to protect routes that require user authentication. These features round out the core authentication workflow and show how to secure different parts of your application.

Add logout and profile routes to your authentication router:

```javascript
[label routes/auth.js]
// ... existing imports and routes

// Login endpoint
router.post('/login', (req, res, next) => {
  // ... existing login code
});

[highlight]
// Logout endpoint
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Profile endpoint (protected route example)
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    message: 'Profile data',
    user: { id: req.user.id, username: req.user.username }
  });
});
[/highlight]

export default router;
```

The logout endpoint uses Passport's `logout` method to destroy the user session and clear authentication state. The profile endpoint demonstrates route protection by checking authentication status before returning sensitive data.

Test the logout functionality with your existing session:

```command
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt \
  -s | jq
```

You should see a successful logout response:

```json
[output]
{
  "message": "Logout successful"
}
```

Verify that the session has been destroyed by checking the authentication status:

```command
curl http://localhost:3000/ \
  -b cookies.txt \
  -s | jq
```

The authentication status should now be false:

```json
[output]
{
  "message": "Hello World - Authentication Server",
  "authenticated": false
}
```

Test the protected profile route without authentication to see the protection in action:

```command
curl http://localhost:3000/auth/profile \
  -s | jq
```

You should receive an authentication error:

```json
[output]
{
  "error": "Not authenticated"
}
```

Now log back in and test the protected route with valid authentication:

```command
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt \
  -s | jq
```

Access the profile route with your authenticated session:

```command
curl http://localhost:3000/auth/profile \
  -b cookies.txt \
  -s | jq
```

You should now see the protected profile data:

```json
[output]
{
  "message": "Profile data",
  "user": {
    "id": "50c45f88-2934-4ff3-94d0-2db9be0a19ba",
    "username": "testuser"
  }
}
```

This demonstrates how to implement route-level authentication protection in your Express application. The pattern of checking `req.isAuthenticated()` can be applied to any route that requires user authentication, ensuring that only logged-in users can access protected resources.

Your authentication system now includes complete user registration, login, logout, and route protection functionality.

## Final thoughts

You've successfully built a complete authentication system using Passport.js and Express with secure password hashing, session management, protected routes, and comprehensive error handling.

The modular structure makes it easy to extend with additional features like password reset, email verification, or OAuth strategies. Explore the [official Passport.js documentation](https://www.passportjs.org/docs/) and strategy packages to learn about additional authentication methods.

For production, consider implementing rate limiting, HTTPS enforcement, secure session storage, and comprehensive logging. Your authentication foundation is now ready to secure real-world applications.