"use strict";
const Joi = require("joi");
class StatsService {
    /**
     * This class implements the Singleton design pattern. Therefore, actually assign its initialized obj to a property
     * and return that.
     *
     * @param {string}    serviceName
     * @param {string[]}  metricKeysList
     * @return {StatsService}
     */
    constructor(serviceName, metricKeysList) {
        if (!StatsService.instance) {
            this.serviceName = serviceName;
            this.stats = {};
            // The object holding the stats keys for the service utilizing this lib
            this.statsKeys = this.constructStatsKeysObj(serviceName, metricKeysList);
            StatsService.instance = this;
        }
        return StatsService.instance;
    }
    /**
     * The static method that controls the access to the singleton instance.
     *
     * @return {StatsService}
     */
    static getInstance() {
        return StatsService.instance;
    }
    /**
     * The service integrating this module passes a list of metrics keys (for convenience).
     * This function constructs an object out of that list, so the stats keys can be accessed easily.
     *
     * @param {string}    serviceName
     * @param {string[]}  metricKeysList
     * @return  {StatsKeys}
     */
    constructStatsKeysObj(serviceName, metricKeysList) {
        const statsKeys = {};
        for (const key of metricKeysList) {
            const statKey = `${serviceName}_${key}`;
            statsKeys[statKey] = statKey;
            // Also, initialize each key with value of 0.
            this.setStat(statKey, 0);
        }
        return Object.freeze(statsKeys);
    }
    /**
     * Constructs and returns a stat key for a given metric out of the service name and the metric itself.
     * This is needed, since we store the keys as a combination of the service name and the metrics.
     *
     * @param {string} metric
     * @return {string}
     */
    getStatKey(metric) {
        return `${this.serviceName}_${metric}`;
    }
    /**
     * Sets a given stat key with a given value
     *
     * @param {string}  key
     * @param {number}  value
     */
    setStat(key, value) {
        if (!key) {
            throw new Error('Stats key not provided');
        }
        const { value: validValue, error } = Joi.number().required().validate(value);
        if (error) {
            throw new Error(error.message);
        }
        this.stats[key] = validValue;
    }
    /**
     * Returns the value of the given stat. If not present, return 0.
     *
     * @param {string}  key
     * @return {number}
     */
    getStat(key) {
        if (!key) {
            throw new Error('Stats key not provided');
        }
        return this.stats[key] || 0;
    }
    /**
     * Increments the stat value. If the stat key isn't set yet, set it.
     *
     * @param {string}  key
     */
    incrementStat(key) {
        if (!key) {
            throw new Error('Stats key not provided');
        }
        this.stats[key] = (this.stats[key] || 0) + 1;
    }
    /**
     * Decrements the stat value. If the stat key isn't set yet, set it.
     *
     * @param {string}  key
     */
    decrementStat(key) {
        if (!key) {
            throw new Error('Stats key not provided');
        }
        this.stats[key] = (this.stats[key] || 0) - 1;
    }
    /**
     * Return the `stats` object, nested in an object.
     * This schema is required by the stats-collecting agent we use.
     * More info here: https://darcs.atlassian.net/wiki/spaces/DEVELOPMEN/pages/5505224/Grafana
     *
     * @return {{stats: {}}}
     */
    getAllStats() {
        return { stats: this.stats };
    }
    /**
     * Clears the `stats` in-mem object.
     *
     * NOTE: Used for automated tests only!
     *
     * @private
     */
    _clearStats() {
        this.stats = {};
    }
}
module.exports = StatsService;
//# sourceMappingURL=index.js.map