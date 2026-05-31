# An Introduction to the Node.js Performance API

Ever faced times when your application lags, impacting user experience with slow
load times? Pinpointing the exact performance bottlenecks within your
application's code can often feel like searching for a needle in a haystack.

Thankfully, Node.js provides a powerful toolset for this challenge: the
[Performance Measurement API](https://nodejs.org/api/perf_hooks.html#performance-measurement-apis), accessible
through the `perf_hooks` module. This suite of tools not only captures and
stores performance metrics automatically but also offers methods for actively
measuring and enhancing your application's performance.

Through this tutorial, you will learn to leverage these APIs for tracking
various key metrics in your application.

## Prerequisites

To follow through with this tutorial, you need basic knowledge of Node.js and a
[recent version](https://nodejs.org/en/download) installed on your machine.

## Inside the Node.js Performance API

Node.js has adopted a subset of the
[Web Performance API](https://www.w3.org/webperf/) in its `perf_hooks` module to
streamline the process of tracking server performance. Its core elements are
divided into four main categories:

1. High-resolution Time
2. Performance Timeline
3. User Timing
4. Resource Timing

Let's begin by briefly exploring each component, starting with the
High-resolution time:

### 1. High-resolution Time

Prior to the introduction of the Performance API in Node.js, developers often
used `Date.now()` to track execution times of an operation. This method,
however, is susceptible to system clock changes, which could affect the accuracy
of the measurements:

```javascript
const startTime = Date.now();
doTask(); // Example task
console.log(`Task duration: ${Date.now() - startTime} milliseconds`);
```

To overcome this, Node.js now provides a
[High-resolution Time API](https://www.w3.org/TR/hr-time/) that produces a
[monotonic timestamp](https://w3c.github.io/hr-time/#dfn-monotonic-clock) that
is unaffected by clock adjustments. The monotonic clock always progresses
forward and cannot be adjusted backward:

```javascript
import { performance } from "node:perf_hooks";

console.log(performance.now()); // produces a high resolution timestamp
```

The output from this snippet represents the milliseconds elapsed since the start
of the Node.js process till the `console.log()` statement:

```text
[output]
68.89512500003912
```

To differentiate further between `Date.now()` and `performance.now()`, here's a
brief comparison:

| -                            | Performance.now()      | Date.now()                        |
| ---------------------------- | ---------------------- | --------------------------------- |
| **Resolution**               | Sub-milliseconds       | Milliseconds                      |
| **Origin**                   | Performance.timeOrigin | Unix Epoch (January 1, 1970, UTC) |
| **Uses clock adjustments**   | No                     | Yes                               |
| **Monotonically increasing** | Yes                    | No                                |

Note that all the `perf_hooks` APIs use the high-resolution time for performance
measurements so keep that in mind as we move forward with other examples.

### 2. Performance Timeline

The Node.js performance timeline is designed to track performance metrics across
the entire lifespan of a program. These metrics are represented as subclasses of
the `PerformanceEntry` object, which is characterized by the following key
attributes:

- `name`: The identifier for the performance metric.
- `duration`: How long (in milliseconds) the metric took to complete.
- `startTime`: The high-resolution timestamp (in milliseconds) marking when the
  metric began.
- `type`: The category of the performance metric.

Performance measurements can be automatically entered in the timeline through
the Node.js process, APIs like `fetch`, or custom instrumentation. All entries
in the timeline are derived from the `PerformanceEntry` class. Here's an
example:

```javascript
[output]
Performance {
  nodeTiming: PerformanceNodeTiming {
    name: 'node',
    entryType: 'node',
    startTime: 0,
    duration: 75.03541599959135,
    nodeStart: 20.790207999758422,
    v8Start: 35.35679099988192,
    bootstrapComplete: 60.899207999929786,
    environment: 47.57658299989998,
    loopStart: 67.81720799999312,
    loopExit: -1,
    idleTime: 0
  },
  timeOrigin: 1711344543959.874
}
```

This entry showcases the four core attributes of a `PerformanceEntry` instance
—`name`, `duration`, `startTime`, and `type`—complemented by extra properties.
You can view the Performance Timeline at any point in your program using
`performance.getEntries()`.

### 3. User Timing

The User Timing API allows custom metrics about your application to be added to
the Node.js Performance Timeline. There are two types of user timings:

#### 1. PerformanceMark 

`PerformanceMark` entries can be recorded at any point in your application
 using the `performance.mark()` method:

   ```javascript
   [output]
   PerformanceMark {
     name: 'mark_fetch_start',
     entryType: 'mark',
     startTime: 21.876291000284255,
     duration: 0,
     detail: null
   }
   ```

#### 2. PerformanceMeasure 

`PerformanceMeasure` allows you to measure the difference between two
`PerformanceMark` entries in the timeline, creating a `PerformanceMeasure`
object that looks like this:

   ```javascript
   [output]
   PerformanceMeasure {
     name: 'measureTask',
     entryType: 'measure',
     startTime: 100,
     duration: 567.891
   }
   ```

### 4. Resource Timing

Resource Timing is the part of the Performance API that lets you retrieve
network timing data related to fetching resources. It provides detailed
information about various stages involved in fetching a resource, such as the
time it takes for DNS lookup, establishing a connection, and the duration of the
request.

Each resource timing is represented by a `PerformanceResourceTiming` entry that
looks like this:

```text
[output]
  PerformanceResourceTiming {
    name: 'https://example.com/resource',
    entryType: 'resource',
    startTime: 50.125,
    duration: 2000.75,
    initiatorType: 'fetch',
    ....
    secureConnectionStart: 85,
    requestStart: 100,
    responseStart: 110,
    responseEnd: 2050.875,
    transferSize: 500,
    encodedBodySize: 200,
    decodedBodySize: 800
  }
```

---

With some of the basic terms now understood, let's examine the specific
`perf_hooks` APIs and methods more closely so that you're able to carry out
performance measurements in Node.js effectively.

## Exploring the Node.js Performance APIs

To demonstrate the various APIs I'll be introducing in this section, we'll use
this simple function that returns a promise that resolves after a random amount
of time up to a specified maximum delay:

```javascript
[label random.js]
function completeAfterRandomTime(maxDelay) {
  const delay = Math.random() * maxDelay;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Completed after ${delay.toFixed(2)} milliseconds`);
    }, delay);
  });
}

