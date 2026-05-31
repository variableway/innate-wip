# How to Prevent XSS attacks with a Content Security Policy

Content Security Policy (CSP) is a powerful security mechanism that helps
protect your website against [cross-site scripting (XSS)](https://owasp.org/www-community/attacks/xss/) and other code injection
attacks.

In this guide, I'll take you from understanding the core concepts to
implementing a robust CSP for your web applications, providing clear
explanations and practical examples along the way.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ZvvQKie3X70" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Understanding Content Security Policy

Content Security Policy (CSP) functions as a security whitelist that tells
browsers which resources can load on your page. Operating on a "default deny"
principle, CSP only permits resources explicitly allowed in the policy header.

XSS attacks, where attackers inject malicious JavaScript that runs with your
site's permissions, remain a major web vulnerability. CSP effectively counters
these by blocking unauthorized resources. For instance, if an attacker injects
code from evil.com into your site that only permits scripts from your domain,
the browser will block the malicious script and log a violation.

The standard has evolved through three versions: CSP Level 1 established basic
protections, Level 2 introduced nonces and hashes for inline scripts, and the
current Level 3 adds more sophisticated controls like strict-dynamic. All modern
browsers now support CSP, with minor implementation differences.

![Screenshot From 2025-03-17 06-27-05.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0db15666-658b-4924-2fbf-541774459e00/public =2830x1740)

## CSP fundamentals

The foundation of Content Security Policy is the `Content-Security-Policy` HTTP
header that your server sends with web pages. This header contains a series of
directives (instructions) that define exactly what resources can be loaded and
from where. Each directive addresses a specific type of resource and lists
allowed sources.

Here's what a basic CSP header looks like:

```text
Content-Security-Policy: default-src 'self'; img-src *; script-src 'self' trusted.com;
```

Let me break this down in detail:

- `default-src 'self'` establishes the baseline rule that, unless otherwise
  specified, resources may only be loaded from the same origin (domain) as the
  page itself. The 'self' keyword represents your own domain.
- `img-src *` overrides the default rule specifically for images, allowing them
  to be loaded from any source. The asterisk (\*) is a wildcard meaning
  "anywhere."
- `script-src 'self' trusted.com` creates a specific rule for JavaScript files,
  allowing them to be loaded only from your own domain and from trusted.com.

Each directive follows this pattern of specifying a resource type followed by
allowed sources. These sources can be expressed as keywords like `'self'` (same
origin) or `'none'` (nothing allowed), specific hostnames (like trusted.com), or
patterns with wildcards (like `\*.example.com`, which would match subdomains of
example.com).

![1.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4df044d1-1419-4328-a46f-1db1a70d4000/md2x =2064x696)

CSP can be implemented in two different modes, each serving a distinct purpose:

1. **Enforcement mode**: This is the standard operation where the browser
   actively blocks resources that violate your policy. It uses the
   `Content-Security-Policy` header. When a violation occurs, the resource is
   blocked, and the browser logs a message to the console.

2. **Report-only mode**: This monitoring-focused approach doesn't block anything
   but simply reports violations. It uses the
   `Content-Security-Policy-Report-Only` header. This mode is invaluable during
   implementation as it lets you see what would be blocked without actually
   disrupting your site's functionality.

The report-only mode is particularly helpful during the initial stages of CSP
adoption. It allows you to identify potential issues that would arise if you
were to enforce the policy, giving you the opportunity to adjust your rules
before they impact users.

![2.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/519aa2f6-4b59-4d97-98a6-cb3a13e7c100/lg2x =2058x690)

## Setting up your first CSP

Creating an effective CSP involves starting with broad rules and then refining
them based on your site's specific needs. Let's walk through this process step
by step.

The most basic CSP implementation begins with the `default-src` directive, which
acts as a fallback when a more specific directive isn't defined:

```text
Content-Security-Policy: default-src 'self';
```

This simple policy restricts all resources to the same origin. While secure,
it's often too restrictive for modern websites that rely on various external
resources. For instance, if your site uses Google Fonts or a CDN for images,
this policy would block those resources.

For JavaScript, which is a common attack vector, we typically need more specific
controls:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://analytics.example.com;
```

This expanded policy maintains the default restriction for most resources but
adds a specific exception for scripts. It allows scripts from both your domain
and a trusted analytics provider. The advantage here is clear: you're explicitly
stating which external domains can run code on your site, making it much harder
for attackers to execute malicious scripts.

Stylesheet management often requires similar considerations:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://analytics.example.com; style-src 'self' https://fonts.googleapis.com;
```

This further refinement allows CSS files to be loaded from both your domain and
from Google Fonts. The policy is becoming more tailored to your site's specific
needs while maintaining security boundaries.

One significant challenge you'll likely face with CSP is handling inline scripts
and styles—code written directly within HTML files rather than in separate
files. By default, CSP blocks all inline scripts and styles because they're a
common vector for XSS attacks. For a quick solution, you could use the
`'unsafe-inline'` keyword:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' https://analytics.example.com 'unsafe-inline';
```

However, this significantly reduces security by allowing any inline script to
run. A much better approach uses cryptographic nonces or hashes, which we'll
explore in the advanced section.

To implement this header in an Express.js application, you would add middleware
like this:

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://analytics.example.com; style-src 'self' https://fonts.googleapis.com;"
  );
  next();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

This middleware intercepts each response before it's sent to the client and adds
the CSP header. The Express application will now enforce these content security
rules on all responses.

For Apache servers, you could achieve the same effect by adding this directive
to your `.htaccess` file:

```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://analytics.example.com; style-src 'self' https://fonts.googleapis.com;"
```

This instructs Apache to include the CSP header with every response, ensuring
consistent policy enforcement across your site.

## Common resource types and directives

Different types of web resources require different security considerations.
Let's explore how to control various resource types with specific CSP
directives.

### Images with img-src

Images are commonly loaded from various sources, including content delivery
networks (CDNs) to improve performance. You can control image sources with the
`img-src` directive:

```text
Content-Security-Policy: img-src 'self' https://images.cdn.com data:;
```

This policy allows images to be loaded from three sources:

- Your own domain ('self')
- A specific CDN (https://images.cdn.com)
- Data URLs (data:), which permits inline base64-encoded images

Data URLs are particularly common in modern web applications, especially for
small icons or when images are generated dynamically. Including the `data:`
scheme ensures these images won't be blocked. However, be aware that data URLs
can sometimes be used to bypass CSP restrictions, so only include this if your
site genuinely needs it.

### API requests with connect-src

Modern web applications frequently communicate with APIs and backends through
JavaScript. The `connect-src` directive controls where your JavaScript can make
requests using methods like fetch, XMLHttpRequest, WebSockets, and EventSource:

```text
Content-Security-Policy: connect-src 'self' https://api.example.com;
```

This policy allows JavaScript to make requests to:

- Your own domain ('self'), which is essential for same-origin API calls
- A specific API endpoint (https://api.example.com)

Any attempt to connect to other domains would be blocked by the browser. This
prevents malicious scripts from exfiltrating sensitive data to unauthorized
servers, even if an attacker somehow manages to execute code on your page.

### Web fonts with font-src

Custom typography often relies on web fonts, which are frequently loaded from
external providers like Google Fonts:

```text
Content-Security-Policy: font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
```

This policy allows fonts to be loaded from:

- Your own domain ('self')
- Google's font stylesheet domain (`https://fonts.googleapis.com`)
- Google's actual font file domain (`https://fonts.gstatic.com`)

Note that we need to include both Google domains because the process involves
first loading a stylesheet from googleapis.com, which then references actual
font files on `gstatic.com`. This illustrates an important point about CSP: you
need to understand the complete resource loading chain for third-party services.

### Media files with media-src

For audio and video content, the `media-src` directive controls which sources
can provide multimedia resources:

```text
Content-Security-Policy: media-src 'self' https://media.example.com;
```

This allows audio and video files to be loaded from your own domain and a
specified media server. This separation is particularly useful if you host large
media files on a dedicated server or CDN to optimize delivery and reduce load on
your main server.

### Plugins with object-src

The `object-src` directive controls HTML elements that were historically used
for browser plugins, including `<object>`, `<embed>`, and `<applet>` elements:

```text
Content-Security-Policy: object-src 'none';
```

Setting this to 'none' completely blocks these elements, which is the
recommended approach for modern applications. These plugin-based elements have
been largely replaced by native HTML5 capabilities and pose significant security
risks due to their powerful capabilities and historical vulnerability to
exploits. Unless your site specifically needs to support legacy plugins like
Flash, it's best to disable them entirely.

A more complete real-world example combining all these directives might look
like:

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://analytics.example.com https://cdn.jsdelivr.net;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' https://images.cdn.com data:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  media-src 'self' https://media.example.com;
  object-src 'none';
```

This comprehensive policy:

- Sets a default restriction to same-origin for all resource types
- Allows scripts from your domain, an analytics service, and a JavaScript CDN
- Permits styles from your domain and Google Fonts
- Allows images from your domain, a CDN, and data URLs
- Enables fonts from your domain and Google's font server
- Permits API requests to your domain and a specific API server
- Allows media from your domain and a dedicated media server
- Completely blocks plugin content

Each directive is tailored to allow only what's necessary for your site to
function correctly while maintaining strong security boundaries.

## Advanced CSP features

As your CSP implementation matures, you can take advantage of more sophisticated
features to address specific security challenges.

### Nonces for inline scripts

One of the biggest challenges with CSP is managing inline scripts—JavaScript
code embedded directly in your HTML. Instead of using the insecure
`'unsafe-inline'`, you can use cryptographic nonces (random numbers used once)
to allow specific inline scripts:

```html
<!DOCTYPE html>
<html>
<head>
  <title>CSP with Nonce</title>
  <script nonce="2726c7f26c">
    console.log('This inline script is allowed');
  </script>
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

The corresponding header would include the same nonce:

```text
Content-Security-Policy: script-src 'self' 'nonce-2726c7f26c';
```

How does this work? The browser will only execute inline scripts that have a
nonce attribute matching the one specified in the CSP header. Any other inline
scripts will be blocked, even if they're injected by an attacker. This provides
the convenience of inline scripts without compromising security.

For this to be effective, the nonce must be:

- Randomly generated for each page load
- Unpredictable
- Used only once

If you use the same nonce across multiple requests or make it predictable, an
attacker could potentially determine the pattern and craft an exploit that
includes the correct nonce.

In a Node.js Express application, you might implement this approach like:

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use((req, res, next) => {
  // Generate a new cryptographically secure random nonce for each request
  const nonce = crypto.randomBytes(16).toString('base64');

  // Set the CSP header with the nonce
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}';`
  );

  // Make the nonce available to your template engine
  res.locals.nonce = nonce;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { nonce: res.locals.nonce });
});

