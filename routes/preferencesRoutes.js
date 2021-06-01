const passport = require('passport');
const mongoose = require('mongoose');
const _ = require('lodash');
const { encrypt } = require('./crypto');
const { getUserDetails } = require('./utils');
const requireLogin = require('../middlewares/requireLogin');
const requireBearerAuthentication = require('../middlewares/requireBearerAuthentication');
const requireClientAuthentication = require('../middlewares/requireClientAuthentication');
const oauth2Service = require('../services/oauth2.js');
const keys = require('../config/keys');
const { accountKeyToName } = require('../services/superset');
const User = mongoose.model('users');
module.exports = (app) => {
    app.post('/api/preferences', (req, res) => {

        if (req.body.cbDemoData && req.body.cbDemoData === 'on') {
            // activate Demo Data in Superset
        } else {
            // deactivate Demo Data in Superset
        }

        if (req.body.cbTrackinatorData && req.body.cbTrackinatorData === 'on') {
            // activate Trackinator Data in Superset
        } else {
            // deactivate Trackinator Data in Superset
        }
        res.end();
    });
}