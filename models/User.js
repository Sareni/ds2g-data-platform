const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    username: String,
    passwordHash: String,
    credits: { type: Number, default: 0 },
    accountType: { type: String, default: 'user' },
    readNewsArticles: { type: [Number], default: [] },
    created: { type: Date, default: new Date() },
    /* settings: {

    } */
});

mongoose.model('users', userSchema);