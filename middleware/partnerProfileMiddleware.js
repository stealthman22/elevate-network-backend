const jwt = require('jsonwebtoken');
const config = require('config');

// Return partner profile

function changeToPartnerProfile(req, res, next) {
    const token = req.header('x-auth-token');

    // if no token is returned
    if(!token) {
        return res.status(401).json({msg: 'No token, permission denied'})
    }

    try {
        // decode token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
       const role =  req.user.role === decoded.user.role;
        //  check if role is mentor
        if( role === 'partner') {
            return next('router');
        }
        return next()
    } catch (error) {
        return res.status(401).json({msg: 'Wrong token, authentication failed'})
    }
}

module.exports = changeToPartnerProfile