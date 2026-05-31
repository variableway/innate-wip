# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 8

app.get("/books/:id", async (req, res) => {
  const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) throw new AppError("Book not found", 404); // Automatically forwarded to error handler
  res.json(book);
});