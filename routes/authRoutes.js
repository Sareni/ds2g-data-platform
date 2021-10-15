const passport = require('passport');
const mongoose = require('mongoose');
const _ = require('lodash');
const { encrypt } = require('./crypto');
const { getUserDetails } = require('./utils');
const requireLogin = require('../middlewares/requireLogin');
const requireBearerAuthentication = require('../middlewares/requireBearerAuthentication');
const requireClientAuthentication = require('../middlewares/requireClientAuthentication');
const oauth2Service = require('../services/oauth2');
const { ownAuth} = require('../config/ds2g_data_platform_config').authKeys;
const { accountKeyToName } = require('../services/superset');
const { resetPassword, createSubAccounts, changePasswordWithToken, verifyEMail } = require('../services/account');
const requireTypeUser = require('../middlewares/requireTypeUser');
const requireReCaptcha = require('../middlewares/requireReCaptcha');
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
            res.redirect('/dashboard');
        }
    );
    
    app.get(
        '/auth/google/callback',
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/dashboard');
        }
    );


// https://dev-x4orscvo.eu.auth0.com/v2/logout
    app.get('/api/logout/', (req, res) => {
        console.log('logout application:', req.query.application);
        if(!req.query.application) {
            res.redirect('https://superset.ds2g.io/logout');
        } /* else if(req.params.application === 'superset') {
            res.redirect('https://nifi.ds2g.io/logout');
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

    app.post('/auth/signup',  requireReCaptcha, passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: {
            type: 'error',
            message: 'E-Mail bereits vergeben.'
        },
        successFlash: { // TODO remove or show in FE?
            type: 'info',
            message: 'Registrierung erfolgreich.'
        }
    }));

    app.post('/auth/login', requireReCaptcha, /* (req, res, next) => {setTimeout(next, 6000)}, */ passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        }
    ));

    app.post('/auth/resetpassword', requireReCaptcha, async(req, res) => {
        const { email } = req.body;
        resetPassword(email); // await is not necessary
        res.redirect(`/resetpasswordinfo?email=${email}`);
    });


    app.post('/auth/changepassword', requireReCaptcha, async(req, res) => {
        const { token, password } = req.body;
        const result = await changePasswordWithToken(token, password);
        
        res.redirect(`/newpasswordinfo?success=${result}`);
    });

    app.get('/api/verifyemail', async(req, res) => {
        const { token } = req.query;
        const result = await verifyEMail(token);
        
        res.redirect(`/verifyemailinfo?success=${result}`);
    });

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
        
        let checkedRedirectURI = redirect_uri;
        if (checkedRedirectURI.startsWith('http://')) {
            checkedRedirectURI = `https://${checkedRedirectURI.slice(7)}`;
        }

        const code = await oauth2Service.createNewCode(client_id, checkedRedirectURI, req.user._id);
        res.redirect(`${checkedRedirectURI}?code=${code.value}&state=${state}`);
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

        const responseObject = {
            'username': user.username,
            'email': user.username // TODO real email
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(responseObject));
    });
}