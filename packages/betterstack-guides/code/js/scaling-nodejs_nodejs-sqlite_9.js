# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 9

[label routes/books.router.js]
import express from 'express';
import {
  addBook,
  getAllBooks,
  getBooksByGenre,
  getBookById,
  updateBookPrice,
  updateBookStock,
  deleteBook
} from '../data/queries.js';

const booksRouter = express.Router();

// Get all books or filter by genre
booksRouter.get('/', (req, res) => {
  const { genre } = req.query;

  try {
    let books;

    if (genre) {
      books = getBooksByGenre.all(genre);
    } else {
      books = getAllBooks.all();
    }

    // Format dates and boolean values
    const formattedBooks = books.map(book => ({
      id: book.book_id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.published_year,
      genre: book.genre,
      price: book.price,
      inStock: Boolean(book.in_stock),
      addedOn: new Date(book.created_at).toISOString()
    }));

    return res.status(200).json(formattedBooks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});