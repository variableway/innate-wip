# React Server Components: DoS and Source Code Leak Vulnerabilities

React Server Components (RSC) can make apps faster and more scalable, but they also introduce new security risks. After a recent critical remote code execution issue in the React ecosystem, researchers found two more vulnerabilities tied to this architecture.

One is a **high-severity Denial of Service (DoS)** that can freeze your server. The other is a **moderate-severity source code exposure** that can leak server-side logic. Both can be triggered with a simple, specially crafted **POST** request.

This tutorial explains how the attacks work in the React Flight protocol, shows how to reproduce them, and covers the official React patches and what you should update to secure your app, including Next.js setups.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/N1Dyym6WH7o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



## Understanding the React Flight Protocol

Before we look into the specifics of each vulnerability, it is important to understand the common thread that connects them: the React Flight protocol. Both the Denial of Service and Source Code Exposure exploits manipulate the way this protocol deserializes data streams on the server. A foundational understanding of this mechanism is key to grasping how these attacks work.

### What is the React Flight Protocol?

React Flight is the technology that powers React Server Components. Its primary role is to provide a standardized, streamable format for serializing a React component tree on the server. This serialized data can then be sent over the network to the client, where it can be deserialized and rendered into the DOM. Unlike traditional JSON, the Flight protocol is specifically designed to handle the complexities of a React tree, including components, props, and even references to server-side functions (Server Actions).

### The Key Mechanism: Chunked Data and References

A core feature of the React Flight protocol is its ability to process data in "chunks." When the server sends a serialized component tree, it doesn't necessarily send it as one monolithic block of data. Instead, it can be streamed as a series of chunks. This is particularly useful for improving perceived performance, as the client can start rendering parts of the page as soon as the first chunks arrive.

To reconstruct the complete data structure from these individual chunks, the protocol uses a special reference notation. When one piece of data needs to refer to another that might be in a different chunk, it uses a special syntax, often involving a `$` prefix.

![A diagram illustrating how the React Flight protocol deserializes chunked data using references to build a final object.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0ee61398-fd86-4729-8c89-3b8fae949800/md2x =1280x720)

Let's consider a simplified example, as explained in the video. Imagine the server wants to send the following object to the client: `{ object: 'fruit', name: 'cherry' }`. Using the Flight protocol, it could send this information in three distinct chunks:

1.  **Chunk 0:** `["$1"]` - This chunk doesn't contain the object itself but a reference, `$1`, which tells the deserializer to look for the actual data in the chunk with ID 1.
2.  **Chunk 1:** `{"object":"fruit", "name":"$2:fruitName"}` - This is the main object structure. However, the value for the `name` key is another reference, `$2`, pointing to chunk with ID 2.
3.  **Chunk 2:** `{"fruitName":"cherry"}` - This final chunk contains the value for the `name`.

When the server receives these chunks, the Flight deserializer follows these references: it starts at Chunk 0, jumps to Chunk 1, sees the reference for `name`, jumps to Chunk 2 to get the value "cherry", and finally assembles the complete, final object: `{ object: 'fruit', name: 'cherry' }`.

This reference system is incredibly powerful and efficient for streaming complex UI structures. However, as we will see, if an attacker can control the contents of these chunks, they can manipulate this reference system to create unintended and dangerous behavior.

## High-Severity Threat: Causing a Denial of Service with a Single Request (CVE-2025-55184)

The first and more severe of the two new vulnerabilities is a Denial of Service (DoS) attack. A DoS attack aims to make a machine or network resource unavailable to its intended users. In this case, an attacker can send a single, tiny POST request that causes the Node.js process running your React/Next.js application to freeze completely, preventing it from handling any legitimate user traffic. This vulnerability is rated as high severity with a CVSS score of 7.5.

![The GitHub Advisory Database entry for the Denial of Service vulnerability, showing affected packages and versions.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/113f3268-749c-438a-479f-6759c4162b00/md1x =1280x720)

