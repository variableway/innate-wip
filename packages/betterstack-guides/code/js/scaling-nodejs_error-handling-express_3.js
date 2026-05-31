# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 3

app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (!book) throw new Error("Book not found");
    res.json(book);
  } catch (error) {
    next(error); // Forward error to global handler
  }
});