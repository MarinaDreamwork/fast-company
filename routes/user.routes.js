const express = require('express');
const User = require('../models/User');
const errorServer = require('../utils/errorServer');
const errorUnAuthorized = require('../utils/errorUnAuthorized');
const authCheck = require('../middleware/auth.middleware');
const router = express.Router({
  mergeParams: true
});

router.get('/', authCheck, async (req, res) => {
  try {
    const list = await User.find();
    res.send(list);
  } catch (error) {
    errorServer(res);
  }
});

router.patch('/:userId', authCheck, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id) {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.send(updatedUser);
    } else if(userId !== req.user._id) {
      const updatedUserRate = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.send(updatedUserRate); 
    } 
    // else {
    //   errorUnAuthorized(res);
    // }
  } catch (error) {
    errorServer(res);
  }
});

module.exports = router;