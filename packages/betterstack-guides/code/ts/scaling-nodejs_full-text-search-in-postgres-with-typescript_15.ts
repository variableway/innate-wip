# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 15

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