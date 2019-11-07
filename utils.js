// FROM : https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
let jwt = require('jsonwebtoken');
const config = require('./token.config');

let checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(451).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let getUserFromToken = (req) => {
  let token = req.headers.authorization;

  if (token) {
    token = token.replace("Bearer ", "");
    return jwt.verify(token, config.secret);
  }
  return 0;
};

module.exports = {
  checkToken: checkToken,
  getUserFromToken
}
