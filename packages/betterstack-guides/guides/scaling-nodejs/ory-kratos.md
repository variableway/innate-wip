# Ory Kratos for Next.js: Open-Source Auth with Email Verification and 2FA

Identity and authentication form the foundation of modern web applications, **controlling access to sensitive features and protecting user data**. Building robust, secure authentication systems from scratch presents numerous security pitfalls and edge cases. While managed solutions like Auth0 and Okta offer convenience, they introduce vendor lock-in, limited customization, and opaque ecosystems.

**Ory Kratos provides an alternative: a feature-rich, enterprise-grade identity server that's fully open-source,** offering complete control over data, user interfaces, and authentication logic. This guide explores Ory Kratos's architecture and demonstrates building a complete authentication system for Next.js applications, covering user registration, login, email verification, and two-factor authentication using the open-source Ory stack.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/cvJKfqZrtgI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Understanding Ory Kratos

Ory Kratos is a backend-only, API-first identity management server designed to handle common identity-related tasks securely and efficiently.

### Headless architecture philosophy

The term "headless" defines Kratos's core approach. Kratos doesn't include pre-built user interfaces like login forms or registration pages. Instead, it exposes comprehensive REST APIs that your application communicates with. This "Bring Your Own UI" (BYOUI) approach provides ultimate freedom to build user interfaces using any technology—React, Vue, Svelte, Next.js, or native mobile apps—styled to match your brand without constraints from third-party templates.

### Core feature set

![A grid displaying the key features of Ory Kratos, including self-service login, multifactor authentication, user management, and more.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3f09d26b-d487-47e4-403e-24da99947700/md1x =1280x720)

**Self-service login and registration**: Kratos handles common user flows including registration, login, and logout. It supports various login methods: username/password combinations, passwordless flows, and social logins via OpenID Connect.

**Multifactor authentication (MFA/2FA)**: Enhance security with proven MFA methods like Time-based One-Time Passwords (TOTP) working with authenticator apps like Google Authenticator, and standards like FIDO2 and WebAuthn for hardware keys.

**User management**: Provides administrative APIs to create, read, update, and delete user identities and associated data.

**Custom identity models**: You control data associated with user identities. Using JSON schema, you can define custom fields like names, addresses, profile pictures, or any application-specific data.

**Social logins**: Simplify user experience by allowing sign-up and login using existing accounts from providers like Google, GitHub, Apple, and any OpenID Connect (OIDC) compliant provider.

**Account verification and recovery**: Kratos manages essential flows for verifying user identity (via email link or code) and account recovery using methods like "Forgot Password" flows and security codes.

### Security and compliance

