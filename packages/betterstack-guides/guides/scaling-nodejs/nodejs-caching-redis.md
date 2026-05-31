# Improving Node.js App Performance with Redis Caching

Most applications rely heavily on data sourced from databases or APIs. Accessing
this data requires network requests, which often increases response latency, and
leads to rate-limiting issues.

Caching addresses these challenges by storing frequently accessed data in a
temporary location to allow for faster retrieval.

It minimizes the need for repeated network calls or database queries, which
results in improved application performance, reduced latency, and lower
API/network costs.

In this article, we'll examine how to implement caching in a Node.js application
using [Redis](https://redis.io/), a popular in-memory database often employed as
a distributed cache.

Along the way, you'll learn how to choose the right caching strategy, achieve a
high cache hit rate, and maintain consistency between your cache and the
underlying data sources.

Let's get started!

[ad-uptime]

## Prerequisites

- Prior Node.js development experience.
- A recent version of [Node.js](https://nodejs.org/en/download/) and
  [npm](https://www.npmjs.com/get-npm) installed on your computer.
- [Docker](https://docs.docker.com/get-started/get-docker/) and
  [SQLite](https://www.sqlite.org/download.html) installed.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/QqTB97aMa4c?si=kiRbbmuRjnyiioh5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Setting up a local Redis server

Before integrating Redis with your Node.js application, you need to set up a
Redis server. While various
[installation options](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
are available on the Redis website, read on to learn how to set it up using
Docker.

To create a Redis container from the
[official redis image](https://hub.docker.com/_/redis), execute the command
below. This will run the container in "detached" mode and map port 6379 (the
default Redis port) on your host machine to the container:

```command
docker run -d --name redis-server -p 6379:6379 redis
```

If the `redis` image isn't already present on your system, Docker will
automatically download it from Docker Hub. Once the container is created, the
command will return the container ID:

```text
[output]
6777da5730932bc064648e37098a7e1070ec09de956b7f20903ae79773059c98
```

To confirm the Redis container is running, use:

```command
docker ps
```

The output should display the container's details, including the status and
mapped ports:

```text
[output]
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                       NAMES
6777da573093   redis     "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   redis-server
```

To interact with the container, open a shell session by running:

```command
docker exec -it redis-server sh
```

Within the shell, you can access the Redis CLI by entering:

```text
# redis-cli
```

To confirm the Redis server is working correctly, use the `ping` command in the
Redis CLI:

```text
127.0.0.1:6379>ping
```

You should receive a `PONG` output, which confirms that Redis is working
normally.

![Screenshot of Redis CLI](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/855805c6-7335-4538-2334-031c1b119300/lg1x
=2060x778)

In the next section, I'll demonstrate how to connect your Node.js application to
the Redis server.

## Connecting to Redis from your Node.js app

With your Redis server running, the next step is to connect it to your Node.js
application. To get started, you can clone a pre-configured Express app from
[this repository](https://github.com/betterstack-community/nodejs-redis-caching):

```command
git clone https://github.com/betterstack-community/nodejs-redis-caching
```

Navigate to the cloned directory and install the required dependencies,
including [Express](https://www.npmjs.com/package/express) and
[dotenv](https://www.npmjs.com/package/dotenv):

```command
cd nodejs-redis-caching
```

```command
npm install
```

Rename the `.env.example` file to `.env`:

```command
mv .env.example .env
```

This file contains the following environmental variables:

```text
[label .env]
PORT=5000
REDIS_URI=redis://localhost:6379
SQLITE_FILE=user_profiles.db
```

These specify the server's listening port, the Redis connection URI, and the
SQLite database file. If your Redis server has different credentials or runs on
another host, modify the `REDIS_URI` using this format:

```text
redis[s]://[[username][:password]@][host][:port][/db-number]
```

Run the server using the following command:

```command
npm run dev
```

This uses [nodemon](https://www.npmjs.com/package/nodemon) to automatically
restart the server whenever changes are made to any of the imported files.
You'll see:

```text
[output]

> nodejs-redis-caching@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Connected to Sqlite
Server is running on http://localhost:5000
```

You're now ready to connect your application to a Redis server.

The first step is choosing whether to use the officially maintained
[node-redis](https://www.npmjs.com/package/redis) package and the third-party
[ioredis](https://www.npmjs.com/package/ioredis) package.

For this tutorial, we'll stick with the `node-redis` package which is already
installed.

Go ahead and create a `redis.js` file to handle the Redis connection:

```javascript
[label redis.js]
import process from "node:process";
import redis from "redis";

const redisClient = redis.createClient({
	url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => {
	console.error("Redis error:", err);
});

async function initializeRedisClient() {
	if (redisClient.isOpen) {
		return redisClient;
	}

	await redisClient.connect();
	await redisClient.ping();
	console.log("Connected to Redis");

	return redisClient;
}

export { initializeRedisClient };
```

This script initializes the Redis client using the `REDIS_URI` specified in the
`.`env file. The `initializeRedisClient()` function connects the client,
performs a `PING` command to verify the connection, and logs the result.

You can now update your `server.js` file to include Redis initialization:

```javascript
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
```

When you restart the server, you should see confirmation that the Redis
connection was successfully established:

```text
[output]
Connected to Redis
```

Now that you've successfully connected to Redis, let's look at some common
scenarios where caching comes in handy in typical web application development.

## Scenario 1 — Caching API responses

Imagine you're building a web application that provides real-time
Bitcoin-to-currency conversions. To fetch the latest exchange rates, your
application integrates with an external API, such as the
[CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/exchange-rates).
According to their documentation, exchange rates are updated every five minutes:

![Image of CoinGecko website documentation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6d7de7f4-7b1a-4d6e-f6f5-153004cc9900/public
=1354x776)

Given this update frequency, requesting the exchange rate multiple times within
five minutes is redundant. Such requests could slow down your endpoints,
increase costs, and potentially lead to rate-limiting by the API provider.

To optimize your usage, let's use Redis as a caching layer. By storing the
fetched exchange rates in Redis with a 5-minute expiration time, subsequent
requests within this window retrieve data directly from the cache, thus avoiding
additional API calls.

Here's how to set it up:

```javascript
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
```

Before issuing a request to the API, the server checks if the data exists in
Redis. If so, it is parsed and returned as the response. Otherwise, it is
fetched from the API and cached in Redis with the specified expiry time for
reuse in future requests.

After five minutes, Redis will remove the stale data automatically. Future
requests will then fetch fresh data and repopulate the cache.

You can try it out by using a tool like Postman, HTTPie, or `curl` to make a
request. On the first try, the data will come directly from the external API:

```command
curl 'http://localhost:5000/btc-exchange-rate'
```

```json
[output]
{
[highlight]
  "source": "api",
[/highlight]
  "data": {. . .}
}
```

You'll also see that a "cache miss" is logged in the server console:

```text
Cache miss for BTC exchange rates
```

This initial request took about 875ms with my internet connection:

![Screenshot of initial response in HTTPie](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5582345f-3078-420b-9c7c-1f1948fe6100/lg2x
=2964x1710)

Subsequent requests within the five-minute window will be served from the cache
instead:

```json
[output]
{
[highlight]
  "source": "cache",
[/highlight]
  "data": {. . .}
}
```

In my testing, I saw a **175x improvement** in response time when using the
cache:

![Screenshot of cached response in HTTPie](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/609fd3a7-512e-4746-4159-0c16d9bff300/lg2x
=2964x1710)

If your application can tolerate potentially stale data for longer, you only
need to update the expiration time to your desired value.

This approach isn't limited to API responses. You can also use it for database
queries whose results can be reused by other requests.

## Scenario 2 — Caching server responses

Caching server responses is another effective way to improve application
performance, especially for routes where the response can be reused across
multiple requests without changes. This approach can be implemented as an
Express middleware that integrates seamlessly into your application.

Add the following `redisCachingMiddleware()` function to your `server.js` file:

```javascript
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
```

This `redisCachingMiddleware()` function takes an optional `opts` object with a
default expiry time to customize caching behavior. It then returns an Express
middleware that does the same thing you did in the previous section with a few
modifications.

This time, the `cacheKey` is based on the request URL and if this key exists in
Redis, the cached data is retrieved, parsed, and sent as the response without
calling the route handler.

If the data is not cached, the middleware overrides the `res.send()` function to
intercept and cache the response before sending it to the client. The original
`res.send()` is restored afterward.

To use this middleware, apply it to the routes where response caching is
desired. Here's how your `/btc-exchange-rate/` endpoint would look now:

```javascript
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
```

This setup eliminates the need for caching logic in the route handler itself as
the middleware now handles all caching-related tasks.

You can also easily override the default cache expiry time by passing an `opts`
object:

```javascript
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
```

With this setup in place, you'll observe the same behavior as in the previous
section, but with slightly different log messages:

```text
[output]
Cache miss for /btc-exchange-rate
Cache hit for /btc-exchange-rate
Cache hit for /btc-exchange-rate
```

## Crafting effective cache keys

When creating cache keys for cached data, you need to design them properly to
ensure high cache hit rates and efficient retrieval.

A common practice is to include a prefix in cache keys to group-related values
into namespaces:

```text
<cache_prefix>:<cache_key>
```

This makes it easy to retrieve or invalidate all the values that share a single
prefix with a single command. It also prevents collisions if a single cache
server is used for multiple applications.

For caching server responses, ensure that the cache key accounts for parameters
and headers that affect the response. For example, the following requests should
generate the same key, even though the parameters are ordered differently:

```text
/api/weather?city=London&unit=metric
/api/weather?unit=metric&city=London
```

This avoids unnecessary duplication and ensures a high cache hit rate.

With this in mind, you can write a function that generates cache keys based on
everything that affects the response received from a handler:

```javascript
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
```

This function extracts the query parameters from the request and uses the
[object-hash](https://www.npmjs.com/package/object-hash) package (already
installed) to generate an order-insensitive hash. The request path is retained
in the generated key to make it easy to identify where the cached value was
generated from.

You can incorporate this key generation logic into the
`redisCachingMiddleware()` from the previous section:

```javascript
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
```

With this setup, you'll generate cache keys like the following:

```text
Cache key is: express-demo:/btc-exchange-rate:328d6e380abbc6a7ea60c9cf7954349d866e19bc
```

If the response depends on the request body or specific headers, ensure to
include them in the `data` object for hashing:

```javascript
const data = {
	query: req.query,
	body: req.body,
	headers: req.headers["x-custom-header"], // Include only relevant headers
};
```

This ensures the key reflects all factors influencing the response, preventing
incorrect cache hits or misses.

Let's talk about caching strategies next.

## Caching strategies explained

A caching strategy defines how cached data is stored, retrieved, and maintained,
ensuring efficiency and optimal performance. Strategies can be **proactive**
(pre-populating the cache) or **reactive** (populating the cache on demand).

The correct choice depends on the nature of the data and its usage patterns. For
instance, a real-time stock ticker application requires a different approach
than one displaying static historical weather data.

When choosing a caching strategy, you should consider:

- **The type of data being cached**: Is it static, real-time, or periodically
  updated?
- **Data access patterns**: How frequently is the data read, written, or
  updated?
- **Eviction policies**: How will outdated or unused data be removed?

In this section, we'll take a look at some of the most common caching patterns
to be aware of.

### 1. Cache-aside

![Diagram of cache-aside pattern](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d8563d4-a9a0-4fdc-61f4-9f82c749e700/lg1x
=2736x2108)

Cache-aside, also known as lazy loading, is a popular caching strategy where
data is fetched from the cache if available (cache hit). If not (cache miss),
the application retrieves it from the database and stores it in the cache for
future use. It's the strategy used in the examples discussed earlier in this
guide.

This approach ensures the cache holds only relevant data, making it
cost-effective and easy to implement. However, the initial request for uncached
data can be slower due to the extra step of fetching from the database.

### 2. Write-behind (Write-back)

![Diagram of write-behind pattern](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f854294c-7c58-4501-e739-0d78611d7c00/orig
=3042x984)

In the write-behind pattern, data modifications are written to the cache first
and then asynchronously to the database. This approach speeds up write
operations and reduces database load but introduces a risk of data loss if the
cache fails before the data is persisted to the database.

It is suitable for write-intensive applications where data consistency isn't
absolutely critical, such as logging user activities or collecting analytics.

### 3. Write-through

![Diagram of write-through pattern](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e12d855d-e4d4-4f65-70a7-d40eb7e94500/lg2x
=2736x2108)

The write-through pattern ensures data consistency by writing any changes to
both the cache and the database simultaneously.

It eliminates the risk of data loss associated with write-behind but increases
the latency of write operations due to the extra step of updating the cache.

The write-through pattern is almost always paired with cache-aside. If a cache
miss occurs, the data is loaded from the data store and used to update the cache
accordingly.

### 4. Read-through

![Diagram of read-through pattern](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf43c72a-9a6f-46d6-b623-b45df04d5400/public
=3036x1002)

In read-through caching, data is always read from the cache. If the requested
data isn't present, it's fetched from the database, stored in the cache, and
then returned to the application.

This approach simplifies data access by providing a single access point for both
cached and uncached data. It's suitable for read-heavy applications with
infrequent data updates, where consistent read performance is crucial.

---

To wrap up this article, let's illustrate how the write-through and cache-aside
patterns work together. Combining both approaches with an appropriate expiration
for the cached data offers both consistency and efficiency for many
applications.

## Scenario 3 — Keeping your cache in sync with reality

Let's say your application allows its users can customize their profiles and set
preferences. Since this is frequently accessed data, storing it in the cache
makes sense.

By combining the write-through and cache-aside patterns, updates are immediately
written to both the database and the cache to minimize the chance of serving
stale data.

Here's how to modify your `server.js` file to implement this:

```javascript
[label server.js]
. . .

[highlight]
function getUserCacheKey(id) {
	return `${CACHE_PREFIX}:user:${id}`;
}

async function getUserProfile(id) {
	const cachedProfile = await redisClient.get(getUserCacheKey(id));
	if (cachedProfile) {
		console.log("Cache hit for user:", id);
		return [JSON.parse(cachedProfile), true];
	}

	console.log("Cache miss for user:", id);

	const userProfile = await fetchUser(db, id);
	return [userProfile, false];
}
[/highlight]

app.get("/users/:id", async (req, res) => {
	const { id } = req.params;

	try {
[highlight]
		const [userProfile, cacheHit] = await getUserProfile(id);
[/highlight]
		if (!userProfile) {
			return res.status(404).json({ message: "User not found" });
		}

[highlight]
		if (!cacheHit) {
			await redisClient.set(getUserCacheKey(id), JSON.stringify(userProfile), {
				EX: 300,
			});
		}
[/highlight]

		res.json(userProfile);
	} catch (error) {
		console.error("Error fetching user:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.put("/users/:id/bio", async (req, res) => {
	const { id } = req.params;
	const { bio } = req.body;

	try {
[highlight]
		const [userProfile] = await getUserProfile(id);
[/highlight]

		userProfile.bio = bio.trim();

		await updateUserBio(db, id, userProfile.bio);

[highlight]
		// Update the cache (write-through)
		await redisClient.set(getUserCacheKey(id), JSON.stringify(userProfile), {
			EX: 300,
		});
[/highlight]

		res.json({ message: "User profile updated", user: userProfile });
	} catch (error) {
		console.error("Error updating user:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});
```

This code defines a `getUserProfile()` function that implements the cache-aside
pattern once again to retrieve the specified user from the cache or the
database.

In the `GET /users/:id` route, `getUserProfile()` gets the user profile and the
cache hit flag. If it's a cache miss, the code stores the fetched profile in the
Redis cache.

The `PUT /users/:id/bio` route also uses `getUserProfile()` to fetch the user
profile before updating the bio. After updating the database, the code
immediately updates the cache with the modified user profile (write-through
caching) to maintain consistency between the cache and the database.

This way, the next request to `GET /users/:id` will return the updated profile,
and not the outdated information that was present in the cache prior to the
update.

You can try it out by retrieving the user with an ID of `1`:

```command
curl http://localhost:5000/users/1
```

You'll get the following output:

```json
[output]
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "created_at": "2024-11-18 22:58:24",
  "bio": "Software engineer with 5 years of experience in web development."
}
```

And you'll see a cache miss in the server console:

```text
Cache miss for user: 1
```

The data should now be present in the cache, so if you repeat the request before
its expiration time, you'll get the same response and see a "cache hit" message
instead:

```text
Cache hit for user: 1
```

Let's say the user decides to update their bio with the following request:

```command
curl -X PUT -H "Content-Type: application/json" \
-d '{"bio": "New bio for John Doe"}' \
http://localhost:5000/users/1/bio
```

You'll get the following response now:

```json
[output]
{
  "message": "User profile updated",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "created_at": "2024-11-18 22:58:24",
[highlight]
    "bio": "New bio for John Doe"
[/highlight]
  }
}
```

And when you repeat the GET request, the data you'll get back is the updated
one:

```json
[output]
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "created_at": "2024-11-18 22:58:24",
  "bio": "New bio for John Doe"
}
```

It will be accompanied by a cache hit message in the server console to show that
the data was indeed loaded from the cache:

```text
Cache hit for user: 1
```

## Final thoughts

In this guide, we've explored practical examples of caching patterns using Redis
in a Node.js environment. These patterns reduce latency and server load and help
manage infrastructure costs while delivering a predictable user experience.

When implementing caching, remember to:

- Choose a caching strategy that aligns with your application's data access
  patterns.
- Design consistent and efficient cache keys.
- [Regularly monitor and manage your cache](https://betterstack.com/community/guides/logging/how-to-start-logging-with-redis/) to
  avoid stale or bloated data.

By understanding and combining these strategies, you can ensure that your
caching solution is robust, scalable, and effective for a wide range of
scenarios.

To learn more about Redis, see their
[documentation](https://redis.io/docs/latest/), and don't forget to check out
the
[final code](https://github.com/betterstack-community/nodejs-redis-caching/tree/final)
on GitHub.

Thanks for reading!