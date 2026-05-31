# Getting Started with Sequelize ORM

[Sequelize](https://sequelize.org/) is a popular JavaScript ORM for Node.js,  which makes it easy to work with databases like PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It provides a unified, Promise-based API that simplifies database interactions.  

Instead of writing raw SQL queries, Sequelize lets you work with JavaScript objects that represent your data, automatically translating operations into the correct SQL syntax for your database.  

This guide will show you how to use Sequelize with SQLite to build a data-driven application using JavaScript’s asynchronous capabilities for efficient database management.

## Prerequisites

Before starting this tutorial, ensure you have:

- Node.js 22.x or newer installed
- Basic knowledge of JavaScript and Node.js  
- Familiarity with SQL (helpful but not required)  

If you're using SQLite, setting up a separate database server is unnecessary. The `sqlite3` package, which you'll install, includes everything needed to start working with SQLite immediately.


## Step 1 — Setting up your Sequelize project

In this section, you’ll set up a Node.js project using ES Modules, which provides a modern and clean structure for building database-driven applications with Sequelize.

Start by creating a new project directory and navigating into it:

```command
mkdir sequelize-tutorial && cd sequelize-tutorial
```

Initialize the Node.js project with npm to create a `package.json` file for managing dependencies:


```command
npm init -y
```

Next, update your `package.json` to use ES Modules by adding the "type" field using this command:

```command
npm pkg set type=module
```

This command adds the "type": "module" field to your `package.json`, telling Node.js to treat .js files as ES Modules rather than CommonJS.

Now install the core packages needed for Sequelize development with SQLite:

```command
npm install sequelize sqlite3
```

This command installs two key packages:  

- `sequelize`: The ORM framework that defines models and handles database interactions.  
- `sqlite3`: A Node.js binding for SQLite, allowing Sequelize to communicate with the database.  

SQLite is an excellent choice since it doesn’t require a separate database server. The entire database is stored in a single file, making setup quick and easy.  

With these core packages installed, you can establish your first Sequelize connection.


## Step 2 — Understanding Sequelize components and creating your first model

Before writing any code, it's important to understand Sequelize's architecture and how its components work together to provide a complete ORM solution. Knowing these building blocks will help you design efficient data models and queries.  

The Sequelize ecosystem is made up of several key parts that work together:

- **Sequelize**: Handles the database connection using a connection pool.  
- **Model**: Defines the structure of a table as a JavaScript class.  
- **Instance**: Represents a single row in the table, with methods to save or update it.  
- **QueryInterface**: Allows schema changes (like creating tables) without writing raw SQL.  
- **DataTypes**: Maps JavaScript data types to the correct database column types.  
- **Associations**: Defines relationships between models, making it easy to work with related data using `JOIN` queries.

To get started, create a file named `database.js` in your project folder and add the following code to set up Sequelize and connect to an SQLite database:


```javascript
[label database.js]
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'), // SQLite database file path
  logging: console.log // Set to false in production
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export { sequelize, testConnection };
```

This code initializes a connection to an SQLite database using Sequelize. The `Sequelize` instance manages the connection and handles connection pooling. The `testConnection` function is used to verify that the database connection is working correctly.

In this tutorial, you’ll build a simple bookstore management system.

To get started, create a directory named `models` in the root of your project:

```command
mkdir models
```

Next, inside the `models` folder, create a file named `book.js`:

```javascript
[label models/book.js]
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Book = sequelize.define('Book', {
  // Model attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'books',
  timestamps: true // Adds createdAt and updatedAt columns
});

// Method to get book details
Book.prototype.getDetails = function() {
  return `${this.title} by ${this.author} - ${this.price}`;
};

module.exports = Book;
```

This code defines a `Book` model that connects to your database's `books` table.

The `sequelize.define` function sets up the model and its fields:

- `id`: The primary key that auto-increments.
- `title`: A string (up to 200 characters) that can't be empty.
- `author`: A string (up to 100 characters) that can't be empty.
- `price`: A decimal number with up to 10 digits total and 2 decimal places.

The `tableName: 'books'` option tells Sequelize to use the `books` table in the database.  

Setting `timestamps: true` automatically adds `createdAt` and `updatedAt` columns to track when each record was created or updated.

There's also a custom instance method called `getDetails`, which returns a simple formatted string like `"Book Title by Author - $Price"`.


Now, create the database tables by adding a new file named `create-tables.js`:

```javascript
[label create-tables.js]
import { sequelize, testConnection } from './database.js';
import Book from './models/book.js';

async function createTables() {
  try {
    // Test the database connection
    await testConnection();
    
    // Sync all models with the database
    // force: true will drop tables if they exist
    await sequelize.sync({ force: true });
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

createTables();
```

Run this script to create the tables:

```command
node create-tables.js
```

You should see output similar to:

```text
[output]
Executing (default): SELECT 1+1 AS result
Connection has been established successfully.
Executing (default): DROP TABLE IF EXISTS `books`;
Executing (default): PRAGMA foreign_keys = OFF
Executing (default): DROP TABLE IF EXISTS `books`;
Executing (default): PRAGMA foreign_keys = ON
Executing (default): DROP TABLE IF EXISTS `books`;
Executing (default): CREATE TABLE IF NOT EXISTS `books` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `title` VARCHAR(200) NOT NULL, `author` VARCHAR(100) NOT NULL, `price` DECIMAL(10,2), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
Executing (default): PRAGMA INDEX_LIST(`books`)
Database tables created successfully!
```

This output shows that Sequelize first removes any existing `books` table (because `force: true` is enabled), then creates a new one with all the defined columns, data types, and constraints.

At this stage, your SQLite database has an empty `books` table ready to store book records.

## Step 3 — Adding data to your database

In this section, you’ll insert records into your SQLite database using Sequelize’s Promise-based methods. You’ll create `Book` objects, add them to the database, and see how Sequelize converts JavaScript objects into actual database entries.

To get started, create a file named `add-books.js`:

```javascript
[label add-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';

async function addBooks() {
  try {
    // Create book objects using the create method
    const books = await Promise.all([
      Book.create({
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        price: 29.99
      }),
      Book.create({
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 34.95
      }),
      Book.create({
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        price: 24.99
      })
    ]);
    
    // Print the newly created books with their IDs
    books.forEach(book => {
      console.log(`Added: ${book.getDetails()} with ID: ${book.id}`);
    });
    
    // Add another book using build and save
    const fourthBook = Book.build({
      title: "Node.js Design Patterns",
      author: "Mario Casciaro",
      price: 39.99
    });
    
    // Save the book to the database
    await fourthBook.save();
    console.log(`Added: ${fourthBook.getDetails()} with ID: ${fourthBook.id}`);
    
  } catch (error) {
    console.error('Error adding books:', error);
  } finally {
    await sequelize.close();
  }
}

addBooks();
```
This script uses two different methods to add data to the database.

First, it creates several `Book` entries using `Book.create()` inside a `Promise.all()` call. This runs all the insert operations at the same time. Each `create()` returns a Promise that resolves to the saved book, including its generated ID.

Then, another book is added using `build()` followed by `save()`. The `build()` method creates the book in memory without saving it immediately. This allows you to make changes before calling `save()` to store it in the database. This method is useful when more control over the object is needed before saving.

Run this script to insert the data into your database:

```command
node add-books.js
```

You should see output similar to:

```text
[output]
Executing (default): INSERT INTO `books` (`id`,`title`,`author`,`price`,`createdAt`,`updatedAt`) VALUES (NULL,$1,$2,$3,$4,$5);
Executing (default): INSERT INTO `books` (`id`,`title`,`author`,`price`,`createdAt`,`updatedAt`) VALUES (NULL,$1,$2,$3,$4,$5);
Executing (default): INSERT INTO `books` (`id`,`title`,`author`,`price`,`createdAt`,`updatedAt`) VALUES (NULL,$1,$2,$3,$4,$5);
Added: JavaScript: The Good Parts by Douglas Crockford - $29.99 with ID: 3
Added: Eloquent JavaScript by Marijn Haverbeke - $34.95 with ID: 1
Added: You Don't Know JS by Kyle Simpson - $24.99 with ID: 2
Executing (default): INSERT INTO `books` (`id`,`title`,`author`,`price`,`createdAt`,`updatedAt`) VALUES (NULL,$1,$2,$3,$4,$5);
Added: Node.js Design Patterns by Mario Casciaro - $39.99 with ID: 4
```

The output displays the SQL `INSERT` statements that Sequelize generates and runs for each book. In SQLite, setting the `id` field to `NULL` lets the database auto-generate a unique ID for each record. Sequelize also automatically fills in the `createdAt` and `updatedAt` fields with the current timestamp.

Now that your database has some books added, you’re ready to move on and learn how to query and retrieve them.


## Step 4 — Querying data from your database

In this section, you’ll retrieve data from your SQLite database using Sequelize’s built-in query methods. These methods let you access data in a clear, JavaScript-friendly way—no need to write raw SQL.

Now that your database has some books, create a file named `query-books.js` to write and run your queries:

```javascript
[label query-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function queryBooks() {
  try {
    // Get all books
    console.log("==== All Books ====");
    const allBooks = await Book.findAll();
    allBooks.forEach(book => {
      console.log(`${book.title} by ${book.author}, $${book.price}`);
    });
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error querying books:', error);
    await sequelize.close();
  }
}

queryBooks();
```

The `Book.findAll()` method fetches all records from the `books` table and returns them as an array of `Book` instances. Each instance represents a row in the table, and you can access properties like `title`, `author`, and `price` directly.

Run this script to display all books currently stored in your database:

```command
node query-books.js
```

You should see output similar to this:

```text
[output]
==== All Books ====
Executing (default): SELECT `id`, `title`, `author`, `price`, `createdAt`, `updatedAt` FROM `books` AS `Book`;
Eloquent JavaScript by Marijn Haverbeke, $34.95
You Don't Know JS by Kyle Simpson, $24.99
JavaScript: The Good Parts by Douglas Crockford, $29.99
Node.js Design Patterns by Mario Casciaro, $39.99
```

From the output, you can see that Sequelize executes a `SELECT` query to fetch all books from the database. It retrieves the book details and displays them in a readable format.

Often, you'll want to retrieve only records that match certain criteria. Here's how to filter data:

```javascript
// Query books by a specific author
const crockfordBooks = await Book.findAll({
  where: {
    author: "Douglas Crockford"
  }
});
```

To find books by a specific author, you use the `where` clause with the author's name. This generates a SQL query with a WHERE condition.

```javascript
// Query books with price less than $30
const affordableBooks = await Book.findAll({
  where: {
    price: {
      [Op.lt]: 30.00
    }
  }
});
```

To handle more complex conditions—like finding books priced below $30—you can use operators from Sequelize’s `Op` object. For example, `Op.lt` means “less than” in SQL.

You can also control how the results are sorted using the `order` option:

```javascript
// Order books by price (cheapest first)
const orderedBooks = await Book.findAll({
  order: [
    ['price', 'ASC']
  ]
});
```

This sorts the books by price in ascending order. The `order` option takes an array of arrays, with each inner array specifying the column name and the sort direction:

```javascript
// Order by price in descending order (most expensive first)
const expensiveFirst = await Book.findAll({
  order: [
    ['price', 'DESC']
  ]
});
```

Changing `'ASC'` to `'DESC'` reverses the sort order, so the most expensive books appear first.

If you only need a single record, use `findOne()` instead of `findAll()`:

```javascript
// Get the first matching book
const firstBook = await Book.findOne();
```

The `findOne()` method returns the first record that matches your criteria. Without a `where` clause, it returns the first record in the table.

```javascript
// Get a specific book by ID
const bookById = await Book.findByPk(2);
```

The `findByPk()` method is the most efficient way to retrieve a record by its primary key (ID). It's faster than using `findOne()` with a `where` condition for the same purpose.

These query methods are the core tools for fetching data with Sequelize. Always make sure to close the database connection when you're finished querying.

Next, you’ll update existing records in your database.


## Step 5 — Updating records in your database

In this section, you’ll update existing records in your SQLite database using Sequelize. Once a record is retrieved, you can modify its properties and save the changes. Sequelize also supports bulk updates when you need to update multiple records at once.

Create a file named `update-books.js`:

```javascript
[label update-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function updateBooks() {
  try {
    // Find a book to update
    console.log("=== Before update ===");
    const book = await Book.findOne({
      where: {
        title: "JavaScript: The Good Parts"
      }
    });
    
    if (book) {
      console.log(`${book.title} current price: $${book.price}`);
      
      // Update the book's price
      book.price = 32.99;
      
      // Save the changes
      await book.save();
      
      console.log("=== After update ===");
      console.log(`${book.title} new price: $${book.price}`);
    }
    
    // Close the database connection
    await sequelize.close();
  } catch (error) {
    console.error('Error updating books:', error);
    await sequelize.close();
  }
}

updateBooks();
```

Sequelize updates a record in two steps. First, it fetches the record using a method like `findOne()` with a condition—for example: `where({ title: "JavaScript: The Good Parts" })`. This returns the matching book as a JavaScript object.

You can then modify its properties directly, such as changing the `price`.  
To save the changes to the database, call `book.save()`. This tells Sequelize to generate and run an SQL `UPDATE` statement. It also automatically updates the `updatedAt` timestamp.

Run the script to apply the update to the book’s record in the database:


```command
node update-books.js
```

You should see output like this:


```text
[output]
=== Before update ===
Executing (default): SELECT `id`, `title`, `author`, `price`, `createdAt`, `updatedAt` FROM `books` AS `Book` WHERE `Book`.`title` = 'JavaScript: The Good Parts' LIMIT 1;
JavaScript: The Good Parts current price: $29.99
Executing (default): UPDATE `books` SET `price`=$1,`updatedAt`=$2 WHERE `id` = $3
=== After update ===
JavaScript: The Good Parts new price: $32.99
```

The SQL statements show that Sequelize first finds the book with a SELECT query, and then generates a precise UPDATE statement that only modifies the changed fields.

You can also modify multiple attributes before saving:

```javascript
// Find the book to update
const book = await Book.findOne({
  where: { title: "Eloquent JavaScript" }
});

// Update multiple attributes at once
book.title = "Eloquent JavaScript: Third Edition";
book.price = 39.99;
book.author = "Marijn Haverbeke (3rd Ed.)";

// Save all changes with a single operation
await book.save();
```

Sequelize will track all changed attributes and generate a single UPDATE statement that modifies only what changed, optimizing database performance.

For batch updates to multiple records, Sequelize provides a static `update()` method:

```javascript
// Bulk update - increase prices of all books under $30 by 10%
const [updatedRows] = await Book.update(
  { price: sequelize.literal('price * 1.1') },
  { 
    where: {
      price: { [Op.lt]: 30.00 }
    }
  }
);

console.log(`Updated prices for ${updatedRows} books`);
```

The static `update()` method lets you modify multiple records in one database operation, without loading each one into memory. It returns an array—the first element indicates how many rows were updated.

Use the instance-based approach when you need to work with related data or depend on the current values of a record. Use the static `update()` method for a faster, more efficient way to perform bulk updates.

In the next step, you'll delete records from your database.

## Step 6 — Deleting records from your database

In this section, you'll remove records from your SQLite database using Sequelize. You'll delete individual records and learn how to perform bulk deletions based on specific criteria.

Create a file called `delete-books.js`:

```javascript
[label delete-books.js]
import Book from './models/book.js';
import { sequelize } from './database.js';
import { Op } from 'sequelize';

async function deleteBooks() {
  try {
    // Count books before deletion
    const countBefore = await Book.count();
    console.log(`Total books before deletion: ${countBefore}`);
    
    // Find and delete a book by instance method
    const bookToDelete = await Book.findOne({
      where: {
        author: {
          [Op.like]: '%Casciaro%'  // Find books by Mario Casciaro
        }
      }
    });
    
    if (bookToDelete) {
      console.log(`Found book to delete: ${bookToDelete.title}`);
      
      // Delete the book
      await bookToDelete.destroy();
      console.log('Book deleted successfully');
    }
    
    // Count books after deletion
    const countAfter = await Book.count();
    console.log(`Total books after deletion: ${countAfter}`);
    
  } catch (error) {
    console.error('Error deleting books:', error);
  } finally {
    await sequelize.close();
  }
}

deleteBooks();
```
Sequelize uses a similar approach for deleting records to updating them. First, you retrieve the record—using something like `findOne()`—to get it as a JavaScript object. Then, you call the `.destroy()` method on that object to remove it from the database.

Run the following script to delete a book:

```command
node delete-books.js
```

You should see output like:

```text
[output]
Total books before deletion: 4
Executing (default): SELECT count(*) AS `count` FROM `books` AS `Book`;
Executing (default): SELECT `id`, `title`, `author`, `price`, `createdAt`, `updatedAt` FROM `books` AS `Book` WHERE `Book`.`author` LIKE '%Casciaro%' LIMIT 1;
Found book to delete: Node.js Design Patterns
Executing (default): DELETE FROM `books` WHERE `id` = 4
Book deleted successfully
Total books after deletion: 3
Executing (default): SELECT count(*) AS `count` FROM `books` AS `Book`;
```

The output shows that Sequelize starts by counting the total number of books, then locates the one that matches your condition. Once found, it deletes the record using its primary key. After the deletion, it prints the updated book count to confirm the change.

You can also remove a record directly using its primary key like this:

```javascript
// Delete a book by ID
const bookId = 2;  // ID of the book to delete
const deleted = await Book.destroy({
  where: { id: bookId }
});

console.log(`Deleted ${deleted} book(s)`);
```

This method skips fetching the record first and directly deletes the one with the given ID. It returns the number of records that were removed.

For bulk deletions—when you need to delete multiple records at once—you can use the same `destroy()` method with a broader `where` condition:

```javascript
// Bulk delete example - delete inexpensive books
const deletedCount = await Book.destroy({
  where: {
    price: {
      [Op.lt]: 30.00
    }
  }
});

console.log(`Deleted ${deletedCount} inexpensive books`);
```

This runs a single `DELETE FROM` query with a `WHERE` clause, removing all books priced under $30. It returns the number of records deleted. This method is much more efficient than retrieving and deleting each book one by one—especially when working with large amounts of data.

Use the instance-based approach when you need more control—like logging, validation, or handling related data before or after deletion. The direct approach using conditions is ideal for bulk deletions where performance matters.

With this, you’ve covered the entire CRUD operations (Create, Read, Update, Delete) using Sequelize. In a real-world project, you’d typically use these operations behind a REST API or web interface to manage your data.

## Final thoughts

Throughout this tutorial, you've learned how to use Sequelize to handle core database operations in a modern JavaScript application. You’ve defined models, added and queried data, updated records, and removed entries—all using Sequelize’s clean, Promise-based API with async/await.


To dive deeper into advanced features, best practices, and real-world use cases, check out the [official Sequelize documentation](https://sequelize.org/docs/v6/).