# Getting Started with Kysely: A Type-Safe SQL Query Builder

[Kysely](https://github.com/kysely-org/kysely) is a type-safe SQL query builder for Node.js that brings strong TypeScript support and a clean, flexible API. 

Kysely includes everything you'd expect from a modern query builder: strong type safety, easy-to-read queries, transaction support, and built-in migration tools. 

In this guide, you’ll learn how to use Kysely with SQLite—from simple queries to more advanced operations—through clear, step-by-step examples.

[ad-logs]

### Prerequisites

To follow this article, you'll need:

- A recent version of [Node.js](https://nodejs.org/en/download/)
- Basic SQL and database knowledge
- Familiarity with TypeScript


## Step 1 — Setting up your project

Before using Kysely, let’s set up a fresh project environment. In this guide, we’ll build a simple bookstore management system using Kysely with SQLite. This setup gives you a lightweight yet powerful local database perfect for development and learning.

Start by creating a new project directory:

```command
mkdir kysely-bookstore
```

```command
cd kysely-bookstore
```

Initialize a new npm project:

```command
npm init -y
```

Install Kysely and SQLite dependencies:

```command
npm install kysely better-sqlite3
```

Install TypeScript development dependencies:

```command
npm install typescript tsx @types/better-sqlite3 --save-dev
```

Create a TypeScript configuration file and add the following configuration to `tsconfig.json`:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

This configuration enables modern JavaScript features and strict type checking for improved code quality.


## Step 2 — Connecting to the database and creating a table

Before you start writing any queries, it’s essential to understand what makes Kysely stand out. Kysely is a query builder—it gives you full control over your SQL while ensuring TypeScript catches mistakes early, before your code even runs.

First, let’s make a directory to keep all your code organized.

```command
mkdir src
```

Now, create a `src/database.ts` database connection file and add the following code to set up our bookstore database schema:

```typescript
[label src/database.ts]
import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Generated } from "kysely";

// Define our bookstore database schema
interface DB {
  books: {
    id: Generated<number>;
    title: string;
    author: string;
    price: number;
    in_stock: number;
  }
}

// Initialize the database connection
const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Database('bookstore.db')
  })
});

export default db;
```

This code does three important things:

1. Defines a TypeScript interface for our database schema, which enables compile-time checking
2. Creates a SQLite database file named `bookstore.db` (it will be created if it doesn't exist)
3. Initializes Kysely with the SQLite dialect

When you import this `db` object in other files, TypeScript will know precisely what tables and columns exist in your database, preventing many common errors.

Now let's create a file to set up our books table:

```command
touch src/init.ts
```

Add the following code to create our table:

```typescript
[label src/init.ts]
import db from './database';

async function main() {
  // Create books table
  await db.schema
    .createTable('books')
    .ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('author', 'text', col => col.notNull())
    .addColumn('price', 'real', col => col.notNull())
    .addColumn('in_stock', 'boolean', col => col.notNull().defaultTo(true))
    .execute();
  
  console.log('Books table created successfully');
}

main()
  .catch(error => console.error(error))
  .finally(async () => await db.destroy());
```
The `db.schema.createTable()` method provides a fluent interface for defining your table structure. The `ifNotExists()` method ensures the script won't fail if you run it multiple times. Each `addColumn()` call defines a column with its data type and constraints.


Run this script to create your table:

```command
npx tsx src/init.ts
```

```text
[output]
Books table created successfully
```

Behind the scenes, Kysely generates and executes the following SQL:

```sql
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE
)
```


A new SQLite database file named `bookstore.db` will be created in your project directory.

## Step 3 — Creating Records

Now that your `books` table is ready, let’s add some sample data. In this step, you’ll insert multiple book records into the database using Kysely's clear and type-safe API.

Create a new `src/add-books.ts` file to handle the insertion with the following code to bulk insert books:

```typescript
[label src/add-books.ts]
import db from './database';

async function addBooks() {
  await db
    .insertInto('books')
    .values([
      {
        title: 'SQL Database Design',
        author: 'Michael Johnson',
        price: 34.99,
        in_stock: 1
      },
      {
        title: 'Node.js Masterclass',
        author: 'David Wilson',
        price: 24.99,
        in_stock: 1
      }
    ])
    .execute();

  console.log('Books added successfully');
  await db.destroy();
}

addBooks();
```

In this script, you’re inserting two book records in one go using Kysely’s `insertInto().values().execute()` chain. Once the data is inserted, the database connection is closed with `db.destroy()`.

To run the script:

```command
npx tsx src/add-books.ts
```

You should see output like this:

```text
[output]
Books added successfully
```

## Step 4 — Querying Records

After adding data to your database, the next step is to retrieve it. In this section, you'll use Kysely's powerful query features to select and filter data from your SQLite database.

Create a new `src/query-books.ts` file for your query operations with the following code:

```typescript
[label src/query-books.ts]
import db from './database';

async function queryBooks() {
  // Get all books
  console.log("\n=== All Books ===");
  const allBooks = await db
    .selectFrom('books')
    .selectAll()
    .execute();
  
  console.log(allBooks);
  
  await db.destroy();
}

queryBooks();
```
In this example, you retrieve all records using `selectAll()`, which works like `SELECT * FROM books`.

Run the script to see the results:

```command
npx tsx src/query-books.ts
```

The output will show all book records currently stored in your database, like this:

```text
[output]

=== All Books ===
[
  {
    id: 1,
    title: 'SQL Database Design',
    author: 'Michael Johnson',
    price: 34.99,
    in_stock: 1
  },
  {
    id: 2,
    title: 'Node.js Masterclass',
    author: 'David Wilson',
    price: 24.99,
    in_stock: 1
  }
]
```

You can also filter the results. For example, if you want to find books by a specific author, use the `where()` method like so:

```typescript
// Find books by a specific author
console.log("\n=== Books by David Wilson ===");
const authorBooks = await db
  .selectFrom('books')
  .selectAll()
  .where('author', '=', 'David Wilson')
  .execute();

console.log(authorBooks);
```

And if you want to list books that cost less than $30, sorted by price in ascending order:

```typescript
// Find books in a price range
console.log("\n=== Affordable Books (Under $30) ===");
const affordableBooks = await db
  .selectFrom('books')
  .selectAll()
  .where('price', '<', 30)
  .orderBy('price', 'asc')
  .execute();

console.log(affordableBooks);
```
Kysely's query builder makes database operations intuitive while providing complete type safety. 

If you try to reference a non-existent column in your query, TypeScript will catch the error during development, preventing runtime issues.



## Step 5 — Updating records

After inserting and querying data, the next step is updating it. In this section, you’ll learn how to modify existing book records using Kysely’s fluent, SQL-like update syntax with full TypeScript support.

Start by creating a new  `src/update-books.ts` file to handle updates:

```typescript
[label src/update-books.ts]
import db from './database';

async function updateBooks() {
  // Update the price of a specific book
  console.log("=== Updating Book Price ===");

  const updateResult = await db
    .updateTable('books')
    .set({ price: 39.99 })
    .where('title', '=', 'SQL Database Design')
    .executeTakeFirstOrThrow();

  console.log(`Updated ${updateResult.numUpdatedRows} book`);

  // View updated records
  console.log("\n=== Books After Updates ===");

  const books = await db
    .selectFrom('books')
    .selectAll()
    .orderBy('price', 'desc')
    .execute();

  console.log(books);

  await db.destroy();
}

updateBooks();
```

In this script, you're performing a simple update—changing the price of a specific book using a fixed value. The `.set()` method updates the field, while `.where()` ensures only the matching row is affected.

To run the script:

```command
npx tsx src/update-books.ts
```

You should see output like this:

```text
[output]
=== Updating Book Price ===
Updated 1 book

=== Books After Updates ===
[
  {
    id: 1,
    title: 'SQL Database Design',
    author: 'Michael Johnson',
    price: 39.99,
    in_stock: 1
  },
  {
    id: 2,
    title: 'Node.js Masterclass',
    author: 'David Wilson',
    price: 24.99,
    in_stock: 1
  }
]
```

As you can see, the price for **SQL Database Design** has been updated to `$39.99`.

If you want to update multiple records based on a condition—for example, applying a discount to all books over $30—you can use an expression-based update like this:

```typescript
// Apply a 10% discount to books over $30
console.log("\n=== Applying Discount to Expensive Books ===");

const discountResult = await db
  .updateTable('books')
  .set({
    price: db.fn.val(db.ref('price').multiply(0.9)) // apply 10% discount
  })
  .where('price', '>', 30)
  .execute();

console.log(`Applied discount to ${discountResult.numUpdatedRows} books`);
```

In this example, you're applying a 10% discount to all books priced over $30. Kysely allows you to perform calculations directly in the database using expression helpers like `db.ref()` to reference a column and `db.fn.val()` to wrap the result. 

This approach is both efficient and concise—there’s no need to fetch records into JavaScript, update them manually, and write them back. Everything happens within a single SQL query.

## Step 6 — Deleting Records

To wrap up the CRUD operations, let’s look at how to delete records from your database. In this step, you’ll use Kysely’s `deleteFrom()` method to remove books based on specific conditions.

Start by creating a new `src/delete-books.ts` file:

```typescript
[label src/delete-books.ts]
import db from './database';

async function deleteBooks() {
  // Delete books by a specific author
  console.log("=== Deleting Books by David Wilson ===");

  const deleteResult = await db
    .deleteFrom('books')
    .where('author', '=', 'David Wilson')
    .execute();

  // Check how many books remain to infer how many were deleted
  console.log("\n=== Remaining Books ===");

  const remainingBooks = await db
    .selectFrom('books')
    .selectAll()
    .orderBy('id', 'asc')
    .execute();

  console.log(remainingBooks);

  await db.destroy();
}

deleteBooks();
```

In this script, you use `deleteFrom()` with a `where()` clause to remove books written by David Wilson. The result tells you how many rows were deleted. After the deletion, the script fetches and prints the remaining books to confirm the update.

To run the script:

```command
npx tsx src/delete-books.ts
```

Output:

```text
[output]
=== Deleting Books by David Wilson ===

=== Remaining Books ===
[
  {
    id: 1,
    title: 'SQL Database Design',
    author: 'Michael Johnson',
    price: 39.99,
    in_stock: 1
  }
]
```

As you can see, the book by David Wilson has been successfully removed. 

## Final thoughts

In this guide, you learned how to use Kysely with SQLite and TypeScript to build a simple app with full CRUD functionality. Kysely gives you control over SQL and the safety of TypeScript.

Want to go further? Kysely also supports joins, subqueries, transactions, and more. To explore advanced features, check out the [official docs](https://kysely.dev/docs/intro).