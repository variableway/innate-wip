# Fix Next.js Build Failures on Small Servers with Swap

**Next.js is powerful, but building it on a cheap low-memory server can fail in confusing ways**. On a 1GB RAM VPS, the build can suddenly use all available memory, push CPU to 100%, freeze the machine, and crash without a helpful error.

Many developers assume the server is simply too small and upgrade to a more expensive plan. That works, but it is often unnecessary. **A cheaper fix is to create a swap file**, which gives your server extra “virtual” memory by using disk space when RAM runs out.

In this tutorial, you will learn why Next.js builds need so much memory, how to confirm your server is running out of RAM, what swap is and when it helps, and how to set up a swap file on Ubuntu. By the end, you will be able to build and deploy Next.js apps more reliably on small VPS machines while keeping costs low.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/HU5CV64vLg4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Prerequisites

Before you begin, you'll need an Ubuntu server (this guide uses Ubuntu 24.04, but the commands work similarly for other versions) with SSH access and `sudo` or root privileges.

## The Root of the Problem: Why Do Next.js Builds Crash?

Before you can implement a solution, it's crucial to understand the underlying cause of the problem. The build failures on low-memory servers are not a bug in Next.js or a fault of your cloud provider—they are a direct consequence of the resource-intensive nature of modern web development build tools.

### The deceptively heavy Next.js build process

At first glance, a Next.js build might seem like a simple Node.js process. However, when you run a command like `next build`, the framework orchestrates a complex series of tasks to optimize your application for production.

![Next.js build process diagram](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4fa99813-2cc8-458c-0d4b-f28ca5753100/md1x =1920x1080)

This build process includes several memory-hungry operations that occur in a short, intense burst. First, Next.js spins up multiple worker processes or threads to handle tasks in parallel, and each of these workers consumes its own slice of memory. If you're using TypeScript, the entire project's types need to be loaded into memory for checking and transpilation into JavaScript—for large projects, this can consume a significant amount of RAM.

Next, tools like Webpack or Turbopack work to analyze your entire codebase, resolve dependencies, and bundle them into optimized chunks for both the client (browser) and the server (Node.js). This process involves creating an in-memory graph of all your modules, which can be very large. Finally, Next.js's built-in image optimization processes image files, which can be a resource-heavy task, especially if your project contains many high-resolution images.

All of these tasks happening concurrently create a massive, albeit temporary, spike in memory demand. Your 1GB RAM server, which might be perfectly adequate for running the final, built application, is often not equipped to handle this intense build-time burst.

### The Out-of-Memory (OOM) Killer: your server's last resort

So what exactly happens when the Next.js build process demands more RAM than is physically available on your server? Linux-based operating systems have a built-in mechanism to handle this scenario called the **Out-of-Memory (OOM) Killer**.

When your system's physical memory is exhausted and it can no longer allocate more, the kernel is faced with a critical choice to prevent a complete system crash. It can either freeze entirely, becoming unresponsive, or it can start terminating processes to free up memory. The OOM Killer is the part of the kernel that chooses the latter. It scans all running processes, assigns each one a "badness" score based on factors like memory usage and priority, and then forcefully terminates the process with the highest score.

In your scenario, the Next.js build process is the primary consumer of memory, making it the prime target for the OOM Killer. This is why you often see your build process abruptly stop with a simple "Killed" message in the terminal, without any detailed error log from Next.js itself. The process didn't crash due to an error in its code—it was terminated by the operating system. This is also why you see CPU usage graphs spike and flatline: your system is spending all its resources trying to manage memory before ultimately giving up and killing the offending process.

## The Solution: Understanding and Implementing Swap Space

Now that you understand the problem, you can implement the solution. A swap file provides your system with an "escape route" when physical RAM is full, preventing the OOM Killer from being invoked.

### What is a swap file? Your server's safety net

A swap file is a dedicated file on your server's hard drive (or SSD) that the operating system can use as virtual memory. Think of it as a temporary extension of your physical RAM. When your RAM starts to fill up, your system can move less-frequently used data from the fast, volatile RAM to the slower, persistent disk storage inside the swap file.

![Swap file animation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1abe863d-7aaa-49c2-9b7b-f0e907bafe00/md1x =1920x1080)

This action, known as "swapping out," frees up physical RAM for more active processes that need it immediately, such as your resource-intensive Next.js build. When your system needs the data that was moved to the disk, it "swaps it in" back to RAM.

### How does swap work? Trading speed for stability

