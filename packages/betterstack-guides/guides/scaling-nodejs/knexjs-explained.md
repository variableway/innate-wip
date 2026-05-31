# Beginner's Guide to Knex.js

[Knex.js](https://knexjs.org/) is a tool that helps you write SQL queries in JavaScript. It works with many databases like PostgreSQL, MySQL, and SQLite. Instead of writing raw SQL, you can use simple JavaScript functions to build your queries.

With Knex.js, you get complete control over your database queries, but it also adds safety by helping protect against SQL injection. So, it's an excellent choice for both flexibility and security.

In this guide, you’ll learn how to set up Knex.js with SQLite and use it to do basic database tasks using async/await in modern JavaScript.

[ad-logs]

## Prerequisites

Before you start, ensure you have Node.js version 22.x or later installed. You should also have a basic understanding of JavaScript and Node.js. Some familiarity with SQL can help, but it’s not required.

 In this tutorial, we’ll use SQLite as our database, so there’s no need to set up a separate database server. The `sqlite3` package we’ll install includes everything you need to start working with SQLite immediately.


## Step 1 — Setting up your project directory

In this step, you’ll set up a new project and install the tools to use Knex.js with SQLite.

First, create a new directory for your project and go into it:

```command
mkdir knex-tutorial && cd knex-tutorial
```

Next, initialize a new Node.js project. This will create a `package.json` file:

```command
npm init -y
```

Then, update your project to use ES Modules by setting the `"type"` field in `package.json`:

```command
npm pkg set type=module
```

This tells Node.js to treat `.js` files as ES Modules instead of the older CommonJS format.

Now install Knex.js and the SQLite3 driver:

```command
npm install knex sqlite3
```

Here’s what each package does:

- [`knex`](https://www.npmjs.com/package/knex): Lets you build and run SQL queries using JavaScript.
- [`sqlite3`](https://www.npmjs.com/package/sqlite3): Allows Knex to connect to and interact with SQLite databases.

With everything installed, you can set up your first database connection using Knex.js.

## Step 2 — Understanding Knex.js components and creating your database

Before we write any code, let’s quickly go over the main parts of Knex.js and how they work together:

- **Knex instance**: Sets up and manages your database connection  
- **Query builder**: Helps you write SQL queries using method chaining in JavaScript  
- **Schema builder**: Lets you create, update, or delete database tables  
- **Migrations**: Tracks changes to your database structure over time  
- **Seeds**: Fills your database with sample or default data  

Now let’s set up your database connection. Create a new file called `database.js` in your project root directory and add this code:

```javascript
[label database.js]
import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a Knex instance with SQLite configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'bookstore.sqlite')
  },
  useNullAsDefault: true, // SQLite-specific setting
  debug: true // Shows queries in console (disable in production)
});

// Function to test the database connection
async function testConnection() {
  try {
    const result = await db.raw('SELECT 1+1 AS result');
    console.log('Database connection established successfully');
    return result;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export { db, testConnection };
```
This code connects to an SQLite database using Knex.js. It tells Knex where to find the database file and turns on debug mode so you can see the SQL queries in the console. The `useNullAsDefault` setting is needed for SQLite to handle columns without default values properly.

In this tutorial, you'll build a simple bookstore inventory system. To start, let’s create a `schema.js` file that sets up the database tables:


```javascript
[label schema.js]
import { db, testConnection } from './database.js';

async function createSchema() {
  try {
    // Test the connection first
    await testConnection();
    
    // Check if the books table already exists
    const tableExists = await db.schema.hasTable('books');
    
    if (tableExists) {
      console.log('Books table already exists, dropping it...');
      await db.schema.dropTable('books');
    }
    
    // Create the books table
    await db.schema.createTable('books', (table) => {
      table.increments('id').primary();
      table.string('title', 200).notNullable();
      table.string('author', 100).notNullable();
      table.decimal('price', 10, 2);
      table.integer('stock').unsigned().defaultTo(0);
      table.timestamps(true, true); // Creates created_at and updated_at columns
    });
    
    console.log('Books table created successfully!');
  } catch (error) {
    console.error('Error creating schema:', error);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Run the function
createSchema();
```
The script tests the database connection, then checks if the `books` table exists. If it does, it drops the table to start fresh. Then it creates a new `books` table with columns for:

- `id`: An auto-incrementing primary key
- `title`: A string column that can't be null
- `author`: A string column that can't be null
- `price`: A decimal column for storing book prices
- `stock`: An integer column with a default value of 0
- `created_at` and `updated_at`: Timestamp columns for tracking when records are created or modified


Run this script to create your database table:

```command
node schema.js
```

You should see output similar to:

```text
[output]
{
  method: 'raw',
  sql: 'SELECT 1+1 AS result',
  bindings: [],
  options: {},
  __knexQueryUid: '0xFEhwNLFoawCTzERidJs'
}
Database connection established successfully
[
  ...
]
Books table created successfully!
```
This means your database connection is working, and the `books` table was created successfully.


Now you have an SQLite database with an empty `books` table ready for data.


## Step 3 — Adding data to your database

In this step, you’ll insert some book records into your SQLite database using Knex.js. You’ll see how easy it is to turn JavaScript objects into rows in your database.

Start by creating a new file called `add-books.js`:


```javascript
[label add-books.js]
import { db } from './database.js';

async function addBooks() {
  try {
    // Insert a single book
    const firstId = await db('books').insert({
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      price: 29.99,
      stock: 10
    });
    
    console.log(`Added book with ID: ${firstId}`);
    
    // Insert multiple books at once using an array
    await db('books').insert([
      {
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 34.95,
        stock: 8
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        price: 24.99,
        stock: 15
      }
    ]);
    
    // Display all books
    const books = await db('books').select('*');
    books.forEach(book => {
      console.log(`${book.title} by ${book.author} - $${book.price}`);
    });
    
  } catch (error) {
    console.error('Error adding books:', error);
  } finally {
    await db.destroy();
  }
}

addBooks();
```
This program demonstrates two different methods for adding data. First, it inserts a single book using `db('books').insert()` with a plain JavaScript object. The method returns a Promise that resolves to the new record's ID.

Then, it adds multiple books at once by passing an array of objects to the `insert()` method. This batch insertion is much more efficient than adding each book separately.

Knex.js automatically converts your JavaScript objects to the proper SQL `INSERT` statements, handling the data types and formatting your specific database requires.

Run this program to insert the data into your database:

```command
node add-books.js
```

You should see output showing the newly added books with their details:

```text
[output]
...
Added book with ID: 1
...
JavaScript: The Good Parts by Douglas Crockford - $29.99
Eloquent JavaScript by Marijn Haverbeke - $34.95
You Don't Know JS by Kyle Simpson - $24.99
```
Now your database has some sample book records ready to use.


## Step 4 — Querying data from your database

Now that you’ve added some books to your database, let’s look at how to fetch them using Knex.js. Knex’s query builder lets you write SQL-like queries in JavaScript using clean, chainable methods.

Create a new file called `query-books.js`:

```javascript
[label query-books.js]
import { db } from './database.js';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await db('books').select('*');
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author} - $${book.price}`);
    });
    
    // Close the database connection when done
    await db.destroy();
  } catch (error) {
    console.error('Error querying books:', error);
    await db.destroy();
  }
}

