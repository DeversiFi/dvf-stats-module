import StatsService from '../src/index';

describe('stats service', function () {
  const testStatKey = 'test_stat';
  const statsService = new StatsService('stats_service', ['test_stat']);

  beforeEach(() => {
    statsService._clearStats();
  })

  it('should be identical instance at subsequent initializations, proving the Singleton pattern', function () {
    const anotherStatsServiceInst = new StatsService('some_new_service', ['other_stats_yooo']);

    anotherStatsServiceInst.getAllStats().should.deep.equal(statsService.getAllStats());
  })

  it('should set and get stat', function () {
    statsService.setStat(testStatKey, 123);
    const stat = statsService.getStat(testStatKey);

    stat.should.equal(123);
  })

  it('should increment a stat after its been set and get it', function () {
    statsService.setStat(testStatKey, 123);
    statsService.incrementStat(testStatKey);
    const stat = statsService.getStat(testStatKey);

    stat.should.equal(124);
  })

  it('should set a new stat when not present when trying to increment the stat', function () {
    statsService.incrementStat(testStatKey);
    const stat = statsService.getStat(testStatKey);

    stat.should.equal(1);
  })

  it('should decrement an already set stat', function () {
    statsService.setStat(testStatKey, 123);
    statsService.decrementStat(testStatKey);
    const stat = statsService.getStat(testStatKey);

    stat.should.equal(122);
  })

  it('should set a new stat when not present when trying to decrement the stat', function () {
    statsService.decrementStat(testStatKey);
    const stat = statsService.getStat(testStatKey);

    stat.should.equal(-1);
  })

  it('should get all stats nested in a "stats" object', function () {
    statsService.setStat(testStatKey, 1);
    statsService.setStat(`${testStatKey}_A`, 2);
    statsService.setStat(`${testStatKey}_B`, 3);
    const stats = statsService.getAllStats();

    stats.should.deep.equal({
      stats: {
        [testStatKey]: 1,
        [`${testStatKey}_A`]: 2,
        [`${testStatKey}_B`]: 3
      }
    });
  })
})
