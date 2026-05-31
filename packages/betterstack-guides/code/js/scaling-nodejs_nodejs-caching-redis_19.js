# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 19

[label server.js]
. . .

[highlight]
app.get("/btc-exchange-rate/", redisCachingMiddleware(), async (req, res) => {
[/highlight]
	try {
		// Fetch exchange data from the external API
		const data = await getExchangeRates();

		// Respond with API data
		res.status(200).json(data);
	} catch (error) {
		console.error("Error fetching exchange rate:", error.message);
		res.status(500).json({ error: "Unable to fetch data" });
	}
});

. . .