app.listen(3000);
```

This middleware generates a new random nonce for each request, includes it in
the CSP header, and makes it available to your template engine so it can be
inserted into script tags.

### Hashes for inline scripts

An alternative to nonces is using cryptographic hashes. Instead of marking
scripts with a nonce attribute, you compute a hash of the script content and
include that hash in your CSP:

```text
Content-Security-Policy: script-src 'self' 'sha256-JSEmpFPbDMKIXZXgOFhbSGw5zCY5Wv8OiGGkCuT0dnU=';
```

The hash value is the base64-encoded SHA-256 hash of the exact script content.
The browser will compute the hash of each inline script on the page and only
allow those whose hash matches one specified in the CSP header.

The advantage of hashes is that they don't require modifying the HTML to add
nonce attributes. The disadvantage is that any change to the script content,
even adding a single space, will change the hash and cause the script to be
blocked unless you update the CSP header.

To generate this hash, you can use browser developer tools or command-line
tools:

```command
echo -n "console.log('This inline script is allowed');" | openssl dgst -sha256 -binary | openssl base64
```

```text
JSEmpFPbDMKIXZXgOFhbSGw5zCY5Wv8OiGGkCuT0dnU=
```

This command:

1. Outputs the exact script content with no trailing newline (-n flag)
2. Pipes it to OpenSSL's digest function, using SHA-256 algorithm and binary
   output
3. Encodes the binary digest as base64, which is the format CSP expects

Hashes are particularly useful for static content that doesn't change often,
while nonces are better for dynamic content that changes between requests.

### strict-dynamic directive

Modern web applications often dynamically load scripts, which can be challenging
to accommodate with CSP. The `'strict-dynamic'` directive addresses this by
allowing scripts that are loaded by trusted scripts to execute, even if they
don't match other rules:

```text
Content-Security-Policy: script-src 'nonce-2726c7f26c' 'strict-dynamic';
```

Here's how it works: if a script with a valid nonce dynamically creates and
loads another script (for example, using `document.createElement('script')`),
that second script is automatically trusted, regardless of its source. This
trust propagates through the chain of script creation.

This is particularly useful for Single Page Applications (SPAs) and other
JavaScript-heavy architectures where the initial application code dynamically
loads additional scripts. Without `'strict-dynamic'`, you'd need to list every
possible script source in your CSP, which can be impractical and error-prone.

However, be aware that `'strict-dynamic'` weakens the source-based protections
of CSP. It should only be used in conjunction with nonces or hashes to ensure
that the initial script is trustworthy.

### frame-ancestors for iframe protection

The `frame-ancestors` directive controls which sites can embed your page in
iframes, helping prevent clickjacking attacks where malicious sites embed your
page and trick users into clicking on it:

```text
Content-Security-Policy: frame-ancestors 'self' https://trusted-parent.com;
```

This allows your page to be embedded in iframes on your own site and on
trusted-parent.com, but blocks embedding on any other site.

To completely block iframe embedding, use:

```text
Content-Security-Policy: frame-ancestors 'none';
```

This is similar to the older X-Frame-Options header but offers more flexibility
by allowing you to specify multiple allowed parents.

### Upgrade-Insecure-Requests

This directive automatically upgrades HTTP requests to HTTPS:

```text
Content-Security-Policy: upgrade-insecure-requests;
```

When a browser sees this directive, it will automatically convert any HTTP URLs
to HTTPS before making the request. This helps prevent mixed content warnings
during HTTPS migration and improves security by ensuring all communication is
encrypted.

For example, if your page includes `<img src="http://example.com/image.jpg">`,
the browser will automatically request `https://example.com/image.jpg` instead.
This is particularly useful during the transition period when you're moving from
HTTP to HTTPS but might still have hardcoded HTTP URLs in your content or when
third-party content providers support both protocols.

