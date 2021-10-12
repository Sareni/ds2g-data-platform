module.exports = (req, res, next) => {
    if (!req.user || !req.user.accountType || (req.user.accountType !== 'user' && req.user.accountType !== 'admin')) { //?
        return res.status(401).send({ error: 'Your account don\'t have permission to do that!' });
    }

    next();
};