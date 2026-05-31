# How Turso Eliminates SQLite's Single-Writer Bottleneck

SQLite is the most widely deployed database in the world. As a **lightweight, self-contained, serverless, and zero-configuration SQL database engine**, it powers phones, web browsers, operating systems, and countless applications. 

Its simplicity and reliability are legendary, but for all its strengths, SQLite has a fundamental architectural limitation that has historically confined it to specific use cases: **it can only handle one write operation at a time**. In an era of multi-core processors and highly concurrent applications, this single-writer bottleneck can be a significant constraint.

Turso aims to change this by **rewriting SQLite from the ground up in Rust**, introducing Multi-Version Concurrency Control (MVCC) to eliminate the single-writer limitation. 

This article explores the core problem of SQLite's concurrency model, examines why Turso chose to rewrite the entire engine in Rust, and takes a deep dive into the mechanics of their MVCC implementation. You'll learn how this new system works, see its performance gains, and understand its current limitations as an experimental feature.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/BtQqaHlJcVo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

To follow the concepts in this article, you should have:

- Familiarity with relational databases and SQL
- Basic understanding of database transactions and ACID properties
- Knowledge of concurrency concepts like locking and parallel processing

## Understanding SQLite's single-writer bottleneck

Standard SQLite employs a simple but restrictive concurrency model based on database-level locking for write operations. When a process wants to write to an SQLite database through an `INSERT`, `UPDATE`, or `DELETE` statement, it must first acquire a lock on the entire database file. While this write lock is held, no other process can write to the database. Any other potential writers are blocked and must wait in a queue until the first writer completes its transaction and releases the lock.

![Single-writer lock in standard SQLite showing one writer process holding a lock on the database while another writer is blocked](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7f2b4241-d8d5-4069-a41d-74dd78a5e900/public =1920x1080)

This model effectively ensures data integrity and consistency (ACID compliance) in a simple manner. There's no risk of two processes writing conflicting data simultaneously because only one is allowed to write at a time, but this simplicity comes at the cost of concurrency.

### Real-world impact of single-writer locking

For many applications, this isn't a problem. A desktop application saving user preferences or a mobile app with a local data cache rarely experiences high write contention, but for modern, data-intensive applications, this model quickly becomes a bottleneck. Consider these scenarios:

**IoT data ingestion:** Thousands of sensors streaming telemetry data every second to a central database. Each data point requires a write operation. With standard SQLite, these writes would be serialized, creating a massive backlog and potentially losing data.

**Financial trading platforms:** High-frequency trading applications need to record thousands of transactions per second. The latency introduced by waiting for a database lock would be unacceptable.

**Massively multiplayer online games (MMOGs):** A game server needs to constantly update the state of thousands of players, including their position, inventory, and health. A single-writer model would cripple the game's performance, leading to lag and a poor user experience.

In these cases, developers are forced to move away from SQLite's simplicity and adopt more complex client-server databases like PostgreSQL or MySQL, which are designed for high concurrency but come with significant operational overhead.

### SQLite's `BEGIN CONCURRENT` feature

The SQLite developers have acknowledged this limitation and introduced an experimental feature called `BEGIN CONCURRENT` in conjunction with the Write-Ahead Logging (WAL) journaling mode. This feature attempts to improve concurrency by changing when the exclusive write lock is acquired.

Instead of locking the database at the beginning of a transaction, `BEGIN CONCURRENT` allows multiple transactions to proceed in parallel during the execution phase. The exclusive lock is deferred until the very last moment, the `COMMIT` phase. This is a form of optimistic locking where the system hopes that the parallel transactions won't conflict with each other.

The key limitation of this feature is that it operates on a **page level**. A database file is divided into fixed-size blocks of data called pages (typically 4KB). `BEGIN CONCURRENT`'s conflict detection checks if two transactions have modified the same page. If they have, even if they touched completely different rows within that page, a conflict occurs. The first transaction to commit will succeed, while the second will fail with an `SQLITE_BUSY_SNAPSHOT` error.

