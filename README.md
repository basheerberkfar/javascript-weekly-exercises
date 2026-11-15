# JavaScript Weekly Exercises

## Run

Requires Node.js 18 or later. From this directory:

```sh
npm test
```

## Exercise notes

1. `getUserSummary` uses nested object and array destructuring to extract the needed fields.
2. `getUniqueSortedTags` flattens tags, uses `Set` for uniqueness, then sorts alphabetically.
3. `Map` is suitable for the SKU index because each SKU is a key, lookup is direct, and the product value can remain an object. A plain object also works for string keys, but `Map` has a clear key/value API and a reliable `size` property.
4. The inventory module keeps its state private in a `Map`, validates inputs, and returns copies so callers cannot mutate stored records accidentally.
5. The subclasses share a `send()` interface through inheritance. That is useful when they share recipient/message state and are used polymorphically. If only formatting differs and there is no shared state, simple functions are lighter and easier to test.
6. With three 100 ms operations, sequential execution takes about 300 ms; `Promise.all` takes about 100 ms because all timers run concurrently. Actual measurements vary with machine and event-loop load. Example:

```js
const started = Date.now();
for (const value of ["A", "B", "C"]) await delayResult(value, 100);
console.log("sequential ms:", Date.now() - started);

const parallelStarted = Date.now();
await Promise.all(["A", "B", "C"].map((value) => delayResult(value, 100)));
console.log("parallel ms:", Date.now() - parallelStarted);
```

7. `Promise.allSettled` waits for all five outcomes; filtering by `status` separates values from errors without short-circuiting.
8. Expected output:

```text
start
end
promise
timeout
```

Synchronous code runs first. Promise callbacks run as microtasks before timer callbacks, so `promise` appears before `timeout`.

## Three refactors after review

1. Renamed generic variables to `productIndex`, `primaryRole`, and `threshold` so each name communicates its purpose.
2. Moved inventory behavior into `createInventory` and kept the backing `Map` private, instead of duplicating SKU searches across functions.
3. Centralized inventory input validation in `validateItem` and reused it when loading initial data and adding new items.

## End-of-week note

This week I practiced destructuring, Set and Map, module design, class interfaces, promises, partial failure handling, and event-loop ordering. I used tests to confirm the expected behavior and refactored naming, state ownership, and validation after review. Next, I want to apply these patterns in a small feature that consumes a real API and handles network failures.
