# Exploring Temporal API: The Future of Date Handling in JavaScript

JavaScript's `Date` object has frustrated developers for decades with its zero-based months, mutable objects, and confusing time zone handling. 

The new [Temporal API](https://tc39.es/proposal-temporal/docs/) solves these longstanding issues by providing immutable dates, intuitive time zones, and precise calculations—all built into JavaScript natively. 

Let's explore how it works.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/zwFlVPdtKvE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


## Why was the Temporal API created?

JavaScript's `Date` object has fundamental flaws that make it problematic for modern development. The Temporal API was created as a complete redesign to address these issues.

Consider these common problems with `Date`:

Time zones and DST cause scheduling errors:

```javascript
// Time might be wrong due to DST
const event = new Date('2025-11-05T02:00:00-05:00');
```

Dates can be accidentally modified:

```javascript
const meetingStart = new Date(2025, 1, 6);
scheduleNotifications(meetingStart);    // This might modify our date
displayMeetingTime(meetingStart);       // Now showing wrong time!
```

Date parsing is inconsistent across browsers:

```javascript
new Date('2025-02-06');    // Works everywhere
new Date('2025/02/06');    // Might fail in Safari
new Date('06-02-2025');    // Different results in different browsers
```

And precision is limited to milliseconds:

```javascript
const start = new Date();
performHighSpeedOperation();
const end = new Date();
console.log(`Operation took ${end - start} milliseconds`); // Not precise enough
```

The Temporal API, now at Stage 3 in the TC39 process, solves these issues with immutable dates, consistent parsing, proper time zone handling, and nanosecond precision. 

To see the current implementation status, check:

![Screenshot of Temporal implementation status](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ca7436b-5596-42d8-ae2d-4167119ba500/lg2x =2772x884)

As you can see, support is currently limited, but browsers are actively working on implementation.  

Firefox Nightly is the only browser supporting Temporal behind a feature flag. However, other browsers are actively developing it. In the meantime, you can still use Temporal today by installing the official polyfill, which provides full functionality until native support becomes widely available.


## Why Temporal API is a better alternative to JavaScript’s date object

The Temporal API fixes the most frustrating things about JavaScript's `Date` object. Here's what makes it better:

- **No more mutability surprises**: All Temporal objects are immutable - they won't change unexpectedly in your code
- **Correct month indexing**: January is 1, December is 12 - just like every calendar in the real world
- **Time zones done correctly**: Working across time zones is now straightforward, not a debugging nightmare
- **Better date parsing**: More reliable handling of different date formats, fewer parsing headaches
- **Multiple calendar support**: Beyond just Gregorian - now includes Hebrew, Islamic, and other calendar systems
- **High precision timing**: Accurate down to the nanosecond for high-precision timing

All these improvements come packaged in an API that feels natural to use. 


## Setting up the project directory

While the Temporal API is gradually rolling out in modern browsers, it's not yet universally available. The easiest way will be to explore its capabilities using the official polyfill package in Node.js: [@js-temporal/polyfill](https://www.npmjs.com/package/@js-temporal/polyfill).

This polyfill provides the same API available natively in browsers, allowing you to use Temporal's features today while ensuring your code will work with the native implementation when it becomes widely available.

First, create a new directory for your project and move into it:

```command
mkdir temporal-demo
```
```command
cd temporal-demo
```

Initialize your Node.js project:

```command
npm init -y
```

Set the project to use ES modules by modifying the `package.json`:

```command
npm pkg set type=module
```

Then install the polyfill:


```command
npm install @js-temporal/polyfill
```


With the setup complete, you can start using Temporal in your project. 



## Getting started with the Temporal API

To start using Temporal today, you need to import it from the polyfill (though this won't be necessary in the future when it's available globally in JavaScript).

### Understanding Temporal.Now

Let's start by exploring `Temporal.Now`, which provides several methods for working with the current time:


```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now;
console.log(now);
```

Here's what you'll see:

```text
[output]
Object [Temporal.Now] {
  instant: [Function: instant],
  plainDateTime: [Function: plainDateTime],
  plainDateTimeISO: [Function: plainDateTimeISO],
  plainDate: [Function: plainDate],
  plainDateISO: [Function: plainDateISO],
  plainTimeISO: [Function: plainTimeISO],
  timeZoneId: [Function: timeZoneId],
  zonedDateTime: [Function: zonedDateTime],
  zonedDateTimeISO: [Function: zonedDateTimeISO]
}
```

These aren't just different formats - they're different ways of thinking about time. For instance, `instant` gives you a precise moment in time, while `plainDateTime` gives you a date and time without time zone information. This separation helps prevent the time zone confusion that often happens with the `Date` object.

### Working with Instants

Let's see what methods and properties an instant provides:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.instant();
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(now)));
```

This shows us the full range of capabilities:

```text
[output]
[
  'constructor',        'epochSeconds',
  'epochMilliseconds',  'epochMicroseconds',
  'epochNanoseconds',   'add',
  'subtract',           'until',
  'since',              'round',
  'equals',             'toString',
  'toJSON',             'toLocaleString',
  'valueOf',            'toZonedDateTime',
  'toZonedDateTimeISO'
]
```

An instant provides several ways to work with time since the Unix epoch:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.instant();
console.log('Epoch Seconds:', now.epochSeconds);
console.log('Epoch Milliseconds:', now.epochMilliseconds);
console.log('Epoch Microseconds:', now.epochMicroseconds);
console.log('Epoch Nanoseconds:', now.epochNanoseconds);
```

