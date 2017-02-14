
const _ = require('lodash');

const { DB } = require('../db');

const playersFields = {
  name: 1,
  _level: 1,
  professionName: 1,
  map: 1,
  gender: 1
};

const playerFields = {
  name: 1,
  _level: 1,
  professionName: 1,
  map: 1,
  mapRegion: 1,
  equipment: 1,
  gender: 1,
  gold: 1,
  joinDate: 1,
  _hp: 1,
  _mp: 1,
  _xp: 1,
  statCache: 1
};

exports.route = (app) => {
  app.get('/players', (req, res) => {
    DB.$players.find({ isOnline: true }, playersFields, (err, data) => {
      if(err) return res.status(500).json({ err });

      data.toArray()
        .then(arr => {

          const ascensionPromises = _.map(arr, player => {
            return DB.$statistics.findOne({ _id: player.name }, { 'stats.Character.Ascension.Times': 1 });
          });

          Promise.all(ascensionPromises)
            .then(ascensionModels => {
              _.each(ascensionModels, playerStatistics => {
                _.find(arr, { name: playerStatistics._id }).ascensionLevel = _.get(playerStatistics, 'stats.Character.Ascension.Times', 0);
              });

              res.json({ players: arr });

            }).catch(err => {

              res.status(500).json({ err });
            });

        }).catch(err => {

          res.status(500).json({ err });
        });
    });
  });

  app.get('/players/:id', (req, res) => {
    const query = { _id: req.params.id };

    Promise.all([

      DB.$players.findOne(query, playerFields),
      DB.$statistics.findOne(query),
      DB.$pets.findOne(query),
      DB.$collectibles.findOne(query),
      DB.$achievements.findOne(query)

    ]).then(([overview, statistics, pets, collectibles, achievements]) => {

      const player = {
        overview,
        equipment: overview.equipment,
        statistics: statistics.stats,
        pets: pets,
        collectibles: collectibles.collectibles,
        achievements: achievements.achievements
      };

      res.json({ player });

    }).catch(err => {

      res.status(500).json({ err });
    });
  });
};