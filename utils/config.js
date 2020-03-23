require('dotenv').config();

let URL = process.env.MONGODB_URI;
let PORT = process.env.PORT;
if(process.env.NODE_ENV === 'test'){
  URL = process.env.MONGODB_URI_TEST;
}

module.exports = {
  URL, PORT
};