# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 27

const data = {
	query: req.query,
	body: req.body,
	headers: req.headers["x-custom-header"], // Include only relevant headers
};