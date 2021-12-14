const mongoose = require('mongoose');
const { Schema } = mongoose;

const forumArticleSchema = new Schema({
    subArticles: [{ type: Schema.Types.ObjectId, ref: 'forumArticles' }],
    created: { type: Date, default: new Date() },
    headline: { type: String, maxlength: 64},
    content: { type: String, maxlength: 512},
    type: String,
    id: Number,
    creatorId: { type: Schema.Types.ObjectId, ref: 'users' },
});

forumArticleSchema.statics.findMax = async function () {
    return this.findOne() // 'this' now refers to the Member class
      .sort('-id')
      .exec();
  }


mongoose.model('forumArticles', forumArticleSchema);