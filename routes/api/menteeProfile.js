const express = require('express');
const router = express.Router()
const config = require('config');
const auth = require('../../middleware/authMiddleware');
const {check, validationResult} = require('express-validator');

// pull in schemas
const Users = require('../../models/User');
const MenteeProile = require('../../models/MenteeProfile');
// const MentorProfile = require('../../models/MentorProfile');
// const PartnerProfile = require('../../models/PartnerProfile')


// @route   Get api/profile/me
// @desc    Get  current user profile
// @access  Private : (  auth needed for this route) 
router.get('/me', auth, async (req, res) => {
    
    try {
        // check if there is profile for user in db
        // if (req.user.role === 'mentee') { }
        
        let userRole = req.user.role;
        if (userRole === 'mentee') {
            const menteeProfile = await MenteeProfile.findOne({user:req.user.id});
            if(!menteeProfile) {
                return res.status(400).json({msg:'Hello Mentee, you are yet to create a Profile'});
                
            }
            res.json(menteeProfile)
        }
      
        // get profile if found
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'This is our fault, not yours'})
    }

});


module.exports = router





