# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 6

[label models/Product.js]
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);