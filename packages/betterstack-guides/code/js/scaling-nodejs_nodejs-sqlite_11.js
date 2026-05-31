# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 11

[label routes/books.router.js]
. . .
// Add a new book
booksRouter.post('/', (req, res) => {
  const { title, author, isbn, publishedYear, genre, price } = req.body;

  // Basic validation
  if (!title || !author || !price) {
    return res.status(400).json({ error: 'Title, author, and price are required' });
  }

  try {
    const inStock = 1; // Default to in stock
    const createdAt = Date.now();

    const newBook = addBook.get(
      title,
      author,
      isbn || null,
      publishedYear || null,
      genre || null,
      price,
      inStock,
      createdAt
    );

    return res.status(201).json({
      id: newBook.book_id,
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      price: newBook.price
    });
  } catch (error) {
    // Handle duplicate ISBN error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'ISBN already exists in the database' });
    }
    return res.status(500).json({ error: error.message });
  }
});