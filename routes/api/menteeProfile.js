const express = require('express');

const router = express.Router();
const config = require('config');

// validator
const { check, validationResult } = require('express-validator');

//  middlewares

const auth = require('../../middleware/authMiddleware');
const mentorSwitch = require('../../middleware/mentorProfileMiddleware');

// db collections
const MenteeProfile = require('../../models/MenteeProfile');
const User = require('../../models/User');

// @route   GET api/profiles/me
// @desc    GET current user profile
// @access  Private
router.get('/me', [auth, mentorSwitch], async (req, res) => {
  try {
    // check if profile exists
    const menteeProfile = await MenteeProfile.findOne({ user: req.user.id });
    if (!menteeProfile) {
      return res.status(400).json({ msg: 'Hello Mentee, You have not created a profile' });
    }
    return res.json(menteeProfile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   GET api/profiles
// @desc    GET all profiles
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await MenteeProfile.find().populate('user', ['username']);

    // check if no profiles
    // Might have no effect in backend
    if (!profiles) {
      return res.status(400).json({ msg: 'There are no profiles yet' });
    }
    // return profiles
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   GET api/profiles
// @desc    GET all profiles
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const profile = await MenteeProfile.findOne({ user: req.params.user_id }).populate('user', ['username', 'profilePic']);

    // check if no profiles
    // Might have no effect in backend
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    // return profiles
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.king === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   POST api/menteeProfile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth, mentorSwitch], [
  check('fullName', 'This field is required').not().isEmpty(),
  check('aboutMe', 'This field is required').not().isEmpty(),
  check('location', 'This field is required').not().isEmpty(),
  check('dob', 'This field is required').not().isEmpty(),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // initialize a profile
  const {

    fullName,
    age,
    aboutMe,
    location,
    dob,
    profilePic,
    skills,
    learningInterests,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,

  } = req.body;

  //  build profile object and set fields
  const profileFields = {};
  profileFields.user = req.user.id;

  profileFields.bio = {};
  if (fullName) profileFields.bio.fullName = fullName;
  if (age) profileFields.bio.age = age;
  if (aboutMe) profileFields.bio.aboutMe = aboutMe;
  if (location) profileFields.bio.location = location;
  if (dob) profileFields.bio.dob = dob;
  if (profilePic) profileFields.bio.profilePic = profilePic;
  // comma separated values to arrays

  profileFields.interests = {};
  if (skills) {
    profileFields.interests.skills = skills.split(',').map((skill) => skill.trim());
  }

  if (learningInterests) {
    profileFields.interests.learningInterests = learningInterests.split(',').map((learningInterest) => learningInterest.trim());
  }

  // Social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await MenteeProfile.findOne({ user: req.user.id });

    // Update profile
    if (profile) {
      profile = await MenteeProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }

    // Create a profile
    profile = new MenteeProfile(profileFields);
    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

module.exports = router;
