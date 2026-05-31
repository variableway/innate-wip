# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 11

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