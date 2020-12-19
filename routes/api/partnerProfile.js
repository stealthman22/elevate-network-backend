const express = require('express');

const router = express.Router();

const config = require('config');

// validator
const { check, validationResult } = require('express-validator');

// middlewares

const auth = require('../../middleware/authMiddleware');

// db collections
const PartnerProfile = require('../../models/PartnerProfile');
const User = require('../../models/User');

// @route   GET api/PartnerProfile/me
// @desc    GET current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // fetch profile object
    const partnerProfile = await PartnerProfile.findOne({ user: req.user.id });
    // check if profile exists
    if (!partnerProfile) {
      return res.status(400).json({ msg: 'Hello Partner, You have not created a profile' });
    }
    res.json(partnerProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   POST api/PartnerProfile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, [
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
    teachingInterests,
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

  if (teachingInterests) {
    profileFields.interests.teachingInterests = teachingInterests.split(',').map((teachingInterest) => teachingInterest.trim());
  }

  // Social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await PartnerProfile.findOne({ user: req.user.id });

    // Update profile
    if (profile) {
      profile = await PartnerProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }

    // Create a profile
    profile = new PartnerProfile(profileFields);
    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    // Delete a profile
    await PartnerProfile.findOneAndRemove({ user: req.user.id });

    // Delete a user
    await User.findOneAndRemove({ _id: req.user.id });

    // return object if deletion is succesful
    return res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

module.exports = router;
