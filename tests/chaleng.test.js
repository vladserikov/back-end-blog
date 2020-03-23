const listHelper = require('../utils/list_helper');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogLists = await listHelper.inititalBlogs.map(b => new Blog(b));
  const allPromis = await blogLists.map(b => b.save());
  await Promise.all(allPromis);
});

test('should dummy returns one', () => {
  const blog = [];

  const result = listHelper.dummy(blog);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([listHelper.listWithOneBlog]);
    expect(result).toBe(5);
  });

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('should of bigger list is calculate right', () => {
    const result = listHelper.totalLikes(listHelper.inititalBlogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('should return blog whith max likes', () => {
    const result = listHelper.favoriteBlog(listHelper.inititalBlogs);

    expect(result).toEqual(listHelper.inititalBlogs[2]);
  });

});

describe('api test', () => {
  test('should return all blogs list', async () => {
    const blogs = await listHelper.getBlogs();

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(blogs.length).toBe(listHelper.inititalBlogs.length);
  });

  test('should define id', async () => {
    const blogs = await listHelper.getBlogs();

    expect(blogs[0].id).toBeDefined();
  });

  test('should added blog in db', async () => {
    const newBlog = listHelper.listWithOneBlog;
    const blogsStart = await listHelper.getBlogs();

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsEnd = await listHelper.getBlogs();

    expect(blogsEnd.length).toBe(blogsStart.length + 1);
  });

  test('should add zerro likes if not has obj', async () => {
    const newBlog = {
      author: 'Limon Add',
      title: 'Besii',
      url: 'licalgos'
    };

    const returnBlog = await api
      .post('/api/blogs')
      .send(newBlog);

    expect(returnBlog.body.likes).toBe(0);
  });

  test('should return status 400 if not title and url', async () => {
    const blogsBefore = await listHelper.getBlogs();
    const newBlog = {
      author: 'Lewan Grong'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAfter = await listHelper.getBlogs();

    expect(blogsAfter.length).toBe(blogsBefore.length);
  });

  test('should delete element', async () => {
    const blogsBefore = await listHelper.getBlogs();
    const blog = blogsBefore[0];

    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(204);

    const blogsAfter = await listHelper.getBlogs();

    expect(blogsAfter.length).toBe(blogsBefore.length - 1);
  });

  test('should update likes ', async () => {
    const blogsBefore = await listHelper.getBlogs();
    const blog = blogsBefore[0];

    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    await api
      .put(`/api/blogs/${blog.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const result = await listHelper.getBlogs();

    expect(result[0].likes).toBe(blog.likes + 1);
  });

});

describe('user chack', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const newUser = new User({ username: 'root', password: 'secret' });
    await newUser.save();
  });

  test('should add user in db', () => {

  });

});



afterAll(() => {
  mongoose.connection.close();
});