You'll see output like this:

```text
[output]
Epoch Seconds: 1738842325
Epoch Milliseconds: 1738842325915
Epoch Microseconds: 1738842325915325n
Epoch Nanoseconds: 1738842325915325901n
```

These values represent time since January 1, 1970, 00:00:00 UTC, with increasingly fine precision. The 'n' suffix on the larger numbers indicates BigInt values, which JavaScript uses for very large integers.

When you want a human-readable string:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.instant();
console.log(now.toString());
```

```text
[output]
2025-02-06T11:46:06.959366942Z
```

This ISO 8601 format is perfect for storing and transmitting timestamps - it's unambiguous (the 'Z' means UTC), consistently formatted, and both human and machine-readable.

Compare this with the traditional `Date` object:

```javascript
const oldDate = new Date();
console.log(oldDate);
// Output: Thu Feb 06 2025 13:27:22 GMT+0200 (Central Africa Time)
```

One key difference? The `Date` object can be modified after creation:

```javascript
oldDate.setHours(oldDate.getHours() + 1); // mutates the original object
```

With Temporal, such mutations are impossible - all objects are immutable. When you perform operations on a Temporal object, you always get a new object back. This immutability helps prevent bugs where dates change unexpectedly as they're passed around your application.

## Creating instants from other sources

So far, we've been working with `Temporal.Now.instant()`, which retrieves the current moment. But what if you need to create an `Instant` from an existing timestamp? This is where `Temporal.Instant.from()` and `Temporal.Instant.fromEpochNanoseconds()` come into play.

`Temporal.Instant.from()` is a flexible method that parses an existing timestamp, but it requires an explicit time zone when converting from string formats:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instantFromString = Temporal.Instant.from("2025-02-06T11:46:06.959366942Z");
console.log(instantFromString.toString());
```

```text
[output]
2025-02-06T11:46:06.959366942Z
```
As you can see, the parsed string remains unchanged, preserving the exact `UTC timestamp`. Since the input includes a 'Z', `Temporal.Instant.from()` correctly interprets it as an absolute moment in time, ensuring consistency regardless of the user's local time zone.

However, if the input is a local timestamp without 'Z', it lacks any time zone information, making it ambiguous:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

try {
    const instant = Temporal.Instant.from("2025-02-06T11:46:06");
} catch (error) {
    console.log('Error:', error.message);
}
```

```text
[output]
Error: Temporal.Instant requires a time zone offset
```
Here, the error occurs because `Temporal.Instant.from()` expects an absolute timestamp. To avoid this, always ensure your input timestamp includes a clear time zone reference

Sometimes, you'll work with timestamps stored as Unix time—the number of seconds or milliseconds since January 1, 1970, UTC. `Temporal.Instant` provides methods to create instances from these values:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instantFromSeconds = Temporal.Instant.fromEpochSeconds(1738842325);
console.log(instantFromSeconds.toString()); 

const instantFromMillis = Temporal.Instant.fromEpochMilliseconds(1738842325915);
console.log(instantFromMillis.toString());
```
```text
[output]
2025-02-06T11:46:06Z
2025-02-06T11:46:06.915Z
```

From the output, you can see that epoch timestamps are always interpreted as UTC.  
- The first result comes from `fromEpochSeconds()`, where whole seconds are converted into a `Temporal.Instant`  
- The second result is from `fromEpochMilliseconds()`, which adds millisecond precision to the instant 

Both methods ensure that the timestamp remains absolute and **unaffected by local time zones**, making them ideal for storing and sharing timestamps consistently across systems.  

## Handling time zones with `Temporal.ZonedDateTime` 

