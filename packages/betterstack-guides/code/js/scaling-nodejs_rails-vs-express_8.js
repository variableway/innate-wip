# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 8

[label app.js]
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/products', productRoutes);