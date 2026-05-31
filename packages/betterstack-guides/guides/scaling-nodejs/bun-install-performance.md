# Why bun install Is So Fast?

In JavaScript development, performance matters. Developers are always looking for tools that can speed up their workflows, reduce build times, and make development faster. For years, package managers like npm, Yarn, and pnpm have been the standard, but a new tool has emerged that's significantly faster. That tool is Bun.

Bun is an all-in-one JavaScript toolkit that includes a runtime, bundler, test runner, and a very fast package manager. When it comes to installing packages, the difference isn't just a little bit faster, it's dramatically faster. **Benchmarks show `bun install` can be over 7 times faster than npm and 17 times faster than Yarn**. For a long time, the specific techniques behind this speed were hidden in the source code. However, the Bun team recently published a detailed blog post explaining how they did it.

This article breaks down the core systems programming principles that make `bun install` incredibly fast. You'll learn about the low-level mechanics of file systems, memory management, and CPU architecture.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/rdomc8BxoSc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



## How traditional package managers work

Before looking at Bun's improvements, you need to understand how package managers like npm, Yarn, and pnpm work. While they each have unique features, they all follow a similar multi-step process that has several performance bottlenecks.

![A high-level flowchart illustrating the complex, multi-step process of a traditional package manager installing a dependency like React.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/659b150a-208f-47e3-f6e4-051a71777600/public =1920x1080)

When you type `npm i react` into your terminal, here's what happens behind the scenes.

The package manager starts by reading your project's `package.json` file to identify the dependencies you've requested. Then it reads the lockfile (like `package-lock.json` or `yarn.lock`). This file contains the exact versions of every dependency and sub-dependency that should be installed, which ensures consistent builds across different machines.

Next, the manager scans your `node_modules` directory to see which packages are already installed and whether their versions match what the lockfile requires. Then comes dependency resolution, where the package manager builds a complete dependency tree. It compares the requirements from `package.json`, the state of the lockfile, and what's in `node_modules` to figure out exactly what needs to be added, updated, or removed.

For packages that need to be downloaded, the manager makes network requests to a package registry like npm. It first fetches "manifests," which are small JSON files containing metadata about a package, including its dependencies and where to download the code. After getting the manifest, it downloads the actual package code, which comes as a compressed `.tgz` file called a tarball.

The downloaded tarballs are then decompressed and extracted into a global cache on your machine. This prevents re-downloading the same package version for different projects. Finally, the package manager copies or links the necessary files from the global cache into your project's `node_modules` directory. The last step is updating the lockfile to reflect the new state of `node_modules`.

Each of these steps presents an opportunity for optimization. Traditional package managers are mostly written in JavaScript and run on Node.js, which limits their performance. Bun reimagines this entire process from a systems programming perspective, tackling each bottleneck with low-level, performance-focused solutions.

## How Bun reduces system calls

The biggest source of slowness in traditional package installation is the huge number of system calls. To understand why this matters, you need to know how operating systems work.

### System calls and context switching

Modern operating systems have two main modes: user mode is where your applications run, like your code editor or package manager. It's a restricted environment that prevents applications from interfering with the core system. Kernel mode is where the operating system's kernel runs with full access to hardware, memory, and system resources.

When an application in user mode needs to do something like read a file from disk or send data over the network, it can't do it directly. It has to ask the kernel to do it. This request is called a system call.

![An animation visualizing the CPU switching from User Mode to Kernel Mode to handle a system call, highlighting the context switch overhead.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4f654543-5197-4d61-d7b2-6efcbe355900/md1x =1920x1080)

Switching from user mode to kernel mode and back is called a context switch. During this switch, the CPU has to save the entire state of the current program, perform the kernel operation, and then restore the program's state. A single context switch takes only a tiny fraction of time, but installing a typical JavaScript project can trigger hundreds of thousands or even millions of them. This adds up to a lot of wasted time where the CPU is doing administrative work instead of useful work.

### The Node.js overhead