We've seen how `Temporal.Instant` provides a precise moment in time in UTC. However, many real-world applications require working with local time zones—whether for scheduling, user-friendly date displays, or converting between different regions.  

You can create a `ZonedDateTime` from scratch using `Temporal.ZonedDateTime.from()`.

 However, this method requires multiple properties to ensure the time zone is handled correctly:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const zonedDateTime = Temporal.ZonedDateTime.from({
  timeZone: "Europe/London",
  year: 2025,
  month: 2,
  day: 6,
  hour: 14,
  minute: 30,
  second: 0,
});

console.log(zonedDateTime.toString());
```


Unlike `Temporal.Instant`, which is always in UTC, a `Temporal.ZonedDateTime` needs more details to determine local time accurately. 

It requires the year, month, day, and time to structure the date, along with a time zone identifier to apply the correct UTC offset.  

Running the file yields the following:

```text
[output]
2025-02-06T14:30:00+00:00[Europe/London]
```
The output includes the local date and time, UTC offset, and time zone identifier, ensuring accurate interpretation and handling of regional time rules like daylight-saving time (DST).

What happens if you accidentally specify an invalid date, like February 30th? By default, `Temporal.ZonedDateTime.from()` does not throw an error—instead, it automatically adjusts the date based on the closest valid value. 

```javascript
[label index.js]

const zonedDateTime = Temporal.ZonedDateTime.from({
  ...
  month: 2,
[highlight]
  day: 30,
[/highlight]
  ...
});
```

```text
[output]
2025-02-28T14:30:00+00:00[Europe/London]
```
This output demonstrates that even though February never has 30 days, Temporal adjusts the date to the last valid day of the month—February 28th.

You can change this behavior using the `overflow` option, which allows you to control how Temporal handles out-of-range values. By default, Temporal **adjusts (or constrains) the date**, but if you prefer to **strictly enforce valid dates**, you can use `{ overflow: "reject" }`, which will cause an error instead of adjusting the value.

```javascript
[label index.js]

const zonedDateTime = Temporal.ZonedDateTime.from({
  ...
  month: 2,
[highlight]
  day: 30, // Invalid day for February
[/highlight]
  ...
}, { overflow: "reject" });

console.log(zonedDateTime.toString());
```

```text
[output]
RangeError: value out of range: 1 <= 30 <= 28
```

With `{ overflow: "reject" }`, Temporal throws an error instead of adjusting the date, ensuring that only strictly valid dates are accepted. 

By default, Temporal assumes `{ overflow: "constrain" }`, which means it adjusts the date to the nearest valid value. 



Time zones also introduce ambiguities during **daylight-saving time (DST) changes**. Sometimes don’t exist(spring forward), while others exist twice (fall back).  

When clocks fall back in regions with daylight saving time, a local time might exist twice in one day.

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const ambiguousTime = Temporal.ZonedDateTime.from({
  timeZone: "America/New_York",
  year: 2025,
  month: 11,
  day: 2,  // The day when DST ends in the US
  hour: 1, // This hour happens twice (1 AM before and after the shift)
  minute: 30,
});
console.log(ambiguousTime.toString());
```
```text
[output]
2025-11-02T01:30:00-04:00[America/New_York]
```

By default, **Temporal picks the earlier instance** (before DST ends).  


You can control this behavior with `disambiguation: "later"`, which chooses the second occurrence of the time:

```javascript
...
const ambiguousTime = Temporal.ZonedDateTime.from(
  {
    timeZone: "America/New_York",
    ...
[highlight]
  },
  { disambiguation: "later" }
[/highlight]
);
console.log(ambiguousTime.toString());
```
```text
[output]
2025-11-02T01:30:00-05:00[America/New_York]
```

This time is after the DST shift, with a UTC offset of `-05:00` instead of `-04:00`.


## Working with `Temporal.PlainDateTime`

Unlike `Temporal.ZonedDateTime`, which requires a time zone, `Temporal.PlainDateTime` **only tracks a local date and time** without any association with UTC or offsets.

Creating a `PlainDateTime` is simple:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainDateTime.from("2025-02-06T14:30:00").toString());
```

```text
[output]
2025-02-06T14:30:00
```

This represents February 6, 2025, at 14:30 (2:30 PM) local time, but without any time zone context.


If you only need the date, use `Temporal.PlainDate`:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainDate.from("2025-02-06").toString());
```

```text
[output]
2025-02-06
```

This is useful for birthdays, deadlines, or other date-only values.