queryBooks();
```

Run this script to retrieve all books from your database:

```command
node query-books.js
```

You should see output similar to:

```text
[output]

==== All Books ====
...
JavaScript: The Good Parts by Douglas Crockford - $29.99
Eloquent JavaScript by Marijn Haverbeke - $34.95
You Don't Know JS by Kyle Simpson - $24.99
```

The `db('books').select('*')` method retrieves all records from the `books` table. Knex returns the results as an array of JavaScript objects, with each object representing a row from the table.

To filter records based on specific criteria, use the `where` method:

```javascript
// Get books under $30
const affordableBooks = await db('books')
  .where('price', '<', 30)
  .select('title', 'author', 'price');
```

The `where` method accepts three parameters: the column name, the operator, and the value. This query only returns books with prices less than $30.

When you need just one record, use the `first()` method:

```javascript
// Get a book by its ID
const bookById = await db('books')
  .where('id', 2)
  .first();
```

The `first()` method returns a single object instead of an array, which is useful when you expect only one result. This is equivalent to adding `LIMIT 1` to a SQL query.

To sort your results, use the `orderBy` method:

```javascript
// Order books by price (highest first)
const expensiveFirst = await db('books')
  .select('title', 'price')
  .orderBy('price', 'desc');
```

The `orderBy` method takes a column name and direction ('asc' for ascending or 'desc' for descending). This sorts the books by price from highest to lowest.

You can perform aggregation operations like counting, summing, or averaging:

```javascript
// Count the total number of books
const bookCount = await db('books').count('id as count').first();

