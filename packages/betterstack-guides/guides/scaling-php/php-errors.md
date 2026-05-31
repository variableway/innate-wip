# 12 Common Errors in PHP and How to Fix Them

While building PHP applications, encountering errors is a natural process and
you'll often spend considerable time scouring forums to find solutions to these
errors. But by anticipating and understanding these errors beforehand, you can
take a proactive stance to prevent them or resolve them more quickly when they
do occur.

This article aims to compile a thorough list of common PHP errors and suggest
effective resolution strategies. Although this list will not cover every
conceivable error, it offers a solid base and valuable tips for preventing and
tackling similar issues.

Let's get started!

## 1. Parse error

A parse error occurs when the interpreter encounters syntax that doesn't
comply with PHP's rules. This kind of error is typically triggered by:

- Quotes or parentheses that aren't closed properly.
- The use of illegal characters in variable names.
- Providing incorrect paths or non-existent files in `include`, `require`,
  `include_once`, or `require_once` statements.
- Using features that have been deprecated.
- Incomplete code blocks.
- Comments or HTML tags that are left unclosed.

For example, consider this code snippet where an opening single quote is missing:
```php
<?php
echo "Warning error"';
?>
```

This code will lead to a parse error similar to the following:

```text
[output]
Parse error: syntax error, unexpected string content "';", expecting "," or ";" in /home/user/scripts/code.php on line 2
```

To correct this error, ensure that you include the missing single quote at the beginning of the string, as shown below:

```php
<?php
echo '"Warning error"';
?>
```
Remember, various factors can trigger a parse error. Therefore, checking that parentheses and curly braces are both opened and closed correctly is essential. Avoid using illegal characters in your code and avoid incomplete code segments and deprecated features. Additionally, ensure that comments are correctly opened and closed.



## 2. Failed to open stream : No such file or directory

The `Failed to open stream error` warning error appears when using file-related directives such as `include()`, `fopen()`, or `require()`, particularly when these commands try to access a file. This error can arise if the specified file doesn't exist, if there's a typo in the file name, or if there are insufficient permissions to read the file. For instance, the following code snippet incorrectly references a non-existent file:

```php
<?php
include ("external_file.php");
?>
```

Since the `external_file.php` is missing or incorrectly specified, PHP will issue warnings like these:

```text
[output]
Warning: include(external_file.php): Failed to open stream: No such file or directory in /home/user/scripts/code.php on line 2

Warning: include(): Failed opening 'external_file.php' for inclusion (include_path='/home/user') in /home/user/scripts/code.php on line 2
```

To resolve this problem, verify the presence of the files you're trying to
include and double-check the accuracy of their file paths. Also, ensure that
file permissions are set appropriately, as they can restrict file access.

## 3. Cannot redeclare function

PHP produces the "Cannot redeclare function" error when it finds a function declared more than once. This situation can arise if the same function name is defined multiple times within the same file or if it's defined in a different file that's imported into your script. Additionally, the error can occur if an imported file is included more than once or if the function name clashes with a pre-existing built-in function. Here is an example where multiple definitions of the same function cause the error within a single file:

```php
<?php
function duplicateFunction() {
    // Function definition
}

function duplicateFunction() {
    // Function definition
}

?>
```

Executing this code results in PHP producing an error message similar to this:

```text
[output]
Fatal error: Cannot redeclare duplicateFunction() (previously declared in /home/user/scripts/code.php:5) in /home/user/scripts/code.php on line 7
```

To address this error, first ensure that a function isn't defined more than once in the same file. Also, be cautious about function definitions in any external files you include to prevent name clashes with functions in your main source code. If the error arises because the function is included multiple times, switch from `include` to [`include_once`](https://www.php.net/manual/en/function.include-once.php). This change ensures that the file is included only a single time.

Additionally, familiarity with PHP's built-in functions is essential to avoid accidentally defining functions with names that overlap with these built-ins.

If these methods don't resolve the issue, you can check if the function already exists before declaring it, as shown in the following snippet:

```php
if (!function_exists('your_function_name')) {
  function your_function_name() {
    // Function implementation
  }
}
```

## 4. Uncaught Error: Undefined constant