[ad-logs]

## CSP reporting and monitoring

One of CSP's most valuable features is its ability to report violations, helping
you identify and fix issues before they impact users.

To collect violation reports, add the `report-uri` directive (or the newer
`report-to` directive) to your CSP header:

```text
Content-Security-Policy: default-src 'self'; report-uri https://example.com/csp-reports;
```

When a browser detects a CSP violation, it will send a POST request to the
specified URL with a JSON payload containing details about the violation. This
gives you visibility into what resources are being blocked and why, which is
invaluable for diagnosing issues.

Here's a simple Node.js implementation of a reporting endpoint:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({
  type: ['application/json', 'application/csp-report']
}));

app.post('/csp-reports', (req, res) => {
  console.log('CSP Violation:', req.body);
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('CSP reporting server running on port 3000');
});
```

This server:

1. Uses body-parser to parse JSON payloads, specifically looking for the content
   types used for CSP reports
2. Logs the violation details to the console (in production, you'd likely store
   these in a database)
3. Responds with a 204 No Content status, as no response body is needed

### Using report-only mode

During implementation, use the report-only mode to collect violations without
breaking functionality:

```text
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; report-uri https://example.com/csp-reports;
```

This header instructs the browser to check for violations and report them, but
not to actually block any resources. This allows you to collect data on what
would be blocked if you were to enforce the policy, without risking disruption
to your users.

A typical violation report might look like this:

```json
{
  "csp-report": {
    "document-uri": "https://example.com/page.html",
    "referrer": "",
    "violated-directive": "script-src",
    "effective-directive": "script-src",
    "original-policy": "default-src 'self'; script-src 'self'; report-uri https://example.com/csp-reports",
    "disposition": "report",
    "blocked-uri": "https://evil.com/malicious.js",
    "status-code": 0,
    "source-file": "https://example.com/page.html"
  }
}
```

This report provides valuable information:

- `document-uri`: The page that triggered the violation
- `violated-directive`: Which part of your policy was violated
- `blocked-uri`: The resource that would have been blocked
- `source-file`: The file that attempted to load the blocked resource

By analyzing these reports, you can:

- Identify legitimate resources that need to be added to your policy
- Detect potential XSS attacks in real-time
- Understand how your site interacts with external resources
- Gradually refine your policy without breaking functionality

## CSP implementation strategy

A successful CSP implementation requires a methodical approach that balances
security with functionality. Here's a step-by-step strategy:

1. **Start with report-only mode**: Begin by deploying a strict policy with the
   `Content-Security-Policy-Report-Only` header. This lets you collect
   violations without breaking functionality while giving you insight into what
   resources your site actually needs.

```text
   Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://example.com/csp-reports;
