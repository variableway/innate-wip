# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 10

[label routes/books.router.js]
. . .
// Get a specific book by ID
booksRouter.get('/:id', (req, res) => {
  const bookId = Number(req.params.id);

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const formattedBook = {
      id: book.book_id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.published_year,
      genre: book.genre,
      price: book.price,
      inStock: Boolean(book.in_stock),
      addedOn: new Date(book.created_at).toISOString()
    };

    return res.status(200).json(formattedBook);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});