The `Uncaught Error: Undefined constant` error is thrown when you attempt to use a constant that hasn't been defined. This error also often happens due to a misspelling in the constant's name or mistakenly omitting the `$` symbol at the beginning of a variable name. Another common cause is neglecting to enclose a string in quotes, as seen in an example like `echo $_POST[username]`.

In the following example, you try to echo a constant that hasn't been previously defined:

```php
<?php
echo UNDEFINED_CONSTANT;
?>
```

Running this code leads to a PHP error message that reads:

```text
[output]
Fatal error: Uncaught Error: Undefined constant "UNDEFINED_CONSTANT" in /home/user/scripts/code.php:2
Stack trace:
#0 {main}
  thrown in /home/user/scripts/code.php on line 2
```

To resolve the error, define a constant before using it. Carefully check the variable name for typos and confirm that variable names are correctly prefixed with the `$` symbol. 

Additionally, remember to enclose string-based variable keys in quotes. For example, use `echo $_POST["username"]` instead of `echo $_POST[username]` to correctly reference a variable within an array or a string. 

## 5. Fatal error: Class not found

PHP emits the error when it fails to find a class definition within your code.
This issue might arise if the class is not defined, if there's a typo in the
class name, or if the class is defined in a file that has yet to be included or
required. In the following code snippet, you attempt to instantiate a class that has not been defined:

```php
<?php
$obj = new UndefinedClass();
?>
```

When this code is executed, PHP will return an error similar to:

```text
[output]
Fatal error: Uncaught Error: Class "UndefinedClass" not found in /home/user/scripts/code.php:2
Stack trace:
#0 {main}
  thrown in /home/user/scripts/code.php on line 2
```


To resolve this error, ensure that you define the class before attempting to use it. Additionally, carefully check for any spelling mistakes in the class name. It's also essential to verify that any external files containing the necessary class definitions are correctly included or required in your code. 

## 6. Fatal error: Uncaught Error: Call to undefined function

This error arises from critical problems within the code, like attempting to call a function that has yet to be defined or resulting from logical mistakes. It can often be traced back to simple errors such as misspelling the function name or neglecting to include the file containing the function's definition.

Consider the following example, where the `calculateMultiplication()` function is called, but it has not been defined:

```php
<?php
function calculateSubtraction()
{
    $result = 12 - 1;
    echo "The result of subtraction = " . $result;
}

// Attempting to call a function that hasn't been defined
calculateMultiplication();
?>
```

Executing this code leads to a fatal error like this:

```text
[output]
Fatal error: Uncaught Error: Call to undefined function calculateMultiplication() in /home/user/scripts/code.php:9
Stack trace:
#0 {main}
  thrown in /home/user/scripts/code.php on line 9
```

To rectify this error, ensure all functions you invoke are correctly defined. If they are defined in separate files, include or require those files in your current script. Also, double-check for spelling mistakes in your function names to confirm that there are no typos. 

## 7. Fatal error: Uncaught Error: Cannot use object of type class as array

The error is thrown when PHP detects an attempt to handle an object like an
array. This mistake is shown in the code below, where a class object's property
is wrongly accessed as an array element:

```php
<?php
class MyClass {
    public $property = "Hello, World!";
}

$obj = new MyClass();
echo $obj['property']; // Incorrect access
?>
```

Running this code leads to a fatal error message:

```text
[output]
Fatal error: Uncaught Error: Cannot use object of type MyClass as array in /home/user/scripts/code.php:7
Stack trace:
#0 {main}
  thrown in /home/user/scripts/code.php on line 7
```
To correct this issue, ensure that you are accessing a class property using the correct syntax, as shown in the following example:

```php
echo $obj->property; // Correct way to access a property
```

If direct property access is not feasible or requires a different approach, you can convert the object to an associative array using the `json_decode()` function. This is particularly useful when dealing with JSON objects. Here's how you can do it:

```php
...
$json_string = json_encode($obj); // Convert the object to a JSON string
$array = json_decode($json_string, true);
echo $array['property']; // Accessing the property as an array element
```



## 8. Fatal error: Uncaught ArgumentCountError: Too few arguments to function

