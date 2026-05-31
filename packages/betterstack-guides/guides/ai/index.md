# Zero: A Systems Programming Language with JSON-Native Diagnostics for AI Agents

[Zero](https://zerolang.ai/) is a compiled systems programming language from Vercel. It **targets the same space as Rust and Zig: performance-critical applications with explicit memory control and no mandatory garbage collector**. Its distinguishing feature is a toolchain built from the start to output structured JSON, making compiler diagnostics machine-readable without text parsing.

![zerolang.ai homepage showing "For humans" and "For agents" tabs emphasizing dual-purpose design](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/62f3593b-8e92-46f4-5aa4-8f402dcf9800/md1x =1280x720)

## Why a new language

<iframe width="100%" height="315" src="https://www.youtube.com/embed/Koop0_nkNtc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>



Compiler error messages are designed for humans: colorized text, natural language explanations, and contextual formatting. AI agents parsing these messages are performing an unstructured text extraction task, which introduces misinterpretation risk. Zero's toolchain outputs the same diagnostic information as JSON, giving AI agents a deterministic, structured data source rather than formatted prose.

Every tool in the Zero toolchain (`zero check`, `zero fix`) accepts a `--json` flag that switches output from human-readable to machine-readable format. This is a first-class design decision rather than an afterthought.

## Language basics

Zero source files use the `.0` extension.

### Hello World

```zero
pub fun main(world: World) -> Void raises {
    check world.out.write("hello from zero\n")
}
```

![Hello Zero code example in a dark-themed editor](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/33a244a4-a948-404b-2cd7-d63e4ef31e00/md2x =1280x720)

Breaking this down:

- `pub fun main(...)`: `pub` makes the function public; `fun` declares a function; `main` is the program entry point by convention
- `(world: World)`: the `World` capability parameter, required for any I/O
- `-> Void raises`: `Void` return type; `raises` declares the function as failable
- `check world.out.write(...)`: `check` propagates errors from failable calls upward to the caller

### Capabilities and explicit side effects

`World` is a capability type. A function that performs any I/O (console, file system, network, environment variables) must declare a `world: World` parameter. A function without this parameter is guaranteed to have no side effects.

![Slide reading "Explicit: Effects & Memory" and "Local reasoning first"](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/37a3db1f-61b7-4e66-bea3-ff7863690e00/orig =1280x720)

This provides two practical benefits. First, a function's signature immediately signals whether it interacts with external systems. Second, the compiler catches capability mismatches at compile time: using a file system capability when targeting WebAssembly is a compile error, not a runtime surprise.

### Error handling with `raises` and `check`

Functions that can fail are marked `raises`. Callers must handle the potential error. The `check` keyword propagates errors: if the called function raises, the current function immediately raises the same error to its own caller. This is similar to Rust's `?` operator. Errors cannot be silently ignored; the compiler requires acknowledgment of every failure path.

### Running a program

```command
zero run hello.0
```

### Data structures

Zero provides enums for variant types and shapes (structs) for grouped data:

```zero
enum Kind {
    text,
    mixed,
}

shape Stats {
    letters: i32,
    digits: i32,
    other: i32,
}
```

### Memory management

Zero uses an ownership model without a garbage collector. `Span` and `MutSpan` are safe, bounded pointers to memory regions (read-only and mutable respectively). When an `owned` variable goes out of scope, its `drop` function is called automatically (RAII). The `defer` keyword runs a statement just before the current function exits, for localized cleanup.

## JSON-native diagnostics in practice

### Standard output

Running `zero check` on a file with errors produces human-readable text:

![Terminal output showing a standard text-based error message designed for human reading](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4904c58-8c97-41f5-b529-5a28ffb25900/lg1x =1280x720)

### JSON output

Adding `--json` produces structured data:

```command
zero check --json classify-broken.0
```

![Terminal showing a comprehensive JSON object detailing the error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e89b847f-a51a-4ba9-3df5-f60ee8309a00/lg2x =1280x720)

The JSON output includes:

- `"ok": false`: unambiguous pass/fail flag
- `"diagnostics"`: array of error objects, each containing `"message"`, `"path"`, `"line"`, `"column"`, `"expected"`, `"actual"`, and a `"repair"` object with a machine-readable fix `"id"` and `"summary"`

### AI agent debugging demonstration

A demonstration using Claude (with no prior Zero training) shows the workflow: the agent runs `zero fix --plan --json` on a broken file, receives the structured diagnostic and fix plan, identifies three distinct bugs (a missing shape field, an immutable variable being mutated, and a failable call missing `check`), and applies all fixes in approximately 30 seconds.

The agent succeeded without prior training on Zero because the structured output contained all necessary context: error type, location, expected values, and proposed repair IDs. No natural language parsing was required.

## Comparison with existing approaches

JSON compiler output is not unique to Zero. The Rust compiler supports `cargo build --message-format=json`, which produces a similar stream of structured diagnostic data used by IDE tooling via the Language Server Protocol.

The practical difference is intent. In Rust, JSON output is one option among several. In Zero, it is the foundational design principle that shaped the entire toolchain. Whether this distinction justifies a new language is a reasonable question.

Zero also faces a cold-start problem: the structured toolchain is its main advantage over general-purpose LLMs working with established languages, but those LLMs are effective with Rust and Python precisely because they have been trained on vast existing codebases, documentation, and forums. Zero has none of that yet.

## When to use Zero

Zero is at an early, experimental stage. It is **well-suited for AI agent research (structured diagnostics make it an ideal sandbox for agentic coding experiments) and language design study** (capabilities, explicit error handling, and ownership without a borrow checker are genuinely interesting design choices). For production systems, Rust, Zig, and Go offer significantly more stability, library support, and community.

The ideas in Zero's toolchain, particularly the first-class JSON diagnostic format, could influence how other language toolchains approach AI agent integration. That influence may prove more significant than Zero's adoption as a standalone language.

Documentation is at [zerolang.ai](https://zerolang.ai/).