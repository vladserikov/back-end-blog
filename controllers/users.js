const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/', async (req, res, next) => {
  const body = req.body;

  if(body.password.length < 3){
    return res.status(401).json({ error: 'min password length 3 char' });
  }

  const saltRound = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRound);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });
  try {
    const saveUser = await user.save();
    res.json(saveUser.toJSON());
  } catch (e) {
    next(e);
  }
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs',{ url: 1, title: 1, author: 1, id: 1 });

  res.json(users.map(u => u.toJSON()));
});

module.exports = userRouter;