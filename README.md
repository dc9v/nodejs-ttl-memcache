# TTLMemCache

## 1. SUMMARY

TTL(time to live) 메모리 캐시를 사용하도록 구현했습니다.

`TTLMemCache`를 글로벌 함수처럼 쉽게 사용하세요.

## 2. INSTALL

설치하는 방법은 아래와 같습니다.

```
npm:
   npm i node-ttl-memcache

yarn:
   yarn add node-ttl-memcache
```

## 3. GET START

간단하게 사용하는 방법입니다.

```ts
import TTLMemCache from "node-ttl-memcache";

TTLMemCache.set<string>("KEY_NAME", "TTL memCache");
TTLMemCache.get<string>("KEY_NAME");
```

## 4. Example code

* 기본적인 TTL 메모리캐시의 작동방법

    TTL 메모리캐시의 기본적인 작동을 보여주는 코드입니다.

    TTL을 3000 밀리초로 설정 후 초당 로그를 보여줍니다.

    ```ts
    import TTLMemCache from "node-ttl-memcache";

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
    import TTLMemCache from "node-ttl-memcache";

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


## Interfaces

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