The `Too few arguments to function` error is produced when a user-defined function or method is called with fewer arguments than required. Similarly, this error can happen with non-variadic built-in functions if they are called with more arguments than they are designed to accept. The following code snippet demonstrates this issue, where a function that is designed to accept two parameters is instead called with only one:

```php
<?php
function calculateRectangleArea($length, $width) {
    return $length * $width;
}

$area = calculateRectangleArea(5); // Missing second argument
?>
```

Running this snippet leads to an error like this:

```text
[output]
Fatal error: Uncaught ArgumentCountError: Too few arguments to function calculateRectangleArea(), 1 passed in /home/user/scripts/code.php on line 6 and exactly 2 expected in /home/user/scripts/code.php:2
Stack trace:
#0 /home/user/scripts/code.php(6): calculateRectangleArea(5)
#1 {main}
  thrown in /home/user/scripts/code.php on line 2
```


To fix this error, review your function calls to ensure that all required arguments are provided. This applies to both user-defined functions and built-in PHP functions. For built-in functions, familiarize yourself with their documentation to understand the number and types of arguments they accept.

## 9. Warning: Undefined Variable

PHP issues a warning when it detects the use of a variable that hasn't been defined. This error can occur if you omit the `$` symbol before the variable name. The following code snippet illustrates this situation, where an attempt is made to echo the contents of the `name` variable despite it not having been initialized:

```php
<?php
echo $name; // Undefined variable
?>
```

Executing this code will lead to a PHP warning message like this:

```text
[output]
Warning: Undefined variable $name in /home/user/scripts/code.php on line 2
```

To fix this issue, carefully examine your code to identify and define any undefined variables. Correct any spelling mistakes in your variable names and verify that the `$` symbol is correctly used before variable names. 

## 10. Warning: Cannot Modify Header Information - Headers Already Sent

