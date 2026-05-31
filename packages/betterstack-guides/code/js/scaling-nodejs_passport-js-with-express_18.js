# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 18

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