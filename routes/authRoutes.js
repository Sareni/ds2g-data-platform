const passport = require('passport');
const mongoose = require('mongoose');
const _ = require('lodash');
const { encrypt } = require('./crypto');
const { getUserDetails } = require('./utils');
const requireLogin = require('../middlewares/requireLogin');
const requireBearerAuthentication = require('../middlewares/requireBearerAuthentication');
const requireClientAuthentication = require('../middlewares/requireClientAuthentication');
const oauth2Service = require('../services/oauth2.js');
const { ownAuth} = require('../config/ds2g_data_platform_config').authKeys;
const { accountKeyToName } = require('../services/superset');
const User = mongoose.model('users');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/auth0', passport.authenticate('auth0', {
        scope: 'openid email profile'
    }));

    app.get(
        '/auth/auth0/callback',
        passport.authenticate('auth0'),
        (req, res) => {
            res.redirect('/account');
        }
    );
    
    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/account');
        }
    );


// https://dev-x4orscvo.eu.auth0.com/v2/logout
    app.get('/api/logout/', (req, res) => {
        console.log('logout application:', req.query.application);
        if(!req.query.application) {
            res.redirect('http://superset.ds2g.io/logout');
        } /* else if(req.params.application === 'superset') {
            res.redirect('http://nifi.ds2g.io/logout');
        } */ else {
            req.logout();
            res.redirect('/');
        }
    });

    app.get('/api/current_user', async (req, res) => {
        if (req.user && req.user._id) {
            return res.send(req.user);
        }
        res.send();
    });

    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: {
            type: 'messageFailure',
            message: 'Email already taken.'
        },
        successFlash: {
            type: 'messageSuccess',
            message: 'Successfully signed up.'
        }
    }));

    app.post('/auth/login', passport.authenticate('local', {
            successRedirect: '/account',
            failureRedirect: '/login',
            failureFlash: true
        }
    ));


    app.get('/api/oauth2/authorize', requireLogin, async (req, res) => {
        const { response_type, client_id, redirect_uri, scope, state, nonce} = req.query;

        if (client_id !== ownAuth.clientID) {
            res.status(404).end('Client ID not found!');
            return;
        }
        if (response_type !== 'code') {
            res.status(404).end('Response Type not found!');
            return;
        }

        const code = await oauth2Service.createNewCode(client_id, redirect_uri, req.user._id);
        res.redirect(`${redirect_uri}?code=${code.value}&state=${state}`);
    });

    app.post('/api/oauth2/token', requireClientAuthentication, async (req, res) => {
        const responseObject = await oauth2Service.exchangeCodeForToken(req.body.code, req.user.client_id);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(responseObject));
    });

    app.get('/api/userinfo', requireBearerAuthentication, async (req, res) => {
        const user = await User.findOne({_id: req.user.userId});
        if(!user) {
            res.status(404).end('User not found!');
            return;
        }

        const { account } = await getUserDetails(req.user.userId);

        const responseObject = {
            'username': accountKeyToName(account),
            'email': accountKeyToName(account)
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(responseObject));
    });
}