![The official documentation page highlighting Kratos's security standards and GDPR compliance.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0078efc1-bebf-4537-2551-8dff7f073c00/orig =1280x720)

Security is a core design principle in Ory Kratos. The platform applies industry-standard security practices established by leading experts and organizations like the National Institute of Standards and Technology (NIST) and the Internet Engineering Task Force (IETF). It's designed for GDPR compliance, simplifying user data privacy management. One notable feature checks passwords against known data breaches, preventing users from choosing compromised credentials.

### Modular ecosystem integration

![A diagram illustrating how the different Ory open-source components (Kratos, Hydra, Keto, etc.) can work together.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/76b9cf0a-c6e4-4dbd-33b0-6450a588d800/md2x =1280x720)

Ory Kratos is one component of the larger Ory open-source ecosystem. While Kratos handles identity management, other Ory projects integrate seamlessly:

**Ory Hydra**: A certified OAuth 2.0 and OpenID Connect server.

**Ory Keto**: A global, scalable authorization server for managing complex user permissions.

**Ory Polis**: An enterprise-level SSO bridge.

**Ory Oathkeeper**: An identity and access proxy.

This modularity allows selecting components you need, creating bespoke solutions tailored to project requirements without unnecessary bloat.

## Environment setup

The development environment uses Docker to run Kratos and its dependencies in isolated containers. The complete project code is available in this [GitHub repository](https://github.com/andrisgauracs/kratos-demo).

### Project structure

Create the necessary directory structure to keep Kratos configuration separate from Next.js frontend code:

```command
mkdir kratos-demo
```

```command
cd kratos-demo
```

```command
mkdir docker
```

```command
cd docker
```

```command
mkdir config
```

```command
cd ..
```

Create the configuration files:

```command
touch docker/docker-compose.yml
```

```command
touch docker/config/kratos.yml
```

```command
touch docker/config/identity.schema.json
```

```command
touch users.db
```

![The terminal window displaying the commands used to create the project's directory and file structure.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9a62878b-f67a-4845-c52d-0bd42afac600/orig =1280x720)

The resulting project structure:

```text
[output]
kratos-demo/
├── docker/
│   ├── config/
│   │   ├── identity.schema.json
│   │   └── kratos.yml
│   └── docker-compose.yml
└── users.db
```

## Docker and Kratos configuration

### Docker Compose service definition

![The complete `docker-compose.yml` file displayed in a code editor, showing all four services.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d6a1cd21-6b4f-4851-e72c-4ab935b10100/public =1280x720)

The `docker-compose.yml` file defines the multi-container application blueprint. It specifies which services to run, how they connect, and their configurations.

```yaml
[label docker/docker-compose.yml]
version: "3.7"
services:
  kratos-migrate:
    image: oryd/kratos:v1.3.1
    environment:
      - DSN=sqlite:///var/lib/sqlite/users.db?_fk=true&mode=rwc
    volumes:
      - type: bind
        source: ../
        target: /var/lib/sqlite
      - type: bind
        source: ./config
        target: /etc/config/kratos
    command: -c /etc/config/kratos/kratos.yml migrate sql -e --yes
    restart: on-failure
    networks:
      - intranet

  kratos-selfservice-ui-node:
    image: oryd/kratos-selfservice-ui-node:v1.3.1
    environment:
      - KRATOS_PUBLIC_URL=http://127.0.0.1:4433/
      - KRATOS_BROWSER_URL=http://127.0.0.1:4433/
      - CSRF_COOKIE_NAME=kratos_csrf_cookie
    ports:
      - "4455:4455"
    networks:
      - intranet
    restart: on-failure

  kratos:
    depends_on:
      - kratos-migrate
    image: oryd/kratos:v1.3.1
    ports:
      - "4433:4433" # public
      - "4434:4434" # admin
    restart: unless-stopped
    environment:
      - DSN=sqlite:///var/lib/sqlite/users.db?_fk=true
      - LOG_LEVEL=trace
    command: serve -c /etc/config/kratos/kratos.yml --dev --watch-courier
    volumes:
      - type: bind
        source: ../
        target: /var/lib/sqlite
      - type: bind
        source: ./config
        target: /etc/config/kratos
    networks:
      - intranet

  mailslurper:
    image: oryd/mailslurper:latest-smtps
    ports:
      - "4436:4436"
      - "4437:4437"
    networks:
      - intranet

networks:
  intranet:
```

Service breakdown:

**`kratos-migrate`**: A one-off job running at service startup that applies necessary database migrations to `users.db`, creating tables Kratos needs for identity data storage.

**`kratos`**: The main Ory Kratos server exposing a public API on port `4433` (for frontend interactions) and an admin API on port `4434`.

**`kratos-selfservice-ui-node`**: A reference UI provided by Ory, part of the standard quickstart setup but not used directly in this implementation.

**`mailslurper`**: A local fake SMTP server. When Kratos sends emails (like account verification), MailSlurper captures them, allowing viewing in a web interface without requiring a real email provider during development.

### Identity schema definition

The `identity.schema.json` file defines user information structure using JSON Schema standard to describe user `traits`:

```json
[label docker/config/identity.schema.json]
{
  "$id": "https://schemas.ory.sh/presets/kratos/email-password/identity.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Person",
  "type": "object",
  "properties": {
    "traits": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "title": "E-Mail",
[highlight]
          "ory.sh/kratos": {
            "credentials": {
              "password": {
                "identifier": true
              }
            },
            "verification": {
              "via": "email"
            },
            "recovery": {
              "via": "email"
            }
          }
[/highlight]
        },
        "name": {
          "type": "object",
          "properties": {
            "first": {
              "title": "First Name",
              "type": "string"
            },
            "last": {
              "title": "Last Name",
              "type": "string"
            }
          }
        }
      },
      "required": ["email"],
      "additionalProperties": false
    }
  }
}
```

This schema defines user `traits` consisting of a required `email` and optional `name` object with `first` and `last` name properties. The schema instructs Kratos to use email as the primary identifier for password credentials and for verification/recovery flows.

### Kratos server configuration

The `kratos.yml` file is the main Kratos server configuration, controlling everything from database connections to self-service flow URLs:

```yaml
[label docker/config/kratos.yml]
version: v1.3.1

dsn: sqlite:///var/lib/sqlite/users.db?_fk=true

serve:
  public:
    base_url: http://127.0.0.1:4433/
[highlight]
    cors:
      enabled: true
      allowed_origins:
        - http://127.0.0.1:3000
        - http://localhost:3000
[/highlight]
  admin:
    base_url: http://127.0.0.1:4434/

selfservice:
  default_browser_return_url: http://127.0.0.1:3000/
  allowed_return_urls:
    - http://127.0.0.1:3000

  methods:
    password:
      enabled: true
    totp:
      enabled: true

  flows:
    error:
      ui_url: http://127.0.0.1:3000/error
    settings:
      ui_url: http://127.0.0.1:3000/settings
      privileged_session_max_age: 15m
    recovery:
      enabled: true
      ui_url: http://127.0.0.1:3000/recovery
    verification:
      enabled: true
      ui_url: http://127.0.0.1:3000/verification
      after:
        default_browser_return_url: http://127.0.0.1:3000/
    logout:
      after:
        default_browser_return_url: http://127.0.0.1:3000/login
    login:
      ui_url: http://127.0.0.1:3000/login
      lifespan: 10m
    registration:
      lifespan: 10m
      ui_url: http://127.0.0.1:3000/register
      after:
        password:
          hooks:
            - hook: session

identity:
  default_schema_id: default
  schemas:
    - id: default
      url: file:///etc/config/kratos/identity.schema.json

courier:
  smtp:
    connection_uri: smtps://test:test@mailslurper:1025/?skip_ssl_verify=true
```

Key configuration points:

**`dsn`**: Points to the SQLite database file, mounted into the container.

**`serve.public.cors`**: Critical setting whitelisting the Next.js application's URL (`http://localhost:3000`), allowing browser requests to the Kratos API from a different origin.

**`selfservice.flows.*.ui_url`**: URLs telling Kratos where to redirect the user's browser at different authentication stages. For example, when a login flow initiates, Kratos redirects to `http://127.0.0.1:3000/login`, where the Next.js app renders the login form.

**`identity.schemas`**: Points to the `identity.schema.json` file.

**`courier.smtp`**: Configures Kratos to send emails through the local `mailslurper` service.

## Next.js frontend implementation

### Project initialization

Create the Next.js application in the root `kratos-demo` directory:

```command
npx create-next-app@latest kratos-auth
```

Navigate into the directory and install Ory dependencies:

```command
cd kratos-auth
```

```command
npm install @ory/nextjs @ory/elements-react
```

### Configuration files

Create environment variables in `.env`:

```text
[label .env]
NEXT_PUBLIC_ORY_SDK_URL=http://127.0.0.1:4433/
NEXT_PUBLIC_ORY_UI_URL=http://127.0.0.1:3000/
```

Create Ory configuration file mapping UI components to app paths:

```typescript
[label ory.config.ts]
import type { OryClientConfiguration } from "@ory/elements-react";

const config: OryClientConfiguration = {
  project: {
    name: "Ory Authentication Example",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    registration_ui_url: "/register",
    verification_ui_url: "/verification",
    recovery_ui_url: "/recovery",
    login_ui_url: "/login",
    settings_ui_url: "/settings",
  },
};

export default config;
```

Create Next.js middleware for automatic session management:

```typescript
[label middleware.ts]
import { createOryMiddleware } from "@ory/nextjs/middleware";
import oryConfig from "./ory.config";

export const middleware = createOryMiddleware(oryConfig);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### Authentication flow pages

Create pages in the Next.js app corresponding to `ui_url` paths defined in `kratos.yml`. Inside the `app` directory, create folders for `login`, `register`, `settings`, `verification`, `recovery`, and `logout`. Inside each folder, create a `page.tsx` file.

The code for most pages is nearly identical using `Ory Elements`. Here's the login page example:

```typescript
[label app/login/page.tsx]
import { Login, OryPage, OryPageProps } from "@ory/elements-react";
import { ory } from "@/app/ory";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { searchParams } = new URL(
    "http://localhost:3000" + (arguments[0]?.searchParams?.return_to ?? "")
  );
  const returnTo = searchParams.get("return_to") ?? "";
  const flowId = searchParams.get("flow") ?? "";

  if (!flowId) {
    return redirect(ory.toLogin({ return_to: returnTo }));
  }

  let flow: LoginFlow | undefined;

  try {
    const { data } = await ory.getLoginFlow({ id: flowId });
    flow = data;
  } catch (error) {
    // Handle errors
  }

  return (
    <OryPage>
      <Login flow={flow} />
    </OryPage>
  );
}
```

Similar files for other flows replace `getLoginFlow` and `<Login />` with appropriate counterparts (such as `getRegistrationFlow` and `<Registration />`). This pattern abstracts complexity of rendering forms, handling user input, and displaying errors.

## Testing the authentication flow

### Launching services

![A screenshot of the terminal output showing the "YOU ARE RUNNING Ory Kratos IN DEV MODE. SECURITY IS DISABLED." message, confirming a successful launch.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8edce7dd-1735-4eaf-2f4c-3173cf400200/orig =1280x720)

Start Docker services from the `kratos-demo/docker` directory:

```command
docker compose up
```

This builds and starts all services defined in `docker-compose.yml`. Logs should indicate database migrations have run and the Kratos server is running.

Start the Next.js application in a separate terminal from `kratos-demo/kratos-auth`:

```command
npm run dev
```

This starts the frontend application on `http://localhost:3000`.

### User authentication journey

**Registration**: Navigate to `http://localhost:3000` and click "Create Account". When attempting to sign up with a weak password like `password123`, Ory Kratos detects the password in data breaches and prevents its use.

![The registration form showing an error message: "The password has been found in data breaches and must no longer be used."](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/494d734d-beb7-4cc8-9956-52f60db23d00/orig =1280x720)


Enter details with a strong password and click "Sign up".

**Email verification**: After registration, you're directed to verify your account. Navigate to the MailSlurper UI at `http://localhost:4436` to see the verification email sent by Kratos.

![The MailSlurper interface showing a list of captured emails, with the verification email at the top.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cc071a9d-d8cb-4a6a-f274-b7c7b417d100/md1x =1280x720)


Click the email to see the verification code, copy it, return to your app, paste the code into the verification form, and click "Continue". Your account is now verified.

**Login and session management**: Click "Sign In", enter your credentials, and sign in. The page displays a "Welcome Back" message and a JSON object containing current session information, proving Kratos successfully created a session.

**Two-factor authentication (2FA)**: Click "Settings" to access the profile settings dashboard. Scroll to the "Authenticator App" section.

![A user scanning the QR code on the screen with their phone's authenticator app.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4cf03e31-4c96-4c21-dcdf-5f7f3e344800/public =1280x720)


Open an authenticator app (like Google Authenticator) on your phone, scan the QR code, enter the 6-digit code into the "Verify code" field, and save. You've now enabled 2FA.

![The login flow now shows a screen for "Second factor authentication" asking for the code from the authenticator app.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a1e01cc-fe44-4255-7d56-e0b2135fd200/md2x =1280x720)

After logging out and attempting to log in again, you'll be prompted for the second factor authentication code from your app after entering your password.

## Final thoughts

This guide covers fundamental capabilities. **The Ory ecosystem offers deeper features including seamless integration with different databases**, social logins, and migration guides from platforms like Auth0. The official Ory Kratos documentation provides comprehensive resources for exploring advanced features and leveraging this open-source tool in production applications. 

The modular architecture allows starting with basic authentication and progressively adding capabilities like OAuth 2.0 (via Ory Hydra) or complex authorization rules (via Ory Keto) as requirements evolve.