export { completeAfterRandomTime }
```

This helps simulate some work being done asynchronously, such as fetching data
from a remote server so that you can apply various Performance API methods to
track the performance of each invocation.

Below is a list of the API methods and interfaces we will cover:

1. PerformanceNodeTiming
2. Performance.now()
3. Performance.mark()
4. Performance.measure()
5. Performance.getEntries()
6. PerformanceObserver
7. Performance.clearMarks()
8. Performance.clearMeasures()
9. PerformanceResourceTiming
10. setResourceTimingBufferSize()

Let's begin!

## 1. PerformanceNodeTiming

In any Node.js application, the `PerformanceNodeTiming` object is the initial
entry logged in the Performance Timeline. It offers insights into the app's
startup process and helps you identify early-stage performance issues by
detailing key phases such as the initialization of V8, bootstrapping, and
periods of idleness.

To inspect the `PerformanceNodeTiming` data, access the performance object from
the `perf_hooks` module as demonstrated below:

```javascript
import { performance } from "node:perf_hooks";

console.log(performance);
```

Executing this will yield an output akin to:

```text
[output]
Performance {
  nodeTiming: PerformanceNodeTiming {
    name: 'node',
    entryType: 'node',
    startTime: 0,
    duration: 24.63241699989885,
    nodeStart: 1.9587079999037087,
    v8Start: 4.290624999906868,
    bootstrapComplete: 13.435583000071347,
    environment: 8.796583000104874,
    loopStart: 18.111583000048995,
    loopExit: -1,
    idleTime: 0
  },
  timeOrigin: 1711429082121.026
}
```

This `nodeTiming` object captures critical timings of the application's boot
sequence, outlined as follows:

- `name`: Indicates the name, `node` in this case.
- `entryType`: Indicates the entry type set to `node` for Node.js processes.
- `startTime`: Marks the beginning of measurement with a high-resolution
  timestamp, with 0 denoting the beginning of the process execution.
- `duration`: The time taken from the `startTime` till the `console.log()`
  statement.
- `nodeStart`, `v8Start`, `bootstrapComplete`, `environment`, `loopStart`, and
  `loopExit`: These properties record various milestones in milliseconds, from
  process start through V8 initialization to the event loop's start and
  potential exit. `loopExit` is -1 because the event loop is still active at the
  time of recording.
- `idleTime`: Indicates how long the event loop was idle, starting at 0 if the
  event loop hasn't commenced.

Now that you are familiar with the `PerformanceNodeTiming` entry, we will look
at `Performance.now()` next.

## 2. Performance.now()

The `Performance.now()` method enables precise measurement of task durations by
generating high-resolution timestamps. You can use it directly in your code by
calling `performance.now()` but also note that all timestamps in
`PerformanceEntry` objects are also generated internally through the `now()`
method.

To measure the duration of a task, invoke the method at the start and end of the
operation you're measuring, then calculate the elapsed time by subtracting these
two values. Here's how it's applied:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

const startTime = performance.now();
await completeAfterRandomTime(2000);
const endTime = performance.now();
console.log(`Task completed in ${endTime - startTime} milliseconds.`);
```

