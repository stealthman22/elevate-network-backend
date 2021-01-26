const express = require('express');

const router = express.Router();

// validator
const { check, validationResult } = require('express-validator');

// middlewares

const auth = require('../../middleware/authMiddleware');
const menteeSwitch = require('../../middleware/menteeProfileMiddleware');

// db collections
const PartnerProfile = require('../../models/PartnerProfile');
const User = require('../../models/User');

// @route   GET api/PartnerProfile/me
// @desc    GET current user profile
// @access  Private
router.get('/me', [auth, menteeSwitch], async (req, res) => {
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

// @route   GET api/profiles
// @desc    GET all profiles
// @access  Private
router.get('/', [auth, menteeSwitch], async (req, res) => {
  try {
    const profiles = await PartnerProfile.find().populate('user', ['username']);

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
// @desc    GET profile by id
// @access  Private
router.get('/user/:user_id', [auth, menteeSwitch], async (req, res) => {
  try {
    const profile = await PartnerProfile.findOne({ user: req.params.user_id }).populate('user', ['username', 'profilePic']);

    // check if no profiles
    // Might have no effect in backend
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    // return profiles
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   POST api/PartnerProfile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth, menteeSwitch], [
  check('fullName', 'This field is required').not().isEmpty(),
  check('aboutMe', 'This field is required').not().isEmpty(),
  check('location', 'This field is required').not().isEmpty(),
  check('age', 'This field is required').not().isEmpty(),
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
    sponsoringInterests,
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

  if (sponsoringInterests) {
    profileFields.interests.sponsoringInterests = sponsoringInterests.split(',').map((sponsoringInterest) => sponsoringInterest.trim());
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

// @route   PUT api/profile/education
// @desc    Add education to a profile.
// @access  Private
router.put('/education', [auth, menteeSwitch], [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
  check('location', 'Location of school is required').not().isEmpty(),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructure request object
  const {
    school,
    degree,
    fieldOfStudy,
    location,
    from,
    to,
    current,
    description,
  } = req.body;

  // Add new education
  const newEdu = {
    school,
    degree,
    fieldOfStudy,
    location,
    from,
    to,
    current,
    description,
  };

  try {
    const profile = await PartnerProfile.findOne({ user: req.user.id });
    // update profile
    profile.education.unshift(newEdu);
    // save updated profile
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete  profile education
// @access  Private
router.delete('/education/:edu_id', [auth, menteeSwitch], async (req, res) => {
  const profile = await PartnerProfile.findOne({ user: req.user.id });
  try {
    // grab the index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
      // remove it from the education array
    profile.education.splice(removeIndex, 1);

    // save profile after deletion of edu
    await profile.save();
    //  return modified profile
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'This is our fault not yours' });
  }
});

// @route   PUT api/profile/experience
// @desc   Add profile experience
// @access  Private
router.put('/experience', [auth, menteeSwitch],
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('location', 'Location is required'),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the req
    const {
      title,
      company,
      from,
      to,
      current,
      description,
      location,
    } = req.body;

    // add new experience
    const newExp = {
      title,
      company,
      from,
      to,
      current,
      description,
      location,
    };

    try {
      const profile = await PartnerProfile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('This is our fault not yours');
    }
  });

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete  profile experience
// @access  Private
router.delete('/experience/:exp_id', [auth, menteeSwitch], async (req, res) => {
  try {
    const profile = await PartnerProfile.findOne({ user: req.user.id });

    // Get remove index to delete profile
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    // take it out
    // splice mutates the array
    profile.experience.splice(removeIndex, 1);

    // save modified profile
    await profile.save();
    // return modified profile
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('This is our fault not yours');
  }
});

// @route   DELETE api/PartnerProfile/me
// @desc    delete a user's profile and user from database
// @access  Private
router.delete('/', [auth, menteeSwitch], async (req, res) => {
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
