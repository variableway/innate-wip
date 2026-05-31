# Best Logging Practices for Safeguarding Sensitive Data

Data breaches have become a pressing concern in our interconnected world,
emphasizing the critical need to protect sensitive information. Logs act as
significant repositories of sensitive data. When fall into the wrong hands, they
can pose substantial security risks. These logs often contain personally
identifiable information (PII), financial details, authentication credentials,
and other sensitive data. Logging such information without proper safeguards,
such as encryption or redaction, opens the door to data breaches, unauthorized
access, identity theft, and non-compliance with legal and regulatory
requirements.

This article aims to highlight the utmost importance of keeping sensitive data
from logs. We'll explore a range of methods and strategies that can be
implemented to safeguard information while ensuring the smooth functioning and
integrity of log management systems. By adopting these measures, organizations
can enhance their overall security posture and safeguard sensitive data.

[summary]

Side note: Watch Better Stack Live Tail in action

Stream logs in real time with Better Stack, then filter, group, and zoom in on the exact event you need.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]
## What is sensitive data

Before delving into different methods for excluding sensitive data from logs,
let's first discuss what data types should be classified as sensitive. Its
definition may vary depending on the context, but here are some common types of
data that are generally considered sensitive:

- **Personally Identifiable Information (PII)**: Information that can bes used
  to identify an individual, such as full name, social security number, date of
  birth, address, phone number, email address, or government-issued
  identification numbers.
- **Financial Information**: Such as bank account numbers, credit card numbers,
  payment card information, financial statements, and so on.
- **Health and Medical Information**: Information that are protected under
  healthcare regulations, such as patient records, medical history, health
  conditions, prescriptions, etc.
- **Authentication Credentials**: Usernames, passwords, security
  questions/answers, or any other information used for authentication purposes.
- **Confidential Business Data**: Trade secrets, intellectual property,
  proprietary algorithms, financial forecasts, marketing strategies, or any
  other sensitive business-related information that could harm the organization
  if disclosed or compromised.
- **Legal and Compliance Data**: Legal documents, contracts, non-disclosure
  agreements, court records, or any information that must be protected to comply
  with legal and regulatory requirements.
- **Personal Communications**: Private messages, emails, or chat logs that
  contain sensitive or confidential information.
- **Biometric Data**: Fingerprints, facial recognition data, iris scans, or any
  other unique physical or behavioral characteristics used for identification
  purposes.

You should note that data sensitivity can vary depending on the specific context
of your business or organization, as well as the applicable compliance
requirements. While the aforementioned types of data are generally considered
sensitive, it is crucial to assess the sensitivity of data based on your unique
circumstances.

You should consider the following factors before logging any data:

- Business Impact: Reflect on the potential consequences for your business if
  the logged data were to fall into unauthorized hands. Assess the risks
  associated with data breaches, including financial losses, reputational
  damage, or competitive disadvantage.

- Customer Impact: Evaluate the potential harm that could be inflicted upon your
  customers if their sensitive data were compromised. Consider the impact on
  their privacy, security, and trust in your organization.

- Compliance Obligations: Examine the relevant regulations and data compliance
  requirements that pertain to your industry or geographic location. Determine
  if logging the specific data in question would breach any legal or regulatory
  obligations, such as GDPR, CCPA, HIPAA, or others that may apply.

Establishing robust data protection measures and adhering to relevant compliance
requirements are vital for maintaining the trust of your customers and
safeguarding your business. By critically evaluating the aforementioned factors,
you can make informed decisions about logging sensitive data while considering
the potential risks and ensuring compliance with applicable data protection
regulations.

In the following sections, we will go over some common methods that you can use
to avoid logging sensitive data and prevent data leaks. These methods will help
you strike a balance between collecting necessary information for
troubleshooting and monitoring purposes while protecting sensitive user data.

## 1. Exclude sensitive data from your code

The most straightforward approach to keep sensitive data out of logs is to avoid
logging them in the first place. Make sure to adopt the data minimization
principle and only log the necessary information while excluding any sensitive
data.

