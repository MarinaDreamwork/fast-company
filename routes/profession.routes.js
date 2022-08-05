const express = require('express');
const Profession = require('../models/Profession');
const errorServer = require('../utils/errorServer');
const router = express.Router({
  mergeParams: true
});

router.get('/', async (req, res) => {
  try {
    const list = await Profession.find();
    res.status(200).send(list);
  } catch(error) {
    errorServer(res);
  }
})

module.exports = router;