const express = require('express');
const errorServer = require('../utils/errorServer');
const Quality = require('../models/Quality');
const router = express.Router({
  mergeParams: true
});

router.get('/', async (req, res) => {
  try {
    const list = await Quality.find();
    res.send(list);
  } catch(error) {
    errorServer(res);
  }
});

module.exports = router;