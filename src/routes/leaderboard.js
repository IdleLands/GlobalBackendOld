
const _ = require('lodash');

const { DB } = require('../db');

const RUNNER_UPS = 3;

const queries = {
  ascension: {
    'stats.Character.Ascension.Times': { $gt: 0 }
  },
  level: {
    '_level.__current': { $gt: 0 }
  },
  collectibles: {
    uniqueCollectibles: { $gt: 0 }
  },
  achievements: {
    uniqueAchievements: { $gt: 0 }
  },
  titles: {
    totalTitles: { $gt: 0 }
  },
  gold: {
    gold: { $gt: 0 }
  },
  steps: {
    'stats.Character.Steps': { $gt: 0 }
  },
  luck: {},
  combatWin: {
    'stats.Combat.Win': { $gt: 0 }
  }
};

const fields = {
  ascension: {
    'stats.Character.Ascension.Times': 1
  },
  level: {
    '_level.__current': 1
  },
  collectibles: {
    uniqueCollectibles: 1
  },
  achievements: {
    uniqueAchievements: 1
  },
  titles: {
    totalTitles: 1
  },
  gold: {
    gold: 1
  },
  steps: {
    'stats.Character.Steps': 1
  },
  luck: {
    'statCache.luk': 1
  },
  combatWin: {
    'stats.Combat.Win': 1
  }
};

const params = {
  ascension: {
    sort: { 'stats.Character.Ascension.Times': -1 }, limit: RUNNER_UPS
  },
  level: {
    sort: { '_level.__current': -1 }, limit: RUNNER_UPS
  },
  collectibles: {
    sort: { uniqueCollectibles: -1 }, limit: RUNNER_UPS
  },
  achievements: {
    sort: { uniqueAchievements: -1 }, limit: RUNNER_UPS
  },
  titles: {
    sort: { totalTitles: -1 }, limit: RUNNER_UPS
  },
  gold: {
    sort: { gold: -1 }, limit: RUNNER_UPS
  },
  steps: {
    sort: { 'stats.Character.Steps': -1 }, limit: RUNNER_UPS
  },
  goodLuck: {
    sort: { 'statCache.luk': -1 }, limit: RUNNER_UPS
  },
  badLuck: {
    sort: { 'statCache.luk': 1 }, limit: RUNNER_UPS
  },
  combatWin: {
    sort: { 'stats.Combat.Win': -1 }, limit: RUNNER_UPS
  }
};

const formatters = {
  ascension: (obj) => ({ _id: obj._id, ascension: _.get(obj, 'stats.Character.Ascension.Times', 0) }),
  level:     (obj) => ({ _id: obj._id, level: _.get(obj, '_level.__current', 0) }),
  steps:     (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Steps', 0) }),
  luck:      (obj) => ({ _id: obj._id, luk: _.get(obj, 'statCache.luk', 0) }),
  combatWin: (obj) => ({ _id: obj._id, combatWin: _.get(obj, 'stats.Combat.Win', 0) })
};

exports.route = (app) => {
  app.get('/leaderboard', (req, res) => {
    Promise.all([
      DB.$statistics.find(queries.ascension, fields.ascension, params.ascension),
      DB.$players.find(queries.level, fields.level, params.level),
      DB.$collectibles.find(queries.collectibles, fields.collectibles, params.collectibles),
      DB.$achievements.find(queries.achievements, fields.achievements, params.achievements),
      DB.$achievements.find(queries.titles, fields.titles, params.titles),
      DB.$players.find(queries.gold, fields.gold, params.gold),
      DB.$statistics.find(queries.steps, fields.steps, params.steps),
      DB.$players.find(queries.luck, fields.luck, params.goodLuck),
      DB.$players.find(queries.luck, fields.luck, params.badLuck),
      DB.$statistics.find(queries.combatWin, fields.combatWin, params.combatWin)
    ]).then(cursors => {
      return Promise.all(_.map(cursors, cursor => cursor.toArray()));
    }).then(([
      ascensionLeaders,
      levelLeaders,
      collectibleLeaders,
      achievementLeaders,
      titleLeaders,
      goldLeaders,
      stepLeaders,
      goodLuckLeaders,
      badLuckLeaders,
      combatWinLeaders
    ]) => {
      res.json({
        ascensionLeaders: _.map(ascensionLeaders, formatters.ascension),
        levelLeaders: _.map(levelLeaders, formatters.level),
        collectibleLeaders,
        achievementLeaders,
        titleLeaders,
        goldLeaders,
        stepLeaders: _.map(stepLeaders, formatters.steps),
        goodLuckLeaders: _.map(goodLuckLeaders, formatters.luck),
        badLuckLeaders: _.map(badLuckLeaders, formatters.luck),
        combatWinLeaders: _.map(combatWinLeaders, formatters.combatWin)
      });
    }).catch(e => console.error(e));
  });
};