![code-review.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0c4ccd81-dc2c-4e2b-4755-d65303d16c00/lg2x =631x434)

Conducting regular code reviews is crucial in identifying and rectifying
potential issues related to logging sensitive data. By paying special attention
to logging calls during code review, you can proactively detect and address any
unintentional logging of sensitive information.

You should also make sure that the code has been thoroughly tested before
pushing it to production. Through testing, you can verify that sensitive data is
not being logged accidentally. In addition, test cases should be designed to
explicitly check for the presence of sensitive data in log outputs, helping to
prevent data leakage and ensure compliance with data protection regulations.

There are many ways you may create a test for sensitive data in logs. In
general, you can't retrieve the log entry directly, but you can create a
software component that saves the previous log entry, and then scans the log
entry for sensitive information. Take [Logback](https://betterstack.com/community/guides/logging/java/logback/) as an example, you can
create a custom appender:

```java
[label TestAppender.java]
package com.example;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class TestAppender extends ListAppender<ILoggingEvent> {
    public void reset() {
        this.list.clear();
    }

    public boolean contains(String string) {
        return this.list.stream()
          .anyMatch(event → event.toString().contains(string));
    }
}
```

This `TestAppender` extents to the
`ListAppender`,
which captures log events in memory, and provides a convenient way to access and
inspect log events programmatically. The `TestAppender` also includes a
`contains()` method, which checks for the presence of a string in the log
record.

Next, create a new class that generates different log records:

```java
[label LogGenerator.java]
package com.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogGenerator {
    private static Logger LOGGER = LoggerFactory.getLogger(LogGenerator.class);

    public void generateLogs(String msg) {
        LOGGER.trace(msg);
        LOGGER.debug(msg);
        LOGGER.info(msg);
        LOGGER.warn(msg);
        LOGGER.error(msg);
    }
}
```

And finally, create the test case:

```java
[label AppTest.java]
package com.example;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;

/**
 * Unit test for simple App.
 */
public class AppTest {
    private TestAppender testAppender;
    private static final String MSG = "Order shipped. Destination: xxxxxxxxxx";

    @Before
    public void setup() {
        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        testAppender = new TestAppender();
        testAppender.setContext((LoggerContext) LoggerFactory.getILoggerFactory());
        logger.setLevel(Level.DEBUG);
        logger.addAppender(testAppender);
        testAppender.start();
    }

    @Test
    public void test() {
        LogGenerator worker = new LogGenerator();
        worker.generateLogs(MSG);

        assertFalse(testAppender.contains("Destination"));
        // assertTrue(testAppender.contains("Destination"));
    }
}
```

The `setup()` method runs before the tests are created, in order to prepare the
logger. The `test()` method use the `contains()` method to test if the word
`Destination` is present in the log record. The user's addresses are usually
considered sensitive.

Execute the test with the following command, and it should tell you the test is
not successful, since we have the word `Destination` in the log.

```command
mvn test
```

```text
[output]
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< com.example:logback-demo >----------------------
[INFO] Building logback-demo 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
. . .
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.example.AppTest
. . .
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.139 s <<< FAILURE! - in com.example.AppTest
[ERROR] test(com.example.AppTest)  Time elapsed: 0.12 s  <<< FAILURE!
java.lang.AssertionError
        at com.example.AppTest.test(AppTest.java:36)

[INFO]
[INFO] Results:
[INFO]
[ERROR] Failures:
[ERROR]   AppTest.test:36
[INFO]
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0
. . .
```

Remove the destination from the test log message and try again, and it should
return a success.

## 2. Masking/Redacting sensitive data

If you must log sensitive data for reference, consider masking or redacting
them. Both masking and redacting are methods used to conceal sensitive data in
text messages, although they differ in their approach.

Redacting involves the complete hiding or removal of sensitive information. By
redacting data, it is permanently eliminated, preventing unauthorized access and
ensuring the utmost protection of sensitive information. On the other hand,
masking replaces sensitive data with placeholders while retaining some level of
usability or readability for specific purposes or authorized individuals.

Let's start by talking about log redaction. As we've discussed before, redaction
will completely remove sensitive information. For example, the following log
entry contains the user password, which should not be included.

```text
{"message": "A user just logged in.", "username": "jack", "password": "pswd123"}
```

To prevent the password from leaking, you could redact the information.

```text
{"message": "A user just logged in.", "username": "jack", "password": "[REDACTED]"}
```

And now it is safe to log the message.

Many logging frameworks, such as
[Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/), offer
built-in features that allow you to redact information, while others require a
bit more coding. They can be implemented differently based on your specific
requirements.

As an example, when [logging in Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/), you
could create a custom log filter to redact sensitive data.

```python
class RedactFilter(logging.Filter):
    def __init__(self, keys_to_redact):
        super().__init__()
        self.keys_to_redact = keys_to_redact

    def filter(self, record):
        if hasattr(record, "msg"):
            try:
                log_data = record.msg
                for key in self.keys_to_redact:
                    if key in log_data:
                        log_data[key] = "REDACTED"
                record.msg = log_data
            except json.JSONDecodeError:
                pass
        return True
```

Make sure you add this filter to your logger before the log statements:

```python
import logging
import json
from pythonjsonlogger import jsonlogger


logger = logging.getLogger(__name__)

logger.setLevel(logging.DEBUG)

formatter = jsonlogger.JsonFormatter()

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

logger.addHandler(stream_handler)

[highlight]
# Define sensitive keys to redact
keys_to_redact = ["password"]

redact_filter = RedactFilter(keys_to_redact)
logger.addFilter(redact_filter)
[/highlight]

log_data = {
    'message': 'A user just logged in.',
    'email': 'jack@gmail.com',
    'password': 'pswd123',
}

logger.info(log_data)
```

```text
[output]
{"message": "A user just logged in.", "email": "jack@gmail.com", "password": "REDACTED"}
```

You should note that sensitive information, such as passwords, credit card
numbers, and so on, should not be included in the logs and should be removed in
the code review process. This example is only for demonstration purposes.

When selecting a logging framework, it is preferable to opt for frameworks that
include built-in log redaction features. In certain cases, you may find
third-party packages like [logredactor](https://pypi.org/project/logredactor/),
which enables log redaction functionality. However, this package is not
widely-used, so please exercise caution when implementing it.

Sometimes, it may be necessary to use data masking techniques instead of
complete redaction, allowing for partial concealment of sensitive information.
For example, leaving the user's email address in the log is not a safe practice,
as it is the user's personal information. Instead, you could mask part of the
email and leave only the end for reference.

![log-masking.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/520e794b-a8a3-4f55-5d2d-b75745871800/md1x =450x257)

```python
class MaskFilter(logging.Filter):
    def __init__(self, keys_to_mask):
        super().__init__()
        self.keys_to_mask = keys_to_mask

    def filter(self, record):
        if hasattr(record, "msg"):
            try:
                log_data = record.msg
                for key in self.keys_to_mask:
                    if key in log_data:
                        log_data[key] = mask_value(log_data[key])
                record.msg = log_data
            except json.JSONDecodeError:
                pass
        return True


def mask_value(value):
    return re.sub(r"^([^@]+)", "******", str(value))
```

This example uses regular expression (`^([^@]+)`) to match any characters before
`@`, which will be replaced with `******`.

Add this filter to your logger, and it will give you the following output:

```text
[output]
{"message": "A user just logged in.", "email": "******@gmail.com", "password": "REDACTED"}
```

## 3. Tokenize sensitive data

Tokenization is another effective technique for concealing sensitive information
in logs. Unlike masking, which removes sensitive data completely, tokenization
generates random representations (tokens) of the original data. These tokens are
then logged instead of the actual sensitive information. Using tokens, the logs
can maintain the necessary context and structure while ensuring the
confidentiality of sensitive data. This approach enhances security by allowing
you to work with log data without exposing sensitive information.

![tokenization.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f1850747-c582-47be-2a86-e9e48ce54300/orig =1482x278)

There are many ways you could implement tokenization. For instance, you can
create a helper method to generate a random token:

```javascript
function generateToken() {
  const tokenLength = 10;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}
```

This example generates a random fixed-length token. You need to replace the raw
data with this token before the information is logged. The exact method of
implementation depends on the logging framework you are using. Take Pino, a
popular JSON logger for Node.js, as an example. You could create a custom
serializer to process the message before it is logged.

```javascript
const logger = pino({
  serializers: {
    logData: (data) => {
      const tokenizedData = { ...data };
      const fieldsToTokenize = ["credit_card"]; // Specify what fields to tokenize
      for (const field of fieldsToTokenize) {
        if (data[field]) {
          tokenizedData[field] = generateToken(); // Replace field value with a token
          saveToken(token, data[field]); // Save the token/data pair in a data vault
        }
      }
      return tokenizedData;
    },
  },
});

function generateToken() {
  . . .
}

function saveToken(token, data) {
  . . .
}
```

When logging with this logger, the `credit_card` field will be replaced with a
token.

```javascript
const logData = {
  message: "A payment has been made.",
  credit_card: "1234-5678-9876-5432",
};

logger.info({ logData });
```

```text
[output]
{"level":30,"time":1685725299857,"pid":58486,"hostname":"Erics-MacBook-Pro.local","logData":{"message":"A payment has been made.","credit_card":"fHdCE6poQH"}}
```

It is essential to understand that the provided solution is not the sole
approach, and the implementation can vary based on the specific needs of your
application. For instance, you can develop a middleware associated with the
logger or a helper method that handles the tokenization of sensitive data before
logging it. The critical aspect is ensuring that the sensitive information is
appropriately tokenized before being logged, regardless of the chosen
implementation approach. Ultimately, the focus should be on achieving the
desired outcome of safeguarding sensitive data within the logging process.

The tokenization technique is usually accompanied by the isolation of the
sensitive data, meaning instead of including sensitive data in the log messages
themselves, you can store such data separately and reference it using tokens in
the log messages.

![isolating-data.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/122625fe-001f-4a01-9ec1-9db0704f7b00/lg2x =1283x613)

Notice that in the previous example, a `saveToken()` function is created to save
the token/data pair into a data vault. The exact implementation of this function
depends on the technology you are using, but the idea is to create a secure data
vault where sensitive information is stored, and then generate a random but
unique token to reference each piece of sensitive information. You must ensure
that appropriate access controls and encryption mechanisms are in place to
protect the data vault.

Next, you use tokens to replace the raw data when crafting the log message, as
we've discussed. You should also maintain a lookup table that links the token to
the original data. And again, you must ensure this lookup table is only
accessible to authorized individuals.

And lastly, when it becomes necessary to access the sensitive data, retrieve it
securely from the data vault using the corresponding token. This ensures that
sensitive information remains protected while still allowing authorized
individuals to access it as required.

## 4. Encrypting data transmission

Log transmission represents a potential vulnerability for data security. When
employing a logging architecture where logs are transferred to a central log
management platform, there is a risk of interception during transmission. To
minimize this risk, it is crucial to use encrypted transmission.

![encrypting-data-transition.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ab7c131f-00e7-47f3-fab9-ac4a493c4700/md1x =848x213)

Encrypting log transmission helps protect the confidentiality and integrity of
the data. By implementing encryption protocols, you can ensure that logs are
securely transmitted from source to destination. This minimizes the possibility
of unauthorized access or tampering during transit. Some common methods to
enhance transmission security include:

- **Utilize TLS/SSL protocols** to establish secure connections between systems.
  These protocols encrypt the data during transit, ensuring confidentiality and
  preventing unauthorized access.
- **Implement strong authentication mechanisms** to ensure that only authorized
  parties can access the encrypted data. Properly manage and safeguard the
  encryption keys used in the encryption and decryption processes. This includes
  secure storage, key rotation, and strict access controls to prevent
  unauthorized key usage.
- **Create data integrity verification mechanisms** to verify the integrity of
  log data during transmission. Implement techniques such as digital signatures
  or hash functions to ensure that log files remain intact and unaltered during
  transfer.

By these safety measures during data transmission, you can ensure the
confidentiality and integrity of sensitive information, preventing it from being
exposed. It forms a crucial part of a comprehensive data security strategy,
complementing other security measures and minimizing the risk of unauthorized
access or data breaches.

[ad-logs]

## 5. Keeping sensitive data out of URLs

When considering data security, URLs is easily overlooked, yet they can pose a
risk in data leaks. It is common practice for web applications to log URLs
during request handling, potentially including sensitive information. For
example, if the URL has the pattern:

```text
http://www.example.com/<id>/<address>
```

When logging this URL, you will risk exposing the user's address. To minimize
the risk, you could employ one of the masking, redacting, or tokenizing
techniques we discussed previously to process this URL before logging it.

In addition, another effective approach is to leverage the `POST` method instead
of `GET` for transmitting sensitive information. Unlike the `GET` method, which
appends the data to the URL, the `POST` method allows you to send the data
within the body of the request. This enables you to apply additional security
measures such as encrypting the data using the HTTPS protocol. By using the
`POST` method, you can minimize the likelihood of sensitive information being
logged by various software components, as the data remains encapsulated within
the request body and is not exposed in the URL.

## 6. Implementing access control

![access-control.excalidraw.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/abddc1a9-5686-42f5-bfd0-a4fc3cb94a00/orig =696x420)

Implementing robust access control measures is crucial for restricting access to
sensitive information in logs. One practical approach is establishing a
role-based access control system, assigning roles and permissions to users based
on their responsibilities. Additionally, it is essential to enforce strong
password policies and consider implementing multi-factor authentication to
enhance the security of user accounts.

You could store all sensitive data in a dedicated data storage that incorporates
robust access control mechanisms. This ensures that only administrators or
authorized users with proper credentials can access the sensitive information,
while unauthorized individuals are denied access. Additionally, implementing an
alerting system is crucial to promptly identify and respond to any unauthorized
login attempts, such as those involving incorrect passwords or unrecognized
accounts.

By implementing these access control measures and prioritizing the security of
your infrastructure, you can effectively restrict access to sensitive
information, strengthen user authentication and safeguard the confidentiality
and integrity of your logs.

## 7. Frequent log audits

Ensuring regular review and auditing of logs is essential to identify and
eliminate any accidental or unintended logging of sensitive data. This practice
helps maintain compliance with privacy regulations and ensures the integrity of
logs by keeping them free from sensitive information.

As the volume of logs generated by enterprise-level applications can be
overwhelming, manual review of each log entry becomes impractical. In such
scenarios, employing a log management tool such as
[Better Stack](https://betterstack.com/logs) is highly recommended.

Better Stack is a cloud-based platform designed to simplify log management
processes. It offers features like easy search, filtering, and log data
analysis, enabling efficient navigation through logs, rapid retrieval of
relevant information, and setting alerts and notifications for critical events.
By leveraging a log management tool, you can effectively handle large log
volumes, streamline log analysis, and proactively monitor your application's
logs.

By incorporating regular log reviews and utilizing a robust log management tool,
you can ensure compliance, maintain the integrity of logs, and efficiently
manage log data to align with best practices and industry standards.

## 8. Automating alerts

To enhance sensitive data detection and alerting, you can implement an automated
alerting service that scans existing logs for any instances of sensitive
information. This service will notify your team whenever sensitive data is
detected, complementing the log auditing process we discussed earlier. However,
it is important to note that this method should not completely replace log
audits.

The common information that should be included in the alert include timestamp,
name of the host, line number, user information, and so on. By incorporating
automated alerts with these crucial details, you can proactively identify and
address any instances of sensitive data appearing in logs, facilitating quick
response and remediation to mitigate potential risks. It complements the log
audits by providing real-time notifications for immediate action.

Setting up such a system manually might be too much trouble, and instead, you
could rely on a log management platform such as
[Better Stack](https://betterstack.com/logs), which allows you to centralize all
of your logs in the cloud for easier processing, analyzing, monitoring and
alerting. It will significantly simplify log management, enhance operational
efficiency, and ensure seamless log handling across your entire infrastructure.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


To set up an alert for sensitive data on Better Stack, simply go to the **Live
tail** tab and type in a search query. For example:

```text
message.email!=null AND message.email!:"******" OR message.password!=null message.password!=REDACTED
```

![search-query.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f722fa87-e65a-45df-fe42-06dc69029600/md2x =2728x1852)

This example query looks for logs that matches the following criteria:

- Logs that have a `email` field (`message.email!=null`) AND the email has not
  been masked (`message.email!:"******"` means the email does NOT contain the
  characters `******`).
- OR logs that have a password field (`message.password!=null`) AND the password
  has NOT been redacted (`password!=REDACTED`).

This search query should include all logs that contain sensitive data. Save this
search view by clicking **Save as a view**.

![save-view.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0e855f86-bd42-4139-3b73-e8c067da6e00/public =2728x1852)

![save-as-view.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/988918d1-f927-4c33-9605-a565208b3700/lg2x =1930x216)

Then go to **Alerts**, and create a new alert.

![new-alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/08338182-2ddb-407e-db85-cad17d0a5d00/lg1x =2728x1852)

For the **When should we trigger the alert?** section, you need to select the
view we just created, and then select the filter based on your own need. To be
absolutely save, it is best to choose to be alerted when there is **more than 0
lines of log entry within 30 seconds**.

![alert-trigger.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b5d31dac-1bab-4d12-63c4-bc182f7a6700/lg2x =1976x1138)

Also choose who should be alerted, and save the alert.

![alert-member.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fe1ae198-bff6-4c7b-8481-f20d3935eb00/public =1984x332)

If sensitive data has been leaked into your logs, the team member you choose
will receive the alert.

![email-alert.png](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/82127c64-ad50-425e-cdd5-2866740da700/lg1x =2762x1600)

[summary]

## Side note: Visualize your logs in Better Stack

Stop grepping and tailing files when something breaks. Better Stack centralizes your logs, lets you slice them by fields, and turns recurring questions into dashboards you can share with your team.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="Better Stack video: Visualize logs and build dashboards" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]


## Final thoughts

In conclusion, safeguarding sensitive data and maintaining data security is
crucial in today's digital landscape. Throughout this article, we have explored
several effective methods to keep sensitive data out of logs. By excluding
sensitive data from code, employing masking or redaction techniques, tokenizing
data, isolating sensitive information, encrypting data transitions, and
implementing access control measures, organizations can minimize the risk of
unauthorized access or exposure of sensitive data in logs.

Regular log audits and automated alerting systems further enhance the security
posture by ensuring compliance, detecting potential data breaches, and enabling
timely remediation. By adopting these practices, organizations can strengthen
their data protection efforts and maintain confidentiality, integrity, and
privacy of sensitive information.

To deepen your understanding of logging practices, we recommend exploring:
 
- A comprehensive guide on [dynamic log level modification during
runtime](https://betterstack.com/community/guides/logging/change-log-levels-dynamically/),
- [Selecting an optimal logging framework](https://betterstack.com/community/guides/logging/logging-framework/), 
- [Log management practices](https://betterstack.com/community/guides/logging/log-management/), 
- [The dos and don'ts of logging](https://betterstack.com/community/guides/logging/logging-best-practices/). 

These resources will provide valuable insights and strategies for creating the most appropriate logging solution for your specific requirements.