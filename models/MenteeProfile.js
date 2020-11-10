const mongoose = require('mongoose');

const MenteeProfileSchema = new mongoose.Schema({
    user: {
        // create a reference to the user schema
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    Bio : {
        fullName: {
            type: String,
            required: true
        },
        age: {
            // hide from front-end
            type: String,
            required:true
        },
        email: {
            type: String,
            required: true
        },
        aboutMe: {
            type: String,
            required:true
        },
        location: {
            type: String,
            required: true
        },
        DOB: {
            // be sure how to represent this in mongoDb
            type: Date,
            required: true
        }
    },
        education: [
            {
                school: {
                    type: String,
                    required: true
                },
                location: {
                    type: String,
                    required: true
                },
                degree: {
                    type: String,
                    required: true
                },
                fieldOfStudy: {
                    type: String,
                    required: true
                },
                from: {
                    type: Date,
                    required: true
                },
                to: {
                    type: Date
                },
                current: {
                    type: Boolean,
                    default: false
                },
                description: {
                    type: String
                },
            }
        ],
        interests: {
            skills: {
                type: [String],
            },
            learningInterests: {
            type: [String],
            required: true,
            }
        },

        date: {
            type: Date,
            default: Date.now
        }

})

module.exports = MenteeProfile = mongoose.model('menteeProfile', MentorProfileSchema);