It's important to understand that swap space is not a magic bullet or a true replacement for physical RAM. Accessing data from a disk is orders of magnitude slower than accessing it from RAM. This means that when your system is actively using swap (a condition sometimes called "thrashing"), overall performance will decrease.

However, for your specific use case—a temporary memory spike during a build process—this trade-off is perfectly acceptable. Your goal isn't to run the build at maximum speed; your goal is to provide enough breathing room for the build to complete successfully without crashing. A slightly slower build that finishes is infinitely better than a fast build that gets killed halfway through. The swap file acts as a stability-ensuring safety net, allowing the build process to weather the temporary memory storm.

## When to Use Swap (and When Not To)

Swap is a powerful tool, but it's essential to know when it's the right solution and when it's just masking a deeper problem.

### Ideal scenarios for using a swap file

Swap is most effective for applications or processes that have a low, steady memory footprint during normal operation but experience occasional, predictable spikes in memory usage.

![Swap file use cases](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7eff3f36-5b1a-4b62-829f-436b233c1600/md2x =1920x1080)

Build steps are the prime use case for Next.js deployments on small servers, but swap is equally valuable for other scenarios. Running `npm install`, `pnpm i`, or `yarn` can sometimes consume a surprising amount of memory, especially in large projects with many dependencies. One-off scripts that import large amounts of data into a database can cause a temporary memory spike, as can occasional administrative tasks or cron jobs that process a lot of data. Some containerized applications may require extra memory headroom just during the initial startup or deployment phase.

In all these cases, your primary goal is stability and successful completion of a temporary task, making swap an ideal solution.

### Warning signs: when swap is a band-aid, not a fix

You should not rely on swap as a long-term solution for an application that consistently requires more memory than your server has. If your main production application is constantly dipping into swap during normal traffic, you will experience noticeable performance degradation.

![When not to use swap](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/59fe2f4c-1912-4114-2421-8972bf8d1c00/orig =1920x1080)

Several signs indicate you need to upgrade your server's RAM or optimize your application rather than relying on swap. If you check `free -h` when your server is not under load and still see significant swap usage, it means your baseline memory requirement is too high for your physical RAM. Databases heavily rely on caching data in RAM for performance—if your database server starts swapping its cache to disk, query performance will plummet. If users are complaining about slow response times and you see constant swap activity, the swapping process is likely the bottleneck.

Remember, swap is for short memory bursts, not for fixing chronic memory shortages.

## Step 1 — Checking for existing swap space

First, you need to verify if your system already has a swap file configured. Most cloud providers do not enable swap by default on their smaller instances.

Run the following command to see a summary of active swap devices:

```command
sudo swapon --show
```

If this command returns no output, it means there is no active swap file.

You can also use the `free` command for a more detailed view of memory usage:

```command
free -h
```

The `-h` flag makes the output human-readable (in MB or GB). Look at the `Swap` line. If the `total` column shows `0B`, you have no swap space.

```text
[output]
              total        used        free      shared  buff/cache   available
Mem:           981Mi       234Mi       123Mi       1.0Mi       623Mi       601Mi
Swap:            0B          0B          0B
```

## Step 2 — Verifying available disk space

A swap file resides on your disk, so you need to ensure you have enough free space to create one.

Check your disk usage with the `df` (disk free) command:

```command
df -h
```

Look at the line for your main partition (usually `/dev/vda1` or similar) and check the `Avail` column. Make sure you have more than enough space for the swap file you intend to create. A good rule of thumb for a 1GB RAM server is to create a 1GB or 2GB swap file.

```text
[output]
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        25G  3.2G   21G  14% /
```

## Step 3 — Creating the swap file with `fallocate`

Now you'll create the file that will be used for swap. The `fallocate` command is the most efficient way to do this as it instantly allocates a file of a pre-determined size.

Create a 2GB swap file in the root directory (`/`) named `swapfile`:

```command
sudo fallocate -l 2G /swapfile
```

The `fallocate` command allocates disk space, the `-l 2G` flag specifies the length (size) of the file as 2 Gigabytes, and `/swapfile` is the path and name of the file to create.

Verify that the file was created correctly:

```command
ls -lh /swapfile
```

You should see output confirming the file `/swapfile` exists and is 2.0G in size:

```text
[output]
-rw-r--r-- 1 root root 2.0G Dec 15 10:23 /swapfile
```

## Step 4 — Securing the swap file with `chmod`

