# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 11

// Option 2: Sequelize with PostgreSQL
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(8, 2), allowNull: false }
});

Product.getBestsellers = async function() {
  return await Product.findAll({
    include: [{ model: OrderItem, include: [Order] }],
    group: ['Product.id'],
    order: [[sequelize.fn('COUNT', sequelize.col('OrderItems.id')), 'DESC']],
    limit: 10
  });
};