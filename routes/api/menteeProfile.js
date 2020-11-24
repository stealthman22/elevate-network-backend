const express = require('express');
const router = express.Router();
const config = require('config');

// validator
const {check, validationResult} = require('express-validator');

//  middlewares
const auth = require('../../middleware/authMiddleware');
const mentorChange = require('../../middleware/mentorProfileMiddleware');
// const partnerChange =  require('../../middleware/partnerProfileMiddleware')

// db collections
const MenteeProfile = require('../../models/MenteeProfile');
const User = require('../../models/User');

// fetch profile object

      // check if we have to change profile router
    //   router.use( async (function shouldRouterChange(req, res, next) {
    //     let userRole = await Mentee.findOne({status:req.user.role});
    
    //     // conditional
    //     if (userRole==='mentor') {
    //         return next('router')
    //     }
    //     return next()
    // }));

    // async function shouldRouterChange(req, res, next) {

    //     try {
    //         let userRole = await MenteeProfile.findOne({user:req.user.id}).populate('user', ['role']);
    //         // conditional
    //        console.log(userRole)
    //         if (userRole==='mentor') {
    //             return next('router')
    //        }
    //          return next()
    //     } catch (error) {
    //         console.error(error.message)
    //         res.status(500).json({msg: 'Server Error'})
    //     }
        
    // } 
    
    // router.use(auth, shouldRouterChange);
    // router.use( );  

    // async function shouldRouterChange(req, res, next) {
    //     let userRole = await User.findOne({user:req.role}).select('-password');
    //     console.log(userRole)
    //     if ( userRole === 'mentor') {
    //         return next('router');
    //     }
    //     return next();
    // }


    //  function shouldRouterChange(req, res, next) {
    //     if (req.user.role === 'mentor') {
    //         return next('router');
    //     }
    //     return next();
    // }



// @route   GET api/menteeProfile/me
// @desc    GET current user profile
// @access  Private 
router.get('/me', [auth, mentorChange,], async (req, res) => {
    try {
        // check if profile exists
        const menteeProfile = await MenteeProfile.findOne({user:req.user.id})
        if(!menteeProfile) {
            return res.status(400).json({msg: 'Hello Mentee, You have not created a profile'})
        }
        res.json(menteeProfile)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:'This is our fault not yours'})
    }
})

module.exports = router;