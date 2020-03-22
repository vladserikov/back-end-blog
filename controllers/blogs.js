const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogList = await Blog.find({});

  res.json(blogList.map(b => b.toJSON()));
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog.toJSON());
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  if(!body.title || !body.url){
    return res.status(400).end();
  }
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const blog = new Blog(newBlog);

  const blogAdd = await blog.save();

  res.status(200).json(blogAdd.toJSON());
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);

  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  const updateBlog = { ...body };

  const resultUpdate = await Blog.findByIdAndUpdate(req.params.id, updateBlog, { new: true });

  res.json(resultUpdate.toJSON());
});

module.exports = blogsRouter;