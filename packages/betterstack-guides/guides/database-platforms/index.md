# What is PocketBase? Features, Limitations, and Use Cases

In the world of web development, the siren song of the cloud is undeniable. Platforms like AWS, Google Cloud, and Azure offer a seemingly infinite array of services that promise scalability, reliability, and ease of use. However, as many developers and companies have discovered (including high-profile figures like DHH of Basecamp), this convenience often comes with a significant and sometimes unpredictable price tag. **The trend of cloud repatriation, moving services from large cloud providers back to self-hosted infrastructure, is gaining momentum.**

This is where PocketBase enters the picture. **PocketBase is a powerful, open-source backend-as-a-service (BaaS) that helps you build robust applications without breaking the bank.** It presents itself as a lightweight yet feature-rich alternative to platforms like Supabase or Firebase, bundling a real-time database, user authentication, file storage, and an intuitive admin dashboard into a single, portable executable file.

**This guide takes a comprehensive look at PocketBase, exploring its core philosophy and features, deployment options, and practical applications.** 

It also covers data management, user authentication, advanced configuration through its admin UI, and its limitations to help you understand when PocketBase is the perfect choice and when you might need to consider a different solution.


## What is PocketBase?

At its heart, PocketBase is an open-source backend solution that drastically simplifies the process of building a backend for your applications. It's written in the Go programming language, which is known for its performance and efficiency. The most remarkable feature (the one that defines its identity) is that the entire system, the API server, the admin dashboard, and the database logic, is compiled into a **single executable file**. This makes deployment and management incredibly straightforward. You don't need to juggle multiple services, complex container orchestrations, or convoluted configuration files to get started.

![A screenshot of the PocketBase homepage highlighting its key features: "Open Source backend in 1 file" with checkboxes for Realtime database, Authentication, File storage, and Admin dashboard.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0afa63d3-baf8-47ec-69d7-656cd67fdc00/md2x =1920x1080)

### Core features

PocketBase isn't just simple, it's also packed with the essential features most modern applications require:

**Embedded realtime database:** PocketBase uses an embedded SQLite database. This means your data is stored in a simple `.db` file right alongside the executable. It's not just a standard database, though. It includes real-time subscription capabilities, which allows your frontend application to listen for changes in the database (create, update, delete) and automatically update the UI without needing to poll the server constantly.

**User authentication:** Out of the box, PocketBase provides a complete and secure authentication system. You can manage users via email/password, and it also supports easy integration with OAuth2 providers like Google, Facebook, GitHub, and more.

**File storage:** PocketBase has built-in file storage for handling user uploads like profile pictures or documents. You can store files on the local filesystem or easily configure it to use any S3-compatible object storage service for more scalable solutions.

**Intuitive admin dashboard:** One of the standout features is the beautiful and user-friendly admin dashboard that comes built-in. There's no separate application to install or configure. Simply start the PocketBase server and navigate to the admin URL in your browser. From here, you can manage your data collections, users, files, and application settings through a clean graphical interface.

**Extensible with hooks:** While PocketBase provides a solid foundation, you can extend its functionality using Go or JavaScript hooks. This allows you to intercept application events (like before a record is created or after a user authenticates) to run custom business logic, send custom emails, or integrate with other services.

### The power of simplicity: Go, SQLite, and a single binary

The architectural choices made by the PocketBase developers are key to its appeal.

**Why Go?** Go is a statically typed, compiled language that produces highly performant, self-contained binaries. This means PocketBase is fast, efficient in its use of server resources (CPU and memory), and incredibly easy to distribute. There are no language runtimes or dependencies to install on your server, just the single executable file.

**Why SQLite?** The decision to use SQLite is fundamental to PocketBase's philosophy. SQLite is the most widely deployed database engine in the world, famous for its reliability, simplicity, and zero-configuration nature. By embedding it directly, PocketBase eliminates the need to set up, configure, and maintain a separate database server (like PostgreSQL or MySQL). This dramatically lowers the barrier to entry and simplifies the entire stack. However, this choice also informs the platform's primary limitations regarding large-scale applications.

