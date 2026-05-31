# Getting Started with Drizzle ORM

[Drizzle ORM](https://orm.drizzle.team/) is a modern TypeScript-first tool that makes working with databases easier and less error-prone. 

It sits comfortably between raw SQL and TypeScript’s type system. You write your schema your way, and it handles the rest—generating types automatically so your code stays safe, clean, and consistent from top to bottom.

In this guide, you’ll use Drizzle ORM with SQLite to build a quick, type-safe app with full Create, Read, Update, and Delete (CRUD) functionality.

[ad-logs]

## Prerequisites

Before starting this tutorial, ensure you have:

- Node.js 22.x or newer installed
- Basic knowledge of TypeScript and Node.js
- Familiarity with SQL (helpful but not required)


## Step 1 — Setting up your Drizzle ORM project

In this section, you’ll set up the basic project structure, configure TypeScript, and prepare your environment to use Drizzle ORM with SQLite.


First, create a new project directory and jump into it:


```command
mkdir drizzle-tutorial && cd drizzle-tutorial
```

Initialize the Node.js project with npm to create a `package.json` file:

```command
npm init -y
```

Now, configure your project to use ES Modules. To do this, add the `"type"` field to your `package.json` file:

```command
npm pkg set type=module
```

This command adds `"type": "module"` to your `package.json`, which tells Node.js to treat `.js` files as ES Modules instead of CommonJS.


Next, install TypeScript and create a basic configuration:

```command
npm install typescript tsx @types/node --save-dev
```
```command
npx tsc --init
```

This will create a `tsconfig.json` file with the default TypeScript settings. Clear out the contents and replace them with the following configuration to enable modern ES Module support:


```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "outDir": "./dist",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Next, add a few helpful scripts to your `package.json` to simplify development:


```command
npm pkg set scripts.build="tsc"
```

```command
npm pkg set scripts.dev="tsc --watch"
```

```command
npm pkg set scripts.start="node dist/index.js"
```
These scripts make your development workflow smoother by handling common tasks with simple commands. 

The `build` script compiles your TypeScript code into JavaScript using the TypeScript compiler.

When you're actively working on your project, the `dev` script runs the compiler in watch mode, automatically rebuilding your code whenever changes are saved. 

Once your code is compiled, the `start` script runs the output with Node.js, assuming your entry point is at `dist/index.js`.

Now install the Drizzle ecosystem packages for working with SQLite:

```command
npm install drizzle-orm better-sqlite3
```
```command
npm install -D drizzle-kit @types/better-sqlite3
```


These packages cover different parts of the Drizzle ecosystem:

- [`drizzle-orm`](https://www.npmjs.com/package/drizzle-orm): The core library that includes the query builder, schema definitions, and type-safe interactions.
- [`better-sqlite3`](https://www.npmjs.com/package/better-sqlite3): A fast, synchronous SQLite driver. Drizzle supports multiple drivers, but this one works great for local development and smaller apps.
- [`drizzle-kit`](https://www.npmjs.com/package/drizzle-kit): A CLI tool for managing migrations and other development tasks. It’s installed as a dev dependency to keep your production build lightweight.
- [`@types/better-sqlite3`](https://www.npmjs.com/package/@types/better-sqlite3): Type definitions for `better-sqlite3`, ensuring TypeScript can understand and type-check your SQLite code properly.


Next, create the base project structure by running:

```command
mkdir -p src/db/schema
```

This creates a dedicated directory for your database logic, keeping things clean and modular. The `schema` folder is where you'll define your tables, while the `db` folder can hold your Drizzle configuration and connection setup.

With the directory structure in place and all necessary packages installed, you can set up your first Drizzle connection and begin defining your database schema.


## Step 2 — Understanding Drizzle components and creating your first schema

Before diving into code, it's helpful to understand the Drizzle's architecture. Instead of a monolithic design, Drizzle follows a decentralized, composition-first approach—each part has a clear, single responsibility and can be used independently.

Here's a quick overview of Drizzle's core components:

- **Schema definition**: A declarative, TypeScript-based API for defining your database structure.
- **SQL driver adapters**: Lightweight wrappers around database drivers (like SQLite or Postgres) that standardize how Drizzle communicates with them.
- **Query builder**: A set of composable functions that generate SQL while preserving full-type safety.
- **Type inference**: A powerful system that extracts TypeScript types directly from your schema, ensuring consistency throughout your app.
- **Migration tools**: Provided by `drizzle-kit`, these tools help you generate and run database migrations as your schema evolves.
 

To get started, create a file named `src/db/index.ts` and add the following code to set up a basic SQLite connection using Drizzle:


```typescript
[label src/db/index.ts]
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ESM vs CommonJS directory path differences
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a SQLite database connection
const sqlite = new Database(path.join(__dirname, '../../drizzle.db'));

// Create a Drizzle instance with the SQLite connection
export const db = drizzle(sqlite);

// Test the connection
export function testConnection() {
  try {
    const result = sqlite.prepare('SELECT 1 + 1 AS result').get();
    console.log('Connection has been established successfully.');
    console.log('Test query result:', result);
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}
```

This code initializes a connection to an SQLite database and creates a Drizzle instance that will be used for all database operations. The `testConnection` function provides a simple way to verify the database is working.

For this tutorial, you'll build a simple bookstore management system. Start by defining the schema for the `books` table.

Create a new file at `src/db/schema/books.ts`:

```typescript
[label src/db/schema/books.ts]
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Define the books table schema
export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author').notNull(),
  price: real('price'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(new Date())
});

// Create a type for book records based on the schema
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
```

This schema definition showcases Drizzle’s clean and declarative approach to defining database tables. Instead of using classes or decorators, Drizzle uses plain function calls like `sqliteTable()` to define tables.

 Each column is defined using type-specific functions that map directly to SQLite’s native types, and constraints are applied using a fluent, chainable syntax.

Key aspects of this approach include:

- clear column definitions using functions like `integer()`, `text()`, and `real()` that align with SQLite’s data types  
- fluent constraint chaining with methods such as `.notNull()` and `.primaryKey()`  
- compile-time validation of default values to catch errors early  
- timestamp handling through the `mode: 'timestamp'` option, which helps work around SQLite’s limited date support

Together, these features create a type-safe, readable schema that integrates smoothly with the rest of your TypeScript codebase.

The real power comes from the `$inferSelect` and `$inferInsert` utilities. These extract fully typed definitions from your schema—`Book` for querying existing rows (including auto-generated fields) and `NewBook` for inserting new records (where fields like `id` or `createdAt` may be optional).

This dual-type setup enforces correct usage and helps avoid common mistakes like trying to insert an auto-incremented ID manually.

Now, create a file to export all schemas named `src/db/schema/index.ts`:

```typescript
[label src/db/schema/index.ts]
export * from "./books";
```

Finally, create a migration config file to set up your database tables. In the root of your project, add a file called `drizzle.config.ts` with the following content:


```typescript
[label drizzle.config.ts]
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  dialect: "sqlite",
  dbCredentials: {
    url: "./drizzle.db"
  }
});
```

This configuration tells Drizzle Kit where to find your schema files, which SQL dialect to use, and where your SQLite database is located.

Drizzle offers multiple ways to manage schema changes through its migration system. You can generate migration files, run them manually, or use the direct push method to apply changes instantly.

In this tutorial, you'll use the direct push approach—the quickest way to sync your schema with the database without creating migration files.

Add the following script to your `package.json`:

```command
npm pkg set scripts.db:push="drizzle-kit push"
```

The `db:push` script directly applies your schema to the database, creating or updating tables as needed. This approach is perfect for development environments or simple applications.

Now, run the push command to create your database tables:

```command
npm run db:push
```

You should see the output confirming that Drizzle has applied your schema to the database:

```text
[output]
> drizzle-tutorial@1.0.0 db:push
> drizzle-kit push

