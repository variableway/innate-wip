# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 24

[label server.js]
import express from "express";
import "dotenv/config";
import process from "node:process";
import bodyParser from "body-parser";
[highlight]
import hash from "object-hash";
[/highlight]
import { connectToDB, fetchUser, updateUserBio } from "./db.js";
import { initializeRedisClient } from "./redis.js";

. . .

[highlight]
function generateCacheKeyFromReq(req) {
	const data = {
		query: req.query,
	};

	return `${req.path}:${hash(data)}`;
}
[/highlight]

. . .