For cases where you only need a clock time, use `Temporal.PlainTime`:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainTime.from("14:30:00").toString());
```

```text
[output]
14:30:00
```

This is helpful for representing business hours, schedules, or timers.


Sometimes, only the year and month** matter—such as for billing cycles or financial records:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainYearMonth.from("2025-02").toString());
```

```text
[output]
2025-02
```

If you want a month and day but no specific year—like for annual holidays or birthdays—use `Temporal.PlainMonthDay`:

```javascript
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainMonthDay.from("02-06").toString());
```

```text
[output]
02-06
```
Each Temporal type focuses on specific aspects of a date or time, making it easy to work with exactly what you need—without time zone complexity.

## Working with Temporal.Duration

The Temporal API offers a powerful way to work with time spans through the `Temporal.Duration` object. This makes it easy to represent periods like "3 hours" or "5 days" and perform calculations with them.

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const duration = Temporal.Duration.from({ days: 5, hours: 3, minutes: 30 });
console.log(duration.toString());
```

```text
[output]
P5DT3H30M
```

The output format follows ISO 8601 Duration notation - 'P' indicates a period, followed by the number of days (D), then 'T' to separate the time components, followed by hours (H) and minutes (M).

You can add or subtract these durations from other Temporal objects:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const dateTime = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const newDateTime = dateTime.add(duration);
console.log('After adding:', newDateTime.toString());

const earlierDateTime = dateTime.subtract(duration);
console.log('After subtracting:', earlierDateTime.toString());
```

```text
[output]
After adding: 2025-02-11T17:30:00
After subtracting: 2025-02-01T11:00:00
```

To find the difference between two dates, Temporal provides `.until()` and `.since()` methods:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const start = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const end = Temporal.PlainDateTime.from("2025-03-08T10:15:00");

const difference = start.until(end);
console.log('Time until:', difference.toString());

const differenceNegative = end.since(start);
console.log('Time since:', differenceNegative.toString());
```

```text
[output]
Time until: P1M1DT19H45M
Time since: -P1M1DT19H45M
```

You can also convert durations to a single unit of time when needed:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const thirtyDays = Temporal.Duration.from({ days: 30 });
console.log('Thirty days in seconds:', thirtyDays.total({ unit: "seconds" }));

console.log('Negated duration:', thirtyDays.negated().toString());
```

```text
[output]
Thirty days in seconds: 2592000
Negated duration: -P30D
```

This approach to working with time spans is much more intuitive than manually converting everything to milliseconds as required with the traditional Date object. In the next section, we'll explore how to format these dates and durations for display.

## Rounding time values

Working with precise timestamps often requires rounding to more manageable units. The Temporal API provides a `round()` method that lets you control how dates and times are rounded:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant = Temporal.Instant.from("2025-02-06T14:23:45.123456789Z");

// Round to different units
console.log('To minutes:', instant.round({ smallestUnit: 'minute' }).toString());
console.log('To hours:', instant.round({ smallestUnit: 'hour' }).toString());
console.log('To days:', instant.round({ smallestUnit: 'day' }).toString());
```

```text
[output]
To minutes: 2025-02-06T14:24:00Z
To hours: 2025-02-06T14:00:00Z
To days: 2025-02-06T00:00:00Z
```

You can also control the rounding direction:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant = Temporal.Instant.from("2025-02-06T14:23:45Z");

// Different rounding modes
console.log('Round down:', instant.round({ 
    smallestUnit: 'hour', 
    roundingMode: 'floor' 
}).toString());

console.log('Round up:', instant.round({ 
    smallestUnit: 'hour', 
    roundingMode: 'ceil' 
}).toString());
```

```text
[output]
Round down: 2025-02-06T14:00:00Z
Round up: 2025-02-06T15:00:00Z
```

The same rounding functionality works with durations as well:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const duration = Temporal.Duration.from({ 
    hours: 2, 
    minutes: 45, 
    seconds: 30 
});

console.log('Original:', duration.toString());
console.log('Rounded to hours:', duration.round({ smallestUnit: 'hour' }).toString());
```

```text
[output]
Original: PT2H45M30S
Rounded to hours: PT3H
```

## Comparing dates and times

The Temporal API provides several methods for comparing dates and times, making it much easier to determine the relationship between different moments. Unlike the old `Date` object, where comparisons could be tricky due to implicit type coercion, Temporal's comparison methods are explicit and reliable:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date1 = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const date2 = Temporal.PlainDateTime.from("2025-02-06T15:45:00");

// Basic comparisons
console.log('equals:', date1.equals(date2));
console.log('before:', date1.compare(date2) < 0);
console.log('after:', date1.compare(date2) > 0);
```

