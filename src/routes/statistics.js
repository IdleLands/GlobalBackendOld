
const _ = require('lodash');

const { DB } = require('../db');

exports.route = (app) => {
  app.get('/statistics', (req, res) => {
    Promise.all([
      DB.$players.aggregate([
        {
          $group: {
            _id: '$professionName',
            count: { $sum: 1 }
          }
        }
      ]),

      DB.$players.aggregate([
        {
          $group: {
            _id: '$map',
            count: { $sum: 1 }
          }
        }
      ]),

      DB.$pets.aggregate([
        { $match: { activePetId: { $exists: true, $ne: '' } } },
        {
          $group: {
            _id: '$activePetId',
            count: { $sum: 1 }
          }
        }
      ]),

      DB.$statistics.aggregate([
        { $match: { 'stats.Character.Events': { $exists: true } } },
        {
          $group: {
            _id: 'totalEvents',
            totalEvents: { $sum: '$stats.Character.Events' }
          }
        }
      ]),

      DB.$statistics.aggregate([
        { $match: { 'stats.Character.Steps': { $exists: true } } },
        {
          $group: {
            _id: 'totalSteps',
            totalSteps: { $sum: '$stats.Character.Steps' }
          }
        }
      ]),

      DB.$statistics.aggregate([
        { $match: { 'stats.Combat.Give.Damage': { $exists: true } } },
        {
          $group: {
            _id: 'totalDamage',
            totalDamage: { $sum: '$stats.Combat.Give.Damage' }
          }
        }
      ])

    ]).then(cursors => {
      const cursorPromises = _.map(cursors, cursor => cursor.toArray());
      return Promise.all(cursorPromises.concat(DB.$players.count()));
    }).then(([
      professions,
      maps,
      pets,
      events,
      steps,
      damage,

      // new things go above this line because the count promise is concat'd in
      playerCount
    ]) => {
      res.json({
        professions,
        maps,
        pets,
        events: events[0],
        steps: steps[0],
        damage: damage[0],
        playerCount
      });
    }).catch(e => console.error(e));
  });
};