This combination results in a backend that is portable, fast, and exceptionally easy to get started with, making it an ideal choice for indie hackers, startups, prototypes, and small-to-medium-sized projects.

## Setting up a PocketBase instance

One of the most attractive aspects of PocketBase is the freedom it gives you in terms of hosting. You aren't locked into a specific provider. You can run it on a cheap Virtual Private Server (VPS), a home server, or even your local machine.

### Choosing your hosting environment

**Self-hosting on a VPS (recommended for control and cost):** This is the most common and cost-effective approach. Providers like Hetzner, DigitalOcean, or Vultr offer small Linux VPS instances for just a few dollars a month. This gives you full control over your environment and allows you to achieve the significant cost savings that motivate the move away from larger cloud providers.

**Using a managed service (PocketHost):** If you want the benefits of PocketBase without managing a server, you can use an unofficial managed hosting service like PocketHost. This is a great option if you want to get started quickly and prefer a "platform-as-a-service" experience, though it comes at a slightly higher cost than a bare VPS.

The self-hosting approach on a standard Ubuntu VPS aligns best with the goal of maximizing control and minimizing costs.

### Deployment on a Linux VPS

Here's how PocketBase deployment works on a fresh Ubuntu server. These steps are generic and should work on most Linux distributions with minor adjustments.

**Prepare your server:** First, connect to your VPS via SSH. It's always good practice to update and upgrade your server's packages to ensure everything is secure and up-to-date:

```command
sudo apt update && sudo apt upgrade -y
```

**Download PocketBase:** Next, download the latest version of PocketBase. Go to the official PocketBase website or its GitHub releases page and find the download link for the latest Linux AMD64 build. Use the `wget` command to download the ZIP file directly to your server:

```command
wget https://github.com/pocketbase/pocketbase/releases/download/v0.X.Y/pocketbase_0.X.Y_linux_amd64.zip
```

You'll also need the `unzip` utility to extract the file. If it's not installed, you can install it:

```command
sudo apt install unzip
```

Now, unzip the downloaded file:

```command
unzip pocketbase_0.X.Y_linux_amd64.zip
```

This extracts a single executable file named `pocketbase`. You can move this file to a more standard location, like `/usr/local/bin`, to make it accessible system-wide:

```command
sudo mv pocketbase /usr/local/bin/
```

**Start the PocketBase server:** You can now start the server with a single command. It's good practice to create a dedicated directory to store your PocketBase data:

```command
mkdir -p /opt/pocketbase_data
```

```command
pocketbase serve --http="0.0.0.0:8090" --dir="/opt/pocketbase_data/"
```

The `--http="0.0.0.0:8090"` flag tells PocketBase to listen for connections on all network interfaces on port `8090`. The `--dir` flag specifies where to store the database file and other data.

Upon first run, PocketBase will prompt you to create an admin account. You'll see URLs for the API and the Admin UI in your terminal. You can access the Admin UI by navigating to `http://YOUR_SERVER_IP:8090/_/` in your browser.

**Running PocketBase as a service (production setup):** Running the server directly in your terminal is fine for testing, but for a production application, you want it to run continuously in the background and restart automatically if it crashes or the server reboots. This can be achieved using `systemd`.

Create a service file for PocketBase:

```command
sudo nano /etc/systemd/system/pocketbase.service
```

Add the following configuration into the file (be sure to replace `/usr/local/bin/pocketbase` and `/opt/pocketbase_data` with your actual paths if you chose different locations):

```ini
[label /etc/systemd/system/pocketbase.service]
[Unit]
Description = PocketBase Server

[Service]
Type = simple
User = root
ExecStart = /usr/local/bin/pocketbase serve --http="0.0.0.0:8090" --dir="/opt/pocketbase_data/"
Restart = always
RestartSec = 5s

[Install]
WantedBy = multi-user.target
```

Now, reload the `systemd` daemon, enable the service to start on boot, and start it immediately:

```command
sudo systemctl daemon-reload
```

```command
sudo systemctl enable pocketbase.service
```

```command
sudo systemctl start pocketbase.service
```

You can check the status of your service with `sudo systemctl status pocketbase.service`. Your PocketBase instance is now running as a robust background service.

