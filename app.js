const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogs');

mongoose.connect(config.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('conect BD');
  })
  .catch(err => {
    console.error(err.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);

module.exports = app;