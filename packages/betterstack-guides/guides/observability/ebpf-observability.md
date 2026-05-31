# Introduction to eBPF for Observability

In today's world of intricate software systems, where microservices and distributed architectures reign supreme, **observability is critical for maintaining operational efficiency and performance**.

**eBPF stands for extended Berkeley Packet Filter.** It has emerged as a revolutionary technology that provides unprecedented visibility into the inner workings of the Linux kernel, **helping you monitor, troubleshoot, and optimize applications and infrastructure**.

This guide introduces eBPF for observability and covers core concepts, practical examples, and popular tools.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/wQKjCDD7nfk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



## What is eBPF?

eBPF is a technology that allows you to run **small, specialized programs within
the Linux kernel**. These programs, often referred to as "eBPF programs" or "BPF
programs", are triggered by various events occurring within the kernel, such as
system calls, network events, or function calls. This capability provides a
powerful and efficient mechanism to observe and analyze system behavior in
real-time.

**eBPF programs are typically written in a restricted C dialect**, although other
languages like Rust are gaining popularity. The code is then compiled into
bytecode and loaded into the kernel using a loader program. Before execution,
the kernel meticulously verifies these programs for safety, ensuring that they
cannot crash the system or introduce instability.

eBPF represents an evolution of the
[original Berkeley Packet Filter (BPF)](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter),
a technology introduced in 1993 to provide a simple way to filter network
packets within the kernel. While BPF was limited to network-related tasks, **eBPF
extends its capabilities to a wide range of use cases, including observability,
security, and tracing**.

[ad-logs]

## Why Choose eBPF for observability?

eBPF has revolutionized system observability by addressing traditional
monitoring challenges while providing unique advantages over other kernel
extension methods. Here are the key benefits:

- **Efficiency and performance**: eBPF programs execute directly within the
  kernel, minimizing overhead while maximizing performance. Unlike traditional
  user-space monitoring tools that require context switches and data copying,
  eBPF programs can directly access kernel data structures, resulting in
  significant performance gains.

- **Dynamic and flexible deployment**: eBPF programs can be loaded and unloaded
  dynamically without kernel recompilation or system reboots. This eliminates
  the deployment complexity of traditional monitoring agents that often require
  code changes, recompilation, or application restarts.

- **Deep visibility with safety**: eBPF provides unparalleled access to system data, including system calls, network packets, and function arguments, while running in a sandboxed environment. The eBPF verifier helps keep the system stable by checking programs before they run, preventing issues like infinite loops or memory corruption that can occur with traditional kernel modules.

- **Developer-friendly**: Compared to kernel modules, eBPF programs are
  typically smaller, easier to write, and more accessible to developers. They
  don't require the deep understanding of kernel internals needed for kernel
  module development, yet they provide similar levels of functionality and
  better safety guarantees.

This combination of features makes eBPF particularly well-suited for modern
observability needs, offering a solution that is both powerful and practical for
production environments.


