# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 10

# Time the startup of a minimal Zsh session
time zsh -c exit
# Example output (usually slightly slower than Bash):
# real    0m0.011s
# user    0m0.004s
# sys     0m0.007s

# Benchmark with Oh My Zsh loaded
time zsh -c 'source ~/.zshrc; exit'