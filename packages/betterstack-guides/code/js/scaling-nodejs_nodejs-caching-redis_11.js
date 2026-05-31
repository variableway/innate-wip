# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 11

[label server.js]
import express from "express";
import "dotenv/config";
import process from "node:process";
import bodyParser from "body-parser";
import { connectToDB, fetchUser, updateUserBio } from "./db.js";
[highlight]
import { initializeRedisClient } from "./redis.js";
[/highlight]

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

let db;
[highlight]
let redisClient;
[/highlight]

try {
	db = connectToDB(process.env.SQLITE_FILE);
[highlight]
	redisClient = await initializeRedisClient();
[/highlight]
} catch (err) {
	console.error(err);
	process.exit();
}

. . .