## Working with PocketBase

With a PocketBase instance deployed, here's how it works in practice using the Admin Dashboard to set up data structure and the JavaScript SDK to interact with it.

### Creating a data collection

In PocketBase, a "Collection" is equivalent to a table in a traditional SQL database. Here's an example of a simple `posts` collection for a blog.

Navigate to your Admin Dashboard at `http://YOUR_SERVER_IP:8090/_/` and log in. In the left-hand sidebar, click the **Collections** icon and then the **+ New collection** button.

A **New collection** panel will appear. Here's how it can be configured:

- **Name:** Enter `posts`
- **Fields:** By default, you have `id`, `created`, and `updated`. Click **+ New field** to add custom fields:
  - **Type:** `text`, **Name:** `title`
  - **Type:** `editor`, **Name:** `content` (The editor type provides a rich text editor)
  - **Type:** `bool`, **Name:** `published`

Switch to the **API Rules** tab. For testing purposes, you can set the **List/Search Rule** and **View Rule** to be public by removing the default rule and leaving the fields blank. This allows anyone to read the posts. Keep the other rules (Create, Update, Delete) as **Admins only** for now.

Click the **Create** button. Your collection is now ready.

![The PocketBase admin UI showing the "New collection" creation modal, where the user is adding fields like title, content, and published.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b5ac87d-cb2a-4366-71c1-6357b5335600/orig =1920x1080)

To add sample data, select your new `posts` collection, click **+ New record**, fill in a title and some content, and click **Create**.

### Interacting with data via the JavaScript SDK

PocketBase provides official SDKs for JavaScript and Dart, making it easy to connect from a web or mobile frontend. Here's how to fetch posts using the JavaScript SDK.

**Installation:** In your frontend project (for example, a simple Node.js script or a React/Vue app), install the PocketBase client:

```command
npm install pocketbase
```

**Connecting and fetching data:** This script initializes the client, connects to a self-hosted instance, and fetches all records from the `posts` collection:

```javascript
[label index.js]
import PocketBase from "pocketbase";

// Initialize the client
const pb = new PocketBase("http://YOUR_SERVER_IP:8090");

async function getPosts() {
  try {
    // Fetch a paginated list of records from the "posts" collection
[highlight]
    const resultList = await pb.collection("posts").getList(1, 50, {
      filter: "published = true", // Optional: only fetch published posts
    });
[/highlight]

    console.log("Successfully fetched posts:");
    console.log(JSON.stringify(resultList, null, 2));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

getPosts();
```

![A code editor displaying a JavaScript snippet for connecting to a PocketBase instance and fetching data from a collection.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/27482ddf-b4a8-43ec-fa6b-f230cd980700/public =1920x1080)

When you run this script, you'll see the post data you created in the admin dashboard printed to your console in JSON format.

### Implementing user authentication

Here's how the authentication flow works. This example programmatically creates a new user, authenticates with their credentials, and verifies the session.

**Create a new user:** The `users` collection is automatically created by PocketBase. You can add a new user to it:

```javascript
[label auth.js]
import PocketBase from "pocketbase";

const pb = new PocketBase("http://YOUR_SERVER_IP:8090");

async function registerAndLogin() {
  try {
[highlight]
    // 1. Create a new user
    const newUser = await pb.collection("users").create({
      email: "test@example.com",
      emailVisibility: true,
      password: "aSecurePassword123",
      passwordConfirm: "aSecurePassword123",
      name: "Test User",
    });
[/highlight]
    console.log("User created successfully:", newUser.email);

[highlight]
    // 2. Authenticate (log in) with the new user's credentials
    const authData = await pb
      .collection("users")
      .authWithPassword("test@example.com", "aSecurePassword123");
[/highlight]
    console.log("Authentication successful!");

    // 3. Verify the authentication state
    console.log("Is the user authenticated?", pb.authStore.isValid);
    console.log("Auth token:", pb.authStore.token);

    // 4. Log the user out
    pb.authStore.clear();
    console.log("User logged out. Is authenticated?", pb.authStore.isValid);
  } catch (error) {
    console.error("Authentication process failed:", error);
  }
}

registerAndLogin();
```

