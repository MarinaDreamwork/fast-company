const tokenService = require("../services/token.service");
const errorUnAuthorized = require("../utils/errorUnAuthorized");

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    return next();
  } 

  try {
    // Bearer vcvzcvzdvzdvfzvv
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
      errorUnAuthorized(res);
    }
    const data = tokenService.validateAccess(token);
    if(!data) return errorUnAuthorized(res);
    req.user = data;
    next();
  } catch (error) {
    errorUnAuthorized(res);
  }
}