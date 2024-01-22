"use strict";
var TTLMemCache;
(function (TTLMemCache) {
    const Data = new Map();
    TTLMemCache.Options = {
        ttl: 1000, // 1000 milliseconds = 1 seconds
        debug: false
    };
    class TTLCacheHandler {
        constructor(key, ttl, onExpired = function (key) { }) {
            this.onExpired = Object.create(onExpired);
            this.timer = setTimeout((v) => {
                this.expire(v.key, v.cb);
            }, ttl, { key: String(key), cb: onExpired });
        }
        expire(key, onExpired) {
            clearTimeout(this.timer);
            Data.set(key, null);
            Data.delete(String(key));
            onExpired(key);
        }
        ;
        terminate() {
            clearTimeout(this.timer);
        }
    }
    ;
    function set(arg1, arg2, timetolive) {
        var _a, _b, _c, _d, _e, _f;
        const put = (k, v) => {
            if (Data.has(k)) {
                expire(k);
                Data.delete(k);
            }
            Data.set(k, Object.freeze(v));
        };
        const _func = function () { };
        const _key = typeof arg1 === "object" ? String(arg1.key) : String(arg1);
        const _value = typeof arg1 === "object" ? (_a = arg1 === null || arg1 === void 0 ? void 0 : arg1.value) !== null && _a !== void 0 ? _a : null : typeof arg2 === "object" && ((_b = arg2 === null || arg2 === void 0 ? void 0 : arg2.value) !== null && _b !== void 0 ? _b : false) ? (_c = arg2 === null || arg2 === void 0 ? void 0 : arg2.value) !== null && _c !== void 0 ? _c : null : arg2 !== null && arg2 !== void 0 ? arg2 : null;
        const _ttl = typeof timetolive !== "undefined" ? timetolive || TTLMemCache.Options.ttl : typeof arg1 === "object" ? (arg1 === null || arg1 === void 0 ? void 0 : arg1.ttl) || TTLMemCache.Options.ttl : TTLMemCache.Options.ttl;
        const cache = {
            key: _key, value: _value, ttl: _ttl,
            createdAt: Date.now(),
            handler: new TTLCacheHandler(_key, _ttl, (typeof arg1 === "object") ? (_d = arg1 === null || arg1 === void 0 ? void 0 : arg1.onExpired) !== null && _d !== void 0 ? _d : _func : (typeof arg2 === "object" && ((_e = arg2 === null || arg2 === void 0 ? void 0 : arg2.value) !== null && _e !== void 0 ? _e : false)) ? (_f = arg2 === null || arg2 === void 0 ? void 0 : arg2.onExpired) !== null && _f !== void 0 ? _f : _func : _func)
        };
        put(_key, cache);
    }
    TTLMemCache.set = set;
    function has(key) {
        key = String(key);
        if (Data.has(key)) {
            const cache = Data.get(key);
            if (cache !== null && cache !== void 0 ? cache : false) {
                const expire = ((cache === null || cache === void 0 ? void 0 : cache.createdAt) || 0) + (((cache === null || cache === void 0 ? void 0 : cache.ttl) || 0));
                return (expire > Date.now());
            }
        }
        return false;
    }
    TTLMemCache.has = has;
    function get(key, defaultValue = null) {
        var _a, _b;
        key = String(key);
        if (Data.has(key)) {
            const cache = Data.get(key);
            if (cache !== null && cache !== void 0 ? cache : false) {
                const expire = ((cache === null || cache === void 0 ? void 0 : cache.createdAt) || 0) + (((cache === null || cache === void 0 ? void 0 : cache.ttl) || 0));
                if (expire >= Date.now()) {
                    return (_b = (_a = Data.get(key)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : defaultValue;
                }
            }
            expire(key);
        }
        return defaultValue;
    }
    TTLMemCache.get = get;
    function expire(key) {
        var _a, _b;
        key = String(key);
        if (Data.has(key)) {
            (_b = (_a = Data.get(key)) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.terminate();
            Data.delete(key);
        }
    }
    TTLMemCache.expire = expire;
    function clear() {
        var _a, _b;
        for (const key in Data.keys()) {
            (_b = (_a = Data.get(key)) === null || _a === void 0 ? void 0 : _a.handler) === null || _b === void 0 ? void 0 : _b.terminate();
            Data.delete(key);
        }
    }
    TTLMemCache.clear = clear;
})(TTLMemCache || (TTLMemCache = {}));
