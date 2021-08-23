import * as Joi from 'joi'
import { Stats, StatsKeys } from './types';

export default class StatsService {
  private static instance: StatsService;
  private stats: Stats;
  public statsKeys: StatsKeys;

  /**
   * This class implements the Singleton design pattern. Therefore, the constructor should always be private to prevent
   * direct construction calls with the `new` operator.
   *
   * @param {string}    serviceName
   * @param {string[]}  serviceKeysList
   * @private
   */
  private constructor(serviceName: string, serviceKeysList: string[]) {
    this.stats = {};
    // The object holding the stats keys for the service utilizing this lib
    this.statsKeys = this.constructStatsKeysObj(serviceName, serviceKeysList);
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * @param {string}    serviceName
   * @param {string[]}  serviceKeysList
   * @return {StatsService}
   */
  static getInstance(serviceName: string, serviceKeysList: string[]): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService(serviceName, serviceKeysList);
    }

    return StatsService.instance;
  }

  /**
   * The service integrating this module passes a list of stats keys (for convenience).
   * This function constructs an object out of that list, so the stats keys can be accessed easily.
   *
   * @param {string}  serviceName
   * @param {string}  serviceKeysList
   * @return  {StatsKeys}
   */
  constructStatsKeysObj(serviceName: string, serviceKeysList: string[]): StatsKeys {
    const statsKeys: StatsKeys = {};

    for (const key of serviceKeysList) {
      const statKey = `${serviceName}_${key}`;
      statsKeys[statKey] = statKey;
    }

    return Object.freeze(statsKeys);
  }

  /**
   * Sets a given stat key with a given value
   *
   * @param {string}  key
   * @param {number}  value
   */
  setStat(key: string, value: number): void {
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
  getStat(key: string): number {
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
  incrementStat(key: string): void {
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
  decrementStat(key: string): void {
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
  getAllStats(): { stats: Stats } {
    return { stats: this.stats };
  }

  /**
   * Clears the `stats` in-mem object.
   *
   * NOTE: Used for automated tests only!
   *
   * @private
   */
  _clearStats(): void {
    this.stats = {};
  }
}
