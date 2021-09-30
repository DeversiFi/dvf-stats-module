# stats-module

Tiny module defining functionality to declare and set stats of services runtime activity

## Set up in a service

1. Install the latest version of the module
2. Require and initialize the module at start-up of the service, eg. in your server `index` file:
    ```javascript
    const StatsService = require('dvf-stats-module')

    const statsService = new StatsService()
    ```
3. Create your map of `stats` for the given service by creating a `stats` file in the project, eg:
    ```javascript
    /**
     * @type {Stats}
     */
     const stats = {
       fooMetric: 'foo_metric',
       requestsAccepted: 'requests_accepted',
       somethingElse: 'something_else',
       // add whatever other keys you want to use as metrics
     }

    module.exports = stats

    /**
     * @typedef {Object} Stats
     * @property {string} fooMetric
     * @property {string} requestsAccepted
     * @property {string} somethingElse
     *
     * NOTE: don't forget to declare in the type here every newly added property of the map, for easy access in the IDE
     */
     ```
4. Now, in any place that you want to use the module, you have to require and initialize it. Don't worry, it will not
   create a new instance. It will return a Singleton instance, that you have already initialized in step 2 in your
   startup file. You also Will have to require your `stats` map object, for ease of use of metrics keys:
    ```javascript
    const StatsService = require('dvf-stats-module')
    const stats = require('./utils/stats')
    // This will return an already initialized, Singleton instance
    const statsService = new StatsService()

    // ... some logic   
    statsService.incrementStat(stats.requestsAccepted)
    ```
5. 
