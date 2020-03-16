type TObject = Record<string, any>

/**
 * How important it is to leave this item in the cache.You can use the values
 * Priority.LOW, .NORMAL, or.HIGH, or you can just use an integer.  Note that placing
 * a priority on an item does not guaranteeit will remain in cache.  It can still
 * be purged ifan expiration is hit, or if the cache is full.
 */
enum Priority {
    LOW = 1,
    NORMAL = 2,
    HIGH = 4
}

type TOptions = {
    expirationAbsolute?: any; // the datetime when the item should expire
    expirationSliding?: number; // an integer representing the seconds since the last cache access after which the item should expire
    priority?: number;
    callback?: any;
}|null;

interface TLSItem{
    key: string;
    value: TObject;
    options: TOptions;
    lastAccessed: number;
}

class LocalStorageCacheStorage {
    private prefix_: string;
    private regexp_: RegExp;
    private fillFactor = 0.75;
    private debug = false;
    public maxSize = -1;

    private stats_={
        hits: 0,
        misses: 0
    };

    constructor (maxSize = -1, debug: boolean, namespace: string) {
        this.prefix_ = "cache-storage." + (namespace || "default") + ".";
        // Regexp String Escaping from http://simonwillison.net/2006/Jan/20/escape/#p-6
        const escapedPrefix = this.prefix_.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        this.regexp_ = new RegExp("^" + escapedPrefix);
        this.debug = debug || false;
        this.maxSize = maxSize;
    };

    /**
     * This method fetches the entire item object stored in local storage for a particular key in the namespace
     * @method private
     * @param key Name of the item stored in local storage
     */
    private get (key: string): null|TLSItem {
        const item = window.localStorage[this.prefix_ + key];
        if (item) return JSON.parse(item);
        return null;
    };

    private log_ (msg: string): void {
        if (this.debug) {
            console.log(msg);
        }
    };

    private addItem (key: string, item: any, attemptedAlready = false): void {
        try {
            window.localStorage[this.prefix_ + key] = JSON.stringify(item);
        } catch (err) {
            if (attemptedAlready) {
                this.log_("Failed setting again, giving up: " + err.toString());
                throw (err);
            }
            this.log_("Error adding item, purging and trying again: " + err.toString());
            this.purgeCache();
            this.addItem(item, true);
        }
    };

    private _CacheItem (key: string, value: any, options: TOptions): TLSItem {
        if (!key) {
            throw new Error("Key cannot be null or empty");
        }
        options = options || {};
        if (options.expirationAbsolute) {
            options.expirationAbsolute = options.expirationAbsolute.getTime();
        }

        options.priority = options.priority ? options.priority : Priority.NORMAL;
        return {
            key,
            value,
            options,
            lastAccessed: new Date().getTime()
        };
    };

    private remove (key: string) {
        const item = this.get(key);
        delete window.localStorage[this.prefix_ + key];
        return item;
    };

    private keys (): string[] {
        const ret = []; let p;
        for (p in window.localStorage) {
            if (p.match(this.regexp_)) ret.push(p.replace(this.prefix_, ""));
        }
        return ret;
    };

    /**
     * Removes expired items from the cache.
     */
    private purgeCache () {
        let tmparray = [];
        let purgeSize = Math.round(this.maxSize * this.fillFactor);
        if (this.maxSize < 0) { purgeSize = this.size() * this.fillFactor; }
        // loop through the cache, expire items that should be expired
        // otherwise, add the item to an array
        const keys = this.keys();
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const item = this.get(key);
            if (item && this.isExpired(item)) {
                this.removeItem(key);
            } else {
                tmparray.push(item);
            }
        }

