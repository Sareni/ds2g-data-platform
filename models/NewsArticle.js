const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsArticleSchema = new Schema({
    id: Number,
    releaseDate: Date,
    content: String
});

newsArticleSchema.statics.findMax = async function () {
    return this.findOne() // 'this' now refers to the Member class
      .sort('-id')
      .exec();
  }

mongoose.model('newsArticles', newsArticleSchema);