# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-debugging/
# Original language: javascript
# Normalized: js
# Block index: 22

[label server.js]
const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600 });
const app = express();
const port = 3000;

async function searchWikipedia(searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${searchQuery}`;
  const response = await axios.get(endpoint);
  return response.data;
}

app.get("/", async (req, res) => {
  let searchQuery = req.query.q || "";
  searchQuery = searchQuery.trim();

  if (!searchQuery) {
    res.status(400).send("Search query cannot be empty");
    return;
  }

  const cacheKey = "wikipedia:" + searchQuery;

  try {
    let data = myCache.get(cacheKey);

    if (data == null) {
      data = await searchWikipedia(searchQuery);
      myCache.set(cacheKey, data, 300);
    }

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

const server = app.listen(port, () => {
  console.log(`Wikipedia app listening on port ${port}`);
});