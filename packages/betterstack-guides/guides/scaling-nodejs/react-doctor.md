# React Doctor: Find React Anti-Patterns Fast

Writing clean, performant, and maintainable React code becomes significantly harder as applications scale. What starts as a simple component structure can quickly evolve into a complex system of hooks, shared state, third-party libraries, and deeply nested components. Over time, small compromises turn into anti-patterns, performance regressions, accessibility gaps, and architectural friction.

The challenge is not a lack of knowledge. Most developers understand React best practices. **The real difficulty lies in consistently applying them across an entire codebase, especially in fast-moving teams.** Manual reviews help, but they are time-consuming and rarely exhaustive.

This is where **React Doctor** enters the picture.

Built by Aiden Bai, the creator of tools like `million.js`, React Doctor is a high-performance CLI that scans your entire React project for anti-patterns, code smells, accessibility issues, and performance risks. **It acts as a specialized diagnostic tool for React applications, delivering precise and context-aware feedback at scale.**

In this guide, you will explore how React Doctor works, why its Rust-powered foundation makes it exceptionally fast, what kinds of issues it detects, and how to integrate it into personal projects, large monorepos, and CI pipelines. **By the end, you will understand how to systematically raise the quality of your React codebase with minimal friction.**

<iframe width="100%" height="315" src="https://www.youtube.com/embed/k3vyIIEZfU4" title="Better Stack Collector" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## What is React Doctor?

**At its core, React Doctor is a simple yet incredibly powerful static analysis tool.** You run a single command in your terminal, and it meticulously inspects your React project's source code, identifying potential issues and grading your codebase's overall health. It acts as an automated code reviewer, specifically trained to spot common mistakes in the React ecosystem.

### A high-level overview

React Doctor is designed to be a one-stop shop for diagnosing common React ailments. It scans your code for a curated list of well-known anti-patterns that developers, both new and experienced, often encounter. These include unnecessary `useEffect` Hooks (overusing `useEffect` for state derivations that could be calculated directly during render), accessibility issues (flagging missing `alt` attributes on images or other common accessibility violations), prop drilling (identifying when props are passed down through multiple layers of components), performance problems (detecting heavy library imports that could be code-split), and incorrect hook usage (ensuring that React Hooks are called in the correct order).

**By automatically detecting these issues, React Doctor saves developers countless hours of manual code review and debugging, allowing them to focus on building features.**

### The powerhouse under the hood: Oxlint and AST

**The secret to React Doctor's incredible speed and efficiency lies in the technology it's built upon.** Unlike many traditional linting tools that are written in JavaScript, **React Doctor leverages `Oxlint`, a high-performance linter built entirely in Rust.**

![A benchmark from the Oxlint documentation shows its remarkable speed, claiming to be 50 to 100 times faster than ESLint.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c7bc2c7f-6616-4c16-79c3-1fecd9b59900/lg1x =1280x720)

The choice of Rust is significant. Rust is a systems programming language known for its memory safety and raw performance, which allows `Oxlint` to process massive codebases (tens of thousands of lines of code) in mere milliseconds. This means you can run a full-project audit with React Doctor in the time it takes to fetch a cup of coffee, without interrupting your development flow.

But how does it actually understand your code? **React Doctor works by first parsing your entire project's source code into an Abstract Syntax Tree (AST).** An AST is a tree-like representation of the abstract syntactic structure of source code. Each node in the tree denotes a construct occurring in the code, such as a function declaration, a `div` element, or a hook call.

![The internal code of React Doctor shows a `walkAst` function, which is a classic example of a function designed to traverse, or "walk," through an Abstract Syntax Tree to inspect its nodes.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5e1727f5-1803-4762-fefd-be0825905000/lg2x =1280x720)

Once the AST is generated, React Doctor traverses this tree, applying its set of over 47 predefined rules. It looks for specific patterns and structures within the tree that correspond to known React anti-patterns. For example, it can find all instances of the `useEffect` hook, inspect their dependency arrays, and analyze the code inside them to determine if the effect is truly necessary. **This sophisticated approach allows it to provide highly accurate and context-aware feedback, going far beyond simple text-based searches.**

## Core features and capabilities

