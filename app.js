const express = require('express');
const bodyParser = require('body-parser').json();
const { database } = require('./radio_profiles_database');

const app = express();
const port = 3000;

app.post('/radios/:id', bodyParser, (req, res) => {
  const { alias, allowed_locations } = req.body;
  const radioID = parseInt(req.params.id);
  const isValidNumber = !isNaN(radioID);
  if (alias && allowed_locations && isValidNumber) {
    const isUnique = !database.some(radio => radio.id === radioID);
    if (isUnique) {
      database.push({ id: radioID, alias: alias, allowed_locations: allowed_locations });
      console.table(database);
      res.status(201).send();
    } else {
      res.status(409).send();
    }
  } else {
    res.json({ message: 'A valid id, alias and allowed_locations must be provided' });
  };
});

app.post('/radios/:id/location', bodyParser, (req, res) => {
  const newLocation = req.body.location;
  const radioID = parseInt(req.params.id);
  const isValidNumber = !isNaN(radioID);
  if (newLocation && isValidNumber) {
    const foundRadio = database.find(radio => radio.id === radioID);
    if (foundRadio) {
      const isAllowedLocation = foundRadio.allowed_locations.some(location => location === newLocation);
      if (isAllowedLocation) {
        foundRadio.location = newLocation;
        console.table(database);
        res.send();
      } else {
        res.status(403).send();
      }
    } else {
      res.status(404).send();
    }
  } else {
    res.json({ message: 'A valid id and location must be provided' });
  }
});

app.get('/radios/:id/location', (req, res) => {
  const radioID = parseInt(req.params.id);
  const isValidNumber = !isNaN(radioID);
  if (isValidNumber) {
    const foundRadio = database.find(radio => radio.id === radioID);
    if (foundRadio) {
      if (foundRadio.location) {
        console.table(database);
        res.json({ location: foundRadio.location });
      } else {
        res.status(404).send();
      }
    } else {
      res.status(404).send();
    }
  } else {
    res.json({ message: 'A valid id must be provided' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Initial database: ');
  console.table(database);
});