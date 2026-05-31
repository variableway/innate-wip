# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 17

const fetchWithTimeout = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn(`Timeout attempt ${attempt}. Retrying...`);
      } else {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new AppError("External API failed after retries", 502);
};