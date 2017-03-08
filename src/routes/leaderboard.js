
const _ = require('lodash');

const { DB } = require('../db');

const RUNNER_UPS = 5;

const queries = {
  ascLevel: {
    'stats.Character.Ascension.Levels': { $gt: 0 }
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
  astralSteps: {
    'stats.Character.Terrains.Astral': { $gt: 0 }
  },
  acidSteps: {
    'stats.Character.Terrains.Acid': { $gt: 0 }
  },
  luck: {},
  fateful: {
    'stats.Character.Event.Providence': { $gt: 0 }
  },
  combatWin: {
    'stats.Combat.Win': { $gt: 0 }
  },
  events: {
    'stats.Character.Events': { $gt: 0 }
  },
  soloSteps: {
    'stats.Character.Movement.Solo': { $gt: 0 }
  },
  drunkSteps: {
    'stats.Character.Movement.Drunk': { $gt: 0 }
  },
  campingSteps: {
    'stats.Character.Movement.Camping': { $gt: 0 }
  },
  partySteps: {
    'stats.Character.Movement.Party': { $gt: 0 }
  },
  combatDamage: {
    'stats.Combat.Give.Damage': { $gt: 0 }
  },
  monsterKills: {
    'stats.Combat.Kills.Monster': { $gt: 0 }
  },
  playerKills: {
    'stats.Combat.Kills.Player': { $gt: 0 }
  },
  overkill: {
    'stats.Combat.Give.Overkill': { $gt: 0 }
  },
  takenDamage: {
    'stats.Combat.Receive.Damage': { $gt: 0 }
  }
};

const fields = {
  ascLevel: {
    'stats.Character.Ascension.Levels': 1
  },
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
  astralSteps: {
    'stats.Character.Terrains.Astral': 1
  },
  acidSteps: {
    'stats.Character.Terrains.Acid': 1
  },
  luck: {
    'statCache.luk': 1
  },
  fateful: {
    'stats.Character.Event.Providence': 1
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
  drunkSteps: {
    'stats.Character.Movement.Drunk': 1
  },
  campingSteps: {
    'stats.Character.Movement.Camping': 1
  },
  partySteps: {
    'stats.Character.Movement.Party': 1
  },
  combatDamage: {
    'stats.Combat.Give.Damage': 1
  },
  monsterKills: {
    'stats.Combat.Kills.Monster': 1
  },
  playerKills: {
    'stats.Combat.Kills.Player': 1
  },
  overkill: {
    'stats.Combat.Give.Overkill': 1
  },
  takenDamage: {
    'stats.Combat.Receive.Damage': 1
  }
};

const params = {
  ascLevel: {
    sort: { 'stats.Character.Ascension.Levels': -1 }
  },
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
  astralSteps: {
    sort: { 'stats.Character.Terrains.Astral': -1 }, limit: RUNNER_UPS
  },
  acidSteps: {
    sort: { 'stats.Character.Terrains.Acid': -1 }, limit: RUNNER_UPS
  },
  goodLuck: {
    sort: { 'statCache.luk': -1 }, limit: RUNNER_UPS
  },
  fateful: {
    sort: { 'stats.Character.Event.Providence': -1 }, limit: RUNNER_UPS
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
  drunkSteps: {
    sort: { 'stats.Character.Movement.Drunk': -1 }, limit: RUNNER_UPS
  },
  campingSteps: {
    sort: { 'stats.Character.Movement.Camping': -1 }, limit: RUNNER_UPS
  },
  partySteps: {
    sort: { 'stats.Character.Movement.Party': -1 }, limit: RUNNER_UPS
  },
  combatDamage: {
    sort: { 'stats.Combat.Give.Damage': -1 }, limit: RUNNER_UPS
  },
  monsterKills: {
    sort: { 'stats.Combat.Kills.Monster': -1 }, limit: RUNNER_UPS
  },
  playerKills: {
    sort: { 'stats.Combat.Kills.Player': -1 }, limit: RUNNER_UPS
  },
  overkill: {
    sort: { 'stats.Combat.Give.Overkill': -1 }, limit: RUNNER_UPS
  },
  takenDamage: {
    sort: { 'stats.Combat.Receive.Damage': -1 }, limit: RUNNER_UPS
  }
};

const formatters = {
  ascension:    (obj) => ({ _id: obj._id, ascension: _.get(obj, 'stats.Character.Ascension.Times', 0) }),
  level:        (obj) => ({ _id: obj._id, level: _.get(obj, '_level.__current', 0) }),
  steps:        (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Steps', 0) }),
  astralSteps:  (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Terrains.Astral', 0) }),
  acidSteps:    (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Terrains.Acid', 0) }),
  luck:         (obj) => ({ _id: obj._id, luk: _.get(obj, 'statCache.luk', 0) }),
  fateful:      (obj) => ({ _id: obj._id, fates: _.get(obj, 'stats.Character.Event.Providence', 0) }),
  combatWin:    (obj) => ({ _id: obj._id, combatWin: _.get(obj, 'stats.Combat.Win', 0) }),
  events:       (obj) => ({ _id: obj._id, events: _.get(obj, 'stats.Character.Events', 0) }),
  soloSteps:    (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Movement.Solo', 0) }),
  drunkSteps:   (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Movement.Drunk', 0) }),
  campingSteps: (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Movement.Camping', 0) }),
  partySteps:   (obj) => ({ _id: obj._id, steps: _.get(obj, 'stats.Character.Movement.Party', 0) }),
  combatDamage: (obj) => ({ _id: obj._id, damage: _.get(obj, 'stats.Combat.Give.Damage', 0) }),
  monsterKills: (obj) => ({ _id: obj._id, kills: _.get(obj, 'stats.Combat.Kills.Monster', 0) }),
  playerKills:  (obj) => ({ _id: obj._id, kills: _.get(obj, 'stats.Combat.Kills.Player', 0) }),
  overkill:     (obj) => ({ _id: obj._id, damage: _.get(obj, 'stats.Combat.Give.Overkill', 0) }),
  takenDamage:  (obj) => ({ _id: obj._id, damage: _.get(obj, 'stats.Combat.Receive.Damage', 0) })
};

exports.route = (app) => {
  app.get('/leaderboard', (req, res) => {
    Promise.all([
      DB.$collectibles.find(queries.collectibles, fields.collectibles, params.collectibles),
      DB.$achievements.find(queries.achievements, fields.achievements, params.achievements),
      DB.$achievements.find(queries.titles, fields.titles, params.titles),
      DB.$players.find(queries.gold, fields.gold, params.gold),
      DB.$statistics.find(queries.steps, fields.steps, params.steps),
      DB.$statistics.find(queries.astralSteps, fields.astralSteps, params.astralSteps),
      DB.$statistics.find(queries.acidSteps, fields.acidSteps, params.acidSteps),
      DB.$players.find(queries.luck, fields.luck, params.goodLuck),
      DB.$statistics.find(queries.fateful, fields.fateful, params.fateful),
      DB.$statistics.find(queries.combatWin, fields.combatWin, params.combatWin),
      DB.$statistics.find(queries.events, fields.events, params.events),
      DB.$statistics.find(queries.soloSteps, fields.soloSteps, params.soloSteps),
      DB.$statistics.find(queries.drunkSteps, fields.drunkSteps, params.drunkSteps),
      DB.$statistics.find(queries.campingSteps, fields.campingSteps, params.campingSteps),
      DB.$statistics.find(queries.partySteps, fields.partySteps, params.partySteps),
      DB.$statistics.find(queries.combatDamage, fields.combatDamage, params.combatDamage),
      DB.$statistics.find(queries.monsterKills, fields.monsterKills, params.monsterKills),
      DB.$statistics.find(queries.playerKills, fields.playerKills, params.playerKills),
      DB.$statistics.find(queries.overkill, fields.overkill, params.overkill),
      DB.$statistics.find(queries.takenDamage, fields.takenDamage, params.takenDamage)
    ]).then(cursors => {
      return Promise.all(_.map(cursors, cursor => cursor.toArray()));
    }).then(data => {
      return Promise.all([DB.$statistics.find(
        queries.ascLevel,
        fields.ascLevel,
        params.ascLevel
      )]).then(([ascLevelCursors]) => {
        return ascLevelCursors.toArray();
      }).then(ascLevelLeaders => {
        const names = _.map(ascLevelLeaders, '_id');
        const subs = RUNNER_UPS - ascLevelLeaders.length;
        const lvlPromises = _.map(ascLevelLeaders, player => DB.$players.findOne({ _id: player._id }, fields.level));

        let subPromises = { toArray: () => {} };
        if(subs > 0) {
          subPromises = DB.$players.find({ name: { $nin: names }}, fields.level, { sort: { '_level.__current': -1 }, limit: subs });
        }

        return Promise.all([lvlPromises, subPromises])
          .then(([levels, subCursor]) => {
            return Promise.all(levels)
              .then(levels => {
                return Promise.all([levels, subCursor.toArray()]);
              });
          })
          .then(([levels, subs]) => {
            const ascLeaders = _(ascLevelLeaders)
              .map(leader => {
                const ascLevel = _.get(leader, 'stats.Character.Ascension.Levels', 0);
                const level = _.get(_.find(levels, { _id: leader._id }), '_level.__current', 0);
                return { _id: leader._id, level: level + ascLevel };
              })
              .sortBy('level')
              .reverse()
              .take(RUNNER_UPS)
              .value();

            const otherLeaders = subs > 0 ? _.map(subs, player => {
              return { _id: player._id, level: _.get(player, '_level.__current', 0) };
            }) : [];

            data.push(ascLeaders.concat(otherLeaders));
            return data;
          });
      });
    }).then(([
      collectibleLeaders,
      achievementLeaders,
      titleLeaders,
      goldLeaders,
      stepLeaders,
      astralLeaders,
      acidLeaders,
      goodLuckLeaders,
      fateLeaders,
      combatWinLeaders,
      eventLeaders,
      soloLeaders,
      drunkLeaders,
      campingLeaders,
      partyLeaders,
      damageLeaders,
      monsterLeaders,
      playerLeaders,
      overkillLeaders,
      takenDamageLeaders,
      levelLeaders
    ]) => {
      res.json({
        levelLeaders,
        collectibleLeaders,
        achievementLeaders,
        titleLeaders,
        goldLeaders,
        stepLeaders: _.map(stepLeaders, formatters.steps),
        astralLeaders: _.map(astralLeaders, formatters.astralSteps),
        acidLeaders: _.map(astralLeaders, formatters.acidSteps),
        goodLuckLeaders: _.map(goodLuckLeaders, formatters.luck),
        fateLeaders: _.map(fateLeaders, formatters.fateful),
        combatWinLeaders: _.map(combatWinLeaders, formatters.combatWin),
        eventLeaders: _.map(eventLeaders, formatters.events),
        soloLeaders: _.map(soloLeaders, formatters.soloSteps),
        drunkLeaders: _.map(drunkLeaders, formatters.drunkSteps),
        campingLeaders: _.map(campingLeaders, formatters.campingSteps),
        partyLeaders: _.map(partyLeaders, formatters.partySteps),
        damageLeaders: _.map(damageLeaders, formatters.combatDamage),
        monsterLeaders: _.map(monsterLeaders, formatters.monsterKills),
        playerLeaders: _.map(playerLeaders, formatters.playerKills),
        takenDamageLeaders: _.map(takenDamageLeaders, formatters.takenDamage),
        overkillLeaders: _.map(overkillLeaders, formatters.overkill)
      });
    }).catch(e => console.error(e));
  });
};