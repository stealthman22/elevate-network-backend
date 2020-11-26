const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const auth = require('../../middleware/authMiddleware');

// @route    GET api/auth
// @desc     Get user object
// @access  Public

// return user's data if token is valid
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   Post api/auth
// @desc    Login user
// @access  Private
router.post('/', [check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required').exists()],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json([{ msg: 'Invalid Credentials' }]);
    }
    // compare user pswd against db's
    const isPwdMatch = await bcrypt.compare(password, user.password);
    //    if ispwdmatch fails
    if (!isPwdMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // if ispwdmatch passes
    // create jwt payload
    const payload = await {

      user: {
        id: user.id,
        role: user.role,
      },
    };
    // if user login is successful, return token
    jwt.sign(payload, config.get('jwtSecret'),
      { expiresIn: 36000 }, (error, token) => {
        if (error) throw error;
        return res.json({ token });
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