// Get the average price
const avgPrice = await db('books')
  .avg('price as avgPrice')
  .first();
```

The `count()`, `avg()`, `sum()`, and similar methods let you perform calculations on your data. You need to provide an alias (like 'count' or 'avgPrice') so you can access the result in the returned object.

For more complex filtering, you can use pattern matching:

```javascript
// Find books with JavaScript in the title
const jsBooks = await db('books')
  .where('title', 'like', '%JavaScript%')
  .select('title', 'author');
```

The `like` operator with `%` wildcards lets you search for patterns within text columns. The `%` symbol represents any number of characters, so this query finds all books with "JavaScript" anywhere in the title.

These query methods are the core tools for fetching data with Knex.js.


## Step 5 — Updating records in your database

In this section, you’ll update existing records using Knex.js. You can update a single book or apply changes to multiple records based on a condition.

Start by creating a new file called `update-books.js`:


```javascript
[label update-books.js]
import { db } from './database.js';

async function updateBooks() {
  try {
    // Find a book to update
    console.log("=== Before update ===");
    const book = await db('books')
      .where('title', 'JavaScript: The Good Parts')
      .first();
    
    if (book) {
      console.log(`${book.title} current price: $${book.price}`);
      
      // Update the book's price
      await db('books')
        .where('id', book.id)
        .update({
          price: 32.99,
          updated_at: db.fn.now() // Update the timestamp
        });
      
      // Check the new price
      const updated = await db('books')
        .where('id', book.id)
        .first();
      
      console.log("=== After update ===");
      console.log(`${updated.title} new price: $${updated.price}`);
    }
    
    // Close the database connection
    await db.destroy();
  } catch (error) {
    console.error('Error updating books:', error);
    await db.destroy();
  }
}

updateBooks();
```

The code shows how to update a specific book's price in the database. It starts by finding a book titled "JavaScript: The Good Parts" and logs its current price. If the book exists, it updates the price to $32.99 and the `updated_at` timestamp using `db.fn.now()`.


After the update, it retrieves the same book again to confirm and display the new price. Finally, the database connection is closed, whether the operation succeeds or fails.

To run the script and apply the update, use the following command:



```command
node update-books.js
```

You should see output similar to:

```text
[output]
=== Before update ===
...
JavaScript: The Good Parts current price: $29.99
...
=== After update ===
JavaScript: The Good Parts new price: $32.99
```

The `update` method takes an object with the columns you want to change and their new values:

```javascript
// Update multiple fields at once
await db('books')
  .where('id', bookId)
  .update({
    title: 'Updated Title',
    price: 39.99,
    stock: 20
  });
```

You can update any number of columns in a single operation. Knex generates an SQL UPDATE statement that only modifies the specified fields.

For calculations based on existing values, use the `db.raw()` method:

```javascript
// Increase price by 10%
await db('books')
  .where('id', bookId)
  .update({
    price: db.raw('ROUND(price * 1.1, 2)')
  });
```

The `db.raw()` method lets you include SQL expressions in your queries. This example increases the price by 10% and rounds to 2 decimal places.

For numeric columns, you can use the convenient `increment` and `decrement` methods:

```javascript
// Reduce stock by 3
await db('books')
  .where('id', bookId)
  .decrement('stock', 3);

// Increase price by $2.50
await db('books')
  .where('author', 'Kyle Simpson')
  .increment('price', 2.50);
