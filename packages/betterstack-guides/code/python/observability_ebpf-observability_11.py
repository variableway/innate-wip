# Source: https://betterstack.com/community/guides/observability/ebpf-observability/
# Original language: python
# Normalized: python
# Block index: 11

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