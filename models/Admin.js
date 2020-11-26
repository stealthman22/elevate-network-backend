const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;
