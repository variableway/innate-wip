# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 16

app.get("/data", async (req, res, next) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Abort after 5s

  try {
    const response = await fetch("https://api.example.com/data", {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch external data");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error.name === "AbortError") {
      next(new AppError("Request timed out", 504)); // Gateway Timeout
    } else {
      next(new AppError("External API failed", 502));
    }
  } finally {
    clearTimeout(timeout);
  }
});