const mongoose = require('mongoose');
const { Schema } = mongoose;

const eMailTokenSchema = new Schema({
    value: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: Date, default: new Date() },
    valid: { type: Boolean }
});

mongoose.model('emailtokens', eMailTokenSchema);