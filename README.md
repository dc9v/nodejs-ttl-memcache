# TTLMemCache

## Summary

TTL(time to live) 메모리 캐시를 사용하도록 구현했습니다.

`TTLMemCache`를 글로벌 함수처럼 쉽게 사용하세요.

## Hot to install?

설치하는 방법은 아래와 같습니다.

```
npm:
   npm i nodejs-ttl-memcache

yarn:
   yarn add nodejs-ttl-memcache
```

## Get start!

간단하게 사용하는 방법입니다.

```ts
import TTLMemCache from "nodejs-ttl-memcache";

TTLMemCache.set<string>("KEY_NAME", "TTL memCache");
TTLMemCache.get<string>("KEY_NAME");
```

## Example codes

* 기본적인 TTL 메모리캐시의 작동방법

    TTL 메모리캐시의 기본적인 작동을 보여주는 코드입니다.

    TTL을 3000 밀리초로 설정 후 초당 로그를 보여줍니다.

    ```ts
    import TTLMemCache from "nodejs-ttl-memcache";

    const KEY_NAME = "KEY_NAME";
    const value = { 
      value: "Hello", 
      ttl: 3000, 
      onExpired: (key: string) => console.log(`${key} was expired.`) 
      };

    console.log(`(1) TTL 3000`);
    TTLMemCache.set<string>(KEY_NAME, value); 

    for (let i = 0; i <= 5; i++) 
    {
      setTimeout( () => console.log( `${i} ${TTLMemCache.has(KEY_NAME)}: ${TTLMemCache.get(KEY_NAME)}` ),  i * 1000);
    }

    /**
     * Result
    * ======
    *
    *  (1) TTL 3000
    *  0 true : Hello
    *  1 true : Hello
    *  2 true : Hello
    *  KEY_NAME was expired.
    *  3 false : null
    *  4 false : null
    *  5 false : null
    */
    ```

* 강제 캐시만료

  설정된 TTL 시간 이전 강제로 캐시를 만료하는 예를 보여줍니다.

    ```ts
    import TTLMemCache from "nodejs-ttl-memcache";

    const KEY_NAME = "KEY_NAME";

    console.log(`(2) TTL 5000 EXPIRE 1500`);
    TTLMemCache.set(KEY_NAME, "World", 5000); // 5000 milliseconds

    for (let i = 1; i <= 5; i++) 
    {
      setTimeout( () => console.log( `${i} ${TTLMemCache.has(KEY_NAME)}: ${TTLMemCache.get(KEY_NAME)}` ), i * 1000 );
    }

    setTimeout(() => { TTLMemCache.expire(KEY_NAME); console.log(`${key} was expired.`); }, 1500); // Kill cache


    /**
     * Result
    * ======
    * 
    *  (2) TTL 5000 EXPIRE 1500
    *  0 true : Hello
    *  1 true : Hello
    *  KEY_NAME was expired.
    *  2 false : null
    *  3 false : null
    *  4 false : null
    *  5 false : null
    */
    ```

* TTL 메모리 캐시의 기본설정값

  ttl 시간을 지정하지 않을 경우 `TTLMemCache.Options.ttl`값이 기본 값으로 설정됩니다.

    ```ts
    TTLMemCache.Options.debug = true;
    TTLMemCache.Options.ttl = 500;
    ```


## API, Types and interfaces

- API

  | 함수                                                                    | 리턴        | 설명                                                      |
  | ----------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
  | `set<T>(cache: CacheParams<T>)`                                         | `void`      | Cache를 설정/저장합니다                                   |
  | `set<T>(key: KeyType, value: T, ttl: number)`                           | `void`      | Key 이름 기준으로 Cache를 설정/저장합니다                 |
  | `set<T>(key: KeyType, cache: Omit<CacheParams<T>, "key">, ttl: number)` | `void`      | (위와 같음)                                               |
  | `has(key: KeyType)`                                                     | `boolean`   | Key 이름 기준으로 Cache가 생존/정의되어 있는지 확인합니다 |
  | `get<T>(key: KeyType, defaultValue: T)`                                 | `T \| null` | Key 이름 기준으로 Cache 값을 읽습니다                     |
  | `expire(key: KeyType)`                                                  | `void`      | Key 이름 기준으로 Cache를 즉시 파기합니다                 |
  | `clear()`                                                               | `void`      | 메모리 캐시의 모든 키, 값을 즉시 파기합니다               |

