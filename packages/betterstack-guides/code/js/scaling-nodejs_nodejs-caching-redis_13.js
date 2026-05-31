# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 13

[label server.js]
app.get("/btc-exchange-rate/", async (req, res) => {
	const cacheKey = "btc-exchange-rate";
	const cacheExpiry = 300; // 5 minutes

	try {
		const cachedData = await redisClient.get(cacheKey);

		if (cachedData) {
			console.log("Cache hit for BTC exchange rates");
			return res.status(200).json({
				source: "cache",
				data: JSON.parse(cachedData),
			});
		}

		console.log("Cache miss for BTC exchange rates");

		// Fetch data from the external API
		const data = await getExchangeRates();

		// Store data in Redis with an expiry
		await redisClient.set(cacheKey, JSON.stringify(data), { EX: cacheExpiry });

		// Respond with API data
		res.status(200).json({
			source: "api",
			data,
		});
	} catch (error) {
		console.error("Error fetching exchange rate:", error.message);
		res.status(500).json({ error: "Unable to fetch data" });
	}
});