### The Attack in Action: Step-by-Step Demonstration

One of the most alarming aspects of this vulnerability is how easy it is to exploit. It doesn't require any special server actions or complex application logic to be present; a default Next.js installation is vulnerable out of the box.

Let's walk through how to replicate this attack.

1.  **Step 1: Set Up a Vulnerable Environment**
    First, you need an application running a vulnerable version of React or Next.js. For instance, a basic Next.js application created with a version prior to the patch (e.g., Next.js 14.0.0) will work. No modifications to the default code are necessary.

2.  **Step 2: Craft the Malicious POST Request**
    Next, you'll need an API client like `cURL`, Postman, or Yaak (as shown in the video) to send a `POST` request to the root of your application (e.g., `http://localhost:3000`). The request must be sent with a `Content-Type` of `multipart/form-data`.

3.  **Step 3: Define the Malicious Payload**
    The body of the request is where the exploit lies. It consists of two simple parts that create a circular reference.

    - Part 1: Key `0`, Value `"$@1"`
    - Part 2: Key `1`, Value `"$@0"`

    This payload instructs the React Flight deserializer that the content of chunk 0 is a reference to chunk 1, and the content of chunk 1 is a reference to chunk 0.

    ![The API client interface showing the two key-value pairs (`0: "$@1"`, `1: "$@0"`) that form the malicious DoS payload.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fbbf7a31-2b84-40a0-1222-b8102759be00/lg2x =1280x720)

4.  **Step 4: Send the Request and Observe the Result**
    When you send this request, you'll notice that the API client never receives a response; it will hang indefinitely in a "connecting" state. If you then try to access your Next.js application in a web browser, the page will fail to load. Any subsequent requests, legitimate or not, will time out. You have successfully caused a Denial of Service. The only way to recover the server is to restart the process.

### The Root Cause: Creating an Infinite Deserialization Loop

This attack works by exploiting the chunk referencing mechanism we discussed earlier. The malicious payload creates a perfect, unbreakable circular dependency.

- The deserializer starts processing the payload and looks at chunk `0`.
- It sees the reference `"$@1"` and dutifully jumps to chunk `1` to find its value.
- In chunk `1`, it finds the reference `"$@0"` and jumps back to chunk `0` to resolve it.
- This process repeats endlessly: `Chunk 0 -> Chunk 1 -> Chunk 0 -> Chunk 1 -> ...`

![A clear diagram illustrating the circular reference between chunk 0 and chunk 1, creating an infinite loop.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a64d05d5-0561-4ca0-8a6b-d8bf9868d200/lg1x =1280x720)

This infinite loop completely consumes the single-threaded Node.js event loop. The process becomes stuck, dedicating 100% of its CPU time to this never-ending task. As a result, it can no longer process any other incoming HTTP requests, listen for events, or perform any other work. The server is effectively frozen.

### The Official Fix: Implementing Cycle Protection

The React team's initial attempt to patch this was complex and ultimately incomplete. The final, effective fix is much simpler and more robust. They introduced a concept called "cycle protection" directly into the deserialization logic.

![The code changes on GitHub showing the implementation of the `cycleProtection` counter to prevent infinite loops.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/894ac440-2a51-481f-11f1-7274003cc800/lg2x =1280x720)

The patch works as follows:

1.  A counter variable, `cycleProtection`, is initialized to `0` before the deserializer starts resolving references.
2.  On every iteration of the resolution loop, this counter is incremented.
3.  An `if` condition checks if the counter has exceeded a hard-coded threshold (in this case, `1000`).
4.  If the threshold is reached, the deserializer assumes it's stuck in an infinite loop. It immediately stops processing and throws an error, such as `new Error('Cannot have cyclic thenables.')`.

This simple check acts as a circuit breaker, preventing the infinite loop from ever freezing the server. The malicious request will simply result in an error on the server side, while the application remains available to serve legitimate users.

