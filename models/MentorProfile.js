const mongoose = require('mongoose');

const MentorProfileSchema = new mongoose.Schema({
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
      // hide from front-end
      type: String,
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
      type: Date,
    },
  },
  interests: {
    skills: {
      type: [String],
    },
    teachingInterests: {
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
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
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

const MentorProfile = mongoose.model('mentorProfile', MentorProfileSchema);
module.exports = MentorProfile;
