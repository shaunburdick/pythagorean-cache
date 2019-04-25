# Pythagorean Cache

🍷A cache that dumps when full or at an interval

[![cup](https://upload.wikimedia.org/wikipedia/commons/a/a9/Physagorian_Pythagoras_Greedy_Tantalus_cup_05.svg)](https://en.wikipedia.org/wiki/Pythagorean_cup)

## Example

```typescript
import { PythagoreanCache } from 'pythagorean-cache';

// dump when size reaches 10
const cache = new PythagoreanCache<string>({ size: 10 });

cache.on('dump', () => {
  /* do something with 10 items */
});

for (let x = 0; x < 10; x++) {
  cache.push(`Hello ${x}`);
}
```

## Options

- size: The size of the cache. When the size is reached, a `dump` event is fired with all the items in the cache and then emptied
- interval: The number of microseconds to wait before firing a `dump` event. This can be used to dump the cache at regular intervals.

These options can be combined, allowing you to create a cache that dumps at a certain size _or_ at a certain interval.

## Inspired Use Case

I was receiving a bursting stream of events I needed to add to a database. Instead of inserting each one as they come in, it was more efficient to do bulk inserts at intervals/sizes. This way that database was protected from burst events and I could expect the events to be inserted within a certain amount of time regardless.
