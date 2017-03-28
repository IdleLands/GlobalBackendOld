
const _ = require('lodash');

const { DB } = require('../db');

const guildsFields = {
  name: 1,
  leader: 1,
  tag: 1,
  level: 1
};

const guildFields = {
  name: 1,
  leader: 1,
  tag: 1,
  level: 1,
  founded: 1,
  members: 1,
  gold: 1,
  taxRate: 1,
  maxMembers: 1,
  buildings: 1,
  resources: 1
};

exports.route = (app) => {
  app.get('/guilds', (req, res) => {
    DB.$guilds.find({}, guildsFields, { sort: { name: -1 } }, (err, data) => {
      if(err) return res.status(500).json({ err });

      data.toArray()
        .then(arr => {
          res.json({ guilds: arr });

        }).catch(err => {

          res.status(500).json({ err });
        });
    });
  });

  app.get('/guilds/:name', (req, res) => {
    const query = { name: req.params.name };

    DB.$guilds.findOne(query, guildFields)
      .then((guild) => {
        res.json({ guild });

      }).catch(err => {

        res.status(500).json({ err });
      });
  });
};