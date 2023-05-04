# typeorm-lru-cache

An in-memory lru cache for typeorm

Badically just a wrapper for [lru-cache](https://www.npmjs.com/package/lru-cache)

## Usage

Use the provider for the cache when [configuring typeorm](https://github.com/typeorm/typeorm/blob/master/docs/caching.md)

```typescript
import LRUCacheProvider from 'typeorm-lru-cache'
{
    ...
    cache: {
        provider: () => {
            return new LRUCacheProvider({
              max: 1000,

              // how long to live in ms
              ttl: 20000,

              // return stale items before removing from cache?
              allowStale: false,

              updateAgeOnGet: false,
              updateAgeOnHas: false,
            });
          },
    }
}
```