When executed, it outputs something like:

```text
[output]
Task completed in 1581.4101660000001 milliseconds
```

While this method of time keeping suits many scenarios, the `perf_hooks` module
offers even more versatile performance measurement tools, which we will explore
next.

## 3. Performance.mark()

The `performance.mark()` method is used to place named markers in the
Performance Timeline. These markers facilitate the precise measurement of
durations between function calls and allow for their subsequent analysis
directly from the timeline. Here's its signature:

```javascript
performance.mark(name[, options])
```

Here, `name` denotes the marker's identifier, and the optional `options`
argument provides additional context for the marker.

Consider the example below:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

const markStart = performance.mark('mark_function_start');
await completeAfterRandomTime(2000);
const markEnd = performance.mark('mark_function_end');

console.log(markStart);
console.log(markEnd);
```

After you run the file, you will see an output that looks similar to this:

```text
[output]
PerformanceMark {
  name: 'mark_function_start',
  entryType: 'mark',
  startTime: 29.752355,
  duration: 0,
  detail: null
}
PerformanceMark {
  name: 'mark_function_end',
  entryType: 'mark',
  startTime: 1839.77119,
  duration: 0,
  detail: null
}
```

Markers generated via `performance.mark()` include a `startTime` indicating when
they were placed in the Performance Timeline, which can later be used for
calculating the elapsed time for a task.

Additionally, you can enrich markers with context using the options parameter:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

[highlight]
const options = {
  detail: {
    functionName: 'completeAfterRandomTime',
  },
};
[/highlight]

[highlight]
const markStart = performance.mark('mark_function_start', options);
[/highlight]
await completeAfterRandomTime(2000);
[highlight]
const markEnd = performance.mark('mark_function_end', options);
[/highlight]

console.log(markStart);
console.log(markEnd);
```

This yields markers enriched with further details:

```text
[output]
PerformanceMark {
  name: 'mark_function_start',
  entryType: 'mark',
  startTime: 30.379528,
  duration: 0,
  detail: { functionName: 'completeAfterRandomTime' }
}
PerformanceMark {
  name: 'mark_function_end',
  entryType: 'mark',
  startTime: 906.525729,
  duration: 0,
  detail: { functionName: 'completeAfterRandomTime' }
}
```

Next, we will delve into measuring the intervals between these markers.

## 4. Performance.measure()

`Performance.measure()` is designed to generate a `PerformanceMeasure` object
within the performance timeline that measures the period between two predefined
`PerformanceMark` entries. Here's its signature:

```javascript
performance.measure(name[, startMarkOrOptions[, endMark]])
```

Passing just the `name` parameter measures the time from the program's start to
the method invocation:

```javascript
[label index.js]
import { performance } from "node:perf_hooks";
import { completeAfterRandomTime } from './random.js';

completeAfterRandomTime2000);
console.log(performance.measure("programDuration"));
```

This results in a `PerformanceMeasure` entry, capturing the duration since the
program's start:

```text
[output]
PerformanceMeasure {
  name: 'programDuration',
  entryType: 'measure',
  startTime: 0,
  duration: 2014.819769
}
```

For measuring the interval between two markers, include their names as the
second and third arguments, respectively:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

const markStart = performance.mark('mark_function_start');
await completeAfterRandomTime(2000);
const markEnd = performance.mark('mark_function_end');