![A code editor showing the JavaScript code for creating a new user with `pb.collection('users').create({...})`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/07376c82-525d-40d3-e6c2-9d74e6160c00/lg2x =1920x1080)

When you run this code, you'll see the logs for each step: user creation, successful authentication, the valid auth state with a JWT token, and finally, the logged-out state. If you check your Admin Dashboard, you'll see the new user in the `users` collection.

## Navigating the admin dashboard

The Admin Dashboard is more than just a data viewer, it's a powerful configuration tool.

**Configuring authentication:** In the `users` collection settings, under the **Options** tab, you can enable or disable various authentication methods. You can easily toggle OAuth2 providers, set up Multi-factor Authentication (MFA), and customize the email templates for verification and password resets.

**Mail settings:** In the main **Settings** panel, you can configure an SMTP server. This is essential for sending verification emails, password resets, and any other transactional emails your application needs.

**File storage:** Under **Settings > Files storage**, you can switch from the default local file system to an S3-compatible service. You just need to provide your bucket details and credentials.

![The "Files storage" settings page in the admin dashboard, showing the toggle to enable S3 storage and the corresponding input fields for endpoint, bucket, and keys.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e64753d-1101-4bab-3502-91b4cbbc7100/md1x =1920x1080)

**Logs:** The **Logs** section provides a real-time view of API requests, showing the endpoint, status code, and response time. This is invaluable for debugging and monitoring your application's activity.

## Understanding PocketBase's limitations

While PocketBase is an exceptional tool, it's crucial to understand its design limitations to know if it's the right fit for your project.

### The SQLite scalability conundrum

The primary limitation of PocketBase stems from its greatest strength: the use of a single, embedded SQLite database file.

**No horizontal scaling:** SQLite is a serverless, file-based database. This architecture is not designed for horizontal scaling, which is the practice of distributing a single database across multiple servers. You cannot easily "shard" your data or run a multi-node, high-availability cluster with PocketBase. This means all write operations must go through a single server instance.

**Best for single-server deployments:** PocketBase excels in a single-server environment. You can certainly scale vertically by moving your instance to a more powerful server with more CPU, RAM, and faster storage. However, for applications that anticipate massive concurrent write loads or require a distributed database architecture for global low-latency, PocketBase is not the ideal solution.

![A diagram showing a PocketBase instance connected to multiple separate SQLite databases, with a red "X" over it, visually explaining that this type of horizontal scaling is not supported.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/953a93c3-d727-4bf9-5302-26690f122f00/orig =1920x1080)

A rule of thumb: PocketBase is a fantastic choice for projects with up to around **10,000 users**, such as side projects, internal tools, MVPs, and prototypes. For applications aiming for millions of users, a solution built on a scalable database like PostgreSQL is more appropriate.

### PocketBase vs. Supabase vs. Appwrite

**Supabase and Appwrite:** These are more feature-heavy alternatives. They are typically built on a stack involving PostgreSQL and Docker, allowing for greater scalability. They offer more advanced, out-of-the-box features like Edge Functions (Supabase) for running logic at the edge, built-in vector database support for AI applications, and more complex cloud function environments.

**PocketBase:** Its advantage is simplicity, performance on a single node, and ultimate portability. The feature set is intentionally focused and lean. For 80% of common application needs, PocketBase provides everything required without the complexity and overhead of its larger counterparts.

## Final thoughts

PocketBase has carved out a niche in the backend-as-a-service landscape by prioritizing simplicity over complexity. **It bundles the core backend pieces, including a real-time database and auth, into a single high-performance binary**, which makes it fast and affordable to get projects off the ground.

Self-hosting on cheap VPSs or commodity hardware lets developers avoid high managed cloud costs while keeping full control over data and infrastructure. **Its SQLite based design works best for apps that can live happily on a single server**, rather than massive, globally distributed systems that need complex scaling.

For solo developers, small teams, startups, MVPs, and side projects, **PocketBase is an excellent choice if you care about simplicity, speed, cost-effectiveness, and control.**