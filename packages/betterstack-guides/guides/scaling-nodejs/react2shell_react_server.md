# React2Shell and React Server Components Remote Code Execution Explained

In the ever-evolving world of web development, new features often bring new complexities and, unfortunately, new potential attack vectors. Recently, **a critical security vulnerability was discovered within React Server Components (RSCs)**, a paradigm that has been heavily adopted by frameworks like Next.js.

This vulnerability, nicknamed "React2Shell," is an unauthenticated remote code execution (RCE) flaw, which is among the most severe types of security issues a web application can face. It has been assigned CVE-2025-55182 and received a CVSS score of 10.0, the highest possible rating, signifying its critical nature.

The **React team and major hosting providers acted swiftly to address the issue. However, the severity cannot be overstated**. An RCE vulnerability allows an attacker to execute arbitrary code on the server hosting the application.

This could lead to complete server takeover, data theft, installation of malware, or using the compromised server to launch further attacks. **Alarming reports from services like AWS have indicated that state-sponsored cyber threat groups** began attempting to exploit this vulnerability within hours of its public disclosure.

This article provides a deep dive into the React2Shell vulnerability. You'll discover how the exploit works through practical examples and learn about the underlying mechanisms that made it possible.

The analysis covers the React Flight Protocol, the custom serialization format at the heart of the issue, the specific flaw in the protocol's deserialization logic that attackers leveraged, advanced JavaScript **concepts like Prototype Pollution and how they were used to gain control, the clever trick used to trigger code execution** by abusing promise handling, and finally, the official fix and essential mitigation strategies you must implement to protect your applications.

This comprehensive analysis provides a thorough understanding of not just the "how" but, more importantly, the "why" behind this critical vulnerability, reinforcing the importance of secure coding practices and timely dependency management.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/iV48tEiHFDY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## How the "React2Shell" exploit works

Before diving into the technical intricacies, it's crucial to understand the impact of this vulnerability. The exploit demonstrates how attackers can achieve remote code execution through a specially crafted request.

### The vulnerable environment

The vulnerability affects Next.js versions 15.x and 16.x prior to the patch. Version 16.0.6, for instance, was one of the latest vulnerable versions. Creating a vulnerable project requires specifying this version:

```command
bun create next-app@16.0.6
```

Once the installation completes and the project is configured, building and starting the application in production mode reveals the true danger:

```command
bun run build
```

```command
bun run start
```

After running these commands, the server typically runs on `http://localhost:3000`. The default Next.js welcome page appears normal, giving no indication of the underlying vulnerability.

### A target for exploitation

To demonstrate the exploit's impact, consider a sensitive server file. A common goal for attackers is reading sensitive files from the server's file system, such as configuration files containing database credentials, API keys, or private SSH keys. A file like `secret.txt` might contain:

```text
[label secret.txt]
THIS_IS_A_SECRET_KEY=a3d13rj73hjkwh3rj3k
SECRET_PASSWORD=my_password
```

This file represents the valuable data that an attacker would want to steal.

### Executing the remote code execution payload

The attack is delivered via a specially crafted `POST` request to the application's root URL. The request is a `multipart/form-data` POST request containing a malicious payload designed to trick the React Server into executing a command.

Upon sending the request, the terminal window where the Next.js server runs shows new output logged to the console:

```text
[output]
You have been pwned:
THIS_IS_A_SECRET_KEY=a3d13rj73hjkwh3rj3k
SECRET_PASSWORD=my_password
```

This is the moment of compromise. The payload was successfully executed by the server process. The command embedded in the payload was essentially `echo 'You have been pwned:' && cat ~/Desktop/secret.txt`. The server executed this command, printing the "pwned" message and then concatenating and printing the contents of the secret file. This is a definitive proof of concept for unauthenticated remote code execution. An attacker from anywhere on the internet could have done this to a publicly exposed, vulnerable server.

## Understanding the React Flight Protocol

To understand how such a devastating attack was possible, you need to look at the unique way React Server Components communicate. Unlike traditional client-server architectures that rely heavily on JSON for data exchange, RSCs use a custom serialization format called the **React Flight Protocol**.

### What the React Flight Protocol does

The React Flight Protocol is a specialized data format designed by the React team to stream rendered React component trees from the server to the client. Standard JSON is not sufficient for this task because it cannot represent complex elements like functions, React components themselves, or special values like `undefined` or `Date` objects without custom handling.

Flight solves this by breaking down the data into "chunks" that are sent over the network, typically as `multipart/form-data`. These chunks can reference each other, allowing for a graph-like data structure to be reconstructed on the receiving end.

### How data chunks and references work

