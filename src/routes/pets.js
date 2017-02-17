
const _ = require('lodash');

const { DB } = require('../db');

const petsFields = {
  name: 1,
  _level: 1,
  professionName: 1,
  map: 1,
  gender: 1
};

const petFields = {
  name: 1,
  _level: 1,
  professionName: 1,
  attr: 1,
  equipment: 1,
  gender: 1,
  gold: 1,
  createdAt: 1,
  _hp: 1,
  _mp: 1,
  _xp: 1,
  statCache: 1
};

exports.route = (app) => {
  app.get('/pets', (req, res) => {
    DB.$players.find({ isOnline: true }, { name: 1, nameEdit: 1 }, (err, data) => {
      if(err) return res.status(500).json({ err });

      data.toArray()
        .then(arr => {

          const petPromises = _.map(arr, player => {
            return DB.$pets.findOne({ _id: player.name }).then(pet => ({ pet, player }));
          });

          Promise.all(petPromises)
            .then(playerPetModels => {
              const retModels = _.map(playerPetModels, ({ pet, player }) => {
                const realPet = _.pick(pet.earnedPetData[pet.activePetId], _.keys(petsFields));
                realPet.type = pet.activePetId;
                realPet.owner = player.nameEdit || player.name;
                realPet.realOwner = player.name;
                return realPet;
              });

              res.json({ pets: retModels });

            }).catch(err => {

              res.status(500).json({ err });
            });

        }).catch(err => {

          res.status(500).json({ err });
        });
    });
  });

  app.get('/pets/:id', (req, res) => {
    const playerId = req.params.id;

    Promise.all([

      DB.$players.findOne({ _id: playerId }, { name: 1, nameEdit: 1 }),
      DB.$pets.findOne({ _id: playerId })

    ]).then(([playerData, petData]) => {
      const pet = _.pick(petData.earnedPetData[petData.activePetId], _.keys(petFields));
      pet.realOwner = playerId;
      pet.owner = playerData.nameEdit || playerData.name;

      res.json({ pet });

    }).catch(err => {
      res.status(500).json({ err });
    });
  });
};