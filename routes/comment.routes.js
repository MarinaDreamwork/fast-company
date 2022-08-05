const express = require('express');
const Comment = require('../models/Comment');
const authCheck = require('../middleware/auth.middleware');
const errorServer = require('../utils/errorServer');
const errorUnAuthorized = require('../utils/errorUnAuthorized');

const router = express.Router({
  mergeParams: true
});
// /api/comment
router
  .route('/')
  .get(authCheck, async (req, res) => {
    try {
      const { orderBy, equalTo } = req.query;
      const list = await Comment.find({ [orderBy]: equalTo });
      res.send(list);
    } catch (error) {
      errorServer(res);
    }
  })
  .post(authCheck, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        userId: req.user._id
      });
      res.status(201).send(newComment);
    } catch (error) {
      errorServer(res);
    }
  });

router.delete('/:commentId', authCheck, async (req, res) => {
  try {
    const { commentId } = req.params;
    const removedComment = await Comment.findById(commentId);
    if(removedComment.userId.toString() === req.user._id) {
      await removedComment.remove();
      return res.send(null);
    } else {
      errorUnAuthorized(res);
    }
  } catch (error) {
    errorServer(res);
  }
});

module.exports = router;