const express = require('express');
const { saveDataToMongo } = require('../models/user');

const router = express.Router();

router.post('/', (req, res) => {
  const { name, url, company, email } = req.body;
  saveDataToMongo({ name, url, company, email })
    .then(() => {
      res.status(200).send('Document saved successfully');
    })
    .catch((error) => {
      console.log(`Error saving document: ${error}`);
      res.status(500).send('Failed to save document');
    });
});

module.exports = router;
