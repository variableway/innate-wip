# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 25

[label server.js]
. . .
[highlight]
const CACHE_PREFIX = "express-demo";
[/highlight]

function redisCachingMiddleware(
	opts = {
		EX: 300,
	},
) {
	return async (req, res, next) => {
		try {
			// Construct the cache key based on the request
            [highlight]
			const cacheKey = `${CACHE_PREFIX}:${generateCacheKeyFromReq(req)}`;
			console.log("Cache key is:", cacheKey);
            [/highlight]

            . . .
		} catch (error) {
			console.error("Error in redisCachingMiddleware:", error);
			next(error); // Pass the error to the error handling middleware
		}
	};
}