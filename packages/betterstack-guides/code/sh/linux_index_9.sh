# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 9

# Time the startup of a minimal Bash session
time bash -c exit
# Example output:
# real    0m0.006s
# user    0m0.001s
# sys     0m0.004s

# Benchmark a loop in Bash
time bash -c 'for i in {1..1000}; do echo $i > /dev/null; done'