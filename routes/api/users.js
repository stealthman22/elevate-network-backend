const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route POST api/users
// @desc Register user route
// @access  Public

// perform info validation

// router.get('/', (req, res) => res.send('User Route') )
router.post('/', [
  check('username', 'Please enter a valid username').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a password of not less than 8 characters').isLength({ min: 8 }),
  check('role', 'Please select how you want to be registered').not().isEmpty(),
],
// req, res cycle
async (req, res) => {
  const errors = validationResult(req);
  // check for errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //  destructure req body
  const {
    username, email, password, role,
  } = req.body;
  try {
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid registration details' }] });
    }

    //    create new user in db
    user = new User({
      username,
      email,
      password,
      role,
    });
    //    Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // return jwt
    const payload = await {
      user: {
        id: user.id,
        // role: user.role
      },
    };
    // jwt config
    // Ensure token expires in 1 hour
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('This is our fault, not yours');
  }
});

// @route POST api/users
// @desc Register user route
// @access  Private

module.exports = router;
