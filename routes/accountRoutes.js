const { getUserDetails } = require('./utils');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const _ = require('lodash');
const { createSubAccount, removeAccount } = require('../services/account');
const requireTypeUser = require('../middlewares/requireTypeUser');
const User = mongoose.model('users');


module.exports = (app) => {
    app.get('/api/accountDetails', requireLogin, async (req, res) => {
        const details = await getUserDetails(req.user._id);
        res.send([
            {
                title: 'Account-Key',
                value: details.account
            },
            {
                title: 'Plantyp',
                value: details.plan
            }
        ]);
    });

    app.post('/api/subaccount', requireLogin, requireTypeUser, async(req, res) => {
        const { email: subAccountEmail, role: subAccountRole } = req.body;
        const { account: accountKey } = await getUserDetails(req.user._id);
        const mainAccountId = req.user._id;

        const result = await createSubAccount(mainAccountId, subAccountEmail, subAccountRole, accountKey);

        if (result.created && result.created.length > 0) {
            console.log(result.created);
            req.flash('info', result.created);
        }
        if (result.errors && result.errors.length > 0) {
            console.log(result.errors);
            req.flash('error', result.errors);
        }
        res.redirect(`/preferences`);
    });

    app.put('/api/subaccount', requireLogin, requireTypeUser, async(req, res) => {
        const { email, role } = req.body;
        const existingSubUser = await User.findOne({ username: email });
        if(!existingSubUser) {
            console.log('user not found');
        }

        const existingMainUser = await User.findById(req.user._id);

        if(!existingMainUser.subAccounts || !existingMainUser.subAccounts.includes(existingSubUser._id)) {
            console.log('subAccount nicht gefunden!', req.user);
        }

        existingSubUser.accountType = role;
        await existingSubUser.save();

        res.send();
    });

    app.delete('/api/subaccount/:email', requireLogin, requireTypeUser, async(req, res) => {
        const { email } = req.params;
        const existingSubUser = await User.findOne({ username: email });
        if(!existingSubUser) {
            console.log('user not found');
        }

        const existingMainUser = await User.findById(req.user._id);

        if(!existingMainUser.subAccounts || !existingMainUser.subAccounts.includes(existingSubUser._id)) {
            console.log('subAccount nicht gefunden!', req.user);
        }

        await removeAccount(existingSubUser);

        res.send();
    });

}