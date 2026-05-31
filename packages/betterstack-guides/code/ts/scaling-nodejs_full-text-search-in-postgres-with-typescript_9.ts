# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 9

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