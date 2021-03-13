const express = require('express');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const auth = require('../../middleware/authMiddleware');

// initialize nodemailer

const transporter = nodemailer.createTransport(sendgridTransport(
  {
    auth: {
      api_key: config.get('sendgridApi'),
    },
  },
));

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
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    // compare user pswd against db's
    const isPwdMatch = await bcrypt.compare(password, user.password);
    //    if ispwdmatch fails
    if (!isPwdMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
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

// @route   Post api/auth
// @desc    forgot password route
// @access  Public

router.post('/reset-password', [check('email', 'Please enter a valid email').isEmail()], (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          transporter.sendMail({
            to: user.email,
            from: 'support@elevatenetworkhq.com',
            subject: 'password reset',
            html: `
                      <p>You requested for a Password reset on your Elevate Account</p>
                      <h5>Click on this  <a href="http://localhost:3000/reset-password/${token}">link </a> to reset password</h5>
                      <footer>Please this is an automated mail, do not reply to.</footer>
                      `,
          });
          res.json({ msg: 'Check your email ' });
        });
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Server Error');
      });
  });
});

// // trying async

// router.post('/reset-password', async (req, res) => {
//   const { email } = req.body;
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//     }
//   });
//   const token = buffer.toString('hex');
//   try {
//     const user = User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
//     }
//     user.resetToken = token;
//     user.expireToken = Date.now() + 3600000;
//     await user.save();
//     transporter.sendMail({
//       to: user.email,
//       from: 'support@elevatenetworkhq.com',
//       subject: 'password reset',
//       html: `
//                 <p>You requested for a Password reset on your Elevate Account</p>
//                 <h5>Click on this  <a href="http://localhost:3000/reset-password/${token}">link </a> to reset password</h5>
//                 <footer>Please this is an automated mail, do not reply to.</footer>
//                 `,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Server Error');
//   }
// });

// @route   Post api/auth
// @desc    set new password route
// @access  Public

router.post('/new-password', [check('password', 'Please enter a password of not less than 8 characters').isLength({ min: 8 })],
  async (req, res) => {
    try {
      const newPassword = req.body.password;
      const sentToken = req.body.token;
      console.log(sentToken);
      const user = await User.findOne({ resetToken: sentToken });
      console.log('This is what the user object in db looks like', user);
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Try again token expired' }] });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      await user.save();
      res.json({ msg: 'Password Successfully Updated ' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
