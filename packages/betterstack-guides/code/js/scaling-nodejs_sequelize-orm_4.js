# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 4

[label models/book.js]
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Book = sequelize.define('Book', {
  // Model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'books',
  timestamps: true // Adds createdAt and updatedAt columns
});

// Method to get book details
Book.prototype.getDetails = function() {
  return `${this.title} by ${this.author} - ${this.price}`;
};

module.exports = Book;