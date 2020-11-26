const express = require('express');
const profileRouter = express.Router();

profileRouter.use('/', require('./menteeProfile'));
profileRouter.use('/', require('./mentorProfile'));
profileRouter.use('/', require('./partnerProfile'));



module.exports = profileRouter;