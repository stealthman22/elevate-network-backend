const express = require('express');
const router = express.Router();
const config = require('config');

// validator
const {check, validationResult} = require('express-validator');

//  middlewares
const auth = require('../../middleware/authMiddleware');
const mentorSwitch = require('../../middleware/mentorProfileMiddleware');
// const partnerSwitch =  require('../../middleware/partnerProfileMiddleware')

// db collections
const MenteeProfile = require('../../models/MenteeProfile');
const User = require('../../models/User');

// @route   GET api/menteeProfile/me
// @desc    GET current user profile
// @access  Private 
router.get('/me', [auth, mentorSwitch,], async (req, res) => {
    try {
        // check if profile exists
        const menteeProfile = await MenteeProfile.findOne({user:req.user.id})
        if(!menteeProfile) {
            return res.status(400).json({msg: 'Hello Mentee, You have not created a profile'})
        }
       return res.json(menteeProfile)
    } catch (error) {
        console.error(error.message);
      return res.status(500).json({msg:'This is our fault not yours'})
    }
})

module.exports = router;