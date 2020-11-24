const express = require('express');
const router = express.Router();
const config = require('config');

// validator
const {check, validationResult} = require('express-validator');

// middlewares
const auth = require('../../middleware/authMiddleware');
// const menteeChange = require('../../middleware/menteeProfileMiddleware')
// const mentorChange = require('../../middleware/mentorProfileMiddleware');


// db collections
const PartnerProfile = require('../../models/PartnerProfile');
const User = require('../../models/User');

// @route   GET api/PartnerProfile/me
// @desc    GET current user profile
// @access  Private 
router.get('/me', [auth],  async (req, res) => {
    try {
        // fetch profile object
        const partnerProfile = await PartnerProfile.findOne({user:req.user.id});
        // check if profile exists
        if(!partnerProfile) {
            return res.status(400).json({msg: 'Hello Partner, You have not created a profile'})
        }
        res.json(partnerProfile)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'This is our fault not yours'})
    }
})


module.exports= router;