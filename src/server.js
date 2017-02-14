
const fs = require('fs');
const express = require('express');

const { DB } = require('./db');

DB.isReady.then(() => {
  const app = express();
  app.use(require('cors'));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {

    console.log('API started on port ' + port);

    fs.readdir(`${__dirname}/routes`, (err, files) => {
      files.forEach(file => {
        require(`${__dirname}/routes/${file}`).route(app);
      });
    });
  });
});