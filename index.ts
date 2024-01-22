namespace TTLMemCache
{
  type callback = (key: any) => void | any;
  const Data: Map<string, TTL<any> | null | Readonly<any>> = new Map<string, TTL<any> | null | Readonly<any>>();

  export const Options =
  {
    ttl: 1000, // 1000 milliseconds = 1 seconds
    debug: false
  };

  export type CacheParams<T = any> = {
    key: string | number | undefined | null;
    value: T;
    ttl?: number;
    onExpired?: callback;
  };

  interface TTL<T = any | null> extends CacheParams<T | null>
  {
    key: string;
    handler?: TTLCacheHandler;
    createdAt?: number;
  }

  class TTLCacheHandler
  {
    private timer: NodeJS.Timeout;
    private onExpired: callback;

    constructor(key: string | number, ttl: number, onExpired: callback = function (key: any) { })
    {
      this.onExpired = Object.create(onExpired);

      this.timer = setTimeout((v: { key: string, cb: callback }) =>
      {
        this.expire(v.key, v.cb);
      }, ttl, { key: String(key), cb: onExpired });
    }

    expire(key: string, onExpired: callback)
    {
      clearTimeout(this.timer);

      Data.set(key, null);
      Data.delete(String(key));

      onExpired(key);
    };

    terminate()
    {
      clearTimeout(this.timer);
    }
  };


  export function set<T = any>(key: string | number, value: CacheParams<T> | any, ttl?: number): void
  export function set<T = any>(record: CacheParams<T>, ttl?: number): void
  export function set<T = any>(arg1: string | number | CacheParams<T>, arg2?: CacheParams<T> | any, timetolive?: number): void
  {
    const put = <T = any>(k: string, v: T) =>
    {
      if (Data.has(k))
      {
        expire(k);
        Data.delete(k);
      }

      Data.set(k, Object.freeze<T>(v));
    };

    const _func = function () { };
    const _key = typeof arg1 === "object" ? String(arg1.key) : String(arg1);
    const _value = typeof arg1 === "object" ? arg1?.value ?? null : typeof arg2 === "object" && (arg2?.value ?? false) ? arg2?.value ?? null : arg2 ?? null;
    const _ttl = typeof timetolive !== "undefined" ? timetolive || Options.ttl : typeof arg1 === "object" ? arg1?.ttl || Options.ttl : Options.ttl;

    const cache: TTL<T> =
    {
      key: _key, value: _value, ttl: _ttl,
      createdAt: Date.now(),
      handler: new TTLCacheHandler(_key, _ttl, (typeof arg1 === "object") ? arg1?.onExpired ?? _func : (typeof arg2 === "object" && (arg2?.value ?? false)) ? arg2?.onExpired ?? _func : _func)
    };

    put<TTL<T>>(_key, cache);
  }

  export function has(key: string | number): boolean
  {
    key = String(key);

    if (Data.has(key))
    {
      const cache = Data.get(key);

      if (cache ?? false)
      {
        const expire = (cache?.createdAt || 0) + ((cache?.ttl || 0));
        return (expire > Date.now());
      }
    }

    return false;
  }

  export function get<T = any>(key: string | number, defaultValue: T | null = null): T | null
  {
    key = String(key);

    if (Data.has(key))
    {
      const cache = Data.get(key);

      if (cache ?? false)
      {
        const expire = (cache?.createdAt || 0) + ((cache?.ttl || 0));

        if (expire >= Date.now())
        {
          return Data.get(key)?.value as T ?? defaultValue;
        }
      }

      expire(key);
    }

    return defaultValue;
  }

  export function expire(key: string | number): void
  {
    key = String(key);

    if (Data.has(key))
    {
      Data.get(key)?.handler?.terminate();
      Data.delete(key);
    }
  }

  export function clear(): void
  {
    for (const key in Data.keys())
    {
      Data.get(key)?.handler?.terminate();
      Data.delete(key);
    }
  }
}