# Source: https://betterstack.com/community/guides/observability/ebpf-observability/
# Original language: python
# Normalized: python
# Block index: 9

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