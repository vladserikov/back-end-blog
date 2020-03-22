require('dotenv').config();

let URL = process.env.MONGODB_URI;

if(process.env.NODE_ENV === 'test'){
  URL = process.env.MONGODB_URI_TEST;
}

module.exports = {
  URL
};