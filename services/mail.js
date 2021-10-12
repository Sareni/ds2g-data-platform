const nodemailer = require('nodemailer');
const { mail: config } = require('../config/ds2g_data_platform_config');


const noreplyTransporter = nodemailer.createTransport({
    host: config.noreply.host,
    port: config.noreply.port,
    auth: {
        user: config.noreply.user,
        pass: config.noreply.password
    },
});

const supportTransporter = nodemailer.createTransport({
    host: config.support.host,
    port: config.support.port,
    auth: {
        user: config.support.user,
        pass: config.support.password
    },
});

async function sendMail(transporter, options) {
    try {
        await transporter.sendMail(options); // const info = 
    } catch (e) {
        console.log('mail error: ', e);
    }
}

async function sendVerificationMail(email, token) {
    const from = 'noreply@ds2g.io';
    const subject = 'eMail verifizieren';
    const content = `Bitte verifizieren Sie Ihre e-Mail-Adresse indem Sie auf folgenen Link klicken: https://dataplatform.ds2g.io/api/verifyemail?token=${token}`;

    const mailOptions = {
        from,
        to: email,
        subject,
        text: content
    }
    await sendMail(noreplyTransporter, mailOptions);
}

async function sendPasswordResetMail(email, token) {
    const from = 'noreply@ds2g.io';
    const subject = `Passwort zurücksetzen`;
    const content = `Link zum Zurücksetzen Ihres Passworte: https://dataplatform.ds2g.io/newpassword?token=${token}`; // TODO <a href=https://dataplatform.ds2g.io/newpassword?token=${token}`>Passwort zurücksetzen</a>

    const mailOptions = {
        from,
        to: email,
        subject,
        text: content
    }
    await sendMail(noreplyTransporter, mailOptions);
}

async function sendSubAccountInviteMail(mainEmail, email, token) {
    const from = 'noreply@ds2g.io';
    const subject = `Einlandung zur DS2G Dataplatform`;
    const content = `Sie wurden von ${mainEmail} zu seiner DS2G Dataplatform eingeladen. Link zum Anlegen eines Passwortes: https://dataplatform.ds2g.io/newpassword?token=${token}`; // TODO <a href=https://dataplatform.ds2g.io/newpassword?token=${token}`>Passwort zurücksetzen</a>

    const mailOptions = {
        from,
        to: email,
        subject,
        text: content
    }
    await sendMail(noreplyTransporter, mailOptions);
}

async function sendSupportFormMail(email, name, message) {
    const from = 'support@ds2g.io';
    const to   = 'support@ds2g.io';

    // TODO verify email, special characters

    const subject = `Supportanfrage von ${email}`;
    const text = `${name}(${email}) schreibt:\n\n${message}`

    const mailOptions = {
        from,
        to,
        subject,
        text
    }
    await sendMail(supportTransporter, mailOptions);
}



module.exports = {
    sendVerificationMail,
    sendPasswordResetMail,
    sendSubAccountInviteMail,
    sendSupportFormMail
}