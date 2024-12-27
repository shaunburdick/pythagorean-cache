import { EventEmitter } from 'events';

export interface PythagoreanCacheOpts {
    /**
     * Dump cache when queue reaches this size
     */
    size?: number;

    /**
     * Dump cache every X milliseconds
     */
    interval?: number;
}

/**
 * @link https://en.wikipedia.org/wiki/Pythagorean_cup
 *
 * Creates a cache that will emit its items on:
 * - size: When the cache grows to this size, it will emit the items and reset
 * - interval: Every X milliseconds it will emit the items (if any) and reset
 *
 * @emits dump When the size/interval is met, it will emit the items in the cache and reset
 *
 * @class PythagoreanCache
 * @template T
 */
export class PythagoreanCache<T = unknown> extends EventEmitter {
    private queue: T[] = [];
    private interval: NodeJS.Timeout;

    public constructor(private opts: PythagoreanCacheOpts) {
        super();

        if (!opts.size && !opts.interval) {
            throw new Error('You must specify either a size or interval (or both)');
        }

        this.startInterval();
    }

    public get length() {
        return this.queue.length;
    }

    /**
     * Push an item onto the cache
     *
     * @param items The items to push onto the cache
     * @returns the new size of the cache
     */
    public push(...items: T[]): number {
        this.queue.push(...items);
        if (this.checkLimit()) {
            this.dump();
        }
        return this.length;
    }

    /**
     * Check of the cache has reached its size limit
     *
     * @returns true if limit is reached
     */
    public checkLimit(): boolean {
        return this.opts.size ? this.length >= this.opts.size : false;
    }

    /**
     * Emit the items in the cache, it will do nothing if there are no items in cache
     */
    public dump(): void {
        if (this.length > 0) {
            const items = this.queue.splice(0, this.opts.size || this.length);
            this.emit('dump', items);
        }
    }

    /**
     * Change the size. This will trigger a dump event if newSize is smaller than the current length
     *
     * @param newSize The new size
     */
    public setSize(newSize: number): void {
        this.opts.size = newSize;
        if (this.checkLimit()) {
            this.dump();
        }
    }

    /**
     * Change the interval. This will cause the interval job to restart at zero.
     *
     * @param newInterval The new interval
     */
    public setInterval(newInterval: number): void {
        this.opts.interval = newInterval;
        this.startInterval();
    }

    /**
     * Start the interval dump (if set)
     */
    public startInterval() {
        this.stopInterval();

        if (this.opts.interval) {
            this.interval = setInterval(() => {
                this.dump();
            }, this.opts.interval);
        }
    }

    /**
     * Stop the interval check
     */
    public stopInterval(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
