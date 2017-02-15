
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
  },
  events: {
    'stats.Character.Events': { $gt: 0 }
  },
  soloSteps: {
    'stats.Character.Movement.Solo': { $gt: 0 }
  },
  combatDamage: {
    'stats.Combat.Give.Damage': { $gt: 0 }
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
  },
  events: {
    'stats.Character.Events': 1
  },
  soloSteps: {
    'stats.Character.Movement.Solo': 1
  },
  combatDamage: {
    'stats.Combat.Give.Damage': 1
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
  combatWin: {
    sort: { 'stats.Combat.Win': -1 }, limit: RUNNER_UPS
  },
  events: {
    sort: { 'stats.Character.Events': -1 }, limit: RUNNER_UPS
  },
  soloSteps: {
    sort: { 'stats.Character.Movement.Solo': -1 }, limit: RUNNER_UPS
  },
  combatDamage: {
    sort: { 'stats.Combat.Give.Damage': -1 }, limit: RUNNER_UPS
  }
};

const formatters = {
  ascension:    (obj) => ({ _id: obj._id, ascension: _.get(obj, 'stats.Character.Ascension.Times', 0) }),
  level:        (obj) => ({ _id: obj._id, level: _.get(obj, '_level.__current', 0) }),
  steps:        (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Steps', 0) }),
  luck:         (obj) => ({ _id: obj._id, luk: _.get(obj, 'statCache.luk', 0) }),
  combatWin:    (obj) => ({ _id: obj._id, combatWin: _.get(obj, 'stats.Combat.Win', 0) }),
  events:       (obj) => ({ _id: obj._id, events: _.get(obj, 'stats.Character.Events', 0) }),
  soloSteps:    (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Movement.Solo', 0) }),
  combatDamage: (obj) => ({ _id: obj._id, damage: _.get(obj, 'stats.Combat.Give.Damage', 0) })
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
      DB.$statistics.find(queries.combatWin, fields.combatWin, params.combatWin),
      DB.$statistics.find(queries.events, fields.events, params.events),
      DB.$statistics.find(queries.soloSteps, fields.soloSteps, params.soloSteps),
      DB.$statistics.find(queries.combatDamage, fields.combatDamage, params.combatDamage)
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
      combatWinLeaders,
      eventLeaders,
      soloLeaders,
      damageLeaders
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
        combatWinLeaders: _.map(combatWinLeaders, formatters.combatWin),
        eventLeaders: _.map(eventLeaders, formatters.events),
        soloLeaders: _.map(soloLeaders, formatters.soloSteps),
        damageLeaders: _.map(damageLeaders, formatters.combatDamage)
      });
    }).catch(e => console.error(e));
  });
};