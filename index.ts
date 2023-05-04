import { createHash } from "crypto";
import { LRUCache } from "lru-cache";
import { QueryResultCache } from "typeorm/cache/QueryResultCache";
import { QueryResultCacheOptions } from "typeorm/cache/QueryResultCacheOptions";

export default class LRUCacheProvider<FC> implements QueryResultCache {
  private cache: LRUCache<string, QueryResultCacheOptions, FC>;

  constructor(options: LRUCache.Options<string, QueryResultCacheOptions, FC>) {
    this.cache = new LRUCache<string, QueryResultCacheOptions, FC>(options);
  }

  private makeIdentifier(query?: string): string {
    return query ? `${createHash("md5").update(query).digest("hex")}` : "";
  }

  connect(): Promise<void> {
    return Promise.resolve();
  }
  disconnect(): Promise<void> {
    return Promise.resolve();
  }
  synchronize(): Promise<void> {
    return Promise.resolve();
  }

  async getFromCache(
    options: QueryResultCacheOptions
  ): Promise<QueryResultCacheOptions | undefined> {
    const value = this.cache.get(
      options.identifier || this.makeIdentifier(options.query)
    );
    return Promise.resolve(value);
  }

  async storeInCache(
    options: QueryResultCacheOptions,
    savedCache: QueryResultCacheOptions | undefined
  ): Promise<void> {
    this.cache.set(
      options.identifier || this.makeIdentifier(options.query),
      options,
      {
        start: options.time,
        ttl: options.duration,
      }
    );
  }

  isExpired(savedCache: QueryResultCacheOptions): boolean {
    return savedCache.time! + savedCache.duration < new Date().getTime();
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async remove(identifiers: string[]): Promise<void> {
    for (const identifier of identifiers) {
      this.cache.delete(identifier);
    }
  }
}