No config path provided, using default 'drizzle.config.ts'
Reading config file '/path/to-your/drizzle-tutorial/drizzle.config.ts'
[✓] Pulling schema from database...
[✓] Changes applied
```

The output shows that Drizzle successfully read your configuration, connected to the database, and applied your schema changes.

At this stage, your SQLite database has an empty `books` table ready to store book records with the defined schema.


## Step 3 — Adding data to your database

Now that you have a properly defined schema and your database table is set up, it's time to populate it with some initial data. Drizzle provides a SQL-like builder pattern that constructs insert statements with full-type checking.

Create a file named `src/add-books.ts` to see how data insertion works with Drizzle:

```typescript
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
```
This script shows how to insert data into your SQLite database using Drizzle. It imports the database connection, the `books` table, and the `NewBook` type. An array of book objects is created and inserted using `db.insert(books).values(bookData).run()`.

Then, a single book is added with another insert call. The `values()` method accepts one or more objects that follow the `NewBook` type, ensuring type safety at compile time. The API is simple, clear, and closely follows SQL syntax.


Now you can run the TypeScript file directly without compiling it first. For convenience, you can add a `dev` script to your `package.json`:

```command
npm pkg set scripts.dev:run="tsx"
```

Then you can run the TypeScript file like this:

```command
npm run dev:run src/add-books.ts
```

You should see output similar to:

```text
[output]
Added 3 books to the database!
Added book: "SQL Database Design" successfully!
```

There are several ways to insert data with Drizzle. Here are some alternative approaches:

```typescript
// Insert a single book
const result = await db.insert(books).values({
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  price: 29.99,
  createdAt: new Date(),
  updatedAt: new Date()
}).run();
```

You can also use the `returning()` method to get back the inserted data, which is useful for retrieving auto-generated IDs:

```typescript
// Insert with returning
const inserted = await db.insert(books)
  .values({
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    price: 34.95,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  .returning()
  .get();

console.log(`Added: ${inserted.title} with ID: ${inserted.id}`);
```

For larger insert operations, you might prefer to insert records in batches:

```typescript
// Insert books in batches of 50
const largeDataset: NewBook[] = [/* hundreds of book objects */];
const batchSize = 50;

for (let i = 0; i < largeDataset.length; i += batchSize) {
  const batch = largeDataset.slice(i, i + batchSize);
  await db.insert(books).values(batch).run();
  console.log(`Inserted batch ${i / batchSize + 1}`);
}
```

The type safety provided by Drizzle is one of its greatest strengths. If you try to insert a record with missing required fields or incorrect types, TypeScript will catch these errors at compile time:

```typescript
// This would cause a TypeScript error because 'title' is required
const invalidBook: NewBook = {
  // title is missing!
  author: "Unknown Author",
  price: 19.99,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

Similarly, if you try to provide an ID for a table with auto-incrementing primary keys, TypeScript would warn you about this potential mistake.

This type-safety extends to all Drizzle operations, not just inserts, ensuring that your database interactions are consistent and error-free throughout your application.

Now that your database has some books added, you can move on to querying and retrieving them.



## Step 4 — Querying data from your database

Now that your database has data, it's time to retrieve it. Drizzle's query builder provides a type-safe way to construct SQL queries without writing raw SQL strings.

Create a file named `src/query-books.ts` with this simple query to get all books:

```typescript
[label src/query-books.ts]
import { db } from './db/index';
import { books, type Book } from './db/schema/books';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await db.select().from(books).all();
    
    allBooks.forEach((book: Book) => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });
    
  } catch (error) {
    console.error('Error querying books:', error);
  }
}

queryBooks();
```

This script shows the basic pattern for querying data with Drizzle. It uses `db.select()` to start the query, specifies the table with `.from(books)`, and then retrieves all records using `.all()`. 

Run this file to display a list of books stored in your database:


```command
npm run dev:run src/query-books.ts
```

You should see output similar to:

```text
[output]
==== All Books ====
TypeScript Programming by Boris Cherny, $32.99
Node.js Design Patterns by Mario Casciaro, $39.99
Learning Drizzle ORM by John Smith, $29.5
SQL Database Design by Alice Johnson, $34.95
```

Now that you've successfully retrieved all books, you can explore other common query patterns.

For example, the following query gets every row from the table:


```typescript
const allBooks = await db.select().from(books).all();
```

This generates a basic `SELECT * FROM books` query. The `.all()` method returns an array of records.

Use the `where()` method with a condition to filter results. This example fetches books by a specific author:

```typescript
const authorBooks = await db.select()
  .from(books)
  .where(eq(books.author, "Boris Cherny"))
  .all();
```

The `where()` method accepts filter operators like `eq()` (equals), `lt()` (less than), and `gt()` (greater than) to create SQL conditions.

You can also sort the results by using `orderBy()` with direction helpers like `desc()` or `asc()`:

```typescript
const orderedBooks = await db.select()
  .from(books)
  .orderBy(desc(books.price))
  .all();
```

The `orderBy()` method accepts direction operators like `desc()` (descending) and `asc()` (ascending) to sort the results.

To get a single result instead of an array, use `get()`. This returns the first match or `undefined` if none is found:

```typescript
const bookById = await db.select()
  .from(books)
  .where(eq(books.id, 1))
  .get();
```

Drizzle makes querying your database simple and type-safe. The query builder's syntax is intuitive and follows the structure of SQL, making it easy to understand while still providing the benefits of TypeScript's type checking.

In the next section, you'll learn how to update existing records in your database.



## Step 5 — Updating records in your database

Now that you know how to add and query data, it's time update existing records. Drizzle provides a straightforward API for updates that follows the same pattern-based approach you've seen in previous operations.

Create a file named `src/update-books.ts` with the following code:

```typescript
[label src/update-books.ts]
import { db } from './db/index';
import { books } from './db/schema/books';
import { eq } from 'drizzle-orm';

async function updateBooks() {
  try {
    // Find a book to update
    const book = await db
      .select()
      .from(books)
      .where(eq(books.title, 'TypeScript Programming'))
      .get();

    // Update the book's price
    const result = await db
      .update(books)
      .set({
        price: 36.99,
        updatedAt: new Date(),
      })
      .where(eq(books.id, book.id))
      .run();

    // Verify the update
    const updatedBook = await db
      .select()
      .from(books)
      .where(eq(books.id, book.id))
      .get();

    if (updatedBook) {
      console.log(`After: ${updatedBook.title} - $${updatedBook.price}`);
      console.log(`Updated ${result.changes} book(s)`);
    } else {
      console.log('Update ran, but no book was found afterward.');
    }
  } catch (error) {
    console.error('Error updating books:', error);
  }
}

updateBooks();
```

This script demonstrates a simple update operation. It first finds a book, updates its price, and then verifies the change by fetching the book again.

Run this file to see the update in action:

```command
npm run dev:run src/update-books.ts
```

You should see output similar to:

```text
[output]
After: TypeScript Programming - $36.99
Updated 1 book(s)
```

The update process in Drizzle follows a clear pattern:

```typescript
const result = await db.update(table)
  .set({ column1: newValue1, column2: newValue2 })
  .where(condition)
  .run();
```

You can also perform batch updates that modify multiple records at once:

```typescript
// Update all books priced under $30
const batchResult = await db.update(books)
  .set({ price: 29.99, updatedAt: new Date() })
  .where(lt(books.price, 30))
  .run();

console.log(`Updated ${batchResult.changes} books`);
```

For calculated updates that depend on current values, use the `sql` template literal:

```typescript
import { sql } from 'drizzle-orm';

// Increase all prices by 10%
const priceUpdateResult = await db.update(books)
  .set({
    price: sql`${books.price} * 1.1`,
    updatedAt: new Date()
  })
  .run();
```

With record updates in place, you can now move on to deleting records from your database.

## Step 6 — Deleting records from your database

Now that you've implemented Create, Read, and Update operations, it's time to complete the CRUD functionality by delete records. 

Create a file named `src/delete-books.ts` with the following code:

```typescript
[label src/delete-books.ts]
import { db } from './db/index.js';
import { books } from './db/schema/books.js';
import { eq, sql } from 'drizzle-orm';

async function deleteBooks() {
  try {
    // First, count total books before deletion
    const beforeCount = await db.select({ count: sql`count(*)` })
      .from(books)
      .get();
    
    console.log(`Books before deletion: ${beforeCount?.count ?? 0}`);

    // Delete a specific book by title
    const result = await db.delete(books)
      .where(eq(books.title, "SQL Database Design"))
      .run();
    
    console.log(`Deleted ${result.changes} book(s)`);
    
    // Count books after deletion to verify
    const afterCount = await db.select({ count: sql`count(*)` })
      .from(books)
      .get();
    
    console.log(`Books after deletion: ${afterCount?.count ?? 0}`);
  } catch (error) {
    console.error('Error deleting books:', error);
  }
}

deleteBooks();
```

This script demonstrates how to delete a record from your database. It counts the books before deletion, removes a specific book by title, and then counts the books again to verify the deletion.

Run this file to see the deletion in action:

```command
npm run dev:run src/delete-books.ts
```

You should see output similar to:

```text
[output]
Books before deletion: 4
Deleted 1 book(s)
Books after deletion: 3
```

The delete operation follows the same pattern as other Drizzle operations:

```typescript
const result = await db.delete(table)
  .where(condition)
  .run();
```

Like with updates, the `run()` method returns metadata about the operation, including the number of rows affected.

You can also delete records by ID, which is a common operation in applications:

```typescript
// Delete a book by ID
const deleteById = await db.delete(books)
  .where(eq(books.id, 1))
  .run();
```

For batch deletions, you can use more complex conditions:

```typescript

// Delete all inexpensive books
const batchDelete = await db.delete(books)
  .where(lt(books.price, 30))
  .run();

console.log(`Deleted ${batchDelete.changes} inexpensive books`);
```

It's important to be careful with delete operations, especially when not using a specific condition. If you run a delete without a where clause, it will delete all records from the table:

```typescript
// CAUTION: This will delete ALL books
const deleteAll = await db.delete(books).run();
```

To prevent accidental deletion of all records, it's a good practice always to include a where clause with your delete operations or to add safeguards in your application.

## Final thoughts
You’ve now built a full CRUD app using Drizzle ORM with SQLite. Along the way, you learned how to set up a project with TypeScript, define type-safe schemas, push schema changes, and perform create, read, update, and delete operations.

As you go further, Drizzle supports more advanced features like table relationships, transactions, indexes, constraints, and migration strategies for production.

The same patterns you used here apply as your app grows. For more, check out the [official Drizzle ORM docs](https://orm.drizzle.team/docs).