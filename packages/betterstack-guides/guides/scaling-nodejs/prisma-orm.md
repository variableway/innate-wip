# Getting Started with Prisma ORM for Node.js and PostgreSQL

In modern web development, efficient database management is crucial for building
scalable and maintainable applications. As developers, we often find ourselves
caught between writing raw SQL queries and using high-level ORMs that might hide
too much of what's happening under the hood.

[Prisma ORM](https://www.prisma.io) strikes an excellent balance by providing
type-safe database access with an intuitive API while maintaining transparency
and control over database operations.

This article will guide you through setting up Prisma with Node.js and
PostgreSQL, explaining key concepts, and demonstrating practical implementations
through real-world examples. Whether you're building your first API or looking
to migrate from another ORM, you'll find Prisma's approach refreshing and
powerful.

[ad-logs]

## Prerequisites

Before we begin, make sure you have:

- A recent version of Node.js and npm installed.
- PostgreSQL server running (local or remote).
- Basic knowledge of JavaScript and TypeScript.
- Familiarity with Node.js development.

## Understanding Prisma ORM

Prisma is an ORM that consists of three main components: Prisma Client, Prisma
Schema, and Prisma Migrate. Unlike traditional ORMs that use classes and
inheritance, Prisma generates a type-safe client based on your data model,
providing an intuitive and predictable API tailored to your specific database
schema.

What sets Prisma apart from other ORMs like Sequelize or TypeORM is its
schema-first approach. Instead of defining models as classes with decorators or
configuration objects, you define your data model in a declarative schema file.
Prisma then generates a client that matches this schema exactly, eliminating
many common issues like type mismatches or impedance mismatch between your code
and database.

## Setting up your project

Let's start by creating a new Node.js project and installing the necessary
dependencies:

```command
mkdir prisma-postgres-demo
```

```command
cd prisma-postgres-demo
```

```command
npm init -y
```

```command
npm install prisma @prisma/client express
```

```command
npm install --save-dev typescript ts-node @types/node @types/express
```

Next, initialize TypeScript configuration:

```command
npx tsc --init
```

```text
[output]
Created a new tsconfig.json with:

  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true

You can learn more at https://aka.ms/tsconfig
```

Now, let's initialize Prisma in our project:

```command
npx prisma init
```

```text
[output]
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started
```

This command creates a `prisma` directory with a `schema.prisma` file and a
`.env` file in your project root. The schema file is where you'll define your
data models, while the `.env` file will store your database connection string.

## Setting up a PostgreSQL database

The easiest way to set up a local PostgreSQL database is through Docker:

```command
docker run \
  --rm \
  --name postgres \
  --env POSTGRES_PASSWORD=admin \
  --env POSTGRES_DB=prisma_demo \
  --volume pg-data:/var/lib/postgresql/data \
  --publish 5432:5432 \
  postgres:bookworm
```

This command configures a container labeled `postgres` that maps the internal
PostgreSQL port 5432 to your localhost's port 5432.

Including the `--rm` flag ensures the container gets automatically removed once
stopped. Following PostgreSQL documentation recommendations, we've established
`admin` as the password for the default PostgreSQL user (`postgres`).

With your database engine now operational, we can proceed to integrate Prisma
into your Node.js application and define the data schema.

## Configuring the database connection

Open the `.env` file and update the `DATABASE_URL` variable with your PostgreSQL
connection string:

```text
[label .env]
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/prisma_demo?schema=public"
```

Replace `username`, `password`, and other parameters with your actual PostgreSQL
credentials:

```text
DATABASE_URL="postgresql://postgres:admin@localhost:5432/prisma_demo?schema=public"
```

If you're using a cloud-hosted PostgreSQL service, use the connection string
provided by your service.

Now, let's examine the generated `schema.prisma` file:

```prisma
[label prisma/schema.prisma]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This file contains two blocks:

- The `generator` block specifies that we want to generate a JavaScript client
  The `datasource` block configures the database connection, pointing to our
  PostgreSQL database using the environment variable we just set.

## Defining your data model

Now comes the exciting part - defining your data models. Let's create a simple
blog application with users, posts, and comments.

Update your `schema.prisma` file:

```prisma
[label schema.prisma]
generator client {
 provider = "prisma-client-js"
}

datasource db {
 provider = "postgresql"
 url      = env("DATABASE_URL")
}

[highlight]
model User {
 id        Int       @id @default(autoincrement())
 email     String    @unique
 name      String?
 password  String
 createdAt DateTime  @default(now()) @map("created_at")
 updatedAt DateTime  @updatedAt @map("updated_at")
 posts     Post[]
 comments  Comment[]

 @@map("users")
}

model Post {
 id        Int       @id @default(autoincrement())
 title     String
 content   String?
 published Boolean   @default(false)
 createdAt DateTime  @default(now()) @map("created_at")
 updatedAt DateTime  @updatedAt @map("updated_at")
 authorId  Int       @map("author_id")
 author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
 comments  Comment[]

 @@map("posts")
}

model Comment {
 id        Int      @id @default(autoincrement())
 content   String
 createdAt DateTime @default(now()) @map("created_at")
 updatedAt DateTime @updatedAt @map("updated_at")
 postId    Int      @map("post_id")
 post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
 authorId  Int      @map("author_id")
 author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

 @@map("comments")
}
[/highlight]
```

Let's break down what's happening in this schema:

1. We've defined three models: `User`, `Post`, and `Comment`
2. Each model has fields with types like `Int`, `String`, `Boolean`, and
   `DateTime`
3. We're using attributes (prefixed with `@`) to define constraints and defaults
4. We've established relationships between models using the `@relation`
   attribute
5. We're using `@@map` to specify the actual table names in the database
   (following snake_case convention)

Some notable features in our schema include:

- `@id` marks a field as the primary key
- `@default(autoincrement())` automatically increments the ID for new records
- `@unique` ensures that the email field contains unique values
- `@updatedAt` automatically updates the timestamp when a record changes
- `@map` renames fields to follow database naming conventions

## Creating database migrations

With our schema defined, it's time to create and apply migrations to set up our
database tables. Prisma Migrate compares your schema to the current state of the
database and generates the necessary SQL statements to synchronize them.

Run the following command to create your first migration:

```bash
npx prisma migrate dev --name init
```

This command does three things:

1. Creates a new migration file in the `prisma/migrations` directory
2. Executes the SQL in that migration file against your database
3. Generates the Prisma Client based on your schema

You should see output confirming that the migration was applied successfully. If
you check your database, you'll find the tables have been created with all the
fields, constraints, and relationships we defined.

```text
[output]
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "prisma_demo", schema "public" at "localhost:5432"

Applying migration `20250226084639_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20250226084639_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 44ms
```

You'll also see the following code in the `migration.sql` file:

```sql
[label migrations/20250226084639_init/migration.sql]
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

The above database tables match the model that we defined in the `prisma.schema`
file.

## Seeding the PostgreSQL database

To seed a PostgreSQL database with initial data using Prisma, you'll need to
create a seed script that will populate your database with sample or required
data.

First, create a directory called `prisma/seed.ts` in your project (or `seed.js`
if you're not using TypeScript):

```typescript
[label prisma/seed.ts]
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing records
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: 'password123', // Use proper hashing in production!
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: 'password456', // Use proper hashing in production!
    },
  });

  // Create posts with author
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma',
      content: 'This is a post about Prisma ORM and how to use it effectively with PostgreSQL...',
      published: true,
      author: {
        connect: { id: alice.id },
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Advanced PostgreSQL Features',
      content: 'In this post, we explore some advanced PostgreSQL features and how they integrate with Prisma...',
      published: true,
      author: {
        connect: { id: bob.id },
      },
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Great post! I learned a lot.',
      author: {
        connect: { id: bob.id },
      },
      post: {
        connect: { id: post1.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Thanks for sharing this information!',
      author: {
        connect: { id: alice.id },
      },
      post: {
        connect: { id: post2.id },
      },
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Then add a `prisma.seed` property to your `package.json` file:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

If you're using JavaScript instead of TypeScript, change the `seed` command to
`node prisma/seed.js`.

After setting up your seed script, you can run it with:

```command
npx prisma db seed
```

```text
[output]
Environment variables loaded from .env
Running seed command `ts-node prisma/seed.ts` ...
Database has been seeded!

🌱  The seed command has been executed.
```

You can also run the seed automatically after migrations by adding the `--seed`
flag to your migration command:

```command
npx prisma migrate dev --name init --seed
```

For larger datasets, you might want to separate your seed data from the script
logic, by creating a JSON file with your seed data:

```json
[label prisma/seed/data.json]
{
  "users": [
    {
      "email": "alice@example.com",
      "name": "Alice Johnson",
      "password": "password123"
    },
    {
      "email": "bob@example.com",
      "name": "Bob Smith",
      "password": "password456"
    }
  ],
  "posts": [
    {
      "title": "Getting Started with Prisma",
      "content": "This is a post about Prisma ORM...",
      "published": true,
      "authorEmail": "alice@example.com"
    },
    {
      "title": "Advanced PostgreSQL Features",
      "content": "In this post, we explore...",
      "published": true,
      "authorEmail": "bob@example.com"
    }
  ],
  "comments": [
    {
      "content": "Great post! I learned a lot.",
      "authorEmail": "bob@example.com",
      "postTitle": "Getting Started with Prisma"
    },
    {
      "content": "Thanks for sharing this information!",
      "authorEmail": "alice@example.com",
      "postTitle": "Advanced PostgreSQL Features"
    }
  ]
}
```

Then modify your seed script to import this data:

```typescript
[label prisma/seed.ts]
import { PrismaClient } from '@prisma/client';
[highlight]
import seedData from './data.json';
[/highlight]

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  for (const userData of seedData.users) {
    await prisma.user.create({
      data: userData,
    });
  }

  // Create posts
  for (const postData of seedData.posts) {
    const { authorEmail, ...postInfo } = postData;
    await prisma.post.create({
      data: {
        ...postInfo,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  // Create comments
  for (const commentData of seedData.comments) {
    const { authorEmail, postTitle, ...commentInfo } = commentData;
    await prisma.comment.create({
      data: {
        ...commentInfo,
        author: {
          connect: { email: authorEmail },
        },
        post: {
          connect: { title: postTitle },
        },
      },
    });
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

This approach allows you to maintain your seed data separately from the logic
for creating records, making it easier to update and manage your seed data as
your application evolves.

## Building the application architecture

Now that our database is set up, let's create a simple Express API to interact
with it. First, let's organize our project structure:

```text
prisma-postgres-demo/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

Let's create the entry point for our application. Create a file at
`src/index.ts`:

```typescript
[label src/index.ts]
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

We start by importing Express and the `PrismaClient` from the `@prisma/client`
package. The `PrismaClient` is instantiated as `prisma`, which will be our
interface to the database.

This client is automatically generated based on your Prisma schema and provides
type-safe methods to interact with your database. We also configure Express to
parse JSON request bodies using the `express.json()` middleware.

The server starts listening on the specified port, and we set up a `SIGINT`
handler to properly disconnect from the database before shutting down. The
`prisma.$disconnect()` method ensures all database connections are properly
closed, preventing potential resource leaks.

### User creation endpoint

```typescript
[label src/index.ts]
app.post('/users', async (req: Request, res: Response) => {
 try {
   const { name, email, password } = req.body;

   const user = await prisma.user.create({
     data: {
       name,
       email,
       password, // In production, hash this password!
     },
   });

   res.status(201).json(user);
 } catch (error) {
   console.error('Error creating user:', error);
   res.status(500).json({ error: 'Failed to create user' });
 }
});
```

This endpoint handles POST requests to `/users`. We extract user data (name,
email, password) from the request body and use `prisma.user.create()` to insert
a new record into the `User` table. The method returns the newly created user,
which we send back as JSON with a 201 status code, indicating that a resource
was created successfully.

Note that in a production application, you would want to hash the password
before storing it in the database using a library like `bcrypt`.

### Fetching all users

```typescript
app.get('/users', async (req: Request, res: Response) => {
 try {
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       email: true,
       createdAt: true,
     },
   });

   res.json(users);
 } catch (error) {
   console.error('Error fetching users:', error);
   res.status(500).json({ error: 'Failed to fetch users' });
 }
});
```

This endpoint handles GET requests to `/users`. We use `prisma.user.findMany()`
to retrieve all user records from the database. The `select` option provides
control over which fields to include in the result - here we're excluding the
password field for security reasons. This is a powerful feature of Prisma that
helps minimize unnecessary data transfer.

### Fetching a single user

```typescript
[label src/index.ts]
app.get('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;

   const user = await prisma.user.findUnique({
     where: { id: Number(id) },
     include: {
       posts: true,
     },
   });

   if (!user) {
     return res.status(404).json({ error: 'User not found' });
   }

   res.json(user);
 } catch (error) {
   console.error('Error fetching user:', error);
   res.status(500).json({ error: 'Failed to fetch user' });
 }
});
```

This endpoint retrieves a single user by their ID. We use
`prisma.user.findUnique()` with a `where` clause to specify which user to
retrieve. The interesting part here is the `include` option, which allows us to
fetch related data in a single query.

Here, we're including all posts created by this user, demonstrating how Prisma
makes it easy to work with relationships. If no user is found with the provided
ID, we return a 404 status code.

### Updating a user

```typescript
app.put('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;
   const { name, email } = req.body;

   const user = await prisma.user.update({
     where: { id: Number(id) },
     data: {
       name,
       email,
     },
   });

   res.json(user);
 } catch (error) {
   console.error('Error updating user:', error);
   res.status(500).json({ error: 'Failed to update user' });
 }
});
```

For user updates, we use `prisma.user.update()`. This method requires two main
arguments: a `where` clause to identify which record to update, and a `data`
object containing the fields to update with their new values.

If Prisma cannot find a user with the specified ID, it will throw an exception,
which we catch and return as a 500 error. In a more refined application, you
might want to check for specific error types to provide more accurate error
messages.

### Deleting a user

```typescript
[label src/index.ts]
app.delete('/users/:id', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;

   await prisma.user.delete({
     where: { id: Number(id) },
   });

   res.status(204).send();
 } catch (error) {
   console.error('Error deleting user:', error);
   res.status(500).json({ error: 'Failed to delete user' });
 }
});
```

The delete operation uses `prisma.user.delete()` to remove a user record from
the database. We identify which user to delete using the `where` clause.

Upon successful deletion, we return a 204 status code (No Content) without a
response body, following REST conventions for delete operations.

### Creating a post for a user

```typescript
[label src/index.ts]
app.post('/users/:id/posts', async (req: Request, res: Response) => {
 try {
   const { id } = req.params;
   const { title, content, published } = req.body;

   const post = await prisma.post.create({
     data: {
       title,
       content,
       published: published ?? false,
       author: {
         connect: { id: Number(id) },
       },
     },
   });

   res.status(201).json(post);
 } catch (error) {
   console.error('Error creating post:', error);
   res.status(500).json({ error: 'Failed to create post' });
 }
});
```

This endpoint showcases how Prisma handles relationships. We create a new post
and associate it with an existing user in one operation. The `connect` syntax
within the `author` field establishes a relationship between the new post and an
existing user.

This elegantly handles the foreign key relationship in the database. We're using
the nullish coalescing operator (`??`) to set a default value of `false` for the
`published` field if it's not provided in the request.

### Fetching all posts

```typescript
[label src/index.ts]
app.get('/posts', async (req: Request, res: Response) => {
 try {
   const posts = await prisma.post.findMany({
     include: {
       author: {
         select: {
           id: true,
           name: true,
         },
       },
     },
   });

   res.json(posts);
 } catch (error) {
   console.error('Error fetching posts:', error);
   res.status(500).json({ error: 'Failed to fetch posts' });
 }
});
```

This final endpoint demonstrates a more complex query where we fetch all posts
and include specific fields from the related author. The nested `include` with
`select` allows us to precisely control which related data to retrieve.

This is much more efficient than making separate queries for posts and authors,
showcasing how Prisma optimizes database access.

## Advanced Prisma features

Now that we have our basic CRUD operations implemented, let's explore some
advanced Prisma features that can make your development experience even better.

### Transactions

When you need to perform multiple database operations as a single unit, you can
use Prisma's transaction API:

```typescript
// Example: Creating a user and their first post in a transaction
const createUserWithPost = async (userData, postData) => {
 return prisma.$transaction(async (tx) => {
   const user = await tx.user.create({
     data: userData
   });

   const post = await tx.post.create({
     data: {
       ...postData,
       author: {
         connect: { id: user.id }
       }
     }
   });

   return { user, post };
 });
};
```

### Middleware

Prisma Client allows you to add middleware functions that execute before or
after queries:

```typescript
// Example: Logging all queries
prisma.$use(async (params, next) => {
 const before = Date.now();

 const result = await next(params);

 const after = Date.now();
 console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

 return result;
});
```

### Nested writes

Prisma makes it easy to create related records in a single query:

```typescript
// Example: Create a new user with posts and comments in one query
const createCompleteUserProfile = async () => {
 return prisma.user.create({
   data: {
     email: 'newuser@example.com',
     name: 'New User',
     password: 'securepassword',
     posts: {
       create: [
         {
           title: 'My First Post',
           content: 'Hello world!',
           comments: {
             create: [
               {
                 content: 'Great first post!',
                 author: {
                   connect: { email: 'existinguser@example.com' }
                 }
               }
             ]
           }
         }
       ]
     }
   },
   include: {
     posts: {
       include: {
         comments: true
       }
     }
   }
 });
};
```

## Best practices and optimization

When working with Prisma in production applications, consider these best
practices:

### Connection management

For serverless environments or applications with many short-lived requests, use
connection pooling:

```typescript
// In a file like src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
 prisma: PrismaClient | undefined;
};