```

   This initial policy is intentionally restrictive to help you identify all the
   resources your site uses.

2. **Analyze reports**: Review the violation reports over a period of
   time—ideally covering different user activities and scenarios. Look for
   patterns of legitimate resources that are being reported. Group similar
   violations together to identify categories of resources that need to be
   addressed.

3. **Refine your policy**: Gradually adjust your policy to allow necessary
   resources while maintaining security. Start with the most critical resources
   (like scripts and styles) and work your way through other types. Remember to
   balance security with usability—only allow what's genuinely needed.

```text
   Content-Security-Policy-Report-Only:
     default-src 'self';
     script-src 'self' https://analytics.example.com;
     style-src 'self' https://fonts.googleapis.com;
     img-src 'self' https://images.cdn.com;
     report-uri https://example.com/csp-reports;
```

4. **Move to enforcement mode**: Once you're confident your policy won't break
   functionality, switch to the `Content-Security-Policy` header to start
   enforcing the rules. You might want to do this gradually, starting with less
   critical pages before moving to your main application.

```text
   Content-Security-Policy:
     default-src 'self';
     script-src 'self' https://analytics.example.com;
     style-src 'self' https://fonts.googleapis.com;
     img-src 'self' https://images.cdn.com;
     report-uri https://example.com/csp-reports;
