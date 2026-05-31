# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 4

# Enhanced directory navigation in Zsh
cd /p/t/d<Tab>       # Smart completion to "/path/to/directory"
cd ...<Tab>          # Expands to "../.." (grandparent directory)
/u/l/b<Tab>          # Expands to "/usr/local/bin"

# Auto-CD feature (no need for 'cd' command)
~/Documents          # Changes to ~/Documents directory

# Extended history with substring search
history              # Show command history
!42                  # Execute command #42 from history
Alt+Up/Down          # Search history based on current input

# Directory operations
take new/nested/dir  # Creates and enters directory in one command
d                    # Show directory stack with numbers for quick access
cd -<Tab>            # Interactive selection from directory history

# Advanced globbing (pattern matching)
ls -l **/*.txt       # Find all .txt files recursively
ls ^*.o              # List files that don't end with .o
rm -rf ^important/   # Remove all except 'important' directory