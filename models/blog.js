const mongoose = require('mongoose');


mongoose.set('useFindAndModify', false);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

blogSchema.set('toJSON', {
  transform: (document, retObj) => {
    retObj.id = retObj._id;
    delete retObj._id;
    delete retObj.__v;
  }
});

module.exports = mongoose.model('Blog', blogSchema);