const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMailToken = mongoose.model('emailtokens');
const User = mongoose.model('users');

const { uid } = require('../routes/utils');
const { sendPasswordResetMail, sendSubAccountInviteMail } = require('./mail');

const { initUserInSuperset, DEMO_CONTENT_TYPES } = require('./superset');

async function resetPassword(email) {
    // TODO verify that argument is a valid email
    const existingUser = await User.findOne({ username: email });

    if (!existingUser) {
        return;
    }

    const token = await new EMailToken({
        value: uid(128),
        email,
        valid: true,
    }).save();
    
    await sendPasswordResetMail(email, token.value);
}

async function removeAccountById(id) {
    const account = await User.findById(id);
    await removeAccount(account);
}

async function removeAccount(account) {
    // TODO performance, update many
    if(account.mainAccounts && account.mainAccounts.length > 0) {
        for(const mainAccountId of account.mainAccounts) {
            const user = await User.findById(mainAccountId);
            const index = user.subAccounts.indexOf(account._id);
            if (index > -1) {
                user.subAccounts.splice(index, 1);
                await user.save();
            }
        }
    }

    if(account.subAccounts && account.subAccounts.length > 0) {
        await removeSubAccounts(account.subAccounts)
    }
    await User.deleteOne({ _id: account._id});
}

async function removeSubAccounts(subAccountIds) {
    const subAccounts = await User.find({ _id: {$in: subAccountIds}});
    const onlySubAccountIdsList = subAccounts.filter((subAcc) => { return !subAcc.subAccounts || subAcc.subAccounts.length === 0 }).map((subAcc) => subAcc._id);
    const mainSubAccountIdsList = subAccounts.filter((subAcc) => { return subAcc.subAccounts && subAcc.subAccounts.length > 0 }).map((subAcc) => subAcc._id);
    await User.deleteMany({ _id: {$in: onlySubAccountIdsList}});
    if(mainSubAccountIdsList.length > 0) {
        await removeSubAccounts(mainSubAccountIdsList);
    }

}

async function inviteSubAccount(mainEmail, email) {
    // TODO verify that argument is a valid email
    const existingUser = await User.findOne({ username: email });

    // TODO Why?
    if (!existingUser) {
        return;
    }

    const token = await new EMailToken({
        value: uid(64),
        email,
        valid: true,
    }).save();
    
    await sendSubAccountInviteMail(mainEmail, email, token.value);
}

async function createSubAccount(mainUserId, subAccountEmail, subAccountRole, accountKey) {
    // TODO subaccounts limitieren
    // TODO subaccounts löschen wenn die Einladung nicht innerhalb von X Tagen angenommen wird.

    const mainUser = await User.findById(mainUserId);
    if(!mainUser.subAccounts) {
        mainUser.subAccounts = [];
    }

    const existingUser = await User.findOne({ username: subAccountEmail });
    if (existingUser) {
        return {type: 'error', errors: ['Account kann nicht hinzugefügt werden, da dieser bereits vorhanden ist!']}
    }

    const newUser = await User.create({
        username: subAccountEmail,
        accountType: subAccountRole,
        mainAccounts: [mainUser._id],
        passwordHash: bcrypt.hashSync(uid(32), 10),
        });
    
    mainUser.subAccounts.push(newUser._id);
    
    initUserInSuperset(accountKey, subAccountEmail, subAccountRole, mainUser.username);
    await inviteSubAccount(mainUser.username, subAccountEmail);
    
    await mainUser.save();
    return {type: 'created', created: ['Account wurde eingeladen!']};
}

async function verifyEMail(token) {
    const existingToken = await EMailToken.findOne({ value: token }).exec();
    const lifetimeInMinutes = 10;

    if (!existingToken) {
        console.log('no token');
        return false; // TODO exception
    }

    // TODO info if email is already validated
    const existingUser = await User.findOne({ username: existingToken.email });
    if (existingUser.emailVerified) {
        existingToken.valid = false;
        await existingToken.save();
        return false;
    }

    if (new Date(existingToken.created.getTime() + lifetimeInMinutes*60000) < new Date()) {
        console.log('token outdated: ', new Date(existingToken.created.getTime() + lifetimeInMinutes*60000), new Date());
        return false; // TODO exception
    }

    if (!existingToken.valid) {
        console.log('token invalid');
        return false; // TODO exception
    }
    
    existingUser.emailVerified = true;
    await existingUser.save();

    existingToken.valid = false;
    await existingToken.save();

    return true;
}

async function changePasswordWithToken(token, password) {
    const existingToken = await EMailToken.findOne({ value: token }).exec();
    const lifetimeInMinutes = 5;

    if (!existingToken) {
        console.log('no token');
        return false; // TODO exception
    }

    if (new Date(existingToken.created.getTime() + lifetimeInMinutes*60000) < new Date()) {
        console.log('token outdated: ', new Date(existingToken.created.getTime() + lifetimeInMinutes*60000), new Date());
        return false; // TODO exception
    }

    if (!existingToken.valid) {
        console.log('token invalid');
        return false; // TODO exception
    }

    const existingUser = await User.findOne({ username: existingToken.email });
    existingUser.passwordHash = bcrypt.hashSync(password, 10);
    existingUser.emailVerified = true;
    await existingUser.save();

    existingToken.valid = false;
    await existingToken.save();

    return true;
}


module.exports = {
    resetPassword,
    changePasswordWithToken,
    verifyEMail,
    createSubAccount,
    removeAccount,
    removeAccountById
}