React Doctor is more than just a fast linter; it's a comprehensive diagnostic suite packed with features designed to provide maximum value to developers.

### Comprehensive rule set

**The intelligence of React Doctor comes from its extensive and growing library of rules, which are based on over 47 established best practices from the React community and official documentation.** These rules cover a wide spectrum of potential issues.

One of the most impressive features is its ability to scan for security vulnerabilities. For instance, it can detect accidentally hardcoded secrets like API keys or tokens. It uses regular expressions to look for common key formats and variable names that often contain sensitive information.

![A code snippet reveals the `SECRET_VARIABLE_PATTERN`, a regular expression used by React Doctor to identify variable names like `api_key`, `secret`, `token`, and `password`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8b522068-eaf7-4829-65d8-f3b42d14a800/md2x =1280x720)

This single feature can be a lifesaver, preventing developers from accidentally committing sensitive credentials to a public repository. It also has rules for performance, such as identifying when a loading state variable (e.g., `isLoading`, `isPending`) is used to guard a UI transition and suggesting the use of React's built-in `useTransition` hook for a better user experience.

### Intelligent and context-aware suggestions

**A key differentiator for React Doctor is that it doesn't just point out problems; it offers concrete, actionable solutions.** The feedback is designed to educate the developer on why something is an issue and how to fix it properly.

Consider these examples: The tool identified that the `recharts` charting library was a "heavy library" and explicitly recommended using `React.lazy()` or `next/dynamic` for code splitting. This advice directly addresses the problem of large initial bundle sizes and slow page loads. When it found four separate `setState` calls within a single `useEffect`, it suggested a more robust pattern: "consider using `useReducer` or deriving state." This guides the developer towards a more scalable state management architecture.

**This level of intelligent guidance transforms React Doctor from a simple error-checker into a valuable learning and mentorship tool.**

### User-friendly CLI and reporting

The developer experience of using React Doctor is exceptional. It presents its findings in a beautifully formatted, easy-to-read report directly in your terminal. The output includes a health score out of 100 (e.g., 98/100) with a qualitative label like "Great" or "Critical," cute ASCII art (a small, friendly ASCII face that changes based on your score), a clear summary (a breakdown of all identified issues, categorized by type and severity), and detailed explanations (each issue is listed with a clear explanation of the problem and a suggestion for how to fix it).

![The terminal output after the first scan, showing the "React Doctor" box with the score of 98/100, the "Great" label, the ASCII art face, and a summary of the 4 warnings found.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5c2ee2b-e29b-47aa-9aab-67e7315c5f00/md1x =1280x720)

This clear and concise reporting makes it easy to quickly triage issues and prioritize what to fix first.

### Advanced usage: coding agents and programmatic API

React Doctor is built for the modern development ecosystem. It can be integrated into your workflow in more advanced ways. You can install React Doctor's rules as a "skill" for AI-powered coding agents like Cursor, Claude Code, and GitHub Copilot. This gives your AI assistant access to the same diagnostic capabilities. The tool also exposes a Node.js API, allowing you to import and run the `diagnose` function programmatically within your own scripts. **This is incredibly useful for integrating automated code quality checks into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.**

## Putting React Doctor to the test

Seeing React Doctor in action demonstrates its capabilities on different types of projects.

### Installation and first run

**One of the best things about React Doctor is that there's no complex installation process.** You can run it directly in any project using `npx`, the Node Package Runner.

Here is the one-liner command to audit a project. Open your terminal, navigate to the root directory of your React project, and run:

```command
npx -y react-doctor@latest .
```

Breaking down this command: `npx` allows you to execute an npm package binary without having to install it globally or as a project dependency. `-y` automatically says "yes" to any installation prompts from `npx`, making the process seamless. `react-doctor@latest` specifies the package to run and ensures you are always using the most up-to-date version with the latest rules. `.` tells React Doctor to scan the current directory.

### Analyzing a legacy project

First, testing React Doctor on a small, older project demonstrates how well old coding patterns hold up against modern best practices.

Navigate to the directory of your legacy React project in your terminal. Execute the command `npx -y react-doctor@latest .`. React Doctor will quickly return a report. In one example, it scored 98/100 and found four warnings.

