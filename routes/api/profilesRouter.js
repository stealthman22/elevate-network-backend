const express = require('express');
const profilesRouter = express.Router();

profilesRouter.use('/', require('./menteeProfile'));
profilesRouter.use('/', require('./mentorProfile'));
profilesRouter.use('/', require('./partnerProfile'));



module.exports = profilesRouter;