const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);

const userShema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
});

userShema.set('toJSON', {
  transform: (document, retObj) => {
    retObj.id = retObj._id;
    delete retObj._id;
    delete retObj.__v;
    delete retObj.passwordHash;
  }
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);