import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { LRUCache } from 'lru-cache';

import { readJsonFile } from '@/utils/fs';

const getCacheFilePath = ({ cacheName, cachePath }: { cacheName: string; cachePath?: string }) => {
  const cachePathDirectory = cachePath ?? homedir();

  if (!existsSync(cachePathDirectory)) {
    mkdirSync(cachePathDirectory);
  }

  return join(cachePathDirectory, cacheName);
};

type FsCacheParams<Key extends {}, Value extends {}, FC = unknown> = LRUCache.Options<Key, Value, FC> & {
  cacheName: string;
  cachePath?: string;
};

export const fsCache = <Key extends {}, Value extends {}, FC = unknown>(opts: FsCacheParams<Key, Value, FC>) => {
  const cache = new LRUCache(opts);
  const cacheFilePath = getCacheFilePath({ cacheName: opts.cacheName, cachePath: opts.cachePath });
  const loadedCache = readJsonFile<Array<[Key, LRUCache.Entry<Value>]>>(cacheFilePath);

  cache.load(loadedCache ?? []);
  const purged = cache.purgeStale();

  const dump = () => {
    writeFileSync(cacheFilePath, JSON.stringify(cache.dump(), null, 2));
  };

  if (purged) {
    dump();
  }

  const clear = () => {
    cache.clear();
    dump();
  };

  const removeItem = (key: Key) => {
    const res = cache.delete(key);

    dump();

    return res;
  };

  // eslint-disable-next-line max-params
  const setItem = (key: Key, value: Value, opts?: LRUCache.SetOptions<Key, Value, FC>) => {
    cache.set(key, value, opts);
    dump();
  };

  return Object.assign(cache, {
    syncFs: {
      clear,
      dump,
      removeItem,
      setItem,
    },
  });
};
