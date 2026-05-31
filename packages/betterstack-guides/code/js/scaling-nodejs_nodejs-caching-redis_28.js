# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: javascript
# Normalized: js
# Block index: 28

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