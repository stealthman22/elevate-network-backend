const express = require('express');
const router = express.Router();
const config = require('config');
// validator
const {check, validationResult} = require('express-validator');

// auth middleware
const auth = require('../../middleware/authMiddleware');
const partnerChange =  require('../../middleware/partnerProfileMiddleware')

// db collections
const MentorProfile = require('../../models/MentorProfile');
const User = require('../../models/User');

// @route   GET api/mentorProfile/me
// @desc    GET current user profile
// @access  Private 
router.get('/me', [auth, partnerChange], async (req, res) => {
    try {
        // fetch profile object
        const mentorProfile = await MentorProfile.findOne({user:req.user.id})
        // check if profile exists
        if(!mentorProfile) {
            return res.status(400).json({msg: 'Hello Mentor, You have not created a profile'})
        }
        res.json(mentorProfile)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'This is our fault not yours'})
    }
})


module.exports= router;