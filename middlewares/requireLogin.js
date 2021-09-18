module.exports = (req, res, next) => {
    if (!req.user || !req.user._id) { //?
        return res.status(401).send({ error: 'You must log in!' });
    }

    next();
};