# Getting Started with Native SQLite in Node.js

Node.js version 22.5.0 introduced an exciting new feature: a native SQLite
module.

Following the example of other runtimes like Deno and Bun, Node.js now offers
developers a built-in database solution without requiring external dependencies.

This addition brings Node.js closer to languages like Python and PHP that have
integrated SQLite support.

In this article, we'll explore this experimental module and learn how to use it
in practical applications.

We'll build a simple book inventory application to demonstrate the core
capabilities of the native SQLite module, and discuss its strengths and
limitations compared to third-party alternatives.

[ad-logs]

## Understanding SQLite and its place in Node.js

SQLite is a compact, self-contained database engine written in C. Unlike
traditional relational database systems such as MySQL or PostgreSQL, SQLite
doesn't operate as a separate server process that receives and responds to
requests. Instead, SQLite reads and writes directly to ordinary disk files or
stores data in memory.

This architectural difference makes SQLite incredibly lightweight (typically
less than 1MB), simple to use, and perfect for embedding within applications.
According to SQLite's creators, it's the most widely deployed database engine in
the world, present in nearly every operating system, browser, and mobile device.

Node.js initially added SQLite functionality to support the Web Storage API, but the team recognized that developers could
benefit from direct access to SQLite's capabilities.

By exposing SQLite through the `node:sqlite` module, Node.js enables developers
to create file-based or in-memory databases without installing third-party
packages.

The native implementation offers several advantages: reduced external
dependencies, simplified setup and configuration, better integration with the
Node.js ecosystem, and consistent behavior across different Node.js
environments. This makes SQLite an attractive option for many developers working
with Node.js.

## Getting started with the built-in SQLite module

Before diving into our application, let's understand the basics of using the
SQLite module in Node.js.

As of early 2025, the SQLite module remains experimental, requiring a special
flag to enable it:

```command
node --experimental-sqlite your-file.js
```

This flag tells Node.js to make the SQLite module available for import in your
application.

Without this flag, attempting to import from `node:sqlite` would result in an
error as the module is not yet part of the stable Node.js API.

### Creating a database

The first step is importing the `DatabaseSync` class from the `node:sqlite`
module and creating a database instance:

```javascript
import { DatabaseSync } from 'node:sqlite';

// Create an in-memory database
const memoryDb = new DatabaseSync(':memory:');

// Or create a file-based database
const fileDb = new DatabaseSync('path/to/database.db');
```

This code demonstrates two ways to create an SQLite database. The special
`:memory:` string creates a temporary database that exists only in RAM and
disappears when your program ends. This is perfect for testing or when you need
extremely fast access to temporary data.

The file-based approach creates a persistent database stored in the specified
file path. If the file doesn't exist, SQLite creates it; if it exists, SQLite
opens the existing database.

Notice that the class name includes `Sync` indicating that all operations are
synchronous. This is an important distinction from many other Node.js APIs which
favor asynchronous patterns.

### Basic database operations

Let's look at some fundamental operations:

```javascript
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');

// Create a table using exec()
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    published_year INTEGER,
    genre TEXT,
    in_stock INTEGER DEFAULT 1
  )
`);

// Insert data using a prepared statement
const insertStmt = db.prepare(`
  INSERT INTO books (title, author, published_year, genre)
  VALUES (?, ?, ?, ?)
`);

// Execute the prepared statement with run()
insertStmt.run('Dune', 'Frank Herbert', 1965, 'Science Fiction');

// Query data with a prepared statement
const queryStmt = db.prepare('SELECT * FROM books WHERE genre = ?');
const scifiBooks = queryStmt.all('Science Fiction');