## A Stealthy Threat: Leaking Server-Side Source Code (CVE-2025-55183)

The second vulnerability, while rated as less severe (CVSS score 5.3, Medium), is arguably more insidious. Under specific conditions, it allows an attacker to trick a Server Action into returning its own source code in the response. This could expose sensitive business logic, insecure coding patterns, or, in a worst-case scenario, hardcoded credentials like API keys or database connection strings.

### The Attack in Action: Step-by-Step Demonstration

Unlike the DoS attack, this exploit is not possible on a default application. It requires a Server Action that has a specific code pattern.

1.  **Step 1: Create a Vulnerable Server Action**
    The target must be a Server Action that accepts at least one argument and then uses that argument within a template literal or any other context that would implicitly convert it to a string.

    Here's the example from the video, which we'll place in `app/actions.ts`:

    ```typescript
    "use server";

    // Mock database connection
    const db = {
      createConnection: (secret: string) => {
        console.log(`Connecting with secret: ${secret}`);
        return {
          createUser: async (name: unknown) => {
            console.log(`Creating user: ${name}`);
            return { id: "user_abc_123" };
          },
        };
      },
    };

    export async function submitName(name: unknown) {
      const conn = db.createConnection("SECRET_KEY_12345");
      const user = await conn.createUser(name);

      return {
        id: user.id,
        message: `Hello, ${name}!`, // The vulnerable part
      };
    }
    ```

    In this code, the `SECRET_KEY_12345` is hardcoded for demonstration, and the `name` argument is interpolated directly into the `message` string.

2.  **Step 2: Craft the Malicious POST Request**
    The attacker sends a `POST` request targeting the Server Action. The payload is again crafted to manipulate the React Flight deserializer. It might look something like this, sent as URL Encoded form data:

    - Key `0`: `["$F1"]`
    - Key `1`: `{"id":"[SERVER_ACTION_ID]"}`

    The `"$F1"` part is a special React Flight directive indicating that the value is a reference to a server function. The `[SERVER_ACTION_ID]` is a unique identifier that Next.js assigns to the `submitName` function, which an attacker can typically find by inspecting the network traffic of the application.

3.  **Step 3: Send the Request and Analyze the Response**
    When the server processes this request, it will respond with a JSON object. The attacker would inspect the `message` field of this response.

    ![The API client response, where the `message` field clearly contains the entire source code of the `submitName` function, including the secret key.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7b6c5cf2-abfb-4913-18e9-a5c32fbffd00/public =1280x720)

    The response would look something like this:

    ```json
    {
      "id": "user_abc_123",
      "message": "Hello, async function submitName(name) { ... const conn = db.createConnection(\"SECRET_KEY_12345\"); ... }!"
    }
    ```

    As you can see, the entire function body, including the hardcoded secret, has been leaked.

### The Root Cause: Abusing JavaScript's `toString()` Behavior

This clever exploit hinges on a fundamental behavior of JavaScript itself. Let's break down the chain of events:

1.  **Payload Deserialization:** The server receives the malicious payload. The React Flight deserializer sees the `"$F1"` directive and the corresponding function ID. It resolves this to a reference to the actual `submitName` function object in memory.
2.  **Argument Injection:** This resolved function object is then passed as the value for the `name` argument when calling the Server Action. The server effectively executes `submitName(submitName)`.
3.  **Implicit String Coercion:** Inside the `submitName` function, the code reaches the line `message: \`Hello, ${name}!\``. JavaScript's template literal tries to interpolate the `name`variable. Since`name`currently holds the`submitName`function object, JavaScript implicitly calls the`.toString()` method on it to get a string representation.
4.  **The Leak:** For function objects in JavaScript, the default `.toString()` implementation returns the literal source code of that function. This source code string is then embedded in the `message`, which is sent back to the attacker in the JSON response.

