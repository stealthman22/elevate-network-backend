const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Mentee', 'Mentor', 'Partner'],
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model('user', UserSchema);
module.exports = User;
