# Source: https://betterstack.com/community/guides/scaling-nodejs/multer-in-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]

...
[highlight]
// Error handler for file filter rejections
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});
[/highlight]

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});