//  require main admin object
const AdminMain = require('admin-bro');

// call in express plugin
const AdminMainExpress = require('@admin-bro/express');

// call in mongoose plugin
const AdminMainMongoose = require('@admin-bro/mongoose');
// register mongoose adapter
AdminMain.registerAdapter(AdminMainMongoose);

// call in resources
const User = require('../../models/User');
const Admin = require('../../models/Admin');

// pass resources to admin dashboard
const AdminMainOptions = {
  resources: [User, {
    resource: Admin,
  }],
};

// initialize admin dashboard
const adminDashboard = new AdminMain({
  databases: [],
  rootPath: '/admin',
});

// add database resources

const router = AdminMainExpress.buildRouter(adminDashboard);
router.use(adminDashboard.options.rootPath, router);
module.exports = router;
