# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 5

[highlight]
import { errorHandler } from "./middlewares/errorHandler.js";
[/highlight]
...
app.get("/books/:id", async (req, res, next) => {
  ...
});
[highlight]
app.use(errorHandler); // Register error-handling middleware
[/highlight]