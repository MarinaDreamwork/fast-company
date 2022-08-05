const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const errorServer = require('../utils/errorServer');
const errorUnAuthorized = require('../utils/errorUnAuthorized');
const { generateUserData }  = require('../utils/helpers');
const User = require('../models/User');
const tokenService = require('../services/token.service');

const router = express.Router({
  mergeParams: true
});

// /api/auth/signUp
// 1. get data from request (email, password)
// 2. check if user already exists
// 3. hash password
// 4. create user
// 5. generate tokens

router.post('/signUp', [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля - 8 символов').isLength({ min: 8 }),
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'INVALID_DATA',
          code: 400,
          //errors: errors.array()
        }
      });
    };

    const { email, password } = req.body;
    console.log('email', email);
    const existUser = await User.findOne({ email });
    if(existUser) {
      return res.status(400).json({
        error: {
          message: 'EMAIL_EXISTS',
          code: 400
        }
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userInfo = {
      ...req.body,
      ...generateUserData(),
      password: hashedPassword,
    };
    console.log('userInfo', userInfo);

    const newUser = await User.create(userInfo);
    console.log('newUser', newUser);

    const tokens = tokenService.generate({ _id: newUser._id });
    await tokenService.save(newUser._id, tokens.refreshToken);

    res.status(201).send({ ...tokens, userId: newUser._id })

  } catch (error) {
    console.log('error:', error.message);
    errorServer(res);
  }

}]);

// /api/auth/signInWithPassword
// 1. validate
// 2. find user
// 3. compare hased passwords
// 4. generate tokens
// 5. return data
router.post('/signInWithPassword', [
  check('email', 'Email некорректный').normalizeEmail().isEmail(),
  check('password', 'Пароль не может быть пустым').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({
          error: {
            message: 'INVALID_DATA',
            code: 400
          }
        })
      }

      const { email, password } = req.body;
      const existUser = await User.findOne({ email });
      if(!existUser) {
        return res.status(400).send({
          error: {
            message: 'EMAIL_NOT_FOUND',
            code: 400
          }
        })
      }

      const isPasswordEqual = await bcrypt.compare(password, existUser.password);

      if(!isPasswordEqual) {
        return res.status(400).send({
          error: {
            message: 'INVALID_PASSWORD',
            code: 400
          }
        });
      }

      const tokens = tokenService.generate({ _id: existUser._id})
      await tokenService.save(existUser._id, tokens.refreshToken);

      return res.send({
        ...tokens, 
        userId: existUser._id
      });
    } catch(error) {
      console.log('error:', error.message);
      errorServer(res);
    }
  }
]);

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString()
};

// /api/auth/token
// 1. compare with secret
router.post('/token', async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const verifiedData = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if(isTokenInvalid(verifiedData, dbToken)) {
      return errorUnAuthorized(res);
    }

    const tokens = await tokenService.generate({
      _id: verifiedData._id
    });
    await tokenService.save(verifiedData._id, tokens.refreshToken);

    res.send({ ...tokens, userId: verifiedData._id });
  } catch(error) {
    console.log('error', error.message);
    errorServer(res);
  }
});

module.exports = router;