**Array Index as Key:** The tool flagged `Array index "i" used as key`. This is one of the most common anti-patterns in React. React uses the `key` prop to identify which items in a list have changed, are added, or are removed. When you use the array index as a key, reordering or filtering the list can confuse React. The tool correctly suggests using a "stable unique identifier" like `item.id` or `item.slug`.

**Heavy Library Import:** It noted that `"recharts" is a heavy library - use React.lazy() or next/dynamic for code splitting`. Importing a large third-party library directly means that its entire code is included in your main JavaScript bundle. Code splitting with `React.lazy` and `Suspense` allows you to load the library's code only when the component that needs it is actually rendered.

**Multiple `setState` Calls:** The report found `4 setState calls in a single useEffect` and recommended using `useReducer` or deriving state. While not strictly an error, having multiple related state updates in one effect can be a "code smell." The `useReducer` hook is designed for managing more complex state logic.

### Auditing a large-scale open-source project

Testing how React Doctor handles a large, modern, and complex codebase like the "twenty" open-source CRM demonstrates its performance and ability to navigate a monorepo structure.

First, get the project code from GitHub and move into the directory:

```command
git clone https://github.com/twentyhq/twenty.git
```

```command
cd twenty
```

Run the same command as before:

```command
npx -y react-doctor@latest .
```

**React Doctor will intelligently detect that this is a monorepo.** It will pause and present you with a list of all the packages within the project, allowing you to choose which one(s) you want to scan.

![The interactive prompt from React Doctor listing all the packages in the "twenty" monorepo, such as `twenty-front`, `twenty-server`, `twenty-ui`, etc.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/65b5222c-c8f3-434a-545c-70e5b6fcac00/md2x =1280x720)

First, selecting the `twenty-website` package reveals a high score of 92/100 with only one error: `Missing 'alt' attribute`. The `alt` attribute on an `<img>` tag is crucial for web accessibility. Screen readers use it to describe the image to visually impaired users.

Next, selecting the main front-end application, `twenty-front`, shows different results. A score of 78/100 with 99 errors and 294 warnings is not necessarily a sign of a "bad" project; rather, it highlights the reality of large-scale development where small issues can accumulate over time. **The sheer volume of actionable feedback generated in seconds demonstrates the immense value of the tool.**

## Leveraging React Doctor for your development workflow

React Doctor is not just a tool for one-time audits; it's a companion that can be integrated into your daily workflow to consistently improve your code.

### For personal projects

For your own projects, make it a habit to run React Doctor periodically. Run it before you commit your code as a final "sanity check" to ensure you haven't introduced any new anti-patterns. When you decide to refactor an old component or feature, start by running React Doctor. It will give you a targeted list of improvements to make.

### For team collaboration

In a team setting, React Doctor can be a powerful tool for enforcing code quality and standardizing practices. Use the programmatic API to add a React Doctor step to your CI/CD pipeline. This automates the code review process and provides immediate feedback on pull requests. When a new developer joins the team, have them run React Doctor on the codebase. It's a great way for them to learn the project's best practices.

### For open-source contributions

If you're looking to get involved in open-source development, React Doctor is your secret weapon. Many large projects can be intimidating to contribute to. This tool provides a clear path forward. Identify an open-source React project on GitHub that interests you, clone the repository and run React Doctor on it, sift through the report to find a manageable set of issues to tackle, and fix the issues in a new branch, submitting a well-documented pull request.

## Final thoughts

React Doctor represents a shift from reactive debugging to proactive code health management. It moves beyond surface-level linting and focuses on architectural correctness, performance awareness, accessibility, and established best practices.

Its combination of Rust-powered speed, AST-level precision, and actionable suggestions makes it practical for both small projects and large-scale monorepos. Whether you are auditing legacy components, reviewing pull requests, or contributing to open-source projects, **it provides immediate, structured insight into the health of your codebase.**

More importantly, React Doctor encourages continuous improvement. **Instead of discovering issues months later during refactors or performance audits, you surface them instantly and fix them while context is still fresh.**

If maintaining high standards in your React applications matters to you, integrating React Doctor into your workflow is a small step with outsized impact. **Run it once, review the report, and you may uncover opportunities for improvement you did not even realize existed.**