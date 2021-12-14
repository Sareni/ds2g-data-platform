const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const NewsArticle = mongoose.model('newsArticles');
const ForumArticle = mongoose.model('forumArticles');
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
        const {skip = 0, limit = 10} = req.query; // TODO remove default limit because there is a need for all messages
        let messages =  await NewsArticle.find().sort({ releaseDate: 'desc', id: 'desc' }).skip(parseInt(skip)).limit(parseInt(limit));
        const count = await NewsArticle.find().count();

        res.send({
            messages,
            count
        });
    });

    app.get('/api/forum', async (req, res) => {
        const {skip = 0, limit = 10} = req.query;
        let messages =  await ForumArticle.find({type: 'root'}).sort({ releaseDate: 'desc', id: 'desc' }).skip(parseInt(skip)).limit(parseInt(limit));
        const count = await ForumArticle.find({type: 'root'}).count();

        res.send({
            messages,
            count
        });
    });

    app.get('/api/forum/article', async (req, res) => {
        const {id = 0} = req.query;
        let mainArticle =  await ForumArticle.findOne({ id, type: 'root' }).populate({path: 'subArticles', options: { sort: { 'created': 1 } } });
        if (!mainArticle) {
            res.send();
        }
        const {subArticles} = mainArticle;
        mainArticle.subArticles = undefined; // TODO delete not working?

        res.send({
            mainArticle,
            subArticles
        });
    });

    app.get('/api/messageDetails', requireLogin, async (req, res) => {
        const unreadMessages = await findUnreadMessages(req.user);

        // TODO only relevant for admins? -> Pagination: false!!! da nachrichten gelöscht werden könnten
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

    app.post('/api/forum', requireLogin, async (req, res) => {
        const lastArticle = await ForumArticle.findMax() || { id: 0};
        const lastId = lastArticle.id || 0;
        const newArticle = {
            headline: req.body.headline,
            content: req.body.content,
            id: lastId+1,
            creator: req.user._id,
            type: 'root'
        };


        
        let rootArticle;
        if(req.body.rootId && req.body.rootId > 0) {
            rootArticle = await ForumArticle.findOne({ id: req.body.rootId, type: 'root'});
            if (rootArticle) {
                newArticle.type = 'sub';
            }
        }

        const article = await new ForumArticle(newArticle).save();
        if (rootArticle) {
            // TODO use ObjectId in filter?
            rootArticle.subArticles.push(article._id);
            await rootArticle.save();
        }
        res.redirect('/documentation/forum');
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
