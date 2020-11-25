const express = require('express');

const router = express.Router();

const config = require('config');
// validator
const { check, validationResult } = require('express-validator');
// auth middleware
const auth = require('../../middleware/authMiddleware');

// db collections
const MentorProfile = require('../../models/MentorProfile');
const User = require('../../models/User');

// check if we have to change profile router to partner
//    async function shouldRouterChange(req, res, next) {

//     try {
//         let userRole = await MenteeProfile.findOne({user:req.user.role});
//         // conditional

//         if (userRole==='partner') {
//             return next('router')
//        }
//          return next()
//     } catch (error) {
//         console.error(error.message)
//         res.status(500).json({msg: 'Server Error'})
//     }

// }

// router.use(auth, shouldRouterChange);

// @route   GET api/mentorProfile/me
// @desc    GET current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // fetch profile object
    const mentorProfile = await MentorProfile.findOne({ user: req.user.id });
    // check if profile exists
    if (!mentorProfile) {
      return res.status(400).json({ msg: 'Hello Mentor, You have not created a profile' });
    }
    res.json(mentorProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

module.exports = router;