- Type

  ```ts
  export type CacheParams<T = any> = {
    key: string | number;
    value: T;
    ttl?: number;
    onExpired?: (key: any) => void | any;
  };

  export type KeyType = string | number;
  ```

---

# License

TTLMemCache is MIT licensed.


[<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAklEQVR4AewaftIAAACiSURBVMXBsQmDUABF0evLrwISy2yQ1g3UzpHcyBXs9HeCE2SJgEhq0waxEBTeOckEK0bCTJgJM2EW2PGoa9Ki4EpLjMxdx1ZgR1oUPJuGq81dx5YwE2bCLHDSMgxs3fOcW5ZxROCkd1Wx9ep70rLkCGEmzISZMBNmwkyYCTNhJsyEmTATZsIssGOJkTM+bct3HPm3xMieZIIVI2EmzISZMPsBPLUeCZWhvyQAAAAASUVORK5CYII=" width=20>](https://www.npmjs.com/package/nodejs-ttl-memcache) [<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANTSURBVHgBvVeNTdtAFH7vbCilUptuYFQihUhNzQQJEzSZoGSChgkIEwATNJ0AmICM4ISKWCKoHiGtVDUCn1/v2cRx4nNIcNRPgpzvnd/fvT8jLAnLsgrGVqEOQlaR0AYECwgKIRFhpNYeITkQYFeOf195njdahi8+K7hUsgzcaCPi51jgElDKdGTweOK5rgcvUYAtNl+/PVbLFuSBoDP/j3Hiec5oaQUiqzevFdGCNYAAPEkPBzpviPmNYrlsr1M4g3kxz2KxbGtoU6zb8nnoPBF7IIzyOeH8gvp/Gf2uCJUZRNRRK2e6FXnCsuxCSgEOuJTlBO3h4KZxP+jvKGbNWBFOu5AxdeO/aO9JMBwOb/vv792bJlBwNKsXWOYbeZx4jlxv4ubPlBG+2L+7c2ILLFtpPh4XslLLKtkWjGGUjHjeMzFI8fbpYYf5mPzAea5j+GjATOp4Tsg4s8B4ruPBkjDEBnuhKdgqBPyiPQSyBjlhZgS0qqZ1jgVhjGVddyCMWDC6kBP+FjgZQaxKu6wLFQU10GvQXsWlWeBrQwqaeqqoClXjP+lIciyuYE0Yuj+mWZIACrI5Da15Arssq3bngAdpQZZYpcPlApHOoIKA/wVEraFCezdhZbbX6xkCW7M7Yg94uvPGtqzCmrBbsmtaAoInKICelkY5B5EECOWhdj9AR0TNRKtCbXevkluJ4l7la1alZdlCbhmXujh4wuluuXIMOYSrlD7LonOtCbvhh71KRy0iLQlOwukW8HTSnrkuKFedEYne0HW6sEho0bbBDKqEcJgReJEYws6922s+teNpywzrtqQjuW10zYfgOs0EL4eDXkPHdLf88UJdeB2WgE9ih0t9WAd4oQSfh+yVPmjgN+77fiAaqUZC8jyTa0DZtCQLJWvSZ+JCJF+JdkIYj2ctPiRJHPALPF4p5VphXc/AIlpCuCf/ivbkeW4otdXMFsRzIfq+mohuHVgBKnNooXBlULLLpr4LeCwPyLyIA1B94QhCJyDxS2Dw7m7QP3+JAmEgo2goe2YMyvgwmfVEEsNBH1dVQGf5BNpmxAd5EuaUhJzg+FF3vp813CzshkO33+Z0UUy+w7LgohaO5tjhd5UhrbXMFtwdeXx/9py6vlU66T98qp4a9HCubgAAAABJRU5ErkJggg==" width=20>](https://github.com/try-to-awakening/nodejs-ttl-memcache)