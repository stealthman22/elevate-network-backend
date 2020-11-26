const jwt = require('jsonwebtoken');
const config = require('config');

// authentication logic
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  // if no token is returned
  if (!token) {
    return res.status(401).json({ msg: 'No token, permission denied' });
  }

  // if returned, verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // set decoded user param to request's
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Wrong token, authentication failed' });
  }
};