Package managers like npm and Yarn are written in JavaScript and run on Node.js. Node.js uses a C library called `libuv` to handle file operations. This creates multiple layers between the package manager's code and the operating system's kernel.

For a simple operation like reading `package.json`, here's what happens:

1.  Your JavaScript code calls `fs.readFile()`.
2.  The V8 JavaScript engine validates arguments and may need to convert strings from its internal format (UTF-16) to what `libuv` expects (UTF-8).
3.  Node.js passes the request to the `libuv` thread pool.
4.  A worker thread in `libuv` picks up the request and makes the actual `read()` system call to the kernel.
5.  The kernel performs the context switch, reads the file from disk, and returns the data.
6.  The `libuv` worker thread pushes the data back to the JavaScript main thread through the event loop.

This complex pipeline adds significant overhead to every file operation. When you're installing a project with thousands of files in `node_modules`, this overhead becomes a major bottleneck.

### How Bun avoids this overhead

Bun avoids this problem because its package manager is written in Zig, a low-level systems programming language. Code written in Zig compiles directly to highly optimized native machine code.

This means Bun doesn't have the overhead of a JavaScript runtime or an abstraction layer like `libuv`. When Bun needs to read a file, it can make a direct system call to the operating system kernel. This eliminates the string conversions, thread pool handoffs, and event loop communication, making file operations much faster.

![A terminal output showing the System Call Efficiency benchmark, comparing the low number of syscalls used by bun install versus the much higher counts for pnpm, npm, and yarn.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/920f933d-9d94-49a3-cdf5-44a632170c00/public =1920x1080)

The benchmarks show the difference clearly. An installation that makes npm perform nearly 1 million system calls only makes Bun perform around 165,000. By treating package installation as a systems programming problem rather than a JavaScript problem, Bun achieves efficiency that other tools can't match.

## Cache-friendly data structures

The next major bottleneck Bun addresses is parsing metadata, specifically the lockfile. This is where Bun's smart use of data structures gives it a big advantage. Understanding this requires knowing how modern CPUs handle memory.

### Why JSON parsing is slow

Traditional package managers store their lockfiles in human-readable text formats like JSON (`package-lock.json`) or YAML-like formats (`yarn.lock`). While these are easy for humans to read, they're inefficient for computers.

When a program parses a JSON file, it creates objects in memory for each JSON object it encounters. The memory allocator assigns memory for these objects wherever it finds free space. This means logically related data ends up scattered all over RAM. For example, the metadata for one dependency might be in one memory location, while the metadata for its own dependency could be somewhere completely different.

![A diagram showing how pointers connect different objects in memory that are physically located far apart, illustrating the pointer-chasing problem of scattered data.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b5703eb-3048-4043-c7aa-69d936b8a800/orig =1920x1080)

This scattered allocation forces the CPU to perform "pointer-chasing," jumping from one memory address to another to piece together the full dependency graph. This is very inefficient because of how CPU caching works.

### How CPU caches work

CPUs don't read data from your main RAM one byte at a time because that would be too slow. Instead, they have small, very fast memory caches (L1, L2, L3) built into the chip. When the CPU needs data from RAM, it fetches it in fixed-size chunks called cache lines, which are typically 64 bytes.