console.log(
  performance.measure(
    'measure_func_perf',
    'mark_function_start',
    'mark_function_end'
  )
);
```

The program then outputs a `PerformanceMeasure` reflecting the span between
these markers:

```text
[output]
PerformanceMeasure {
  name: 'measure_func_perf',
  entryType: 'measure',
  startTime: 29.751993,
  duration: 809.9894330000001
}
```

Here, `startTime` indicates when the measurement commenced relative to the
program's start (`mark_function_start`'s `startTime`), and `duration` reveals
the elapsed time between the markers. This feature offers a structured way to
pinpoint and assess performance metrics for specific code segments.

## 5. Performance.getEntries()

Now that you've learned about the `mark()` and `measure()` functions that add to
the Performance Timeline, it's time to see how we can retrieve these recorded
entries. The `performance.getEntries()` method does just that, pulling
`PerformanceEntry` objects from the timeline for review.

Consider the following example:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

const markStart = performance.mark('mark_function_start');
await completeAfterRandomTime(2000);
const markEnd = performance.mark('mark_function_end');

performance.measure(
  'measure_func_perf',
  'mark_function_start',
  'mark_function_end'
);

console.log(performance.getEntries());
```

You will see an array of three entries representing the markers and their
measurement:

```text
[output]
[
  PerformanceMark {
    name: 'mark_function_start',
    entryType: 'mark',
    startTime: 29.210924,
    duration: 0,
    detail: null
  },
  PerformanceMeasure {
    name: 'measure_func_perf',
    entryType: 'measure',
    startTime: 29.210924,
    duration: 1289.521015
  },
  PerformanceMark {
    name: 'mark_function_end',
    entryType: 'mark',
    startTime: 1318.731939,
    duration: 0,
    detail: null
  }
]
```

If your interest is in a specific entry, such as `mark_function_start`, the
`performance.getEntriesByName()` method allows for targeted retrieval:

```javascript
console.log(performance.getEntriesByName('mark_function_start'));
```

Resulting in:

```javascript
[output]
[
  PerformanceMark {
    name: 'mark_function_start',
    entryType: 'mark',
    startTime: 29.66662500053644,
    duration: 0,
    detail: null
  }
]
```

Another useful method is `getEntriesByType()`, which returns only the entries of
a certain type from the performance timeline such as marks or measures:

```javascript
console.log(performance.getEntriesByType("mark"));
```

## 6. PerformanceObserver

The `PerformanceObserver` interface enhances how you work with the Node.js
performance timeline by offering a way to monitor performance metrics as they're
logged. This method is preferable to static retrieval functions like
`getEntries()` for two main reasons:

1. It provides real-time monitoring of the performance timeline, capturing
   entries as they happen, which is more efficient than querying the entire
   timeline repeatedly.

2. It allows for targeted observation, enabling you to specify exactly which
   types of entries to track, thereby optimizing resource use and avoiding the
   accumulation of unneeded data in memory.

Here's a basic guide to utilizing a `PerformanceObserver`:

```javascript
// Create a PerformanceObserver instance
const observer = new PerformanceObserver((list, observer) => {
  for (const entry of list.getEntries()) {
    if (entry.name === '<your_entry_name>') {
      // Perform actions based on the measurement
    }
  }
});

// Specify the entry types you want to observe
observer.observe({ entryTypes: ['<entry_type>'] });
```

In this setup, you determine the types of performance entries you wish to
observe, such as `mark` or `measure`, and then process them within a callback
function as they are recorded.

Here is a more practical example that uses an observer:

```javascript
[label index.js]
import { performance, PerformanceObserver } from 'node:perf_hooks';
import { completeAfterRandomTime } from './random.js';

const observer = new PerformanceObserver((list, observer) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'measure_func_perf') {
      console.log(`Function execution time: ${entry.duration} milliseconds`);
      observer.disconnect();
    }
  }
});

observer.observe({ entryTypes: ['measure'] });

const markStart = performance.mark('mark_function_start');
await completeAfterRandomTime(2000);
const markEnd = performance.mark('mark_function_end');
performance.measure(
  'measure_func_perf',
  'mark_function_start',
  'mark_function_end'
);
```

This practical implementation sets the observer to watch for `measure` entries,
logging the duration of a specified function once detected:

```text
[output
Function execution time: 7.202374999877065 milliseconds
```

You are not limited to observing performance entries of one type; you can
specify multiple entry types as needed:

```javascript
observer.observe({ entryTypes: ['mark', 'measure'] });
```

To see the list of entry types supported by the observer, you can use:

```javascript
[label index.js]
import { PerformanceObserver } from "node:perf_hooks";

console.log(PerformanceObserver.supportedEntryTypes);
```

```javascript
[output]
[
  'dns',      'function',
  'gc',       'http',
  'http2',    'mark',
  'measure',  'net',
  'resource'
]
```

Now that you are familiar with methods that help you inspect and add to the
performance timeline, the next step is to understand how to clear entries.

## 7. Performance.clearMarks()

In long-running applications, you may need to reset the performance timeline so
that it doesn't take too much memory. One of the methods you can use is
`performance.clearMarks()` function, which clears all `PerformanceMark` entries
from the timeline:

```javascript
performance.clearMarks();
```

You can also target and remove a specific mark by its name:

```javascript
performance.clearMarks("mark_function_start");
```

## 8. Performance.clearMeasures()

Similarly, clearing `PerformanceMeasure` entries from the timeline is made easy
with:

```javascript
performance.clearMeasures();
```

Similar to `clearMarks()`, you can also provide a name to delete a specific
entry from the timeline.

## 9. PerformanceResourceTiming

Earlier in this article, we discussed the Resource Timing API which is used for
recording network-based metrics for requests made within the application. If
you're using the `fetch` API, you can inspect the `PerformanceResourceTiming`
objects created after each invocation like this:

```javascript
[label index.js]
import { performance } from 'node:perf_hooks';

const url = 'https://dummyjson.com/products/1';
const response = await fetch(url);
await response.json();
console.log(performance.getEntriesByType('resource'));
```

Executing this program will yield:

```javascript
[output]
[
  PerformanceResourceTiming {
    name: 'https://dummyjson.com/products/1',
    entryType: 'resource',
    startTime: 133.451,
    duration: 1240.7135,
    initiatorType: 'fetch',
    nextHopProtocol: undefined,
    workerStart: 0,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: 133.451,
    domainLookupStart: undefined,
    domainLookupEnd: undefined,
    connectStart: undefined,
    connectEnd: undefined,
    secureConnectionStart: undefined,
    requestStart: 0,
    responseStart: 0,
    responseEnd: 1374.1645,
    transferSize: 300,
    encodedBodySize: 0,
    decodedBodySize: 0
  }
]
```

The `PerformanceResourceTiming` object contains several key attributes:

- `name`: Identifies the resource's URL.
- `entryType`: Specifies the type of entry, which is `resource` for these
  objects.
- `startTime`: Records the precise moment the resource fetching commenced,
  represented in high-resolution milliseconds.
- `duration`: Reflects the total fetch time for the resource, calculated as the
  interval between `responseEnd` and `startTime`.
- `initiatorType`: Describes the method by which the resource fetch was
  initiated, such as "fetch".
- `fetchStart`: The exact timestamp marking the start of the resource fetch.
- `responseEnd`: The timestamp indicating the conclusion of the resource's
  response.
- `transferSize`: The total size of the resource received, in bytes, including
  the response headers and the payload.

Note that this entry is only recorded after `await response.json()` is utilized.

## Adjusting resource timing buffer sizes

The `PerformanceResourceTiming` object is automatically recorded for each
`fetch` request and stored in a buffer limited to 250 entries by default. You
may need to expand this buffer to accommodate the tracking of more network
resources.

To modify the buffer size, use the `setResourceTimingBufferSize()` method as
shown below:

```javascript
performance.setResourceTimingBufferSize(600);
```

This adjustment allows for the inclusion of up to 600
`PerformanceResourceTiming` objects within the performance timeline.

Additionally, you can clear all `PerformanceResourceTiming` entries from the
timeline with:

```javascript
performance.clearResourceTimings();
```

Node.js also emits a `resourcetimingbufferfull` event when the buffer hits its
limit. You can listen for this event to expand or clear the buffer as needed:

```javascript
performance.on("resourcetimingbufferfull", () => {
  if (performance.getEntriesByType("resource").length < 900) {
    performance.setResourceTimingBufferSize(900); // Expanding the buffer if under a certain threshold
  } else {
    performance.clearResourceTimings(); // Clearing the buffer if the threshold is exceeded
  }
});
```

## Final thoughts

In this article, we explored the Performance Measurement APIs available in
Node.js, and you learned how to use them to record various performance metrics.

Stay tuned for our upcoming article, which will delve into practical
applications of these API techniques in real-world scenarios.

Thanks for reading!