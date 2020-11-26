const express = require('express');

const router = express.Router();
const config = require('config');
// validator
const { check, validationResult } = require('express-validator');

// auth middleware
const auth = require('../../middleware/authMiddleware');

// db collections
const MentPartProfile = require('../../models/MentPartProfile');
const User = require('../../models/User');

// @route   GET api/MentPartProfile/me
// @desc    GET current user profile
// @access  Private
router.get('/me', [auth], async (req, res) => {
  try {
    // fetch profile object
    const mentPartProfile = await MentPartProfile.findOne({ user: req.user.id });
    // check if profile exists
    if (!mentPartProfile) {
      return res.status(400).json({ msg: 'Hello Mentor, You have not created a profile' });
    }
    return res.json(mentPartProfile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

module.exports = router;
