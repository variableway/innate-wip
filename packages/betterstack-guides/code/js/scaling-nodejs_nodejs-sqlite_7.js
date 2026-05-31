# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 7

[label data/queries.js]
import database from './model.js';

// Book operations
const addBook = database.prepare(`
  INSERT INTO books (title, author, isbn, published_year, genre, price, in_stock, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING book_id, title, author, genre, price
`);

const getAllBooks = database.prepare(`
  SELECT * FROM books
`);

const getBooksByGenre = database.prepare(`
  SELECT * FROM books WHERE genre = ?
`);

const getBookById = database.prepare(`
  SELECT * FROM books WHERE book_id = ?
`);

const updateBookPrice = database.prepare(`
  UPDATE books SET price = ? WHERE book_id = ?
  RETURNING book_id, title, price
`);

const updateBookStock = database.prepare(`
  UPDATE books SET in_stock = ? WHERE book_id = ?
  RETURNING book_id, title, in_stock
`);

const deleteBook = database.prepare(`
  DELETE FROM books WHERE book_id = ?
`);

export {
  addBook,
  getAllBooks,
  getBooksByGenre,
  getBookById,
  updateBookPrice,
  updateBookStock,
  deleteBook
};