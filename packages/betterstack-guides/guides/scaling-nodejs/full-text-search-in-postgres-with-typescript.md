# Full‑Text Search in Postgres with TypeScript

## Introduction

Full-text search powers everything from e-commerce product discovery to documentation sites. While many developers reach for complete solutions like Algolia or Elasticsearch, PostgreSQL's built-in full-text search delivers millisecond response times on millions of documents with zero additional infrastructure. We'll build a complete search solution using [Bun](https://bun.sh/), [Drizzle ORM](https://orm.drizzle.team/), and [PostgreSQL's `tsvector`](https://www.postgresql.org/docs/current/textsearch.html) to show you how simple yet powerful database-native search can be.

## Prerequisites

Before we dive in, ensure you have the following set up:

- **Bun runtime** installed ([Bun](https://bun.sh/)) - see our [Introduction to Bun](https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/)
- **PostgreSQL** database running and accessible. You'll need at least version `12` to support all features used in this guide.
- Basic knowledge of PostgreSQL and JavaScript/TypeScript

[ad-logs]

## Project setup

Let's start by initializing our project and setting up the basic structure.

Initialize the project with Bun:

```command
mkdir article-search && cd article-search
```

```command
bun init -y
```

Feel free to delete the default `index.ts` file - we won't use it:

```command
rm index.ts
```

Now install dependencies:

```command
bun add drizzle-orm
```
```command
bun add -d @types/bun drizzle-kit pg
```

Create a `.env` file with your PostgreSQL connection string. Note that Bun [automatically loads](https://bun.sh/docs/runtime/env) `.env` files, so we don't need the `dotenv` package.

```env
[label .env]
DATABASE_URL=postgres://username:password@localhost:5432/article_search
```

If you don't have a PostgreSQL database up and running, you can use the following command to start a new PostgreSQL database using Docker:

```command
[label Optional - if you don't already have PostgreSQL up & running]
docker run -d --name postgres-article-search -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=article_search -p 5432:5432 postgres:latest
```

Now let's set up our database connection with Drizzle:

```typescript
[label src/db/index.ts]
import { drizzle } from 'drizzle-orm/bun-sql';

export const db = drizzle(process.env.DATABASE_URL!);
```

## Creating the Basic Schema

We'll start with a simple articles table that we can use to demonstrate search capabilities:

```typescript
[label src/db/schema.ts]
import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';

export const articlesTable = pgTable('articles', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    // We'll add our search-optimized column here soon!
});
```

Create the Drizzle configuration file:

```typescript
[label drizzle.config.ts]
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Now generate the migration:

```command
bun drizzle-kit generate
```

And run the migration:

```command
bun drizzle-kit migrate
```

If you would like to learn more about Drizzle, better understand the schema and configuration we just used, and the migrations, see our [Getting started with Drizzle ORM](https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/) guide.

## Seeding Sample Data

Let's create some sample articles to work with, feel free to add your own examples:

```typescript
[label src/db/seed.ts]
import { db } from './index';
import { articlesTable } from './schema';

const sampleArticles = [
  {
    title: "Better Stack: Complete Observability for Modern Applications",
    body: "Better Stack provides comprehensive logging, uptime monitoring, and incident management. With Better Stack's advanced log management, you can centralize logs from all your applications, set up intelligent alerts, and debug issues faster. The platform excels at log aggregation, structured logging, and real-time log analysis, making it essential for maintaining application reliability and performance monitoring."
  },
  {
    title: "Getting Started with PostgreSQL Full-Text Search",
    body: "PostgreSQL offers powerful full-text search capabilities built right into the database. Learn how to use tsvector, tsquery, and GIN indexes to implement fast and accurate search functionality without external dependencies."
  },
  {
    title: "TypeScript Best Practices for 2024",
    body: "Modern TypeScript development requires understanding of advanced types, proper configuration, and effective tooling. This comprehensive guide covers everything from basic setup to complex type manipulations and performance optimization."
  },
  {
    title: "Building Scalable APIs with Node.js",
    body: "API design and implementation strategies for high-performance Node.js applications. Topics include authentication, rate limiting, caching strategies, and database optimization techniques for modern web services."
  },
  {
    title: "Database Performance Optimization Techniques",
    body: "Comprehensive guide to optimizing database performance including indexing strategies, query optimization, connection pooling, and monitoring. Learn how to identify bottlenecks and improve application response times."
  },
  {
    title: "Modern JavaScript Framework Comparison",
    body: "Detailed analysis of React, Vue, Angular, and Svelte. Compare performance characteristics, developer experience, ecosystem maturity, and use case recommendations for each framework in 2024."
  }
];

async function seed() {
  console.log('🌱 Seeding database...');
  
  try {
    await db.insert(articlesTable).values(sampleArticles);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
```

Run the seed script:

```command
bun run src/db/seed.ts
```

And you should see output like this:

![Running the seed script](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/beb65bb9-9447-415b-586a-31e1c407af00/lg1x =1916x336)

## Building a Simple CLI Search App

Let's create a basic CLI application to demonstrate our search functionality. We'll start with a simple prompt-based interface:

```typescript
[label src/index.ts]
import { db } from './db/index';
import { articlesTable } from './db/schema';
import { ilike, or } from 'drizzle-orm';

async function searchArticlesLike(query: string) {
  const searchTerm = `%${query}%`;
  
  const startTime = performance.now();
  
  const results = await db
    .select()
    .from(articlesTable)
    .where(
      or(
        ilike(articlesTable.title, searchTerm),
        ilike(articlesTable.body, searchTerm)
      )
    )
    .limit(10);
  
  const endTime = performance.now();
  const searchTime = (endTime - startTime).toFixed(2);
  
  return { results, searchTime };
}

function displayLikeResults(results: any[], searchTime: string, query: string) {
  console.log(`\n🔍 ILIKE search results for "${query}" (${searchTime}ms):`);
  console.log('─'.repeat(60));
  
  if (results.length === 0) {
    console.log('No articles found.');
    return;
  }
  
  results.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title}`);
    console.log(`   ${article.body.substring(0, 120)}...`);
    console.log(`   ID: ${article.id} | Created: ${article.createdAt.toDateString()}`);
  });
}

async function main() {
  console.log('🚀 Article Search CLI');
  console.log('Compare ILIKE vs Full-Text Search performance');
  
  while (true) {
    const query = prompt('\n📝 Enter search query (or "exit" to quit): ');
    
    if (!query || query.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      break;
    }
    
    try {
      const likeResults = await searchArticlesLike(query);
      displayLikeResults(likeResults.results, likeResults.searchTime, query);
    } catch (error) {
      console.error('❌ Search error:', error);
    }
  }
  
  process.exit(0);
}

main();
```

There's nothing complex going on, just simple search using the built-in `ILIKE` wildcard matching, and a CLI around it. We can test it out by running:

```command
bun run src/index.ts
```

Try searching for terms like "logging", "Better Stack", "PostgreSQL", or "TypeScript" to see the `ILIKE`-based search in action.

![Testing out simple ILIKE search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/41405006-7965-4a42-7699-cd977ee34600/lg2x =1916x1082)

## Understanding `ILIKE` Query Limitations

While our basic search works, `ILIKE` queries have significant limitations:

**Performance Issues:** `ILIKE` queries with wildcards can't use standard indexes effectively, leading to full table scans on larger datasets.

**Limited Matching:** `ILIKE` requires exact substring matches and doesn't understand word variations (e.g., "optimize" won't match "optimization" from our database articles).

![Searching for "optimize" results in no articles](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/283eddca-5890-4fab-ab27-d53c9801b600/lg2x =1916x374)

**No Relevance Ranking:** Results appear in database order rather than relevance to the search query.

## Introducing PostgreSQL `tsvector`

PostgreSQL's `tsvector` (text search vector) solves these limitations by preprocessing text into a normalized, searchable format. It handles:

* **Stemming**: Reduces words to their base forms ("logging" → "log")
* **Stop word removal**: Eliminates common words like "the", "and", "is"
* **Language awareness**: Understands linguistic rules for better matching
* **Ranking**: Provides relevance scores for search results

Let's enhance our schema to include full-text search capabilities using [PostgreSQL's generated columns](https://www.postgresql.org/docs/current/ddl-generated-columns.html):

```typescript
[label src/db/schema.ts]
[highlight]
import { pgTable, serial, timestamp, text, index, customType } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';

// Custom tsvector type for Drizzle
export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return 'tsvector';
  },
});
[/highlight]

export const articlesTable = pgTable('articles', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
[highlight]
    // Search vector combining title and body with different weights
    searchVector: tsvector('search_vector')
      .notNull()
      .generatedAlwaysAs((): SQL => 
        sql`setweight(to_tsvector('english', ${articlesTable.title}), 'A') || 
            setweight(to_tsvector('english', coalesce(${articlesTable.body}, '')), 'B')`
      ),
}, (table) => [
  // GIN index for fast full-text search
  index('articles_search_idx').using('gin', table.searchVector),
]);
[/highlight]
```

Let's break down what's happening in our enhanced schema:

**`to_tsvector('english', text)`** converts raw text into a `tsvector` by applying language-specific rules for stemming, stop word removal, and normalization. The 'english' configuration handles common English language processing. [Learn more about text search configurations](https://www.postgresql.org/docs/current/textsearch-controls.html).

**`setweight(tsvector, weight)`** assigns importance levels to different parts of your content. Weights range from 'A' (highest) to 'D' (lowest), allowing you to prioritize title matches over body content in search rankings. [Read about weight assignment](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING).

**Generated columns** automatically maintain the search vector whenever the source columns change, eliminating synchronization issues between your content and search index. This PostgreSQL 12+ feature ensures your search data stays current without manual triggers.

**GIN indexes** (Generalized Inverted Index) are specifically designed for full-text search, providing fast lookups by creating an inverted index of all lexemes. They're typically 3x faster than GiST indexes for search operations but require more storage space. [Understanding GIN indexes](https://pganalyze.com/blog/gin-index).


Now that we understand what our new schema does, let's generate and run the migration to update your database:

```command
bun drizzle-kit generate && bun drizzle-kit migrate
```

And then let's update our CLI to use both search methods at the same time and compare the results:

```typescript
[label src/index.ts]
import { db } from './db/index';
import { articlesTable } from './db/schema';
[highlight]
import { ilike, or, sql } from 'drizzle-orm';
[/highlight]

async function searchArticlesLike(query: string) {
  // Remains the same
}

[highlight]
async function searchArticlesFTS(query: string) {
  const startTime = performance.now();

  const processedQuery = sql`to_tsquery('english', ${query.replace(/\s+/g, ' & ')})`;
  
  const results = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      body: articlesTable.body,
      createdAt: articlesTable.createdAt,
      // Calculate relevance rank
      rank: sql<number>`ts_rank(${articlesTable.searchVector}, ${processedQuery}) as rank`,
      // Generate highlighted snippet
      snippet: sql<string>`ts_headline('english', ${articlesTable.body}, ${processedQuery}, 'StartSel=\x1b[1m, StopSel=\x1b[0m, MaxWords=30, MinWords=10')`,
    })
    .from(articlesTable)
    .where(sql`${articlesTable.searchVector} @@ ${processedQuery}`)
    .orderBy(sql`rank DESC`)
    .limit(10);
  
  const endTime = performance.now();
  const searchTime = (endTime - startTime).toFixed(2);
  
  return { results, searchTime };
}
[/highlight]

function displayLikeResults(results: any[], searchTime: string, query: string) {
  // Remains the same
}

[highlight]
function displayFTSResults(results: any[], searchTime: string, query: string) {
  console.log(`\n🚀 Full-text search results for "${query}" (${searchTime}ms):`);
  console.log('─'.repeat(60));
  
  if (results.length === 0) {
    console.log('No articles found.');
    return;
  }
  
  results.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title} (Rank: ${article.rank.toFixed(3)})`);
    console.log(`   ${article.snippet}`);
    console.log(`   ID: ${article.id} | Created: ${article.createdAt.toDateString()}`);
  });
}
[/highlight]

async function main() {
  console.log('🚀 Article Search CLI - Compare LIKE vs Full-Text Search');
  
  while (true) {
    const query = prompt('\n📝 Enter search query (or "exit" to quit): ');
    
    if (!query || query.toLowerCase() === 'exit') {
      console.log('👋 Goodbye!');
      break;
    }
    
    try {
[highlight]
      // Execute both searches
      const likeResults = await searchArticlesLike(query);
      const ftsResults = await searchArticlesFTS(query);
      
      // Display results from both methods
      displayLikeResults(likeResults.results, likeResults.searchTime, query);
      displayFTSResults(ftsResults.results, ftsResults.searchTime, query);
[/highlight]
    } catch (error) {
      console.error('❌ Search error:', error);
    }
  }
  
  process.exit(0);
}

main();
```

In `searchArticlesFTS` we are using some new concepts around FTS in PostgreSQL, let's break those down:

**Query Processing:** The `query.replace(/\s+/g, ' & ')` transforms user input into PostgreSQL's `tsquery` format, converting spaces to `&` operators for `AND` searches. You can learn more at [Parsing queries](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES)

```typescript
const processedQuery = sql`to_tsquery('english', ${query.replace(/\s+/g, ' & ')})`;
```

**Match Filtering:** The `@@` operator, we use in the `where` clause, is PostgreSQL's text search match operator. It returns true when the `tsvector` contains all the terms specified in the `tsquery`.

```typescript
where(sql`${articlesTable.searchVector} @@ ${processedQuery}`)
```

**Relevance Ranking:** `ts_rank()` calculates how well each document matches the search query, returning a float value where higher numbers indicate better matches. The ranking considers term frequency, document length, and the weights we assigned during `tsvector` creation. You can learn more at [Ranking Search Queries](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING)

```typescript
sql<number>`ts_rank(${articlesTable.searchVector}, ${processedQuery}) as rank`
```

**Snippet Generation:** ts_headline() creates context-aware excerpts with highlighted search terms. This function finds the parts of the text most relevant to the search query and creates a snippet with highlighted matches using terminal bold codes. The `MaxWords` and `MinWords` parameters control snippet length. You can learn more at [Highlighting Results](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE)

```typescript
sql<string>`ts_headline('english', ${articlesTable.body}, ${processedQuery}, 'StartSel=\x1b[1m, StopSel=\x1b[0m, MaxWords=30, MinWords=10')`
```


## Comparing Search Methods

With the updated CLI we can now compare both of the approaches at the same time. We can start our search CLI:

```command
bun run src/index.ts
```

And then try the following comparisons:

* **Search for "optimize"**: 
  - ILIKE search: no results (doesn't match "optimization" in our database article)
  - Full-text search: finds the "Database Performance Optimization Techniques" article (understands stemming)

![Search for optimize](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/36054136-109d-4212-8474-daca4e020e00/orig =1916x932)

* **Search for "application monitor"**:
  - ILIKE search: requires the exact phrase to appear
  - Full-text search: finds relevant articles even if words are separated

![Search for application monitoring](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d9d4dd73-71ea-4afb-e8bc-e0de684f6e00/md1x =1916x820)

* **Search for "postgres"**:
  - ILIKE search: finds the result containing "PostgreSQL" in the title
  - Full-text search: no results, as the English dictionary doesn't recognize "postgres" as a stem of "PostgreSQL", treating them as completely different terms

![carbon (13).png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e6f6b0d7-29cb-488a-bae8-385b5fd2b900/md1x =1916x672)

The side-by-side comparison shows that while full-text search is generally superior, the English text search configuration has limitations with technical terms, brand names, and domain-specific vocabulary. When the dictionary doesn't recognize word relationships (like "postgres" and "PostgreSQL"), full-text search can miss relevant results that `ILIKE` would find. This highlights the importance of choosing the right search approach based on your content and user search patterns.

## Advanced `tsvector` Features

PostgreSQL's full-text search offers sophisticated features beyond basic matching:

**Phrase Searches**: Use `<->` operator for exact phrase matching:

```sql
-- Find "Better Stack" as an exact phrase
SELECT * FROM articles 
WHERE search_vector @@ phraseto_tsquery('english', 'Better Stack');
```

**Proximity Searches**: Find words within N positions of each other:

```sql
-- Find "application" within 3 words of "monitoring"
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'application <3> monitoring');
```

**Boolean Operations**: Complex search logic with AND, OR, NOT:

```sql
-- Find articles about logging but not performance
SELECT * FROM articles 
WHERE search_vector @@ to_tsquery('english', 'logging & !performance');
```

As an exercise you can extend the CLI to support these advanced features by modifying the query processing logic.

## Performance Considerations

The performance difference between `LIKE` and `tsvector` becomes dramatic with larger datasets:

* **Small datasets** (< 10k records): Both methods perform reasonably well
* **Medium datasets** (10k-100k records): `tsvector` shows 5-10x improvement
* **Large datasets** (> 100k records): `tsvector` can be 50x faster with proper indexing

The GIN index on `tsvector` enables these performance gains by creating an inverted index structure optimized for text search operations.

## Final Thoughts

PostgreSQL's built-in full-text search using `tsvector` provides a powerful alternative to external search engines for many applications. The combination of linguistic intelligence, relevance ranking, and excellent performance makes it an attractive choice for implementing search functionality.

Key advantages include simplified architecture (no additional services), ACID compliance with your main database, and sophisticated search features that rival dedicated search engines. For applications that don't require features like faceted search or complex aggregations, PostgreSQL's full-text search often provides everything needed with significantly less operational complexity.

The code examples in this guide provide a solid foundation for implementing full-text search in your own applications. For more advanced features and configuration options, consult the [PostgreSQL documentation](https://www.postgresql.org/docs/current/textsearch.html) on full-text search.

Thanks for reading, and happy searching!