```

These methods provide a simpler way to increase or decrease numeric values without using raw SQL. The first parameter is the column name, and the second is the amount to change it by.

To update multiple records at once, use a broader `where` condition:

```javascript
// Apply 10% discount to all books over $30
const discounted = await db('books')
  .where('price', '>', 30)
  .update({
    price: db.raw('ROUND(price * 0.9, 2)'),
    updated_at: db.fn.now()
  });
```

This performs a bulk update on all books matching the condition. The update method returns the number of records affected, which you can use to confirm how many items were modified.

Remember always to use `where` clauses with your updates to avoid accidentally modifying all records in the table.


## Step 6 — Deleting records from your database

The last part of CRUD is deleting data. Knex.js makes removing one or more records easy based on specific conditions.

Create a new file called `delete-books.js`:

```javascript
[label delete-books.js]
import { db } from './database.js';

async function deleteBooks() {
  try {
    // Count books before deletion
    const countBefore = await db('books').count('* as count').first();
    console.log(`Total books before deletion: ${countBefore.count}`);
    
    // Find a book to delete
    const bookToDelete = await db('books')
      .where('author', 'like', '%Crockford%')
      .first();
    
    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);
      
      // Delete the book by ID
      await db('books')
        .where('id', bookToDelete.id)
        .del();
      
      console.log('Book deleted successfully');
    }
    
    // Count books after deletion
    const countAfter = await db('books').count('* as count').first();
    console.log(`Total books after deletion: ${countAfter.count}`);
    
    // Close the database connection
    await db.destroy();
  } catch (error) {
    console.error('Error deleting books:', error);
    await db.destroy();
  }
}

deleteBooks();
```
In this code, you first count how many books are in the database. Then, you search for a book by an author whose name includes "Crockford". 

If a match is found, the script deletes that book using its ID. After the deletion, it counts the books again to show the updated total. Finally, the database connection is closed.

To run the script and delete the book:

```command
node delete-books.js
```

You should see output similar to:

```text
[output]
{
  ...,
  sql: 'select count(*) as `count` from `books` limit ?'
}
Total books before deletion: 3
{
  ...,
  sql: 'select * from `books` where `author` like ? limit ?'
}
Found book to delete: JavaScript: The Good Parts
{
  ...,
  sql: 'delete from `books` where `id` = ?'
}
Book deleted successfully
{
  ...,
  sql: 'select count(*) as `count` from `books` limit ?'
}
Total books after deletion: 2
```

To delete a record directly by its ID, use the `del()` method with a `where` clause:

```javascript
// Delete a book by ID
await db('books')
  .where('id', 3)
  .del();
```

The `del()` method (which can also be called as `delete()`) removes all records that match the specified condition. It returns the number of records deleted.

You can use any condition in the `where` clause to target specific records:

```javascript
// Delete books with low stock
await db('books')
  .where('stock', '<', 5)
  .del();
```

This removes all books with a stock value less than 5.

For more complex conditions, combine multiple criteria:

```javascript
// Delete books in a specific price range
await db('books')
  .where('price', '>', 20)
  .andWhere('price', '<', 30)
  .del();
```

The `andWhere` method adds additional conditions that must all be true. This query removes books priced between $20 and $30.

You can also match against a list of values using `whereIn`:

```javascript
// Delete books by specific authors
await db('books')
  .whereIn('author', ['Douglas Crockford', 'Kyle Simpson'])
  .del();
```

This removes all books written by either of the specified authors.

Knex.js requires you to specify a condition with `where()` before calling `del()`, which prevents accidentally deleting all records in a table. This built-in safety feature helps avoid catastrophic data loss.

For critical data, consider implementing "soft deletes" by adding a boolean column like `is_deleted` instead of actually removing records. 

This preserves your data history while still allowing you to filter out deleted items in your queries.


## Final thoughts

This article showed you how to use Knex.js to create tables, add data, query records, update entries, and delete rows with a clean, async-friendly API. Knex balances full SQL control and developer-friendly tools, making it powerful and easy to use.

Next, explore features like migrations, seeds, transactions, joins, and subqueries. For more details, visit the [official Knex.js documentation](https://knexjs.org).