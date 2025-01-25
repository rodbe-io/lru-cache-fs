# @rodbe/lru-cache-fs

`@rodbe/lru-cache-fs` is a TypeScript library that provides a file system-backed Least Recently Used (LRU) cache using the [`lru-cache` package][lru-cache]. This library allows you to **persist cache data to the file system, automatically managing stale data and ensuring cache state is saved after each operation**.

## Features

- LRU caching with customizable options.
- Automatic persistence of cache data to the file system.
- Load and dump cache state from/to the file system.
- Provides utility methods to interact with the cache, like clearing the cache, setting items, and removing items.

## Installation

```bash
npm i @rodbe/lru-cache-fs --save
```

## Usage
This library exntends the [lru-cache] library, and adds a `syncFs` property to the cache instance, to enable cache persistence on the FS

### Configuration Options
The cacheFactory **accepts all options available in** [lru-cache] along with the following additional parameters:

- `cacheName` (string): The filename for storing the cached data.

- `cachePath` (string, optional): The directory path for storing the cache file. **Defaults to the user's home directory**.

```ts
import { homedir } from 'node:os';
import { join } from 'node:path';

import { cacheFactory } from 'lru-cache-fs';

interface MyValue {
  data: string;
}

const myCache = cacheFactory<string, MyValue>({
  cacheName: 'my-cache-file.json', // or without file extension
  cachePath: join(homedir(), '.my-libray-folder');
  max: 50,
});

// add value to the cache
myCache.syncFs.setItem('some-key', { someProp: 'some value' });

// retrieve value from the cache
const value = myCache.get('some-key');
console.log(value) // Outputs: { someProp: 'some value' }

// remove key from the cache
myCache.syncFs.removeItem('some-key');

// clear the cache
myCache.syncFs.clear();

```

### Accessing to `syncFs` methods

| Methods             | Description                                         | Returns                                               |
|---------------------|-----------------------------------------------------|-------------------------------------------------------|
| clear()             | Clear the cache entirely, throwing away all values. | void                                                  |
| dump()              | Synchronize the memory cache on the file system     | void                                                  |
| removeItem(key)     | Deletes a key out of the cache.                     | Returns true if the key was deleted, false otherwise. |
| setItem(key, value) | Add a value to the cache.                           | void                                                  |


### Accessing other [lru-cache] methods
```ts
// for example:
myCache.has('key'); // Check if a key is in the cache, returns a boolean.
myCache.dump(); // Return the actual cache in memory, can be passed to LRUCache#load.
// ... and others
```

### Loading Cached Data
When you create a cache instance using cacheFactory, it will **automatically load any cached data from the specified file**. If the file doesn't exist or is not in JSON format, the cache will start empty.

### Dumping Cache to File
The cache state is automatically saved to the specified file whenever an item is set or removed, or the cache is cleared.



### License
MIT License

[lru-cache]: https://www.npmjs.com/package/lru-cache