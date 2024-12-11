const express = require('express');
const fs = require('fs');
const router = express.Router();

// GET: School information
router.get('/', (req, res) => {
  try {
    fs.readFile('./data/schoolInformation.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.json(JSON.parse(data));
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    
  }
});

// PUT: Update school information
router.put('/', (req, res) => {
  try {
    const schoolInformation = req.body;
  
    fs.writeFile('./data/schoolInformation.json', JSON.stringify(schoolInformation, null, 2), (err) => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.json(schoolInformation);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
    
  }
});

module.exports = router;