const jwt = require('jsonwebtoken');
const config = require('config');

// Check user profile
function switchProfile(req, res, next) {
  const token = req.header('x-auth-token');

  //  if no token is returned
  if (!token) {
    return res.status(401).json({ msg: 'No token, permission denied' });
  }
  // decode token
  const decoded = jwt.verify(token, config.get('jwtSecret'));
  // set role to the same value as in the request
  req.user.role = decoded.user.role;

  // check if role is mentor
  if (decoded.user.role !== 'mentee') {
    return next('router');
  }
  return next();
}

module.exports = switchProfile;
