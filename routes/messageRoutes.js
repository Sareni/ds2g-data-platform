const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const NewsArticle = mongoose.model('newsArticles');
const User = mongoose.model('users');

async function findUnreadMessages(user) {
    const { readNewsArticles = [], created } = user;
    return NewsArticle.find({ id: { $nin: readNewsArticles }, releaseDate: { $gte: created }, releaseDate: { $lte: new Date() } }).sort({ releaseDate: 'desc', id: 'desc' }); // , releaseDate: { $gte: created }
}

async function findSharedAccounts(user) {
    const {subAccounts} = await User.findById(user._id, { subAccounts: 1}).populate('subAccounts').exec();
    return subAccounts.map(subAccount => ({
        email: subAccount.username,
        role: subAccount.accountType
    }));
}

module.exports = (app) => {
    app.get('/api/messages', async (req, res) => {
        const messages = await NewsArticle.find().sort({ releaseDate: 'desc', id: 'desc' });

        res.send({
            messages
        });
    });

    app.get('/api/messageDetails', requireLogin, async (req, res) => {
        const unreadMessages = await findUnreadMessages(req.user);

        // TODO only relevant for admins?
        const lastMessage = await NewsArticle.findMax();
        const messageCount = lastMessage ? lastMessage.id + 1 : 1;

        res.send({
            unreadMessages,
            messageCount,
        });
    });

    app.post('/api/message', requireLogin, async (req, res) => {
        const msg = await new NewsArticle(req.body).save();
        res.redirect('/preferences');
    });

    app.post('/api/messageRead', requireLogin, async (req, res) => {
        req.user.readNewsArticles.push(req.body.id);
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { readNewsArticles: req.user.readNewsArticles });
        res.send(user);
    });

    app.get('/api/flashMessages', (req, res) => {  
        res.send(req.flash());
    });

    app.get('/api/shareDetails', async (req, res) => {  
        const sharedAccounts = await findSharedAccounts(req.user);
        res.send(sharedAccounts);
    });
}