[summary]
### Instrument tracing without code changes
Try [Better Stack Tracing](https://betterstack.com/tracing/) and instrument your Kubernetes or Docker workloads without code changes. Start ingesting traces in about 5 minutes.

**Predictable pricing and up to 30x cheaper than Datadog.** Start free in minutes.

[/summary]


![Better Stack Tracing bubble up view highlighting the root cause of a slow request](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea6d6faf-b150-4ef2-0765-02113ea7b100/md2x =4160x2378)

## Prerequisites

Before you can use eBPF, ensure you have the following prerequisites in place:

- A recent version of [Python installed](https://www.python.org/downloads/).
- Linux kernel 4.18 or newer. Newer kernels include more eBPF capabilities.
- Root or `CAP_SYS_ADMIN`: Many eBPF tools need elevated privileges to load
  programs into the kernel.
- Tools: We'll install bpftool, bcc, and others as we go.

Check your kernel version with:

```command
uname -r
```

```text
[output]
6.12.11-200.fc41.x86_64
```

## Setting up your environment

Let's install some foundational tools to interact with eBPF.

### Install bpftool

bpftool is a Swiss Army knife for managing eBPF programs and maps.

On Ubuntu/Debian:

```command
sudo apt update
sudo apt install -y linux-tools-common linux-tools-$(uname -r)
```

On Fedora:

```command
sudo dnf install bpftool
```

Verify installation:

```command
bpftool version
```

```text
[output]
bpftool v7.5.0
using libbpf v1.5
features: llvm, skeletons
```

### Install BCC 

BCC is the BPF Compiler Collection and provides Python bindings and tools to write eBPF programs.

On Ubuntu:

```command
sudo apt install -y bpfcc-tools
```

On Fedora:

```command
sudo dnf install -y bcc-tools
```

Test it:

```command
sudo python3 -c "import bcc; print('BCC installed!')"
```

You'll also see the tools in `/user/share/bcc/tools`:

```command
ls -l /usr/share/bcc/tools/
```

```text
[output]
.rwxr-xr-x@   37k root 17 Jul  2024  argdist
.rwxr-xr-x@  2.8k root 17 Jul  2024  commandreadline
.rwxr-xr-x@   16k root 17 Jul  2024  bindsnoop
.rwxr-xr-x@   11k root 17 Jul  2024  biolatency
.rwxr-xr-x@   10k root 17 Jul  2024  biolatpcts
.rwxr-xr-x@  4.0k root 17 Jul  2024  biopattern
.rwxr-xr-x@   11k root 17 Jul  2024  biosnoop
.rwxr-xr-x@  9.6k root 17 Jul  2024  biotop
. . .
```

## Writing your first eBPF program

This section introduces a simple example to demonstrate basic eBPF
functionality. The code is:

```python
[label hello_world.py]
from bcc import BPF

# Load BPF program
bpf = BPF(text="""
int kprobe__sys_clone(void *ctx) {
    bpf_trace_printk("Hello, World!\\n");
    return 0;
}
""")

# Attach kprobe to sys_clone
bpf.attach_kprobe(event="sys_clone", fn_name="kprobe__sys_clone")

# Print trace messages
bpf.trace_print()
```

In this snippet, a kprobe is attached to the `sys_clone` system call which
prints "Hello, World!" each time it's called.

To run, save as `hello_world.py`, ensure BCC is installed, and execute with
`sudo`:

```command
sudo python3 hello_world.py
```

The output will show "Hello, World!" messages whenever `sys_clone` is called,
typically during process creation, as seen below:

![Hello world in ebpf](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e0228a8f-8d05-4036-1adc-090281c2f300/public =3182x1352)

This demonstrates eBPF's ability to run custom code in the kernel when specific
events occur. You may quit the process with `Ctrl-C` before proceeding to the
next section

## Using eBPF for Observability

eBPF is particularly powerful for observability, enabling the collection of
detailed, real-time data from the Linux kernel with minimal overhead, ideal for
monitoring system performance, network activity, and application behavior.

Let’s write a simple eBPF program that counts system calls. In this example, we will track `openat` and watch the metrics update in real time.

Create a Python script called `syscalls.py`:

```python
from bcc import BPF

# eBPF program in C
program = """
#include <uapi/linux/ptrace.h>
BPF_HASH(syscall_count, u64, u64); // Hash map to store counts

int count_syscalls(struct pt_regs *ctx) {
   u64 pid = bpf_get_current_pid_tgid();
   u64 counter = 0;
   u64 *val;

   val = syscall_count.lookup(&pid);
   if (val) {
       counter = *val;
   }
   counter++;
   syscall_count.update(&pid, &counter);
   return 0;
}
"""

# Load the eBPF program
b = BPF(text=program)
b.attach_kprobe(event="sys_openat", fn_name="count_syscalls")

# Print counts every second
print("Counting syscalls... Press Ctrl+C to stop")
while True:
   try:
       for k, v in b["syscall_count"].items():
           print(f"PID {k.value}: {v.value} syscalls")
       b["syscall_count"].clear()  # Reset counts
       sleep(1)
   except KeyboardInterrupt:
       print("Done!")
       exit()
```

Run it as root:

```command
sudo python3 syscalls.py
```

Generate some syscalls in another terminal:

```command
ls /tmp  # Triggers openat syscalls
```

You'll see PIDs and their syscall counts updated every second. This is a basic
metric collection example!

Next, let's see how eBPF compares with with
[OpenTelemetry](https://betterstack.com/community/guides/observability/what-is-opentelemetry/).

## Comparing eBPF with OpenTelemetry

| Aspect                     | OpenTelemetry                                 | eBPF                                     |
| -------------------------- | --------------------------------------------- | ---------------------------------------- |
| **Stack implementation**   | User space       | Kernel space   |
| **Performance impact**     | Higher overhead, but rich application context | Minimal overhead, highly efficient       |
| **Framework structure**    | APIs, SDKs, and collection mechanisms         | Unified framework within Linux kernel    |
| **Platform availability**  | Supports all major OS                         | Linux only (Windows support in progress) |
| **Practical implications** | Best for application telemetry                | Best for system-level insights           |

Understanding the fundamental differences between OpenTelemetry and eBPF is
crucial for implementing effective observability solutions. While both
technologies aim to enhance system visibility, they operate in distinct ways and
serve different purposes.

Let's look at the main differences below:

### 1. Stack implementation

OpenTelemetry integrates directly with applications in the user space, providing
granular application-level insights. In contrast, eBPF operates at the kernel
level, offering deep system-level visibility without requiring application
modifications.

### 2. Performance impact

eBPF's kernel-level operation enables highly efficient data collection with
minimal overhead. OpenTelemetry, operating primarily in user space, may
introduce slightly more overhead but provides richer application context.

### 3. Framework structure

OpenTelemetry provides a comprehensive ecosystem of tools, including APIs, SDKs,
and collection mechanisms. eBPF, by comparison, is a unified framework embedded
within the Linux kernel, offering streamlined functionality.

### 4. Platform availability

While OpenTelemetry supports all major operating systems, eBPF currently
operates exclusively on Linux. However, ongoing development efforts, including
Microsoft's Windows port, may expand its availability in the future.

### 5. Practical implications

When designing observability solutions, organizations often find value in
combining both approaches: using OpenTelemetry for detailed application
telemetry and eBPF for efficient system-level insights. This complementary
strategy provides comprehensive visibility across the entire technology stack.

Note that some emerging tools bridge these technologies, such as OpenTelemetry
collectors with eBPF capabilities, offering the best of both worlds for specific
use cases.

## Integrating eBPF with OpenTelemetry

While OpenTelemetry traditionally operates in user space to gather observability
data, an innovative approach combines it with eBPF's kernel-level capabilities.
The
[OpenTelemetry eBPF project](https://github.com/open-telemetry/opentelemetry-network)
enables direct kernel-level data collection while maintaining compatibility with
OpenTelemetry's broader ecosystem of observability tools.

This integration offers powerful benefits: you gain eBPF's efficient
kernel-level monitoring while retaining the flexibility to export data to any
OpenTelemetry-compatible platform. However, it's worth noting that this
integration is still maturing. The available collectors support specific use
cases rather than providing the comprehensive flexibility of custom eBPF
programs.

The OpenTelemetry eBPF ecosystem consists of four key components:

1. **Kernel monitoring**: The kernel-collector monitors system events at the
   kernel level, transmitting collected data to a designated remote endpoint
   configured through environment variables.

2. **Kubernetes integration**: For container orchestration environments, the
   [k8s-collector](https://github.com/open-telemetry/opentelemetry-network/blob/main/docs/kernel-collector.md)
   specializes in monitoring Kubernetes-specific events, such as pod lifecycle
   changes, and forwards this data to centralized collection points.

3. **Cloud platform monitoring**: The
   [cloud-collector](https://github.com/open-telemetry/opentelemetry-network/blob/main/docs/cloud-collector.md)
   interfaces with major cloud providers (currently AWS and GCP), gathering
   platform-specific observability data to provide insights into cloud resource
   behavior.

4. **Data translation layer**: The
   [reducer](https://github.com/open-telemetry/opentelemetry-network/blob/main/docs/reducer.md)
   serves as a critical bridge, transforming raw eBPF data into OpenTelemetry's
   metric format. This component ensures that data collected through eBPF
   integrates seamlessly with existing OpenTelemetry workflows and visualization
   tools.

Despite its current limitations, this integration represents an optimal approach
for organizations looking to leverage both technologies' strengths. It
particularly suits use cases where kernel-level visibility needs to coexist with
standardized observability practices.

## How the OpenTelemetry integration works

When you need to gather network observability data at the kernel level while
maintaining compatibility with OpenTelemetry-based tools, the kernel-collector
component provides a streamlined solution. Here's a comprehensive guide to
setting up this integration.

#### 1. Building the components

The first phase involves compiling two essential tools: the `kernel-collector`
and the `reducer`. Both components use a containerized build process for
consistency and simplicity. The build environment can utilize either a custom
container or a pre-configured image, with the actual compilation handled by
provided build scripts.

You can check the
[OpenTelemetry-eBPF documentation](https://github.com/open-telemetry/opentelemetry-network/blob/main/docs/developing.md)
to find the compilation steps for each component.

#### 2. System deployment

After successful compilation, the deployment process follows a specific
sequence:

First, initialize the `reducer` with your desired output configuration. For
example, you can configure it to format data for Prometheus consumption or other
OpenTelemetry-compatible formats.

```command
reducer --prom
```

Next, configure the `kernel-collector` by setting essential environment
variables:

- Specify the reducer's location using `EBPF_NET_INTAKE_HOST`.
- Define `reducer`'s the communication port with `EBPF_NET_INTAKE_PORT`.

```command
EBPF_NET_INTAKE_HOST=127.0.0.1
```

```command
EBPF_NET_INTAKE_PORT=8080
```

### 3. Operating the system

Once configured, launch both components to establish the data pipeline:

- The `kernel-collector` gathers system-level network data through eBPF.
- The `reducer` transforms this data into OpenTelemetry-compatible formats.
- Your chosen observability platform can then consume the processed data.

The system supports various data export methods, including direct scraping and
forwarding to OpenTelemetry collectors via gRPC. This flexibility allows
integration with existing observability infrastructures while maintaining the
benefits of kernel-level data collection.

The exact configuration options and advanced features are detailed in the
project's documentation, allowing for customization based on specific monitoring
requirements.

## eBPF observability tools to explore

Modern observability requires deep system insights without compromising
performance. eBPF-based tools provide this power, and when combined with
OpenTelemetry, they offer both depth and standardization. Let's explore five
leading solutions, with each one serving different observability needs.


### Better Stack
[Better Stack Tracing](https://betterstack.com/tracing/) makes it easy to instrument Kubernetes or Docker workloads with eBPF so you can **collect logs, metrics, and network traces without touching your application code**.

You can ship everything through our remotely managed eBPF collector, then keep an eye on its throughput and tune sampling, compression, and batching as your needs change.

And when your telemetry is too wide or contains sensitive fields, you can use VRL transforms to redact personally identifiable information or drop noisy events entirely so you only keep what is useful.


### Grafana Beyla

[Beyla](https://grafana.com/oss/beyla-ebpf/) excels at providing instant
visibility into HTTP and gRPC services without code modifications. It
automatically captures key metrics like request rates, errors, and durations
(RED metrics) using eBPF, while offering seamless export options to both
OpenTelemetry and Prometheus.

Beyla's strength lies in its simplicity and lightweight nature. The recent v1.3
release enhanced its OpenTelemetry integration with HTTP context propagation,
though its current scope remains focused on HTTP/gRPC protocols.

### Odigos

[Odigos](https://github.com/odigos-io/odigos) brings automated distributed tracing to Kubernetes environments,
leveraging eBPF to generate detailed traces without requiring application
modifications. It seamlessly integrates with OpenTelemetry-compatible systems
like [Jaeger](https://betterstack.com/community/guides/observability/jaeger-guide/).

While Odigos requires a Kubernetes environment, it significantly simplifies the
tracing setup process compared to manual instrumentation approaches.

### Coroot

[Coroot](https://coroot.com/) provides a holistic view of Kubernetes environments, generating service
maps, metrics, and traces through eBPF. Its OpenTelemetry integration enables
standardized data export.

Its service mapping capabilities make it particularly valuable for understanding
service dependencies and identifying performance bottlenecks within clusters.

### Pixie

Pixie automates Kubernetes application monitoring using eBPF, capturing metrics,
traces, and dynamic logs. Its OpenTelemetry export capabilities ensure
compatibility with existing observability stacks.

Its strength lies in its scriptability through PxL and efficient resource usage,
though it's exclusively designed for Kubernetes environments.

### Cilium

While primarily known for networking, [Cilium](https://cilium.io/) provides powerful network-level
observability through eBPF. Its Hubble component offers detailed metrics and
traces, making it particularly valuable for understanding network behavior.

Each tool serves different observability needs while leveraging eBPF's
capabilities. The choice depends on your specific requirements and
infrastructure context.

## Final thoughts

You have now run eBPF programs to collect metrics, logs, and traces, and explored tools like Better Stack, Beyla, Odigos, Coroot, and Pixie. For deeper learning, explore:

- [The official eBPF site](https://ebpf.io/) with projects and docs.
- [Learning eBPF](https://www.amazon.com/Learning-eBPF-Programming-Observability-Networking/dp/1098135121) by Liz Rice.
- The [OpenTelemetry docs](https://opentelemetry.io/docs/).

eBPF has revolutionized observability in Linux systems, **providing powerful capabilities for monitoring, troubleshooting, and optimization**.

If you want to put what you learned into practice right away, try [Better Stack Tracing](https://betterstack.com/tracing/) to collect OpenTelemetry traces with eBPF, get an out-of-box service map, and investigate slow requests without code changes.

By understanding and **leveraging eBPF, you can gain unprecedented visibility into your systems** while maintaining performance and security.

Thanks for reading!