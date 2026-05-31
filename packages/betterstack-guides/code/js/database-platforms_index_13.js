# Source: https://betterstack.com/community/guides/database-platforms/index/
# Original language: javascript
# Normalized: js
# Block index: 13

[label index.js]
import PocketBase from "pocketbase";

// Initialize the client
const pb = new PocketBase("http://YOUR_SERVER_IP:8090");

async function getPosts() {
  try {
    // Fetch a paginated list of records from the "posts" collection
[highlight]
    const resultList = await pb.collection("posts").getList(1, 50, {
      filter: "published = true", // Optional: only fetch published posts
    });
[/highlight]

    console.log("Successfully fetched posts:");
    console.log(JSON.stringify(resultList, null, 2));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

getPosts();