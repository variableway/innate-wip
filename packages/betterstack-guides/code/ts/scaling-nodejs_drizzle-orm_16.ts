# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label src/add-books.ts]
import { db } from './db/index.js';
import { books, type NewBook } from './db/schema/books.js';

async function addBooks() {
  try {
    // Prepare book data using the NewBook type
    const bookData: NewBook[] = [
      {
        title: "TypeScript Programming",
        author: "Boris Cherny",
        price: 32.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Node.js Design Patterns",
        author: "Mario Casciaro",
        price: 39.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Learning Drizzle ORM",
        author: "John Smith",
        price: 29.50,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert multiple books at once
    const result = await db.insert(books).values(bookData).run();
    
    console.log(`Added ${bookData.length} books to the database!`);
    
    // Add another book using a separate insert statement
    const anotherBook: NewBook = {
      title: "SQL Database Design",
      author: "Alice Johnson",
      price: 34.95,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const singleResult = await db.insert(books).values(anotherBook).run();
    console.log(`Added book: "${anotherBook.title}" successfully!`);
    
  } catch (error) {
    console.error('Error adding books:', error);
  }
}

// Run the function
addBooks();