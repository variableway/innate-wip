# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 20

[label server.js]
app.get(
	"/btc-exchange-rate/",
    [highlight]
	redisCachingMiddleware({
		EX: 600, // Set cache expiry to 10 minutes
	}),
    [/highlight]
	async (req, res) => { . . . },
);