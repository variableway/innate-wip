# Source: https://betterstack.com/community/guides/scaling-nodejs/mapped-types/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/conditional.ts]
// Make only function properties optional
type OptionalMethods<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] | undefined : T[K];
};

// Convert Date properties to ISO strings
type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

interface Article {
  id: number;
  title: string;
  publishedAt: Date;
  render: () => string;
}

type ArticleWithOptionalMethods = OptionalMethods<Article>;

const article1: ArticleWithOptionalMethods = {
  id: 1,
  title: "TypeScript Guide",
  publishedAt: new Date()
  // render is optional now
};

type SerializedArticle = SerializeDates<Article>;

const article2: SerializedArticle = {
  id: 2,
  title: "Advanced Types",
  publishedAt: "2024-01-15T10:30:00.000Z",  // Date became string
  render: () => "..."
};

console.log("Article with optional methods:", article1);
console.log("Serialized article:", article2);