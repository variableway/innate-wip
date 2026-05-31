# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 18

[label server.js]
. . .
function redisCachingMiddleware(
	opts = {
		EX: 300,
	},
) {
	return async (req, res, next) => {
		try {
			// Construct the cache key based on the request
			const cacheKey = `${req.originalUrl}`;

			// Check if data exists in Redis cache
			const cachedData = await redisClient.get(cacheKey);
			if (cachedData) {
				console.log(`Cache hit for ${req.originalUrl}`);
				// If data exists, parse and send the cached response
				const parsedData = JSON.parse(cachedData);
				return res.json(parsedData);
			}

			console.log(`Cache miss for ${req.originalUrl}`);
			// If data not in cache, proceed to the next middleware/route handler
			res.handlerSend = res.send; // Store original res.send
			res.send = async (body) => {
				res.send = res.handlerSend;

				// Cache the response data before sending it on 2xx codes only
				if (res.statusCode.toString().startsWith("2")) {
					await redisClient.set(cacheKey, body, opts);
				}

				return res.send(body);
			};

			next();
		} catch (error) {
			console.error("Error in redisCachingMiddleware:", error);
			next(error); // Pass the error to the error handling middleware
		}
	};
}
. . .