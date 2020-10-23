const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
// const gravatar = require('gravatar')
const {check, validationResult} = require
('express-validator')

// @route POST api/users
// @desc Register  user route
// @access  Public

// perform info validation 

// router.get('/', (req, res) => res.send('User Route') )
router.post('/', [
check('name', 'Please enter a valid name').not().isEmpty(),
check('email', 'Please enter a valid email').isEmail(),
check('password', 'Please enter a password of not less than 8 characters').isLength({min:8}),
check('role', 'Please choose what role applies to you').not().isEmpty()], 
// req, res cycle
async (req, res) => {
    const errors = validationResult(req)
    // check for errors
    if(!errors.isEmpty()) {
return res.status(400).json({errors: errors.array()})
 }
//  destructure req body
const {name, email, password, role} = req.body
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
           role
       })
    //    Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password  = await bcrypt.hash(password, salt)
    await user.save()

    res.send('User route')
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router