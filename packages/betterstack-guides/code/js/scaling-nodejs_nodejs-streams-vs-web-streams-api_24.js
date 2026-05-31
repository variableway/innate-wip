# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams-vs-web-streams-api/
# Original language: javascript
# Normalized: js
# Block index: 24

...
createMovieReadableStream
  .pipe(formatReleaseDate)
  .pipe(createWritableStream())
  .on("finish", () => {
    console.log("Stream ended");
  })
  .on("error", (err) => {
    console.error("Stream error:", err);
  });