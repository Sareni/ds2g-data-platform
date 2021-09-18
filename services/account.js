const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMailToken = mongoose.model('emailtokens');
const User = mongoose.model('users');

const { uid } = require('../routes/utils');
const { sendPasswordResetMail } = require('./mail');

async function resetPassword(email) {
    // TODO verify that argument is a valid email
    const existingUser = await User.findOne({ username: email });

    if (!existingUser) {
        return;
    }

    const token = await new EMailToken({
        value: uid(64),
        email,
        valid: true,
    }).save();
    
    await sendPasswordResetMail(email, token.value);
}

async function verifyEMail() {

}

async function changePasswordWithToken(token, password) {
    const existingToken = await EMailToken.findOne({ value: token }).exec();;
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
    // existingUser.passwordHash = bcrypt.hashSync(password, 10);
    await existingUser.save();

    existingToken.valid = false;
    await existingToken.save();

    return true;
}


module.exports = {
    resetPassword,
    changePasswordWithToken,
    verifyEMail
}