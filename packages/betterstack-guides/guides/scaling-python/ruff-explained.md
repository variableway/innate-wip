# Linting with Ruff: A Fast Python Linter

[Ruff](https://github.com/charliermarsh/ruff) is a fast Python linter and code formatter written in Rust that has rapidly gained popularity in the Python ecosystem. 

It includes all the standard features expected in any linting framework, such as style checking, error detection, and automatic code fixing capabilities. 

<iframe width="100%" height="315" src="https://www.youtube.com/embed/UviMQ7Muuko?si=Bj89eJfSzTA38oNY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

This article will guide you through setting up and configuring Ruff for your Python project. You'll leverage the framework's many features and customize them to achieve an optimal configuration for your specific use case.

Let's get started!

[ad-logs]

## Prerequisites

Before proceeding with the rest of this article, ensure you have a recent version of [Python](https://www.python.org/downloads/) (3.12+) and `pip` installed locally on your machine. This article assumes you are familiar with basic Python development practices.

## Getting started with Ruff

To get the most out of this tutorial, you will set up a new Python project to try out the concepts we will discuss.

Start by creating a new directory and setting up a virtual environment:

```command
mkdir ruff-demo && cd ruff-demo
```

```command
python3 -m venv venv
```

Activate the virtual environment:

```command
source venv/bin/activate
```

Now, install Ruff using pip:

```command
pip install ruff
```

Let's create a simple Python file with some intentional issues that we can fix with Ruff. Create a file named `app.py` and add the following problematic code:

```python
[label app.py]
import sys
import os
import json

def add_numbers( a,b ):
    """Add two numbers together."""
    result=a+b
    return result

def unused_function():
    """This function is never used."""
    pass

x = 10
y = 20
print(add_numbers(x,y))
```

This code has several issues that Ruff can detect, including:

- Unused imports
- Inconsistent spacing
- Unused functions
- Missing type hints

Run Ruff to see what it finds:

```command
ruff check app.py
```

You should see output similar to the following:

```text
[output]
app.py:1:8: F401 [*] `sys` imported but unused
  |
1 | import sys
  |        ^^^ F401
2 | import os
3 | import json
  |
  = help: Remove unused import: `sys`

app.py:2:8: F401 [*] `os` imported but unused
  |
1 | import sys
2 | import os
  |        ^^ F401
3 | import json
  |
  = help: Remove unused import: `os`

app.py:3:8: F401 [*] `json` imported but unused
  |
1 | import sys
2 | import os
3 | import json
  |        ^^^^ F401
  |
  = help: Remove unused import: `json`

Found 3 errors.
[*] 3 fixable with the `--fix` option.
```

Ruff has identified several issues in your code and even indicates they can be automatically fixed using the `--fix` option. Try fixing them:

```command
ruff check --fix app.py
```
```text
[output]
Found 3 errors (3 fixed, 0 remaining).
```

Running this command triggers Ruff to fix all issues, and it can resolve them automatically. Examining the modified file reveals the following changes:

```python
[label app.py]

def add_numbers(a, b):
    """Add two numbers together."""
    result = a + b
    return result


def unused_function():
    """This function is never used."""
    pass


x = 10
y = 20
print(add_numbers(x, y))
```

After running Ruff, the improvements are immediately apparent. Ruff removed unused imports, fixed spacing around operators and commas, and properly formatted function parameters for better readability. 

The only issue it didn't address was the unused function, as it cannot determine whether it is intentional.


## Configuring Ruff

With the initial issues in `app.py` already fixed, you might wonder if there's anything left to configure. While Ruff works well out of the box, fine-tuning its settings ensures it aligns with your project's specific style and conventions.

Setting up a configuration file allows you to gain more control over which rules Ruff enforces and how it formats your code. Ruff supports configuration through a `pyproject.toml` file, a common convention in modern Python projects.

Create a `pyproject.toml` file in your project's root directory:

```command
touch pyproject.toml
```

Open the `pyproject.toml` file in your text editor and start with a basic configuration:

```toml
[label pyproject.toml]
[tool.ruff]
# Enable basic checks
lint.select = ["E", "F"]
```

This configuration enables:

- `E`: Style errors from pycodestyle
- `F`: Logic and syntax errors from pyflakes

Now, run Ruff again on your already-fixed code:

```command
ruff check app.py
```

```text
[output]
All checks passed!
```

No issues should be reported, as you've already fixed the basic style and logic errors.

Let's see what happens when you try to check for import sorting issues. 

First, modify `app.py` to introduce imports that are used but unsorted:

```python
[label app.py]
import datetime
from pathlib import Path
import math
from collections import defaultdict
import json

def add_numbers(a, b):
    """Add two numbers together."""
    result = a + b
    return result

def get_current_time():
    """Get the current time."""
    return datetime.datetime.now()

def read_config():
    """Read configuration from a JSON file."""
    config_path = Path("config.json")
    if config_path.exists():
        return json.loads(config_path.read_text())
    return {}

def calculate_stats(values):
    """Calculate statistics for a list of values."""
    stats = defaultdict(int)
    stats["sum"] = sum(values)
    stats["average"] = stats["sum"] / len(values)
    stats["sqrt_sum"] = math.sqrt(stats["sum"])
    return stats

x = 10
y = 20
print(add_numbers(x, y))
print(get_current_time())
print(calculate_stats([1, 2, 3, 4, 5]))
```

Run Ruff with your current configuration:

```command
ruff check app.py
```

```text
[output]
All checks passed!
```

Notice that Ruff doesn't report any issues with the imports, even though they're unsorted. That's because you haven't enabled the import sorting rules yet.

Update your configuration to include them:

```toml
[label pyproject.toml]
[tool.ruff]
# Enable basic checks and import sorting
lint.select = ["E", "F", "I"]  # Added "I" for import sorting
```

Now run Ruff again:

```command
ruff check app.py
```

One of the first issues Ruff will flag is related to unsorted imports:

```text
[output]

app.py:1:1: I001 [*] Import block is un-sorted or un-formatted
  |
1 | / import datetime
2 | | from pathlib import Path
3 | | import math
4 | | from collections import defaultdict
5 | | import json
  | |___________^ I001
  |
  = help: Organize imports

Found 1 error.
[*] 1 fixable with the `--fix` option.
```

Now Ruff reports a new issue: `I001`, indicating unsorted imports. Let's fix these issues automatically:

```command
ruff check --fix app.py
```

```text
[output]
Found 1 error (1 fixed, 0 remaining).
```

After running this command, your `app.py` should look like this:

```python
[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path

...
```

Notice how Ruff has properly sorted the imports:

1. Standard library imports first (`datetime`, `json`, `math`) 
2. Third-party imports would come next (none in this example)
3. First-party imports and relative imports last (`collections`, `pathlib`)
4. All imports are alphabetically sorted within their groups
5. Import statements (`import x`) come before from-imports (`from x import y`)

This demonstrates the power of Ruff's import sorting capabilities, which can maintain a consistent import style across your entire codebase.


### Adding Bugbear rules for better error detection

Let's enhance your configuration to catch more subtle bugs and design issues. The "B" ruleset from Bugbear helps identify common pitfalls that other linters might miss, such as mutable default arguments, unused loop variables, and redundant comparisons.

```toml
[label pyproject.toml]
[tool.ruff]
# Add Bugbear rules for catching bugs and design problems
[highlight]
lint.select = ["E", "F", "I", "B"]
[/highlight]
```

Now, modify your `app.py` to include issues that Bugbear rules will detect:

```python
[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path

# Existing functions remain unchanged
...

[highlight]
def process_items(items=[]):  # Bugbear will flag mutable default argument
    """Process a list of items."""
    return [x for x in items for y in items]  # Bugbear will flag nested comprehension
[/highlight]

x = 10
y = 20
print(add_numbers(x, y))
print(get_current_time())
print(calculate_stats([1, 2, 3, 4, 5]))
```

Run Ruff to see what issues it detects:

```command
ruff check app.py
```

```text
[output]
app.py:36:25: B006 Do not use mutable data structures for argument defaults
   |
36 | def process_items(items=[]):  # Bugbear will flag mutable default argument
   |                         ^^ B006
37 |     """Process a list of items."""
38 |     return [x for x in items for y in items]  # Bugbear will flag nested comprehension
   |
   = help: Replace with `None`; initialize within function

Found 1 error.
No fixes available (1 hidden fix can be enabled with the `--unsafe-fixes` option).
```

The first issue, B006, warns against mutable default arguments. Python initializes them once at function definition, causing all calls to share the same instance, which can lead to unexpected behavior.  

The second issue, B007, flags an unused loop variable in the nested comprehension. The second loop variable `y` isn't used, suggesting a potential bug or misunderstanding of nested loops.


Now fix the issues with better coding practices:

```python
[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path

# Existing functions remain unchanged
...

[highlight]
def process_items(items=None):  # Fixed: use None instead of mutable default
    """Process a list of items."""
    if items is None:
        items = []
    return [x for x in items]  # Fixed: simplified comprehension
[/highlight]
# Rest of the code remains unchanged
...
```

```text
[output]
All checks passed!
```

### Enforcing type annotations

Type annotations improve code readability and help catch type-related bugs early. Adding the "ANN" ruleset to your configuration ensures your code is properly annotated with types:

```toml
[label pyproject.toml]
[tool.ruff]
# Add type annotation rules
[highlight]
lint.select = ["E", "F", "I", "B", "ANN"]
[/highlight]
```

With this configuration, Ruff will check for missing parameter types, return types, and other annotation issues. Let's run it on our `app.py`:

```command
ruff check app.py
```

```text
[output]
...
app.py:7:1: ANN001 [*] Missing type annotation for function argument `a`
app.py:7:1: ANN001 [*] Missing type annotation for function argument `b`
app.py:7:1: ANN201 [*] Missing return type annotation for function
...
app.py:29:1: ANN001 [*] Missing type annotation for function argument `items`
app.py:29:1: ANN201 [*] Missing return type annotation for function
Found 9 errors.
[*] 9 fixable with the `--fix` option.
```

Type annotations serve as documentation, making understanding what a function expects and returns easier. They also enable better IDE support and allow tools like MyPy to perform static type checking. Let's add annotations to some of our functions:

```python
[label app.py]
import datetime
import json
import math
from collections import defaultdict
from pathlib import Path
[highlight]
from typing import Any, Dict, List, Optional
[/highlight]

[highlight]
def add_numbers(a: float, b: float) -> float:
[/highlight]
    """Add two numbers together."""
    result = a + b
    return result

[highlight]
def get_current_time() -> datetime.datetime:
[/highlight]
    ....

[highlight]
def read_config() -> Dict[str, Any]:
[/highlight]
    ...

[highlight]
def calculate_stats(values: List[float]) -> Dict[str, float]:
[/highlight]
    ...
[highlight]
def process_items(items: Optional[List[str]] = None) -> List[str]:
[/highlight]
    ...
```
Now, each function clearly defines expected input and return types.

Run Ruff again to make sure you've addressed all the type annotation issues:

```command
ruff check app.py
```
Ruff should no longer complain about missing type annotations:

```text
[output]
All checks passed!
```
### Customizing line length and excluding files

As your project grows, you may want to customize Ruff's behavior to match your team's preferences. Setting a custom line length can be necessary if you prefer slightly longer lines than the default, and excluding directories prevents Ruff from wasting time checking files that shouldn't be linted.

```toml
[label pyproject.toml]
[tool.ruff]
select = ["E", "F", "I", "B", "ANN"]
[highlight]
line-length = 88  
# Exclude directories
exclude = [
    ".git",
    ".mypy_cache",
    ".ruff_cache",
    "venv",
    "__pycache__",
]

# Target Python version
target-version = "py312"
[/highlight]
```

This configuration maintains the recommended default line length but you can change it if needed. 

It also excludes common directories like virtual environments and cache folders, and sets Python 3.12 as the target version.

Ruff will only suggest features and fixes that are compatible with Python 3.12, ensuring your code remains compatible with your runtime environment.


### Per-file rule ignores

Different parts of your codebase may require different linting rules. For example, `__init__.py` files often contain intentionally unused imports used for re-exporting symbols, and test files may not need type annotations. 

You can configure these exceptions using per-file ignores:

```toml
[label pyproject.toml]
[tool.ruff]
select = ["E", "F", "I", "B", "ANN"]
line-length = 88
exclude = [
    ".git",
    ".mypy_cache",
    ".ruff_cache",
    "venv",
    "__pycache__",
]
target-version = "py312"

[highlight]
[[tool.ruff.lint.per-file-ignores]
# Ignore unused imports in __init__.py files
"__init__.py" = ["F401"]
# Ignore missing type annotations in tests
"test_*.py" = ["ANN"]
[/highlight]
```

This approach allows you to maintain strict standards across your main codebase while accommodating special cases without compromising overall code quality.


## Using Ruff as a code formatter

Beyond linting, Ruff can also format your code automatically. Ruff's formatter is designed to be compatible with Black, the popular Python formatter, while offering significantly better performance.

Using Ruff for both linting and formatting helps simplify your toolchain and ensures consistent code style across your project


The formatter is invoked using the `format` command:

```command
ruff format filename.py
```

Create a new file with a command-line editor of your choice to avoid auto-indentation for this example. Add the following code with some formatting issues to see how Ruff's formatter works:

```python
[label messy.py]
def add_numbers(a,b,   c):
    return a+b+c
x = { 'key1' :42,'key2':    100 }
```
The code has multiple formatting issues, including inconsistent spacing around commas, operators, and colons, improper dictionary formatting with uneven spacing, missing blank lines between definitions, and single quotes instead of double quotes for strings.



Now, run Ruff's formatter on this file:

```command
ruff format messy.py
```

After formatting, your `messy.py` file should look much cleaner:

```python
[label messy.py (after formatting)]
def add_numbers(a, b, c):
    return a + b + c


x = {"key1": 42, "key2": 100}
```

Ruff has automatically fixed all these issues:

- Added consistent spacing after commas in function parameters
- Added spacing around operators in the return expression
- Added a blank line between the function and variable assignment
- Standardized the dictionary formatting with no spaces after { or before }
- Converted single quotes to double quotes for strings
- Added consistent spacing around colons in key-value pairs

These formatting improvements make your code more readable and consistent, following Python best practices like PEP 8.

One of Ruff's strongest features is its ability to both lint and format code. Instead of using multiple tools (like Flake8 for linting and Black for formatting), you can simplify your toolchain with just Ruff:

```command
ruff check app.py && ruff format app.py
```
```text
[output]
All checks passed!
1 file left unchanged
```
Combining these commands in your workflow provides the benefits of comprehensive linting and consistent formatting within a single tool.



## Integrating Ruff with pre-commit hooks

After configuring Ruff for linting and formatting, the next step is to automate these checks in your development workflow.

 Pre-commit hooks provide an excellent way to ensure code quality standards are met before each commit.

Since your project directory isn't currently a Git repository, you'll need to initialize one first:

```command
git init
```

Next, create a `.gitignore` file to exclude unnecessary files from version control:

```text
[label .gitignore]
# Virtual environment
venv/

# Python cache files
__pycache__/
*.py[cod]
*$py.class

# Distribution / packaging
dist/
build/
*.egg-info/

# Ruff cache
.ruff_cache/

# Other common exclusions
.DS_Store
```

With your Git repository initialized, you can now set up pre-commit hooks:

```command
pip install pre-commit
```

Create a pre-commit configuration file named `.pre-commit-config.yaml` to integrate Ruff for both linting and formatting:


```yaml
[label .pre-commit-config.yaml]
repos:
-   repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.2.0
    hooks:
    -   id: ruff
        args: [--fix]
    -   id: ruff-format
```

This configuration defines two hooks:

- `ruff`: Runs the linter with automatic fixes enabled
- `ruff-format`: Applies formatting to your code

Install the hooks into your Git repository:

```command
pre-commit install
```

You should see output confirming the installation:

```text
[output]
pre-commit installed at .git/hooks/pre-commit
```


First, remove all the code in `app.py` to verify that your setup works correctly. Then, introduce some rule violations to test your configuration:

```python
[label app.py]
import math
import json
import datetime  # Unsorted imports

def problematic_function( x,y):  # Spacing issues
    result=x+y  # Missing spaces around operator
    return result
```

Now stage your changes and try to commit them:

```command
git add app.py
```
```command
git commit -m "Test pre-commit hooks"
```

The pre-commit hooks should run automatically and fix the issues:

```text
[output]

[INFO] Initializing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Installing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
ruff.....................................................................Failed
- hook id: ruff
- exit code: 1
- files were modified by this hook

app.py:3:5: ANN201 Missing return type annotation for public function `problematic_function`
app.py:3:26: ANN001 Missing type annotation for function argument `x`
app.py:3:29: ANN001 Missing type annotation for function argument `y`
Found 6 errors (3 fixed, 3 remaining).

ruff-format..............................................................Failed
- hook id: ruff-format
- files were modified by this hook

1 file reformatted
```

While Ruff fixed some issues (like spacing and formatting), it still reports errors related to missing type annotations, which require manual fixes.

To fix those issues, add the necessary type annotations:

```python
[label app.py]
[highlight]
def problematic_function(x: float, y: float) -> float:  # Added type annotations
[/highlight]
    result = x + y
    return result
```
Stage your changes again:

```command
git add app.py
```
```command
git commit -m "Test pre-commit hooks"
```
```text
[output]
ruff.....................................................................Passed
ruff-format..............................................................Passed
[master (root-commit) f1926e6] Test pre-commit hooks
 1 file changed, 3 insertions(+)
```
This time, the commit should succeed.

In some situations, you might need to bypass the pre-commit hooks temporarily:

```command
git commit -m "Emergency fix" --no-verify
```

However, this should be used sparingly and only in exceptional circumstances.

## Final thoughts

This guide covered setting up Ruff, automating fixes, enforcing coding standards, and improving development workflows. For more advanced configurations and features, visit the [official Ruff documentation](https://github.com/charliermarsh/ruff). 

Thanks for reading!