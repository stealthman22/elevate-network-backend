const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken')
// const gravatar = require('gravatar')
const {check, validationResult} = require
('express-validator')

// @route POST api/users
// @desc Register user route
// @access  Private

// perform info validation 

// router.get('/', (req, res) => res.send('User Route') )
router.post('/', [
check('name', 'Please enter a valid name').not().isEmpty(),
check('email', 'Please enter a valid email').isEmail(),
check('password', 'Please enter a password of not less than 8 characters').isLength({min:8}),
check('status', 'Please select how you want to be registered').not().isEmpty()
], 
// req, res cycle
async (req, res) => {
    const errors = validationResult(req)
    // check for errors
    if(!errors.isEmpty()) {
return res.status(400).json({errors: errors.array()})
 }
//  destructor req body
const {name, email, password, status} = req.body
    try {
        // check if user already exists
       let user = await User.findOne({email})
       if(user) {
           return res.status(400).json({errors: [{msg: 'Invalid registration details'}]})
       }
    //    create new user in db
       user = new User({
           name,
           email,
           password,
           status
       })
    //    Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password  = await bcrypt.hash(password, salt);
    await user.save();

    // return jwt
    const payload = await {
        user: {
            id: user.id
        }
    }
// jwt config
// change all values of jwt expiresIn option
jwt.sign(payload, config.get('jwtSecret'), {expiresIn:3600}, (error, token) => {
    if (error) throw error 
    res.json({token})
})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('This is our fault, not yours')
    }
})


// @route POST api/users
// @desc Register user route
// @access  Private

module.exports = router