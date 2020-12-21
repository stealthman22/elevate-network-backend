//  require Bro admin object
const AdminBro = require('admin-bro');

// call in express plugin
const AdminBroExpress = require('@admin-bro/express');

// call in mongoose plugin
const AdminBroMongoose = require('@admin-bro/mongoose');
// register mongoose adapter
AdminBro.registerAdapter(AdminBroMongoose);

// call in resources
// const DB = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const MenteeProfile = require('../models/MenteeProfile');
const MentorProfile = require('../models/MentorProfile');
const PartnerProfile = require('../models/PartnerProfile');

// pass resources to admin dashboard
const options = {
  rootPath: '/admin',
  resources: [{ resource: User, options: {} }, Admin, MenteeProfile, MentorProfile, PartnerProfile],
  branding: {
    companyName: 'Elevate Admin',
    softwareBrothers: false,

  },
};

// initialize admin dashboard
const adminBro = new AdminBro(options);

// add database resources

const router = AdminBroExpress.buildRouter(adminBro);
router.use(adminBro.options.rootPath, router);
module.exports = router;