```

5. **Continue monitoring**: Keep collecting reports even after moving to
   enforcement mode. As your site evolves and adds new features, you'll need to
   update your policy accordingly. The reporting mechanism gives you ongoing
   visibility into potential issues.

This gradual approach minimizes the risk of disruption while maximizing security
benefits. It's much better than trying to implement a complete CSP all at once,
which often leads to frustrated users and emergency fixes.


## CSP for modern web applications

Modern web applications present unique challenges for CSP implementation due to
their dynamic nature and complex resource requirements.

### Single Page Applications (SPAs)

SPAs like those built with React, Angular, or Vue often dynamically inject
scripts and styles at runtime, which can conflict with CSP restrictions. Here
are some strategies to address this:

- **Using nonces with server-side rendering**:

```javascript
const nonce = generateRandomNonce();
// Include the nonce in your CSP header
// Then inject it into your SPA initialization
document.getElementById('app').innerHTML = `<div nonce="${nonce}">App content</div>`;
```

This approach requires your server to generate a nonce for each page load and
make it available to both the CSP header and your application code. While it
adds some complexity, it provides strong security guarantees.

- **Using `strict-dynamic` with a nonce for frameworks that create scripts**:

```text
Content-Security-Policy: script-src 'nonce-2726c7f26c' 'strict-dynamic';
```

This approach is particularly well-suited to frameworks that dynamically create
script elements. The initial application script is trusted via the nonce, and
then `strict-dynamic` allows that script to create additional trusted scripts
regardless of their source.

For frameworks like React that use inline event handlers (which CSP blocks by
default), you might need to use the `unsafe-hashed-attributes` feature in
compatible browsers or refactor your code to use `addEventListener()` instead.

### Third-party widgets

Modern websites often incorporate third-party widgets like social media buttons,
comment systems, or chat support. These present challenges because you typically
have limited control over what resources they load. To safely incorporate them:

1. **Identify all domains the widget needs to access**: Review the widget's
   documentation or use report-only mode to identify all domains it requires.

2. **Include those domains in your CSP directives**: Add the necessary domains
   to your `script-src`, `style-src`, `img-src`, and `connect-src` directives.

3. **Consider using iframes with sandbox attributes**: For widgets that require
   many permissions or are higher risk, consider isolating them in sandboxed
   iframes, which provides an additional layer of protection.

For example, a social media widget might require:

```text
Content-Security-Policy: script-src 'self' https://platform.twitter.com https://connect.facebook.net;
```

### WebSockets

For applications that use WebSockets for real-time communication, you need to
include the WebSocket endpoints in your connect-src directive, using the wss://
scheme for secure WebSockets:

```text
Content-Security-Policy: connect-src 'self' wss://realtime.example.com;
```

This allows your JavaScript to establish WebSocket connections to the specified
server. The wss:// scheme is the secure version of WebSockets, equivalent to
HTTPS for HTTP, and should be used whenever possible to ensure encrypted
communication.

## Next steps and resources

To further enhance your CSP implementation and stay current with best practices:

- Use CSP generators like [CSP Builder](https://report-uri.com/home/generate) to
  create policies based on your specific requirements.

- Test your CSP with the [CSP Evaluator](https://csp-evaluator.withgoogle.com/),
  a tool developed by Google that analyzes your policy for common mistakes and
  weaknesses.

- Use browser developer tools to debug CSP issues. Most modern browsers will
  show CSP violations in the console, often with helpful details about what was
  blocked and why.

- Review the
  [MDN Web Docs on CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
  for detailed specifications and up-to-date information on browser support.

By implementing Content Security Policy, you've added a powerful layer of
defense against many common web attacks. CSP is not a silver bullet—it works
best as part of a comprehensive security strategy that includes proper input
validation, output encoding, and other security best practices. As you continue
to refine your policy based on violations and changing requirements, you'll
strike the right balance between security and functionality for your specific
application.

Remember that security is a journey, not a destination. Regular reviews and
updates to your CSP will ensure it remains effective as both your application
and the threat landscape evolve over time.
