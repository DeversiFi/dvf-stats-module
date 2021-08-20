import * as Joi from 'joi'
import { Stats } from './types';

let stats: Stats = {}

/**
 * Sets a given stat key with a given value
 *
 * @param key
 * @param value
 */
function setStat(key, value): void {
  if (!key) {
    throw new Error('Stats key not provided')
  }

  const { value: validValue, error } = Joi.number().required().validate(value)
  if (error) {
    throw new Error(error.message)
  }
  stats[key] = validValue
}

/**
 * Returns the value of the given stat. If not present, return 0.
 *
 * @param key
 * @return {number}
 */
function getStat(key): number {
  if (!key) {
    throw new Error('Stats key not provided')
  }
  return stats[key] || 0
}

/**
 * Increments the stat value. If the stat key isn't set yet, set it.
 *
 * @param key
 */
function incrementStat(key): void {
  if (!key) {
    throw new Error('Stats key not provided')
  }
  stats[key] = (stats[key] || 0) + 1
}

/**
 * Decrements the stat value. If the stat key isn't set yet, set it.
 *
 * @param key
 */
function decrementStat(key): void {
  if (!key) {
    throw new Error('Stats key not provided')
  }
  stats[key] = (stats[key] || 0) - 1
}

/**
 * Return the `stats` object, nested in an object.
 * This schema is required by the stats-collecting agent we use.
 * More info here: https://darcs.atlassian.net/wiki/spaces/DEVELOPMEN/pages/5505224/Grafana
 *
 * @return {{stats: {}}}
 */
function getAllStats(): { stats: Stats } {
  return { stats }
}

/**
 * The object holding the stats keys for the service utilizing this lib
 */
const statsKeys = {
  'bfxSync': 'bfx_sync_total_candles_synced'
}

/**
 * Clears the `stats` in-mem object. Used for automated tests only!
 *
 * @private
 */
function _clearStats(): void {
  stats = {}
}

module.exports = {
  setStat,
  getStat,
  incrementStat,
  decrementStat,
  getAllStats,
  statsKeys,

  // used for automated tests
  _clearStats
}
