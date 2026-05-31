# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 19

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit to 5 attempts per 10 minutes
  message: { status: "error", message: "Too many failed login attempts. Try again later." },
});

app.post("/login", loginLimiter, (req, res) => {
  // Login logic
});