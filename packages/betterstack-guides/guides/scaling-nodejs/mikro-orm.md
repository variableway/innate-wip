# Getting Started with MikroORM

[MikroORM](https://mikro-orm.io/) is a modern TypeScript ORM for Node.js that uses the DataMapper pattern to separate your business logic from database operations. It supports databases like PostgreSQL, MySQL, SQLite, and even MongoDB, and gives you a clean, type-safe way to work with your data.

With MikroORM, you define your data using regular TypeScript classes, and it handles the rest—saving, querying, and updating records behind the scenes.

In this guide, you’ll use MikroORM with SQLite to build a simple TypeScript-powered app, using strong typing and a flexible API to manage your database efficiently.

[ad-logs]

## Prerequisites

You’ll need Node.js 22.x or later and some basic knowledge of TypeScript and Node.js to follow this tutorial. SQL experience helps, but isn’t required. Since we’re using SQLite, no separate database setup is needed—everything works out of the box.


## Step 1 — Setting up your project directory

In this section, you'll create a Node.js project with TypeScript support, giving you a solid foundation for building database-driven apps with MikroORM.

Start by creating a new project directory and navigating into it:

```command
mkdir mikro-orm-tutorial && cd mikro-orm-tutorial
```

Initialize the Node.js project with npm to create a package.json file:

```command
npm init -y
```

Next, install TypeScript and set up the development environment:

```command
npm install typescript tsx @types/node --save-dev
```

Generate a basic TypeScript configuration file:

```command
npx tsc --init
```

Replace the contents of your `tsconfig.json` file with the following to enable decorator support and configure your project for MikroORM:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "outDir": "./dist",
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

This configuration enables support for decorators (required by MikroORM), sets modern module resolution with NodeNext, and ensures TypeScript outputs compiled files into the dist directory.

Now, install MikroORM and the SQLite driver, along with the reflection provider which is needed for the latest version:

```command
npm install @mikro-orm/core @mikro-orm/sqlite @mikro-orm/cli @mikro-orm/migrations @mikro-orm/reflection
```

Here's what each package does:

- [@mikro-orm/core](https://www.npmjs.com/package/@mikro-orm/core): The core library for defining entities and managing database operations  
- [@mikro-orm/sqlite](https://www.npmjs.com/package/@mikro-orm/sqlite): SQLite driver that lets MikroORM connect to and work with SQLite databases  
- [@mikro-orm/cli](https://www.npmjs.com/package/@mikro-orm/cli): Command-line interface for tasks like generating entities and running migrations  
- [@mikro-orm/migrations](https://www.npmjs.com/package/@mikro-orm/migrations): Adds support for versioning and managing your database schema
- [@mikro-orm/reflection](https://www.npmjs.com/package/@mikro-orm/reflection): Provides metadata extraction for TypeScript entities

SQLite is a great starting point because it stores everything in a single file—no need to install or manage a separate database server. 

With everything installed, you can set up your first MikroORM connection.

## Step 2 — Understanding MikroORM components and creating your first entity

Before writing any code, it's helpful to understand how MikroORM works and how its main parts fit together. These building blocks are key to modeling and working with your data effectively.

The MikroORM ecosystem includes:

- **EntityManager**: Handles database operations and manages entities  
- **Entity**: A TypeScript class that represents a database table  
- **Repository**: Offers methods to find, create, and update entities  
- **UnitOfWork**: Tracks changes to entities and saves them efficiently  
- **Identity Map**: Ensures only one instance of each entity exists in memory  
- **Collections**: Manages relationships between entities

Now, let's create a file named `mikro-orm.config.ts` in your project folder to set up MikroORM:

```typescript
[label mikro-orm.config.ts]
import { defineConfig } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from '@mikro-orm/sqlite';
import path from 'path';

const config = defineConfig({
  entities: ['./dist/entities'], // path to compiled entity classes
  entitiesTs: ['./src/entities'], // path to TypeScript entity sources
  dbName: path.join(process.cwd(), 'database.sqlite'),
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider, // Using ts-morph reflection provider
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  debug: true, // set to false in production
});

export default config;
```

This config sets up MikroORM to use SQLite and tells it where to find your entity and migration files. The debug option logs SQL queries, which is useful while developing. Note that we're using the `TsMorphMetadataProvider` from `@mikro-orm/reflection` which is recommended for MikroORM 6.x.

Create the directory structure for your project:

```command
mkdir -p src/entities
```

In this tutorial, you'll build a basic bookstore app. Start by creating your first entity in `src/entities/Book.ts`:

```typescript
[label src/entities/Book.ts]
import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';

@Entity({ tableName: 'books' })
export class Book {
  @PrimaryKey({ type: types.integer, autoincrement: true })
  id!: number;

  @Property({ type: types.string, length: 200 })
  title!: string;

  @Property({ type: types.string, length: 100 })
  author!: string;

  @Property({ type: types.decimal, columnType: 'decimal(10,2)', nullable: true })
  price?: number;

  @Property({ type: types.datetime })
  createdAt: Date = new Date();

  @Property({ type: types.datetime, onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Method to get book details
  getDetails(): string {
    return `${this.title} by ${this.author} - $${this.price}`;
  }
}
```

This code defines a Book entity that maps to your database's books table. The class uses decorators to define its properties:

- `@Entity`: Marks the class as a database entity with a specified table name
- `@PrimaryKey`: Defines the primary key field that auto-increments
- `@Property`: Specifies regular properties with optional configuration

The key addition here is the explicit type parameter for each property. In MikroORM 6.x, explicitly defining the types using the types helper from the core package is recommended. This ensures proper type inference and reduces issues with decorators.

Next, create a script to set up your database tables in `src/create-tables.ts`:

```typescript
[label src/create-tables.ts]
import { MikroORM } from '@mikro-orm/core';
import { Book } from './entities/Book';
import config from '../mikro-orm.config';

// Make sure reflect-metadata is imported at the entry point
import 'reflect-metadata';

async function createTables() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);
    
    // Get the schema generator
    const generator = orm.getSchemaGenerator();
    
    // Drop existing tables if they exist and create them fresh
    await generator.dropSchema();
    await generator.createSchema();
    
    console.log('Database tables created successfully!');
    
    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();
```
We've added the import for `'reflect-metadata'` at the entry point to ensure proper processing of decorator metadata—this is essential for MikroORM to work correctly with TypeScript decorators like `@Entity` and `@Property`.

You then initialize MikroORM with your config, get the schema generator, and use it to drop and recreate the database schema based on your entity definitions. This is a clean way to reset your database during development.

To run the script and create your tables:

```command
npx tsx src/create-tables.ts
```

You should see output confirming the SQL operations that create your database schema:


```text
[output]
[info] MikroORM version: 6.4.11
[discovery] ORM entity discovery started ...
[discovery] - entity discovery finished, found 1 entities ...
[query] select name as table_name from sqlite_master ...
[info] MikroORM successfully connected to database ...
[query] drop table if exists `books`; ...
[query] create table `books` (`id` integer not null primary key autoincrement, `title` text not null, `author` text not null, `price` decimal(10,2) null, `created_at` datetime not null, `updated_at` datetime not null); ...
Database tables created successfully!
```

MikroORM first drops any existing tables (if they exist) and then creates fresh ones based on your entity definitions.

Currently, your SQLite database has an empty books table ready to store book records.


## Step 3 — Adding data to your database

In this section, you'll insert records into your SQLite database using MikroORM's `EntityManager`. You'll create `Book` objects, persist them, and see how MikroORM turns your TypeScript entities into real database entries.

Create a file named `src/add-books.ts`:

```typescript
[label src/add-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function addBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Create book entities
    const book1 = em.create(Book, {
      title: 'TypeScript: The Good Parts',
      author: 'Douglas Crockford',
      price: 29.99
    });

    const book2 = em.create(Book, {
      title: 'Eloquent TypeScript',
      author: 'Marijn Haverbeke',
      price: 34.95
    });

    const book3 = em.create(Book, {
      title: 'You Don\'t Know TypeScript',
      author: 'Kyle Simpson',
      price: 24.99
    });

    // Persist entities to the database
    await em.persistAndFlush([book1, book2, book3]);

    // Print the newly created books with their IDs
    console.log(`Added: ${book1.getDetails()} with ID: ${book1.id}`);
    console.log(`Added: ${book2.getDetails()} with ID: ${book2.id}`);
    console.log(`Added: ${book3.getDetails()} with ID: ${book3.id}`);

    // Create a book using a different approach
    const book4 = new Book();
    book4.title = 'Node.js and TypeScript Design Patterns';
    book4.author = 'Mario Casciaro';
    book4.price = 39.99;

    // Add to EntityManager and persist
    em.persist(book4);
    await em.flush();

    console.log(`Added: ${book4.getDetails()} with ID: ${book4.id}`);

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error adding books:', error);
  }
}

addBooks();
```

First, you create several `Book` entities using the `em.create()` method. This lets you both instantiate and register the entities with MikroORM’s EntityManager in one step. Then, save them to the database with `em.persistAndFlush()`.

Next, you take a different approach by manually creating a `Book` instance, setting its properties, and using `em.persist()` followed by `em.flush()` to save it. This method gives you more control before committing the entity to the database.

To add the books, run:

```command
npx tsx src/add-books.ts
```
You'll see output showing that MikroORM has created each book and assigned it a unique ID:

```text
[output]
[info] MikroORM version: 6.4.11
[discovery] ORM entity discovery started ...
[discovery] - entity discovery finished, found 1 entities ...
[info] MikroORM successfully connected to database ...
[query] insert into `books` (...) values (...) returning `id` ...
Added: TypeScript: The Good Parts by Douglas Crockford - $29.99 with ID: 1  
Added: Eloquent TypeScript by Marijn Haverbeke - $34.95 with ID: 2  
Added: You Don't Know TypeScript by Kyle Simpson - $24.99 with ID: 3  
[query] insert into `books` (...) values (...) returning `id` ...
Added: Node.js and TypeScript Design Patterns by Mario Casciaro - $39.99 with ID: 4
```

Behind the scenes, MikroORM tracks these entities and batches the SQL operations to insert them efficiently in just a few database transactions.

Now your database has several books added, and you're ready to learn how to query and retrieve them.

## Step 4 — Querying data from your database

In this section, you'll retrieve data from your SQLite database using MikroORM's powerful querying capabilities. These methods allow you to access data in a type-safe way without writing raw SQL.

Create a file named `src/query-books.ts`:

```typescript
[label src/query-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function queryBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Find all books
    console.log("==== All Books ====");
    const allBooks = await bookRepository.findAll();
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error querying books:', error);
  }
}

queryBooks();
```

The `bookRepository.findAll()` method retrieves all records from the `books` table as an array of `Book` entities. Each entity is a fully initialized object with all its properties and methods available.

Run this script to display all books in your database:

```command
npx tsx src/query-books.ts
```

You'll see output listing all the books you previously added:

```text
[output]
[info] MikroORM version: 6.4.11
[discovery] ORM entity discovery started ...
[info] MikroORM successfully connected to database ...
[query] select `b0`.* from `books` as `b0` ...
==== All Books ====
TypeScript: The Good Parts by Douglas Crockford, $29.99  
Eloquent TypeScript by Marijn Haverbeke, $34.95  
You Don't Know TypeScript by Kyle Simpson, $24.99  
Node.js and TypeScript Design Patterns by Mario Casciaro, $39.99
```
MikroORM executes a SQL SELECT query behind the scenes and maps the results to your entity class.

Often, you'll want to retrieve only records that match specific criteria. Update your script to include more query examples:

```typescript
// Find books by a specific author
const crockfordBooks = await bookRepository.find({
  author: "Douglas Crockford",
});
console.log("\n==== Books by Douglas Crockford ====");
crockfordBooks.forEach((book) => {
  console.log(`${book.title}, $${book.price}`);
});

// Find books with price less than $30
const affordableBooks = await bookRepository.find({ price: { $lt: 30.0 } });
console.log("\n==== Affordable Books (under $30) ====");
affordableBooks.forEach((book) => {
  console.log(`${book.title} by ${book.author}, $${book.price}`);
});
```

MikroORM's querying syntax is reminiscent of MongoDB's. For complex conditions like "less than $30," you use operators like `$lt` (less than) in the query object.

You can also control how results are sorted:

```typescript
// Order books by price (cheapest first)
const orderedBooks = await bookRepository.findAll({
  orderBy: { price: "ASC" },
});
console.log("\n==== Books Ordered by Price (Ascending) ====");
orderedBooks.forEach((book) => {
  console.log(`${book.title}: $${book.price}`);
});
```

The `orderBy` option specifies which fields to sort by and in what direction. Use 'ASC' for ascending order (lowest to highest) or 'DESC' for descending order.

If you only need a single record, use `findOne()` instead of `find()`:

```typescript
// Get a specific book
const specificBook = await bookRepository.findOne({
  title: "Eloquent TypeScript",
});
console.log("\n==== Specific Book ====");
if (specificBook) {
  console.log(`Found: ${specificBook.getDetails()}`);
}
```

For retrieving a record by its primary key, MikroORM provides an even faster method:

```typescript
// Get a book by its ID
const bookById = await bookRepository.findOne(2);
console.log("\n==== Book by ID ====");
if (bookById) {
  console.log(`Found by ID: ${bookById.getDetails()}`);
}
```

These query methods form the core of data retrieval with MikroORM. The repository pattern makes it easy to isolate and reuse database access logic throughout your application.

Next, you'll learn how to update existing records in your database.


## Step 5 — Updating records in your database

In this section, you'll update existing records in your SQLite database using MikroORM. After retrieving an entity, you can modify its properties and redirect the changes to the database.

Create a file named `src/update-books.ts`:

```typescript
[label src/update-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function updateBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Find a book to update
    console.log("=== Before update ===");
    const book = await bookRepository.findOne({ title: 'TypeScript: The Good Parts' });

    if (book) {
      console.log(`${book.title} current price: $${book.price}`);

      // Update the book's price
      book.price = 32.99;

      // Flush changes to the database
      await em.flush();

      console.log("=== After update ===");
      console.log(`${book.title} new price: $${book.price}`);
    }

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error updating books:', error);
  }
}

updateBooks();
```

MikroORM updates records by tracking changes to entities. First, fetch the entity you want to update using a method like `findOne()`. Then, modify its properties directly. MikroORM's Unit of Work pattern tracks these changes automatically.

When you call `em.flush()`, MikroORM generates and executes the necessary SQL UPDATE statements to persist only the changed properties. This approach is efficient since it only updates what actually changed.

Run the script to update a book's price:

```command
npx tsx src/update-books.ts
```

You should see output showing the book's price before and after the update:

```text
[output]
=== Before update ===
[query] select `b0`.* from `books` as `b0` where `b0`.`title` = 'TypeScript: The Good Parts' limit 1 [took 0 ms, 1 result]
TypeScript: The Good Parts current price: $29.99
[query] begin
[query] update `books` set `price` = 32.99, `updated_at` = 1743579474295 where `id` = 1 [took 1 ms, 1 row affected]
[query] commit
=== After update ===
TypeScript: The Good Parts new price: $32.99
```

MikroORM executes the minimum SQL needed to apply the changes and automatically updates the `updatedAt` timestamp.

You can also modify multiple properties at once:

```typescript
// Find the book to update
const book = await bookRepository.findOne({ title: "Eloquent TypeScript" });

if (book) {
  // Update multiple attributes
  book.title = "Eloquent TypeScript: Third Edition";
  book.price = 39.99;
  book.author = "Marijn Haverbeke (3rd Ed.)";

  // Flush all changes at once
  await em.flush();

  console.log(`Updated: ${book.getDetails()}`);
}
```

MikroORM will track all these changes and generate a single SQL UPDATE statement that modifies only the changed fields.

For batch updates to multiple records, you can use the repository's `nativeUpdate()` method:

```typescript
// Bulk update - increase prices of all books under $30 by 10%
const result = await bookRepository.nativeUpdate(
  { price: { $lt: 30.0 } },
  { $inc: { price: { $mul: 0.1 } } }
);

console.log(`Updated prices for ${result} books`);
```

The `nativeUpdate()` method allows you to modify multiple records with a single database operation, without loading each entity into memory. It returns the number of rows affected.

Choose the entity-based approach when working with the entity's full state or related entities. Use `nativeUpdate()` for bulk operations when efficiency is paramount.

Next, let's look at how to delete records from your database.


## Step 6 — Deleting records from your database

In this section, you'll remove records from your SQLite database using MikroORM. You'll delete individual entities and perform bulk deletions based on specific criteria.

Create a file named `src/delete-books.ts`:

```typescript
[label src/delete-books.ts]
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { Book } from './entities/Book';

async function deleteBooks() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);

    // Get the EntityManager
    const em = orm.em.fork();

    // Get a reference to the Book repository
    const bookRepository = em.getRepository(Book);

    // Count books before deletion
    const countBefore = await bookRepository.count();
    console.log(`Total books before deletion: ${countBefore}`);

    // Find and delete a book
    const bookToDelete = await bookRepository.findOne({ author: { $like: '%Casciaro%' } });

    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);

      // Remove the entity
      await em.removeAndFlush(bookToDelete);
      console.log('Book deleted successfully');
    }

    // Count books after deletion
    const countAfter = await bookRepository.count();
    console.log(`Total books after deletion: ${countAfter}`);

    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error deleting books:', error);
  }
}

deleteBooks();
```

MikroORM deletes entities in a similar way to how it updates them. First, retrieve the entity using a method like `findOne()`. Then, call `em.removeAndFlush()` to delete it from the database. This method removes the entity and immediately persists the change.

Run the script to delete a book:

```command
npx tsx src/delete-books.ts
```

You'll see output showing the total number of books before and after the deletion, confirming that a book was removed:

```text
[output]
...
[query] begin
[query] delete from `books` where `id` in (4) [took 1 ms, 1 row affected]
[query] commit
Book deleted successfully
[query] select count(*) as `count` from `books` as `b0` [took 1 ms]
Total books after deletion: 3
```

MikroORM executes a DELETE statement using the entity's primary key.

For removing entities by ID without loading them first, use the repository's `nativeDelete()` method:

```typescript
// Delete a book by ID
const bookId = 2;
const deleted = await bookRepository.nativeDelete({ id: bookId });

console.log(`Deleted ${deleted} book(s)`);
```

This approach is more efficient when you already know the ID and don't need to work with the entity before deleting it.

For bulk deletions, you can also use `nativeDelete()` with a broader condition:

```typescript
// Bulk delete - remove inexpensive books
const deletedCount = await bookRepository.nativeDelete({
  price: { $lt: 30.0 },
});

console.log(`Deleted ${deletedCount} inexpensive books`);
```

This executes a single DELETE statement with a WHERE clause, removing all matching records efficiently.

Use the entity-based approach when you need to perform additional operations before or after deletion, such as logging or handling related entities. Use `nativeDelete()` for simple deletions where performance is a priority.

With these operations, you've covered the complete CRUD cycle (Create, Read, Update, Delete) using MikroORM. You would typically implement these operations in a real application behind a REST API or web interface.

## Final thoughts

This article showed you how to use MikroORM to define entities, add and query data, update records, and delete entries using a clean, type-safe API.

MikroORM combines TypeScript’s strong typing with powerful ORM tools like identity mapping and the unit of work pattern, making it ideal for building reliable and maintainable applications.

To learn more and explore advanced features, visit the [official MikroORM documentation](https://mikro-orm.io/docs/installation).