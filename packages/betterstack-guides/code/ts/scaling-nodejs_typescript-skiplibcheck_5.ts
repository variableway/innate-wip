# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-skiplibcheck/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/app.ts]
import express from "express";
import { format, addDays } from "date-fns";
import { chunk, shuffle } from "lodash";

const app = express();

app.get("/", (req, res) => {
  const today = new Date();
  const nextWeek = addDays(today, 7);

  res.json({
    today: format(today, "yyyy-MM-dd"),
    nextWeek: format(nextWeek, "yyyy-MM-dd")
  });
});

app.get("/data", (req, res) => {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const shuffled = shuffle(numbers);
  const chunked = chunk(shuffled, 10);

  res.json({
    total: numbers.length,
    chunks: chunked.length,
    firstChunk: chunked[0]
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});