This warning is often encountered when something is output before setting HTTP headers. Other causes include accidental whitespace at the beginning of a PHP file or [Byte Order Marks](https://en.wikipedia.org/wiki/Byte_order_mark) at the start. In the example below, text is output using `echo` before invoking the `header()` function:

```php
<?php
echo "Output before header";
header("Content-Type: text/plain");
?>
```

This sequence of operations leads to a warning message:

```text
[output]
Warning: Cannot modify header information - headers already sent by (output started at /home/user/scripts/code.php:1) in /home/user/scripts/code.php on line 3
```

To prevent this warning, thoroughly review your code to ensure no output, including accidental whitespace or Byte Order Marks, is sent before the header declarations. Ensuring that your PHP files start immediately with the `<?php` tag without any preceding spaces or characters is essential.

Another effective strategy is to use output buffering with `ob_start()` at the beginning and `ob_end_flush()` at the end of your script. This method captures all output and delays its release until the script has completed execution. By buffering the output, you can modify headers later in the script without triggering the warning, as the actual output to the browser is deferred until after all headers have been set.

## 11. Warning: Undefined Array Key "..."

The `Undefined Array Key "..."` error is generated when PHP detects an attempt to access an element of an array using a key that does not exist within that array. This problem frequently occurs due to typographical errors or when the accessed key has yet to be defined in the array. The following example demonstrates this issue, where an attempt is made to access `key2`, a key that hasn't been defined in the array:

```php
<?php
$array = array("key1" => "value1");
echo $array["key2"]; // Attempting to access a non-existent key
?>
```

This code snippet will result in a warning like this:

```text
[output]
Warning: Undefined array key "key2" in /home/user/scripts/code.php on line 3
```

To address this warning, carefully check your array keys to ensure they match
the keys present in your array. It's also wise to verify that the array is not
empty before accessing its elements, which helps avoid warnings related to
undefined array keys.

Furthermore, you can use the [Null Coalesce Operator](https://wiki.php.net/rfc/isset_ternary) as a convenient way to check for the existence of keys. This operator allows you to provide a default value in case the specified key is not found in the array, thus avoiding the warning. Here’s an example of how to use it:

```php
<?php
$value = $array['key2'] ?? 'default_value';
?>
```

In this snippet, if `'key'` does not exist in `$array`, `'default_value'` will be used instead, ensuring that your code handles missing keys gracefully and efficiently.


## 12. Warning: Attempt to Read Property "..." on String or Array
PHP issues a warning when a script tries to access a property on a variable that is not an object, such as a string or an array. This is because property access is only valid for object types. The following code snippet demonstrates this issue, where an attempt is made to access the `property` on a string variable:

```php
<?php
$nonObject = "Not an object";
echo $nonObject->property; // Incorrect property access on a string
?>
```

When this script is executed, it leads to the following warning:

```text
[output]
Warning: Attempt to read property "property" on string in /home/user/scripts/code.php on line 3
```

To correct this error, ensure you are not erroneously trying to access a property on a variable that is not an object, such as a string or an array. One way to confirm the nature of the variable is by logging its contents to ascertain whether it's a string, an array, or an object.

Another effective method is to use the [`is_object()`](https://www.php.net/manual/en/function.is-object.php) function in PHP to check if the variable in question is an object. This approach helps prevent the attempt to access properties on non-object types. Here's an example:

```php
<?php
$nonObject = "Not an object";

if (is_object($nonObject)) {
    echo $nonObject->property;
} else {
    // Handle the case where $nonObject is not an object
}
?>
```

## Using a Linter to Prevent Errors in PHP

Many of the errors discussed here can be proactively identified using a linter. A linter analyzes the code within your text editor or Integrated Development Environment (IDE) and alerts you to potential errors before the program is executed.

The following screenshot illustrates how a linter flags a parse error caused by an accidentally omitted opening single quote.

![Screenshot of a linter flagging parse error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/076479e9-7075-4014-2e0c-86b5fc372800/md1x=498x176)

Most text editors and IDEs can be configured with a PHP linter. Some popular PHP linters include:

- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer): This tool checks code for compliance with coding standards and can automatically correct code style issues.
- [PHPLint](https://github.com/overtrue/phplint): A linter that checks syntax errors and focuses on finding potential runtime errors and performance issues.

Integrating a linter into your development workflow effectively catches and resolves errors early, making your code more robust and reducing debugging time.

## Dealing with PHP errors in production

While proactive measures can reduce errors in PHP applications, complex
applications may still encounter issues in production. To effectively
troubleshoot and diagnose these issues, employing a logging system is essential.
PHP has [several logging frameworks](https://betterstack.com/community/guides/logging/best-php-logging-libraries/) that can be
integrated into your application.

Here's an example using the Monolog logging library in PHP:

```php
<?php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

try {
    $logger = new Logger("daily");

    $stream_handler = new StreamHandler("php://stdout");
    $logger->pushHandler($stream_handler);

    $logger->debug("This file has been executed.");

    $result = 10 / 0;

} catch (Exception $e) {
    $logger->error("Caught an exception: " . $e->getMessage());
}
?>
```

After creating the logs, you can consolidate them into a [central location for
log aggregation](https://betterstack.com/community/guides/logging/log-aggregation/), where you can then thoroughly review and
analyze the collected log data:

![Screenshot of Better Stack logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9f262700-3623-4162-5a48-7cf7d7ccca00/lg2x)

[Better Stack](https://betterstack.com/logs) offers a comprehensive suite for
log monitoring featuring advanced search capabilities, monitoring, and alert
systems. These tools can promptly notify you of errors, enabling quick
resolution and maintenance of your application's health.

![screenshot of an alert](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e3452e17-6ec1-4baf-398d-22488a70ee00/lg2x)

To begin using Better Stack,
[sign up for a free account](https://uptime.betterstack.com/users/sign-up) and
discover its ease of log management.

**Learn more**: [Getting Started with Monolog Logging in
PHP](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/)

## Final thoughts

Gaining insight into frequent PHP errors is crucial for their prevention and
prompt resolution. This article explored twelve common errors, offering
practical solutions for each. We highlighted the importance of implementing
logging as a critical strategy for identifying and diagnosing problems,
particularly in production environments.

For a thorough understanding of how to start with PHP logging, refer to our
detailed [guide on PHP logging](https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/). Additionally, if
you're selecting a logging tool, our
[comparative guide on PHP logging libraries](https://betterstack.com/community/guides/logging/best-php-logging-libraries/) reviews
several popular options to help you make an informed decision.

Thank you for reading, and we wish you successful and error-free coding!
