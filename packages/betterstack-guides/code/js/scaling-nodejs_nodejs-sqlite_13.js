# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 13

[label routes/books.router.js]
// Delete a book
booksRouter.delete('/:id', (req, res) => {
  const bookId = Number(req.params.id);

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    deleteBook.run(bookId);

    return res.status(200).json({
      message: 'Book successfully deleted',
      deletedBook: {
        id: book.book_id,
        title: book.title
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default booksRouter;