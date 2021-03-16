const mongoose = require('mongoose');

const MenteeProfileSchema = new mongoose.Schema({
  user: {
    // create a reference to the user schema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  bio: {
    fullName: {
      type: String,
      required: true,
    },
    age: {
    //   // hide from front-end
    //  Use min and max to show range
      type: Number,
    },
    aboutMe: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dob: {
      // be sure how to represent this in mongoDb
      type: Date,
    },
    profilePic: {
      type: String,
    },
  },
  interests: {
    skills: {
      type: [String],
    },
    learningInterests: {
      type: [String],

    },
  },
  social: {
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    Instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldOfStudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],

  dateUpdated: {
    type: Date,
    default: Date.now,
  },

});

const MenteeProfile = mongoose.model('menteeProfile', MenteeProfileSchema);

module.exports = MenteeProfile;