```text
[output]
equals: false
before: true
after: false
```

The `compare()` method returns -1 if the first date is before the second, 0 if they're equal, and 1 if the first date is after the second. This makes it easy to determine the relative ordering of dates.

For more readable code, Temporal also provides semantic comparison methods:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant1 = Temporal.Instant.from("2025-02-06T14:30:00Z");
const instant2 = Temporal.Instant.from("2025-02-06T14:30:00Z");

console.log('Exactly same time:', instant1.equals(instant2));
console.log('Same or before:', instant1.lessOrEqual(instant2));
console.log('Same or after:', instant1.greaterOrEqual(instant2));
```

```text
[output]
Exactly same time: true
Same or before: true
Same or after: true
```

One of the trickiest parts of working with dates is handling time zones correctly. Temporal makes this easier by allowing you to compare dates across different time zones while maintaining accuracy:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const nyDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'America/New_York',
    year: 2025, month: 2, day: 6,
    hour: 9, minute: 30
});

const londonDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'Europe/London',
    year: 2025, month: 2, day: 6,
    hour: 14, minute: 30
});

// These times might look different but represent the same instant
console.log('Same instant:', nyDateTime.equals(londonDateTime));
```

```text
[output]
Same instant: true
```

In this example, even though the times appear different (9:30 AM in New York and 2:30 PM in London), they represent the same moment in time due to the 5-hour time difference. Temporal handles these time zone conversions automatically, making it much easier to work with dates across different regions.


## Formatting dates and times

Temporal provides rich formatting capabilities that go beyond the limited options of the traditional `Date` object. Let's explore the different ways to format temporal values, from simple string representations to locale-specific formatting:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const zonedDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'America/New_York',
    year: 2025, month: 2, day: 6,
    hour: 14, minute: 30, second: 45
});

// Different string representations
console.log('Default:', zonedDateTime.toString());
console.log('Date only:', zonedDateTime.toPlainDate().toString());
console.log('Time only:', zonedDateTime.toPlainTime().toString());
```

```text
[output]
Default: 2025-02-06T14:30:45-05:00[America/New_York]
Date only: 2025-02-06
Time only: 14:30:45
```

The default `toString()` method produces ISO 8601 formatted strings, which are perfect for data storage and transmission. For dates with time zones, the output includes both the UTC offset (-05:00) and the IANA time zone name [America/New_York], ensuring complete time zone information is preserved.

When you need to present dates in a user-friendly format, `toLocaleString()` offers extensive customization options:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date = Temporal.Now.plainDateTime('gregory');

// Different locale formats
console.log('US format:', date.toLocaleString('en-US', {
    weekday: 'long',    // Full weekday name
    year: 'numeric',    // Four-digit year
    month: 'long',      // Full month name
    day: 'numeric',     // Day of the month
    hour: 'numeric',    // Hour (12-hour clock in US)
    minute: 'numeric'   // Minutes
}));

console.log('German format:', date.toLocaleString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
}));
```

```text
[output]
US format: Thursday, February 6, 2025 at 2:30 PM
German format: Donnerstag, 6. Februar 2025 um 14:30
```

Notice how the format automatically adapts to each locale's conventions. The US format uses 12-hour time with AM/PM, while the German format uses 24-hour time. The order of date components and separators also changes to match local expectations.

For complete control over the format, you can access individual date components directly:

```javascript
[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date = Temporal.Now.plainDateTime('gregory');

const custom = `${date.day}/${date.month}/${date.year} at ${date.hour}:${String(date.minute).padStart(2, '0')}`;
console.log('Custom format:', custom);

// Additional useful properties
console.log('Day of week:', date.dayOfWeek);    // 1-7 (Monday is 1)
console.log('Day of year:', date.dayOfYear);     // 1-365/366
```

```text
[output]
Custom format: 6/2/2025 at 14:30
Day of week: 4
Day of year: 37
```

These properties make it easy to access any part of the date you need. Beyond basic components like year and month, Temporal provides calendar-aware values like `dayOfWeek` and `dayOfYear`. The `dayOfWeek` property uses Monday as 1 through Sunday as 7, following the ISO 8601 standard, while `dayOfYear` gives you the ordinal day number (1-365 or 1-366 in leap years).


## Final thoughts

This article explored the Temporal API, which resolves the frustrating quirks of the Date object.

Temporal addresses these fundamental flaws as a long-awaited solution, offering a more reliable and intuitive way to work with dates and times in JavaScript.

While native browser support is still rolling out, you can start using it today with the official polyfill, as demonstrated in this article.