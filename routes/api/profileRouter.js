const express = require('express');

const profileRouter = express.Router();

profileRouter.use('/', require('./menteeProfile'));
profileRouter.use('/', require('./mentPartProfile'));

module.exports = profileRouter;