The core concept of the Flight protocol can be illustrated through a simple example. When the server wants to send the client the object `{"object": "fruit", "name": "cherry"}`, Flight breaks it down into multiple chunks instead of sending it as a single JSON string.

![A diagram illustrating the React Flight Protocol. It shows three chunks of data and arrows indicating how they reference each other to form a final deserialized object.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c53041f2-8f87-4c16-f492-9069a8c4d200/orig =854x720)

Here's how it's represented:

```json
[label Chunk 0]
["$1"]
```

```json
[label Chunk 1]
{"object":"fruit", "name":"$2:fruitName"}
```

```json
[label Chunk 2]
{"fruitName":"cherry"}
```

This structure relies on two key concepts:

**References (`$`):** The dollar sign (`$`) is a special character that denotes a reference to another chunk. `$1` means "replace this with the entire content of Chunk 1."

**Path Traversal (`:`):** The colon (`:`) is used to access a specific property within a referenced chunk. `$2:fruitName` means "go to Chunk 2 and get the value of the `fruitName` property."

When the client (or in this case, the server processing a POST request from the client) receives these chunks, the deserializer processes them. It starts with Chunk 0, which is the root of the data. It sees `["$1"]` and resolves the reference by looking at Chunk 1. In Chunk 1, it sees the property `"name"` has a value of `"$2:fruitName"`. It resolves this by looking at Chunk 2, finding the `fruitName` key, and retrieving its value, `"cherry"`. The final, reconstructed object passed to the application code is `{"object": "fruit", "name": "cherry"}`.

This system of references and path traversal is powerful, but it's also where the vulnerability lies.

## The vulnerability: Prototype pollution and code execution

The core of the React2Shell exploit is a classic web security flaw known as **Prototype Pollution**, which is made possible by the insecure handling of path traversal in the React Flight Protocol's deserializer.

### The flaw in path traversal logic

The fundamental mistake was that the code responsible for resolving path traversals (like `:fruitName` in the example above) blindly trusted the path provided by the client. There was no validation to check if the property being accessed was a legitimate, intended part of the data object.

This means an attacker could provide a path that doesn't exist on the object itself but exists further up the **prototype chain**. In JavaScript, nearly every object inherits properties and methods from a parent `prototype`. If you can "pollute" the base `Object.prototype`, you can inject properties into almost every object in the entire Node.js process.

### Exploiting the flaw with prototype pollution

Attackers discovered they could use the path traversal syntax to access the hidden `__proto__` property, which is a reference to an object's prototype. By chaining these references, they could "walk" up the prototype chain to reach the global `Function` constructor.

Consider this malicious path: `"$1:__proto__:constructor:constructor"`

Tracing this path traversal reveals:

1. `$1`: This references a basic object sent in the payload, call it `myObject`.
2. `__proto__`: This accesses `myObject`'s prototype, which for a plain object is the global `Object.prototype`. The code now has a reference to `Object.prototype`.
3. `constructor`: The `constructor` property of `Object.prototype` is the `Object` constructor function itself.
4. `constructor`: The `constructor` property of the `Object` function is the master `Function` constructor.

By crafting this path, the attacker tricks the deserializer into returning a reference to the global `Function` constructor.

### From Function constructor to RCE

Gaining access to the `Function` constructor is dangerous because the `Function` constructor is a powerful, and often risky, feature of JavaScript that allows you to create a new function dynamically from a string of code. For example:

```javascript
// This creates a function that, when called, will execute the code in the string.
const myMaliciousFunction = new Function(
  "require('child_process').execSync('rm -rf /')"
);

// Calling the function executes the command.
// myMaliciousFunction();
```

This is essentially a form of `eval()`, which is widely recognized as a major security risk because it allows string data to be executed as code. By obtaining a reference to the `Function` constructor via prototype pollution, the attacker has the ultimate tool for RCE. They can now create a new function containing any server-side command they wish to execute.

## Triggering execution with promise handling

Having the ability to create a malicious function is one thing, but the attacker needs a way to actually call it. The React Server code isn't going to randomly execute a function the attacker just created. The attacker needed a trigger to force the server to invoke their newly created function.

### Abusing the `.then()` method

The trigger was found in another fundamental aspect of modern JavaScript: `async/await` and promise handling. The React Server deserialization logic is asynchronous. Under the hood, when the JavaScript engine encounters an `await` keyword, it checks if the value being awaited is a "thenable." A "thenable" is any object that has a function property named `then`. A standard JavaScript `Promise` is the most common example.

If an object has a `.then()` method, the engine will automatically call it to continue the asynchronous operation. This automatic invocation is the trigger the attackers needed.

### The full malicious payload structure

The complete exploit combines all these pieces into a multi-part payload. Here is a simplified representation of the logic in the fake chunk object:

