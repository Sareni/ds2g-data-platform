const requireReCaptcha = require('../middlewares/requireReCaptcha');
const { sendSupportFormMail } = require('../services/mail');

module.exports = (app) => {
    app.post('/api/support', requireReCaptcha, async (req, res) => {
        const { email, name, message } = req.body;
        await sendSupportFormMail(email, name, message);
        res.redirect(`/supportinfo?email=${email}`);
    });
}