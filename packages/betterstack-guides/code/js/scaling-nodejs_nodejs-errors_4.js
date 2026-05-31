# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 4

app.get("/", (req, res) => {
  // listen for the 'close' event on the request
  req.on("close", () => {
    console.log("closed connection");
  });

  console.log(res.socket.destroyed); // true if socket is closed
});