For security reasons, the swap file should only be readable and writable by the root user. If other users can read it, they could potentially access sensitive information that has been swapped out of memory.

Update the file permissions using the `chmod` command:

```command
sudo chmod 600 /swapfile
```

The `600` permission code grants read and write access only to the file owner (root) and no permissions to anyone else.

Verify the new permissions:

```command
ls -lh /swapfile
```

The permission string at the beginning of the output should now read `-rw-------`:

```text
[output]
-rw------- 1 root root 2.0G Dec 15 10:23 /swapfile
```

## Step 5 — Setting up the swap area with `mkswap`

You have the file, but your system doesn't know it's intended to be used as swap space yet. You need to format it for swap.

Use the `mkswap` command to set up the file as a Linux swap area:

```command
sudo mkswap /swapfile
```

You'll see output confirming that the swap space has been set up, along with its size and a unique UUID:

```text
[output]
Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
no label, UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Step 6 — Activating the swap file with `swapon`

The swap file is now ready. The final step is to tell your system to start using it.

Enable the swap file with the `swapon` command:

```command
sudo swapon /swapfile
```

Verify that the swap is active:

```command
sudo swapon --show
```

This should now output a line showing your new `/swapfile`:

```text
[output]
NAME      TYPE SIZE USED PRIO
/swapfile file   2G   0B   -2
```

You can also check with the `free` command:

```command
free -h
```

The `Swap` row should now show the total size of your swap file (2.0G):

```text
[output]
              total        used        free      shared  buff/cache   available
Mem:           981Mi       234Mi       123Mi       1.0Mi       623Mi       601Mi
Swap:          2.0Gi         0B       2.0Gi
```

![Active swap file confirmation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/61881371-7c99-450f-12b4-d9471da43000/lg2x =1920x1080)

## Step 7 — Making the swap file permanent

The `swapon` command only enables the swap file for the current session. If you reboot your server, it will not be automatically re-activated. To make this change permanent, you need to add an entry to the `/etc/fstab` file.

First, back up your current `fstab` file just in case something goes wrong:

```command
sudo cp /etc/fstab /etc/fstab.bak
```

Now append the swap file information to the end of the `fstab` file:

```command
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

This line tells your system that `/swapfile` is a swap device and should be mounted on boot.

Your swap file is now fully configured and will persist across reboots.

## Putting It to the Test: Building a Heavy Next.js App

With your swap file in place, let's revisit the original problem: building the Payload CMS project on your 1GB RAM server.

### A note on `max-old-space-size`

Before running the build, there's another crucial adjustment to make. The `package.json` build script for Payload CMS defaults to a Node.js option `--max-old-space-size=8000`, which tries to allocate up to 8GB of memory. This is far too high for your small server.

![Package.json max-old-space-size setting](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e1a18f84-0afc-4cd3-9d93-762892142f00/lg2x =1920x1080)

It's wise to adjust this value to something more reasonable. A value of `2048` (for 2GB) is a good starting point for a system with 1GB of physical RAM and 2GB of swap:

```json
[label package.json]
"scripts": {
  "build": "cross-env NODE_OPTIONS=\"--no-deprecation --max-old-space-size=2048\" next build",
  ...
}
```

### The successful build: analyzing the results

After adding the swap file and adjusting the `package.json` script, run the `pnpm build` command again. This time, the process doesn't crash. While it may take a few minutes as your system utilizes the slower swap space, it ultimately completes successfully.

![Successful build output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c711ebec-fb01-4d72-f532-1a130d0af800/lg1x =1920x1080)

If you examine the CPU usage graph for the successful build, you'll see a stark difference from the crash scenario. Instead of a sharp, unsustainable spike to 100%, the CPU usage is more stable, albeit high, for the duration of the build. Your system is able to manage its resources effectively, using the swap file as a buffer, allowing the build to finish.

## Final Thoughts
In this tutorial, you learned what causes Next.js “out of memory” build crashes on small servers and why they are usually a short-term resource bottleneck, not a reason to immediately upgrade.

A simple, **cheaper fix is to add a wap file**. Swap uses disk space as extra memory. It is slower than RAM, but it gives your system enough breathing room to handle the temporary memory spikes during builds, which can turn a failed deployment into a successful one on low-cost hardware.

**You also learned when swap helps, the trade-offs, and how to set it up step by step on Ubuntu**. Next, monitor swap usage with tools like `htop`, set alerts if it gets too high, and consider tuning settings like “swappiness” for better performance.