![A diagram explaining the core of the exploit: the `submitName` function is passed as the `name` argument to itself, leading to `submitName(submitName)`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ce2afee-be61-4de3-9a7e-35ef7b4f2f00/md2x =1280x720)

### The Official Fix: Overriding `toString()` for Server References

The fix for this vulnerability is as elegant as the exploit itself. The React team didn't need to change the fundamental behavior of JavaScript; they simply changed how server function references behave when treated as a string.

![The GitHub pull request showing the patch, which overrides the `toString` property on server references.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2f22c711-cc2c-4a8e-3305-3d94c7ef0200/orig =1280x720)

The patch involves overriding the `.toString()` method on the object that represents a server function reference. The new, custom `.toString()` method no longer returns the source code. Instead, it returns a generic, non-revealing placeholder string.

```javascript
// Simplified representation of the fix
const serverReferenceToString = () => {
  return "function () { [omitted code] }";
};

// When registering a server reference...
Object.defineProperty(reference, "toString", {
  value: serverReferenceToString,
});
```

With this patch in place, if an attacker attempts the same exploit, the call to `submitName(submitName)` will still happen. However, when the template literal calls `.toString()` on the `name` argument, it will receive the safe placeholder string. The leaked message will be `Hello, function () { [omitted code] }!`, and the source code remains secure on the server.

## Securing Your Applications: Immediate Actions and Long-Term Strategies

Understanding these vulnerabilities is the first step, but taking action is what truly matters. Here’s what you need to do to protect your applications.

### Immediate Action: Upgrade Your Dependencies!

The most critical step is to update your project's dependencies to the patched versions immediately. The previous patches for the RCE vulnerability do **not** protect against these new DoS and source code exposure issues.

Check the official security advisories from React and Next.js for the specific versions that contain the fixes, and update your `package.json` accordingly. You can typically upgrade by running:

```command
npm install next@latest react@latest react-dom@latest
```
With Yarn:

```command
yarn add next@latest react@latest react-dom@latest
```

With pnpm:
```command
pnpm update next react react-dom --latest
```

### Security Best Practices Reinforced by These Exploits

While upgrading is the immediate fix, these vulnerabilities serve as powerful reminders of fundamental security best practices.

- **Never Hardcode Secrets:** The source code leak would have been far less damaging if the `SECRET_KEY_12345` wasn't in the code. Always use environment variables (`process.env.DB_SECRET`) for any sensitive information like API keys, tokens, or database credentials.
- **Stay Informed:** Security is a continuous process. Use tools like GitHub's Dependabot or Snyk to automatically scan your dependencies for known vulnerabilities and get notified when patches are available.
- **Principle of Least Privilege:** Ensure that your server processes run with the minimum necessary permissions. While not directly related to this exploit, it's a core security principle that can limit the damage of a potential future RCE vulnerability.

## Final thoughts

The discovery of these Denial of Service and Source Code Exposure vulnerabilities in React Server Components underscores the ongoing security challenges that accompany cutting-edge web technologies. **We've seen how attackers can manipulate the intricate machinery of the React Flight protocol with simple inputs to produce devastating effects,** from freezing a server with an infinite loop to coaxing it into revealing its own source code.

The good news is that the React and Vercel teams have responded swiftly with effective patches. The fixes—implementing a cycle protection counter for the DoS and overriding the `toString()` method for the source code leak—are robust and well-designed.

**As the React team noted, it's common for the disclosure of a major vulnerability to trigger intensified scrutiny from security researchers**, often leading to the discovery of follow-up issues. This is not a sign of weakness but rather a testament to a healthy and active security ecosystem working to make the platform safer for everyone.

Your primary takeaway from this tutorial should be one of immediate action: **check your application's dependencies and upgrade to the latest patched versions of React and Next.js without delay.** By staying vigilant and adhering to security best practices, we can continue to build amazing applications with these powerful new tools, safely and securely