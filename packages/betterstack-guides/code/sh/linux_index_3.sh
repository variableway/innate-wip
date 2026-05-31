# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 3

# Basic directory navigation in Bash
cd /path/to/directory
cd ..    # Move up one directory
cd -     # Toggle between current and previous directory

# Command history navigation
history              # Show command history
!42                  # Execute command #42 from history
!!                   # Execute previous command
!string              # Execute most recent command starting with "string"
Ctrl+R               # Reverse search through history

# Basic tab completion
cd Doc<Tab>          # Completes to "Documents/" if unique

# Directory operations
mkdir -p new/nested/directory
pushd /tmp           # Push directory onto stack and change to it
popd                 # Pop directory from stack and change to it