console.log(scifiBooks);
```

This example demonstrates several key SQLite operations in Node.js. Let's break
down what's happening:

First, we create an in-memory database using `new DatabaseSync(':memory:')`.
Then we execute a SQL command to create a table using the `exec()` method. The
`exec()` method is ideal for one-time operations like table creation or schema
modifications. The SQL syntax creates a table named "books" with various
columns, including an auto-incrementing primary key.

Next, we create a prepared statement using `db.prepare()`. Prepared statements
are pre-compiled SQL templates that can be executed multiple times with
different parameters. They offer better performance and security by preventing
SQL injection. The question marks `?` in the SQL string are placeholders for the
values we'll provide later.

We then execute the prepared statement with `run()`, passing the actual values
for our book record: title, author, publication year, and genre. The `run()`
method is optimized for operations that modify the database (`INSERT`, `UPDATE`,
`DELETE`) and returns information about the operation rather than fetched data.

Finally, we create another prepared statement to query books by genre. The
`all()` method executes the query and returns all matching rows as an array of
objects. Each object represents a book record with property names matching the
column names.

When executed, this code outputs an array containing the single book we
inserted, with all its column values.

## Building a book inventory application

Now that we understand the basics, let's build a more substantial application: a
RESTful API for managing a bookstore inventory. This example will showcase how
to use the native SQLite module in a real-world scenario.

Our application will allow users to add new books to the inventory, view books
with filtering options, update book information, manage stock status, and remove
books from the database.

### Project setup

First, let's create a new project and install the required dependencies:

```command
mkdir book-inventory && cd book-inventory
```

```command
npm init -y
```

```command
npm install express
```

Next, update the `package.json` file to include the experimental SQLite flag:

```json
[label package.json]
{
  "name": "book-inventory",
  "version": "1.0.0",
  "description": "Book inventory using Node.js native SQLite",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node --experimental-sqlite server.js",
    "dev": "node --watch --experimental-sqlite server.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

This setup ensures that whenever we run our application using `npm start` or
`npm run dev`, Node.js will enable the experimental SQLite module.

The `--watch` flag included in the dev script automatically restarts the server
when files change, similar to tools like Nodemon.

### Creating the database model

Let's create a folder structure for our application:

```command
mkdir -p data routes
```

Now, create a database model file that will define our database schema:

```javascript
[label data/model.js]
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a file-based database
const database = new DatabaseSync(`${__dirname}/bookstore.db`);

// Initialize database schema
const initDatabase = `
CREATE TABLE IF NOT EXISTS books (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  published_year INTEGER,
  genre TEXT,
  price REAL NOT NULL,
  in_stock INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);
`;

// Execute schema creation
database.exec(initDatabase);

export default database;
```

This code establishes the foundation of our database system. We're creating a
file-based SQLite database that will persist in a file named `bookstore.db`
within the data directory.

The use of `__dirname` ensures the database is created relative to the current
file's location regardless of where the application is launched from.

The `initDatabase` variable contains SQL statements to create our schema. We're
using SQLite data types: `INTEGER` for numeric values, `TEXT` for strings, and
`REAL` for decimal numbers like prices.

The `PRIMARY KEY AUTOINCREMENT` attribute on the book_id ensures each book gets
a unique identifier automatically. We're also defining a `UNIQUE` constraint on
the `isbn` field to prevent duplicate books, and using `DEFAULT` values for the
`in_stock` field to indicate new books are available by default.

The `CREATE TABLE IF NOT EXISTS` syntax is particularly useful as it makes our
database initialization idempotent – the table will only be created if it
doesn't already exist, allowing our application to start cleanly whether it's
the first run or a subsequent one.

Finally, we execute the SQL statements using `database.exec()` and export the
database instance so other parts of our application can use it.

### Preparing SQL queries

Next, create a file for our prepared SQL statements:

```javascript
[label data/queries.js]
import database from './model.js';

// Book operations
const addBook = database.prepare(`
  INSERT INTO books (title, author, isbn, published_year, genre, price, in_stock, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING book_id, title, author, genre, price
`);

const getAllBooks = database.prepare(`
  SELECT * FROM books
`);

const getBooksByGenre = database.prepare(`
  SELECT * FROM books WHERE genre = ?
`);

const getBookById = database.prepare(`
  SELECT * FROM books WHERE book_id = ?
`);

const updateBookPrice = database.prepare(`
  UPDATE books SET price = ? WHERE book_id = ?
  RETURNING book_id, title, price
`);

const updateBookStock = database.prepare(`
  UPDATE books SET in_stock = ? WHERE book_id = ?
  RETURNING book_id, title, in_stock
`);

const deleteBook = database.prepare(`
  DELETE FROM books WHERE book_id = ?
`);

export {
  addBook,
  getAllBooks,
  getBooksByGenre,
  getBookById,
  updateBookPrice,
  updateBookStock,
  deleteBook
};
```

In this file, we're leveraging SQLite's prepared statements to improve
performance and security. Each prepared statement is created once using
`database.prepare()` and can be executed multiple times with different
parameters.

This approach is significantly more efficient than constructing and parsing SQL
strings for each operation, especially when the same query is used repeatedly
with different values.

Several of our statements use placeholders (the `?` characters) that will be
safely replaced with actual values when we execute the query. This
parameterization prevents SQL injection attacks by properly escaping and quoting
any user input.

We're also using the `RETURNING` clause in our `INSERT` and `UPDATE` statements,
which is an SQLite feature that returns specified columns from affected rows.
This is more efficient than performing a separate `SELECT` query after modifying
data, as it combines two database operations into one.

Each of these prepared statements serves a specific purpose in our inventory
system:

- `addBook` inserts a new book with all its details and returns key information
  about the newly added book.
- `getAllBooks` retrieves the complete inventory.
- `getBooksByGenre` filters books by their literary category.
- `getBookById` finds a specific book using its unique identifier.
- `updateBookPrice` modifies a book's price and returns the updated information.
- `updateBookStock` changes the availability status of a book.
- `deleteBook` removes a book from the inventory completely.

These prepared statements will be reused throughout our application, providing
consistent and efficient database access.

### Setting up the Express server

Now, create the main server file:

```javascript
[label server.js]
import express from 'express';
import booksRouter from './routes/books.router.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

This file sets up our Express server and connects it to our book routes, which
we'll create next.

The Express server provides the HTTP layer for our API, while SQLite will handle
all our data storage needs. Their combination creates a lightweight yet powerful
backend system.

### Creating the book routes

Let's implement the routes for our bookstore API:

```javascript
[label routes/books.router.js]
import express from 'express';
import {
  addBook,
  getAllBooks,
  getBooksByGenre,
  getBookById,
  updateBookPrice,
  updateBookStock,
  deleteBook
} from '../data/queries.js';

const booksRouter = express.Router();

// Get all books or filter by genre
booksRouter.get('/', (req, res) => {
  const { genre } = req.query;

  try {
    let books;

    if (genre) {
      books = getBooksByGenre.all(genre);
    } else {
      books = getAllBooks.all();
    }

    // Format dates and boolean values
    const formattedBooks = books.map(book => ({
      id: book.book_id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.published_year,
      genre: book.genre,
      price: book.price,
      inStock: Boolean(book.in_stock),
      addedOn: new Date(book.created_at).toISOString()
    }));

    return res.status(200).json(formattedBooks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

In this first route handler, we're implementing the ability to retrieve all
books or filter them by genre. We use the `all()` method on our prepared
statements, which executes the SQL query and returns all matching rows as an
array of JavaScript objects.

Since SQLite doesn't have a native boolean type, we store the in_stock status as
an integer (0 or 1) and convert it to a proper JavaScript boolean when sending
the response. Similarly, we store timestamps as integers (milliseconds since
epoch) and convert them to ISO date strings for the API response.

One important thing to notice is that these database calls are synchronous. When
`getBooksByGenre.all(genre)` or `getAllBooks.all()` executes, it blocks
Node.js's event loop until the operation completes.

For small to medium-sized databases, this isn't a problem since SQLite
operations are very fast, but it's something to keep in mind when dealing with
larger datasets or high-concurrency applications.

Let's continue with more route handlers:

```javascript
[label routes/books.router.js]
. . .
// Get a specific book by ID
booksRouter.get('/:id', (req, res) => {
  const bookId = Number(req.params.id);

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const formattedBook = {
      id: book.book_id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedYear: book.published_year,
      genre: book.genre,
      price: book.price,
      inStock: Boolean(book.in_stock),
      addedOn: new Date(book.created_at).toISOString()
    };

    return res.status(200).json(formattedBook);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

This route handler retrieves a single book by its ID. Notice that we're using
the `get()` method instead of `all()`.

The `get()` method is optimized for queries that should return only one row – it
executes the query and returns the first matching row as an object, or undefined
if no rows match. This is perfect for looking up records by their primary key.

We convert the ID parameter from the URL to a number before passing it to the
prepared statement, ensuring type compatibility with our SQLite schema. We also
check if a book was found and return an appropriate error response if not.

Now let's look at adding a new book:

```javascript
[label routes/books.router.js]
. . .
// Add a new book
booksRouter.post('/', (req, res) => {
  const { title, author, isbn, publishedYear, genre, price } = req.body;

  // Basic validation
  if (!title || !author || !price) {
    return res.status(400).json({ error: 'Title, author, and price are required' });
  }

  try {
    const inStock = 1; // Default to in stock
    const createdAt = Date.now();

    const newBook = addBook.get(
      title,
      author,
      isbn || null,
      publishedYear || null,
      genre || null,
      price,
      inStock,
      createdAt
    );

    return res.status(201).json({
      id: newBook.book_id,
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      price: newBook.price
    });
  } catch (error) {
    // Handle duplicate ISBN error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'ISBN already exists in the database' });
    }
    return res.status(500).json({ error: error.message });
  }
});
```

This route handler adds a new book to our inventory. After validating the
required fields, we execute our `addBook` prepared statement with the `get()`
method. The `get()` method is used here because our `INSERT` statement includes
the `RETURNING` clause, and we want to retrieve the first (and only) row of
returned data.

We're also taking advantage of SQLite's constraint checking by having a `UNIQUE`
constraint on the ISBN field. If someone tries to add a book with an ISBN that
already exists, SQLite will throw an error.

We catch this error and provide a user-friendly message. This demonstrates how
SQLite's built-in data integrity features can simplify our application logic.

Let's continue with update operations:

```javascript
[label routes/books.router.js]
// Update book price
booksRouter.patch('/:id/price', (req, res) => {
  const bookId = Number(req.params.id);
  const { price } = req.body;

  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = updateBookPrice.get(price, bookId);

    return res.status(200).json({
      id: updatedBook.book_id,
      title: updatedBook.title,
      newPrice: updatedBook.price
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update book stock status
booksRouter.patch('/:id/stock', (req, res) => {
  const bookId = Number(req.params.id);
  const { inStock } = req.body;

  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'inStock must be a boolean value' });
  }

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const stockValue = inStock ? 1 : 0;
    const updatedBook = updateBookStock.get(stockValue, bookId);

    return res.status(200).json({
      id: updatedBook.book_id,
      title: updatedBook.title,
      inStock: Boolean(updatedBook.in_stock)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

Both of these route handlers follow a similar pattern for updating different
aspects of a book: price and stock status. We first check if the book exists,
then perform the update using our prepared statements.

In the stock status update, we convert the incoming boolean value to an integer
(0 or 1) for storage in SQLite, then convert it back to a boolean in the
response. This pattern of type conversion between JavaScript and SQLite types is
common when working with SQLite in Node.js.

Finally, let's implement book deletion:

```javascript
[label routes/books.router.js]
// Delete a book
booksRouter.delete('/:id', (req, res) => {
  const bookId = Number(req.params.id);

  try {
    const book = getBookById.get(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    deleteBook.run(bookId);

    return res.status(200).json({
      message: 'Book successfully deleted',
      deletedBook: {
        id: book.book_id,
        title: book.title
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default booksRouter;
```

In this delete operation, notice that we use the `run()` method instead of
`get()` or `all()`. The `run()` method is ideal for operations that don't need
to return rows but rather information about the operation itself. For DELETE
operations, we typically don't need the deleted data (we've already retrieved it
to verify it exists), but information about whether the operation was
successful.

The `run()` method returns an object with properties like `changes` (number of
affected rows) and `lastInsertRowid` (for INSERT operations). In this case, we
don't use these properties, but in more complex applications, they can be
valuable for confirming the effects of operations.

### Working with SQLite types and data conversion

SQLite has a flexible type system that differs from JavaScript. When working
with the Node.js SQLite module, understanding these differences is important:

1. SQLite stores booleans as integers (0 or 1), so we convert between JavaScript
   booleans and SQLite integers.
2. SQLite has no dedicated date/time type, so we store timestamps as integers
   (milliseconds since epoch).
3. SQLite's `TEXT` type can store any string data, including JSON if serialized.
4. SQLite's `INTEGER` type maps well to JavaScript numbers but has different
   overflow behavior.

In our application, we handle these differences explicitly in our data
formatting code.

### Testing the book inventory API

Now that our book inventory API is ready, let's start the server and test its
functionality:

```command
npm run dev
```

This should produce:

```text
[output]
> book-inventory@1.0.0 dev
> node --watch --experimental-sqlite server.js

(node:6270) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Server running on port 5000
```

![WindowsTerminal_k0MkH8MwIS.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c5370eb-92a7-48bd-c17a-b4ebee97ca00/orig =1442x479)

Let's test our endpoints using a tool like cURL or Postman:

```command
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","isbn":"9780743273565","publishedYear":1925,"genre":"Classic","price":12.99}'
```

This command sends a `POST` request to create a new book. The request body
contains all the necessary book information in JSON format. Our server processes
this request, executes the SQLite `INSERT` statement, and returns information
about the newly created book.

Response:

```json
[output]
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Classic",
  "price": 12.99
}
```

![HTTPie_6s43zDr5sp.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5c07ef8c-c997-419f-a565-225943e57a00/md1x =1993x834)

The response confirms the book was added successfully and includes the
auto-generated ID.

#### Getting all books

```command
curl http://localhost:5000/api/books
```

This simple `GET` request triggers our server to execute the `getAllBooks`
prepared statement, which runs a `SELECT * FROM books` query against our SQLite
database.

Response:

```json
[output]
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "publishedYear": 1925,
    "genre": "Classic",
    "price": 12.99,
    "inStock": true,
    "addedOn": "2025-04-24T10:15:30.000Z"
  }
]
```

The response includes all fields from our books table. Notice how the data has
been transformed: `in_stock` (stored as 0 or 1 in SQLite) is returned as a
boolean, and `created_at` (stored as milliseconds) is converted to an ISO date
string.

## Final thoughts

The addition of a native SQLite module to Node.js marks an important evolution
in the runtime's capabilities. It provides developers with a lightweight,
dependency-free database option that requires minimal setup and configuration.
The synchronous API makes it straightforward to use, with predictable behavior
that's easy to reason about.

While the module remains experimental and has some limitations compared to more
mature third-party libraries, it offers a glimpse into a future where Node.js
applications can more easily incorporate persistent storage without external
dependencies.

The built-in nature of the module also ensures consistent behavior across
different environments and simplifies deployment. For many common scenarios, the
native SQLite module provides everything you need with a clean, straightforward
API.

As your application grows or requirements become more complex, you can always
transition to more specialized database solutions, but having SQLite available
from the start gives you a solid foundation to build upon.