        if (tmparray.length > purgeSize) {
            // sort this array based on cache priority and the last accessed date
            tmparray = tmparray.sort(function (a, b) {
                if (a.options.priority !== b.options.priority) {
                    return b.options.priority - a.options.priority;
                } else {
                    return b.lastAccessed - a.lastAccessed;
                }
            });
            // remove items from the end of the array
            while (tmparray.length > purgeSize) {
                const ritem = tmparray.pop();
                this.removeItem(ritem.key);
            }
        }
        this.log_("Purged cached");
    };

    /**
     * checks if the item stored in the storage has been expired or not
     * @param item : object of the item to be removed
     */
    private isExpired (item: TLSItem): boolean {
        const now = new Date().getTime();
        let expired = false;
        if (item.options && item.options.expirationAbsolute && (item.options.expirationAbsolute < now)) {
            // if the absolute expiration has passed, expire the item
            expired = true;
        }
        if (!expired && item.options && item.options.expirationSliding) {
            // if the sliding expiration has passed, expire the item
            const lastAccess = item.lastAccessed + (item.options.expirationSliding * 1000);
            if (lastAccess < now) {
                expired = true;
            }
        }
        return expired;
    };

    /**
     * This method is used set data in local storage.
     * @param key : keyname corresponsing to which an entire item object is created and saved
     * @param value : value to be saved
     * @param options :
     */
    public setItem (key: string, value: string|Record<string, string>, options: TOptions = null): void {
        window.localStorage[this.prefix_ + key] = JSON.stringify(value);
        if (this.get(key) != null) {
            this.removeItem(key);
        }
        const item = this._CacheItem(key, value, options);
        this.addItem(key, item);
        this.log_("Setting key " + key);

        // if the cache is full, purge it
        if ((this.maxSize > 0) && (this.size() > this.maxSize)) {
            setTimeout(() => this.purgeCache(), 0);
        }
    };

    public getItem (key: string) {
        // retrieve the item from the cache
        let item = this.get(key);

        if (item != null) {
            if (!this.isExpired(item)) {
                // if the item is not expired
                // update its last accessed date
                item.lastAccessed = new Date().getTime();
            } else {
                // if the item is expired, remove it from the cache
                this.removeItem(key);
                item = null;
            }
        }

        // return the item value (if it exists), or null
        const returnVal = item ? item.value : null;
        if (returnVal) {
            this.stats_.hits++;
            this.log_("Cache HIT for key " + key);
        } else {
            this.stats_.misses++;
            this.log_("Cache MISS for key " + key);
        }
        return returnVal;
    };

    /**
     * This method removes the item from the local storage
     * @param key
     */
    public removeItem (key: string): TObject {
        const item = this.remove(key);
        // if there is a callback function, call it at the end of execution
        if (item && item.options && item.options.callback) {
            setTimeout(() => {
                item.options && item.options.callback.call(null, item.key, item.value);
            }, 0);
        }
        return item ? item.value : null;
    };

    /**
     * This method returns the hits and misses on the cache.
     */
    public getStats (): Record<string, number> {
        return this.stats_;
    };

    /**
     * Returns the total no of items in the storage
     */
    public size (): number {
        return this.keys().length;
    };
}

class CacheFactory {
    /**
     * This method provides a wrapper over local storage methods.
    *  Local Storage based persistant cache storage backend.
    *  If a size of -1 is used, it will purge itself when localStorage
    *  is filled. This is 5MB on Chrome/Safari.
    *
    *  WARNING: The amortized cost of this cache is very low, however,
    *  when a the cache fills up all of localStorage, and a purge is required, it can
    *  take a few seconds to fetch all the keys and values in storage.
    *  Since localStorage doesn't have namespacing, this means that even if this
    *  individual cache is small, it can take this time if there are lots of other
    *  other keys in localStorage.
    * @param {string} namespace A string to namespace the items in localStorage. Defaults to 'default'.
    * */
    public static getCache (namespace: string): null|LocalStorageCacheStorage {
        try {
            if (typeof namespace === "undefined" || parseInt(namespace) <= 0) {
                throw new Error("Invalid app id or namespace: " + namespace);
            }
            if (typeof window.localStorage !== "undefined") {
                return new LocalStorageCacheStorage(-1, false, String(namespace));
            } else {
                throw new Error("Unsupported storage type ");
            }
        } catch (e) {
            console.error(e.message);
            return null;
        }
    }
}

export { CacheFactory };
