import * as Joi from 'joi'
import { Stats } from './types';

export default class StatsService {
  private stats: Stats
  private statsKeys

  constructor() {
    this.stats = {}
    // The object holding the stats keys for the service utilizing this lib
    this.statsKeys = {}
  }

  /**
   * Sets a given stat key with a given value
   *
   * @param key
   * @param value
   */
  setStat(key, value): void {
    if (!key) {
      throw new Error('Stats key not provided')
    }

    const { value: validValue, error } = Joi.number().required().validate(value)
    if (error) {
      throw new Error(error.message)
    }
    this.stats[key] = validValue
  }

  /**
   * Returns the value of the given stat. If not present, return 0.
   *
   * @param key
   * @return {number}
   */
  getStat(key): number {
    if (!key) {
      throw new Error('Stats key not provided')
    }
    return this.stats[key] || 0
  }

  /**
   * Increments the stat value. If the stat key isn't set yet, set it.
   *
   * @param key
   */
  incrementStat(key): void {
    if (!key) {
      throw new Error('Stats key not provided')
    }
    this.stats[key] = (this.stats[key] || 0) + 1
  }

  /**
   * Decrements the stat value. If the stat key isn't set yet, set it.
   *
   * @param key
   */
  decrementStat(key): void {
    if (!key) {
      throw new Error('Stats key not provided')
    }
    this.stats[key] = (this.stats[key] || 0) - 1
  }

  /**
   * Return the `stats` object, nested in an object.
   * This schema is required by the stats-collecting agent we use.
   * More info here: https://darcs.atlassian.net/wiki/spaces/DEVELOPMEN/pages/5505224/Grafana
   *
   * @return {{stats: {}}}
   */
  getAllStats(): { stats: Stats } {
    return { stats: this.stats }
  }

  /**
   * Clears the `stats` in-mem object. Used for automated tests only!
   *
   * @private
   */
  _clearStats(): void {
    this.stats = {}
  }
}