export const prisma =
 globalForPrisma.prisma ??
 new PrismaClient({
   log: ['query', 'info', 'warn', 'error'],
 });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Query optimization

Use `select` to only fetch the fields you need:

```typescript
const getUsersWithMinimalData = async () => {
 return prisma.user.findMany({
   select: {
     id: true,
     name: true,
     email: true,
   }
 });
};
```

For pagination, use `skip` and `take`:

```typescript
const getPaginatedPosts = async (page = 1, pageSize = 10) => {
 const skip = (page - 1) * pageSize;

 const [posts, total] = await prisma.$transaction([
   prisma.post.findMany({
     skip,
     take: pageSize,
     orderBy: { createdAt: 'desc' },
     include: { author: true }
   }),
   prisma.post.count()
 ]);

 return {
   data: posts,
   meta: {
     total,
     page,
     pageSize,
     pageCount: Math.ceil(total / pageSize)
   }
 };
};
```

## Final thoughts

Prisma ORM provides a powerful and intuitive way to interact with your
PostgreSQL database in Node.js applications. Its type-safe client, schema-based
approach, and rich feature set make it an excellent choice for projects of all
sizes.

As you continue to develop with Prisma, explore its
[extensive documentation](https://www.prisma.io/docs) for more advanced features
like full-text search, raw queries, and database views. The vibrant community
around Prisma also provides many helpful resources, extensions, and plugins that
can enhance your development experience even further.

By adopting Prisma in your Node.js projects, you'll benefit from improved
developer productivity, reduced bugs due to type safety, and a clean, consistent
approach to database access that scales with your application's complexity.
