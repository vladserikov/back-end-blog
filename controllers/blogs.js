const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jsw = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const blogList = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });

  res.json(blogList.map(b => b.toJSON()));
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog.toJSON());
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const token = req.token;
  //   console.log(body, req.headers);

  if(!token){
    return res.status(401).json({ error: 'invalid tocken' });
  }
  const decodeToken = jsw.verify(token, process.env.SECRET);

  if(!decodeToken){
    return res.status(401).json({ error: 'invalid tocken' });
  }

  if(!body.title || !body.url){
    return res.status(400).json({ error: 'not url or title' });
  }

  const user = await User.findById(decodeToken.id);

  const newBlog = {
    title: body.title,
    author: body.author || user.name,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  };

  const blog = new Blog(newBlog);
  try {
    const blogAdd = await blog.save();
    user.blogs = user.blogs.concat(blogAdd._id);

    await user.save();
    res.status(200).json(blogAdd.toJSON());
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete('/:id', async (req, res) => {
  const removeBlog = await Blog.findById(req.params.id);
  if(!req.token){
    return res.status(401).json({ error: 'invalid token' });
  }

  const decodeToken = jsw.verify(req.token, process.env.SECRET);

  if(decodeToken.id === removeBlog.user.toString()){
    await Blog.findByIdAndRemove(req.params.id);
    return res.status(204).end();
  }

  return res.status(401).json({ error: 'invalid token' });
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const updateBlog = { ...body };

  const resultUpdate = await Blog.findByIdAndUpdate(req.params.id, updateBlog, { new: true });

  res.json(resultUpdate.toJSON());
});

module.exports = blogsRouter;