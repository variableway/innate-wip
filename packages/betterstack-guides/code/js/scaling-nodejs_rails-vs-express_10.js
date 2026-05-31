# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 10

// Option 1: Mongoose with MongoDB
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

productSchema.statics.getBestsellers = function() {
  return this.aggregate([
    { $lookup: { from: 'orders', localField: 'orders', foreignField: '_id', as: 'orderData' } },
    { $project: { name: 1, price: 1, orderCount: { $size: '$orderData' } } },
    { $sort: { orderCount: -1 } },
    { $limit: 10 }
  ]);
};