# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 12

[label routes/books.router.js]
// Update book price
booksRouter.patch('/:id/price', (req, res) => {
  const bookId = Number(req.params.id);
  const { price } = req.body;

  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = updateBookPrice.get(price, bookId);

    return res.status(200).json({
      id: updatedBook.book_id,
      title: updatedBook.title,
      newPrice: updatedBook.price
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update book stock status
booksRouter.patch('/:id/stock', (req, res) => {
  const bookId = Number(req.params.id);
  const { inStock } = req.body;

  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'inStock must be a boolean value' });
  }

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const stockValue = inStock ? 1 : 0;
    const updatedBook = updateBookStock.get(stockValue, bookId);

    return res.status(200).json({
      id: updatedBook.book_id,
      title: updatedBook.title,
      inStock: Boolean(updatedBook.in_stock)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});