![Page-level locking conflict where Transaction T1 updating Row 1 locks the entire page, blocking Transaction T2 from updating Row 2 even though it's a different row on the same page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dc3febb8-3416-4bf2-31cf-4c6be4f7b500/lg2x =1920x1080)

This means that while `BEGIN CONCURRENT` can help in some scenarios, it doesn't solve the fundamental problem for write-intensive workloads where modifications are likely to occur on the same pages, leading to high transaction failure rates.

## Why Turso forked and rebuilt SQLite

Recognizing the need for a more robust solution, the team at Turso took a more radical approach. Their journey began not with a rewrite, but with a fork.

### The open-source but "closed-contribution" challenge

SQLite is famously in the public domain, meaning anyone can use it for any purpose. However, the project's maintainers follow a strict "open-source, not open-contribution" policy. To ensure the extreme reliability and stability of the codebase and to keep it uncontaminated and in the public domain, they do not accept contributions or pull requests from the general public. While this has been instrumental to SQLite's success, it also means that significant architectural changes, like adding a new concurrency model, cannot be proposed and merged by the community.

### The birth of `libSQL`

To overcome this hurdle, Turso created `libSQL`, a community-driven, open-contribution fork of SQLite. The goal of `libSQL` was to create a space where the community could collaborate on evolving SQLite for a new generation of applications. Early on, `libSQL` introduced several key features that were not available in the mainline SQLite project:

- **Embedded replicas:** The ability to have read-only replicas of a database inside your application
- **`libSQL` server:** A dedicated server for remote access, similar in concept to PostgreSQL or MySQL
- **Official language clients:** Easy-to-use clients for popular languages like Rust, JavaScript/TypeScript, Python, and Go

![The official GitHub repository page for libSQL showing the open-source project](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/73687647-00e2-4730-711c-2901ecec0900/lg2x =1920x1080)

Turso, the company, was built around `libSQL` to provide a hosted, managed database-as-a-service offering. However, even with these additions, `libSQL` was still fundamentally tied to SQLite's original C codebase, its old architecture, and its proprietary, non-public test suite, which made deep-level innovation challenging.

### The leap to Rust

This led to a momentous decision in early 2025: to go all-in on a complete rewrite of SQLite in Rust. Rust is a modern systems programming language known for its emphasis on performance, memory safety, and concurrency. By rewriting the database engine in Rust, the Turso team could break free from the constraints of the old C codebase and design a new architecture optimized for modern hardware and concurrent workloads.

The key goals for this ambitious rewrite included:

1. **Asynchronous I/O:** Native support for non-blocking I/O, crucial for high-performance servers
2. **WebAssembly (WASM) support:** A version that can run directly in the browser, enabling powerful offline-first applications
3. **Vector support:** Features for vector indexing and search, catering to the growing needs of AI and machine learning applications
4. **Multi-Version Concurrency Control (MVCC):** The cornerstone feature designed to eliminate the single-writer bottleneck once and for all

## Understanding Turso's MVCC implementation

The star of the Turso rewrite is its implementation of Multi-Version Concurrency Control (MVCC). This is the same concurrency mechanism used by many high-performance databases like PostgreSQL and Oracle.

### What is Multi-Version Concurrency Control?

In a traditional locking system, when data is being modified, it is locked to prevent others from reading inconsistent data or making conflicting changes. MVCC takes a different approach. Instead of overwriting data in place, when a write occurs, the system creates a **new version** of that data.

Each transaction is given a snapshot of the database at a particular moment in time. When a transaction reads data, it sees the latest version of that data that existed when the transaction began. This means that writers do not block readers, and readers do not block writers, dramatically increasing concurrency. Multiple write transactions can also work in parallel because they are each creating new, isolated versions of the data they modify. The system then handles resolving these versions and ensuring that only committed changes become visible to new transactions.

![Turso's MVCC model showing multiple writer processes operating on the database simultaneously without blocking each other](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/30b43c46-9f38-444c-f0cd-64ec9a487e00/public =1920x1080)

### Inspired by Hekaton

Turso's implementation of MVCC is specifically inspired by a technology from Microsoft SQL Server called **Hekaton**. Hekaton is a memory-optimized database engine that uses sophisticated, lock-free data structures to achieve extremely high transaction throughput. By drawing inspiration from this proven, high-performance architecture, Turso aims to bring enterprise-grade concurrency control to the world of SQLite. The key technique they adopted is **row-level versioning**.

### Row-level versioning in practice

To illustrate how Turso's MVCC works, consider a simple `products` table that tracks the quantity of items in an inventory.

```sql
[label schema.sql]
CREATE TABLE products (
    name TEXT PRIMARY KEY,
    quantity INTEGER
);
```

Consider three concurrent transactions (T1, T2, and T3) that occur over a short period.

### Step 1 — Transaction T1 inserting a row

At time `t=1`, transaction T1 starts and inserts a new product, 'Mug', with a quantity of 100.

```sql
INSERT INTO products VALUES ('Mug', 100);
```

When this transaction commits, the MVCC engine doesn't just write the row. It creates the first version of this row, `V1`, and attaches metadata to it:

- **Row data:** `(name: 'Mug', quantity: 100)`
- **Version metadata:** `Begin: T1`, `End: ∞` (infinity)

This metadata signifies that version `V1` of this row was created by transaction T1 and is valid indefinitely, or until a new version is created.

### Step 2 — Transaction T2 inserting another row

At time `t=2`, transaction T2 starts and inserts a 'Teapot'.

```sql
INSERT INTO products VALUES ('Teapot', 500);
```

Since this affects a completely different row, it can proceed without any conflict. A new version `V1` is created for the 'Teapot' row. The state of the versioned data now looks like this:

- **Mug row:** `V1 (Begin: T1, End: ∞)`
- **Teapot row:** `V1 (Begin: T2, End: ∞)`

### Step 3 — Transaction T3 updating an existing row

At time `t=3`, transaction T3 starts with the goal of updating the quantity of the 'Mug', decrementing it by one.

```sql
UPDATE products SET quantity = quantity - 1 WHERE name = 'Mug';
```

In a traditional locking system, T3 would have to acquire a lock on the 'Mug' row (or page, or table). In Turso's MVCC engine, it does something different:

1. It finds the current valid version of the 'Mug' row, which is `V1`
2. It marks the old version (`V1`) as no longer being the latest by updating its `End` metadata. The `End` is set to `T3`, indicating that transaction T3 made this version obsolete
3. It creates a **new version** of the row, `V2`, with the updated data. This new version gets its own metadata

The version history for the 'Mug' row now looks like this:

- **Mug row `V1`:** `(name: 'Mug', quantity: 100)`, `(Begin: T1, End: T3)`
- **Mug row `V2`:** `(name: 'Mug', quantity: 99)`, `(Begin: T3, End: ∞)`

![Visualization of row versioning showing the original version V1 with its End value set to T3, while a new version V2 is created with Begin: T3 and End: ∞](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b97e0c43-2328-4d2a-1742-3e3e8b2dbc00/orig =1920x1080)

This is the core of the "time machine" concept. The database now holds a history of the 'Mug' row. Any new transaction starting after T3 will see `V2` as the correct version. Any long-running transaction that started before T3 would still see `V1`, ensuring a consistent view of the database. This entire update happened without needing an exclusive lock, allowing other transactions to proceed in parallel. Eventually, a background process called garbage collection will clean up old, no-longer-visible versions like `V1` to reclaim memory.

## Performance gains and current limitations

This sophisticated architecture results in dramatic performance improvements for write-heavy workloads.

### Benchmarking Turso vs. SQLite

Benchmarks comparing Turso's Rust implementation with standard SQLite show striking results. As you add more concurrent writer threads, SQLite's throughput remains flat at around 150,000 rows per second due to its single-writer limitation. In contrast, Turso's throughput scales significantly. With four threads, it achieves a throughput of nearly **200,000 rows per second**, demonstrating the power of true concurrent writes.

![Performance benchmark graph plotting throughput (rows/second) against compute time, showing SQLite's flat performance while Turso's performance scales upwards with 2 and 4 threads](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/78ec6548-3e23-4671-ba4d-a90f53822500/lg2x =1920x1080)

### Understanding the trade-offs

As with any engineering solution, this performance comes with trade-offs. Turso's MVCC feature is still experimental, and the team is actively working on optimizing it. The current implementation has a few notable drawbacks:

**Memory consumption:** The current engine stores complete copies of the entire row for each new version. If you have very wide tables (many columns) that are updated frequently, this can lead to high memory usage, as many full copies of the row will be held in memory until garbage collection cleans them up. Future optimizations may involve storing only the differences (deltas) between versions to reduce this overhead.

**Version vector contention:** Row version management is handled by a central data structure called a "version vector." To maintain consistency, this vector is protected by a read-write lock. This means that while transactions can execute their logic in parallel, the final step of registering a new version in this vector is serialized. All writers must briefly queue up to acquire a write lock on this vector. On machines with a very high number of cores all performing rapid writes, this central lock can become a point of contention, limiting perfect linear scalability.

![Illustration of the version management bottleneck showing writers waiting in a queue to get a lock on the central Version Vector](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7c5173b4-44b0-4a5e-da73-a7ebb4061700/lg1x =1920x1080)

### Experimental feature status

This powerful concurrent write feature is **still experimental**. It is not yet recommended for production workloads. It exists for the community to test, benchmark, and provide feedback on. The Turso team is using this early feedback to identify and resolve difficult engineering challenges, like the ones mentioned above, before releasing a production-ready version.

## Using Turso's concurrent writes

If you want to experiment with this technology yourself, you can do so using the Turso CLI. You'll need to explicitly enable the feature using a flag.

First, install the command-line tool for interacting with Turso and `libSQL`. You can find the instructions on the [official Turso website](https://docs.turso.tech/cli/installation).

To create a local `libSQL` database with the experimental MVCC engine enabled, run:

```command
turso db create my-concurrent-db --experimental-mvcc
```

Or, when running a local database shell:

```command
turso dev --experimental-mvcc
```

Within your application code or shell, you can now use the `BEGIN CONCURRENT` syntax to initiate transactions that will leverage the new MVCC backend, allowing for parallel commits without the page-level conflicts of standard SQLite.

## Final thoughts

**Turso’s project to rewrite SQLite in Rust and add Multi-Version Concurrency Control is a big step forward for the database world.** It takes the most widely used database, known for its simplicity and reliability, and upgrades it for modern, highly concurrent applications. By tackling the long-standing single-writer limitation, Turso and the `libSQL` community open the door for SQLite to be used in many more scenarios, from high-throughput API backends to large data ingestion systems.

At the same time, MVCC support is still experimental and comes with known limitations that need to be addressed. Even so, the early performance results are very encouraging. **This work is more than just an optimization, it is a rethink of what an embedded database can be.** By combining SQLite’s elegant design with Rust’s safety and the proven benefits of MVCC, this project could blur the line between simple embedded databases and full client/server systems and change how you think about using SQLite in the future.
