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

// pass resources to admin dashboard
const options = {
  rootPath: '/admin',
  resources: [User, {
    resource: Admin,

  }],
  branding: {
    companyName: 'Elevate Admin',
  },
};

// initialize admin dashboard
const adminBro = new AdminBro(options);

// add database resources

const router = AdminBroExpress.buildRouter(adminBro);
router.use(adminBro.options.rootPath, router);
module.exports = router;
