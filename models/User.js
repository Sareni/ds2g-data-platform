const mongoose = require('mongoose');
const { Schema } = mongoose;

const datasetSchema = new Schema({
    name: { type: String, required: true }
});


const userSchema = new Schema({
    googleId: String,
    username: String,
    passwordHash: String,
    credits: { type: Number, default: 0 },
    accountType: { type: String, default: 'user' },
    readNewsArticles: { type: [Number], default: [] },
    created: { type: Date, default: new Date() },
    emailVerified: { type: Boolean, default: false },
    subAccounts: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    mainAccounts: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    datasets: [datasetSchema]
    /* settings: {

    } */
});

mongoose.model('users', userSchema);