![A code snippet of the JSON-like structure of the "Fake Chunk" payload, highlighting the various properties used in the exploit.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8be393e5-87db-483b-8494-d423943a1100/lg2x =855x720)

```json
[label Malicious payload structure]
{
  "then": "$1:__proto__:then",
  "status": "resolved_model",
  "value": "{\"then\":\"*$B0\"}",
[highlight]
  "_response": {
    "_prefix": "process.mainModule.require('child_process').execSync('cat ~/Desktop/secret.txt').toString()",
    "_formData": {
      "get": "$1:constructor:constructor"
    }
  }
[/highlight]
}
```

This is complex, but here's the flow:

The deserializer processes this fake chunk. Because it's an object being awaited, the engine looks for a `.then` property. The attacker has polluted `Object.prototype` to have a `.then` property. This property is set to be another object that, when its own `then` is resolved, uses the `formData.get` method.

The attacker has also polluted the `get` method of `formData` to point to the `Function` constructor (which they found via `__proto__:constructor:constructor`). The `_prefix` property contains the string of malicious code to be executed (for example, `cat secret.txt`).

The chain of events forces the `Function` constructor (`get`) to be called with the malicious code string (`_prefix`) as its argument. This creates a new function. The promise-handling mechanism then immediately executes this newly created function, resulting in RCE.

## The fix and mitigation strategies

Understanding the complexity of the exploit makes the simplicity of the fix all the more remarkable. It underscores how a single missing validation check can unravel an entire system's security.

### How React patched the vulnerability

The React team patched this vulnerability by adding one crucial check in the path traversal logic. Before accessing a property on an object, the patched code now verifies that the property is the object's own property and not one inherited from its prototype.

![A pseudo-code comparison showing the original vulnerable loop versus the patched loop, which includes an `if` statement with `Object.prototype.hasOwnProperty.call(...)` to prevent prototype traversal.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0815d932-026b-4e36-92d3-66f7d3610d00/md2x =1280x720)


Here's the logical difference in pseudocode:

**Vulnerable code:**

```javascript
[label Vulnerable path traversal]
for (let i = 1; i < path.length; i++) {
  // Blindly traverses the path, allowing access to __proto__
  value = value[path[i]];
}
```

**Patched code:**

```javascript
[label Patched path traversal]
for (let i = 1; i < path.length; i++) {
[highlight]
  // Check if the property is an OWN property of the object
  if (!Object.prototype.hasOwnProperty.call(value, path[i])) {
    // If it's not (e.g., it's __proto__), throw an error
    throw new Error("Invalid reference: property does not exist.");
  }
[/highlight]
  // Only proceed if the check passes
  value = value[path[i]];
}
```

The `hasOwnProperty` check effectively blocks any attempt to access `__proto__` or any other inherited properties, shutting down the prototype pollution attack vector completely.

### Your immediate action plan

If you are running a Next.js or any other application that utilizes React Server Components, you must take immediate action.

**Upgrade your dependencies:** This is the most critical and only guaranteed solution. Update your `react` and `next` packages to the latest patched versions. Consult the official CVE and the React/Next.js blogs for the specific version numbers that contain the fix. Run your package manager's update command and verify in your `package.json` that you are on a safe version.

**Verify WAF protection:** Major hosting providers like Vercel and Cloudflare have deployed Web Application Firewall (WAF) rules to block requests that match the signature of this exploit. This provides an important layer of defense, especially while you are in the process of upgrading. However, clever attackers can sometimes find ways to obfuscate their payloads to bypass WAF rules. Do not rely on a WAF as a substitute for patching your application's code.

**Audit your code:** While this specific vulnerability was in the framework itself, it serves as a powerful reminder to be cautious about any code that processes and deserializes user-controlled input. Always treat input from the client as untrusted.

## Final thoughts

**The React2Shell vulnerability (CVE-2025-55182) is a stark reminder of the delicate balance between innovation and security**. React Server Components offer powerful new ways to build applications, but the custom React Flight Protocol they introduced contained a subtle but critical flaw in its deserialization logic.

Attackers chained together a series of clever exploits: insecure path traversal, prototype pollution, abuse of the `Function` constructor, and automatic promise handling to achieve full unauthenticated remote code execution. **The exploit is a masterclass in understanding the deep internals of JavaScript and leveraging them in unexpected ways**.

**Fortunately, the fix was swift and effective, boiling down to a single validation check** that prevents traversal up the prototype chain. For developers and engineering teams, the key takeaway is unequivocal: keep your dependencies up to date. In the face of a critical vulnerability being actively exploited in the wild, procrastination is not an option. Audit your projects, apply the necessary patches, and ensure your servers are not left exposed.