![A powerful animation comparing cache line efficiency. Bun's sequential data fills the cache line with 100% useful data, while scattered JSON objects result in a cache line that is mostly empty, wasted space (25% efficiency).](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cc4055ef-5b79-4421-1c88-70ea08b29500/orig =1920x1080)

Here's the problem with scattered data. If your program needs an 8-byte piece of data like a memory address, the CPU still has to fetch a full 64-byte cache line from RAM. If the next piece of related data is in a different location, the CPU has to do another slow fetch for another 64-byte line. In this case, 56 out of the 64 bytes you fetched (87.5% of the work) were completely useless. This is called a cache miss, and it's a major cause of poor performance.

### Bun's Structure of Arrays approach

Bun solves this by using a completely different data layout for its lockfile (`bun.lockb`). Instead of a text-based JSON file, it uses a binary file that stores data using a Structure of Arrays (SoA) layout.

In a traditional "Array of Structures" (AoS) layout, you have an array where each element is an object containing a package's name, version, and dependencies:

```javascript
// Traditional AoS (Array of Structures) - Leads to scattered memory
const packages = [
  { name: "react", version: "18.2.0", deps: [...] },
  { name: "next",  version: "13.4.0", deps: [...] }
];
```

In Bun's SoA layout, this gets flipped around. It has separate, continuous arrays for each piece of data:

```text
// Bun's SoA (Structure of Arrays) - Cache-friendly
const package_names = ["react", "next", ...];
const package_versions = ["18.2.0", "13.4.0", ...];
const package_deps = [[...], [...], ...];
```

This means all package names are stored next to each other in memory, all versions are next to each other, and so on. When Bun's parser processes package names and the CPU fetches a 64-byte cache line, that line is filled almost entirely with other package names that it will need soon. This results in much better cache utilization, dramatically reducing cache misses and allowing the CPU to process metadata at maximum speed.

## Smarter decompression

The final key optimization relates to how Bun handles downloaded package tarballs. Traditional package managers use a streaming approach that sounds efficient but actually creates a lot of wasted work.

### The problem with streaming decompression

When a package manager downloads a tarball, it often starts decompressing it as the data comes in from the network. The problem is that it doesn't know the final, uncompressed size beforehand.

So it starts by allocating a small, fixed-size chunk of memory called a buffer (like 64KB). It decompresses data into this buffer until it's full. Then what?

1.  It allocates a new, larger buffer (like 128KB).
2.  It copies all the data from the old 64KB buffer into the new one.
3.  It continues decompressing into the new buffer until that's full too.
4.  This cycle of allocating a larger buffer and copying all the previous data repeats until the entire file is decompressed.

![A clear visualization of the buffer reallocation process, showing data being copied from a smaller, full buffer to a newly allocated, larger one, a process that repeats multiple times.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c1bd84ea-3adc-4bd9-f2d6-478bdd10a900/md1x =1920x1080)

For a 1MB package, this process can result in nearly 960KB of data being copied unnecessarily, sometimes copying the same initial bytes 5 or 6 times. This repeated memory allocation and copying is expensive and slows down every other package manager.

### How Bun decompresses files

Bun's approach is simple but clever. Instead of streaming, it downloads the entire compressed tarball into memory first. Then it uses a feature of the gzip compression format. The last 4 bytes of a gzip file contain a number that represents the total size of the original, uncompressed data.

Bun reads these last 4 bytes to know the exact final size. Then it allocates a single memory buffer of the perfect size in one go. Finally, it decompresses the entire in-memory tarball into this perfectly-sized buffer in a single pass.

![A graphic showing Bun reading the last 4 bytes of a tarball to determine its uncompressed size, then allocating a perfectly sized block of RAM.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e2905429-4340-4bb7-fb8f-040f2d319200/public =1920x1080)

This completely eliminates the cycle of repeated buffer reallocation and copying. On top of that, Bun uses a more optimized decompression library (`libdeflate`) which is significantly faster than the standard `zlib` library used by Node.js. This combination of a smarter algorithm and a faster library makes Bun's tarball extraction very efficient.

## Final thoughts

The speed of `bun install` comes from multiple optimizations at the lowest levels of the system. By stepping outside the JavaScript ecosystem and using systems programming principles, the Bun team has fundamentally reimagined the package installation process.

Here are the three main reasons Bun is so fast. **It reduces system call overhead by being written in Zig**, which compiles to native code and communicates directly with the operating system without the slow abstractions of Node.js and `libuv`. It **uses cache-friendly data structures through a binary lockfile** with a Structure of Arrays layout that arranges data in memory to maximize CPU cache efficiency. 

And it eliminates wasteful copying by determining the final size of a package before decompressing it, avoiding the repeated buffer reallocation that slows down other package managers.